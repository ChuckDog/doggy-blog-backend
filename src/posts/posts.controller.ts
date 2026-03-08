import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Post as PrismaPost } from '@prisma/client';
import { PostsService } from './posts.service.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Request() req,
    @Body()
    body: {
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      published: boolean;
      categoryId: number;
    },
  ): Promise<PrismaPost> {
    return this.postsService.createPost({
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      published: body.published,
      authorId: req.user.userId,
      categoryId: body.categoryId,
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
  @UseGuards(AuthGuard('jwt'))
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
      categoryId?: number;
    },
  ): Promise<PrismaPost> {
    return this.postsService.updatePost(Number(id), {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      published: body.published,
      categoryId: body.categoryId,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async patchPost(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      slug?: string;
      content?: string;
      excerpt?: string;
      published?: boolean;
      categoryId?: number;
    },
  ): Promise<PrismaPost> {
    return this.postsService.updatePost(Number(id), {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      published: body.published,
      categoryId: body.categoryId,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async deletePost(@Param('id') id: string): Promise<PrismaPost> {
    return this.postsService.deletePost(Number(id));
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async likePost(@Param('id') id: string, @Request() req) {
    return this.postsService.likePost(Number(id), req.user.userId);
  }

  @Delete(':id/like')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async unlikePost(@Param('id') id: string, @Request() req) {
    return this.postsService.unlikePost(Number(id), req.user.userId);
  }

  @Get(':id/likes')
  async getLikesCount(@Param('id') id: string) {
    const { count } = await this.postsService.getLikeStatus(Number(id));
    return { count };
  }

  @Get(':id/is-liked')
  @UseGuards(AuthGuard('jwt'))
  async getIsLiked(@Param('id') id: string, @Request() req) {
    const { liked } = await this.postsService.getLikeStatus(
      Number(id),
      req.user.userId,
    );
    return { liked };
  }
}
