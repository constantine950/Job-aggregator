// Thin re-export so imports inside apps/api can just do
// `import { prisma } from "../db/client.js"` without every file
// needing to know the DB lives in a separate workspace package.
export { prisma } from "@job-aggregator/db";
