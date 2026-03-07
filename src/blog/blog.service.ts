import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Post, Category, Tag, User } from '@prisma/client';

export interface BlogPostDto {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  readTime: number;
}

export interface BlogCategoryDto {
  id: string;
  name: string;
  count: number;
}

export interface BlogTagDto {
  id: string;
  name: string;
  count: number;
}

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async getPosts(): Promise<BlogPostDto[]> {
    const posts = await this.prisma.post.findMany({
      where: { published: true },
      include: {
        author: true,
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map(this.mapPost.bind(this));
  }

  async getPostById(id: number): Promise<BlogPostDto | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    if (!post || !post.published) return null;

    return this.mapPost(post);
  }

  async getCategories(): Promise<BlogCategoryDto[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { posts: { where: { published: true } } },
        },
      },
    });

    return categories
      .filter((c) => c._count.posts > 0)
      .map((c) => ({
        id: this.toId(c.name),
        name: c.name,
        count: c._count.posts,
      }));
  }

  async getTags(): Promise<BlogTagDto[]> {
    const tags = await this.prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: { where: { published: true } } },
        },
      },
    });

    return tags
      .filter((t) => t._count.posts > 0)
      .map((t) => ({
        id: this.toId(t.name),
        name: t.name,
        count: t._count.posts,
      }));
  }

  async getPostsByCategory(categorySlug: string): Promise<BlogPostDto[]> {
    // Note: This is a simple implementation. In a real app, you might want to query by category ID or slug stored in DB.
    // Here we try to match by name since our seed uses names as identifiers for slugs in frontend logic
    const categoryName = this.unslugify(categorySlug);
    
    // Try to find category by name (case insensitive search would be better but Prisma needs raw query for that or specific collation)
    // We'll fetch all matching categories and filter in memory if needed, or just search by name
    const category = await this.prisma.category.findFirst({
      where: {
        name: {
          equals: categoryName,
          mode: 'insensitive',
        },
      },
    });

    if (!category) return [];

    const posts = await this.prisma.post.findMany({
      where: {
        published: true,
        categoryId: category.id,
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map(this.mapPost.bind(this));
  }

  async getPostsByTag(tagSlug: string): Promise<BlogPostDto[]> {
    const tagName = this.unslugify(tagSlug);
    
    const tag = await this.prisma.tag.findFirst({
      where: {
        name: {
          equals: tagName,
          mode: 'insensitive',
        },
      },
    });

    if (!tag) return [];

    const posts = await this.prisma.post.findMany({
      where: {
        published: true,
        tags: {
          some: { id: tag.id },
        },
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map(this.mapPost.bind(this));
  }

  async searchPosts(keyword: string): Promise<BlogPostDto[]> {
    const kw = keyword.trim();
    if (!kw) return [];

    const posts = await this.prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: kw, mode: 'insensitive' } },
          { excerpt: { contains: kw, mode: 'insensitive' } },
          { content: { contains: kw, mode: 'insensitive' } },
          { tags: { some: { name: { contains: kw, mode: 'insensitive' } } } },
        ],
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map(this.mapPost.bind(this));
  }

  private mapPost(
    post: Post & {
      author: User;
      category: Category;
      tags: Tag[];
    },
  ): BlogPostDto {
    return {
      id: String(post.id),
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      author: `${post.author.firstName} ${post.author.lastName}` || post.author.username,
      date: post.createdAt.toISOString().split('T')[0],
      category: post.category.name,
      tags: post.tags.map((t) => t.name),
      imageUrl: post.imageUrl || '',
      readTime: this.calculateReadTime(post.content),
    };
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private unslugify(slug: string): string {
    try {
      // Simple unslugify: replace hyphens with spaces
      // Note: This is lossy if the original name had hyphens. 
      // Ideally, we should query by slug, but our DB schema uses ID or Name.
      // The frontend generates slugs from names by lowercasing and replacing spaces with hyphens.
      return decodeURIComponent(slug).replace(/-/g, ' ');
    } catch {
      return slug.replace(/-/g, ' ');
    }
  }

  private toId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}
