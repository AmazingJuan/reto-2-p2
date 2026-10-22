/** Smoothly scrolls an element into view unless the user prefers reduced motion. */
export function scrollIntoViewSoftly(element: Element | null) {
    if (!element) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
