import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { revealTitle, revealLines, revertReveals } from '../../../utils/reveals';
import { fontsReady } from '../../../utils/fontsReady';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
}

interface IntroRefs {
  rootRef: RefObject<HTMLDivElement | null>;
  bgRef: RefObject<HTMLDivElement | null>;
  loaderRef: RefObject<HTMLDivElement | null>;
  loaderStageRef: RefObject<HTMLDivElement | null>;
  loaderTextRef: RefObject<HTMLParagraphElement | null>;
  loaderFrameRef: RefObject<HTMLDivElement | null>;
  loaderImageRef: RefObject<HTMLImageElement | null>;
}

const wireParallax = (el: HTMLElement, bg: HTMLElement) => {
  gsap.to(bg, {
    scale: 1.15,
    yPercent: -6,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.4,
    },
  });
};

const drawOrnament = (delay = 0) => {
  gsap.set('.hero__ornament-shell path', { drawSVG: 0 });
  gsap.set('.hero__ornament-line', {
    scaleX: 0,
    transformOrigin: 'left center',
  });
  gsap.to('.hero__ornament-shell path', {
    drawSVG: '100%',
    duration: 0.9,
    stagger: 0.05,
    ease: 'power2.out',
    delay,
  });
  gsap.to('.hero__ornament-line', {
    scaleX: 1,
    duration: 0.9,
    ease: 'power3.inOut',
    delay: delay + 0.25,
  });
};

/**
 * Orchestrates the hero's intro animation:
 *   • mobile bypass → no loader, just title + ornament + parallax;
 *   • desktop      → cream loader with welcome phrase, image L→R sweep,
 *                    FLIP-style expansion to the hero bg, then a
 *                    cascade of header / cards / ornament / scroll btn.
 */
export const useHeroIntro = ({
  rootRef,
  bgRef,
  loaderRef,
  loaderStageRef,
  loaderTextRef,
  loaderFrameRef,
  loaderImageRef,
}: IntroRefs) => {
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
      const splits: SplitText[] = [];
      const ctx = gsap.context(() => {
        // Gate the title split on font readiness — running SplitText
        // before the font swaps causes the chars to re-wrap mid-reveal.
        fontsReady().then(() => {
          el.querySelectorAll<HTMLElement>('.hero__title-line').forEach(
            (line, i) => {
              const r = revealTitle(line, {
                immediate: true,
                delay: 0.2 + i * 0.1,
              });
              if (r) splits.push(r.split);
            },
          );
        });
        drawOrnament(0.4);
        if (bgRef.current) wireParallax(el, bgRef.current);
      }, el);
      return () => {
        revertReveals(splits);
        ctx.revert();
      };
    }

    // Belt-and-suspenders for any edge case the index.html script missed
    // (e.g. anchor jump on cold load, restored hash).
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    // Header lives outside the hero scope — capture it now so the
    // cleanup can guarantee its inline `--clip-r` is cleared (gsap
    // context.revert doesn't always do it on mid-animation unmount).
    const headerEl = document.querySelector('.header') as HTMLElement | null;

    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      // Synchronous hide for everything that reveals after the loader.
      gsap.set(
        '.hero__title-line, .hero__scroll-btn, .hero__overlay',
        { autoAlpha: 0 },
      );
      gsap.set('.hero__ornament-shell path', { drawSVG: 0 });
      gsap.set('.hero__ornament-line', {
        scaleX: 0,
        transformOrigin: 'left center',
      });
      gsap.set(
        [headerEl, '.hero__card-tl', '.hero__cluster-tr > *'].filter(Boolean),
        { '--clip-r': '100%' },
      );
      gsap.set('.hero__bg', { autoAlpha: 0 });

      // Match the miniature aspect to the final bg's so phase-3 zoom
      // doesn't change the object-fit:cover crop.
      const endRect = bgRef.current?.getBoundingClientRect();
      if (endRect && loaderStageRef.current) {
        loaderStageRef.current.style.aspectRatio = `${endRect.width} / ${endRect.height}`;
      }

      // Hold the welcome text invisible until fonts are ready, then
      // split + animate. SplitText needs the final font metrics at the
      // moment it runs; running it on Georgia and swapping mid-animation
      // produces a re-wrap stutter.
      gsap.set(loaderTextRef.current, { autoAlpha: 0 });
      const fontsLoaded = fontsReady();
      fontsLoaded.then(() => {
        if (!loaderTextRef.current) return;
        gsap.set(loaderTextRef.current, { autoAlpha: 1 });
        const textReveal = revealLines(loaderTextRef.current, {
          immediate: true,
          duration: 0.75,
          stagger: 0.1,
        });
        if (textReveal) splits.push(textReveal.split);
      });

      if (bgRef.current) wireParallax(el, bgRef.current);

      // Wait for the loader image + a min display time + fonts before
      // starting the exit timeline. Hard timeout caps the wait at 6s.
      const loaderImg = loaderImageRef.current;
      const imageLoaded = new Promise<void>((resolve) => {
        if (!loaderImg || loaderImg.complete) {
          resolve();
          return;
        }
        loaderImg.addEventListener('load', () => resolve(), { once: true });
        loaderImg.addEventListener('error', () => resolve(), { once: true });
      });
      const minTime = new Promise<void>((resolve) => window.setTimeout(resolve, 2200));
      const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, 6000));

      Promise.race([
        Promise.all([imageLoaded, minTime, fontsLoaded]).then(() => undefined),
        timeout,
      ]).then(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = '';
          },
        });

        // Phase 2: image sweeps L→R covering the welcome text.
        tl.fromTo(
          loaderImageRef.current,
          { '--clip-r': '100%' },
          { '--clip-r': '0%', duration: 0.95, ease: 'power3.inOut' },
        )
          .to({}, { duration: 0.5 }) // small beat
          // Phase 3: FLIP expansion via transform only (no reflow / re-crop).
          .call(() => {
            const frame = loaderFrameRef.current;
            const end = bgRef.current?.getBoundingClientRect();
            if (!frame || !end) return;
            const start = frame.getBoundingClientRect();
            gsap.set(frame, {
              position: 'fixed',
              top: end.top,
              left: end.left,
              width: end.width,
              height: end.height,
              right: 'auto',
              bottom: 'auto',
              transformOrigin: '0 0',
              x: start.left - end.left,
              y: start.top - end.top,
              scaleX: start.width / end.width,
              scaleY: start.height / end.height,
            });
          })
          .to(loaderFrameRef.current, {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 1.3,
            ease: 'power3.inOut',
          })
          .set('.hero__bg', { autoAlpha: 1 })
          .set(loaderRef.current, { display: 'none' })
          // Phase 4: overlay + content cascade.
          .to('.hero__overlay', { autoAlpha: 1, duration: 0.9, ease: 'power2.out' })
          .add(() => {
            // Fonts are guaranteed ready by now (the timeline gate
            // already awaited fontsLoaded), so revealTitle's SplitText
            // measures with the final PP Editorial New metrics.
            el.querySelectorAll<HTMLElement>('.hero__title-line').forEach(
              (line, i) => {
                gsap.set(line, { autoAlpha: 1 });
                const r = revealTitle(line, { immediate: true, delay: i * 0.12 });
                if (r) splits.push(r.split);
              },
            );
          }, '<')
          .to(headerEl, { '--clip-r': '0%', duration: 0.95, ease: 'power3.inOut' }, '<')
          .to('.hero__card-tl', { '--clip-r': '0%', duration: 0.9, ease: 'power3.inOut' }, '<0.1')
          .to(
            '.hero__cluster-tr > *',
            { '--clip-r': '0%', duration: 0.85, stagger: 0.08, ease: 'power3.inOut' },
            '<',
          )
          .to(
            '.hero__ornament-shell path',
            { drawSVG: '100%', duration: 0.9, stagger: 0.05, ease: 'power2.out' },
            '<',
          )
          .to(
            '.hero__ornament-line',
            { scaleX: 1, duration: 0.9, ease: 'power3.inOut' },
            '<0.25',
          )
          .to(
            '.hero__scroll-btn',
            // Opacity-only — never touch transform so the CSS
            // `translateY(50%)` stays in control of the rest position
            // (and the hover state can override it).
            { autoAlpha: 1, duration: 0.9, ease: 'expo.out' },
            '-=0.4',
          );
      });
    }, el);

    return () => {
      document.body.style.overflow = '';
      headerEl?.style.removeProperty('--clip-r');
      revertReveals(splits);
      ctx.revert();
    };
  }, [rootRef, bgRef, loaderRef, loaderStageRef, loaderTextRef, loaderFrameRef, loaderImageRef]);
};
