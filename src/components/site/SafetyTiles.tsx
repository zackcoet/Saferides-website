import {
  CircleDollarSign,
  Flag,
  GraduationCap,
  KeyRound,
  MapPin,
  UserRound,
  type LucideIcon,
} from "lucide-react";

/**
 * Six safety tiles. SIX CLAIMS, EACH ONE CHECKED AGAINST THE APP.
 *
 * Nothing goes in this list that is not shipped and working. What was
 * deliberately LEFT OUT, and why:
 *
 *   background checks — there is no background-check step anywhere in driver
 *     onboarding. A grep for backgroundCheck across Backend and the Driver
 *     app returns nothing. The old Safety section's "every driver passes
 *     identity verification" is not supported either.
 *   insurance — nothing in the product backs a claim about cover.
 *   "no surge pricing" — rides carry zoneMultiplier and priorityMultiplier,
 *     so the honest claim is that the price is shown and fixed BEFORE you
 *     book, not that it never varies.
 *   trusted-contact SMS — the tracking link goes by EMAIL. That is what the
 *     app sends and what the wording below says.
 *
 * Each `source` is where the claim was verified. Keep them updated with the
 * claim, and delete a tile the moment its feature stops being true.
 */
export type SafetyClaim = {
  icon: LucideIcon;
  title: string;
  line: string;
  /** Not rendered. The receipt for the claim above it. */
  source: string;
};

export const SAFETY_CLAIMS: SafetyClaim[] = [
  {
    icon: KeyRound,
    title: "Pickup code every ride",
    line: "Your driver reads your code before you get in. No code, no ride.",
    source:
      "Rider ActiveRideScreen + SignUpScreen pickupCode; rides.pickupCode on every ride document",
  },
  {
    icon: MapPin,
    title: "Live trip tracking",
    line: "Email anyone a private link to your live location, driver and ETA.",
    source:
      "Rider ActiveRideScreen tracking modal -> sendTrackingLinkEmail callable (Backend index.ts, HELP_GMAIL_APP_PASSWORD bound)",
  },
  {
    icon: GraduationCap,
    title: "Students only",
    line: "You cannot make an account without a USC email.",
    source:
      "Rider SignUpScreen requires @email.sc.edu or university Microsoft sign-in",
  },
  {
    icon: CircleDollarSign,
    title: "Price before you book",
    line: "The fare is on screen before you tap. Split per person, shown too.",
    source:
      "Rider RequestRideScreen ride-type list shows total and per-person price pre-request",
  },
  {
    icon: Flag,
    title: "Report from inside the ride",
    line: "Report a problem mid-trip, or call 911 from the same screen.",
    source:
      "Rider ActiveRideScreen report modal -> submitActiveRideReport, with emergency and 911 actions",
  },
  {
    icon: UserRound,
    title: "Choose a female driver",
    line: "Female riders can pick a female driver when they book.",
    source:
      "Rider RequestRideScreen saferide_female / saferide_women_xl; enforced server-side in matching/driverEligibility.ts",
  },
];

export default function SafetyTiles({
  variant = "light",
}: {
  variant?: "light" | "onBlue";
}) {
  const onBlue = variant === "onBlue";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SAFETY_CLAIMS.map(({ icon: Icon, title, line }) => (
        <div
          key={title}
          className={`rounded-2xl p-6 ${
            onBlue ? "bg-white/10" : "border border-[#1740A6]/12 bg-white"
          }`}
        >
          <Icon
            className={onBlue ? "text-white" : "text-[#1740A6]"}
            size={26}
            strokeWidth={2.2}
            aria-hidden="true"
          />
          <h3
            className={`mt-4 font-display font-bold ${
              onBlue ? "text-white" : "text-[#1740A6]"
            }`}
            style={{ fontSize: "1.0625rem" }}
          >
            {title}
          </h3>
          <p
            className={`mt-1.5 font-body ${
              onBlue ? "text-white/70" : "text-[#1740A6]/65"
            }`}
            style={{ fontSize: "0.9375rem", lineHeight: 1.5 }}
          >
            {line}
          </p>
        </div>
      ))}
    </div>
  );
}
