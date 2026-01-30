import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('api-docs')
  getApiDocs(): object {
    return {
      title: 'Doggy Blog API',
      description: 'API documentation for the Doggy Blog backend',
      endpoints: [
        {
          method: 'GET',
          path: '/',
          description: 'Welcome message',
        },
        {
          method: 'GET',
          path: '/api-docs',
          description: 'API documentation (this page)',
        },
        // Users endpoints
        {
          method: 'POST',
          path: '/users',
          description: 'Create a new user',
        },
        {
          method: 'GET',
          path: '/users',
          description: 'Get all users',
        },
        {
          method: 'GET',
          path: '/users/:id',
          description: 'Get a specific user by ID',
        },
        {
          method: 'PUT',
          path: '/users/:id',
          description: 'Update a specific user by ID',
        },
        {
          method: 'DELETE',
          path: '/users/:id',
          description: 'Delete a specific user by ID',
        },
        // Posts endpoints
        {
          method: 'POST',
          path: '/posts',
          description: 'Create a new post',
        },
        {
          method: 'GET',
          path: '/posts',
          description:
            'Get all posts, optionally filtered by published status or author',
        },
        {
          method: 'GET',
          path: '/posts/:id',
          description: 'Get a specific post by ID',
        },
        {
          method: 'PUT',
          path: '/posts/:id',
          description: 'Update a specific post by ID',
        },
        {
          method: 'DELETE',
          path: '/posts/:id',
          description: 'Delete a specific post by ID',
        },
        // Comments endpoints
        {
          method: 'POST',
          path: '/comments',
          description: 'Create a new comment',
        },
        {
          method: 'GET',
          path: '/comments',
          description:
            'Get all comments, optionally filtered by post or author',
        },
        {
          method: 'GET',
          path: '/comments/:id',
          description: 'Get a specific comment by ID',
        },
        {
          method: 'PUT',
          path: '/comments/:id',
          description: 'Update a specific comment by ID',
        },
        {
          method: 'DELETE',
          path: '/comments/:id',
          description: 'Delete a specific comment by ID',
        },
      ],
    };
  }
}
