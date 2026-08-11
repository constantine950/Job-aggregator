import { config as loadEnv } from "dotenv";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

// The Prisma CLI runs with this package's directory as cwd, but .env
// lives at the repo root — load it explicitly.
loadEnv({ path: path.resolve(import.meta.dirname, "../../.env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
