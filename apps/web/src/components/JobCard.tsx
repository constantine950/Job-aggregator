import type { ApiJob } from "../types/job";
import { formatPostedAgo, isFresh } from "../lib/time";

const WORK_MODE_LABELS: Record<string, string> = {
  onsite: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
  unknown: "",
};

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
  nysc: "NYSC",
  unknown: "",
};

function locationLabel(job: ApiJob): string {
  const parts = [job.city, job.state].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  if (job.workMode === "remote") return "Remote";
  return "Location not specified";
}

export function JobCard({ job }: { job: ApiJob }) {
  const fresh = isFresh(job.firstSeenAt);
  const workModeLabel = WORK_MODE_LABELS[job.workMode];
  const employmentLabel = EMPLOYMENT_TYPE_LABELS[job.employmentType];

  return (
    <article className="rounded-lg border border-border bg-surface p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-ink">
            {job.title}
          </h2>
          <p className="mt-0.5 text-sm text-muted">{job.companyName}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
          {fresh && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"
              aria-hidden="true"
            />
          )}
          <span>{formatPostedAgo(job.firstSeenAt)}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent-ink">
          {locationLabel(job)}
        </span>
        {workModeLabel && (
          <span className="rounded-full border border-border px-2.5 py-1 text-muted">
            {workModeLabel}
          </span>
        )}
        {employmentLabel && (
          <span className="rounded-full border border-border px-2.5 py-1 text-muted">
            {employmentLabel}
          </span>
        )}
      </div>

      <div className="mt-4">
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-accent hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          View job →
        </a>
      </div>
    </article>
  );
}
