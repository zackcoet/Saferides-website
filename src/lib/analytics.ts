/**
 * analytics — GA4, loaded from an environment variable.
 *
 * THE ID IS NEVER IN THIS FILE. It comes from VITE_GA4_ID at build time. With
 * no ID set (local dev, a fork, a preview build) every function here is a
 * no-op, so nothing breaks and no stray hits land in the property.
 *
 * WHY THE SCRIPT IS INJECTED HERE AND NOT IN index.html
 * index.html is static, so a tag there would need the ID hardcoded. Injecting
 * it from here keeps the ID in the environment and lets the whole thing stay
 * off when it is absent.
 *
 * SPA PAGE VIEWS: GA4's automatic page_view only fires on a real document
 * load, and this is a client-routed site, so `send_page_view` is off and
 * trackPageView() is called on every route change instead. Otherwise every
 * visit looks like one view of whatever page loaded first.
 */

const GA4_ID: string | undefined = import.meta.env.VITE_GA4_ID || undefined;

/** Every event name the site sends. One list, so no typo invents an event. */
export type AnalyticsEvent =
  | "app_store_click"
  | "qr_shown"
  | "send_to_student"
  | "university_form_submit"
  | "apply_to_drive_click"
  | "driver_application_start";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let started = false;

/**
 * The campaign tags this visit arrived with, captured once on first load.
 *
 * WHY THEY ARE CAPTURED AND RE-SENT: GA4 reads UTMs off the landing URL, but
 * our conversions happen after client-side navigation, by which point the
 * query string is long gone. Without this, a flyer scan that lands on
 * /?utm_source=flyer and converts on /parents attributes to nothing.
 */
const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

let campaign: Params = {};

function captureCampaign(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of CAMPAIGN_KEYS) {
      const value = params.get(key);
      if (value) campaign[key] = value;
    }
    // Survives client-side navigation within the visit; sessionStorage so it
    // does not leak into a later, differently-sourced visit.
    if (Object.keys(campaign).length > 0) {
      sessionStorage.setItem("sr_campaign", JSON.stringify(campaign));
    } else {
      const stored = sessionStorage.getItem("sr_campaign");
      if (stored) campaign = JSON.parse(stored) as Params;
    }
  } catch {
    // Private mode, blocked storage. Attribution is not worth a crash.
  }
}

/** Load gtag.js once. Safe to call repeatedly; safe to call with no ID. */
export function initAnalytics(): void {
  if (started || !GA4_ID || typeof window === "undefined") return;
  started = true;

  captureCampaign();

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js requires the raw `arguments` object, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, {
    // We send our own, on every route change. See the file header.
    send_page_view: false,
  });
}

/** One page view. `from` is the page the reader came from, as asked for. */
export function trackPageView(path: string, from?: string): void {
  if (!GA4_ID || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    // GA4's own `page_referrer` is the document referrer, which is empty on a
    // client-side route change — this is the in-site previous page.
    from_page: from,
    ...campaign,
  });
}

/** One tracked action. Campaign tags ride along so conversions attribute. */
export function trackEvent(event: AnalyticsEvent, params: Params = {}): void {
  if (!GA4_ID || !window.gtag) return;
  window.gtag("event", event, {
    page_path: window.location.pathname,
    ...campaign,
    ...params,
  });
}

/** True when analytics is actually on. Used to keep debug output honest. */
export const analyticsEnabled = Boolean(GA4_ID);
