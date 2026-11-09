import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { DOWNLOAD_URL } from "@/components/site/GetTheApp";
import { trackEvent } from "@/lib/analytics";

type NavLinkItem = { label: string; hash?: string; to?: string };

/**
 * One entry per audience, in the order they matter to us: the two groups we
 * are actually writing for, then the job, then businesses. "Safety" and "How
 * It Works" came out — they were homepage anchors that meant nothing to
 * somebody arriving on /parents, and the parents page covers both properly.
 */
const NAV_LINKS: NavLinkItem[] = [
  { label: "Parents", to: "/parents" },
  { label: "Universities", to: "/universities" },
  { label: "Drive", to: "/drive" },
  { label: "Businesses", to: "/businesses" },
];

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Scroll to a homepage section. If we are on another route, navigate home
  // with the hash so the browser scrolls to the section after the page loads.
  const handleHashClick = (hash: string) => {
    setOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${hash}`;
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white transition-colors duration-300 ${
        scrolled ? "border-b border-[#1740A614]" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 flex h-16 items-center justify-between">
        <a
          href="/"
          className="font-display font-black tracking-tight text-[#1740A6] select-none"
          style={{ fontSize: "1.25rem" }}
        >
          SafeRides
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) =>
            l.to ? (
              <Link
                key={l.label}
                to={l.to}
                className="font-body font-medium text-[#1740A6]/65 hover:text-[#1740A6] transition-colors"
              >
                {l.label}
              </Link>
            ) : (
              <button
                key={l.label}
                onClick={() => handleHashClick(l.hash!)}
                className="font-body font-medium text-[#1740A6]/65 hover:text-[#1740A6] transition-colors bg-transparent border-none cursor-pointer"
              >
                {l.label}
              </button>
            ),
          )}
        </nav>

        {/* No QR here: the bar is 64px tall and there is one in the hero. */}
        <a
          href={DOWNLOAD_URL}
          onClick={() => trackEvent("app_store_click", { surface: "nav" })}
          className="hidden md:inline-flex rounded-[8px] bg-[#1740A6] px-5 py-2 font-body font-semibold text-white"
        >
          Get the app
        </a>

        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="md:hidden p-2 text-[#1740A6]"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile full-screen overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex h-16 items-center justify-between px-5">
            <span
              className="font-display font-black tracking-tight text-[#1740A6]"
              style={{ fontSize: "1.25rem" }}
            >
              SafeRides
            </span>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="p-2 text-[#1740A6]"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
            {NAV_LINKS.map((l) =>
              l.to ? (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="font-display font-bold text-2xl text-[#1740A6]"
                >
                  {l.label}
                </Link>
              ) : (
                <button
                  key={l.label}
                  onClick={() => handleHashClick(l.hash!)}
                  className="font-display font-bold text-2xl text-[#1740A6] bg-transparent border-none cursor-pointer"
                >
                  {l.label}
                </button>
              ),
            )}
          </nav>

          <div className="px-6 pb-10">
            <a
              href={DOWNLOAD_URL}
              onClick={() => {
                trackEvent("app_store_click", { surface: "nav_mobile" });
                setOpen(false);
              }}
              className="block w-full rounded-[8px] bg-[#1740A6] px-5 py-4 text-center font-body font-semibold text-white"
            >
              Get the app
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
