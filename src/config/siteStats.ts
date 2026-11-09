/**
 * siteStats — the "students home safe" counter.
 *
 * TWO SOURCES, IN THIS ORDER:
 *   1. The live endpoint (VITE_STATS_ENDPOINT). Public, cached, totals only.
 *   2. These baked-in numbers, written at build time.
 *
 * The baked numbers are the floor, never a guess. `useSiteStats` only replaces
 * them with a live figure that is BIGGER — a cold cache or a half-written
 * rollup must never make the counter go backwards in front of a parent.
 *
 * NEVER ROUND UP. The number printed is the number counted. `formatCount`
 * adds a thousands separator and nothing else; "1,000+" wording is only ever
 * reached by passing 1,000 for real.
 *
 * HOW THE BAKED NUMBERS ARE REFRESHED
 * Run the read-only reader (see docs/counter-backend-spec.md, "Interim: baking
 * the number in") and paste the two totals here with the date. That is the
 * whole procedure — nothing else in the site holds a copy.
 */

/** Launch. Every total below counts from this date forward. */
export const LAUNCH_DATE_ISO = "2026-08-18";

/** What we call the period in copy. We launched in August. */
export const PERIOD_LABEL = "this semester";

export type SiteStats = {
  /** Sum of `numberOfPeople` over completed rides since launch. */
  studentsHomeSafe: number;
  /** Completed rides since launch. */
  ridesCompleted: number;
  /** When these were counted. Shown nowhere; it is for whoever edits next. */
  countedAtIso: string;
};

/**
 * Baked at build time. Counted 2026-11-09 by the read-only reader against
 * production `rides`:
 *
 *   status == 'completed', completedAt (or createdAt) >= 2026-08-18 ET,
 *   summing numberOfPeople with a missing value counted as 1, minus every
 *   ride whose rider OR driver uid is in growthControl/state.excludedUids
 *   (31 accounts, including the founder's internal 6922 phone cluster — 17
 *   rides, 41 people), minus riders on a test.saferides email, minus the
 *   sim_* generated accounts, minus 11 pre-launch rides.
 *
 *   412 rides / 927 people survive the excludedUids list alone; the stricter
 *   test-account and test-driver filters bring it to the figures below. The
 *   SMALLER number is the one we print.
 */
export const BAKED_STATS: SiteStats = {
  studentsHomeSafe: 876,
  ridesCompleted: 388,
  countedAtIso: "2026-11-09",
};

/**
 * Live totals endpoint. Absent in dev and until the Backend ships it, which
 * is the normal case — the hook simply keeps the baked numbers.
 */
export const STATS_ENDPOINT: string | undefined =
  import.meta.env.VITE_STATS_ENDPOINT || undefined;

/** 847 -> "847". 1847 -> "1,847". Never rounds, never abbreviates. */
export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

/** Below this the counter is hidden entirely rather than shown small. */
export const MIN_COUNT_TO_SHOW = 1;
