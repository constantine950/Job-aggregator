import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client/scripts/default-index.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });
