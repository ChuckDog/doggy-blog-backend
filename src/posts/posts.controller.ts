import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Post as PrismaPost } from '@prisma/client';
import { PostsService } from './posts.service.js';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body()
    body: {
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      published: boolean;
      authorId: number;
    },
  ): Promise<PrismaPost> {
    return this.postsService.createPost({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      published: body.published,
      authorId: body.authorId,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPost(@Param('id') id: string): Promise<PrismaPost | null> {
    return this.postsService.getPostById(Number(id));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPosts(
    @Query('published') published: string,
    @Query('authorId') authorId: string,
  ): Promise<PrismaPost[]> {
    if (published === 'true') {
      return this.postsService.getPublishedPosts();
    } else if (authorId) {
      return this.postsService.getPostsByAuthor(Number(authorId));
    } else {
      return this.postsService.getAllPosts();
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updatePost(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      slug?: string;
      content?: string;
      excerpt?: string;
      published?: boolean;
    },
  ): Promise<PrismaPost> {
    return this.postsService.updatePost(Number(id), {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      published: body.published,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deletePost(@Param('id') id: string): Promise<PrismaPost> {
    return this.postsService.deletePost(Number(id));
  }
}
