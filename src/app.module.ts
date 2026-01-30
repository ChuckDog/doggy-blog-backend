import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { PostsModule } from './posts/posts.module.js';
import { CommentsModule } from './comments/comments.module.js';
import { PrismaService } from './prisma/prisma.service.js';

@Module({
  imports: [UsersModule, PostsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
