import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Tag } from '@prisma/client';
import { TagsService } from './tags.service.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAllTags(): Promise<Tag[]> {
    return this.tagsService.getAllTags();
  }

  @Get(':id')
  async getTag(@Param('id') id: string): Promise<Tag | null> {
    return this.tagsService.getTagById(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTag(
    @Body()
    body: {
      name: string;
    },
  ): Promise<Tag> {
    return this.tagsService.createTag({
      name: body.name,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateTag(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
    },
  ): Promise<Tag> {
    return this.tagsService.updateTag(Number(id), {
      name: body.name,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async patchTag(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
    },
  ): Promise<Tag> {
    return this.tagsService.updateTag(Number(id), {
      name: body.name,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteTag(@Param('id') id: string): Promise<Tag> {
    return this.tagsService.deleteTag(Number(id));
  }
}
