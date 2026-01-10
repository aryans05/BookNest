import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data,
    });
  }

  // READ ALL
  findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  // READ ONE
  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        detail: true,
        reviews: true,
      },
    });
  }

  // UPDATE
  update(id: number, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  // DELETE
  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
