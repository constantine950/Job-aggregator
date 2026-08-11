import { config as loadEnv } from "dotenv";
import path from "node:path";

loadEnv({ path: path.resolve(import.meta.dirname, "../../../.env") });

import { Pool } from "pg";
import { PrismaClient } from "../prisma/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  // ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
