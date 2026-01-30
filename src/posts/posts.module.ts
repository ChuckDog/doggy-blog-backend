import { Module } from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService],
  exports: [PostsService],
})
export class PostsModule {}
