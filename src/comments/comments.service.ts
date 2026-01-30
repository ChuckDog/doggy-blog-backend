import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Comment } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(data: {
    content: string;
    authorId: number;
    postId: number;
  }): Promise<Comment> {
    return this.prisma.comment.create({
      data,
      include: {
        author: true,
        post: true,
      },
    });
  }

  async getAllComments(): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      include: {
        author: true,
        post: true,
      },
    });
  }

  async getCommentsByPost(postId: number): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
        post: true,
      },
    });
  }

  async getCommentsByAuthor(authorId: number): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        authorId,
      },
      include: {
        author: true,
        post: true,
      },
    });
  }

  async getCommentById(id: number): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: true,
        post: true,
      },
    });
  }

  async updateComment(
    id: number,
    data: {
      content?: string;
    },
  ): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id },
      data,
      include: {
        author: true,
        post: true,
      },
    });
  }

  async deleteComment(id: number): Promise<Comment> {
    return this.prisma.comment.delete({
      where: { id },
      include: {
        author: true,
        post: true,
      },
    });
  }
}
