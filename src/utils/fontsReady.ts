// Resolves once the page's webfonts have finished loading, with a hard
// timeout so a slow or failing font never blocks the intro forever.
//
// Why: SplitText measures DOM metrics (line wraps, char widths) at the
// moment it runs. If it fires while the browser is still showing the
// fallback (Georgia), the resulting splits use fallback metrics, then
// when PP Editorial New swaps in, the text re-flows mid-animation —
// visually a stutter. Gating the splits on `document.fonts.ready`
// avoids this entirely.
export const fontsReady = (timeoutMs = 1500): Promise<void> => {
  if (typeof document === 'undefined' || !document.fonts?.ready) {
    return Promise.resolve();
  }
  return Promise.race([
    document.fonts.ready.then(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, timeoutMs)),
  ]);
};
