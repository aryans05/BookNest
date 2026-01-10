import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NavigationService {
  constructor(private readonly prisma: PrismaService) {}

  // CREATE
  create(data: Prisma.NavigationCreateInput) {
    return this.prisma.navigation.create({
      data,
    });
  }

  // READ ALL
  findAll() {
    return this.prisma.navigation.findMany({
      include: {
        categories: true,
      },
    });
  }

  // READ ONE
  findOne(id: number) {
    return this.prisma.navigation.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });
  }

  // UPDATE
  update(id: number, data: Prisma.NavigationUpdateInput) {
    return this.prisma.navigation.update({
      where: { id },
      data,
    });
  }

  // DELETE
  remove(id: number) {
    return this.prisma.navigation.delete({
      where: { id },
    });
  }
}
