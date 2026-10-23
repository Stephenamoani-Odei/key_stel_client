import { useEffect, useRef, type ElementType, type MutableRefObject, type ReactNode, type Ref } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
function register() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function attachRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as MutableRefObject<T | null>).current = node;
}

/** Fades and lifts its children into place the moment they scroll into view. */
export function Reveal({ children, className, delay = 0, y = 26, ref }: { children: ReactNode; className?: string; delay?: number; y?: number; ref?: Ref<HTMLDivElement> }) {
  const innerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    register();
    const el = innerRef.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [delay, y]);
  return <div ref={node => { innerRef.current = node; attachRef(ref, node); }} className={className}>{children}</div>;
}

/** Splits a heading into words and lifts each one out of its own mask on scroll. */
export function RevealWords({ text, className, as = "h2", delay = 0, stagger = 0.055 }: { text: string; className?: string; as?: ElementType; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;
  useEffect(() => {
    register();
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll<HTMLElement>(".rw-word"),
        { yPercent: 112, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.75, stagger, ease: "power4.out", delay,
          scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    }, el);
    return () => ctx.revert();
  }, [delay, stagger, text]);
  return (
    <Tag ref={ref} className={className}>
      {text.split("\n").map((line, li) => (
        <span className="rw-line" key={li}>
          {line.split(" ").flatMap((w, wi) => (wi === 0
            ? [<span key={wi} className="rw-mask"><span className="rw-word">{w}</span></span>]
            : [" ", <span key={wi} className="rw-mask"><span className="rw-word">{w}</span></span>]))}
        </span>
      ))}
    </Tag>
  );
}
