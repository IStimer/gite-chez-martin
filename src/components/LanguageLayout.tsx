import { useEffect } from 'react';
import { Outlet, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isSupportedLang, DEFAULT_LANG } from '../i18n/routes';

const LanguageLayout = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  const valid = isSupportedLang(lang);

  useEffect(() => {
    if (!valid) return;
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
  }, [lang, valid, i18n]);

  if (!valid) return <Navigate to={`/${DEFAULT_LANG}`} replace />;

  return <Outlet />;
};

export default LanguageLayout;
