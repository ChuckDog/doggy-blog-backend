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

  async getAllPosts(): Promise<any[]> {
    const posts = await this.prisma.post.findMany({
      include: {
        author: true,
        comments: true,
        _count: {
          select: { likes: true },
        },
      },
    });

    return posts.map((post) => ({
      ...post,
      likesCount: post._count.likes,
    }));
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

  async likePost(postId: number, userId: number): Promise<void> {
    // Check if already liked to avoid error
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      return;
    }

    await this.prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
  }

  async unlikePost(postId: number, userId: number): Promise<void> {
    try {
      await this.prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } catch (error) {
      // Ignore if not liked
    }
  }

  async getLikeStatus(
    postId: number,
    userId?: number,
  ): Promise<{ count: number; liked: boolean }> {
    const count = await this.prisma.like.count({
      where: { postId },
    });

    let liked = false;
    if (userId) {
      const like = await this.prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      liked = !!like;
    }

    return { count, liked };
  }
}
