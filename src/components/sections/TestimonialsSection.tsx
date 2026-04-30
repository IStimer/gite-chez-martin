import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type {
  TestimonialsSection as Data,
  Testimonial,
} from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import { buildImageUrl } from '../../services/imageUrl';
import { useSiteSettings } from '../../providers/ContentProvider';
import { fetchGoogleReviews } from '../../services/googleReviewsService';
import { revealTitle, revealAllInside, revertReveals } from '../../utils/reveals';
import type { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const AUTO_ADVANCE_MS = 7500;

const SOURCE_LABEL: Record<string, string> = {
  direct: '',
  google: 'Google',
  airbnb: 'Airbnb',
  booking: 'Booking',
  other: '',
};

const Stars = ({ rating, small = false }: { rating: number; small?: boolean }) => (
  <span
    className={`testimonial__stars ${small ? 'testimonial__stars--sm' : ''}`}
    aria-label={`${rating} / 5`}
  >
    {[1, 2, 3, 4, 5].map((n) => (
      <svg key={n} viewBox="0 0 16 16" aria-hidden="true">
        <path
          fill={n <= rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.2"
          d="M8 1.5l2 4.4 4.8.4-3.6 3.2 1.1 4.7L8 11.8l-4.3 2.4 1.1-4.7L1.2 6.3l4.8-.4L8 1.5Z"
        />
      </svg>
    ))}
  </span>
);

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const Avatar = ({ item }: { item: Testimonial }) => {
  const sanityUrl = item.avatar
    ? buildImageUrl(item.avatar, {
        width: 160,
        height: 160,
        fit: 'crop',
        format: 'webp',
      })
    : undefined;
  const url = sanityUrl || item.avatarUrl || undefined;
  if (url) {
    return (
      <img
        className="testimonial__avatar"
        src={url}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <span
      className="testimonial__avatar testimonial__avatar--placeholder"
      aria-hidden="true"
    >
      {getInitials(item.authorName || '•')}
    </span>
  );
};

const formatDate = (
  iso: string | null | undefined,
  lang: 'fr' | 'en',
): string => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat(
      lang === 'fr' ? 'fr-FR' : 'en-US',
      { month: 'long', year: 'numeric' },
    );
    return fmt.format(d);
  } catch {
    return '';
  }
};

const TestimonialsSection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const site = useSiteSettings();
  const rootRef = useRef<HTMLElement | null>(null);

  // Base testimonials from Sanity, optionally merged with Google reviews
  const [googleItems, setGoogleItems] = useState<Testimonial[]>([]);
  const placeId = site?.googleReviews?.placeId ?? null;
  const merge = site?.googleReviews?.merge !== false;

  useEffect(() => {
    if (!placeId) return;
    let cancelled = false;
    fetchGoogleReviews(placeId, lang).then((reviews) => {
      if (!cancelled) setGoogleItems(reviews);
    });
    return () => {
      cancelled = true;
    };
  }, [placeId, lang]);

  const items = useMemo(() => {
    const base = data.testimonials.filter((t) => t.published !== false);
    if (placeId && merge && googleItems.length) {
      return [...base, ...googleItems];
    }
    if (placeId && !merge && googleItems.length) {
      return googleItems;
    }
    return base;
  }, [data.testimonials, placeId, merge, googleItems]);

  const total = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (active >= total) setActive(0);
  }, [total, active]);

  // Auto-advance timer that pauses on hover *without* resetting. We
  // track elapsed time in a ref and, on resume, only schedule for the
  // remaining slice — so brief mouse-over moments don't keep pushing
  // the next advance back to a full AUTO_ADVANCE_MS.
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const remainingRef = useRef<number>(AUTO_ADVANCE_MS);
  const prevActiveRef = useRef<number>(active);

  useEffect(() => {
    if (total < 2) return;

    // Reset budget only when the active card actually changes —
    // toggling `paused` on hover must not reset it.
    if (prevActiveRef.current !== active) {
      remainingRef.current = AUTO_ADVANCE_MS;
      prevActiveRef.current = active;
    }

    if (paused) {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
        const elapsed = performance.now() - startedAtRef.current;
        remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      }
      return;
    }

    startedAtRef.current = performance.now();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setActive((i) => (i + 1) % total);
    }, remainingRef.current);

    return () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [active, total, paused]);

  // Section header reveal
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const t = revealTitle(el.querySelector<HTMLElement>('.testimonials__title'), {
        trigger: el,
      });
      if (t) splits.push(t.split);
      splits.push(...revealAllInside(el));
      gsap.from(el.querySelectorAll('.testimonials__head [data-reveal]'), {
        opacity: 0,
        y: 32,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
      gsap.from(el.querySelectorAll('.testimonial'), {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 70%', once: true },
      });
    }, el);
    return () => {
      revertReveals(splits);
      ctx.revert();
    };
  }, []);

  const eyebrow = pickLocale(data.eyebrow ?? undefined, lang);
  const title = pickLocale(data.title, lang);
  const intro = pickLocale(data.intro ?? undefined, lang);

  if (!total) return null;

  return (
    <section
      id={data.sectionId || 'avis'}
      className="testimonials"
      data-paused={paused ? 'true' : 'false'}
      ref={rootRef}
    >
      <div className="testimonials__inner">
        <header className="testimonials__head">
          {eyebrow && (
            <p className="testimonials__eyebrow" data-reveal>
              <span>{eyebrow}</span>
            </p>
          )}
          <h2 className="testimonials__title">
            {title}
          </h2>
          {intro && (
            <p className="testimonials__intro">
              {intro}
            </p>
          )}
        </header>

        <ol className="testimonials__row" role="list" data-no-reveal>
          {items.map((item, i) => {
            const isActive = i === active;
            const body = pickLocale(item.body, lang);
            const origin = pickLocale(item.origin, lang);
            const source = item.source ? SOURCE_LABEL[item.source] : '';
            const date = formatDate(item.date, lang);

            return (
              <li
                key={item._id}
                className={`testimonial ${isActive ? 'testimonial--active' : ''}`}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <button
                  type="button"
                  className="testimonial__btn"
                  onClick={() => setActive(i)}
                  onFocus={() => setPaused(true)}
                  onBlur={() => setPaused(false)}
                  aria-expanded={isActive}
                  aria-label={
                    isActive
                      ? `Avis de ${item.authorName}`
                      : `Ouvrir l'avis de ${item.authorName}`
                  }
                >
                  <header className="testimonial__head">
                    <Avatar item={item} />
                    <div className="testimonial__head-text">
                      <span className="testimonial__name">
                        {item.authorName}
                      </span>
                      <Stars rating={item.rating ?? 5} small={!isActive} />
                    </div>
                  </header>

                  {/* Body — always visible; line-clamped when collapsed */}
                  {body && (
                    <p className="testimonial__body">{body}</p>
                  )}

                  <footer className="testimonial__sub">
                    {origin && <span>{origin}</span>}
                    {origin && (date || source) && (
                      <span className="testimonial__sub-dot">·</span>
                    )}
                    {date && <span>{date}</span>}
                    {date && source && (
                      <span className="testimonial__sub-dot">·</span>
                    )}
                    {source && (
                      <span className="testimonial__source">{source}</span>
                    )}
                  </footer>
                </button>

                {isActive && total > 1 && (
                  <span
                    key={`${item._id}-progress-${active}`}
                    className="testimonial__progress"
                    aria-hidden="true"
                    style={{ animationDuration: `${AUTO_ADVANCE_MS}ms` }}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default TestimonialsSection;
