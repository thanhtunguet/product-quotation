import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { QuotationsService, CreateQuotationDto, UpdateQuotationDto } from './quotations.service';

@ApiTags('quotations')
@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quotation' })
  @ApiResponse({ status: 201, description: 'Quotation created successfully' })
  create(@Body() createQuotationDto: CreateQuotationDto) {
    return this.quotationsService.create(createQuotationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quotations with pagination' })
  @ApiResponse({ status: 200, description: 'List of quotations' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.quotationsService.findAll(page, limit);
  }

  @Get('generate-number')
  @ApiOperation({ summary: 'Generate a new quotation number' })
  @ApiResponse({ status: 200, description: 'Generated quotation number' })
  generateQuotationNumber() {
    return this.quotationsService.generateQuotationNumber();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search quotations by quotation number, customer name, company name, or phone number' })
  @ApiResponse({ status: 200, description: 'Search results' })
  @ApiQuery({ name: 'term', required: true, type: String, description: 'Search term' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  search(
    @Query('term') term: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.quotationsService.search(term, page, limit);
  }

  @Get('by-status/:status')
  @ApiOperation({ summary: 'Get quotations by status' })
  @ApiResponse({ status: 200, description: 'Quotations by status' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  findByStatus(
    @Param('status') status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.quotationsService.findByStatus(status, page, limit);
  }

  @Get('by-customer/:customerName')
  @ApiOperation({ summary: 'Get quotations by customer name' })
  @ApiResponse({ status: 200, description: 'Quotations by customer' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  findByCustomer(
    @Param('customerName') customerName: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.quotationsService.findByCustomer(customerName, page, limit);
  }

  @Get('by-number/:quotationNumber')
  @ApiOperation({ summary: 'Get a quotation by quotation number' })
  @ApiResponse({ status: 200, description: 'Quotation found' })
  @ApiResponse({ status: 404, description: 'Quotation not found' })
  findByQuotationNumber(@Param('quotationNumber') quotationNumber: string) {
    return this.quotationsService.findByQuotationNumber(quotationNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a quotation by ID' })
  @ApiResponse({ status: 200, description: 'Quotation found' })
  @ApiResponse({ status: 404, description: 'Quotation not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quotationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a quotation' })
  @ApiResponse({ status: 200, description: 'Quotation updated successfully' })
  @ApiResponse({ status: 404, description: 'Quotation not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuotationDto: UpdateQuotationDto,
  ) {
    return this.quotationsService.update(id, updateQuotationDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update quotation status' })
  @ApiResponse({ status: 200, description: 'Quotation status updated successfully' })
  @ApiResponse({ status: 404, description: 'Quotation not found' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED',
  ) {
    return this.quotationsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quotation' })
  @ApiResponse({ status: 200, description: 'Quotation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Quotation not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quotationsService.remove(id);
  }
}