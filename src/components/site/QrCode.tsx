import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

import { trackEvent } from "@/lib/analytics";

/**
 * A QR code drawn in the browser. No image host, no third-party QR service —
 * the SVG is generated from the string at render time, so it works offline,
 * cannot break when someone else's CDN goes away, and leaks nothing about who
 * is looking at the page.
 *
 * DESKTOP ONLY, by the caller: a QR code beside a button on a phone is asking
 * someone to scan their own screen. See GetTheApp.
 *
 * IT POINTS AT /download, NOT THE APP STORE. /download is the existing smart
 * page, so a scan lands somewhere we can count before it forwards on. A code
 * pointing straight at Apple is a scan we never see.
 */
export default function QrCode({
  value,
  size = 112,
  label,
  /** Event context, e.g. "hero" or "parents". */
  surface,
}: {
  value: string;
  size?: number;
  label?: string;
  surface: string;
}) {
  const [svg, setSvg] = useState<string | null>(null);
  const reported = useRef(false);

  useEffect(() => {
    let cancelled = false;
    QRCode.toString(value, {
      type: "svg",
      margin: 0,
      // Medium recovery: survives a phone-camera angle and a bit of glare
      // without making the modules so dense they stop scanning at this size.
      errorCorrectionLevel: "M",
      color: { dark: "#1740A6", light: "#FFFFFF" },
    })
      .then((out) => {
        if (cancelled) return;
        setSvg(out);
        // Fire once per mount, when the code is really on screen — "qr_shown"
        // has to mean shown, or the scan rate is measured against nothing.
        if (!reported.current) {
          reported.current = true;
          trackEvent("qr_shown", { surface, target: value });
        }
      })
      .catch(() => {
        // A QR that will not encode is not worth an error state next to a
        // working button. The button alone is a complete path.
      });
    return () => {
      cancelled = true;
    };
  }, [value, surface]);

  if (!svg) return <div style={{ width: size, height: size }} aria-hidden="true" />;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        style={{ width: size, height: size }}
        className="rounded-[10px] border border-[#1740A6]/15 bg-white p-2"
        // Generated locally by qrcode from `value`; no user input reaches it.
        dangerouslySetInnerHTML={{ __html: svg }}
        role="img"
        aria-label={label ?? `QR code linking to ${value}`}
      />
      {label && (
        <span
          className="font-body text-[#1740A6]/55 text-center"
          style={{ fontSize: "0.7rem", maxWidth: size + 20, lineHeight: 1.35 }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
