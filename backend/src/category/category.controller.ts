import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Prisma } from '@prisma/client';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // CREATE
  @Post()
  create(@Body() data: Prisma.CategoryCreateInput) {
    return this.categoryService.create(data);
  }

  // READ ALL
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(Number(id));
  }

  // UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.CategoryUpdateInput) {
    return this.categoryService.update(Number(id), data);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(Number(id));
  }
}
