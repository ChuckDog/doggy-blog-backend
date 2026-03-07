import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async getAllTags(): Promise<Tag[]> {
    return this.prisma.tag.findMany();
  }

  async getTagById(id: number): Promise<Tag | null> {
    return this.prisma.tag.findUnique({
      where: { id },
    });
  }

  async createTag(data: { name: string }): Promise<Tag> {
    return this.prisma.tag.create({
      data,
    });
  }

  async updateTag(
    id: number,
    data: {
      name?: string;
    },
  ): Promise<Tag> {
    return this.prisma.tag.update({
      where: { id },
      data,
    });
  }

  async deleteTag(id: number): Promise<Tag> {
    return this.prisma.tag.delete({
      where: { id },
    });
  }
}
