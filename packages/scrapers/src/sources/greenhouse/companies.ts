import type { GreenhouseSourceConfig } from "./index.js";

/**
 * Companies to scrape from Greenhouse. Add more as you find them —
 * verify the board token by visiting https://job-boards.greenhouse.io/<token>
 * in a browser before adding it here (a 404 means the token is wrong).
 *
 * GitLab confirmed working — fully remote company, so their roles are
 * genuinely open to Nigeria-based applicants.
 */
export const GREENHOUSE_COMPANIES: GreenhouseSourceConfig[] = [
  { companyName: "GitLab", boardToken: "gitlab" },
  // { companyName: "SomeCompany", boardToken: "somecompany" },
];
