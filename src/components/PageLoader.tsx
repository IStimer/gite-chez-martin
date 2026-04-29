// Empty cream sheet — same bg as the hero loader so the visual handoff
// from "Sanity fetching" to "hero intro animation" is invisible. No
// spinner: by design, the user shouldn't see a generic loader before the
// site's branded intro plays.
const PageLoader = () => (
  <div className="page-loader" role="status" aria-live="polite" />
);

export default PageLoader;
