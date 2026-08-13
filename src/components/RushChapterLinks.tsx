import { useMemo, useRef, useState } from "react";

/**
 * The chapters SafeRides has enabled for rush mode, with the slug each one's
 * link uses. Every slug here is the exact value stored on that chapter's rush
 * config — a link resolves by matching this string, so nothing in this list may
 * be reformatted, abbreviated, or invented. A chapter that is not configured
 * server-side must not appear: its link would silently charge full fare.
 */
const CHAPTERS: ReadonlyArray<{ name: string; slug: string }> = [
  { name: "Alpha Epsilon Pi", slug: "alphaepsilonpi" },
  { name: "Alpha Sigma Phi", slug: "alphasigmaphi" },
  { name: "Beta Theta Pi", slug: "betathetapi" },
  { name: "Chi Psi", slug: "chipsi" },
  { name: "Delta Chi", slug: "deltachi" },
  { name: "Delta Kappa Epsilon", slug: "deltakappaepsilon" },
  { name: "Delta Sigma Phi", slug: "deltasigmaphi" },
  { name: "Delta Tau Delta", slug: "deltataudelta" },
  { name: "Delta Upsilon", slug: "deltaupsilon" },
  { name: "Kappa Alpha Order", slug: "kappaalphaorder" },
  { name: "Kappa Sigma", slug: "kappasigma" },
  { name: "Lambda Chi Alpha", slug: "lambdachialpha" },
  { name: "Phi Delta Theta", slug: "phideltatheta" },
  { name: "Phi Gamma Delta", slug: "phigammadelta" },
  { name: "Phi Kappa Sigma", slug: "phikappasigma" },
  { name: "Phi Kappa Tau", slug: "phikappatau" },
  { name: "Phi Sigma Kappa", slug: "phisigmakappa" },
  { name: "Pi Kappa Alpha", slug: "pikappaalpha" },
  { name: "Pi Kappa Phi", slug: "pikappaphi" },
  { name: "Sigma Alpha Epsilon", slug: "sigmaalphaepsilon" },
  { name: "Sigma Chi", slug: "sigmachi" },
  { name: "Sigma Nu", slug: "sigmanu" },
  { name: "Sigma Phi Epsilon", slug: "sigmaphiepsilon" },
  { name: "Tau Kappa Epsilon", slug: "taukappaepsilon" },
  { name: "Theta Chi", slug: "thetachi" },
];

const LINK_HOST = "saferidesapp.com/r/";
const SUPPORT_EMAIL = "saferideshelp@gmail.com";

/** Copy feedback is held this long before the button returns to "Copy". */
const COPIED_RESET_MS = 2000;

function IconSearch() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

/**
 * Clipboard write with a fallback for browsers that withhold the async API
 * outside a secure context. Returns whether the copy actually landed, so the
 * button never claims success it didn't achieve.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path below.
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

export default function RushChapterLinks() {
  const [query, setQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const resetTimer = useRef<number | null>(null);

  const visible = useMemo(() => {
    // Matching ignores case and the spaces in a chapter name, so "sigmachi",
    // "Sigma Chi" and "SIGMA" all find the same row.
    const q = query.trim().toLowerCase().replace(/\s+/g, "");
    if (!q) return CHAPTERS;
    return CHAPTERS.filter(
      (c) =>
        c.slug.includes(q) || c.name.toLowerCase().replace(/\s+/g, "").includes(q),
    );
  }, [query]);

  const onCopy = async (slug: string) => {
    const ok = await copyText(`${LINK_HOST}${slug}`);
    if (!ok) return;
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    setCopiedSlug(slug);
    resetTimer.current = window.setTimeout(
      () => setCopiedSlug(null),
      COPIED_RESET_MS,
    );
  };

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <span
          className="font-body font-semibold uppercase text-[#1740A6]/40"
          style={{ fontSize: "0.75rem", letterSpacing: "0.14em" }}
        >
          Your chapter link
        </span>
        <h2
          className="mt-4 font-display font-black text-[#1740A6]"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.05 }}
        >
          Here is the link you send your PNMs.
        </h2>
        <p
          className="mt-5 font-body text-[#1740A6]/65"
          style={{ fontSize: "1.0625rem", maxWidth: "560px", lineHeight: 1.6 }}
        >
          Find your chapter, copy the link, and drop it in your rush GroupMe.
          Any PNM who opens it rides free.
        </p>

        {/* Filter */}
        <div className="relative mt-10">
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#1740A6]/40"
            aria-hidden="true"
          >
            <IconSearch />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for your chapter"
            aria-label="Search for your chapter"
            className="w-full rounded-xl border border-[#1740A61F] bg-white py-3.5 pl-11 pr-4 font-body text-[#1740A6] outline-none transition-colors placeholder:text-[#1740A6]/40 focus:border-[#1740A6]"
            style={{ fontSize: "0.9375rem" }}
          />
        </div>

        {/* List */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#1740A614]">
          {visible.length === 0 ? (
            <p
              className="px-5 py-8 text-center font-body text-[#1740A6]/60"
              style={{ fontSize: "0.9375rem" }}
            >
              No chapter matches that. Chapters not listed can email{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-semibold text-[#1740A6] underline underline-offset-2"
              >
                {SUPPORT_EMAIL}
              </a>{" "}
              to get set up.
            </p>
          ) : (
            <ul className="divide-y divide-[#1740A614]">
              {visible.map((c) => {
                const copied = copiedSlug === c.slug;
                return (
                  <li
                    key={c.slug}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  >
                    <div className="min-w-0">
                      <p
                        className="font-display font-bold text-[#1740A6]"
                        style={{ fontSize: "1rem" }}
                      >
                        {c.name}
                      </p>
                      <p
                        className="mt-0.5 truncate font-body text-[#1740A6]/55"
                        style={{ fontSize: "0.875rem" }}
                      >
                        {LINK_HOST}
                        {c.slug}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onCopy(c.slug)}
                      aria-label={`Copy the rush link for ${c.name}`}
                      className={`inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-body font-semibold transition-colors ${
                        copied
                          ? "bg-[#1740A6] text-white"
                          : "bg-[#1740A60F] text-[#1740A6] hover:bg-[#1740A61A]"
                      }`}
                      style={{ fontSize: "0.875rem", minWidth: "104px" }}
                    >
                      {copied ? <IconCheck /> : <IconCopy />}
                      {copied ? "Copied" : "Copy link"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Announces the copy to screen readers, which get no visual cue. */}
        <p aria-live="polite" className="sr-only">
          {copiedSlug ? `Link copied for ${copiedSlug}` : ""}
        </p>

        <p
          className="mt-6 font-body text-[#1740A6]/60"
          style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
        >
          Rush rides are active through September 10. Chapters not listed here
          should email{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-semibold text-[#1740A6] underline underline-offset-2"
          >
            {SUPPORT_EMAIL}
          </a>{" "}
          to get set up.
        </p>
      </div>
    </section>
  );
}
