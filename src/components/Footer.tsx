import { useState } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { label: "Safety", href: "#safety" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Businesses", href: "#for-businesses" },
  { label: "Drivers", href: "#drivers" },
];

const CONTACT_EMAIL = "saferideshelp@gmail.com";
const APP_STORE_URL = "https://apps.apple.com/app/id6750380495";
const INPUT_CLASS =
  "w-full rounded-[8px] border border-white/25 bg-white px-4 py-3 font-body text-[#1740A6] placeholder:text-[#1740A6]/55 outline-none focus:border-white";

type Status = "idle" | "submitting" | "success" | "error";

export default function Footer() {
  const [showDeletionForm, setShowDeletionForm] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    accountType: "rider",
    details: "",
  });

  const scrollTo = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const update = (
    key: keyof typeof form,
  ) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((current) => ({ ...current, [key]: e.target.value }));
  };

  const onSubmitDeletionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const { db } = await import("@/lib/firebase");
      const { addDoc, collection, serverTimestamp } = await import(
        "firebase/firestore"
      );
      await addDoc(collection(db, "accountDeletionRequests"), {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        accountType: form.accountType,
        details: form.details.trim() || null,
        source: "marketing_site_footer",
        status: "new",
        submittedAt: serverTimestamp(),
      });
      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        accountType: "rider",
        details: "",
      });
    } catch (error) {
      console.error("Account deletion request submission failed:", error);
      setStatus("error");
    }
  };

  return (
    <footer className="bg-[#1740A6]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14 grid gap-10 sm:grid-cols-3">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <span
            className="font-display font-black text-white tracking-tight"
            style={{ fontSize: "1.5rem" }}
          >
            SafeRides
          </span>
          <p
            className="font-body text-white/65"
            style={{ fontSize: "0.9rem", maxWidth: "240px", lineHeight: 1.6 }}
          >
            Student-only rideshare. Built for campus.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-body text-white/65 hover:text-white transition-colors"
            style={{ fontSize: "0.9rem" }}
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-3">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-left font-body font-medium text-white/65 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            >
              {l.label}
            </button>
          ))}
          <Link
            to="/apply"
            className="font-body font-medium text-white/65 hover:text-white transition-colors w-fit"
          >
            Apply
          </Link>
        </div>

        {/* App + legal */}
        <div className="flex flex-col items-start gap-4 sm:items-end">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[8px] bg-white px-6 py-3 font-display font-bold text-[#1740A6]"
          >
            Download the app
          </a>
          <div className="flex flex-col gap-2 sm:items-end">
            <Link
              to="/privacy"
              className="font-body text-white/50 hover:text-white/80 transition-colors"
              style={{ fontSize: "0.8rem" }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="font-body text-white/50 hover:text-white/80 transition-colors"
              style={{ fontSize: "0.8rem" }}
            >
              Terms
            </Link>
            {/* A plain anchor, not a react-router Link, on purpose: /sms-consent
                is a standalone static file in public/, the same as privacy.html
                and terms.html. A Link would client-side route to the dead React
                page instead of loading the real one. */}
            <a
              href="/sms-consent"
              className="font-body text-white/50 hover:text-white/80 transition-colors"
              style={{ fontSize: "0.8rem" }}
            >
              SMS Consent
            </a>
            <button
              type="button"
              onClick={() => {
                setShowDeletionForm((shown) => !shown);
                setStatus("idle");
              }}
              className="font-body text-left text-white/50 hover:text-white/80 transition-colors sm:text-right"
              style={{ fontSize: "0.8rem" }}
            >
              Request account deletion
            </button>
          </div>
        </div>
      </div>

      {showDeletionForm && (
        <div className="mx-auto max-w-3xl px-5 sm:px-8 pb-12">
          <div className="rounded-[8px] border border-white/20 bg-white/10 p-5 sm:p-6">
            {status === "success" ? (
              <div className="flex flex-col gap-3">
                <p className="font-display text-lg font-bold text-white">
                  Request received.
                </p>
                <p className="font-body text-sm leading-6 text-white/75">
                  We will review your request and may email you to verify the
                  account before deleting it.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmitDeletionRequest} className="grid gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-white">
                    Request account deletion
                  </h2>
                  <p className="mt-2 font-body text-sm leading-6 text-white/70">
                    Submit the email tied to your SafeRides account. We may
                    retain limited records when required for safety, legal, or
                    payment reasons.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className={INPUT_CLASS}
                    placeholder="Full name"
                    required
                    value={form.name}
                    onChange={update("name")}
                    disabled={status === "submitting"}
                  />
                  <input
                    className={INPUT_CLASS}
                    type="email"
                    placeholder="Account email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    disabled={status === "submitting"}
                  />
                  <input
                    className={INPUT_CLASS}
                    type="tel"
                    placeholder="Phone number (optional)"
                    value={form.phone}
                    onChange={update("phone")}
                    disabled={status === "submitting"}
                  />
                  <select
                    className={INPUT_CLASS}
                    value={form.accountType}
                    onChange={update("accountType")}
                    disabled={status === "submitting"}
                  >
                    <option value="rider">Rider account</option>
                    <option value="driver">Driver account</option>
                    <option value="both">Rider and driver account</option>
                  </select>
                </div>
                <textarea
                  className={`${INPUT_CLASS} min-h-24 resize-y`}
                  placeholder="Anything else we should know? (optional)"
                  value={form.details}
                  onChange={update("details")}
                  disabled={status === "submitting"}
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="rounded-[8px] bg-white px-5 py-3 font-display font-bold text-[#1740A6] disabled:opacity-60"
                >
                  {status === "submitting"
                    ? "Submitting..."
                    : "Submit deletion request"}
                </button>
                {status === "error" && (
                  <p className="font-body text-sm text-white">
                    Something went wrong. Please email saferideshelp@gmail.com
                    or try again.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-5">
          <p
            className="font-body text-white/40 text-center"
            style={{ fontSize: "0.8rem" }}
          >
            2026 SafeRides. Operated by Coetzee Tech LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
