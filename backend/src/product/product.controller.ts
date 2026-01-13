import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ScraperOrchestratorService } from '../scraper/scraper-orchestrator.service';
import { GetProductsDto } from './dto/get-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly scraperOrchestratorService: ScraperOrchestratorService,
  ) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('category/:categoryId')
  findByCategoryPaginated(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query() query: GetProductsDto,
    @Query('collectionUrl') collectionUrl?: string,
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 15;

    return this.productService.findByCategoryPaginated(
      categoryId,
      page,
      limit,
      collectionUrl,
    );
  }

  @Get(':id/details')
  findProductDetails(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findProductDetails(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateProductDto) {
    return this.productService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
  ) {
    return this.productService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

  @Post('scrape/full/:categoryId')
  scrapeFullCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body()
    body: {
      collectionUrl: string;
      limit?: number;
    },
  ) {
    if (!body?.collectionUrl) {
      throw new BadRequestException('collectionUrl is required');
    }

    return this.scraperOrchestratorService.scrapeFullCategory({
      categoryId,
      collectionUrl: body.collectionUrl,
      limit: body.limit ?? 15,
    });
  }

  @Post('scrape/details')
  scrapeProductDetails() {
    return this.productService.scrapeAndSaveProductDetails();
  }

  @Post('scrape/details/:categoryId')
  scrapeProductDetailsByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productService.scrapeAndSaveProductDetailsByCategory(
      categoryId,
    );
  }
}
