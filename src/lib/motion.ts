/** The query behind every motion guard; the CSS uses the same one. */
export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

export const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches
