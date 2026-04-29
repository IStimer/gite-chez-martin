import { Fragment, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type {
  AccommodationsSection as Data,
  Accommodation,
  EquipmentId,
} from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import { buildImageUrl, getLqip, getAltText } from '../../services/imageUrl';
import Coquillage from '../Coquillage';
import { revealTitle, revealAllInside, revertReveals } from '../../utils/reveals';
import type { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const EQUIPMENT_LABELS: Record<EquipmentId, { fr: string; en: string }> = {
  wifi: { fr: 'Wifi', en: 'Wifi' },
  kitchen: { fr: 'Cuisine équipée', en: 'Full kitchen' },
  kitchenette: { fr: 'Kitchenette', en: 'Kitchenette' },
  privateBathroom: { fr: 'Salle de bain privative', en: 'Private bathroom' },
  sharedBathroom: { fr: 'Salle de bain partagée', en: 'Shared bathroom' },
  terrace: { fr: 'Terrasse', en: 'Terrace' },
  garden: { fr: 'Jardin', en: 'Garden' },
  fireplace: { fr: 'Cheminée', en: 'Fireplace' },
  heating: { fr: 'Chauffage', en: 'Heating' },
  airConditioning: { fr: 'Climatisation', en: 'Air conditioning' },
  tv: { fr: 'TV', en: 'TV' },
  washingMachine: { fr: 'Lave-linge', en: 'Washing machine' },
  dishwasher: { fr: 'Lave-vaisselle', en: 'Dishwasher' },
  parking: { fr: 'Parking', en: 'Parking' },
  linenProvided: { fr: 'Linge de lit fourni', en: 'Linen provided' },
  towelsProvided: { fr: 'Serviettes fournies', en: 'Towels provided' },
  breakfastIncluded: { fr: 'Petit-déjeuner inclus', en: 'Breakfast included' },
  petsAllowed: { fr: 'Animaux acceptés', en: 'Pets welcome' },
  nonSmoking: { fr: 'Non-fumeur', en: 'Non-smoking' },
  accessible: { fr: 'Accès PMR', en: 'Accessible' },
};

const Chapter = ({
  item,
  index,
  lang,
}: {
  item: Accommodation;
  index: number;
  lang: 'fr' | 'en';
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const layout = index % 2 === 0 ? 'imageLeft' : 'imageRight';
  const num = String(index + 1).padStart(2, '0');
  const name = pickLocale(item.name, lang);
  const desc = pickLocale(item.shortDescription, lang);
  const url = buildImageUrl(item.mainImage, {
    width: 1000,
    height: 1250,
    fit: 'crop',
    format: 'webp',
  });
  const lqip = getLqip(item.mainImage);
  const alt = getAltText(item.mainImage, name);

  const roomLabel = (n: number) =>
    lang === 'fr'
      ? n > 1 ? 'chambres' : 'chambre'
      : n > 1 ? 'rooms' : 'room';
  const guestLabel = lang === 'fr' ? 'personnes' : 'guests';

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('[data-reveal]'), {
        opacity: 0,
        y: 32,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
      const fig = el.querySelector<HTMLElement>('.space__visual');
      if (fig) {
        gsap.fromTo(
          fig,
          { clipPath: 'inset(16% 16% 16% 16%)' },
          {
            clipPath: 'inset(0%)',
            duration: 1.5,
            ease: 'expo.out',
            scrollTrigger: { trigger: fig, start: 'top 82%', once: true },
          },
        );
        const img = fig.querySelector('img');
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.12 },
            {
              scale: 1,
              duration: 2,
              ease: 'expo.out',
              scrollTrigger: { trigger: fig, start: 'top 82%', once: true },
            },
          );
          // Scroll-driven parallax. Img CSS overscans the figure by 8%
          // top + bottom, so yPercent ±4 translates ~4.6% of figure
          // height — gentle drift, never reveals the figure's bg edge.
          gsap.fromTo(
            img,
            { yPercent: 4 },
            {
              yPercent: -4,
              ease: 'none',
              scrollTrigger: {
                trigger: fig,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.4,
              },
            },
          );
        }
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <article className="space" data-layout={layout} ref={ref}>
      <figure
        className="space__visual"
        style={lqip ? { backgroundImage: `url(${lqip})` } : undefined}
      >
        {url && <img src={url} alt={alt} loading="lazy" decoding="async" />}
      </figure>
      <div className="space__content">
        <span className="space__number" data-reveal aria-hidden="true">
          {num}
        </span>
        {item.featured && (
          <span className="space__featured" data-reveal>
            {lang === 'fr' ? 'Coup de cœur' : 'Editor’s pick'}
          </span>
        )}
        <h3 className="space__name" data-reveal>
          {name}
        </h3>
        {desc && (
          <p className="space__desc" data-reveal>
            {desc}
          </p>
        )}
        <ul className="space__stats" data-reveal>
          {typeof item.capacity === 'number' && (
            <li>
              <span className="space__stat-value">{item.capacity}</span>
              <span className="space__stat-label">{guestLabel}</span>
            </li>
          )}
          {typeof item.surfaceM2 === 'number' && (
            <li>
              <span className="space__stat-value">{item.surfaceM2}</span>
              <span className="space__stat-label">m²</span>
            </li>
          )}
          {typeof item.bedrooms === 'number' && (
            <li>
              <span className="space__stat-value">{item.bedrooms}</span>
              <span className="space__stat-label">{roomLabel(item.bedrooms)}</span>
            </li>
          )}
        </ul>
        {item.equipments && item.equipments.length > 0 && (
          <ul className="space__amenities" data-reveal>
            {item.equipments.slice(0, 6).map((id) => (
              <li key={id}>
                {EQUIPMENT_LABELS[id]?.[lang] ?? id}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
};

const Divider = () => (
  <div className="spaces__divider" aria-hidden="true">
    <span className="spaces__divider-line" />
    <Coquillage className="spaces__divider-mark" variant="full" />
    <span className="spaces__divider-line" />
  </div>
);

const AccommodationsSection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const t = revealTitle(el.querySelector<HTMLElement>('.spaces__title'), {
        trigger: el,
      });
      if (t) splits.push(t.split);
      splits.push(...revealAllInside(el));

      gsap.from(el.querySelectorAll('.spaces__head [data-reveal]'), {
        opacity: 0,
        y: 32,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
      gsap.from(el.querySelectorAll('.spaces__divider'), {
        opacity: 0,
        scaleX: 0.5,
        transformOrigin: 'center',
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 60%',
          once: true,
        },
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
      id={data.sectionId || 'hebergements'}
      className="spaces"
      ref={rootRef}
    >
      <div className="spaces__inner">
        <header className="spaces__head">
          {eyebrow && (
            <p className="spaces__eyebrow" data-reveal>
              <span>{eyebrow}</span>
            </p>
          )}
          <h2 className="spaces__title">
            {title}
          </h2>
          {intro && (
            <p className="spaces__intro">
              {intro}
            </p>
          )}
        </header>

        <div className="spaces__list">
          {data.accommodations.map((item, i) => (
            <Fragment key={item._id}>
              {i > 0 && <Divider />}
              <Chapter item={item} index={i} lang={lang} />
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccommodationsSection;
