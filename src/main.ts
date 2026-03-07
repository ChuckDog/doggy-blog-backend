import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import cookieParser from 'cookie-parser';
import { urlencoded, json } from 'express';
import helmet from 'helmet';
import {
  DocumentBuilder,
  SwaggerModule,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
// PrismaService removed for in-memory backend run

const enum Environment {
  Development = 'development',
  Production = 'production',
}
const environment = process.env.ENVIRONMENT ?? Environment.Development;
const port = parseInt(process.env.PORT ?? '') || 3001;
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000'
).split(',');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));
  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://localhost:4001',
      'http://localhost:3021',
      'http://localhost:3002',
    ],
  });

  // no DB bootstrap required

  if (environment === Environment.Production) {
    app.use(helmet());
  } else if (environment === Environment.Development) {
    const config = new DocumentBuilder()
      .setTitle('API Document')
      .setDescription("It's good to see you guys 🥤")
      .setVersion('1.0')
      .addCookieAuth('refreshToken')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    const customOptions: SwaggerCustomOptions = {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
      },
      customSiteTitle: 'API Document',
    };
    SwaggerModule.setup('api', app, document, customOptions);
  }

  await app.listen(port ?? 3000);
}
bootstrap();
