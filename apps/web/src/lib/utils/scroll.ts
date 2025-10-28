/**
 * Simple reusable scroll utility functions
 * See scroll.examples.md for usage examples
 */

// Scroll the window to the top of the page
export function backToTop(): void {
  // TODO This is a temporary quick fix to reduce an edge case UX
  // TODO It should be implemented properly via the GlobalNav component
  const header = document.querySelector('header[data-sticky]');
  if (header && header instanceof HTMLElement) {
    delete header.dataset.sticky;
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

// Scroll the window to an element on the page
export function scrollToElement(target: HTMLElement | string): void {
  const element = typeof target === 'string' ? document.querySelector(target) : target;

  if (!element) {
    console.warn(`scrollToElement: Could not find element matching "${target}"`);
    return;
  }

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
