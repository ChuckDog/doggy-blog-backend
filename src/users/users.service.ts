import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    bio?: string;
    avatar?: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        posts: true,
        comments: true,
      },
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
        comments: true,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUser(
    id: number,
    data: {
      email?: string;
      username?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      bio?: string;
      avatar?: string;
    },
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
