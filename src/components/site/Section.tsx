import type { ReactNode } from "react";

/**
 * One section: big headline, one short line, the content, one button.
 *
 * The shape is the writing rule made structural — there is nowhere to put a
 * third paragraph, so nobody adds one.
 */
export default function Section({
  id,
  eyebrow,
  title,
  line,
  children,
  cta,
  variant = "light",
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  line?: string;
  children?: ReactNode;
  /** The section's single button. */
  cta?: ReactNode;
  variant?: "light" | "onBlue";
  className?: string;
}) {
  const onBlue = variant === "onBlue";
  return (
    <section
      id={id}
      className={`${onBlue ? "bg-[#1740A6]" : "bg-white"} py-16 sm:py-24 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {eyebrow && (
          <p
            className={`font-body font-semibold uppercase ${
              onBlue ? "text-white/55" : "text-[#1740A6]/45"
            }`}
            style={{ fontSize: "0.7rem", letterSpacing: "0.18em" }}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={`mt-3 font-display font-black ${
            onBlue ? "text-white" : "text-[#1740A6]"
          }`}
          style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", lineHeight: 1.05 }}
        >
          {title}
        </h2>
        {line && (
          <p
            className={`mt-4 font-body ${
              onBlue ? "text-white/70" : "text-[#1740A6]/65"
            }`}
            style={{ fontSize: "1.125rem", maxWidth: "540px", lineHeight: 1.5 }}
          >
            {line}
          </p>
        )}
        {children && <div className="mt-10">{children}</div>}
        {cta && <div className="mt-10 flex flex-wrap items-center gap-4">{cta}</div>}
      </div>
    </section>
  );
}
