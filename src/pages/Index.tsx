import { useCallback, useState } from "react";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Safety from "@/components/Safety";
import Trending from "@/components/Trending";
import HowItWorks from "@/components/HowItWorks";
import HowItWorksScroll from "@/components/HowItWorksScroll";
import ForBusinesses from "@/components/ForBusinesses";
import Drivers from "@/components/Drivers";
import JoinTheTeam from "@/components/JoinTheTeam";
import RequestSchool from "@/components/RequestSchool";
import Footer from "@/components/Footer";

export default function Index() {
  // The scroll walkthrough is several viewports tall and takes over the screen
  // while it plays, so it stays hidden until the reader asks for it from the
  // How It Works section.
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  const toggleWalkthrough = useCallback(() => {
    setWalkthroughOpen((open) => {
      const next = !open;
      if (next) {
        // Let it mount before scrolling to it.
        window.requestAnimationFrame(() => {
          document
            .getElementById("see-how-it-works")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      return next;
    });
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Safety />
        <Trending />
        <HowItWorks
          onSeeHowItWorks={toggleWalkthrough}
          revealed={walkthroughOpen}
        />
        {walkthroughOpen && <HowItWorksScroll />}
        <ForBusinesses />
        <Drivers />
        <JoinTheTeam />
        <RequestSchool />
      </main>
      <Footer />
    </>
  );
}
