/**
 * driverPay — every pay figure the /drive page is allowed to print.
 *
 * READ FROM PRODUCTION on 2026-11-09, not from the code defaults. The code
 * defaults in Backend (growth2/guard.ts DEFAULT_CAPS) are $12/$20 and are NOT
 * what drivers see: growthControl/state carries no overrides, so the rates
 * that matter are the ones on the active `scheduledBonuses` templates.
 *
 * RULE FOR THIS FILE: a number that cannot be sourced is `null`, and the page
 * renders nothing for it. There are no estimates and no placeholders here —
 * an unverified figure on a pay page is a promise we have not made.
 *
 * TO REFRESH: re-run the read-only reader (docs/counter-backend-spec.md) and
 * update both the value and its `source`.
 */

export type PayFigure = {
  /** Dollars. null = not verified, so it is not shown. */
  usd: number | null;
  /** Exactly where the number came from. Shown to nobody; read by whoever edits. */
  source: string;
};

/** A guaranteed-earnings night. Rates are per hour online and working. */
export type GuaranteeNight = {
  day: string;
  /** Window start, ET, 24h. */
  startHourEt: number;
  hourlyUsd: number | null;
  lateHourlyUsd: number | null;
  source: string;
};

/**
 * The three standing weekly guarantee shifts, `active: true` in production.
 * Halloween's one-off templates are deliberately excluded — they are inactive.
 */
export const GUARANTEE_NIGHTS: GuaranteeNight[] = [
  {
    day: "Thursday",
    startHourEt: 21,
    hourlyUsd: 10,
    lateHourlyUsd: 16,
    source: "scheduledBonuses/weekly-thu-guarantee (active, read 2026-11-09)",
  },
  {
    day: "Friday",
    startHourEt: 21,
    hourlyUsd: 10,
    lateHourlyUsd: 16,
    source: "scheduledBonuses/weekly-fri-guarantee (active, read 2026-11-09)",
  },
  {
    day: "Saturday",
    startHourEt: 21,
    hourlyUsd: 15,
    lateHourlyUsd: 20,
    source: "scheduledBonuses/weekly-sat-guarantee (active, read 2026-11-09)",
  },
];

/**
 * When the higher "late" rate starts, ET.
 *
 * growthControl/state.guaranteeLateFromHourEt is absent, so settlement uses
 * the code default of 0 — midnight. That is why the page says "after
 * midnight" and not a time somebody guessed.
 */
export const LATE_FROM_HOUR_ET = 0;
export const LATE_FROM_LABEL = "after midnight";

/**
 * A guarantee is not paid for being logged in. These are the conditions
 * settlement actually applies, from growth2/guard.ts DEFAULT_CAPS (no
 * growthControl override exists) and the live shift documents.
 */
export const GUARANTEE_CONDITIONS = {
  /** Share of the window you must be online. */
  minOnlinePct: 0.8,
  /** Rides you must accept in the window. The live shifts carry 2. */
  minAcceptedRides: 2,
  source:
    "incentives/sb_weekly-*-guarantee_* tripThreshold=2; DEFAULT_CAPS.guaranteeMinOnlinePct=0.8",
};

/**
 * First-trip bonus.
 *
 * ⚠️ PRODUCTION DISAGREES WITH THE CODE. Backend's bonuses/firstTripBonus.ts
 * says the old $20-at-1-trip and $25-at-5-trips pair was REPLACED by a single
 * $10 bonus, and that the amount lives at growthControl/state.firstTripBonusUsd.
 * That field is absent, and BOTH old incentives are still `active: true`:
 *
 *   incentives/f7OgYg3LGEICfqjJUrXr  $20, tripThreshold 1
 *   incentives/ERXiC7ZhYVr1hVn3Fp5y  $25, tripThreshold 5
 *
 * completeRide pays off the incentive document, so $20 at the first trip is
 * what a new driver is really paid today. That is the only figure printed.
 * The $25-at-5 is left off the site until the conflict is resolved.
 */
export const FIRST_TRIP_BONUS: PayFigure = {
  usd: 20,
  source: "incentives/f7OgYg3LGEICfqjJUrXr (active, tripThreshold 1, read 2026-11-09)",
};

/**
 * Weekly quest — cumulative totals, not increments. Hitting 15 trips pays $30
 * in all, not 5 + 15 + 30.
 *
 * ⚠️ NOT EVERY DRIVER GETS ONE. Quests are minted per driver
 * (`q_weekly_<week>_weekly_quest_<uid>`) and only 4 existed for 2026-W46. The
 * page says "up to", never "you will get".
 */
export const WEEKLY_QUEST_TIERS = [
  { trips: 5, cumulativeUsd: 5 },
  { trips: 10, cumulativeUsd: 15 },
  { trips: 15, cumulativeUsd: 30 },
];
export const WEEKLY_QUEST_SOURCE =
  "incentives/q_weekly_2026-W46_weekly_quest_* tiers (active, read 2026-11-09)";

/**
 * Tips. VERIFIED IN CODE, not in config: chargeRiderTip transfers the full
 * tipAmountCents to the driver's Stripe account with no application fee and
 * no commission split (Backend index.ts, purpose 'tip_transfer').
 *
 * Fares are NOT 100% — SafeRides takes a commission, which is why the July
 * "keep 100% of every fare" copy was removed. Only tips may say 100%.
 */
export const TIPS_KEPT_PCT = 100;
export const TIPS_SOURCE =
  "Backend index.ts chargeRiderTip — stripe.transfers.create(amount: tipAmountCents) to the driver, no fee taken";

/** Highest guaranteed rate anywhere, for the headline tile. Never invented. */
export const TOP_GUARANTEE_USD: number | null = GUARANTEE_NIGHTS.reduce<
  number | null
>((best, nightly) => {
  const highest = Math.max(nightly.hourlyUsd ?? 0, nightly.lateHourlyUsd ?? 0);
  return best === null || highest > best ? highest : best;
}, null);
