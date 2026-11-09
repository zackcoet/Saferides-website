import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { trackPageView } from "@/lib/analytics";

/**
 * Sends one GA4 page_view per client-side route change, carrying the page the
 * reader came from. Must live inside the Router.
 */
export default function usePageViews(): void {
  const location = useLocation();
  const previous = useRef<string | undefined>(undefined);

  useEffect(() => {
    const path = location.pathname + location.search;
    trackPageView(path, previous.current);
    previous.current = location.pathname;
  }, [location.pathname, location.search]);
}
