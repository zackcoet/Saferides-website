import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Counter from "@/components/site/Counter";
import DriveSection from "@/components/site/DriveSection";
import GetTheApp from "@/components/site/GetTheApp";
import SafetyTiles from "@/components/site/SafetyTiles";
import Section from "@/components/site/Section";
import Steps from "@/components/site/Steps";
import { Link } from "react-router-dom";

const STEPS = [
  { title: "Open the app", line: "Set where you are and where you're going." },
  { title: "See the price", line: "The fare is on screen before you book." },
  { title: "Match your code", line: "Your driver reads it out. Then you get in." },
];

/**
 * The homepage, for a student who might ride and a student who might drive.
 * Parents and universities get their own pages, linked from the hero and nav.
 *
 * One idea per section, one button per section. The old page ran Safety,
 * Trending, How It Works, a scroll walkthrough, Businesses, Drivers, Join The
 * Team and Request A School before anybody reached a download button.
 */
export default function Index() {
  return (
    <>
      <Nav />
      <main>
        <Hero />

        {/* Proof, immediately after the promise. */}
        <section className="bg-[#1740A6] py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Counter variant="onBlue" />
          </div>
        </section>

        <Section
          id="safety"
          eyebrow="Safety"
          title="Six reasons it's safer."
          line="Every one of these is in the app today."
          cta={
            <Link
              to="/parents"
              className="rounded-[10px] border border-[#1740A6] px-7 py-3.5 font-body font-semibold text-[#1740A6]"
            >
              For parents
            </Link>
          }
        >
          <SafetyTiles />
        </Section>

        <Section
          id="how-it-works"
          eyebrow="How it works"
          title="Three taps to a ride."
          cta={<GetTheApp surface="home_how_it_works" />}
        >
          <Steps steps={STEPS} />
        </Section>

        <DriveSection />

        <Section
          eyebrow="Businesses"
          title="Get your customers home."
          line="Bars, restaurants and venues around campus can cover rides for their guests."
          cta={
            <Link
              to="/businesses"
              className="rounded-[10px] bg-[#1740A6] px-7 py-3.5 font-body font-semibold text-white"
            >
              For businesses
            </Link>
          }
        />
      </main>
      <Footer />
    </>
  );
}
