import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ActivitiesSection as Data, Activity, ActivityCategory } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import { buildImageUrl, getLqip, getAltText } from '../../services/imageUrl';
import Coquillage from '../Coquillage';
import { revealTitle, revealAllInside, revertReveals } from '../../utils/reveals';
import type { SplitText } from 'gsap/SplitText';

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

const ArrowOut = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
  </svg>
);

const ActivityCard = ({
  item,
  lang,
  index,
  featured,
}: {
  item: Activity;
  lang: 'fr' | 'en';
  index: number;
  featured?: boolean;
}) => {
  const name = pickLocale(item.name, lang);
  const desc = pickLocale(item.description, lang);
  const duration = pickLocale(item.duration, lang);
  const url = buildImageUrl(item.image, {
    width: featured ? 1600 : 1000,
    height: featured ? 1200 : 900,
    fit: 'crop',
    format: 'webp',
    quality: 85,
  });
  const lqip = getLqip(item.image);
  const alt = getAltText(item.image, name);
  const catLabel = CATEGORY_LABEL[item.category]?.[lang] ?? CATEGORY_LABEL.autre[lang];
  const distanceLabel =
    typeof item.distanceKm === 'number'
      ? item.distanceKm === 0
        ? lang === 'fr'
          ? 'Sur place'
          : 'On site'
        : `${item.distanceKm} km`
      : null;

  const Body = (
    <>
      <div className="activity-card__frame">
        <span className="activity-card__number">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div
          className="activity-card__media"
          style={lqip ? { backgroundImage: `url(${lqip})` } : undefined}
        >
          {url && <img src={url} alt={alt} loading="lazy" decoding="async" />}
          <Coquillage
            className="activity-card__shell"
            variant="rays"
            rotate={30}
          />
        </div>
      </div>
      <div className="activity-card__body">
        <p className="activity-card__category">
          <span className="activity-card__category-line" />
          <span>{catLabel}</span>
        </p>
        <h3 className="activity-card__name">{name}</h3>
        {desc && <p className="activity-card__desc">{desc}</p>}
        <footer className="activity-card__foot">
          <div className="activity-card__meta">
            {distanceLabel && <span>{distanceLabel}</span>}
            {duration && <span>{duration}</span>}
          </div>
          {item.externalUrl && (
            <span className="activity-card__more">
              {lang === 'fr' ? 'Découvrir' : 'Discover'}
              <ArrowOut />
            </span>
          )}
        </footer>
      </div>
    </>
  );

  const cardClass = `activity-card${featured ? ' activity-card--featured' : ''}`;

  return item.externalUrl ? (
    <a
      href={item.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClass}
      data-reveal
    >
      {Body}
    </a>
  ) : (
    <article className={cardClass} data-reveal>
      {Body}
    </article>
  );
};

const ActivitiesSection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const t = revealTitle(el.querySelector<HTMLElement>('.activities__title'), {
        trigger: el,
      });
      if (t) splits.push(t.split);
      splits.push(...revealAllInside(el));
      gsap.from(el.querySelectorAll('.activities__head [data-reveal]'), {
        opacity: 0,
        y: 32,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
      gsap.from(el.querySelectorAll('.activity-card'), {
        opacity: 0,
        y: 48,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.1,
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
    <section
      id={data.sectionId || 'activites'}
      className="activities"
      ref={rootRef}
    >
      <div className="activities__inner">
        <header className="activities__head">
          {eyebrow && (
            <p className="activities__eyebrow" data-reveal>
              <Coquillage
                className="activities__eyebrow-mark"
                variant="rays"
                rotate={90}
              />
              <span>{eyebrow}</span>
            </p>
          )}
          <h2 className="activities__title">
            {title}
          </h2>
          {intro && (
            <p className="activities__intro">
              {intro}
            </p>
          )}
        </header>

        <div className="activities__grid">
          {data.activities.map((a, i) => (
            <ActivityCard
              key={a._id}
              item={a}
              lang={lang}
              index={i}
              featured={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
