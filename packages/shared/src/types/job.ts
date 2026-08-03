/**
 * Core Job type shared across scrapers, API, and frontend.
 * Scrapers produce RawJob -> normalize() turns it into NormalizedJob -> stored as Job.
 */

export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "internship"
  | "nysc"
  | "unknown";

export type WorkMode = "onsite" | "remote" | "hybrid" | "unknown";

export type SourceName =
  | "jobberman"
  | "myjobmag"
  | "ngcareers"
  | "hotnigerianjobs"
  | "greenhouse"
  | "lever"
  | "whatsapp_manual";

/**
 * What a scraper hands off before normalization.
 * Deliberately loose — raw HTML/JSON fields vary a lot per source.
 */
export interface RawJob {
  sourceName: SourceName;
  sourceUrl: string;
  title: string;
  companyName: string;
  locationRaw?: string;
  descriptionRaw?: string;
  employmentTypeRaw?: string;
  salaryRaw?: string;
  postedAtRaw?: string; // whatever the source claims, often unreliable
  applyUrl?: string;
}

/**
 * The cleaned, structured shape we actually store and query on.
 */
export interface NormalizedJob {
  hash: string; // stable dedup key, see utils/hash.ts
  sourceName: SourceName;
  sourceUrl: string;
  applyUrl: string;

  title: string;
  companyName: string;

  city?: string;
  state?: string; // Nigerian state, e.g. "Lagos", "Oyo"
  workMode: WorkMode;

  employmentType: EmploymentType;
  category?: string; // e.g. "Engineering", "Sales", "Customer Service"

  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string; // "NGN" by default

  description?: string;

  firstSeenAt: Date; // when WE first saw it — drives "posted X hours ago"
  lastSeenAt: Date; // updated every time a scrape confirms it's still live
  expiredAt?: Date; // set when a scrape stops finding it
}

export interface JobFilters {
  state?: string;
  workMode?: WorkMode;
  employmentType?: EmploymentType;
  category?: string;
  search?: string; // free-text on title/company
  postedWithinHours?: number;
  page?: number;
  pageSize?: number;
}
