/**
 * Every public store URL and support address used by the /download page.
 *
 * This is the ONLY place the /download page reads them from — nothing in that
 * page's JSX hardcodes a link, so when a URL changes you edit this file and
 * nothing else.
 *
 * NOTE: the rest of the site (Nav, Hero, Footer, DownloadCTA, Drivers,
 * RushPage) still carries its own inlined copies of these App Store URLs.
 * Those were deliberately left alone rather than refactored alongside this
 * feature; folding them into this file is a good separate cleanup.
 *
 * These are public marketing URLs, not secrets — they belong in the repo, not
 * in .env.
 *
 * Any value left as REPLACE_ME renders a visibly disabled "Coming soon" button
 * instead of a link that goes nowhere.
 */

export const REPLACE_ME = "REPLACE_ME";

export type StoreKey =
  | "APP_STORE_RIDER"
  | "APP_STORE_DRIVER"
  | "PLAY_STORE_RIDER"
  | "PLAY_STORE_DRIVER";

export const APP_LINKS: Record<StoreKey, string> = {
  /** Rider app — Apple App Store. LIVE. */
  APP_STORE_RIDER: "https://apps.apple.com/us/app/saferides/id6750380495",

  /** Driver app — Apple App Store. LIVE. */
  APP_STORE_DRIVER: "https://apps.apple.com/us/app/saferides-driver/id6751057062",

  /**
   * Google Play. There is no Android build yet, so these are NOT rendered on
   * the page at all — the download cards are Apple-only for now. Filling these
   * in does nothing on its own; DownloadCard has to start reading them too.
   */
  PLAY_STORE_RIDER: REPLACE_ME,
  PLAY_STORE_DRIVER: REPLACE_ME,
};

/** Support inbox shown in the page's footer strip. */
export const SUPPORT_EMAIL = "saferideshelp@gmail.com";

/**
 * True only for a URL that is safe to put behind a button. Guards against both
 * an unfilled placeholder and anything that is not an https link.
 */
export const isLive = (url: string): boolean =>
  url !== REPLACE_ME && url.startsWith("https://");
