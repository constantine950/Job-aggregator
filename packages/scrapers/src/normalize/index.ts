import type { RawJob, EmploymentType, WorkMode } from "@job-aggregator/shared";
import { hashJob } from "@job-aggregator/shared";

export interface NormalizedJobData {
  hash: string;
  sourceName: RawJob["sourceName"];
  sourceUrl: string;
  applyUrl: string;
  title: string;
  companyName: string;
  city?: string;
  state?: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  category?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  description?: string;
}

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "Federal Capital Territory",
  "FCT",
  "Abuja",
] as const;

const REMOTE_KEYWORDS = ["remote", "work from home", "wfh", "anywhere"];
const HYBRID_KEYWORDS = ["hybrid"];

export function parseLocation(locationRaw?: string): {
  city?: string;
  state?: string;
  workMode: WorkMode;
} {
  if (!locationRaw) {
    return { workMode: "unknown" };
  }

  const lower = locationRaw.toLowerCase();

  let workMode: WorkMode = "onsite";
  if (REMOTE_KEYWORDS.some((kw) => lower.includes(kw))) {
    workMode = "remote";
  } else if (HYBRID_KEYWORDS.some((kw) => lower.includes(kw))) {
    workMode = "hybrid";
  }

  const matchedState = NIGERIAN_STATES.find((state) =>
    lower.includes(state.toLowerCase()),
  );

  const state = matchedState
    ? matchedState === "Abuja" || matchedState === "FCT"
      ? "Federal Capital Territory"
      : matchedState
    : undefined;

  const firstSegment = locationRaw.split(",")[0]?.trim();
  const firstSegmentLower = firstSegment?.toLowerCase() ?? "";
  const segmentIsJustTheState =
    matchedState !== undefined &&
    firstSegmentLower.includes(matchedState.toLowerCase());

  const city =
    firstSegment &&
    firstSegmentLower !== "nigeria" &&
    !REMOTE_KEYWORDS.some((kw) => firstSegmentLower.includes(kw)) &&
    !segmentIsJustTheState
      ? firstSegment
      : undefined;

  return { city, state, workMode };
}

const EMPLOYMENT_TYPE_KEYWORDS: Array<[EmploymentType, string[]]> = [
  ["nysc", ["nysc", "youth corps", "corps member"]],
  ["internship", ["intern", "internship", "trainee"]],
  ["contract", ["contract", "contractor", "freelance"]],
  ["part_time", ["part-time", "part time"]],
  ["full_time", ["full-time", "full time", "permanent"]],
];

export function mapEmploymentType(
  employmentTypeRaw?: string,
  title?: string,
): EmploymentType {
  const haystack = `${employmentTypeRaw ?? ""} ${title ?? ""}`.toLowerCase();

  for (const [type, keywords] of EMPLOYMENT_TYPE_KEYWORDS) {
    if (keywords.some((kw) => haystack.includes(kw))) {
      return type;
    }
  }

  return "unknown";
}

export function stripHtml(html?: string): string | undefined {
  if (!html) return undefined;

  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function normalizeJob(raw: RawJob): NormalizedJobData {
  const { city, state, workMode } = parseLocation(raw.locationRaw);

  return {
    hash: hashJob(raw),
    sourceName: raw.sourceName,
    sourceUrl: raw.sourceUrl,
    applyUrl: raw.applyUrl ?? raw.sourceUrl,
    title: raw.title,
    companyName: raw.companyName,
    city,
    state,
    workMode,
    employmentType: mapEmploymentType(raw.employmentTypeRaw, raw.title),
    description: stripHtml(raw.descriptionRaw),
  };
}
