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
import { ColorsService } from './colors.service';
import { CreateMasterDataDto, UpdateMasterDataDto } from '../../dto/master-data.dto';

@ApiTags('colors')
@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new color' })
  @ApiResponse({ status: 201, description: 'Color created successfully' })
  create(@Body() createColorDto: CreateMasterDataDto & { hexCode?: string }) {
    return this.colorsService.create(createColorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all colors' })
  @ApiResponse({ status: 200, description: 'List of colors' })
  findAll() {
    return this.colorsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search colors by name or code' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(@Query('term') term: string) {
    return this.colorsService.search(term);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a color by ID' })
  @ApiResponse({ status: 200, description: 'Color found' })
  @ApiResponse({ status: 404, description: 'Color not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.colorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a color' })
  @ApiResponse({ status: 200, description: 'Color updated successfully' })
  @ApiResponse({ status: 404, description: 'Color not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateColorDto: UpdateMasterDataDto & { hexCode?: string },
  ) {
    return this.colorsService.update(id, updateColorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a color' })
  @ApiResponse({ status: 200, description: 'Color deleted successfully' })
  @ApiResponse({ status: 404, description: 'Color not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.colorsService.remove(id);
  }
}