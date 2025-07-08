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
import { ManufacturingMethodsService } from './manufacturing-methods.service';
import {
  CreateMasterDataDto,
  UpdateMasterDataDto,
} from '../../dto/master-data.dto';

@ApiTags('manufacturing-methods')
@Controller('manufacturing-methods')
export class ManufacturingMethodsController {
  constructor(
    private readonly manufacturingMethodsService: ManufacturingMethodsService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new manufacturing method' })
  @ApiResponse({
    status: 201,
    description: 'Manufacturing method created successfully',
  })
  create(@Body() createManufacturingMethodDto: CreateMasterDataDto) {
    return this.manufacturingMethodsService.create(
      createManufacturingMethodDto
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all manufacturing methods' })
  @ApiResponse({ status: 200, description: 'List of manufacturing methods' })
  findAll() {
    return this.manufacturingMethodsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search manufacturing methods by name or code' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(@Query('term') term: string) {
    return this.manufacturingMethodsService.search(term);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a manufacturing method by ID' })
  @ApiResponse({ status: 200, description: 'Manufacturing method found' })
  @ApiResponse({ status: 404, description: 'Manufacturing method not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.manufacturingMethodsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a manufacturing method' })
  @ApiResponse({
    status: 200,
    description: 'Manufacturing method updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Manufacturing method not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateManufacturingMethodDto: UpdateMasterDataDto
  ) {
    return this.manufacturingMethodsService.update(
      id,
      updateManufacturingMethodDto
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a manufacturing method' })
  @ApiResponse({
    status: 200,
    description: 'Manufacturing method deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Manufacturing method not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.manufacturingMethodsService.remove(id);
  }
}
