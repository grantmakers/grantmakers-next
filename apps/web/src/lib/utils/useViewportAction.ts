let intersectionObserver: IntersectionObserver | undefined;

function ensureIntersectionObserver(): void {
  if (intersectionObserver) return;

  intersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      const eventName: 'enterViewport' | 'exitViewport' = entry.isIntersecting ? 'enterViewport' : 'exitViewport';
      entry.target.dispatchEvent(new CustomEvent(eventName));
    });
  });
}

interface ViewportResult {
  destroy(): void;
}

export default function viewport(element: Element): ViewportResult {
  ensureIntersectionObserver();

  // Type assertion here since we know ensureIntersectionObserver initializes it
  (intersectionObserver as IntersectionObserver).observe(element);

  return {
    destroy() {
      // Same type assertion needed here
      (intersectionObserver as IntersectionObserver).unobserve(element);
    },
  };
}
