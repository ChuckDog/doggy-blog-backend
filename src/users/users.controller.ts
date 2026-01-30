import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body()
    body: {
      email: string;
      username: string;
      password: string;
      firstName: string;
      lastName: string;
      bio?: string;
      avatar?: string;
    },
  ): Promise<User> {
    return this.usersService.createUser({
      email: body.email,
      username: body.username,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      bio: body.bio,
      avatar: body.avatar,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('id') id: string): Promise<User | null> {
    return this.usersService.getUserById(Number(id));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body()
    body: {
      email?: string;
      username?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      bio?: string;
      avatar?: string;
    },
  ): Promise<User> {
    return this.usersService.updateUser(Number(id), {
      email: body.email,
      username: body.username,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      bio: body.bio,
      avatar: body.avatar,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.deleteUser(Number(id));
  }
}
