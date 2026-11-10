import { useEffect, useState } from "react";

import {
  BAKED_STATS,
  STATS_ENDPOINT,
  type SiteStats,
} from "@/config/siteStats";

/**
 * The counter's numbers.
 *
 * Starts from the figures baked in at build time and only ever replaces them
 * with a LARGER live figure. A cold cache, a half-written rollup or a bad
 * deploy must not make "students home safe" fall in front of a parent — the
 * number is a claim about the past, and the past does not shrink.
 *
 * No endpoint configured is the normal case today; the baked numbers stand.
 */
export default function useSiteStats(): SiteStats {
  const [stats, setStats] = useState<SiteStats>(BAKED_STATS);

  useEffect(() => {
    if (!STATS_ENDPOINT) return;
    let cancelled = false;

    fetch(STATS_ENDPOINT, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Partial<SiteStats> | null) => {
        if (cancelled || !data) return;
        const requests = Number(data.rideRequests);
        const seats = Number(data.studentsRequested);
        const people = Number(data.studentsHomeSafe);
        const rides = Number(data.ridesCompleted);
        if (!Number.isFinite(people) || !Number.isFinite(rides)) return;
        setStats((current) => ({
          // A live figure is taken only when it is bigger. An endpoint that
          // omits rideRequests leaves the baked one standing untouched.
          rideRequests: Number.isFinite(requests)
            ? Math.max(current.rideRequests, requests)
            : current.rideRequests,
          studentsRequested: Number.isFinite(seats)
            ? Math.max(current.studentsRequested, seats)
            : current.studentsRequested,
          studentsHomeSafe: Math.max(current.studentsHomeSafe, people),
          ridesCompleted: Math.max(current.ridesCompleted, rides),
          countedAtIso: data.countedAtIso ?? current.countedAtIso,
        }));
      })
      .catch(() => {
        // Keep the baked numbers. A counter that is a little behind is fine;
        // a counter that breaks the page is not.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}
