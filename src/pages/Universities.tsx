import { Clock3, BarChart3, Handshake } from "lucide-react";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BookACallForm from "@/components/site/BookACallForm";
import Counter from "@/components/site/Counter";
import PhotoSlot from "@/components/site/PhotoSlot";
import Section from "@/components/site/Section";
import { BAKED_STATS, LAUNCH_DATE_ISO } from "@/config/siteStats";

const OFFER = [
  {
    icon: Clock3,
    title: "Late-night rides",
    line: "Thursday to Saturday, when campus transport has stopped.",
  },
  {
    icon: BarChart3,
    title: "Ride-volume data",
    line: "Where students travel from and to, and at what hours.",
  },
  {
    icon: Handshake,
    title: "Partnership options",
    line: "Subsidised rides, event nights, or a named campus programme.",
  },
];

/**
 * The universities page.
 *
 * PROOF, NOT PROMISES. The only numbers on this page are the counter and the
 * launch date — both real. There is no student-satisfaction figure, no
 * "incidents prevented", no schools we are "in conversation with". A campus
 * safety office checks claims, and one invented number ends the conversation.
 *
 * "Schools we're in" is one school. It says one school.
 */
export default function Universities() {
  const launchMonth = new Date(`${LAUNCH_DATE_ISO}T12:00:00Z`).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" },
  );

  return (
    <>
      <Nav />
      <main>
        <Section
          first
          eyebrow="For universities"
          title="A late-night safety net you don't have to run."
          line="SafeRides is a student-only rideshare already operating at USC. No campus budget, no vehicles, no staffing."
          cta={
            <a
              href="#book-a-call"
              className="rounded-[10px] bg-[#1740A6] px-7 py-3.5 font-body font-semibold text-white"
            >
              Book a call
            </a>
          }
        />

        <section className="bg-[#1740A6] py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Counter variant="onBlue" />
            <p
              className="mt-6 text-center font-body text-white/55"
              style={{ fontSize: "0.875rem" }}
            >
              Live at the University of South Carolina since {launchMonth}. One
              campus, {BAKED_STATS.ridesCompleted.toLocaleString("en-US")} completed
              rides.
            </p>
          </div>
        </section>

        <Section eyebrow="What we offer" title="Three things a campus can use.">
          <PhotoSlot
            shot="The SafeRides team on the USC Horseshoe, daylight, faces visible."
            aspect="16 / 7"
            className="mb-8"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {OFFER.map(({ icon: Icon, title, line }) => (
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

        <Section
          id="book-a-call"
          variant="onBlue"
          eyebrow="Talk to us"
          title="Book a call."
          line="Tell us your campus and we'll come back this week."
        >
          <BookACallForm />
        </Section>
      </main>
      <Footer />
    </>
  );
}
