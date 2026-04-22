import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealOptions {
  selector?: string;         // child selector inside ref
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  stagger?: number;
  start?: string;
  once?: boolean;
  y?: number;
  duration?: number;
}

/**
 * Attach a scroll-triggered reveal animation to children of the ref.
 * Defaults: fade + translate up, staggered, triggered when ~20% in view.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: RevealOptions = {},
) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      selector = '[data-reveal]',
      from,
      to,
      stagger = 0.08,
      start = 'top 80%',
      once = true,
      y = 32,
      duration = 1.1,
    } = options;

    const targets = selector
      ? el.querySelectorAll<HTMLElement>(selector)
      : ([el] as unknown as NodeListOf<HTMLElement>);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y,
          ...(from ?? {}),
        },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: 'expo.out',
          stagger,
          ...(to ?? {}),
          scrollTrigger: {
            trigger: el,
            start,
            once,
            invalidateOnRefresh: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
