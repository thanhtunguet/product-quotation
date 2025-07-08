import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../../dto/category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories.' })
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.categoriesService.search(search);
    }
    return this.categoriesService.findAll();
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get category tree structure' })
  @ApiResponse({ status: 200, description: 'Return category tree.' })
  findTree() {
    return this.categoriesService.findTree();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Return the category.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
