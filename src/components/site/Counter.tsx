import useSiteStats from "@/hooks/useSiteStats";
import {
  MIN_COUNT_TO_SHOW,
  PERIOD_LABEL,
  formatCount,
} from "@/config/siteStats";

/**
 * "876 students home safe this semester."
 *
 * PEOPLE, NOT RIDES. The big number is the sum of everyone who was in the
 * car; rides completed is the smaller stat underneath. Four students sharing
 * one ride is four students who got home.
 *
 * THE NUMBER IS THE NUMBER. No rounding, no "nearly", no "1,000+" until it
 * has really passed a thousand — formatCount only adds a comma.
 *
 * Renders nothing at all below MIN_COUNT_TO_SHOW, rather than printing a
 * figure that would read as "nobody uses this".
 */
export default function Counter({
  variant = "light",
}: {
  variant?: "light" | "onBlue";
}) {
  const { studentsHomeSafe, ridesCompleted } = useSiteStats();
  if (studentsHomeSafe < MIN_COUNT_TO_SHOW) return null;

  const strong = variant === "onBlue" ? "text-white" : "text-[#1740A6]";
  const soft = variant === "onBlue" ? "text-white/70" : "text-[#1740A6]/60";

  return (
    <div className="text-center">
      <div
        className={`font-display font-black leading-none ${strong}`}
        style={{ fontSize: "clamp(3.5rem, 11vw, 7rem)" }}
      >
        {formatCount(studentsHomeSafe)}
      </div>
      <p
        className={`mt-3 font-display font-bold ${strong}`}
        style={{ fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)" }}
      >
        students home safe {PERIOD_LABEL}
      </p>
      {ridesCompleted >= MIN_COUNT_TO_SHOW && (
        <p className={`mt-2 font-body ${soft}`} style={{ fontSize: "1rem" }}>
          {formatCount(ridesCompleted)} rides completed since we launched in August
        </p>
      )}
    </div>
  );
}
