import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateProductAttributeDto,
  ProductAttributesService,
  UpdateProductAttributeDto,
} from './product-attributes.service';

@ApiTags('product-attributes')
@Controller('product-attributes')
export class ProductAttributesController {
  constructor(
    private readonly productAttributesService: ProductAttributesService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product attribute' })
  @ApiResponse({
    status: 201,
    description: 'Product attribute created successfully',
  })
  create(@Body() createProductAttributeDto: CreateProductAttributeDto) {
    return this.productAttributesService.create(createProductAttributeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product attributes' })
  @ApiResponse({ status: 200, description: 'List of product attributes' })
  findAll() {
    return this.productAttributesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search product attributes by name or code' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(@Query('term') term: string) {
    return this.productAttributesService.search(term);
  }

  @Get('required')
  @ApiOperation({ summary: 'Get required product attributes' })
  @ApiResponse({
    status: 200,
    description: 'List of required product attributes',
  })
  findRequired() {
    return this.productAttributesService.findRequired();
  }

  @Get('by-data-type/:dataType')
  @ApiOperation({ summary: 'Get product attributes by data type' })
  @ApiResponse({
    status: 200,
    description: 'List of product attributes by data type',
  })
  findByDataType(@Param('dataType') dataType: 'TEXT' | 'NUMBER') {
    return this.productAttributesService.findByDataType(dataType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product attribute by ID' })
  @ApiResponse({ status: 200, description: 'Product attribute found' })
  @ApiResponse({ status: 404, description: 'Product attribute not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productAttributesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product attribute' })
  @ApiResponse({
    status: 200,
    description: 'Product attribute updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Product attribute not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductAttributeDto: UpdateProductAttributeDto
  ) {
    return this.productAttributesService.update(id, updateProductAttributeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product attribute' })
  @ApiResponse({
    status: 200,
    description: 'Product attribute deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Product attribute not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productAttributesService.remove(id);
  }
}
