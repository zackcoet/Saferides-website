const RIDER_STEPS = [
  {
    title: "Open the app",
    body: "Request a ride from anywhere on campus. Drop your pin, set your destination.",
  },
  {
    title: "A student picks you up",
    body: "A verified driver from your school accepts. Track them live on the map.",
  },
  {
    title: "Confirm your code, get in",
    body: "Your driver reads your 4-digit pickup code aloud. It matches — you're in.",
  },
];

const DRIVER_STEPS = [
  {
    title: "Apply and get verified",
    body: "Submit your documents, pass verification, and get approved. The whole process happens in the app.",
  },
  {
    title: "Go online when you want",
    body: "Set your own hours. Drive between classes, on weekends, whenever works for you.",
  },
  {
    title: "See your pay before you accept",
    body: "Every ride shows your earnings up front. No surprises, no guessing.",
  },
];

function StepList({ header, steps }: { header: string; steps: typeof RIDER_STEPS }) {
  return (
    <div>
      <h3
        className="font-display font-bold text-[#1740A6]"
        style={{ fontSize: "1.125rem" }}
      >
        {header}
      </h3>
      <div className="mt-6 flex flex-col gap-8">
        {steps.map((step, i) => (
          <div key={step.title} className="flex gap-5">
            <span
              className="font-display font-black leading-none text-[#1740A6]/10 tabular-nums flex-shrink-0"
              style={{ fontSize: "3rem" }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div className="pt-1">
              <p
                className="font-display font-bold text-[#1740A6]"
                style={{ fontSize: "1rem" }}
              >
                {step.title}
              </p>
              <p
                className="mt-1.5 font-body text-[#1740A6]/65"
                style={{ fontSize: "0.9rem", lineHeight: 1.6 }}
              >
                {step.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HowItWorks({
  onSeeHowItWorks,
  revealed = false,
}: {
  /** Reveals the scroll walkthrough, which stays hidden until asked for. */
  onSeeHowItWorks?: () => void;
  revealed?: boolean;
}) {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2
          className="font-display font-black text-[#1740A6]"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.05 }}
        >
          Simple for riders. Simple for drivers.
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
          <StepList header="As a rider" steps={RIDER_STEPS} />
          <StepList header="As a driver" steps={DRIVER_STEPS} />
        </div>

        <div className="mt-14">
          <button
            type="button"
            onClick={onSeeHowItWorks}
            aria-expanded={revealed}
            aria-controls="see-how-it-works"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1740A6] px-7 py-4 font-display font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
            style={{ fontSize: "0.95rem" }}
          >
            {revealed ? "Hide the walkthrough" : "See how it works"}
          </button>
        </div>
      </div>
    </section>
  );
}
