import { useEffect, useRef, type ElementType, type MutableRefObject, type ReactNode, type Ref } from "react";
import gsap from "gsap";
import { MOTION, registerScrollTrigger } from "@/lib/motion";

function attachRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as MutableRefObject<T | null>).current = node;
}

/** Fades and lifts its children into place the moment they scroll into view. */
export function Reveal({ children, className, delay = 0, y = 30, staggerChildren, duration, ref }: { children: ReactNode; className?: string; delay?: number; y?: number; staggerChildren?: string; duration?: number; ref?: Ref<HTMLDivElement> }) {
  const innerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    registerScrollTrigger();
    const el = innerRef.current;
    if (!el) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const targets = staggerChildren ? el.querySelectorAll(staggerChildren) : el;
        gsap.fromTo(targets, { y, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: duration ?? (staggerChildren ? MOTION.duration.category : MOTION.duration.section),
          stagger: staggerChildren ? MOTION.stagger.category : 0,
          ease: MOTION.ease.default,
          delay,
          overwrite: "auto",
          scrollTrigger: {
            trigger: el,
            start: MOTION.scroll.start,
            end: MOTION.scroll.end,
            once: MOTION.scroll.once,
            invalidateOnRefresh: true,
          },
        });
      }, el);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, [delay, duration, staggerChildren, y]);
  return <div ref={node => { innerRef.current = node; attachRef(ref, node); }} className={className}>{children}</div>;
}

/** Reveals a clipped image as it enters the viewport. */
export function RevealImage({ children, className, delay = 0, "aria-hidden": ariaHidden }: { children: ReactNode; className?: string; delay?: number; "aria-hidden"?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    registerScrollTrigger();
    const el = ref.current;
    const image = el?.querySelector("img");
    if (!el || !image) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(image,
          { clipPath: "inset(0 0 100% 0)", scale: 1.06 },
          {
            clipPath: "inset(0 0 0% 0)",
            scale: 1,
            duration: MOTION.duration.image,
            ease: MOTION.ease.image,
            delay,
            overwrite: "auto",
            scrollTrigger: {
              trigger: el,
              start: MOTION.scroll.start,
              end: MOTION.scroll.end,
              once: MOTION.scroll.once,
              invalidateOnRefresh: true,
            },
          });
      }, el);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, [delay]);
  return <div ref={ref} className={className} aria-hidden={ariaHidden}>{children}</div>;
}

/** Splits a heading into words and lifts each one out of its own mask on scroll. */
export function RevealWords({ text, className, as = "h2", delay = 0, stagger = MOTION.stagger.default }: { text: string; className?: string; as?: ElementType; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;
  useEffect(() => {
    registerScrollTrigger();
    const el = ref.current;
    if (!el) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(el.querySelectorAll<HTMLElement>(".rw-word"),
          { yPercent: 112, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: MOTION.duration.section,
            stagger,
            ease: MOTION.ease.smooth,
            delay,
            overwrite: "auto",
            scrollTrigger: {
              trigger: el,
              start: MOTION.scroll.start,
              end: MOTION.scroll.end,
              once: MOTION.scroll.once,
              invalidateOnRefresh: true,
            },
          });
      }, el);
      return () => ctx.revert();
    });
    return () => media.revert();
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
