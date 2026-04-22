import { createContext, useLayoutEffect, useState, ReactNode } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenisService } from '../services/lenisService';

interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface LenisContextValue {
  service: typeof lenisService;
  isActive: boolean;
}

interface LenisProviderProps {
  options?: LenisOptions;
  children: ReactNode;
}

export const LenisContext = createContext<LenisContextValue | null>(null);

const DEFAULT_OPTIONS: LenisOptions = {};

const LenisProvider = ({ options = DEFAULT_OPTIONS, children }: LenisProviderProps) => {
  const [isActive, setIsActive] = useState(false);

  useLayoutEffect(() => {
    const instance = lenisService.init(options);
    setIsActive(!!instance);
    if (instance) ScrollTrigger.refresh();

    return () => {
      lenisService.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LenisContext.Provider value={{ service: lenisService, isActive }}>
      {children}
    </LenisContext.Provider>
  );
};

export default LenisProvider;
