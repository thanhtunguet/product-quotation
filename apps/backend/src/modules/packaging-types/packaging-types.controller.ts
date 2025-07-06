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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PackagingTypesService } from './packaging-types.service';
import { CreateMasterDataDto, UpdateMasterDataDto } from '../../dto/master-data.dto';

@ApiTags('packaging-types')
@Controller('packaging-types')
export class PackagingTypesController {
  constructor(private readonly packagingTypesService: PackagingTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new packaging type' })
  @ApiResponse({ status: 201, description: 'Packaging type created successfully' })
  create(@Body() createPackagingTypeDto: CreateMasterDataDto) {
    return this.packagingTypesService.create(createPackagingTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all packaging types' })
  @ApiResponse({ status: 200, description: 'List of packaging types' })
  findAll() {
    return this.packagingTypesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search packaging types by name or code' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(@Query('term') term: string) {
    return this.packagingTypesService.search(term);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a packaging type by ID' })
  @ApiResponse({ status: 200, description: 'Packaging type found' })
  @ApiResponse({ status: 404, description: 'Packaging type not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.packagingTypesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a packaging type' })
  @ApiResponse({ status: 200, description: 'Packaging type updated successfully' })
  @ApiResponse({ status: 404, description: 'Packaging type not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackagingTypeDto: UpdateMasterDataDto,
  ) {
    return this.packagingTypesService.update(id, updatePackagingTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a packaging type' })
  @ApiResponse({ status: 200, description: 'Packaging type deleted successfully' })
  @ApiResponse({ status: 404, description: 'Packaging type not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.packagingTypesService.remove(id);
  }
}