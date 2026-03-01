import { Controller, Get, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BlogService } from './blog.service.js';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('posts')
  @HttpCode(HttpStatus.OK)
  async getPosts() {
    return this.blogService.getPosts();
  }

  @Get('posts/:id')
  @HttpCode(HttpStatus.OK)
  async getPost(@Param('id') id: string) {
    return this.blogService.getPostById(Number(id));
  }

  @Get('categories')
  @HttpCode(HttpStatus.OK)
  async getCategories() {
    return this.blogService.getCategories();
  }

  @Get('tags')
  @HttpCode(HttpStatus.OK)
  async getTags() {
    return this.blogService.getTags();
  }

  @Get('categories/:categoryId/posts')
  @HttpCode(HttpStatus.OK)
  async getPostsByCategory(@Param('categoryId') categoryId: string) {
    return this.blogService.getPostsByCategory(categoryId);
  }

  @Get('tags/:tagId/posts')
  @HttpCode(HttpStatus.OK)
  async getPostsByTag(@Param('tagId') tagId: string) {
    return this.blogService.getPostsByTag(tagId);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(@Query('keyword') keyword: string) {
    return this.blogService.searchPosts(keyword ?? '');
  }
}
