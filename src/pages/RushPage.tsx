import { useEffect } from "react";
import Nav from "@/components/Nav";
import RushChecklist from "@/components/RushChecklist";
import RushChapterLinks from "@/components/RushChapterLinks";
import RushDemoScroll from "@/components/RushDemoScroll";
import RushFaq from "@/components/RushFaq";
import Footer from "@/components/Footer";

const APP_STORE_URL = "https://apps.apple.com/app/id6750380495";

/* ---------------------------------------------------------------------- */
/* Icons — simple line-art SVGs, no emojis, royal-blue only.               */
/* ---------------------------------------------------------------------- */

function IconTrophy() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 4h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4Z" />
      <path d="M7 5H4v1a4 4 0 0 0 4 4" />
      <path d="M17 5h3v1a4 4 0 0 1-4 4" />
      <path d="M12 13v3" />
      <path d="M9 20h6" />
      <path d="M10 16.5h4l.6 3.5H9.4l.6-3.5Z" />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Page                                                                    */
/* ---------------------------------------------------------------------- */

export default function RushPage() {
  useEffect(() => {
    document.title = "PNM Rides & Rush Mode - SafeRides";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-[#1740A6] pt-28 pb-16 sm:pt-36 sm:pb-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p
              className="font-body font-semibold uppercase text-white/50"
              style={{ fontSize: "0.75rem", letterSpacing: "0.18em" }}
            >
              For rush chairmen
            </p>
            <h1
              className="mt-5 font-display font-black text-white"
              style={{ fontSize: "clamp(2.75rem, 6vw, 4.5rem)", lineHeight: 1.03 }}
            >
              Free, safe rides for PNMs — driven by their own brothers.
            </h1>
            <p
              className="mt-6 font-body text-white/70"
              style={{ fontSize: "1.125rem", maxWidth: "560px", lineHeight: 1.6 }}
            >
              During rush week, your brothers give your PNMs free rides — no
              cost to the PNM, no cost to your chapter. Here is what to set up,
              and the link to send.
            </p>
          </div>
        </section>

        <RushChecklist />
        <RushChapterLinks />
        <RushDemoScroll />

        {/* The incentive */}
        <section className="bg-[#1740A6] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
                <IconTrophy />
              </div>
              <h2
                className="mt-6 font-display font-black text-white"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.05 }}
              >
                $1,000 tab for the top chapter.
              </h2>
              <p
                className="mt-5 font-body text-white/70 mx-auto"
                style={{ fontSize: "1.0625rem", maxWidth: "600px", lineHeight: 1.65 }}
              >
                The fraternity with the most completed rides during the rush
                period wins a $1,000 bar or food tab. It is a real, live
                competition — every completed PNM ride during rush counts
                toward your chapter's total.
              </p>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-9 inline-block rounded-[10px] bg-white px-7 py-3.5 font-display font-bold text-[#1740A6]"
              >
                Get the app
              </a>
            </div>
          </div>
        </section>
        <RushFaq />
      </main>
      <Footer />
    </div>
  );
}
