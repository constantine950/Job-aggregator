import { prisma } from "@job-aggregator/db";
import type { NormalizedJobData } from "../normalize/index.js";

export async function upsertJob(job: NormalizedJobData) {
  return prisma.job.upsert({
    where: { hash: job.hash },
    create: {
      hash: job.hash,
      sourceName: job.sourceName,
      sourceUrl: job.sourceUrl,
      applyUrl: job.applyUrl,
      title: job.title,
      companyName: job.companyName,
      city: job.city,
      state: job.state,
      workMode: job.workMode,
      employmentType: job.employmentType,
      category: job.category,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryCurrency: job.salaryCurrency,
      description: job.description,
    },
    update: {
      title: job.title,
      companyName: job.companyName,
      city: job.city,
      state: job.state,
      workMode: job.workMode,
      employmentType: job.employmentType,
      category: job.category,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryCurrency: job.salaryCurrency,
      description: job.description,
      expiredAt: null,
    },
  });
}

async function runWithConcurrencyLimit<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex++;
      try {
        const value = await fn(items[currentIndex]);
        results[currentIndex] = { status: "fulfilled", value };
      } catch (reason) {
        results[currentIndex] = { status: "rejected", reason };
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);

  return results;
}

export async function upsertJobs(jobs: NormalizedJobData[]) {
  const results = await runWithConcurrencyLimit(jobs, 3, (job) =>
    upsertJob(job),
  );

  let succeeded = 0;
  let failed = 0;

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      succeeded++;
    } else {
      failed++;
      console.error(
        `Failed to upsert job "${jobs[i].title}" @ ${jobs[i].companyName}:`,
        result.reason,
      );
    }
  });

  return { succeeded, failed, total: jobs.length };
}

export async function markMissingJobsExpired(
  sourceName: NormalizedJobData["sourceName"],
  seenHashes: string[],
) {
  const result = await prisma.job.updateMany({
    where: {
      sourceName,
      expiredAt: null,
      hash: { notIn: seenHashes },
    },
    data: {
      expiredAt: new Date(),
    },
  });

  return result.count;
}
