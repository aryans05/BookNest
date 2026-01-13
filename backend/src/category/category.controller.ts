import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Prisma } from '@prisma/client';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Get('by-navigation/:navigationId')
  findByNavigation(@Param('navigationId', ParseIntPipe) navigationId: number) {
    return this.categoryService.findByNavigation(navigationId);
  }

  @Post('scrape/:navigationId')
  scrapeByNavigation(
    @Param('navigationId', ParseIntPipe) navigationId: number,
  ) {
    return this.categoryService.scrapeAndSaveCategories(navigationId);
  }

  @Post('scrape/by-url/:navigationId')
  scrapeByUrl(
    @Param('navigationId', ParseIntPipe) navigationId: number,
    @Body('url') url: string,
  ) {
    if (!url) {
      throw new BadRequestException('url is required');
    }

    return this.categoryService.scrapeAndSaveFromUrl(navigationId, url);
  }

  @Post()
  create(@Body() data: Prisma.CategoryCreateInput) {
    return this.categoryService.create(data);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.CategoryUpdateInput,
  ) {
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
