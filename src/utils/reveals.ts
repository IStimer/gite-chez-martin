import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

// ── Shared option types ─────────────────────────────────────────────

interface BaseRevealOptions {
  /** Element that drives the ScrollTrigger (defaults to `el`). */
  trigger?: Element | null;
  /** ScrollTrigger `start` string. */
  start?: string;
  /** Delay before the reveal fires, in seconds. */
  delay?: number;
  /** Fire immediately without waiting for scroll (hero, above-fold). */
  immediate?: boolean;
}

export interface TitleRevealOptions extends BaseRevealOptions {
  /** Motion duration per char, in seconds. */
  duration?: number;
  /** Stagger between chars inside a line, in seconds. */
  stagger?: number;
  /** Absolute offset between lines within the timeline, in seconds. */
  lineOffset?: number;
  /** Maximum rotation in degrees applied to the last char of each block. */
  rotateMax?: number;
}

export interface LinesRevealOptions extends BaseRevealOptions {
  /** Motion duration per line, in seconds. */
  duration?: number;
  /** Stagger between lines, in seconds. */
  stagger?: number;
  /** Initial yPercent offset (defaults to 100 — flush below the mask). */
  yPercent?: number;
}

// ── Internal helpers ────────────────────────────────────────────────

function buildScrollTrigger(
  el: HTMLElement,
  options: BaseRevealOptions,
): ScrollTrigger.Vars | undefined {
  if (options.immediate) return undefined;
  return {
    trigger: options.trigger ?? el,
    start: options.start ?? 'top 85%',
    once: true,
  };
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Char-level reveal with a rotation cascade — "awwwards-like" curve
 * for big editorial titles. Each char slides up from yPercent 115 → 0
 * while untwisting a small rotation that grows non-linearly with its
 * index (first chars barely tilt, last chars tilt the most). When the
 * title wraps, lines animate in parallel with a light offset.
 */
export function revealTitle(
  el: HTMLElement | null | undefined,
  options: TitleRevealOptions = {},
): { split: SplitText; timeline: gsap.core.Timeline } | null {
  if (!el) return null;
  // Skip elements with no text (empty <p>, icons-only headings, etc.)
  if (!el.textContent?.trim()) return null;
  // Skip if the subtree has already been split by an earlier call —
  // double-splitting wraps the already-split content and leaves outer
  // masks stuck at their initial transform (invisible).
  if (el.querySelector('.reveal-line-mask, .reveal-line, .reveal-char')) {
    return null;
  }

  const split = SplitText.create(el, {
    type: 'chars,lines',
    mask: 'lines',
    linesClass: 'reveal-line',
    charsClass: 'reveal-char',
  });
  // Mask hardening (padding + clip safety) lives in CSS on
  // `.reveal-line-mask` — see src/styles/base/_global.scss.

  const lastIdx = Math.max(split.chars.length - 1, 1);
  const rotateMax = options.rotateMax ?? 18;
  gsap.set(split.chars, {
    yPercent: 115,
    rotate: (i) => 2 + Math.pow(i / lastIdx, 1.5) * rotateMax,
    transformOrigin: '0% 100%',
  });

  const timeline = gsap.timeline({
    delay: options.delay,
    scrollTrigger: buildScrollTrigger(el, options),
  });

  const duration = options.duration ?? 0.55;
  const charStagger = options.stagger ?? 0.02;
  const lineOffset = options.lineOffset ?? 0.06;

  split.lines.forEach((line, lineIdx) => {
    const chars = line.querySelectorAll('.reveal-char');
    if (!chars.length) return;
    timeline.to(
      chars,
      {
        yPercent: 0,
        rotate: 0,
        duration,
        ease: 'expo.inOut',
        stagger: { each: charStagger, ease: 'sine.inOut' },
      },
      lineIdx * lineOffset,
    );
  });

  return { split, timeline };
}

/**
 * Line-level reveal for paragraphs / intros / subtitles — each whole
 * line slides up as a unit, no per-char stagger, no rotation. When the
 * text wraps across multiple lines they're offset with a light stagger
 * so the block doesn't just pop in all at once.
 *
 * SplitText's default `mask: 'lines'` wrappers handle the clipping;
 * no extra hardening is needed because there's no per-char rotation
 * that could poke through the clip box.
 */
export function revealLines(
  el: HTMLElement | null | undefined,
  options: LinesRevealOptions = {},
): { split: SplitText; tween: gsap.core.Tween } | null {
  if (!el) return null;
  if (!el.textContent?.trim()) return null;
  // Skip if already split (see revealTitle for details).
  if (el.querySelector('.reveal-line-mask, .reveal-line, .reveal-char')) {
    return null;
  }

  // Use SplitText's own mask so revert() cleans up both the splits and
  // the mask wrappers together — critical for React unmount since any
  // DOM nodes we add manually escape React's child tracking and cause
  // `removeChild` errors on cleanup.
  const split = SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'reveal-line',
  });

  // Guard against transforms silently no-op-ing on inline boxes.
  split.lines.forEach((line) => {
    (line as HTMLElement).style.display = 'block';
    (line as HTMLElement).style.willChange = 'transform';
  });

  gsap.set(split.lines, { yPercent: options.yPercent ?? 105 });

  const tween = gsap.to(split.lines, {
    yPercent: 0,
    duration: options.duration ?? 0.9,
    ease: 'expo.out',
    delay: options.delay,
    stagger: options.stagger ?? 0.09,
    scrollTrigger: buildScrollTrigger(el, options),
  });

  return { split, tween };
}

/**
 * Batch helper — walk a root element and apply:
 *  • `revealTitle` on every `h1, h2, h3, h4, h5`
 *  • `revealLines` on every `p, blockquote`
 *
 * Each element uses itself as ScrollTrigger so it animates when it
 * scrolls into view (rather than every target firing at once when the
 * section top crosses the trigger line). Elements already split by an
 * earlier specific call are skipped automatically by the underlying
 * guards in `revealTitle` / `revealLines`.
 *
 * Use `[data-no-reveal]` on any ancestor to shield a subtree from the
 * batch — needed for React-driven collections (carousels, lists) where
 * SplitText's inner wrappers would break React's `removeChild`.
 */
export function revealAllInside(
  root: HTMLElement | null | undefined,
  options: {
    titleSelector?: string;
    linesSelector?: string;
    exclude?: string;
  } = {},
): SplitText[] {
  if (!root) return [];
  // `<li>` is excluded by default because lists (carousels, stars, any
  // React-driven collection) tend to re-render their children and
  // SplitText's inner wrappers would confuse React's `removeChild`.
  const titleSelector = options.titleSelector ?? 'h1, h2, h3, h4, h5';
  const linesSelector = options.linesSelector ?? 'p, blockquote';
  const exclude = options.exclude;
  const splits: SplitText[] = [];

  const isSafe = (el: HTMLElement) => {
    if (exclude && el.matches(exclude)) return false;
    // Opt-out marker — any ancestor with [data-no-reveal] shields its
    // subtree from SplitText, which is what you want for dynamic
    // content (carousels, animated cards, routing transitions).
    if (el.closest('[data-no-reveal]')) return false;
    return true;
  };

  root.querySelectorAll<HTMLElement>(titleSelector).forEach((el) => {
    if (!isSafe(el)) return;
    const r = revealTitle(el, { trigger: el });
    if (r) splits.push(r.split);
  });
  root.querySelectorAll<HTMLElement>(linesSelector).forEach((el) => {
    if (!isSafe(el)) return;
    const r = revealLines(el, { trigger: el });
    if (r) splits.push(r.split);
  });

  return splits;
}

/**
 * Revert a batch of SplitText instances. Call from a component's
 * useLayoutEffect cleanup *before* `ctx.revert()` so the DOM is
 * restored to its pre-split shape while React still has matching
 * child references — otherwise React's unmount path throws
 * `Failed to execute 'removeChild' on 'Node'`.
 */
export function revertReveals(splits: SplitText[]): void {
  splits.forEach((s) => {
    try {
      s.revert();
    } catch {
      // ignore — element may already be detached
    }
  });
}
