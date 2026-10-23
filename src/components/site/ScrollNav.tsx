import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

/**
 * Arrow controls for a scrollable rail or tall panel. Renders nothing when the
 * content already fits, so desktop grids stay untouched.
 */
export function ScrollNav({
  axis = "x",
  canPrev,
  canNext,
  onPrev,
  onNext,
  label,
}: {
  axis?: "x" | "y";
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  label: string;
}) {
  if (!canPrev && !canNext) return null;
  const PrevIcon = axis === "x" ? ChevronLeft : ChevronUp;
  const NextIcon = axis === "x" ? ChevronRight : ChevronDown;
  return (
    <div className={`scroll-nav${axis === "y" ? " scroll-nav-vertical" : ""}`} role="group" aria-label={`Scroll ${label}`}>
      <button type="button" className="scroll-nav-btn" onClick={onPrev} disabled={!canPrev} aria-label={`Scroll ${label} backwards`}>
        <PrevIcon />
      </button>
      <button type="button" className="scroll-nav-btn" onClick={onNext} disabled={!canNext} aria-label={`Scroll ${label} forwards`}>
        <NextIcon />
      </button>
    </div>
  );
}
