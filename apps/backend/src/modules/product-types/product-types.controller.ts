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
import { ProductTypesService } from './product-types.service';
import {
  CreateMasterDataDto,
  UpdateMasterDataDto,
} from '../../dto/master-data.dto';

@ApiTags('product-types')
@Controller('product-types')
export class ProductTypesController {
  constructor(private readonly productTypesService: ProductTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product type' })
  @ApiResponse({
    status: 201,
    description: 'Product type created successfully',
  })
  create(@Body() createProductTypeDto: CreateMasterDataDto) {
    return this.productTypesService.create(createProductTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product types' })
  @ApiResponse({ status: 200, description: 'List of product types' })
  findAll() {
    return this.productTypesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search product types by name or code' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(@Query('term') term: string) {
    return this.productTypesService.search(term);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product type by ID' })
  @ApiResponse({ status: 200, description: 'Product type found' })
  @ApiResponse({ status: 404, description: 'Product type not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productTypesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product type' })
  @ApiResponse({
    status: 200,
    description: 'Product type updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Product type not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductTypeDto: UpdateMasterDataDto
  ) {
    return this.productTypesService.update(id, updateProductTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product type' })
  @ApiResponse({
    status: 200,
    description: 'Product type deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Product type not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productTypesService.remove(id);
  }
}
