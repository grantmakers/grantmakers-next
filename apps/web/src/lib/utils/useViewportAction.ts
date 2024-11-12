// useViewportAction.ts
import type { Action } from 'svelte/action';

let intersectionObserver: IntersectionObserver | undefined;

function ensureIntersectionObserver(): void {
  if (intersectionObserver) return;

  intersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      const eventName = entry.isIntersecting ? 'enterViewport' : 'exitViewport';
      entry.target.dispatchEvent(new CustomEvent(eventName));
    });
  });
}

type ViewportEvents = {
  onenterViewport: (e: CustomEvent) => void;
  onexitViewport: (e: CustomEvent) => void;
};

const viewport: Action<HTMLElement, null, ViewportEvents> = (element) => {
  ensureIntersectionObserver();
  (intersectionObserver as IntersectionObserver).observe(element);

  return {
    destroy() {
      (intersectionObserver as IntersectionObserver).unobserve(element);
    },
  };
};

export default viewport;
