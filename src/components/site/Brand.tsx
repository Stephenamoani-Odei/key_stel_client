import logo from "@/assets/keystel-logo-mark.png";

export function Brand({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <span className={`brand-lockup ${light ? "brand-lockup-light" : ""} ${compact ? "brand-compact" : ""}`}>
      <span className="brand-image"><img src={logo} alt="KEY-STEL" width={900} height={145} /></span>
      <span className="brand-tagline">Your Secured Partner.</span>
    </span>
  );
}