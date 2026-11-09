/**
 * Three numbered steps. One line each — if it needs two, it is not a step.
 */
export default function Steps({
  steps,
  variant = "light",
}: {
  steps: { title: string; line: string }[];
  variant?: "light" | "onBlue";
}) {
  const onBlue = variant === "onBlue";
  return (
    <div className="grid gap-8 sm:grid-cols-3">
      {steps.map((step, i) => (
        <div key={step.title}>
          <span
            className={`font-display font-black leading-none tabular-nums ${
              onBlue ? "text-white/25" : "text-[#1740A6]/15"
            }`}
            style={{ fontSize: "3rem" }}
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <p
            className={`mt-2 font-display font-bold ${
              onBlue ? "text-white" : "text-[#1740A6]"
            }`}
            style={{ fontSize: "1.0625rem" }}
          >
            {step.title}
          </p>
          <p
            className={`mt-1.5 font-body ${
              onBlue ? "text-white/70" : "text-[#1740A6]/65"
            }`}
            style={{ fontSize: "0.9375rem", lineHeight: 1.5 }}
          >
            {step.line}
          </p>
        </div>
      ))}
    </div>
  );
}
