import QrCode from "@/components/site/QrCode";
import { trackEvent } from "@/lib/analytics";

/** The smart page. Every download path goes through it so scans are countable. */
export const DOWNLOAD_URL = "https://saferidesapp.com/download";

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

/**
 * The download call to action: one button, and on a desktop a QR code beside
 * it. `hidden md:flex` on the QR is the whole mobile rule — a phone gets the
 * button only, because scanning your own screen is not a thing.
 */
export default function GetTheApp({
  surface,
  label = "Get the app",
  variant = "blue",
  className = "",
}: {
  /** Where this instance lives, e.g. "hero". Goes out with the event. */
  surface: string;
  label?: string;
  variant?: "blue" | "white";
  className?: string;
}) {
  const onBlue = variant === "white";

  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <a
        href={DOWNLOAD_URL}
        onClick={() => trackEvent("app_store_click", { surface })}
        className={`inline-flex items-center gap-2.5 rounded-[10px] px-7 py-3.5 font-body font-semibold ${
          onBlue ? "bg-white text-[#1740A6]" : "bg-[#1740A6] text-white"
        }`}
      >
        <AppleIcon />
        {label}
      </a>

      <div className="hidden md:block">
        <QrCode value={DOWNLOAD_URL} surface={surface} label="Scan to download" />
      </div>
    </div>
  );
}
