import { fetchJobs } from "../lib/api";
import { JobFilters } from "../components/JobFilters";
import { JobList } from "../components/JobList";
import type { JobFilterParams } from "../types/job";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;

  const filters: JobFilterParams = {
    search: typeof rawParams.search === "string" ? rawParams.search : undefined,
    state: typeof rawParams.state === "string" ? rawParams.state : undefined,
    workMode:
      typeof rawParams.workMode === "string" ? rawParams.workMode : undefined,
    employmentType:
      typeof rawParams.employmentType === "string"
        ? rawParams.employmentType
        : undefined,
    page: typeof rawParams.page === "string" ? rawParams.page : undefined,
  };

  const data = await fetchJobs(filters);
  const currentPage = data.pagination.page;
  const hasNextPage = currentPage < data.pagination.totalPages;
  const hasPrevPage = currentPage > 1;

  function pageHref(targetPage: number): string {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.state) params.set("state", filters.state);
    if (filters.workMode) params.set("workMode", filters.workMode);
    if (filters.employmentType)
      params.set("employmentType", filters.employmentType);
    params.set("page", String(targetPage));
    return `/?${params.toString()}`;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">
          Jobs in Nigeria, updated continuously
        </h1>
        <p className="mt-1 text-sm text-muted">
          {data.pagination.total} open listings — freshest first.
        </p>
      </header>

      <div className="mb-6">
        <JobFilters current={filters} />
      </div>

      <JobList jobs={data.jobs} />

      {(hasNextPage || hasPrevPage) && (
        <div className="mt-8 flex items-center justify-between text-sm">
          {hasPrevPage ? (
            <a
              href={pageHref(currentPage - 1)}
              className="text-accent hover:text-accent-ink"
            >
              ← Previous
            </a>
          ) : (
            <span />
          )}
          <span className="text-muted">
            Page {currentPage} of {data.pagination.totalPages}
          </span>
          {hasNextPage ? (
            <a
              href={pageHref(currentPage + 1)}
              className="text-accent hover:text-accent-ink"
            >
              Next →
            </a>
          ) : (
            <span />
          )}
        </div>
      )}
    </main>
  );
}
