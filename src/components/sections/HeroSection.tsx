import { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { HeroSection as HeroData } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import { buildImageUrl, getLqip, getAltText } from '../../services/imageUrl';
import { lenisService } from '../../services/lenisService';
import { useSiteSettings } from '../../providers/ContentProvider';
import Coquillage from '../Coquillage';
import { revealTitle, revealLines, revertReveals } from '../../utils/reveals';
import type { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const HouseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10.5V20h14v-9.5" />
    <path d="M10 20v-5h4v5" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17" />
    <path d="M8 3v4M16 3v4" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const DownArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14" />
    <path d="m6 13 6 6 6-6" />
  </svg>
);

const HeroSection = ({ data }: { data: HeroData }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const site = useSiteSettings();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loaderStageRef = useRef<HTMLDivElement | null>(null);
  const loaderTextRef = useRef<HTMLParagraphElement | null>(null);
  const loaderFrameRef = useRef<HTMLDivElement | null>(null);
  const loaderImageRef = useRef<HTMLImageElement | null>(null);

  const id = data.sectionId || 'accueil';
  const titleRaw = pickLocale(data.title, lang) || '';
  const brand = pickLocale(site?.siteName, lang) || 'Gîte chez Martin';
  const welcomeLines =
    lang === 'fr'
      ? [
          `Bienvenue au ${brand}.`,
          'Un havre sur le chemin de Compostelle.',
          'Prenez le temps, installez-vous.',
        ]
      : [
          `Welcome to ${brand}.`,
          'A haven on the Compostela Way.',
          'Take your time, settle in.',
        ];
  const titleLines = titleRaw.split(/\r?\n/).filter(Boolean);
  const subtitle = pickLocale(data.subtitle, lang);
  // Native asset is 1584w — request just above it so the browser
  // does the final 100vw stretch from a near-1:1 source. Asking
  // Sanity for higher widths just upscales and adds blur.
  const bgUrl = buildImageUrl(data.backgroundImage, {
    width: 1700,
    format: 'webp',
    quality: 92,
  });
  const lqip = getLqip(data.backgroundImage);
  const alt = getAltText(data.backgroundImage, titleRaw);

  const badge = data.locationBadge;
  const city = pickLocale(badge?.city, lang);
  const region = pickLocale(badge?.region, lang);
  const detailsLabel = pickLocale(badge?.detailsLink?.label, lang) || (lang === 'fr' ? 'Détails' : 'Details');
  const detailsAnchor = badge?.detailsLink?.anchor;

  const onAnchor = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) lenisService.scrollTo(el, { offset: -72, duration: 1 });
  };

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // Mobile bypass — no intro loader. Title still gets its char
    // reveal on mount, parallax stays wired, but nothing else is
    // hidden / orchestrated.
    const isMobile =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const splits: SplitText[] = [];
      const ctx = gsap.context(() => {
        el.querySelectorAll<HTMLElement>('.hero__title-line').forEach(
          (line, i) => {
            const r = revealTitle(line, {
              immediate: true,
              delay: 0.2 + i * 0.1,
            });
            if (r) splits.push(r.split);
          },
        );
        if (bgRef.current) {
          gsap.to(bgRef.current, {
            scale: 1.1,
            yPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.4,
            },
          });
        }
      }, el);
      return () => {
        revertReveals(splits);
        ctx.revert();
      };
    }

    // Always start at top so the loader transition plays from zero —
    // even if the browser preserved a scroll position across reload.
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    // Grab the header now so we can guarantee it's reset on cleanup —
    // it lives outside the hero section and is shared across routes,
    // so we can't rely on gsap.context.revert to always restore its
    // inline `--clip-r` properly (navigating away mid-animation can
    // leave the header hidden on the next page otherwise).
    const headerEl = document.querySelector('.header') as HTMLElement | null;

    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      // Hide synchronously (before paint) everything that will reveal
      // *after* the loader exits — prevents the flash of natural
      // content that would otherwise appear.
      gsap.set(
        '.hero__title-line, .hero__ornament, .hero__scroll-btn, .hero__overlay',
        { autoAlpha: 0 },
      );
      gsap.set('.hero__ornament', { x: -40 });
      // Clip-path reveal targets. The header bar is revealed as a
      // single sweep (the white chrome slides in with its contents);
      // the top-cluster cards each get their own sweep.
      // `.header` lives OUTSIDE the hero-block — use the element
      // captured above (outside the context scope) directly.
      gsap.set(
        [headerEl, '.hero__card-tl', '.hero__cluster-tr > *'].filter(Boolean),
        { '--clip-r': '100%' },
      );
      // Hero bg hidden until the loader hands over. No scale set here:
      // matching the loader image at scale 1 eliminates the "dezoom"
      // apparent motion that came from the post-handoff scale reset.
      gsap.set('.hero__bg', { autoAlpha: 0 });

      // Match the loader miniature's aspect-ratio to the final
      // hero__bg rect — so when phase 3 transform-scales the frame
      // up to full size, the image's object-fit:cover crop doesn't
      // change. Same crop throughout = no stretch glitch.
      const endRect = bgRef.current?.getBoundingClientRect();
      if (endRect && loaderStageRef.current) {
        loaderStageRef.current.style.aspectRatio = `${endRect.width} / ${endRect.height}`;
      }

      // Phase 1: reveal the welcome paragraph line-by-line with the
      // same mask pattern used across the app.
      const textReveal = revealLines(loaderTextRef.current, {
        immediate: true,
        duration: 0.75,
        stagger: 0.1,
      });
      if (textReveal) splits.push(textReveal.split);

      // Parallax bg on scroll — bg matches the hero's bounds (no
      // oversizing), so the parallax is done via transform scale+yPercent
      // which is self-contained. Starts at rest (scale 1) which is also
      // the loader image's final state → seamless handoff.
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          scale: 1.1,
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.4,
          },
        });
      }

      // Wait for the loader image (same src as hero bg) — it's loading
      // behind the text during the intro phrase so the sweep is crisp.
      const loaderImg = loaderImageRef.current;
      const imageLoaded = new Promise<void>((resolve) => {
        if (!loaderImg || loaderImg.complete) {
          resolve();
          return;
        }
        loaderImg.addEventListener('load', () => resolve(), { once: true });
        loaderImg.addEventListener('error', () => resolve(), { once: true });
      });

      // Minimum display time for the intro phrase — so the reader has
      // time to breathe the sentence, even on a warm cache.
      const minTime = new Promise<void>((resolve) =>
        window.setTimeout(resolve, 2200),
      );

      // Safety ceiling on a bad network.
      const timeout = new Promise<void>((resolve) =>
        window.setTimeout(resolve, 6000),
      );

      Promise.race([
        Promise.all([imageLoaded, minTime]).then(() => undefined),
        timeout,
      ]).then(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = '';
          },
        });

        // ── Phase 2: image sweeps in L→R covering the text in place
        // Start value forced to 100% so the reveal always begins with
        // the image fully hidden (no "already 20% visible" artefact).
        // power3.inOut: acceleration + deceleration, less jerky than
        // the extreme cubic-bezier(0.87, 0, 0.13, 1) that stalled at
        // both ends. ──────────────────────────────────────────────────
        tl.fromTo(
          loaderImageRef.current,
          { '--clip-r': '100%' },
          {
            '--clip-r': '0%',
            duration: 0.95,
            ease: 'power3.inOut',
          },
        )
          // Small beat with the miniature settled in the text zone.
          .to({}, { duration: 0.5 })
          // ── Phase 3: FLIP-style expansion using transform only.
          // Animating width/height/top/left triggers layout every
          // frame AND makes object-fit: cover re-crop continuously
          // (→ visible vibration). We instead pin the frame at its
          // FINAL rect and apply an inverse transform so it visually
          // sits at the miniature position — then tween the transform
          // to identity. No reflow, no re-crop, buttery zoom. ──────
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
          // Hand off to the real hero bg (same rect = no visual jump)
          // then drop the loader.
          .set('.hero__bg', { autoAlpha: 1 })
          .set(loaderRef.current, { display: 'none' })
          // ── Phase 4: overlay + hero content cascade ────────────────
          .to(
            '.hero__overlay',
            { autoAlpha: 1, duration: 0.9, ease: 'power2.out' },
          )
          .add(() => {
            el.querySelectorAll<HTMLElement>('.hero__title-line').forEach(
              (line, i) => {
                gsap.set(line, { autoAlpha: 1 });
                const r = revealTitle(line, {
                  immediate: true,
                  delay: i * 0.12,
                });
                if (r) splits.push(r.split);
              },
            );
          }, '<')
          // Header reveal — single L→R clip-path sweep on the whole
          // bar so the white chrome slides in with its contents in one
          // smooth motion (no staggered child animations). Uses the
          // direct element node since .header is outside this gsap
          // context's scope.
          .to(
            headerEl,
            {
              '--clip-r': '0%',
              duration: 0.95,
              ease: 'power3.inOut',
            },
            '<',
          )
          .to(
            '.hero__card-tl',
            {
              '--clip-r': '0%',
              duration: 0.9,
              ease: 'power3.inOut',
            },
            '<0.1',
          )
          .to(
            '.hero__cluster-tr > *',
            {
              '--clip-r': '0%',
              duration: 0.85,
              stagger: 0.08,
              ease: 'power3.inOut',
            },
            '<',
          )
          .to(
            '.hero__ornament',
            { autoAlpha: 1, x: 0, duration: 1.0, ease: 'expo.out' },
            '<',
          )
          .to(
            '.hero__scroll-btn',
            { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' },
            '-=0.4',
          );
      });
    }, el);
    return () => {
      document.body.style.overflow = '';
      // Defensively remove any inline `--clip-r` left on the header —
      // gsap.context.revert doesn't always clear it if the timeline
      // was interrupted mid-flight, which would leave the nav
      // invisible on the next page we land on.
      headerEl?.style.removeProperty('--clip-r');
      revertReveals(splits);
      ctx.revert();
    };
  }, []);

  return (
    <div className="hero-block" ref={rootRef}>
      <section id={id} className="hero">
      {/* Decorative background — absolute so the flex layout can breathe on top */}
      <div
        className="hero__bg"
        ref={bgRef}
        style={lqip ? { backgroundImage: `url(${lqip})` } : undefined}
      >
        {bgUrl && (
          <img
            src={bgUrl}
            alt={alt}
            className="hero__bg-image"
            loading="eager"
            decoding="async"
          />
        )}
      </div>
      <div className="hero__overlay" />

      {/* Content layout — grid with 3 rows: cards (auto) / middle (1fr) / title (auto) */}
      <div className="hero__layout">
        {/* Row 1 — top cards */}
        <header className="hero__top">
          {subtitle ? (
            <aside className="hero__card-tl">
              <p>{subtitle}</p>
            </aside>
          ) : (
            <div aria-hidden="true" />
          )}

          <aside className="hero__cluster-tr">
            {(city || region) && (
              <div className="hero__location-pill">
                <span className="hero__location-pin"><PinIcon /></span>
                <div className="hero__location-text">
                  {city && <span className="hero__location-city">{city}</span>}
                  {region && <span className="hero__location-region">{region}</span>}
                </div>
                {detailsAnchor ? (
                  <a
                    href={`#${detailsAnchor}`}
                    className="hero__location-details"
                    onClick={(e) => { e.preventDefault(); onAnchor(detailsAnchor); }}
                  >
                    {detailsLabel}
                  </a>
                ) : (
                  <span className="hero__location-details">{detailsLabel}</span>
                )}
              </div>
            )}
            <div className="hero__tiles">
              <button type="button" className="hero__tile" aria-label="Hébergements" onClick={() => onAnchor('hebergements')}>
                <HouseIcon />
              </button>
              <button type="button" className="hero__tile" aria-label="Tarifs" onClick={() => onAnchor('tarifs')}>
                <CalendarIcon />
              </button>
            </div>
          </aside>
        </header>

        {/* Row 2 — middle: ornament auto-centered in the remaining space */}
        <div className="hero__middle">
          <div className="hero__ornament" aria-hidden="true">
            <Coquillage
              className="hero__ornament-shell"
              variant="rays"
              rotate={90}
            />
            <span className="hero__ornament-line" />
          </div>
        </div>

        {/* Row 3 — title, ferré bas */}
        <div className="hero__bottom">
          <h1 className="hero__title">
            {titleLines.map((line, i) => (
              <span key={i} className="hero__title-line">{line}</span>
            ))}
          </h1>
        </div>
      </div>

      </section>

      {/* Scroll indicator — outside .hero overflow; straddles the hero/section boundary */}
      <button
        type="button"
        className="hero__scroll-btn"
        aria-label="Faire défiler"
        onClick={() => onAnchor('presentation')}
      >
        <span className="hero__scroll-btn-icon" aria-hidden="true">
          <DownArrow />
        </span>
      </button>

      {/* Loader portaled into body — escapes the hero's stacking
          context so it always sits above the fixed header. */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="hero__loader" aria-hidden="true" ref={loaderRef}>
            <div className="hero__loader-stage" ref={loaderStageRef}>
              <p className="hero__loader-text" ref={loaderTextRef}>
                {welcomeLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < welcomeLines.length - 1 && <br />}
                  </span>
                ))}
              </p>
              {/* Frame overlays the text zone exactly — its bounds are
                  the stage's bounds, which are driven by the text
                  paragraph sizing. The image inside is clipped
                  initially and sweeps L→R during phase 2. */}
              <div className="hero__loader-frame" ref={loaderFrameRef}>
                {bgUrl && (
                  <img
                    src={bgUrl}
                    alt=""
                    className="hero__loader-image"
                    ref={loaderImageRef}
                    decoding="async"
                  />
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default HeroSection;
