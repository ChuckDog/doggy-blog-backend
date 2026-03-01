import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (url && url.startsWith('postgres')) {
      const adapter = new PrismaPg({
        connectionString: url,
      });
      super({ adapter });
    } else {
      super();
    }
  }
}
