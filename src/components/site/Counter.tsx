import useSiteStats from "@/hooks/useSiteStats";
import {
  MIN_COUNT_TO_SHOW,
  PERIOD_LABEL,
  formatCount,
} from "@/config/siteStats";

/**
 * "1,432 ride requests this semester / 3,167 students across those requests."
 *
 * BOTH NUMBERS ARE REQUESTS. Neither is a delivery, and the wording has to
 * keep saying so. 1,064 of the 1,432 requests were cancelled, almost always
 * because no driver was online, and only 876 of the 3,167 seats travelled.
 * So this counter may never be worded as trips, rides given, students
 * carried, or anyone got home safe. Parents and university staff read it.
 *
 * "students across those requests" is also deliberately not "3,167 students
 * have used SafeRides": it is a sum of seats over requests, in which the
 * same student appears once per request. 476 distinct students are behind
 * it. See studentsRequested in config/siteStats.ts.
 *
 * THE NUMBER IS THE NUMBER. No rounding, no "nearly", no "1,000+" that has
 * not really been passed — formatCount only adds a comma.
 */
export default function Counter({
  variant = "light",
}: {
  variant?: "light" | "onBlue";
}) {
  const { rideRequests, studentsRequested } = useSiteStats();
  if (rideRequests < MIN_COUNT_TO_SHOW) return null;

  const strong = variant === "onBlue" ? "text-white" : "text-[#1740A6]";
  const soft = variant === "onBlue" ? "text-white/70" : "text-[#1740A6]/60";

  return (
    <div className="text-center">
      <div
        className={`font-display font-black leading-none ${strong}`}
        style={{ fontSize: "clamp(3.5rem, 11vw, 7rem)" }}
      >
        {formatCount(rideRequests)}
      </div>
      <p
        className={`mt-3 font-display font-bold ${strong}`}
        style={{ fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)" }}
      >
        ride requests {PERIOD_LABEL}
      </p>
      {studentsRequested >= MIN_COUNT_TO_SHOW && (
        <p className={`mt-2 font-body ${soft}`} style={{ fontSize: "1rem" }}>
          {formatCount(studentsRequested)} students across those requests
        </p>
      )}
    </div>
  );
}
