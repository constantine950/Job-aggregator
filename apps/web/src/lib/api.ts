import type { JobFilterParams, JobsResponse } from "../types/job";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export async function fetchJobs(
  filters: JobFilterParams,
): Promise<JobsResponse> {
  const params = new URLSearchParams();

  if (filters.state) params.set("state", filters.state);
  if (filters.workMode) params.set("workMode", filters.workMode);
  if (filters.employmentType)
    params.set("employmentType", filters.employmentType);
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.postedWithinHours)
    params.set("postedWithinHours", filters.postedWithinHours);
  if (filters.page) params.set("page", filters.page);

  const url = `${API_BASE_URL}/jobs${params.toString() ? `?${params.toString()}` : ""}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch jobs: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
