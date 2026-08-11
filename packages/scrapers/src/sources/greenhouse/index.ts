import type { RawJob } from "@job-aggregator/shared";

export interface GreenhouseSourceConfig {
  companyName: string;
  boardToken: string; // the "xyz" in boards.greenhouse.io/xyz
}

interface GreenhouseApiJob {
  id: number;
  title: string;
  updated_at: string;
  absolute_url: string;
  location: { name: string } | null;
  content: string; // HTML job description
}

interface GreenhouseApiResponse {
  jobs: GreenhouseApiJob[];
}

const GREENHOUSE_API_BASE = "https://boards-api.greenhouse.io/v1/boards";

/**
 * Fetches all live jobs from a single company's public Greenhouse job board.
 * No auth required — this is Greenhouse's public job board API.
 */
export async function fetchGreenhouseJobs(
  config: GreenhouseSourceConfig,
): Promise<RawJob[]> {
  const url = `${GREENHOUSE_API_BASE}/${config.boardToken}/jobs?content=true`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Greenhouse fetch failed for "${config.companyName}" (${config.boardToken}): ${res.status} ${res.statusText}`,
    );
  }

  const data = (await res.json()) as GreenhouseApiResponse;

  return data.jobs.map((job) => toRawJob(job, config));
}

function toRawJob(
  job: GreenhouseApiJob,
  config: GreenhouseSourceConfig,
): RawJob {
  return {
    sourceName: "greenhouse",
    sourceUrl: job.absolute_url,
    applyUrl: job.absolute_url,
    title: job.title,
    companyName: config.companyName,
    locationRaw: job.location?.name ?? undefined,
    descriptionRaw: job.content,
    postedAtRaw: job.updated_at,
  };
}

/**
 * Fetches jobs across multiple companies' Greenhouse boards.
 * Failures on individual boards don't stop the whole run — a broken
 * board token from one company shouldn't block jobs from the rest.
 */
export async function fetchAllGreenhouseJobs(
  configs: GreenhouseSourceConfig[],
): Promise<RawJob[]> {
  const results = await Promise.allSettled(
    configs.map((config) => fetchGreenhouseJobs(config)),
  );

  const jobs: RawJob[] = [];

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      jobs.push(...result.value);
    } else {
      console.error(
        `Greenhouse scrape failed for ${configs[i].companyName}:`,
        result.reason,
      );
    }
  });

  return jobs;
}
