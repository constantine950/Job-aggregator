import { config as loadEnv } from "dotenv";
import path from "node:path";
loadEnv({ path: path.resolve(import.meta.dirname, "../../../../.env") });
console.log("DATABASE_URL seen by script:", process.env.DATABASE_URL);

import { pathToFileURL } from "node:url";
import { prisma } from "@job-aggregator/db";
import { fetchAllGreenhouseJobs } from "../sources/greenhouse/index.js";
import { GREENHOUSE_COMPANIES } from "../sources/greenhouse/companies.js";
import { normalizeJob } from "../normalize/index.js";
import { upsertJobs, markMissingJobsExpired } from "../dedup/index.js";

export async function runGreenhouseScrape() {
  console.log(
    `[greenhouse] starting scrape across ${GREENHOUSE_COMPANIES.length} companies...`,
  );

  const rawJobs = await fetchAllGreenhouseJobs(GREENHOUSE_COMPANIES);
  console.log(`[greenhouse] fetched ${rawJobs.length} raw jobs`);

  const normalized = rawJobs.map(normalizeJob);

  const { succeeded, failed, total } = await upsertJobs(normalized);
  console.log(
    `[greenhouse] upserted ${succeeded}/${total} jobs (${failed} failed)`,
  );

  const seenHashes = normalized.map((j) => j.hash);
  const expiredCount = await markMissingJobsExpired("greenhouse", seenHashes);
  console.log(`[greenhouse] marked ${expiredCount} stale jobs as expired`);

  return { fetched: rawJobs.length, succeeded, failed, expiredCount };
}

const isMain =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  runGreenhouseScrape()
    .then(async (summary) => {
      console.log("[greenhouse] done:", summary);
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("[greenhouse] fatal error:", err);
      await prisma.$disconnect();
      process.exit(1);
    });
}
