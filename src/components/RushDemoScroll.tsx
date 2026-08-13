import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Ported from the "Rush Demo Section" design export.
 *
 * The scroll math, spacing, sizing, shadows and phone angles are carried over
 * from that file unchanged — the exact values are the approved design, so the
 * inline styles are kept inline rather than translated to Tailwind. Four
 * deliberate departures from the reference:
 *
 *   1. Its two dark tones (#14203A, #24314D) are near-black. Replaced with
 *      blue-grays in the Royal Blue family at the same visual weight.
 *   2. It set body copy and labels in Archivo and headings in Inter, which is
 *      backwards. Archivo is headings only here; everything else is Inter.
 *   3. The scroll handler is wrapped in requestAnimationFrame, so a fast scroll
 *      cannot queue a state update per raw event.
 *   4. The countdown interval is cleared on unmount.
 *
 * Two things the reference does not handle at all are added: a static stacked
 * rendering for prefers-reduced-motion, and a single-column layout under 768px.
 */

/* Replaces #14203A — headings and strong labels. */
const INK = "#1B2E63";
/* Replaces #24314D — the section's base text colour. */
const INK_BODY = "#2C3E70";
/* Carried over from the reference unchanged. */
const MUTED = "#5A6782";
const FAINT = "#8A94AB";
const LINE = "#E4E9F2";
const BRAND = "#1740A6";

/** The scroll track runs four beats, one per screen. */
const BEATS = 4;
/** Countdown ceiling, and the value it resets to. From the reference. */
const COUNT_FROM = 14;
/** The countdown floor — it resets rather than reaching zero. */
const COUNT_FLOOR = 5;

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(query).matches
      : false,
  );
  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    // Resize is a belt-and-braces fallback: a viewport that changes without
    // firing a matchMedia change event would otherwise leave the desktop
    // layout in place at phone width, which overflows horizontally.
    window.addEventListener("resize", onChange);
    return () => {
      mql.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [query]);
  return matches;
}

/* ---------------------------------------------------------------------- */
/* Phone screens                                                           */
/* ---------------------------------------------------------------------- */

/**
 * Every string rendered inside a phone frame is the copy the real app shows.
 * They are verified against the Driver and Rider source and must not be
 * reworded here — the point of the frames is that a chairman recognises them.
 */
function screenStyle(on: boolean, animate: boolean): CSSProperties {
  if (!animate) {
    return { position: "absolute", inset: 0, opacity: on ? 1 : 0 };
  }
  return {
    position: "absolute",
    inset: 0,
    transition: "opacity .55s ease, transform .55s cubic-bezier(.22,.61,.36,1)",
    opacity: on ? 1 : 0,
    transform: on ? "translateY(0)" : "translateY(14px)",
    pointerEvents: on ? "auto" : "none",
  };
}

/** Beat 1 — the organization picker in Driver signup. */
function ScreenOrg({ style }: { style: CSSProperties }) {
  return (
    <div style={style}>
      <div
        style={{
          padding: "58px 20px 0",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 20, color: INK }}>
          Driver signup
        </div>
        <div style={{ fontSize: 13, color: FAINT, marginTop: 4 }}>Step 3 of 4</div>
        <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 15, color: INK, marginTop: 28 }}>
          Organization
        </div>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "16px 14px",
            border: `1.5px solid ${BRAND}`,
            borderRadius: 14,
            background: "#F5F7FB",
          }}
        >
          <span style={{ fontSize: 15, color: MUTED }}>Select organization (optional)</span>
          <span style={{ fontSize: 18, color: BRAND, lineHeight: 1 }}>{"›"}</span>
        </div>
        <div
          style={{
            marginTop: "auto",
            marginBottom: 0,
            borderRadius: "24px 24px 0 0",
            background: "#FFFFFF",
            boxShadow: "0 -18px 40px -16px rgba(42,55,87,.32)",
            padding: "14px 16px 24px",
            borderTop: `1px solid ${LINE}`,
            height: 300,
            boxSizing: "border-box",
          }}
        >
          <div style={{ width: 44, height: 4, borderRadius: 2, background: LINE, margin: "0 auto 16px" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 12,
              background: "#F5F7FB",
              border: `1px solid ${LINE}`,
            }}
          >
            <div style={{ width: 13, height: 13, borderRadius: "50%", border: `2px solid ${FAINT}` }} />
            <span style={{ fontSize: 15, color: FAINT }}>Search organizations...</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 12 }}>
            <div style={{ padding: "14px 4px", fontSize: 15, fontWeight: 600, color: INK, borderBottom: "1px solid #EEF1F7" }}>
              Theta Chi
            </div>
            <div style={{ padding: "14px 4px", fontSize: 15, color: FAINT, borderBottom: "1px solid #EEF1F7" }}>
              Sigma Nu
            </div>
            <div style={{ padding: "14px 4px", fontSize: 15, color: FAINT }}>Kappa Sigma</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The map backdrop shared by the go-online and request screens. */
function MapBackdrop() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#EAF0F8",
          backgroundImage:
            "linear-gradient(#DCE5F2 1px, transparent 1px), linear-gradient(90deg, #DCE5F2 1px, transparent 1px)",
          backgroundSize: "58px 58px",
        }}
      />
      <div style={{ position: "absolute", top: 0, left: "34%", width: 26, height: "100%", background: "#FFFFFF" }} />
      <div style={{ position: "absolute", left: 0, top: "46%", width: "100%", height: 30, background: "#FFFFFF" }} />
    </>
  );
}

/** Beat 2 — going online. */
function ScreenOnline({ style }: { style: CSSProperties }) {
  return (
    <div style={style}>
      <MapBackdrop />
      <div style={{ position: "absolute", left: 0, top: "74%", width: "100%", height: 14, background: "#F6F9FD" }} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: 22,
          height: 22,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(23,64,166,.35)",
            animation: "srPulseRush 2.4s ease-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: BRAND,
            border: "3px solid #FFFFFF",
            boxShadow: "0 4px 12px rgba(23,64,166,.45)",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 34, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "18px 46px",
            borderRadius: 999,
            background: BRAND,
            color: "#FFFFFF",
            fontFamily: "Archivo, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: ".01em",
            boxShadow: "0 16px 30px -10px rgba(23,64,166,.6)",
          }}
        >
          Go Online
        </div>
      </div>
    </div>
  );
}

/** Beat 3 — the ride-mode picker. */
function ScreenMode({ style }: { style: CSSProperties }) {
  return (
    <div style={style}>
      <div style={{ padding: "58px 18px 0" }}>
        <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 20, color: INK }}>
          Select ride mode
        </div>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ border: `1px solid ${LINE}`, borderRadius: 16, padding: 16, background: "#FFFFFF", opacity: 0.55 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #C3CCDD", flex: "none" }} />
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 15, color: INK }}>
                All SafeRides Requests
              </div>
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.45, color: MUTED, marginTop: 8, paddingLeft: 28 }}>
              Receive eligible ride requests from all riders that match your driver profile and current location.
            </div>
          </div>
          <div
            style={{
              border: `2px solid ${BRAND}`,
              borderRadius: 16,
              padding: 16,
              background: "#F2F6FF",
              boxShadow: "0 14px 28px -14px rgba(23,64,166,.45)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: `5px solid ${BRAND}`, background: "#FFFFFF", flex: "none" }} />
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15, color: BRAND }}>
                PNM Pickup &mdash; Theta Chi
              </div>
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.45, color: "#3C4A66", marginTop: 8, paddingLeft: 28 }}>
              Rush week only. While in this mode you'll receive ONLY Theta Chi rush requests &mdash; no normal or golf
              cart rides.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Beat 4 — online in PNM mode, with the request card. */
function ScreenRequest({
  style,
  secs,
  cardOn,
  animate,
}: {
  style: CSSProperties;
  secs: number;
  cardOn: boolean;
  animate: boolean;
}) {
  const cardStyle: CSSProperties = {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 16,
    borderRadius: 20,
    background: "#FFFFFF",
    padding: 16,
    boxShadow: "0 -6px 40px -12px rgba(42,55,87,.4)",
    border: `1px solid ${LINE}`,
    opacity: cardOn ? 1 : 0,
    ...(animate
      ? {
          transform: cardOn ? "translateY(0)" : "translateY(28px)",
          transition: "opacity .5s ease .5s, transform .6s cubic-bezier(.22,.61,.36,1) .5s",
        }
      : {}),
  };

  return (
    <div style={style}>
      <MapBackdrop />
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 14,
          right: 14,
          borderRadius: 16,
          background: BRAND,
          color: "#FFFFFF",
          padding: "14px 16px",
          boxShadow: "0 16px 30px -14px rgba(23,64,166,.6)",
        }}
      >
        <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15 }}>
          PNM Pickup &mdash; Theta Chi
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.45, marginTop: 6, color: "#D5E0F7" }}>
          You're only receiving rush requests from Theta Chi PNMs. Normal and golf cart rides are paused. Go offline to
          switch modes.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 14,
          right: 14,
          textAlign: "center",
          fontSize: 12,
          lineHeight: 1.45,
          color: MUTED,
        }}
      >
        Requests can take a few minutes. That's normal.
      </div>
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: MUTED }}>Time to respond</span>
          <span
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: secs <= 8 ? "#DC2626" : "#F59E0B",
            }}
          >
            {`0:${String(secs).padStart(2, "0")}`}
          </span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: "#F0F3F9", marginTop: 8, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              background: "#F59E0B",
              transition: "width 1s linear",
              width: `${(secs / COUNT_FROM) * 100}%`,
            }}
          />
        </div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: BRAND, marginTop: 5, flex: "none" }} />
            <div>
              <div style={{ fontSize: 11, color: FAINT }}>Pickup:</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>Riverside Hall</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, background: MUTED, marginTop: 5, flex: "none" }} />
            <div>
              <div style={{ fontSize: 11, color: FAINT }}>Dropoff:</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>Theta Chi House</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, fontWeight: 600, color: MUTED }}>1 Rider</div>
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 10 }}>
          <div
            style={{
              textAlign: "center",
              padding: "14px 0",
              borderRadius: 12,
              border: "1.5px solid #DC2626",
              color: "#DC2626",
              fontFamily: "Archivo, sans-serif",
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Decline
          </div>
          <div
            style={{
              textAlign: "center",
              padding: "14px 0",
              borderRadius: 12,
              background: BRAND,
              color: "#FFFFFF",
              fontFamily: "Archivo, sans-serif",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Accept
          </div>
        </div>
      </div>
    </div>
  );
}

/** The bezel. `tilt` is dropped on small screens, where it costs more than it adds. */
function PhoneFrame({ children, tilt }: { children: React.ReactNode; tilt: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        width: 320,
        height: 660,
        borderRadius: 44,
        background: "#2A3757",
        padding: 11,
        transform: tilt ? "rotate(-4deg) rotateY(9deg)" : "none",
        boxShadow: "0 50px 90px -28px rgba(23,64,166,.38), 0 12px 28px -12px rgba(42,55,87,.28)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          width: 104,
          height: 26,
          borderRadius: 14,
          background: "#2A3757",
          zIndex: 9,
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 34,
          overflow: "hidden",
          background: "#FFFFFF",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function PhoneScreens({
  beat,
  secs,
  animate,
}: {
  beat: number;
  secs: number;
  animate: boolean;
}) {
  return (
    <>
      <ScreenOrg style={screenStyle(beat === 0, animate)} />
      <ScreenOnline style={screenStyle(beat === 1, animate)} />
      <ScreenMode style={screenStyle(beat === 2, animate)} />
      <ScreenRequest
        style={screenStyle(beat === 3, animate)}
        secs={secs}
        cardOn={beat === 3}
        animate={animate}
      />
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Step list                                                               */
/* ---------------------------------------------------------------------- */

const STEPS = [
  { title: "Pick your chapter", body: "Search it once during signup." },
  { title: "Go online", body: "One button. You're driving." },
  { title: "Choose PNM mode", body: "Rush requests only. Nothing else." },
  { title: "Wait, then accept", body: "A few quiet minutes is normal. Then a card pops." },
];

function StepRow({ index, active, last }: { index: number; active: boolean; last: boolean }) {
  const step = STEPS[index];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "44px 1fr",
        gap: 16,
        alignItems: "start",
        padding: "clamp(8px, 1.5vh, 16px) 0",
        borderTop: `1px solid ${LINE}`,
        ...(last ? { borderBottom: `1px solid ${LINE}` } : {}),
      }}
    >
      <div
        style={{
          height: 44,
          width: 44,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Archivo, sans-serif",
          fontWeight: 700,
          fontSize: 16,
          transition: "background .45s ease, color .45s ease",
          background: active ? BRAND : "#EDF1F8",
          color: active ? "#FFFFFF" : FAINT,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div>
        <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 19, color: INK }}>
          {step.title}
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.45, color: MUTED, marginTop: 2 }}>{step.body}</div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: BRAND,
        }}
      >
        For the brother driving
      </div>
      <h2
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 700,
          fontSize: "clamp(30px, 3.2vw, 46px)",
          lineHeight: 1.05,
          letterSpacing: "-.02em",
          margin: 0,
          color: INK,
          textWrap: "pretty",
        }}
      >
        Four taps to drive rush.
      </h2>
      <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: MUTED, maxWidth: "30ch" }}>
        Set your chapter once. Then pick up only your own PNMs.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Section                                                                 */
/* ---------------------------------------------------------------------- */

export default function RushDemoScroll() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [beat, setBeat] = useState(0);
  const [secs, setSecs] = useState(COUNT_FROM);
  const [scale, setScale] = useState(1);

  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isNarrow = useMediaQuery("(max-width: 767px)");
  /* The scroll track only exists when it can actually animate. */
  const scrollDriven = !reduceMotion;

  useEffect(() => {
    if (!scrollDriven) return;
    let frame = 0;

    // The reference recomputed on every raw scroll event. Coalescing into one
    // rAF keeps a fast scroll to at most one state update per frame.
    const measure = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      const nextBeat = Math.min(BEATS - 1, Math.floor(p * 4.0001));
      const nextScale = Math.max(0.5, Math.min(1, (window.innerHeight - 72) / 680));
      setBeat((current) => {
        if (current === nextBeat) return current;
        setSecs(COUNT_FROM);
        return nextBeat;
      });
      setScale((current) => (Math.abs(nextScale - current) > 0.005 ? nextScale : current));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [scrollDriven]);

  useEffect(() => {
    if (!scrollDriven) return;
    const timer = window.setInterval(() => {
      // Only the request screen runs a countdown.
      setBeat((currentBeat) => {
        if (currentBeat === BEATS - 1) {
          setSecs((s) => (s > COUNT_FLOOR ? s - 1 : COUNT_FROM));
        }
        return currentBeat;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [scrollDriven]);

  /* Reduced motion: every beat stacked and fully readable, no tall track. */
  if (reduceMotion) {
    return (
      <section
        style={{
          fontFamily: "Inter, sans-serif",
          color: INK_BODY,
          background: "#FFFFFF",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "80px 32px" }}>
          <Heading />
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 56 }}>
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                style={{
                  display: "grid",
                  gridTemplateColumns: isNarrow ? "1fr" : "1fr 380px",
                  gap: isNarrow ? 28 : 64,
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <StepRow index={i} active last={i === STEPS.length - 1} />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <PhoneFrame tilt={false}>
                    <PhoneScreens beat={i} secs={COUNT_FROM} animate={false} />
                  </PhoneFrame>
                </div>
              </div>
            ))}
          </div>
        </div>
        <PnmPanel narrow={isNarrow} />
        <AssuranceBar />
      </section>
    );
  }

  return (
    <section
      style={{
        fontFamily: "Inter, sans-serif",
        color: INK_BODY,
        background: "#FFFFFF",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div
        ref={trackRef}
        style={{
          position: "relative",
          height: "420vh",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F5F7FB 22%, #F5F7FB 78%, #FFFFFF 100%)",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            alignItems: "center",
            /* `clip` rather than `hidden`: `hidden` on an ancestor silently
               kills the sticky positioning this whole section depends on. */
            overflowX: "clip",
            overflowY: "visible",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1180,
              margin: "0 auto",
              padding: isNarrow ? "0 20px" : "0 32px",
              display: "grid",
              gridTemplateColumns: isNarrow ? "1fr" : "1fr 380px",
              gap: isNarrow ? 24 : 64,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <Heading />
              {/* Under 768px the phone is the story; the full step list would
                  push it off-screen, so only the live step is shown. */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {isNarrow ? (
                  <StepRow index={beat} active last />
                ) : (
                  STEPS.map((step, i) => (
                    <StepRow key={step.title} index={i} active={beat === i} last={i === STEPS.length - 1} />
                  ))
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div
                style={{
                  perspective: "1400px",
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                  width: 320,
                  height: 660,
                  flex: "none",
                }}
              >
                <PhoneFrame tilt={!isNarrow}>
                  <PhoneScreens beat={beat} secs={secs} animate />
                </PhoneFrame>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PnmPanel narrow={isNarrow} />
      <AssuranceBar />
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* What happens on the PNM's end                                           */
/* ---------------------------------------------------------------------- */

const PNM_STEPS = [
  "Download the SafeRides Rider app",
  "Tap the link your chapter sent you",
  "Request your ride",
];

function PnmPanel({ narrow }: { narrow: boolean }) {
  return (
    <div style={{ background: "#FFFFFF", padding: narrow ? "64px 20px 56px" : "96px 32px 80px" }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: narrow ? "1fr" : "1fr 340px",
          gap: narrow ? 40 : 64,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: BRAND,
            }}
          >
            On their end
          </div>
          <h2
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 700,
              fontSize: narrow ? 34 : 46,
              lineHeight: 1.05,
              letterSpacing: "-.02em",
              margin: "8px 0 0",
              color: INK,
            }}
          >
            Three steps. No cost.
          </h2>
          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: narrow ? "1fr" : "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {PNM_STEPS.map((label, i) => (
              <div key={label} style={{ border: `1px solid ${LINE}`, borderRadius: 18, padding: 22, background: "#F5F7FB" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: BRAND,
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Archivo, sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontWeight: 600,
                    fontSize: 18,
                    color: INK,
                    marginTop: 16,
                    lineHeight: 1.25,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", perspective: "1400px" }}>
          <div
            style={{
              position: "relative",
              width: 268,
              height: 552,
              borderRadius: 40,
              background: "#2A3757",
              padding: 10,
              transform: narrow ? "none" : "rotate(4deg) rotateY(-9deg)",
              boxShadow: "0 44px 80px -30px rgba(23,64,166,.38)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 22,
                left: "50%",
                transform: "translateX(-50%)",
                width: 88,
                height: 22,
                borderRadius: 12,
                background: "#2A3757",
                zIndex: 9,
              }}
            />
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: 31,
                overflow: "hidden",
                background: "#EAF0F8",
                backgroundImage:
                  "linear-gradient(#DCE5F2 1px, transparent 1px), linear-gradient(90deg, #DCE5F2 1px, transparent 1px)",
                backgroundSize: "52px 52px",
              }}
            >
              <div style={{ position: "absolute", top: 0, left: "40%", width: 22, height: "100%", background: "#FFFFFF" }} />
              <div style={{ position: "absolute", left: 0, top: "38%", width: "100%", height: 26, background: "#FFFFFF" }} />
              <div
                style={{
                  position: "absolute",
                  left: 10,
                  right: 10,
                  bottom: 14,
                  background: "#FFFFFF",
                  borderRadius: 20,
                  padding: 18,
                  border: `1px solid ${LINE}`,
                  boxShadow: "0 -6px 34px -14px rgba(42,55,87,.4)",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 17, color: INK }}>
                    Theta Chi rush ride
                  </div>
                  <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 20, color: BRAND }}>
                    Free
                  </div>
                </div>
                <div style={{ fontSize: 12.5, color: MUTED, marginTop: 6 }}>No charge during rush.</div>
                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "#F5F7FB",
                  }}
                >
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#D5E0F7" }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>Brother driver</div>
                    <div style={{ fontSize: 11.5, color: FAINT }}>Verified student</div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 14,
                    textAlign: "center",
                    padding: "14px 0",
                    borderRadius: 12,
                    background: BRAND,
                    color: "#FFFFFF",
                    fontFamily: "Archivo, sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  Request Ride
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ASSURANCES = [
  "Only your chapter's brothers see your request",
  "Drivers are verified students",
  "Every ride uses a 4-digit pickup code",
];

function AssuranceBar() {
  return (
    <div style={{ background: BRAND, color: "#FFFFFF", padding: "56px 32px" }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 40,
        }}
      >
        {ASSURANCES.map((line) => (
          <div key={line} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFFFFF", marginTop: 7, flex: "none" }} />
            <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 19, lineHeight: 1.3 }}>
              {line}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
