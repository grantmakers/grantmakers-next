/**
 * Svelte action that replaces the legacy MaterializeCSS Pushpin plugin.
 * Makes an element sticky when scrolled past its original position.
 *
 * See sticky.examples.md for usage examples
 */

interface StickyOptions {
  enabled?: boolean; // default: true
  minWidth?: number; // default: 0
  offset?: number; // default: 0
  threshold?: number; // default: 0
  placeholder?: boolean; // default: true
  zIndex?: number; // default: 100
  fullWidth?: boolean; // default: true
  resizeDebounce?: number; // default: 100
  onStick?: () => void;
  onUnstick?: () => void;
}
export function sticky(node: HTMLElement, options: StickyOptions = {}) {
  let {
    enabled = true,
    minWidth = 0,
    offset = 0,
    threshold = 0,
    placeholder = true,
    zIndex = 100,
    fullWidth = true,
    resizeDebounce = 100,
    onStick = () => {},
    onUnstick = () => {},
  } = options;

  let isSticky = false;
  let placeholderEl: HTMLDivElement | null = null;
  let triggerPoint = 0;
  let nodeHeight = 0;
  let nodeWidth = 0;
  let nodeLeft = 0;
  let resizeTimeout: number | null = null;

  function calculateDimensions() {
    const measureNode = isSticky && placeholderEl ? placeholderEl : node;
    const rect = measureNode.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    triggerPoint = rect.top + scrollTop - offset;
    nodeHeight = node.offsetHeight;
    nodeWidth = rect.width;
    nodeLeft = rect.left;
  }

  function checkSticky() {
    // Check if we should be active based on viewport width
    const isWideEnough = window.innerWidth >= minWidth;

    if (!enabled || !isWideEnough) {
      if (isSticky) unstick();
      return;
    }

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollY > triggerPoint + threshold && !isSticky) {
      stick();
    } else if (scrollY <= triggerPoint + threshold && isSticky) {
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
      placeholderEl.classList.add('sm:dot-pattern', 'bg-slate-200'); // TODO This should be moved to a param
      node.parentNode?.insertBefore(placeholderEl, node);
    }

    // Apply sticky styles
    node.style.position = 'fixed';
    node.style.top = `${offset}px`;
    node.style.zIndex = String(zIndex);

    if (fullWidth) {
      // Full viewport width mode (original behavior)
      node.style.left = '0';
      node.style.right = '0';
      node.style.width = '';
    } else {
      // Preserve original width and position
      node.style.left = `${nodeLeft}px`;
      node.style.width = `${nodeWidth}px`;
      node.style.right = '';
    }

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
    node.style.width = '';
    node.style.zIndex = '';
    node.removeAttribute('data-sticky');

    onUnstick();
  }

  function handleResize() {
    // Clear any pending resize timeout
    if (resizeTimeout !== null) {
      window.clearTimeout(resizeTimeout);
    }

    // Debounce the resize handler if configured
    if (resizeDebounce > 0) {
      resizeTimeout = window.setTimeout(() => {
        performResize();
        resizeTimeout = null;
      }, resizeDebounce);
    } else {
      performResize();
    }
  }

  function performResize() {
    // Calculate new dimensions (Read phase)
    // Uses placeholder if sticky to avoid layout thrashing
    calculateDimensions();

    // Update styles if currently sticky (Write phase)
    if (isSticky) {
      node.style.top = `${offset}px`;

      if (fullWidth) {
        node.style.left = '0';
        node.style.right = '0';
        node.style.width = '';
      } else {
        node.style.left = `${nodeLeft}px`;
        node.style.width = `${nodeWidth}px`;
        node.style.right = '';
      }

      // Update placeholder to match new node height
      if (placeholderEl) {
        placeholderEl.style.height = `${nodeHeight}px`;
      }
    }

    // Check if sticky state should change based on new dimensions
    checkSticky();
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
        threshold = 0,
        placeholder = true,
        zIndex = 100,
        fullWidth = true,
        resizeDebounce = 100,
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
      // Clean up resize timeout if pending
      if (resizeTimeout !== null) {
        window.clearTimeout(resizeTimeout);
      }

      window.removeEventListener('scroll', checkSticky);
      window.removeEventListener('resize', handleResize);
      if (isSticky) {
        unstick();
      }
    },
  };
}

export function getScrollToPosition(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return rect.top + scrollTop;
}
