import { useState } from "react";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Counter from "@/components/site/Counter";
import GetTheApp, { DOWNLOAD_URL } from "@/components/site/GetTheApp";
import SafetyTiles from "@/components/site/SafetyTiles";
import Section from "@/components/site/Section";
import Steps from "@/components/site/Steps";
import { TYPICAL_FARE } from "@/config/siteStats";
import { trackEvent } from "@/lib/analytics";

const STEPS = [
  { title: "They open the app", line: "Only a USC email can make an account." },
  { title: "A student picks them up", line: "They match a pickup code before getting in." },
  { title: "You can watch the trip", line: "They email you a live link if they want to." },
];

const FAQ = [
  {
    q: "Who is driving?",
    a: "Another USC student, signed up with their own university email.",
  },
  {
    q: "How do I know they got in the right car?",
    a: "Every ride has a pickup code. The driver reads it out. If it doesn't match, they don't get in.",
  },
  {
    q: "Can I see where they are?",
    a: "If they send you the link. They email it from inside the ride — you see live location, driver, car and ETA.",
  },
  {
    q: "What does it cost?",
    a: `Most rides are $${TYPICAL_FARE.lowUsd} to $${TYPICAL_FARE.highUsd}. Split with friends it is about $${TYPICAL_FARE.perPersonUsd} each. The price is shown before they book.`,
  },
  {
    q: "Is it running right now?",
    a: "Yes. Busiest Thursday to Saturday night, which is when it matters.",
  },
];

/**
 * The parents page.
 *
 * WHAT IT DOES NOT SAY: nothing about background checks, nothing about
 * insurance, nothing about vetting. We do not do those things, and a parent
 * who later finds that out stops trusting every other sentence on the page.
 * The honest case — a student, a code, a visible price, a live link — is
 * strong enough.
 *
 * The share button is the point of the page: a parent reading this is not the
 * person who installs the app.
 */
export default function Parents() {
  const [shared, setShared] = useState(false);

  const shareText = `Get SafeRides — it's the student rideshare at USC. Download: ${DOWNLOAD_URL}`;

  const onShare = async () => {
    trackEvent("send_to_student", { surface: "parents" });
    // Web Share opens the real iOS/Android share sheet, which is where
    // Messages lives. Everything else falls back to an SMS link, then to the
    // clipboard — a parent on a desktop still has to be able to send it.
    try {
      if (navigator.share) {
        await navigator.share({ title: "SafeRides", text: shareText });
        return;
      }
    } catch {
      // Cancelled the sheet. Not an error, and not worth a fallback.
      return;
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setShared(true);
    } catch {
      window.location.href = `sms:?&body=${encodeURIComponent(shareText)}`;
    }
  };

  return (
    <>
      <Nav />
      <main>
        <Section
          eyebrow="For parents"
          title="Nobody should walk home at 1am."
          line="SafeRides is a rideshare app only USC students can use, driven by USC students."
          cta={
            <button
              onClick={onShare}
              className="rounded-[10px] bg-[#1740A6] px-7 py-3.5 font-body font-semibold text-white"
            >
              {shared ? "Link copied" : "Send this to my student"}
            </button>
          }
        />

        <section className="bg-[#1740A6] py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Counter variant="onBlue" />
          </div>
        </section>

        <Section
          title="Safer than the alternative."
          line="At 1am the choice is a walk across Five Points or a stranger's car. This is neither."
        >
          <SafetyTiles />
        </Section>

        <Section eyebrow="How it works" title="Three steps.">
          <Steps steps={STEPS} />
        </Section>

        <Section
          eyebrow="Cost"
          title={`About $${TYPICAL_FARE.perPersonUsd} a head.`}
          line={`Most rides come to $${TYPICAL_FARE.lowUsd}–$${TYPICAL_FARE.highUsd}, split between whoever is in the car. The price is on screen before they book.`}
        />

        <Section eyebrow="Questions" title="What parents ask.">
          <div className="grid gap-5 sm:grid-cols-2">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-[#1740A6]/12 bg-white p-6"
              >
                <h3
                  className="font-display font-bold text-[#1740A6]"
                  style={{ fontSize: "1.0625rem" }}
                >
                  {item.q}
                </h3>
                <p
                  className="mt-2 font-body text-[#1740A6]/65"
                  style={{ fontSize: "0.9375rem", lineHeight: 1.55 }}
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          variant="onBlue"
          title="Send it to them now."
          line="They'll use it the night they need it."
          cta={
            <>
              <button
                onClick={onShare}
                className="rounded-[10px] bg-white px-7 py-3.5 font-body font-semibold text-[#1740A6]"
              >
                {shared ? "Link copied" : "Send this to my student"}
              </button>
              <GetTheApp surface="parents_footer" variant="white" />
            </>
          }
        />
      </main>
      <Footer />
    </>
  );
}
