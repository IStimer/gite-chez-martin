import { useLayoutEffect, useRef } from 'react';
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
import SectionHeader from './SectionHeader';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const EQUIPMENT_LABELS: Record<EquipmentId, { fr: string; en: string }> = {
  wifi: { fr: 'Wifi', en: 'Wifi' },
  kitchen: { fr: 'Cuisine équipée', en: 'Full kitchen' },
  kitchenette: { fr: 'Kitchenette', en: 'Kitchenette' },
  privateBathroom: { fr: 'SdB privative', en: 'Private bathroom' },
  sharedBathroom: { fr: 'SdB partagée', en: 'Shared bathroom' },
  terrace: { fr: 'Terrasse', en: 'Terrace' },
  garden: { fr: 'Jardin', en: 'Garden' },
  fireplace: { fr: 'Cheminée', en: 'Fireplace' },
  heating: { fr: 'Chauffage', en: 'Heating' },
  airConditioning: { fr: 'Climatisation', en: 'Air conditioning' },
  tv: { fr: 'TV', en: 'TV' },
  washingMachine: { fr: 'Lave-linge', en: 'Washing machine' },
  dishwasher: { fr: 'Lave-vaisselle', en: 'Dishwasher' },
  parking: { fr: 'Parking', en: 'Parking' },
  linenProvided: { fr: 'Linge fourni', en: 'Linen provided' },
  towelsProvided: { fr: 'Serviettes fournies', en: 'Towels provided' },
  breakfastIncluded: { fr: 'Petit-déj inclus', en: 'Breakfast included' },
  petsAllowed: { fr: 'Animaux OK', en: 'Pets welcome' },
  nonSmoking: { fr: 'Non-fumeur', en: 'Non-smoking' },
  accessible: { fr: 'Accès PMR', en: 'Accessible' },
};

const AccommodationCard = ({
  item,
  index,
  lang,
}: {
  item: Accommodation;
  index: number;
  lang: 'fr' | 'en';
}) => {
  const name = pickLocale(item.name, lang);
  const desc = pickLocale(item.shortDescription, lang);
  const url = buildImageUrl(item.mainImage, { width: 900, height: 600, fit: 'crop', format: 'webp' });
  const lqip = getLqip(item.mainImage);
  const alt = getAltText(item.mainImage, name);
  const equipments = (item.equipments ?? []).slice(0, 5);

  return (
    <article className="accommodation-card" data-reveal style={{ '--i': index } as React.CSSProperties}>
      {item.featured && <span className="accommodation-card__badge">Coup de cœur</span>}
      <div
        className="accommodation-card__media"
        style={lqip ? { backgroundImage: `url(${lqip})` } : undefined}
      >
        {url && (
          <img src={url} alt={alt} loading="lazy" decoding="async" />
        )}
        <div className="accommodation-card__media-overlay" />
      </div>
      <div className="accommodation-card__body">
        <h3 className="accommodation-card__name">{name}</h3>
        {desc && <p className="accommodation-card__desc">{desc}</p>}

        <ul className="accommodation-card__stats">
          {typeof item.capacity === 'number' && (
            <li>
              <span className="accommodation-card__stat-value">{item.capacity}</span>
              <span className="accommodation-card__stat-label">pers.</span>
            </li>
          )}
          {typeof item.bedrooms === 'number' && (
            <li>
              <span className="accommodation-card__stat-value">{item.bedrooms}</span>
              <span className="accommodation-card__stat-label">ch.</span>
            </li>
          )}
          {typeof item.surfaceM2 === 'number' && (
            <li>
              <span className="accommodation-card__stat-value">{item.surfaceM2}</span>
              <span className="accommodation-card__stat-label">m²</span>
            </li>
          )}
        </ul>

        {equipments.length > 0 && (
          <ul className="accommodation-card__equip">
            {equipments.map((id) => (
              <li key={id}>{EQUIPMENT_LABELS[id]?.[lang] ?? id}</li>
            ))}
            {(item.equipments?.length ?? 0) > equipments.length && (
              <li className="accommodation-card__equip-more">
                +{(item.equipments?.length ?? 0) - equipments.length}
              </li>
            )}
          </ul>
        )}
      </div>
    </article>
  );
};

const AccommodationsSection = ({ data }: { data: Data }) => {
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
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const layout = data.layout ?? 'grid';

  return (
    <section
      id={data.sectionId || 'hebergements'}
      className={`accommodations accommodations--${layout}`}
      ref={rootRef}
    >
      <div className="container">
        <SectionHeader
          eyebrow={data.eyebrow ?? undefined}
          title={data.title}
          intro={data.intro ?? undefined}
          align="left"
        />

        <div className="accommodations__grid">
          {data.accommodations.map((item, i) => (
            <AccommodationCard key={item._id} item={item} index={i} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccommodationsSection;
