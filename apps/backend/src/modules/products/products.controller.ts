import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  CreateProductDto,
  ProductsService,
  UpdateProductDto,
} from './products.service';
import { ExcelService } from './excel/excel.service';
import { ExcelImportResultDto } from './excel/excel.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly excelService: ExcelService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with optional search' })
  @ApiResponse({ status: 200, description: 'List of products' })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  async findAll(
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number
  ) {
    if (search) {
      const result = await this.productsService.search(search, page, limit);
      return result.products;
    }
    const result = await this.productsService.findAll(page, limit);
    return result.products;
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search products by name, code, SKU, or description',
  })
  @ApiResponse({ status: 200, description: 'Search results' })
  @ApiQuery({
    name: 'term',
    required: true,
    type: String,
    description: 'Search term',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  search(
    @Query('term') term: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.productsService.search(term, page, limit);
  }

  @Get('by-category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({ status: 200, description: 'Products in category' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  findByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.productsService.findByCategory(categoryId, page, limit);
  }

  @Get('by-code/:code')
  @ApiOperation({ summary: 'Get a product by code' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findByCode(@Param('code') code: string) {
    return this.productsService.findByCode(code);
  }

  @Get('by-sku/:sku')
  @ApiOperation({ summary: 'Get a product by SKU' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findBySku(@Param('sku') sku: string) {
    return this.productsService.findBySku(sku);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Get('excel/template')
  @ApiOperation({ summary: 'Download Excel import template' })
  @ApiResponse({
    status: 200,
    description: 'Excel template downloaded successfully',
  })
  async downloadTemplate(@Res() res: Response) {
    const buffer = await this.excelService.generateTemplate();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="product-import-template.xlsx"'
    );
    res.send(buffer);
  }

  @Post('excel/import')
  @ApiOperation({ summary: 'Import products from Excel file' })
  @ApiResponse({
    status: 200,
    description: 'Products imported successfully',
    type: ExcelImportResultDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file or data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importProducts(
    @UploadedFile() file: Express.Multer.File
  ): Promise<ExcelImportResultDto> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    if (
      !file.mimetype.includes('spreadsheet') &&
      !file.mimetype.includes('excel')
    ) {
      throw new Error('Invalid file type. Please upload an Excel file.');
    }

    const products = await this.excelService.parseExcelFile(file.buffer);
    return await this.excelService.importProducts(products);
  }
}
