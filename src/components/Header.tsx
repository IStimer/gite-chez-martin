import { useEffect, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '../providers/ContentProvider';
import { lenisService } from '../services/lenisService';
import { extractBaseLang } from '../i18n/routes';
import { pickLocale } from '../i18n/localized';
import type { Link as CmsLink } from '../types/content';

const Header = () => {
  const { i18n } = useTranslation();
  const lang = extractBaseLang(i18n.language);
  const site = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const [scrollDir, setScrollDir] = useState<'down' | 'up'>('down');

  // Close mobile nav on resize out of mobile
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Track scroll direction so the link underline can sweep L→R when
  // scrolling down and R→L when scrolling up. A small threshold avoids
  // direction flips from sub-pixel jitter at scroll boundaries.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (Math.abs(delta) > 4) {
          setScrollDir(delta > 0 ? 'down' : 'up');
          lastY = y;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Observe sections to highlight active anchor
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveAnchor(visible.target.id);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [site]);

  const nav = site?.mainNavigation ?? [];

  const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    const el = document.getElementById(anchor);
    if (!el) return;
    lenisService.scrollTo(el, { offset: -72, duration: 1.2 });
    setOpen(false);
  };

  const renderLink = (link: CmsLink, idx: number) => {
    const label = pickLocale(link.label, lang);
    if (!label) return null;
    const key = `${link.kind}-${idx}`;
    const isActive = link.kind === 'anchor' && link.anchor === activeAnchor;

    if (link.kind === 'anchor' && link.anchor) {
      return (
        <a
          key={key}
          href={`#${link.anchor}`}
          className={`header__link ${isActive ? 'is-active' : ''}`}
          onClick={(e) => handleAnchorClick(e, link.anchor!)}
        >
          {label}
        </a>
      );
    }
    if (link.kind === 'external') {
      return (
        <a
          key={key}
          href={link.href}
          target={link.openInNewTab ? '_blank' : undefined}
          rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
          className="header__link"
        >
          {label}
        </a>
      );
    }
    if (link.kind === 'email') {
      return <a key={key} href={`mailto:${link.href}`} className="header__link">{label}</a>;
    }
    if (link.kind === 'tel') {
      return <a key={key} href={`tel:${link.href}`} className="header__link">{label}</a>;
    }
    return null;
  };

  const airbnbUrl = site?.externalLinks?.airbnb ?? null;
  const siteName = pickLocale(site?.siteName, lang) || 'Gîte chez Martin';
  const reserveLabel = lang === 'fr' ? 'Réserver' : 'Booking';

  return (
    <header
      className={`header ${open ? 'is-open' : ''}`}
      data-scroll-dir={scrollDir}
    >
      <div className="header__inner">
        <a
          href="#accueil"
          className="header__brand"
          onClick={(e) => handleAnchorClick(e, 'accueil')}
          aria-label={siteName}
        >
          <span className="header__name">{siteName}</span>
        </a>

        <nav className="header__nav" aria-label="Navigation principale">
          {nav.map(renderLink)}
        </nav>

        <div className="header__actions">
          {airbnbUrl && (
            <a
              href={airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="header__cta"
            >
              {reserveLabel}
            </a>
          )}
          <button
            type="button"
            className="header__burger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile drawer — portaled into body so the header's
          `clip-path` doesn't clip it inside the header bar. The
          `is-open` class on the body element drives its visibility
          (set via the effect below) since the drawer is no longer a
          descendant of `.header.is-open`. */}
      {typeof document !== 'undefined' &&
        createPortal(
          <nav
            className={`header__mobile ${open ? 'is-open' : ''}`}
            aria-label="Navigation mobile"
            aria-hidden={!open}
          >
            {nav.map(renderLink)}
            {airbnbUrl && (
              <a
                href={airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="header__mobile-cta"
              >
                {reserveLabel}
              </a>
            )}
          </nav>,
          document.body,
        )}

    </header>
  );
};

export default Header;
