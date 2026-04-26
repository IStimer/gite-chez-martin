import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import type { SplitText } from 'gsap/SplitText';
import { revealTitle, revealAllInside, revertReveals } from '../../../utils/reveals';

export const useGalleryReveals = (rootRef: RefObject<HTMLElement | null>) => {
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const t = revealTitle(el.querySelector<HTMLElement>('.gallery__title'), {
        trigger: el,
      });
      if (t) splits.push(t.split);
      splits.push(...revealAllInside(el));
      gsap.from(el.querySelectorAll('.gallery__head [data-reveal]'), {
        opacity: 0,
        y: 32,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
      gsap.from(el.querySelectorAll('[data-viewer-reveal]'), {
        opacity: 0,
        y: 32,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 70%', once: true },
      });
    }, el);
    return () => {
      revertReveals(splits);
      ctx.revert();
    };
  }, [rootRef]);
};
