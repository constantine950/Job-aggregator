export interface ApiJob {
  id: string;
  hash: string;
  sourceName: string;
  sourceUrl: string;
  applyUrl: string;
  title: string;
  companyName: string;
  city: string | null;
  state: string | null;
  workMode: "onsite" | "remote" | "hybrid" | "unknown";
  employmentType:
    | "full_time"
    | "part_time"
    | "contract"
    | "internship"
    | "nysc"
    | "unknown";
  category: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  description: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  expiredAt: string | null;
}

export interface JobsResponse {
  jobs: ApiJob[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface JobFilterParams {
  state?: string;
  workMode?: string;
  employmentType?: string;
  category?: string;
  search?: string;
  postedWithinHours?: string;
  page?: string;
}
