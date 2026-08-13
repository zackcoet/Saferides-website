/**
 * The four things a rush chairman has to do, directly under the hero.
 *
 * This is the fastest path through the page: a chairman who reads only this
 * block should still know exactly what to do. One line per step, no prose —
 * anything that needs explaining belongs further down the page, not here.
 */
const STEPS = [
  "Tell your brothers to download the SafeRides Driver app",
  "Each brother sets your chapter in his profile, and connects a bank account",
  "During rush, brothers go online and choose PNM Pickup",
  "Send your chapter's link to your PNMs",
];

export default function RushChecklist() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <h2
          className="font-display font-black text-[#1740A6]"
          style={{ fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)", lineHeight: 1.05 }}
        >
          What your chapter does
        </h2>

        <ol className="mt-8 flex flex-col gap-3">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-4 rounded-2xl bg-[#1740A60A] px-5 py-5 sm:gap-5 sm:px-7"
            >
              <span
                className="flex flex-shrink-0 items-center justify-center rounded-xl bg-[#1740A6] font-display font-bold text-white"
                style={{ width: 44, height: 44, fontSize: "1.0625rem" }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span
                className="font-body font-medium text-[#1740A6]"
                style={{ fontSize: "1.0625rem", lineHeight: 1.35 }}
              >
                {step}
              </span>
            </li>
          ))}
        </ol>

        {/* The two facts worth knowing before anyone starts, kept out of the
            steps themselves so the list still reads in five seconds. */}
        <p
          className="mt-6 font-body text-[#1740A6]/60"
          style={{ fontSize: "0.9375rem", lineHeight: 1.65 }}
        >
          Setting the chapter takes effect immediately — there is no approval
          wait. The bank account is the same one-time setup as any SafeRides
          driver, so he is ready to earn on normal rides after rush too.
        </p>
      </div>
    </section>
  );
}
