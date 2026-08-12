import type { JobFilterParams } from "../types/job";

export function JobFilters({ current }: { current: JobFilterParams }) {
  return (
    <form
      method="GET"
      action="/"
      className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="search" className="text-xs font-medium text-muted">
          Search
        </label>
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Title or company"
          defaultValue={current.search ?? ""}
          className="w-48 rounded-md border border-border bg-bg px-3 py-1.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="state" className="text-xs font-medium text-muted">
          State
        </label>
        <input
          id="state"
          name="state"
          type="text"
          placeholder="e.g. Lagos"
          defaultValue={current.state ?? ""}
          className="w-32 rounded-md border border-border bg-bg px-3 py-1.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="workMode" className="text-xs font-medium text-muted">
          Work mode
        </label>
        <select
          id="workMode"
          name="workMode"
          defaultValue={current.workMode ?? ""}
          className="rounded-md border border-border bg-bg px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Any</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">On-site</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="employmentType"
          className="text-xs font-medium text-muted"
        >
          Type
        </label>
        <select
          id="employmentType"
          name="employmentType"
          defaultValue={current.employmentType ?? ""}
          className="rounded-md border border-border bg-bg px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Any</option>
          <option value="full_time">Full-time</option>
          <option value="part_time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
          <option value="nysc">NYSC</option>
        </select>
      </div>

      <button
        type="submit"
        className="rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Filter
      </button>

      {(current.search ||
        current.state ||
        current.workMode ||
        current.employmentType) && (
        <a href="/" className="text-sm text-muted underline hover:text-ink">
          Clear
        </a>
      )}
    </form>
  );
}
