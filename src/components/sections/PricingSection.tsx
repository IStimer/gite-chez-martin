import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PricingSection as Data, PricingPeriod } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import Coquillage from '../Coquillage';
import { buildImageUrl, getLqip, getAltText } from '../../services/imageUrl';
import { revealTitle, revealAllInside, revertReveals } from '../../utils/reveals';
import type { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const CURRENCY_SYMBOL = { EUR: '€', USD: '$', GBP: '£' } as const;

const UNIT_LABEL: Record<
  'perNight' | 'perWeek' | 'perStay',
  { fr: string; en: string }
> = {
  perNight: { fr: '/ la nuit', en: '/ night' },
  perWeek: { fr: '/ la semaine', en: '/ week' },
  perStay: { fr: '/ le séjour', en: '/ stay' },
};

function formatMonthRange(
  start: string | null | undefined,
  end: string | null | undefined,
  lang: 'fr' | 'en',
): string {
  if (!start || !end) return '';
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  try {
    const fmt = new Intl.DateTimeFormat(locale, { month: 'long' });
    const s = fmt.format(new Date(start));
    const e = fmt.format(new Date(end));
    return `${s} — ${e}`;
  } catch {
    return '';
  }
}

const Ornament = () => (
  <span className="pricing__ornament" aria-hidden="true">
    <Coquillage className="pricing__ornament-shell" variant="full" />
    <span className="pricing__ornament-line" />
    <span className="pricing__ornament-diamond">✦</span>
    <span className="pricing__ornament-line" />
    <Coquillage className="pricing__ornament-shell" variant="full" />
  </span>
);

const PeriodRow = ({
  period,
  lang,
}: {
  period: PricingPeriod;
  lang: 'fr' | 'en';
}) => {
  const name = pickLocale(period.name, lang);
  const symbol = CURRENCY_SYMBOL[period.currency ?? 'EUR'];
  const unit = UNIT_LABEL[period.priceUnit ?? 'perNight'][lang];
  const range = formatMonthRange(period.startDate, period.endDate, lang);
  const includes = (period.includes ?? []).slice(0, 5);
  const minNights =
    typeof period.minNights === 'number' && period.minNights > 1
      ? period.minNights
      : null;

  return (
    <div className="pricing__period" data-reveal>
      <h3 className="pricing__season">{name}</h3>
      {range && <p className="pricing__dates">{range}</p>}
      <p className="pricing__price">
        <span className="pricing__amount">{period.pricePerNight ?? '—'}</span>
        <span className="pricing__currency">{symbol}</span>
        <span className="pricing__unit">{unit}</span>
      </p>
      {minNights && (
        <p className="pricing__min">
          {lang === 'fr'
            ? `Minimum ${minNights} nuits`
            : `${minNights} nights minimum`}
        </p>
      )}
      {includes.length > 0 && (
        <ul className="pricing__includes">
          {includes.map((item, i) => (
            <li key={i}>{pickLocale(item, lang)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const PricingSection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const t = revealTitle(el.querySelector<HTMLElement>('.pricing__title'), {
        trigger: el,
      });
      if (t) splits.push(t.split);
      splits.push(...revealAllInside(el));
      gsap.from(el.querySelectorAll('.pricing__head [data-reveal]'), {
        opacity: 0,
        y: 32,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
      gsap.from(el.querySelectorAll('.pricing__panneau'), {
        opacity: 0,
        y: 48,
        scale: 0.98,
        duration: 1.3,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 72%', once: true },
      });
      gsap.from(el.querySelectorAll('.pricing__period'), {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 60%', once: true },
      });
      gsap.from(el.querySelectorAll('.pricing__ornament'), {
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.15,
        scrollTrigger: { trigger: el, start: 'top 72%', once: true },
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

  return (
    <section id={data.sectionId || 'tarifs'} className="pricing" ref={rootRef}>
      <div className="pricing__inner">
        <header className="pricing__head">
          {eyebrow && (
            <p className="pricing__eyebrow" data-reveal>
              <span>{eyebrow}</span>
            </p>
          )}
          <h2 className="pricing__title">
            {title}
          </h2>
          {intro && (
            <p className="pricing__intro">
              {intro}
            </p>
          )}
        </header>

        <article className="pricing__panneau" aria-label={title}>
          {/* Inner frame — wraps BOTH the image and the content so the
              double-filet surrounds everything */}
          <div className="pricing__frame">
            <div className="pricing__grid">
              {/* Left: landscape photo (side decorative element) */}
              {data.sideImage?.image && (
                <figure
                  className="pricing__side-image"
                  aria-hidden="true"
                  style={
                    getLqip(data.sideImage)
                      ? { backgroundImage: `url(${getLqip(data.sideImage)})` }
                      : undefined
                  }
                >
                  <img
                    src={buildImageUrl(data.sideImage, {
                      // Landscape-oriented source matching the new cell
                      // aspect, high-res for retina sharpness.
                      width: 1800,
                      height: 1200,
                      fit: 'crop',
                      format: 'webp',
                      quality: 90,
                    })}
                    alt={getAltText(data.sideImage, '')}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="pricing__side-overlay" />
                  <span className="pricing__side-year">2026</span>
                  <Coquillage
                    className="pricing__side-shell"
                    variant="full"
                  />
                </figure>
              )}

              {/* Right: content column — periods + ornaments + notes */}
              <div className="pricing__content">
                <p className="pricing__overline">
                  {lang === 'fr' ? 'Carte des tarifs' : 'Price list'}
                </p>

                <Ornament />

                <div className="pricing__periods">
                  {data.periods.map((period) => (
                    <PeriodRow key={period._id} period={period} lang={lang} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default PricingSection;
