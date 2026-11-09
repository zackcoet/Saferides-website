import {
  FIRST_TRIP_BONUS,
  GUARANTEE_CONDITIONS,
  GUARANTEE_NIGHTS,
  LATE_FROM_LABEL,
  TIPS_KEPT_PCT,
  WEEKLY_QUEST_TIERS,
} from "@/config/driverPay";

/**
 * What a driver actually gets paid. EVERY NUMBER COMES FROM config/driverPay,
 * which was read out of production — nothing here is typed by hand.
 *
 * A null figure renders no tile at all. A pay page with a guessed number on
 * it is a promise we have not made.
 *
 * The small print under the guarantee tile is not decoration: a guarantee
 * pays only if you are online for most of the window AND take rides, and a
 * driver who finds that out at settlement is a driver we lost.
 */

function Tile({
  big,
  title,
  line,
}: {
  big: string;
  title: string;
  line: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-6">
      <div
        className="font-display font-black leading-none text-white"
        style={{ fontSize: "clamp(2.25rem, 5vw, 3rem)" }}
      >
        {big}
      </div>
      <p
        className="mt-3 font-display font-bold text-white"
        style={{ fontSize: "1.0625rem" }}
      >
        {title}
      </p>
      <p
        className="mt-1.5 font-body text-white/70"
        style={{ fontSize: "0.9375rem", lineHeight: 1.5 }}
      >
        {line}
      </p>
    </div>
  );
}

export default function EarningsTiles() {
  const saturday = GUARANTEE_NIGHTS.find((n) => n.day === "Saturday");
  // Thursday and Friday share a rate today; if they ever diverge this shows
  // the lower one rather than quietly advertising the better night as both.
  const weeknights = GUARANTEE_NIGHTS.filter((n) => n.day !== "Saturday");
  const weeknightRate = weeknights.length
    ? Math.min(...weeknights.map((n) => n.hourlyUsd ?? Infinity))
    : null;
  const weeknightLate = weeknights.length
    ? Math.min(...weeknights.map((n) => n.lateHourlyUsd ?? Infinity))
    : null;

  const topQuest = WEEKLY_QUEST_TIERS[WEEKLY_QUEST_TIERS.length - 1];

  return (
    <div>
      {/* Three across, not four: there are five tiles, and 4+1 strands the
          last one alone on its own row. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {saturday?.hourlyUsd != null && (
          <Tile
            big={`$${saturday.hourlyUsd}/hr`}
            title="Saturday guaranteed"
            line={
              saturday.lateHourlyUsd != null
                ? `$${saturday.lateHourlyUsd}/hr ${LATE_FROM_LABEL}. From 9pm.`
                : "From 9pm."
            }
          />
        )}

        {weeknightRate != null && Number.isFinite(weeknightRate) && (
          <Tile
            big={`$${weeknightRate}/hr`}
            title="Thursday and Friday guaranteed"
            line={
              weeknightLate != null && Number.isFinite(weeknightLate)
                ? `$${weeknightLate}/hr ${LATE_FROM_LABEL}. From 9pm.`
                : "From 9pm."
            }
          />
        )}

        {FIRST_TRIP_BONUS.usd != null && (
          <Tile
            big={`$${FIRST_TRIP_BONUS.usd}`}
            title="After your first trip"
            line="A one-off bonus, paid once you have driven once."
          />
        )}

        {topQuest && (
          <Tile
            big={`up to $${topQuest.cumulativeUsd}`}
            title="Weekly trip goals"
            line={`Hit ${topQuest.trips} trips in a week. Offered week by week, not to everyone.`}
          />
        )}

        <Tile
          big={`${TIPS_KEPT_PCT}%`}
          title="Of every tip is yours"
          line="Tips go straight to your account. We take nothing from them."
        />
      </div>

      <p
        className="mt-6 font-body text-white/55"
        style={{ fontSize: "0.8125rem", lineHeight: 1.6, maxWidth: "640px" }}
      >
        Guaranteed shifts pay for the hours you are online and working — you
        need to be online for {Math.round(GUARANTEE_CONDITIONS.minOnlinePct * 100)}% of
        the shift and take at least {GUARANTEE_CONDITIONS.minAcceptedRides} rides.
        Rates are the ones running now and can change week to week. Fares are
        separate and SafeRides takes a commission on those; tips are the only
        thing that is 100% yours.
      </p>
    </div>
  );
}
