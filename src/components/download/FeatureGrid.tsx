interface Feature {
  title: string;
  body: string;
}

/**
 * Kept deliberately in step with what the apps actually do. If a claim here
 * stops being true in the product, change it here too — this page is what a
 * flyer, an Instagram bio, or a GroupMe drop lands people on.
 */
const FEATURES: Feature[] = [
  {
    title: "Verified student drivers only",
    body: "Every driver is background checked, student verified, and manually approved before their first ride.",
  },
  {
    title: "Upfront pricing",
    body: "You see the fare before you request. Flat Rate rides start around $6-$8.",
  },
  {
    title: "4-digit pickup code",
    body: "The driver can't start your trip until you give them your code, so you always get in the right car.",
  },
  {
    title: "Female driver option",
    body: "Riders can request a female-only driver.",
  },
  {
    title: "Campus geofenced",
    body: "Built for short rides around campus, up to 5 miles.",
  },
  {
    title: "Schedule ahead",
    body: "Book rides in advance for game days and late nights.",
  },
  {
    title: "In-app support",
    body: "Real people, plus trusted contact features.",
  },
];

export default function FeatureGrid() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map(({ title, body }) => (
        <li
          key={title}
          className="rounded-2xl border border-brand-blue20 bg-white p-6"
        >
          <h3
            className="font-display font-bold text-brand-blue"
            style={{ fontSize: "1.0625rem", lineHeight: 1.3 }}
          >
            {title}
          </h3>
          <p
            className="mt-3 font-body text-brand-blue/70"
            style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
          >
            {body}
          </p>
        </li>
      ))}
    </ul>
  );
}
