import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { TestimonialsSection as Data, Testimonial } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import SectionHeader from './SectionHeader';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const Stars = ({ rating }: { rating: number }) => (
  <span className="testimonial__stars" aria-label={`${rating} sur 5`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <svg key={n} viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
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

const SOURCE_LABEL = {
  direct: 'Direct',
  google: 'Google',
  airbnb: 'Airbnb',
  booking: 'Booking',
  other: '',
} as const;

const TestimonialCard = ({
  item,
  lang,
}: {
  item: Testimonial;
  lang: 'fr' | 'en';
}) => {
  const body = pickLocale(item.body, lang);
  const origin = pickLocale(item.origin, lang);
  const source = item.source ? SOURCE_LABEL[item.source] : '';
  return (
    <article className="testimonial">
      <Stars rating={item.rating ?? 5} />
      <blockquote className="testimonial__body">
        <p>“{body}”</p>
      </blockquote>
      <footer className="testimonial__meta">
        <strong className="testimonial__author">{item.authorName}</strong>
        {origin && <span className="testimonial__origin">{origin}</span>}
        {source && <span className="testimonial__source">· {source}</span>}
      </footer>
    </article>
  );
};

const TestimonialsSection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const mode = data.displayMode ?? 'carousel';
  const count = data.testimonials.length;

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('[data-reveal]'), {
        opacity: 0,
        y: 36,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (mode !== 'carousel' || count <= 1) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % count);
    }, 6500);
    return () => window.clearInterval(id);
  }, [mode, count]);

  const goTo = useCallback((i: number) => {
    setActive(((i % count) + count) % count);
  }, [count]);

  if (mode === 'grid' || mode === 'list') {
    return (
      <section id={data.sectionId || 'avis'} className={`testimonials testimonials--${mode}`} ref={rootRef}>
        <div className="container">
          <SectionHeader
            eyebrow={data.eyebrow ?? undefined}
            title={data.title}
            intro={data.intro ?? undefined}
            align="center"
          />
          <div className="testimonials__grid" data-reveal>
            {data.testimonials.map((t) => (
              <div key={t._id} data-reveal>
                <TestimonialCard item={t} lang={lang} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={data.sectionId || 'avis'} className="testimonials testimonials--carousel" ref={rootRef}>
      <div className="container">
        <SectionHeader
          eyebrow={data.eyebrow ?? undefined}
          title={data.title}
          intro={data.intro ?? undefined}
          align="center"
        />
        <div className="testimonials__carousel" data-reveal>
          <div
            className="testimonials__track"
            ref={trackRef}
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {data.testimonials.map((t) => (
              <div key={t._id} className="testimonials__slide">
                <TestimonialCard item={t} lang={lang} />
              </div>
            ))}
          </div>

          {count > 1 && (
            <div className="testimonials__controls">
              <button
                type="button"
                className="testimonials__nav"
                aria-label="Précédent"
                onClick={() => goTo(active - 1)}
              >
                ‹
              </button>
              <div className="testimonials__dots">
                {data.testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`testimonials__dot ${i === active ? 'is-active' : ''}`}
                    aria-label={`Aller à l'avis ${i + 1}`}
                    aria-current={i === active}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="testimonials__nav"
                aria-label="Suivant"
                onClick={() => goTo(active + 1)}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
