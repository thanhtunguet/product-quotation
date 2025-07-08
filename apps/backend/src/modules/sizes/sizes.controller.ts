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
import { SizesService } from './sizes.service';
import {
  CreateMasterDataDto,
  UpdateMasterDataDto,
} from '../../dto/master-data.dto';

@ApiTags('sizes')
@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new size' })
  @ApiResponse({ status: 201, description: 'Size created successfully' })
  create(@Body() createSizeDto: CreateMasterDataDto) {
    return this.sizesService.create(createSizeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sizes' })
  @ApiResponse({ status: 200, description: 'List of sizes' })
  findAll() {
    return this.sizesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search sizes by name or code' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(@Query('term') term: string) {
    return this.sizesService.search(term);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a size by ID' })
  @ApiResponse({ status: 200, description: 'Size found' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sizesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a size' })
  @ApiResponse({ status: 200, description: 'Size updated successfully' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSizeDto: UpdateMasterDataDto
  ) {
    return this.sizesService.update(id, updateSizeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a size' })
  @ApiResponse({ status: 200, description: 'Size deleted successfully' })
  @ApiResponse({ status: 404, description: 'Size not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sizesService.remove(id);
  }
}
