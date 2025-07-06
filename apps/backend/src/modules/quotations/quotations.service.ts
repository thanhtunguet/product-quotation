import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotations, QuotationItems } from '../../entities';

export interface QuotationItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface CreateQuotationDto {
  quotationNumber: string;
  customerName: string;
  companyName?: string;
  phoneNumber: string;
  quotationDate: string;
  validUntil?: string;
  status?: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  notes?: string;
  items: QuotationItemDto[];
}

export interface UpdateQuotationDto {
  quotationNumber?: string;
  customerName?: string;
  companyName?: string;
  phoneNumber?: string;
  quotationDate?: string;
  validUntil?: string;
  status?: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  notes?: string;
  items?: QuotationItemDto[];
}

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(Quotations)
    private readonly quotationRepository: Repository<Quotations>,
    @InjectRepository(QuotationItems)
    private readonly quotationItemRepository: Repository<QuotationItems>,
  ) {}

  async create(createQuotationDto: CreateQuotationDto): Promise<Quotations> {
    const { items, ...quotationData } = createQuotationDto;
    
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    // Create quotation
    const quotation = this.quotationRepository.create({
      ...quotationData,
      totalAmount: totalAmount.toString(),
    });
    
    const savedQuotation = await this.quotationRepository.save(quotation);

    // Create quotation items
    if (items && items.length > 0) {
      await this.saveQuotationItems(savedQuotation.id, items);
    }

    return this.findOne(savedQuotation.id);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ quotations: Quotations[]; total: number }> {
    const [quotations, total] = await this.quotationRepository.findAndCount({
      where: { deletedAt: null },
      relations: ['quotationItems', 'quotationItems.product'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { quotations, total };
  }

  async findOne(id: number): Promise<Quotations> {
    const quotation = await this.quotationRepository.findOne({
      where: { id, deletedAt: null },
      relations: [
        'quotationItems',
        'quotationItems.product',
        'quotationItems.product.category',
        'quotationItems.product.brand',
        'quotationItems.product.manufacturer',
      ],
    });
    
    if (!quotation) {
      throw new NotFoundException(`Quotation with ID ${id} not found`);
    }
    
    return quotation;
  }

  async update(id: number, updateQuotationDto: UpdateQuotationDto): Promise<Quotations> {
    const { items, ...quotationData } = updateQuotationDto;
    
    const quotation = await this.quotationRepository.findOne({
      where: { id, deletedAt: null },
    });
    
    if (!quotation) {
      throw new NotFoundException(`Quotation with ID ${id} not found`);
    }

    // Calculate total amount if items are provided
    let totalAmount = quotation.totalAmount;
    if (items !== undefined) {
      totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toString();
    }

    // Update quotation
    Object.assign(quotation, {
      ...quotationData,
      totalAmount,
    });
    
    await this.quotationRepository.save(quotation);

    // Handle quotation items
    if (items !== undefined) {
      // Remove existing items
      await this.quotationItemRepository.delete({ quotationId: id });
      
      // Add new items
      if (items.length > 0) {
        await this.saveQuotationItems(id, items);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const quotation = await this.quotationRepository.findOne({
      where: { id, deletedAt: null },
    });
    
    if (!quotation) {
      throw new NotFoundException(`Quotation with ID ${id} not found`);
    }
    
    await this.quotationRepository.softDelete(id);
  }

  async findByQuotationNumber(quotationNumber: string): Promise<Quotations | null> {
    return await this.quotationRepository.findOne({
      where: { quotationNumber, deletedAt: null },
      relations: [
        'quotationItems',
        'quotationItems.product',
        'quotationItems.product.category',
        'quotationItems.product.brand',
        'quotationItems.product.manufacturer',
      ],
    });
  }

  async search(
    term: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ quotations: Quotations[]; total: number }> {
    const queryBuilder = this.quotationRepository
      .createQueryBuilder('quotation')
      .leftJoinAndSelect('quotation.quotationItems', 'quotationItems')
      .leftJoinAndSelect('quotationItems.product', 'product')
      .where('quotation.deletedAt IS NULL')
      .andWhere(
        '(quotation.quotationNumber LIKE :term OR quotation.customerName LIKE :term OR quotation.companyName LIKE :term OR quotation.phoneNumber LIKE :term)',
        { term: `%${term}%` },
      )
      .orderBy('quotation.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [quotations, total] = await queryBuilder.getManyAndCount();

    return { quotations, total };
  }

  async findByStatus(
    status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED',
    page: number = 1,
    limit: number = 10,
  ): Promise<{ quotations: Quotations[]; total: number }> {
    const [quotations, total] = await this.quotationRepository.findAndCount({
      where: { status, deletedAt: null },
      relations: ['quotationItems', 'quotationItems.product'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { quotations, total };
  }

  async findByCustomer(
    customerName: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ quotations: Quotations[]; total: number }> {
    const [quotations, total] = await this.quotationRepository.findAndCount({
      where: { customerName, deletedAt: null },
      relations: ['quotationItems', 'quotationItems.product'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { quotations, total };
  }

  async updateStatus(id: number, status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'): Promise<Quotations> {
    const quotation = await this.quotationRepository.findOne({
      where: { id, deletedAt: null },
    });
    
    if (!quotation) {
      throw new NotFoundException(`Quotation with ID ${id} not found`);
    }

    quotation.status = status;
    await this.quotationRepository.save(quotation);

    return this.findOne(id);
  }

  async generateQuotationNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const prefix = `QT${year}${month}${day}`;
    
    // Find the last quotation number with this prefix
    const lastQuotation = await this.quotationRepository
      .createQueryBuilder('quotation')
      .where('quotation.quotationNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('quotation.quotationNumber', 'DESC')
      .getOne();
    
    let sequence = 1;
    if (lastQuotation) {
      const lastSequence = parseInt(lastQuotation.quotationNumber.slice(-3));
      sequence = lastSequence + 1;
    }
    
    return `${prefix}${String(sequence).padStart(3, '0')}`;
  }

  private async saveQuotationItems(
    quotationId: number,
    items: QuotationItemDto[],
  ): Promise<void> {
    const quotationItemEntities = items.map((item) => {
      const totalPrice = (item.quantity * item.unitPrice).toString();
      return this.quotationItemRepository.create({
        quotationId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        totalPrice,
        notes: item.notes,
      });
    });

    await this.quotationItemRepository.save(quotationItemEntities);
  }
}