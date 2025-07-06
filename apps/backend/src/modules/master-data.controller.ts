import { Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MasterDataService } from './master-data.service';
import { MasterDataEntity } from '../entities/base.interface';
import { CreateMasterDataDto, UpdateMasterDataDto } from '../dto/master-data.dto';

export abstract class MasterDataController<T extends MasterDataEntity> {
  constructor(protected readonly service: MasterDataService<T>) {}

  @Post()
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({ status: 201, description: 'The entity has been successfully created.' })
  create(@Body() createDto: CreateMasterDataDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({ status: 200, description: 'Return all entities.' })
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.service.search(search);
    }
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entity by ID' })
  @ApiResponse({ status: 200, description: 'Return the entity.' })
  @ApiResponse({ status: 404, description: 'Entity not found.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update entity' })
  @ApiResponse({ status: 200, description: 'The entity has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Entity not found.' })
  update(@Param('id') id: string, @Body() updateDto: UpdateMasterDataDto) {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete entity' })
  @ApiResponse({ status: 200, description: 'The entity has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Entity not found.' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}