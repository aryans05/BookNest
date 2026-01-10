import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Prisma } from '@prisma/client';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // CREATE
  @Post()
  create(@Body() data: Prisma.ProductCreateInput) {
    return this.productService.create(data);
  }

  // READ ALL
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(Number(id));
  }

  // UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.ProductUpdateInput) {
    return this.productService.update(Number(id), data);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(Number(id));
  }
}
