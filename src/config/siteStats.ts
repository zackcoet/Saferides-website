/**
 * siteStats — the homepage counter.
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
  /** Ride requests since launch, whatever came of them. The headline number. */
  rideRequests: number;
  /**
   * Sum of `numberOfPeople` over ALL requests since launch — seats asked
   * for, not distinct people and not people carried. Only 476 unique
   * students are behind it, and only 876 of these seats travelled.
   */
  studentsRequested: number;
  /** Sum of `numberOfPeople` over completed rides since launch. */
  studentsHomeSafe: number;
  /** Completed rides since launch. */
  ridesCompleted: number;
  /** When these were counted. Shown nowhere; it is for whoever edits next. */
  countedAtIso: string;
};

/**
 * Baked at build time. Counted 2026-11-10 by the read-only reader against
 * production `rides`, createdAt >= 2026-08-18 00:00 ET, minus every ride
 * whose rider OR driver uid is in growthControl/state.excludedUids (31
 * accounts, including the founder's internal 6922 phone cluster) and minus
 * the sim_* generated accounts. 91 docs excluded as test, 27 dropped as
 * pre-launch or undated, 1,432 counted.
 *
 * WHAT EACH NUMBER COUNTS, because the difference matters and has been got
 * wrong once already:
 *
 *   rideRequests     every request a real student submitted. 1,064 of them
 *                    were cancelled, overwhelmingly because no driver was
 *                    online to take them. This is DEMAND, not deliveries.
 *   studentsRequested sum of numberOfPeople over ALL requests. Seats asked
 *                    for. The same student appears once per request, so it
 *                    is NOT a headcount — 476 distinct students are behind
 *                    the 3,167.
 *   ridesCompleted   requests that ended in status 'completed'.
 *   studentsHomeSafe sum of numberOfPeople over those completed rides only,
 *                    a missing value counted as 1. A cancelled request got
 *                    nobody home, so it can never feed this number.
 *
 * A request that never found a driver must NEVER be described as a trip, a
 * ride given, or a student got home. 3,167 students appear across all
 * requests; only 876 of them actually travelled.
 *
 * HOW TO REFRESH: run docs/readMarketingNumbers.js and paste the totals in
 * with the date. Nothing else in the site holds a copy.
 */
export const BAKED_STATS: SiteStats = {
  rideRequests: 1432,
  studentsRequested: 3167,
  studentsHomeSafe: 876,
  ridesCompleted: 388,
  countedAtIso: "2026-11-10",
};

export const STATS_ENDPOINT: string | undefined =
  import.meta.env.VITE_STATS_ENDPOINT || undefined;

/** 847 -> "847". 1847 -> "1,847". Never rounds, never abbreviates. */
export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

/** Below this the counter is hidden entirely rather than shown small. */
export const MIN_COUNT_TO_SHOW = 1;

/**
 * What a ride really costs, read from the same 2026-11-09 production pass
 * over completed rides since launch (n=399 fares, n=411 per-person figures,
 * excludedUids removed).
 *
 *   fares        p25 $6.75   median $9.00   p75 $11.04
 *   per person   p25 $3.38   median $4.13   p75 $5.50
 *
 * The page quotes the MIDDLE HALF, not the median alone — a single number
 * reads as a price list, and the fare varies with distance, group size and
 * the zone and priority multipliers. Rounded outward to whole dollars so the
 * range can only be wider than the truth, never narrower.
 */
export const TYPICAL_FARE = {
  lowUsd: 7,
  highUsd: 11,
  perPersonUsd: 4,
  source:
    "production rides, completed, since launch, read 2026-11-09 — finalPrice p25/p75 and pricePerPerson median",
};
