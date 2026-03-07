import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Make sure dotenv is loaded
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not defined!');
      // Fallback for debugging, though not recommended for production
      // process.env.DATABASE_URL = 'postgresql://postgres:Lucifer19890914@127.0.0.1:5432/template1';
    }
    const { Pool } = pg;
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString }) as any;
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
