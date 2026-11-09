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
        const people = Number(data.studentsHomeSafe);
        const rides = Number(data.ridesCompleted);
        if (!Number.isFinite(people) || !Number.isFinite(rides)) return;
        setStats((current) => ({
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
