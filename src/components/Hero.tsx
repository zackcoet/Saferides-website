import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import GetTheApp from "@/components/site/GetTheApp";

/**
 * The first three seconds.
 *
 * Says what SafeRides IS before it says anything else: a rideshare app only
 * USC students can use, driven by USC students. The old headline ("The campus
 * ride built for you.") told a stranger nothing.
 *
 * The phone is a real, unedited screenshot of the Rider app home screen —
 * public/images/app/home-screen.webp, resized and compressed from
 * public/phone-mockup.png. Not a render, not a mockup of a product that does
 * not exist.
 */
export default function Hero() {
  return (
    <section className="relative bg-white pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          {/* Words */}
          <div className="text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-body font-semibold uppercase text-[#1740A6]/50"
              style={{ fontSize: "0.75rem", letterSpacing: "0.18em" }}
            >
              University of South Carolina
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-5 font-display font-black text-[#1740A6]"
              style={{ fontSize: "clamp(2.75rem, 6vw, 4.75rem)", lineHeight: 1.02 }}
            >
              Safe rides for USC students.
              <br />
              Driven by USC students.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-5 font-body text-[#1740A6]/65 mx-auto md:mx-0"
              style={{ fontSize: "1.1875rem", maxWidth: "440px", lineHeight: 1.5 }}
            >
              Around campus and home from Five Points. Pickup code every ride.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="mt-8 flex flex-col items-center gap-5 md:items-start"
            >
              <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                <GetTheApp surface="hero" />
                <Link
                  to="/parents"
                  className="rounded-[10px] border border-[#1740A6] bg-white px-7 py-3.5 font-body font-semibold text-[#1740A6]"
                >
                  For parents
                </Link>
              </div>
            </motion.div>
          </div>

          {/* The real app */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="justify-self-center"
          >
            <img
              src="/images/app/home-screen.webp"
              width={720}
              height={1561}
              alt="The SafeRides app home screen, showing a map of Columbia with Five Points, The Vista and Williams-Brice marked"
              className="w-[220px] sm:w-[260px] md:w-[300px] rounded-[2rem] border border-[#1740A6]/10"
              // Above the fold on every screen, so it is the one image that
              // must not lazy-load.
              fetchPriority="high"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
