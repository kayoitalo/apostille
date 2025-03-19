import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

// Only initialize Prisma Client in server-side code
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  // For development, return a mock client
  if (process.env.NODE_ENV === 'development') {
    return new PrismaClient({
      // Use SQLite in development
      datasources: {
        db: {
          url: 'file:./dev.db'
        }
      }
    });
  }

  // For production, use Neon
  const connectionString = process.env.DATABASE_URL!;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);

  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;