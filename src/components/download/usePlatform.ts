import { useEffect, useState } from "react";

export type Platform = "ios" | "android" | "desktop";

/**
 * Pure so it can be reasoned about (and exercised) without a browser.
 *
 * iPadOS 13+ reports a desktop Safari user agent, so a Mac UA that also
 * reports multi-touch is an iPad, not a laptop.
 */
export const detectPlatform = (
  userAgent: string,
  maxTouchPoints: number,
): Platform => {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Macintosh/i.test(userAgent) && maxTouchPoints > 1) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "desktop";
};

/**
 * Starts as "desktop" and corrects after mount. Desktop is the safe default:
 * it shows every store option rather than guessing wrong and sending someone
 * to a store they cannot install from.
 */
export const usePlatform = (): Platform => {
  const [platform, setPlatform] = useState<Platform>("desktop");

  useEffect(() => {
    setPlatform(
      detectPlatform(navigator.userAgent, navigator.maxTouchPoints ?? 0),
    );
  }, []);

  return platform;
};
