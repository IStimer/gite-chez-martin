import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PresentationSection as Data } from '../../types/content';
import SectionHeader from './SectionHeader';
import LocalizedPortableText from '../LocalizedPortableText';
import { buildImageUrl, getLqip, getAltText } from '../../services/imageUrl';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const PresentationSection = ({ data }: { data: Data }) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const layout = data.layout ?? 'imageRight';
  const imageUrl = buildImageUrl(data.image, { width: 1400, format: 'webp', quality: 85 });
  const lqip = getLqip(data.image);
  const alt = getAltText(data.image, '');

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
        scrollTrigger: { trigger: el, start: 'top 75%', once: true },
      });
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current.querySelector('img'),
          { scale: 1.08 },
          {
            scale: 1,
            duration: 1.8,
            ease: 'expo.out',
            scrollTrigger: { trigger: imageRef.current, start: 'top 80%', once: true },
          },
        );
        gsap.fromTo(
          imageRef.current,
          { clipPath: 'inset(20% 20% 20% 20%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.6,
            ease: 'expo.out',
            scrollTrigger: { trigger: imageRef.current, start: 'top 80%', once: true },
          },
        );
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id={data.sectionId || 'presentation'}
      className={`presentation presentation--${layout}`}
      ref={rootRef}
    >
      <div className="container presentation__inner">
        <div className="presentation__content">
          <SectionHeader
            eyebrow={data.eyebrow ?? undefined}
            title={data.title}
            align="left"
          />
          <div className="presentation__body" data-reveal>
            <LocalizedPortableText value={data.body} />
          </div>
        </div>

        {imageUrl && (
          <div
            ref={imageRef}
            className="presentation__image"
            style={lqip ? { backgroundImage: `url(${lqip})` } : undefined}
          >
            <img src={imageUrl} alt={alt} loading="lazy" decoding="async" />
          </div>
        )}
      </div>
    </section>
  );
};

export default PresentationSection;
