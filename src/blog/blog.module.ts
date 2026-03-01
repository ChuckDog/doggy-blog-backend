import { Module } from '@nestjs/common';
import { BlogService } from './blog.service.js';
import { BlogController } from './blog.controller.js';
// PrismaService removed for in-memory backend run

@Module({
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
