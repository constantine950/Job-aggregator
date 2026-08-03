import { createHash } from "crypto";
import type { RawJob } from "../types/job";

/**
 * Normalizes a string for hashing: lowercase, trim, collapse whitespace,
 * strip common punctuation that doesn't change meaning.
 */
function normalizeForHash(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Produces a stable dedup key for a job posting.
 *
 * Same job posted on two different sites (or re-scraped from the same site)
 * should produce the same hash, so we key on title + company + location
 * rather than sourceUrl (which differs per site) or description (which
 * often has tracking params / slightly different formatting per copy).
 *
 * NOTE: this is intentionally a fairly strict match. If two sources phrase
 * the same job differently enough to produce different hashes, that's a
 * fuzzy-matching problem for later (see packages/scrapers/src/dedup),
 * not something to solve by loosening this hash.
 */
export function hashJob(job: Pick<RawJob, "title" | "companyName" | "locationRaw">): string {
  const key = [
    normalizeForHash(job.title),
    normalizeForHash(job.companyName),
    normalizeForHash(job.locationRaw ?? ""),
  ].join("|");

  return createHash("sha256").update(key).digest("hex");
}
