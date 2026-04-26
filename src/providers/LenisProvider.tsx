import { useLayoutEffect, ReactNode } from 'react';
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

interface LenisProviderProps {
  options?: LenisOptions;
  children: ReactNode;
}

const DEFAULT_OPTIONS: LenisOptions = {};

const LenisProvider = ({ options = DEFAULT_OPTIONS, children }: LenisProviderProps) => {
  useLayoutEffect(() => {
    const instance = lenisService.init(options);
    if (instance) ScrollTrigger.refresh();

    return () => {
      lenisService.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
