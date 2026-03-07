import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoriesService } from './categories.service.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  async getCategory(@Param('id') id: string): Promise<Category | null> {
    return this.categoriesService.getCategoryById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCategory(
    @Body()
    body: {
      name: string;
    },
  ): Promise<Category> {
    return this.categoriesService.createCategory({
      name: body.name,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
    },
  ): Promise<Category> {
    return this.categoriesService.updateCategory(Number(id), {
      name: body.name,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async patchCategory(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
    },
  ): Promise<Category> {
    return this.categoriesService.updateCategory(Number(id), {
      name: body.name,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
