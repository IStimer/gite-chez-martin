import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ContactSection as Data } from '../../types/content';
import { extractBaseLang } from '../../i18n/routes';
import { pickLocale } from '../../i18n/localized';
import { useSiteSettings } from '../../providers/ContentProvider';
import SectionHeader from './SectionHeader';
import Coquillage from '../Coquillage';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const ContactSection = ({ data }: { data: Data }) => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const site = useSiteSettings();
  const rootRef = useRef<HTMLElement | null>(null);

  const email = site?.email;
  const phone = site?.phone;
  const showEmail = data.showEmail !== false && !!email;
  const showPhone = data.showPhone !== false && !!phone;
  const notes = pickLocale(data.additionalNotes, lang);
  const airbnbLabel = pickLocale(data.airbnbCta?.link?.label, lang);
  const airbnbHref =
    data.airbnbCta?.link?.href ||
    site?.externalLinks?.airbnb ||
    null;

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('[data-reveal]'), {
        opacity: 0,
        y: 32,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
      gsap.from(el.querySelector('.contact__mark'), {
        opacity: 0,
        scale: 0.6,
        rotation: -18,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 70%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id={data.sectionId || 'contact'} className="contact" ref={rootRef}>
      <Coquillage className="contact__mark" />
      <div className="container">
        <SectionHeader
          eyebrow={data.eyebrow ?? undefined}
          title={data.title}
          intro={data.intro ?? undefined}
          align="center"
        />

        <div className="contact__methods" data-reveal>
          {showEmail && (
            <a className="contact__method" href={`mailto:${email}`}>
              <span className="contact__method-label">
                {lang === 'fr' ? 'Écrire un email' : 'Send an email'}
              </span>
              <span className="contact__method-value">{email}</span>
            </a>
          )}
          {showPhone && (
            <a className="contact__method" href={`tel:${phone!.replace(/\s/g, '')}`}>
              <span className="contact__method-label">
                {lang === 'fr' ? 'Appeler' : 'Call'}
              </span>
              <span className="contact__method-value">{phone}</span>
            </a>
          )}
        </div>

        {airbnbHref && (
          <div className="contact__cta" data-reveal>
            <a
              href={airbnbHref}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__airbnb"
            >
              {airbnbLabel || (lang === 'fr' ? 'Voir sur Airbnb' : 'View on Airbnb')}
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        )}

        {notes && (
          <p className="contact__notes" data-reveal>{notes}</p>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
