import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  direction?: 'vertical' | 'horizontal';
  gestureOrientation?: 'vertical' | 'horizontal' | 'both';
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  smoothTouch?: boolean;
  touchMultiplier?: number;
  prevent?: (node: Element) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ScrollToOptions {
  offset?: number;
  duration?: number;
  easing?: (t: number) => number;
  lerp?: number;
  onComplete?: () => void;
  force?: boolean;
  programmatic?: boolean;
}

type ScrollTarget = string | number | HTMLElement;

const MOBILE_USER_AGENT_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

const DEFAULT_OPTIONS: Readonly<LenisOptions> = {
  duration: 1.2,
  easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
} as const;

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const detectMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const isMobileUserAgent = MOBILE_USER_AGENT_REGEX.test(navigator.userAgent);
    const isMobileViewport = window.innerWidth < 768;
    const hasTouchScreen =
      'ontouchstart' in window ||
      (navigator.maxTouchPoints !== undefined && navigator.maxTouchPoints > 0);
    return (isMobileUserAgent || isMobileViewport) && hasTouchScreen;
  } catch {
    return false;
  }
};

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

class LenisService {
  private instance: Lenis | null = null;
  private rafCallback: ((time: number) => void) | null = null;

  private preventLenis = (node: Element): boolean => {
    try {
      return !!node.closest('[data-lenis-prevent]');
    } catch {
      return false;
    }
  };

  public init(options: LenisOptions = {}): Lenis | null {
    if (typeof window === 'undefined') return null;
    if (this.instance) return this.instance;

    if (detectMobileDevice() || prefersReducedMotion()) {
      return null;
    }

    try {
      const merged: LenisOptions = { ...DEFAULT_OPTIONS, ...options, prevent: this.preventLenis };
      this.instance = new Lenis(merged);
      this.instance.on('scroll', ScrollTrigger.update);

      this.rafCallback = (time: number): void => {
        this.instance?.raf(time * 1000);
      };
      gsap.ticker.add(this.rafCallback);
      gsap.ticker.lagSmoothing(0);

      return this.instance;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error initializing Lenis:', error);
      return null;
    }
  }

  public destroy(): void {
    if (this.rafCallback) {
      gsap.ticker.remove(this.rafCallback);
      this.rafCallback = null;
    }
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
  }

  public scrollTo(target: ScrollTarget, options?: ScrollToOptions): void {
    if (!this.instance) {
      this.nativeScrollTo(target);
      return;
    }
    this.instance.scrollTo(target, options);
  }

  private nativeScrollTo(target: ScrollTarget): void {
    if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el instanceof HTMLElement) el.scrollIntoView({ behavior: 'smooth' });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public stop(): void {
    this.instance?.stop();
  }

  public start(): void {
    this.instance?.start();
  }

  public resize(): void {
    this.instance?.resize();
  }

  public getInstance(): Lenis | null {
    return this.instance;
  }

  public isActive(): boolean {
    return this.instance !== null;
  }
}

export const lenisService = new LenisService();
