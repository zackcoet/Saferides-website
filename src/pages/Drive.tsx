import { CalendarClock, MapPin, Moon } from "lucide-react";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import EarningsTiles from "@/components/site/EarningsTiles";
import Section from "@/components/site/Section";
import PhotoSlot from "@/components/site/PhotoSlot";
import Steps from "@/components/site/Steps";
import { APP_LINKS, isLive } from "@/config/appLinks";
import { trackEvent } from "@/lib/analytics";

const WHY = [
  {
    icon: CalendarClock,
    title: "Your hours",
    line: "Go online when you want. No set shift, no manager.",
  },
  {
    icon: MapPin,
    title: "Your campus",
    line: "Rides stay inside the campus zone. You know every road.",
  },
  {
    icon: Moon,
    title: "Thursday to Saturday",
    line: "The busy nights are the nights students are out anyway.",
  },
];

const STEPS = [
  { title: "Apply", line: "Licence, insurance and your car, all in the driver app." },
  { title: "Get approved", line: "We check your documents before you can go online." },
  { title: "Drive", line: "Open the app on a busy night and take rides." },
];

const REQUIREMENTS = [
  "18 or older",
  "Valid driver's licence",
  "Active auto insurance",
  "A reliable car",
  "An iPhone",
];

/**
 * /drive — the job, sold properly.
 *
 * REPLACES /drivers rather than sitting beside it; /drivers now redirects
 * here, so flyers and old links still land.
 *
 * WHAT CHANGED FROM THE OLD PAGE, and why:
 *
 *   "No application process. If you have a car and insurance, you can start."
 *     contradicted the three approval steps printed directly beneath it.
 *     There IS a document review, so the page says so.
 *   "Most drivers are approved within 24 hours" — nothing measures that.
 *     Gone.
 *   The Apply button pointed at /apply, which is the office-jobs form
 *     (Campus Rep, Intern, Marketing Manager). A student who wanted to drive
 *     landed on a resume upload. It now goes to the Driver app, which is
 *     where driver onboarding actually happens.
 *   "Bonuses and incentives ... the more active you are, the more you
 *     unlock" became the real, current numbers in EarningsTiles.
 */
export default function Drive() {
  const driverApp = APP_LINKS.APP_STORE_DRIVER;
  const canApply = isLive(driverApp);

  const applyButton = (variant: "white" | "blue") =>
    canApply ? (
      <a
        href={driverApp}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent("driver_application_start", { surface: "drive" })
        }
        className={`rounded-[10px] px-8 py-4 font-body font-semibold ${
          variant === "white"
            ? "bg-white text-[#1740A6]"
            : "bg-[#1740A6] text-white"
        }`}
      >
        Apply to drive
      </a>
    ) : null;

  return (
    <>
      <Nav />
      <main>
        <Section
          first
          eyebrow="Drive for SafeRides"
          title="Get paid to drive students. Your hours."
          line="Guaranteed hourly pay Thursday, Friday and Saturday nights. Keep every tip."
          cta={applyButton("blue")}
        />

        <Section
          variant="onBlue"
          eyebrow="What you make"
          title="Guaranteed, not hoped for."
          cta={applyButton("white")}
        >
          <EarningsTiles />
        </Section>

        <Section eyebrow="Why students drive" title="It fits around class.">
          <PhotoSlot
            shot="A real SafeRides driver in their own car at night, campus behind them."
            aspect="16 / 7"
            className="mb-8"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {WHY.map(({ icon: Icon, title, line }) => (
              <div
                key={title}
                className="rounded-2xl border border-[#1740A6]/12 bg-white p-6"
              >
                <Icon className="text-[#1740A6]" size={26} strokeWidth={2.2} aria-hidden="true" />
                <h3
                  className="mt-4 font-display font-bold text-[#1740A6]"
                  style={{ fontSize: "1.0625rem" }}
                >
                  {title}
                </h3>
                <p
                  className="mt-1.5 font-body text-[#1740A6]/65"
                  style={{ fontSize: "0.9375rem", lineHeight: 1.5 }}
                >
                  {line}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Getting started" title="Three steps.">
          <Steps steps={STEPS} />
          <div className="mt-10">
            <h3
              className="font-display font-bold text-[#1740A6]"
              style={{ fontSize: "1.0625rem" }}
            >
              What you need
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {REQUIREMENTS.map((r) => (
                <li
                  key={r}
                  className="rounded-full border border-[#1740A6]/15 px-4 py-2 font-body text-[#1740A6]/75"
                  style={{ fontSize: "0.875rem" }}
                >
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section
          variant="onBlue"
          title="Start this weekend."
          line="Saturday night is the best-paid shift we run."
          cta={applyButton("white")}
        />
      </main>
      <Footer />
    </>
  );
}
