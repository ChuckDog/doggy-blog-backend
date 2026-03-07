import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    published: boolean;
    authorId: number;
    categoryId: number;
  }): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async getAllPosts(): Promise<Post[]> {
    return this.prisma.post.findMany({
      include: {
        author: true,
        comments: true,
      },
    });
  }

  async getPublishedPosts(): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: true,
        comments: true,
      },
    });
  }

  async getPostById(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: true,
      },
    });
  }

  async getPostsByAuthor(authorId: number): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        authorId,
      },
      include: {
        author: true,
        comments: true,
      },
    });
  }

  async updatePost(
    id: number,
    data: {
      title?: string;
      slug?: string;
      content?: string;
      excerpt?: string;
      published?: boolean;
      categoryId?: number;
    },
  ): Promise<Post> {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async deletePost(id: number): Promise<Post> {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
