/**
 * A reusable Svelte action that replaces the legacy MaterializeCSS Pushpin plugin
 */

interface StickyOptions {
  enabled?: boolean;
  minWidth?: number;
  offset?: number;
  placeholder?: boolean;
  zIndex?: number;
  onStick?: () => void;
  onUnstick?: () => void;
}

export function sticky(node: HTMLElement, options: StickyOptions = {}) {
  let { enabled = true, minWidth = 0, offset = 0, placeholder = true, zIndex = 100, onStick = () => {}, onUnstick = () => {} } = options;

  let isSticky = false;
  let placeholderEl: HTMLDivElement | null = null;
  let triggerPoint = 0;
  let nodeHeight = 0;

  function calculateDimensions() {
    const rect = node.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    triggerPoint = rect.top + scrollTop - offset;
    nodeHeight = node.offsetHeight;
  }

  function checkSticky() {
    // Check if we should be active based on viewport width
    const isWideEnough = window.innerWidth >= minWidth;

    if (!enabled || !isWideEnough) {
      if (isSticky) unstick();
      return;
    }

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollY > triggerPoint && !isSticky) {
      stick();
    } else if (scrollY <= triggerPoint && isSticky) {
      unstick();
    }
  }

  function stick() {
    isSticky = true;

    // Create placeholder to prevent layout shift
    if (placeholder) {
      placeholderEl = document.createElement('div');
      placeholderEl.style.height = `${nodeHeight}px`;
      placeholderEl.style.width = '100%';
      placeholderEl.setAttribute('data-sticky-placeholder', '');
      node.parentNode?.insertBefore(placeholderEl, node);
    }

    // Apply sticky styles
    node.style.position = 'fixed';
    node.style.top = `${offset}px`;
    node.style.left = '0';
    node.style.right = '0';
    node.style.zIndex = String(zIndex);
    node.setAttribute('data-sticky', 'true');

    onStick();
  }

  function unstick() {
    isSticky = false;

    // Remove placeholder
    if (placeholderEl) {
      placeholderEl.remove();
      placeholderEl = null;
    }

    // Remove sticky styles
    node.style.position = '';
    node.style.top = '';
    node.style.left = '';
    node.style.right = '';
    node.style.zIndex = '';
    node.removeAttribute('data-sticky');

    onUnstick();
  }

  function handleResize() {
    // Temporarily unstick to get accurate measurements
    const wasSticky = isSticky;
    if (isSticky) {
      unstick();
    }

    calculateDimensions();

    // Reapply sticky if it was sticky before
    if (wasSticky) {
      checkSticky();
    }
  }

  // Initialize
  calculateDimensions();
  checkSticky();

  // Add listeners
  window.addEventListener('scroll', checkSticky, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });

  return {
    update(newOptions: StickyOptions) {
      // Update options
      ({
        enabled = true,
        minWidth = 0,
        offset = 0,
        placeholder = true,
        zIndex = 100,
        onStick = () => {},
        onUnstick = () => {},
      } = newOptions);

      // Recalculate if needed
      if (!isSticky) {
        calculateDimensions();
      }
      checkSticky();
    },

    destroy() {
      window.removeEventListener('scroll', checkSticky);
      window.removeEventListener('resize', handleResize);
      if (isSticky) {
        unstick();
      }
    },
  };
}

// Export a helper to get the scroll position for a sticky element
export function getScrollToPosition(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return rect.top + scrollTop;
}
