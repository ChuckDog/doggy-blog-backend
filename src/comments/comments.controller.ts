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
import { CommentsService } from './comments.service.js';
import { Comment } from '@prisma/client';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Body() body: { content: string; authorId: number; postId: number },
  ): Promise<Comment> {
    return this.commentsService.createComment({
      content: body.content,
      authorId: body.authorId,
      postId: body.postId,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getComment(@Param('id') id: string): Promise<Comment | null> {
    return this.commentsService.getCommentById(Number(id));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllComments(
    @Query('postId') postId: string,
    @Query('authorId') authorId: string,
  ): Promise<Comment[]> {
    if (postId) {
      return this.commentsService.getCommentsByPost(Number(postId));
    } else if (authorId) {
      return this.commentsService.getCommentsByAuthor(Number(authorId));
    } else {
      return this.commentsService.getAllComments();
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateComment(
    @Param('id') id: string,
    @Body()
    body: {
      content?: string;
    },
  ): Promise<Comment> {
    return this.commentsService.updateComment(Number(id), {
      content: body.content,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteComment(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.deleteComment(Number(id));
  }
}
