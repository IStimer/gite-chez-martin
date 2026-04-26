import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PresentationSection as Data } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import LocalizedPortableText from '../LocalizedPortableText';
import { buildImageUrl, getLqip, getAltText } from '../../services/imageUrl';
import { revealTitle, revealAllInside, revertReveals } from '../../utils/reveals';
import type { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const PresentationSection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const rootRef = useRef<HTMLElement | null>(null);

  const title = pickLocale(data.title, lang);
  const titleLines = title.split(/\r?\n/).filter(Boolean);
  const eyebrow = pickLocale(data.eyebrow ?? undefined, lang);

  const mainImg = data.image;
  const wideImg = data.wideImage;
  const secondaryImg = data.secondaryImage;

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      // Masked word reveal on each title line
      el.querySelectorAll<HTMLElement>('.presentation__title-line').forEach(
        (line, i) => {
          const r = revealTitle(line, { trigger: el, delay: i * 0.12 });
          if (r) splits.push(r.split);
        },
      );

      // All h3 → title-style, all p/li → line reveal
      splits.push(...revealAllInside(el));

      gsap.from(el.querySelectorAll('[data-reveal]'), {
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 78%', once: true },
      });

      // Image reveal via clip-path on each figure independently
      el.querySelectorAll<HTMLElement>('[data-image-reveal]').forEach((fig) => {
        gsap.fromTo(
          fig,
          { clipPath: 'inset(14% 14% 14% 14%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: { trigger: fig, start: 'top 82%', once: true },
          },
        );
        const img = fig.querySelector('img');
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.08 },
            {
              scale: 1,
              duration: 1.8,
              ease: 'expo.out',
              scrollTrigger: { trigger: fig, start: 'top 82%', once: true },
            },
          );
        }
      });
    }, el);
    return () => {
      revertReveals(splits);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id={data.sectionId || 'presentation'}
      className="presentation"
      ref={rootRef}
    >
      <div className="presentation__inner">
        {/* Row 1 — full-width title block */}
        <header className="presentation__head">
          {eyebrow && (
            <p className="presentation__eyebrow" data-reveal>
              <span>{eyebrow}</span>
            </p>
          )}
          <h2 className="presentation__title">
            {titleLines.map((line) => (
              <span key={line} className="presentation__title-line">
                {line}
              </span>
            ))}
          </h2>
        </header>

        {/* Row 2+3 — 2×2 grid: text | main // wide | secondary */}
        <div className="presentation__grid">
          <div className="presentation__cell presentation__cell--text">
            <LocalizedPortableText
              value={data.body}
              className="presentation__body"
            />
          </div>

          {mainImg?.image && (
            <figure
              className="presentation__cell presentation__figure presentation__figure--square presentation__figure--main"
              data-image-reveal
            >
              <img
                src={buildImageUrl(mainImg, { width: 900, height: 900, fit: 'crop', format: 'webp' })}
                alt={getAltText(mainImg, '')}
                loading="lazy"
                decoding="async"
                style={getLqip(mainImg) ? { backgroundImage: `url(${getLqip(mainImg)})` } : undefined}
              />
            </figure>
          )}

          {wideImg?.image && (
            <figure
              className="presentation__cell presentation__figure presentation__figure--wide"
              data-image-reveal
            >
              <img
                src={buildImageUrl(wideImg, { width: 1400, height: 933, fit: 'crop', format: 'webp' })}
                alt={getAltText(wideImg, title)}
                loading="lazy"
                decoding="async"
                style={getLqip(wideImg) ? { backgroundImage: `url(${getLqip(wideImg)})` } : undefined}
              />
            </figure>
          )}

          {secondaryImg?.image && (
            <figure
              className="presentation__cell presentation__figure presentation__figure--square presentation__figure--secondary"
              data-image-reveal
            >
              <img
                src={buildImageUrl(secondaryImg, { width: 900, height: 900, fit: 'crop', format: 'webp' })}
                alt={getAltText(secondaryImg, '')}
                loading="lazy"
                decoding="async"
                style={getLqip(secondaryImg) ? { backgroundImage: `url(${getLqip(secondaryImg)})` } : undefined}
              />
            </figure>
          )}
        </div>
      </div>
    </section>
  );
};

export default PresentationSection;
