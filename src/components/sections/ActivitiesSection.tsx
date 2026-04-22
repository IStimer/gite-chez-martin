import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ActivitiesSection as Data, Activity, ActivityCategory } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import { buildImageUrl, getLqip, getAltText } from '../../services/imageUrl';
import SectionHeader from './SectionHeader';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const CATEGORY_LABEL: Record<ActivityCategory, { fr: string; en: string }> = {
  compostelle: { fr: 'Compostelle', en: 'Compostela' },
  randonnee: { fr: 'Randonnée', en: 'Hiking' },
  patrimoine: { fr: 'Patrimoine', en: 'Heritage' },
  nature: { fr: 'Nature', en: 'Nature' },
  gastronomie: { fr: 'Gastronomie', en: 'Food' },
  famille: { fr: 'Famille', en: 'Family' },
  sport: { fr: 'Sport', en: 'Sport' },
  autre: { fr: 'Autour', en: 'Around' },
};

const ActivityCard = ({ item, lang, index }: { item: Activity; lang: 'fr' | 'en'; index: number }) => {
  const name = pickLocale(item.name, lang);
  const desc = pickLocale(item.description, lang);
  const duration = pickLocale(item.duration, lang);
  const url = buildImageUrl(item.image, { width: 900, height: 680, fit: 'crop', format: 'webp' });
  const lqip = getLqip(item.image);
  const alt = getAltText(item.image, name);
  const catLabel = CATEGORY_LABEL[item.category]?.[lang] ?? CATEGORY_LABEL.autre[lang];

  const Body = (
    <>
      <div
        className="activity-card__media"
        style={lqip ? { backgroundImage: `url(${lqip})` } : undefined}
      >
        {url && <img src={url} alt={alt} loading="lazy" decoding="async" />}
        <span className="activity-card__category">{catLabel}</span>
      </div>
      <div className="activity-card__body">
        <h3 className="activity-card__name">{name}</h3>
        {desc && <p className="activity-card__desc">{desc}</p>}
        <div className="activity-card__meta">
          {typeof item.distanceKm === 'number' && (
            <span>{item.distanceKm === 0 ? 'Sur place' : `${item.distanceKm} km`}</span>
          )}
          {duration && <span>{duration}</span>}
        </div>
      </div>
    </>
  );

  const cardProps = {
    className: 'activity-card',
    'data-reveal': true,
    style: { '--i': index } as React.CSSProperties,
  };

  return item.externalUrl ? (
    <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" {...cardProps}>
      {Body}
    </a>
  ) : (
    <article {...cardProps}>{Body}</article>
  );
};

const ActivitiesSection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('[data-reveal]'), {
        opacity: 0,
        y: 48,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id={data.sectionId || 'activites'}
      className="activities"
      ref={rootRef}
    >
      <div className="container">
        <SectionHeader
          eyebrow={data.eyebrow ?? undefined}
          title={data.title}
          intro={data.intro ?? undefined}
          align="left"
        />
        <div className="activities__grid">
          {data.activities.map((a, i) => (
            <ActivityCard key={a._id} item={a} lang={lang} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
