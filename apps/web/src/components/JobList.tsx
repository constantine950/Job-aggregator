import type { ApiJob } from "../types/job";
import { JobCard } from "./JobCard";

export function JobList({ jobs }: { jobs: ApiJob[] }) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-sm font-medium text-ink">
          No jobs match these filters
        </p>
        <p className="mt-1 text-sm text-muted">
          Try widening your filters, or check back soon — new listings come in
          continuously.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
