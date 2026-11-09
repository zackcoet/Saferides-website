import { Link } from "react-router-dom";

import EarningsTiles from "@/components/site/EarningsTiles";
import Section from "@/components/site/Section";
import { trackEvent } from "@/lib/analytics";

/**
 * The homepage pitch for the job. Short, because its only job is to get a
 * student onto /drive — the numbers and the detail live there.
 */
export default function DriveSection() {
  return (
    <Section
      id="drive"
      variant="onBlue"
      eyebrow="A part-time job"
      title="Get paid to drive students. Your hours."
      line="Guaranteed hourly pay on the nights that are busy. Thursday to Saturday."
      cta={
        <Link
          to="/drive"
          onClick={() => trackEvent("apply_to_drive_click", { surface: "home" })}
          className="rounded-[10px] bg-white px-7 py-3.5 font-body font-semibold text-[#1740A6]"
        >
          See what you'd make
        </Link>
      }
    >
      <EarningsTiles />
    </Section>
  );
}
