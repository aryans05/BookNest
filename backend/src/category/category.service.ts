import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({
      data,
    });
  }

  // READ ALL
  findAll() {
    return this.prisma.category.findMany({
      include: {
        navigation: true,
        parent: true,
        children: true,
      },
    });
  }

  // READ ONE
  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        navigation: true,
        parent: true,
        children: true,
        products: true,
      },
    });
  }

  // UPDATE
  update(id: number, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  // DELETE
  remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
