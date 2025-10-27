/**
 * Simple reusable scroll utility functions
 * See scroll.examples.md for usage examples
 */

// Scroll the window to the top of the page
export function backToTop(): void {
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
