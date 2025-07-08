// Local Storage Service for offline data persistence
import { Quotation, CreateQuotationDto, QuotationStatus } from './api-client';

const STORAGE_KEYS = {
  QUOTATIONS: 'product-quotation-quotations',
  QUOTATION_COUNTER: 'product-quotation-counter',
} as const;

export class LocalStorageService {
  // Quotation methods
  static getQuotations(): Quotation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading quotations from localStorage:', error);
      return [];
    }
  }

  static saveQuotations(quotations: Quotation[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
    } catch (error) {
      console.error('Error saving quotations to localStorage:', error);
    }
  }

  static getNextQuotationNumber(): string {
    try {
      const counter = localStorage.getItem(STORAGE_KEYS.QUOTATION_COUNTER);
      const nextNumber = counter ? parseInt(counter, 10) + 1 : 1;
      localStorage.setItem(STORAGE_KEYS.QUOTATION_COUNTER, nextNumber.toString());
      return `QT${String(nextNumber).padStart(6, '0')}`;
    } catch (error) {
      console.error('Error generating quotation number:', error);
      return `QT${String(Date.now()).slice(-6)}`;
    }
  }

  static createQuotation(data: CreateQuotationDto): Quotation {
    const quotations = this.getQuotations();
    const newId = Math.max(0, ...quotations.map(q => q.id)) + 1;
    const now = new Date().toISOString();

    const newQuotation: Quotation = {
      id: newId,
      quotationNumber: data.quotationNumber || this.getNextQuotationNumber(),
      customerName: data.customerName,
      companyName: data.companyName,
      phoneNumber: data.phoneNumber,
      quotationDate: data.quotationDate,
      validUntil: data.validUntil,
      status: QuotationStatus.DRAFT,
      totalAmount: data.items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0),
      notes: data.notes,
      quotationItems: data.items.map((item, index) => ({
        id: index + 1,
        quotationId: newId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
        notes: item.notes,
        product: {
          id: item.productId,
          name: `Product ${item.productId}`,
          code: `P${String(item.productId).padStart(4, '0')}`,
          sku: `SKU${item.productId}`,
          categoryId: 1,
          basePrice: item.unitPrice.toString(),
          isActive: true,
          category: {
            id: 1,
            name: 'General',
            code: 'GEN',
            isActive: true,
            children: [],
            createdAt: now,
            updatedAt: now,
          },
          dynamicAttributes: [],
          createdAt: now,
          updatedAt: now,
        },
        createdAt: now,
        updatedAt: now,
      })),
      createdAt: now,
      updatedAt: now,
    };

    quotations.push(newQuotation);
    this.saveQuotations(quotations);
    return newQuotation;
  }

  static updateQuotation(id: number, data: Partial<CreateQuotationDto>): Quotation | null {
    const quotations = this.getQuotations();
    const index = quotations.findIndex(q => q.id === id);
    
    if (index === -1) {
      return null;
    }

    const existing = quotations[index];
    const now = new Date().toISOString();

    // Update basic fields
    if (data.customerName !== undefined) existing.customerName = data.customerName;
    if (data.companyName !== undefined) existing.companyName = data.companyName;
    if (data.phoneNumber !== undefined) existing.phoneNumber = data.phoneNumber;
    if (data.quotationDate !== undefined) existing.quotationDate = data.quotationDate;
    if (data.validUntil !== undefined) existing.validUntil = data.validUntil;
    if (data.notes !== undefined) existing.notes = data.notes;

    // Update items if provided
    if (data.items) {
      existing.quotationItems = data.items.map((item, index) => ({
        id: index + 1,
        quotationId: id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
        notes: item.notes,
        product: {
          id: item.productId,
          name: `Product ${item.productId}`,
          code: `P${String(item.productId).padStart(4, '0')}`,
          sku: `SKU${item.productId}`,
          categoryId: 1,
          basePrice: item.unitPrice.toString(),
          isActive: true,
          category: {
            id: 1,
            name: 'General',
            code: 'GEN',
            isActive: true,
            children: [],
            createdAt: now,
            updatedAt: now,
          },
          dynamicAttributes: [],
          createdAt: now,
          updatedAt: now,
        },
        createdAt: existing.createdAt,
        updatedAt: now,
      }));

      existing.totalAmount = data.items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
    }

    existing.updatedAt = now;
    quotations[index] = existing;
    this.saveQuotations(quotations);
    return existing;
  }

  static deleteQuotation(id: number): boolean {
    const quotations = this.getQuotations();
    const filteredQuotations = quotations.filter(q => q.id !== id);
    
    if (filteredQuotations.length === quotations.length) {
      return false; // Not found
    }

    this.saveQuotations(filteredQuotations);
    return true;
  }

  static getQuotation(id: number): Quotation | null {
    const quotations = this.getQuotations();
    return quotations.find(q => q.id === id) || null;
  }

  static searchQuotations(searchTerm?: string): Quotation[] {
    const quotations = this.getQuotations();
    
    if (!searchTerm) {
      return quotations;
    }

    const term = searchTerm.toLowerCase();
    return quotations.filter(q => 
      q.quotationNumber.toLowerCase().includes(term) ||
      q.customerName.toLowerCase().includes(term) ||
      (q.companyName && q.companyName.toLowerCase().includes(term)) ||
      q.phoneNumber.includes(term)
    );
  }

  // Utility methods
  static clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.QUOTATIONS);
      localStorage.removeItem(STORAGE_KEYS.QUOTATION_COUNTER);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  static exportData(): string {
    const quotations = this.getQuotations();
    return JSON.stringify({
      quotations,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.quotations && Array.isArray(data.quotations)) {
        this.saveQuotations(data.quotations);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export default LocalStorageService;