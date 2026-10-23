import { useCallback, useEffect, useState } from "react";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Watches how far a scroll container can still travel along one axis and hands
 * back the pieces a pair of arrow buttons needs. Attach `setEl` to the element
 * that actually scrolls.
 */
export function useScrollNav(axis: "x" | "y" = "x") {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [edges, setEdges] = useState({ prev: false, next: false });

  const measure = useCallback(() => {
    if (!el) return;
    const pos = axis === "x" ? el.scrollLeft : el.scrollTop;
    const max = axis === "x" ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
    const prev = pos > 4;
    const next = pos < max - 4;
    setEdges(state => (state.prev === prev && state.next === next ? state : { prev, next }));
  }, [el, axis]);

  const scroll = useCallback((dir: -1 | 1) => {
    if (!el) return;
    const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
    if (axis === "x") el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior });
    else el.scrollBy({ top: dir * el.clientHeight * 0.7, behavior });
  }, [el, axis]);

  useEffect(() => {
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [el, measure]);

  return {
    setEl,
    canPrev: edges.prev,
    canNext: edges.next,
    scrollPrev: () => scroll(-1),
    scrollNext: () => scroll(1),
  };
}
