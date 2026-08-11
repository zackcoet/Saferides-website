import { useCallback, useEffect, useRef, useState } from "react";

/**
 * How SafeRides Works — scroll-driven walkthrough.
 *
 * Ported from the approved design export. A tall scroll container holds a
 * sticky full-height stage; a scroll listener derives two values, the active
 * beat (0-5) and progress within it, and everything else is driven off those.
 *
 * The inline styles are the approved design and are deliberately kept as
 * literal style objects rather than converted to Tailwind. Do not "tidy" the
 * values.
 *
 * Copy inside the phone frames mirrors the real apps. Two strings were
 * corrected against the app source during the port:
 *   - the request button is "Request Ride - $8.50" (hyphen), matching the
 *     Rider app's `Request Ride - ${price}`; the export used a middle dot,
 *   - the driver offline panel dropped an invented headline and subtitle; the
 *     Driver app has no offline copy beyond the toggle, which reads
 *     "Go Online" / "Go Offline".
 */

const STEPS: Array<[string, string, string]> = [
  ["01", "Rider picks a ride", "Set the destination, say how many are coming, choose SafeRide or SafeRide XL."],
  ["02", "Rider confirms", "One screen for vehicle, price and payment — then request."],
  ["03", "Searching", "The request goes out to verified drivers nearby."],
  ["04", "Driver gets the request", "Earnings, pickup, dropoff and rider count up front."],
  ["05", "On the way", "Driver accepts and heads to pickup. The rider's 4-digit code confirms the match."],
  ["06", "Ride complete", "Rate the driver, add a tip, done."],
];

const PTS: Array<[number, number]> = [
  [120, 455],
  [120, 380],
  [215, 380],
  [215, 250],
  [300, 250],
  [300, 175],
];

/** Arc-length interpolation along PTS. Kept exactly as the export wrote it. */
function carAt(t: number): [number, number] {
  const segs: number[] = [];
  let len = 0;
  for (let i = 1; i < PTS.length; i++) {
    const d = Math.hypot(PTS[i][0] - PTS[i - 1][0], PTS[i][1] - PTS[i - 1][1]);
    segs.push(d);
    len += d;
  }
  let target = t * len;
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i]) {
      const f = segs[i] ? target / segs[i] : 0;
      return [
        PTS[i][0] + (PTS[i + 1][0] - PTS[i][0]) * f,
        PTS[i][1] + (PTS[i + 1][1] - PTS[i][1]) * f,
      ];
    }
    target -= segs[i];
  }
  return PTS[PTS.length - 1];
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

const MONO_STACK = "Inter, Helvetica, Arial, sans-serif";
const ARCHIVO = "Archivo, sans-serif";

/* ------------------------------------------------------------------ */
/* Rider phone                                                         */
/* ------------------------------------------------------------------ */

function RiderPhone({ idx }: { idx: number }) {
  const rSelect = idx === 0;
  const rConfirm = idx === 1;
  const rSearch = idx === 2 || idx === 3;
  const rCode = idx === 4;
  const rDone = idx === 5;

  const sheet: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    background: "#FFFFFF",
    borderRadius: "26px 26px 36px 36px",
    boxShadow: "0 -12px 40px rgba(23,64,166,.14)",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div
      style={{
        width: 300,
        height: 616,
        borderRadius: 44,
        background: "linear-gradient(160deg, #F2F5FC, #DCE4F5)",
        padding: 9,
        boxShadow:
          "0 40px 80px -28px rgba(23,64,166,.34), 0 6px 18px rgba(23,64,166,.10), inset 0 1px 0 #fff",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 36,
          background: "#FFFFFF",
          overflow: "hidden",
          position: "relative",
          border: "1px solid #E4EAF7",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "#EFF3FC" }}>
          <svg
            viewBox="0 0 282 598"
            preserveAspectRatio="xMidYMid slice"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <rect x="0" y="0" width="282" height="598" fill="#EFF3FC" />
            <rect x="-20" y="60" width="150" height="120" rx="6" fill="#E2E9F8" />
            <rect x="160" y="30" width="150" height="90" rx="6" fill="#E2E9F8" />
            <rect x="20" y="240" width="110" height="150" rx="6" fill="#E5EBF9" />
            <rect x="170" y="210" width="140" height="180" rx="6" fill="#E2E9F8" />
            <rect x="-20" y="440" width="130" height="180" rx="6" fill="#E5EBF9" />
            <rect x="0" y="190" width="282" height="16" fill="#FFFFFF" />
            <rect x="0" y="405" width="282" height="16" fill="#FFFFFF" />
            <rect x="140" y="0" width="14" height="598" fill="#FFFFFF" />
            <path
              d="M147 470 L147 413 L60 413 L60 198 L147 198 L147 96"
              fill="none"
              stroke="#1740A6"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity=".9"
            />
            <circle cx="147" cy="96" r="7" fill="#1740A6" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="147" cy="470" r="9" fill="#1740A6" stroke="#FFFFFF" strokeWidth="4" />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 22px",
            fontSize: 12,
            fontWeight: 600,
            color: "#1740A6",
          }}
        >
          <span>9:41</span>
          <span style={{ fontFamily: MONO_STACK, letterSpacing: ".12em" }}>SafeRides</span>
        </div>

        {rSelect && (
          <div style={{ ...sheet, padding: "18px 18px 22px", gap: 14 }}>
            <div style={{ width: 38, height: 4, borderRadius: 4, background: "#DCE3F4", margin: "0 auto" }} />
            <div style={{ fontFamily: ARCHIVO, fontSize: 19, fontWeight: 600, color: "#1740A6" }}>
              Select destination
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "#8595BA" }}>
                Number of riders
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #DCE3F4", borderRadius: 12, padding: "11px 14px", fontSize: 14, fontWeight: 500, color: "#1740A6", background: "#F8FAFE" }}>
                <span>1 rider</span>
                <span style={{ color: "#A7B4D2", fontSize: 12 }}>Edit</span>
              </div>
            </div>
            <div style={{ fontFamily: ARCHIVO, fontSize: 15, fontWeight: 600, color: "#1740A6", marginTop: 2 }}>
              Choose a ride
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #1740A6", borderRadius: 14, padding: "10px 12px", background: "#F6F9FF" }}>
                <div style={{ width: 60, height: 38, borderRadius: 8, background: "repeating-linear-gradient(135deg,#DFE7F7 0 5px,#F1F5FD 5px 10px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO_STACK, fontSize: 8, letterSpacing: ".08em", color: "#8595BA" }}>
                  SEDAN
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1740A6" }}>SafeRide</div>
                  <div style={{ fontSize: 11, color: "#7C8DB5" }}>Best value</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1740A6" }}>$8.50</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid #E4EAF7", borderRadius: 14, padding: "10px 12px" }}>
                <div style={{ width: 60, height: 38, borderRadius: 8, background: "repeating-linear-gradient(135deg,#DFE7F7 0 5px,#F1F5FD 5px 10px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO_STACK, fontSize: 8, letterSpacing: ".08em", color: "#8595BA" }}>
                  SUV
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1740A6" }}>SafeRide XL</div>
                  <div style={{ fontSize: 11, color: "#7C8DB5" }}>For groups of 5 or more</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1740A6" }}>$14.20</div>
              </div>
            </div>
          </div>
        )}

        {rConfirm && (
          <div style={{ ...sheet, padding: "18px 18px 22px", gap: 14 }}>
            <div style={{ width: 38, height: 4, borderRadius: 4, background: "#DCE3F4", margin: "0 auto" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 74, height: 48, borderRadius: 10, background: "repeating-linear-gradient(135deg,#DFE7F7 0 5px,#F1F5FD 5px 10px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO_STACK, fontSize: 8, letterSpacing: ".08em", color: "#8595BA" }}>
                SEDAN
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ fontFamily: ARCHIVO, fontSize: 18, fontWeight: 600, color: "#1740A6" }}>SafeRide</div>
                <div style={{ fontSize: 11, color: "#7C8DB5" }}>Arrives in 4 min</div>
              </div>
              <div style={{ fontFamily: ARCHIVO, fontSize: 20, fontWeight: 700, color: "#1740A6" }}>$8.50</div>
            </div>
            <div style={{ height: 1, background: "#EDF1FA" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "#1740A6" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ width: 26, height: 18, borderRadius: 4, background: "#E4EAF7" }} />
                Visa ···· 4417
              </span>
              <span style={{ color: "#A7B4D2", fontSize: 12 }}>Change</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "#10B981" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981" }} />
              Promo GREEK10 applied
            </div>
            <div style={{ marginTop: 2, background: "#1740A6", color: "#FFFFFF", borderRadius: 14, padding: 15, textAlign: "center", fontFamily: ARCHIVO, fontSize: 15, fontWeight: 600, boxShadow: "0 10px 22px -8px rgba(23,64,166,.6)" }}>
              Request Ride - $8.50
            </div>
          </div>
        )}

        {rSearch && (
          <div style={{ ...sheet, padding: "34px 24px 30px", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative", width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ position: "absolute", width: 14, height: 14, borderRadius: "50%", background: "#1740A6", animation: "srPulse 2.4s ease-out infinite" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#1740A6" }} />
            </div>
            <div style={{ fontFamily: ARCHIVO, fontSize: 18, fontWeight: 600, color: "#1740A6", textAlign: "center" }}>
              Searching for a driver...
            </div>
            <div style={{ fontSize: 13, color: "#7C8DB5", textAlign: "center", lineHeight: 1.5 }}>1204 University Ave</div>
            <div style={{ marginTop: 6, width: "100%", textAlign: "center", border: "1px solid #F3D3D3", color: "#DC2626", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 600 }}>
              Cancel Request
            </div>
          </div>
        )}

        {rCode && (
          <div style={{ ...sheet, padding: "24px 20px 26px", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "repeating-linear-gradient(135deg,#DFE7F7 0 5px,#F1F5FD 5px 10px)" }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ fontFamily: ARCHIVO, fontSize: 16, fontWeight: 600, color: "#1740A6" }}>Marcus is on the way</div>
                <div style={{ fontSize: 11, color: "#7C8DB5" }}>Silver Camry · 4 min away</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 16, borderRadius: 16, background: "#F6F9FF", border: "1px solid #E4EAF7" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#8595BA" }}>
                Show your driver
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#1740A6", color: "#FFFFFF", borderRadius: 999, padding: "11px 26px", fontFamily: MONO_STACK, fontSize: 24, fontWeight: 500, letterSpacing: ".34em" }}>
                4826
              </div>
            </div>
          </div>
        )}

        {rDone && (
          <div style={{ position: "absolute", inset: "40px 0 0", background: "#FFFFFF", padding: "40px 22px 26px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ fontFamily: ARCHIVO, fontSize: 22, fontWeight: 700, color: "#1740A6", textAlign: "center", letterSpacing: "-.01em" }}>
              Your trip is complete
            </div>
            <div style={{ width: 76, height: 76, borderRadius: "50%", background: "repeating-linear-gradient(135deg,#DFE7F7 0 5px,#F1F5FD 5px 10px)", marginTop: 6 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1740A6" }}>Marcus · Silver Camry</div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              {[0, 1, 2, 3].map((s) => (
                <span key={s} style={{ fontSize: 26, color: "#1740A6", lineHeight: 1 }}>★</span>
              ))}
              <span style={{ fontSize: 26, color: "#C9D3EA", lineHeight: 1 }}>★</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: "#1740A6" }}>Add a tip for your driver</div>
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              <div style={{ flex: 1, textAlign: "center", border: "1px solid #DCE3F4", borderRadius: 12, padding: "11px 0", fontSize: 13, fontWeight: 600, color: "#1740A6" }}>$2</div>
              <div style={{ flex: 1, textAlign: "center", border: "1.5px solid #1740A6", background: "#F6F9FF", borderRadius: 12, padding: "11px 0", fontSize: 13, fontWeight: 700, color: "#1740A6" }}>$3</div>
              <div style={{ flex: 1, textAlign: "center", border: "1px solid #DCE3F4", borderRadius: 12, padding: "11px 0", fontSize: 13, fontWeight: 600, color: "#1740A6" }}>$5</div>
            </div>
            <div style={{ display: "flex", gap: 10, width: "100%", marginTop: "auto" }}>
              <div style={{ flex: 1, textAlign: "center", borderRadius: 14, padding: "14px 0", fontSize: 14, fontWeight: 600, color: "#7C8DB5" }}>Skip</div>
              <div style={{ flex: 2, textAlign: "center", borderRadius: 14, padding: "14px 0", fontSize: 14, fontWeight: 600, color: "#FFFFFF", background: "#1740A6", boxShadow: "0 10px 22px -8px rgba(23,64,166,.6)" }}>Done</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Driver phone                                                        */
/* ------------------------------------------------------------------ */

function DriverPhone({
  idx,
  countdown,
  countdownPct,
  driverMapSat,
}: {
  idx: number;
  countdown: string;
  countdownPct: number;
  driverMapSat: number;
}) {
  const dOffline = idx <= 2;
  const dRequest = idx === 3;
  const dPickup = idx === 4;
  const dDone = idx === 5;

  const sheet: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    background: "#FFFFFF",
    borderRadius: "26px 26px 36px 36px",
    boxShadow: "0 -12px 40px rgba(23,64,166,.14)",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div
      style={{
        width: 300,
        height: 616,
        borderRadius: 44,
        background: "linear-gradient(200deg, #F2F5FC, #DCE4F5)",
        padding: 9,
        boxShadow:
          "0 40px 80px -28px rgba(23,64,166,.34), 0 6px 18px rgba(23,64,166,.10), inset 0 1px 0 #fff",
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: 36, background: "#FFFFFF", overflow: "hidden", position: "relative", border: "1px solid #E4EAF7" }}>
        <div style={{ position: "absolute", inset: 0, background: "#EFF3FC" }}>
          <svg
            viewBox="0 0 282 598"
            preserveAspectRatio="xMidYMid slice"
            style={{ width: "100%", height: "100%", display: "block", filter: `saturate(${driverMapSat})` }}
          >
            <rect x="0" y="0" width="282" height="598" fill="#EFF3FC" />
            <rect x="10" y="40" width="120" height="130" rx="6" fill="#E2E9F8" />
            <rect x="170" y="70" width="140" height="110" rx="6" fill="#E5EBF9" />
            <rect x="-10" y="230" width="140" height="160" rx="6" fill="#E5EBF9" />
            <rect x="180" y="240" width="130" height="150" rx="6" fill="#E2E9F8" />
            <rect x="30" y="450" width="220" height="150" rx="6" fill="#E5EBF9" />
            <rect x="0" y="196" width="282" height="16" fill="#FFFFFF" />
            <rect x="0" y="410" width="282" height="16" fill="#FFFFFF" />
            <rect x="142" y="0" width="14" height="598" fill="#FFFFFF" />
            <circle cx="149" cy="330" r="9" fill="#1740A6" stroke="#FFFFFF" strokeWidth="4" />
          </svg>
        </div>

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", fontSize: 12, fontWeight: 600, color: "#1740A6" }}>
          <span>9:41</span>
          <span style={{ fontFamily: MONO_STACK, letterSpacing: ".12em" }}>DRIVER</span>
        </div>

        {dOffline && (
          <div>
            <div style={{ position: "absolute", inset: 0, background: "rgba(232,236,246,.55)" }} />
            <div style={{ ...sheet, padding: "26px 22px 28px", alignItems: "center", gap: 14 }}>
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 12, border: "1px solid #DCE3F4", borderRadius: 999, padding: "8px 8px 8px 20px", background: "#F8FAFE" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1740A6" }}>Go Online</span>
                <span style={{ width: 46, height: 26, borderRadius: 999, background: "#DCE3F4", display: "flex", alignItems: "center", padding: 3 }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 1px 3px rgba(23,64,166,.3)" }} />
                </span>
              </div>
            </div>
          </div>
        )}

        {dRequest && (
          <div style={{ position: "absolute", left: 14, right: 14, top: 74, background: "#FFFFFF", borderRadius: 22, padding: 18, boxShadow: "0 26px 54px -18px rgba(23,64,166,.34)", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#8595BA" }}>
                Time to respond
              </span>
              <span style={{ fontFamily: MONO_STACK, fontSize: 15, fontWeight: 500, color: "#F59E0B" }}>{countdown}</span>
            </div>
            <div style={{ height: 3, borderRadius: 3, background: "#F1F0EA", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${countdownPct}%`, background: "#F59E0B", transition: "width .3s linear" }} />
            </div>
            <div style={{ fontFamily: ARCHIVO, fontSize: 32, fontWeight: 700, color: "#1740A6", letterSpacing: "-.02em" }}>
              {"You'll earn $6.80"}
            </div>
            <div style={{ fontSize: 11, color: "#8595BA", marginTop: -6 }}>Base fare — any bonuses paid separately</div>
            <div style={{ height: 1, background: "#EDF1FA" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#8595BA", width: 54 }}>Pickup:</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "#1740A6" }}>Kappa House, 412 Greek Row</span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#8595BA", width: 54 }}>Dropoff:</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "#1740A6" }}>1204 University Ave</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#5A6B92" }}>1 Rider</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 2 }}>
              <div style={{ textAlign: "center", background: "#1740A6", color: "#FFFFFF", borderRadius: 14, padding: 14, fontFamily: ARCHIVO, fontSize: 15, fontWeight: 600, boxShadow: "0 10px 22px -8px rgba(23,64,166,.6)" }}>
                Accept
              </div>
              <div style={{ textAlign: "center", border: "1px solid #F3D3D3", color: "#DC2626", borderRadius: 14, padding: 12, fontSize: 14, fontWeight: 600 }}>
                Decline
              </div>
            </div>
          </div>
        )}

        {dPickup && (
          <div style={{ ...sheet, padding: "20px 20px 24px", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#8595BA" }}>
                HEAD TO PICKUP
              </div>
              <div style={{ fontFamily: ARCHIVO, fontSize: 17, fontWeight: 600, color: "#1740A6" }}>Kappa House, 412 Greek Row</div>
              <div style={{ fontSize: 12, color: "#7C8DB5" }}>4 min · 1.2 mi</div>
            </div>
            <div style={{ height: 1, background: "#EDF1FA" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#8595BA" }}>
                {"RIDER'S CODE"}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["4", "8", "2"].map((d) => (
                  <div key={d} style={{ flex: 1, aspectRatio: "1 / 1.15", border: "1px solid #DCE3F4", borderRadius: 12, background: "#F8FAFE", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO_STACK, fontSize: 22, color: "#1740A6" }}>
                    {d}
                  </div>
                ))}
                <div style={{ flex: 1, aspectRatio: "1 / 1.15", border: "1.5px solid #1740A6", borderRadius: 12, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO_STACK, fontSize: 22, color: "#1740A6" }}>
                  6
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center", background: "#1740A6", color: "#FFFFFF", borderRadius: 14, padding: 14, fontFamily: ARCHIVO, fontSize: 15, fontWeight: 600, boxShadow: "0 10px 22px -8px rgba(23,64,166,.6)" }}>
              Verify
            </div>
          </div>
        )}

        {dDone && (
          <div style={{ ...sheet, padding: "26px 22px 28px", alignItems: "center", gap: 10 }}>
            <div style={{ fontFamily: ARCHIVO, fontSize: 18, fontWeight: 600, color: "#1740A6" }}>Trip complete</div>
            <div style={{ fontSize: 12, color: "#8595BA", textAlign: "center" }}>Dropped off at 1204 University Ave</div>
            <div style={{ marginTop: 10, width: "100%", textAlign: "center", border: "1px solid #DCE3F4", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 600, color: "#1740A6" }}>
              Go Offline
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Center campus map                                                   */
/* ------------------------------------------------------------------ */

function CenterMap({
  routeOffset,
  carVisible,
  carX,
  carY,
  mapStatus,
}: {
  routeOffset: number;
  carVisible: boolean;
  carX: number;
  carY: number;
  mapStatus: string;
}) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 430 }}>
      <div style={{ position: "absolute", inset: "26px 14px -18px", borderRadius: 32, background: "#E9EEFA", filter: "blur(2px)" }} />
      <div style={{ position: "absolute", inset: "13px 7px -8px", borderRadius: 30, background: "#F2F5FC" }} />
      <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", background: "#FFFFFF", boxShadow: "0 34px 70px -26px rgba(23,64,166,.30), 0 2px 6px rgba(23,64,166,.08)" }}>
        <svg viewBox="0 0 420 620" style={{ width: "100%", height: "auto", display: "block" }}>
          <rect x="0" y="0" width="420" height="620" fill="#F7F9FE" />
          <rect x="24" y="40" width="150" height="120" rx="10" fill="#E9EEFA" />
          <rect x="212" y="28" width="184" height="96" rx="10" fill="#EDF1FB" />
          <rect x="24" y="200" width="112" height="146" rx="10" fill="#EDF1FB" />
          <rect x="256" y="164" width="140" height="182" rx="10" fill="#E9EEFA" />
          <rect x="24" y="386" width="176" height="126" rx="10" fill="#EDF1FB" />
          <rect x="244" y="386" width="152" height="196" rx="10" fill="#E9EEFA" />
          <rect x="60" y="544" width="120" height="52" rx="10" fill="#EDF1FB" />
          <g stroke="#FFFFFF" strokeWidth="16" strokeLinecap="square">
            <line x1="0" y1="182" x2="420" y2="182" />
            <line x1="0" y1="366" x2="420" y2="366" />
            <line x1="0" y1="528" x2="420" y2="528" />
            <line x1="152" y1="0" x2="152" y2="620" />
            <line x1="228" y1="0" x2="228" y2="620" />
          </g>
          <g stroke="#EEF2FB" strokeWidth="1">
            <line x1="0" y1="182" x2="420" y2="182" />
            <line x1="0" y1="366" x2="420" y2="366" />
          </g>
          <rect x="272" y="196" width="108" height="120" rx="8" fill="#DFE7F7" />
          <circle cx="326" cy="256" r="34" fill="#F7F9FE" />
          <g fontFamily={MONO_STACK} fontSize="9" letterSpacing="1.6" fill="#9AA9CB">
            <text x="40" y="70">GREEK ROW</text>
            <text x="272" y="404">CAMPUS QUAD</text>
            <text x="286" y="188">STADIUM</text>
            <text x="40" y="410">DOWNTOWN</text>
          </g>
          <path d="M120 455 L120 380 L215 380 L215 250 L300 250 L300 175" fill="none" stroke="#DCE3F4" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M120 455 L120 380 L215 380 L215 250 L300 250 L300 175"
            fill="none"
            stroke="#1740A6"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset={routeOffset}
            style={{ transition: "stroke-dashoffset .35s linear" }}
          />
          <circle cx="300" cy="175" r="9" fill="#FFFFFF" stroke="#1740A6" strokeWidth="4" />
          <circle cx="120" cy="455" r="13" fill="#1740A6" opacity=".16" />
          <circle cx="120" cy="455" r="7" fill="#1740A6" stroke="#FFFFFF" strokeWidth="3" />
          {carVisible && (
            <g>
              <circle cx={carX} cy={carY} r="16" fill="#1740A6" opacity=".12" />
              <circle cx={carX} cy={carY} r="8" fill="#1740A6" stroke="#FFFFFF" strokeWidth="3" />
            </g>
          )}
        </svg>
        <div style={{ position: "absolute", left: 18, bottom: 18, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.92)", border: "1px solid #E4EAF7", borderRadius: 999, padding: "8px 16px", fontFamily: MONO_STACK, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "#5A6B92" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1740A6" }} />
          {mapStatus}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SectionHeader() {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "132px 48px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ fontFamily: MONO_STACK, fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#7C8DB5" }}>
        SafeRides
      </div>
      <h2 style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 64, lineHeight: 1.03, letterSpacing: "-.025em", margin: 0, color: "#1740A6", maxWidth: "16ch" }}>
        How SafeRides Works
      </h2>
      <p style={{ margin: 0, maxWidth: "46ch", fontSize: 18, lineHeight: 1.6, color: "#5A6B92" }}>
        {"Two taps to a verified driver. Scroll to follow one ride from request to arrival — the rider's screen on the left, the driver's on the right."}
      </p>
    </div>
  );
}

function Rule() {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 48px 140px", display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ height: 1, flex: 1, background: "#E4EAF7" }} />
      <div style={{ fontFamily: MONO_STACK, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#A7B4D2", textAlign: "center" }}>
        Verified drivers · Coded pickups · Flat campus pricing
      </div>
      <div style={{ height: 1, flex: 1, background: "#E4EAF7" }} />
    </div>
  );
}

export default function HowItWorksScroll() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [state, setState] = useState({
    idx: 0,
    local: 0,
    vh: typeof window !== "undefined" ? window.innerHeight : 900,
  });

  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 767px)");

  const measure = useCallback(() => {
    const n = scrollRef.current;
    if (!n) return;
    const total = n.offsetHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, -n.getBoundingClientRect().top / Math.max(1, total)));
    const raw = p * 6;
    const idx = Math.min(5, Math.floor(raw));
    const local = Math.min(1, raw - idx);
    const vh = window.innerHeight;
    setState((prev) =>
      prev.idx !== idx || Math.abs(local - prev.local) > 0.01 || prev.vh !== vh
        ? { idx, local, vh }
        : prev,
    );
  }, []);

  useEffect(() => {
    // Reduced motion serves the static stacked variant, which has no tall
    // container and no sticky stage, so there is nothing to measure.
    if (reducedMotion) return;
    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        measure();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [measure, reducedMotion]);

  const { idx, local, vh } = state;
  const riderActive = idx <= 2 || idx === 5;
  const step = STEPS[idx];

  const routeT = idx < 4 ? 0 : idx === 4 ? Math.min(1, local * 1.5) : 1;
  const car = carAt(idx === 5 ? 1 : routeT);
  const secs = idx === 3 ? Math.max(0, Math.ceil(15 - local * 15)) : 15;
  const stageScale = Math.max(0.55, Math.min(1, (vh - 150) / 700));

  const countdown = "0:" + String(secs).padStart(2, "0");
  const countdownPct = (secs / 15) * 100;
  const mapStatus =
    idx <= 2 ? "Awaiting driver" : idx === 3 ? "Request sent" : idx === 4 ? "Driver en route" : "Trip complete";

  /* --- Reduced motion: all six beats stacked, fully readable --------- */
  if (reducedMotion) {
    return (
      <section id="see-how-it-works" style={{ fontFamily: MONO_STACK, background: "#FFFFFF", overflowX: "clip" }}>
        <SectionHeader />
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 48px", display: "flex", flexDirection: "column", gap: 72 }}>
          {STEPS.map(([num, title, body], i) => (
            <div key={num} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
                <span style={{ fontFamily: MONO_STACK, fontSize: 12, letterSpacing: ".18em", color: "#A7B4D2" }}>{num}</span>
                <span style={{ fontFamily: ARCHIVO, fontSize: 22, fontWeight: 600, color: "#1740A6", letterSpacing: "-.01em" }}>{title}</span>
                <span style={{ fontSize: 15, color: "#7C8DB5", lineHeight: 1.5 }}>{body}</span>
              </div>
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
                <RiderPhone idx={i} />
                <DriverPhone
                  idx={i}
                  countdown={i === 3 ? "0:15" : "0:15"}
                  countdownPct={100}
                  driverMapSat={i <= 2 ? 0.15 : 1}
                />
              </div>
            </div>
          ))}
        </div>
        <Rule />
      </section>
    );
  }

  /* --- Mobile: single column, one phone at a time -------------------- */
  if (isMobile) {
    return (
      <section id="see-how-it-works" style={{ fontFamily: MONO_STACK, background: "#FFFFFF", overflowX: "clip" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontFamily: MONO_STACK, fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: "#7C8DB5" }}>
            SafeRides
          </div>
          <h2 style={{ fontFamily: ARCHIVO, fontWeight: 700, fontSize: 34, lineHeight: 1.05, letterSpacing: "-.02em", margin: 0, color: "#1740A6" }}>
            How SafeRides Works
          </h2>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "#5A6B92" }}>
            {"Two taps to a verified driver. Scroll to follow one ride from request to arrival."}
          </p>
        </div>

        <div ref={scrollRef} style={{ height: "560vh", position: "relative" }}>
          <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, overflow: "hidden", padding: "0 16px" }}>
            <div style={{ transform: `scale(${Math.max(0.5, Math.min(0.92, (vh - 210) / 700))})`, transformOrigin: "center center" }}>
              {riderActive ? (
                <RiderPhone idx={idx} />
              ) : (
                <DriverPhone idx={idx} countdown={countdown} countdownPct={countdownPct} driverMapSat={idx <= 2 ? 0.15 : 1} />
              )}
            </div>
            <div style={{ flex: "0 0 auto", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, paddingBottom: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" }}>
                <span style={{ fontFamily: MONO_STACK, fontSize: 11, letterSpacing: ".18em", color: "#A7B4D2" }}>{step[0]}</span>
                <span style={{ fontFamily: ARCHIVO, fontSize: 18, fontWeight: 600, color: "#1740A6" }}>{step[1]}</span>
                <span style={{ fontSize: 13, color: "#7C8DB5", lineHeight: 1.5 }}>{step[2]}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {STEPS.map((s, i) => (
                  <div
                    key={s[0]}
                    style={{
                      height: 3,
                      borderRadius: 3,
                      width: i === idx ? 44 : 18,
                      background: i === idx ? "#1740A6" : i < idx ? "#9AB0DE" : "#DCE3F4",
                      transition: "width .5s cubic-bezier(.4,0,.2,1), background .5s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 20px 72px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ height: 1, flex: 1, background: "#E4EAF7" }} />
          <div style={{ fontFamily: MONO_STACK, fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: "#A7B4D2", textAlign: "center" }}>
            Verified drivers · Coded pickups · Flat campus pricing
          </div>
          <div style={{ height: 1, flex: 1, background: "#E4EAF7" }} />
        </div>
      </section>
    );
  }

  /* --- Desktop: the reference ---------------------------------------- */
  return (
    <section id="see-how-it-works" style={{ fontFamily: MONO_STACK, background: "#FFFFFF", overflowX: "clip" }}>
      <SectionHeader />

      <div ref={scrollRef} style={{ height: "660vh", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, overflow: "hidden" }}>
          <div style={{ flex: "1 1 auto", minHeight: 0, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: 1420, padding: "0 40px", display: "grid", gridTemplateColumns: "1fr 1.02fr 1fr", alignItems: "center", gap: 28, transform: `scale(${stageScale})`, transformOrigin: "center center" }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ opacity: riderActive ? 1 : 0.5, transform: `perspective(1600px) rotateY(11deg) rotateX(1.5deg) scale(${riderActive ? 1 : 0.965})`, transition: "opacity .7s cubic-bezier(.4,0,.2,1), transform .9s cubic-bezier(.4,0,.2,1)" }}>
                  <RiderPhone idx={idx} />
                  <div style={{ marginTop: 22, textAlign: "center", fontFamily: MONO_STACK, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#A7B4D2" }}>
                    Rider
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <CenterMap routeOffset={100 - routeT * 100} carVisible={idx >= 4} carX={car[0]} carY={car[1]} mapStatus={mapStatus} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ opacity: riderActive ? (idx === 5 ? 0.62 : 0.42) : 1, transform: `perspective(1600px) rotateY(-11deg) rotateX(1.5deg) scale(${riderActive ? 0.965 : 1})`, transition: "opacity .7s cubic-bezier(.4,0,.2,1), transform .9s cubic-bezier(.4,0,.2,1)" }}>
                  <DriverPhone idx={idx} countdown={countdown} countdownPct={countdownPct} driverMapSat={idx <= 2 ? 0.15 : 1} />
                  <div style={{ marginTop: 22, textAlign: "center", fontFamily: MONO_STACK, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#A7B4D2" }}>
                    Driver
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ flex: "0 0 auto", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "0 40px 34px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, maxWidth: 760 }}>
              <span style={{ fontFamily: MONO_STACK, fontSize: 12, letterSpacing: ".18em", color: "#A7B4D2" }}>{step[0]}</span>
              <span style={{ fontFamily: ARCHIVO, fontSize: 22, fontWeight: 600, color: "#1740A6", letterSpacing: "-.01em" }}>{step[1]}</span>
              <span style={{ fontSize: 15, color: "#7C8DB5", lineHeight: 1.5 }}>{step[2]}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {STEPS.map((s, i) => (
                <div
                  key={s[0]}
                  style={{
                    height: 3,
                    borderRadius: 3,
                    width: i === idx ? 44 : 18,
                    background: i === idx ? "#1740A6" : i < idx ? "#9AB0DE" : "#DCE3F4",
                    transition: "width .5s cubic-bezier(.4,0,.2,1), background .5s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Rule />
    </section>
  );
}
