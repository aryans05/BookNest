import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { Prisma } from '@prisma/client';

@Controller('navigations')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  // CREATE
  @Post()
  create(@Body() data: Prisma.NavigationCreateInput) {
    return this.navigationService.create(data);
  }

  // READ ALL
  @Get()
  findAll() {
    return this.navigationService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.navigationService.findOne(Number(id));
  }

  // UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.NavigationUpdateInput) {
    return this.navigationService.update(Number(id), data);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.navigationService.remove(Number(id));
  }
}
