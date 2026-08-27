import { isLive } from "@/config/appLinks";
import { usePlatform } from "./usePlatform";

export interface DownloadCardProps {
  heading: string;
  supportingLine: string;
  /** Lowercase, used inside the aria-label: "rider" / "driver". */
  appLabel: string;
  appStoreUrl: string;
}

/**
 * One audience, one decision, one button.
 *
 * iOS only for now — there is no Android build, so no Google Play link is
 * rendered anywhere. An Android visitor still sees the App Store button (it is
 * the only thing that exists) plus a plain-text note, so nobody taps expecting
 * a Play Store page and lands somewhere they cannot install from.
 */
export default function DownloadCard({
  heading,
  supportingLine,
  appLabel,
  appStoreUrl,
}: DownloadCardProps) {
  const platform = usePlatform();

  const base =
    "inline-flex w-full min-h-[48px] items-center justify-center rounded-full px-8 py-4 font-body font-semibold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2";

  return (
    <div className="flex flex-col rounded-3xl border border-brand-blue20 bg-white p-7 sm:p-9">
      <h2
        className="font-display font-black text-brand-blue"
        style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", lineHeight: 1.05 }}
      >
        {heading}
      </h2>
      <p
        className="mt-3 flex-1 font-body text-brand-blue/70"
        style={{ fontSize: "1rem", lineHeight: 1.6 }}
      >
        {supportingLine}
      </p>

      <div className="mt-7">
        {isLive(appStoreUrl) ? (
          <a
            href={appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Download SafeRides ${appLabel} app on the App Store`}
            className={`${base} bg-brand-blue text-white hover:bg-brand-blue/90`}
          >
            Download the App
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className={`${base} cursor-not-allowed border border-brand-blue20 bg-brand-blue08 text-brand-blue/50`}
          >
            Coming soon
          </button>
        )}

        {platform === "android" && (
          <p
            className="mt-4 text-center font-body text-brand-blue/55"
            style={{ fontSize: "0.875rem", lineHeight: 1.5 }}
          >
            iPhone only for now — the Android app is on the way.
          </p>
        )}
      </div>
    </div>
  );
}
