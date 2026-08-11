import { config as loadEnv } from "dotenv";
import path from "node:path";

loadEnv({ path: path.resolve(import.meta.dirname, "../../../../.env") });

export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
