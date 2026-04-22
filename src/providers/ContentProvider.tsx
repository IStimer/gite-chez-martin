/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchHomePayload } from '../services/homeService';
import type { HomePayload, SiteSettings, HomePage, Theme } from '../types/content';

interface ContentContextValue {
  siteSettings: SiteSettings | null;
  homePage: HomePage | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

const DEFAULT_THEME: Required<Theme> = {
  primaryColor: '#1F3A2E',
  secondaryColor: '#E8DEC5',
  accentColor: '#C9A45B',
  backgroundColor: '#FBF8F1',
  textColor: '#1A1A1A',
};

function applyTheme(theme: Theme | null | undefined) {
  const t = { ...DEFAULT_THEME, ...(theme ?? {}) };
  const root = document.documentElement;
  root.style.setProperty('--color-primary', t.primaryColor);
  root.style.setProperty('--color-secondary', t.secondaryColor);
  root.style.setProperty('--color-accent', t.accentColor);
  root.style.setProperty('--color-bg', t.backgroundColor);
  root.style.setProperty('--color-fg', t.textColor);
  // Derived tokens
  root.style.setProperty('--color-primary-soft', t.primaryColor + 'E6'); // 90% alpha
  root.style.setProperty('--color-primary-faded', t.primaryColor + '1A'); // 10% alpha
  root.style.setProperty('--color-secondary-muted', t.secondaryColor + 'CC');
}

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<HomePayload>({
    siteSettings: null,
    homePage: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = async () => {
    try {
      setError(null);
      const payload = await fetchHomePayload();
      setState(payload);
      applyTheme(payload.siteSettings?.theme);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({
      siteSettings: state.siteSettings,
      homePage: state.homePage,
      loading,
      error,
      refresh: load,
    }),
    [state, loading, error],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

export function useSiteSettings(): SiteSettings | null {
  return useContent().siteSettings;
}

export function useHomePage(): HomePage | null {
  return useContent().homePage;
}
