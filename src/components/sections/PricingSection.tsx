import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PricingSection as Data, PricingPeriod } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import SectionHeader from './SectionHeader';
import LocalizedPortableText from '../LocalizedPortableText';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const CURRENCY_SYMBOL = { EUR: '€', USD: '$', GBP: '£' } as const;
const UNIT_LABEL: Record<'perNight' | 'perWeek' | 'perStay', { fr: string; en: string }> = {
  perNight: { fr: '/ nuit', en: '/ night' },
  perWeek: { fr: '/ semaine', en: '/ week' },
  perStay: { fr: '/ séjour', en: '/ stay' },
};

function formatDateRange(start?: string | null, end?: string | null, lang: 'fr' | 'en' = 'fr'): string {
  if (!start || !end) return '';
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
  try {
    const s = new Date(start).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
    const e = new Date(end).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
    return `${s} → ${e}`;
  } catch {
    return '';
  }
}

const PeriodCard = ({ period, lang, index }: { period: PricingPeriod; lang: 'fr' | 'en'; index: number }) => {
  const name = pickLocale(period.name, lang);
  const notes = pickLocale(period.notes, lang);
  const symbol = CURRENCY_SYMBOL[period.currency ?? 'EUR'];
  const unit = UNIT_LABEL[period.priceUnit ?? 'perNight'][lang];
  const range = formatDateRange(period.startDate, period.endDate, lang);

  return (
    <article className="pricing-card" data-reveal style={{ '--i': index } as React.CSSProperties}>
      <header className="pricing-card__head">
        <h3 className="pricing-card__name">{name}</h3>
        {range && <p className="pricing-card__range">{range}</p>}
      </header>
      <div className="pricing-card__price">
        <span className="pricing-card__amount">
          {period.pricePerNight}
          <span className="pricing-card__symbol">{symbol}</span>
        </span>
        <span className="pricing-card__unit">{unit}</span>
      </div>
      {typeof period.minNights === 'number' && period.minNights > 1 && (
        <p className="pricing-card__min">
          {lang === 'fr'
            ? `Minimum ${period.minNights} nuits`
            : `${period.minNights} nights minimum`}
        </p>
      )}
      {period.includes && period.includes.length > 0 && (
        <ul className="pricing-card__includes">
          {period.includes.map((item, i) => (
            <li key={i}>{pickLocale(item, lang)}</li>
          ))}
        </ul>
      )}
      {notes && <p className="pricing-card__notes">{notes}</p>}
    </article>
  );
};

const PricingSection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('[data-reveal]'), {
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id={data.sectionId || 'tarifs'} className="pricing" ref={rootRef}>
      <div className="container">
        <SectionHeader
          eyebrow={data.eyebrow ?? undefined}
          title={data.title}
          intro={data.intro ?? undefined}
          align="center"
        />
        <div className="pricing__grid">
          {data.periods.map((p, i) => (
            <PeriodCard key={p._id} period={p} lang={lang} index={i} />
          ))}
        </div>
        {data.notes && (
          <div className="pricing__footnotes" data-reveal>
            <LocalizedPortableText value={data.notes} />
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
