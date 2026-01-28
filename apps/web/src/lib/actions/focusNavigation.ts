export interface FocusNavigationOptions {
  /**
   * Selector for focusable items within the container.
   * Defaults to 'a[href], button, input, [tabindex]:not([tabindex="-1"])'
   */
  itemSelector?: string;
  /**
   * Reference to the search input element.
   * Used to return focus to the input when pressing Up from the first item.
   */
  inputElement?: HTMLElement | null;
  /**
   * Class to apply to the container when navigation is active (optional)
   */
  activeClass?: string;
  /**
   * Whether to loop navigation (Last -> First, First -> Last).
   * Note: If inputElement is provided, Up from First goes to Input instead of Last.
   */
  loop?: boolean;
}

export function arrowNavigation(node: HTMLElement, options: FocusNavigationOptions = {}) {
  let { itemSelector = 'a[href], button, input, [tabindex]:not([tabindex="-1"])', inputElement = null, loop = false } = options;

  function getItems(): HTMLElement[] {
    return Array.from(node.querySelectorAll(itemSelector)) as HTMLElement[];
  }

  function handleKeydown(event: KeyboardEvent) {
    const items = getItems();
    if (items.length === 0) return;

    const currentElement = document.activeElement as HTMLElement;
    const currentIndex = items.indexOf(currentElement);

    // If we are not currently focused on an item in the list, and we are not the input
    // (This handles case where focus might be on body or unrelated element)
    const isInputFocused = inputElement && (currentElement === inputElement || inputElement.contains(currentElement));

    if (currentIndex === -1 && !isInputFocused) {
      // If focus is somewhere else entirely, do nothing
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (isInputFocused) {
        // From Input -> First Item
        items[0]?.focus();
      } else if (currentIndex < items.length - 1) {
        // Next Item
        items[currentIndex + 1]?.focus();
      } else if (loop) {
        // Loop to First
        items[0]?.focus();
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (currentIndex > 0) {
        // Previous Item
        items[currentIndex - 1]?.focus();
      } else if (currentIndex === 0) {
        if (inputElement) {
          // First Item -> Input
          inputElement.focus();
        } else if (loop) {
          // Loop to Last
          items[items.length - 1]?.focus();
        }
      }
    } else if (event.key === 'Home') {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  // Attach listener to the container
  node.addEventListener('keydown', handleKeydown);

  // If input is provided, we need to hijack its ArrowDown to jump to the list
  const inputHandler = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      // If we are in the input, and user presses Down, focus first item
      const items = getItems();
      // Only trap if items exist
      if (items.length > 0) {
        e.preventDefault();
        items[0]?.focus();
      }
    }
  };

  if (inputElement) {
    inputElement.addEventListener('keydown', inputHandler);
  }

  return {
    update(newOptions: FocusNavigationOptions) {
      // Clean up old input listener if input element changed
      if (inputElement && inputElement !== newOptions.inputElement) {
        inputElement.removeEventListener('keydown', inputHandler);
      }

      ({ itemSelector = 'a[href], button, input, [tabindex]:not([tabindex="-1"])', inputElement = null, loop = false } = newOptions);

      // Re-attach to new input
      if (inputElement) {
        inputElement.removeEventListener('keydown', inputHandler); // Just in case
        inputElement.addEventListener('keydown', inputHandler);
      }
    },
    destroy() {
      node.removeEventListener('keydown', handleKeydown);
      if (inputElement) {
        inputElement.removeEventListener('keydown', inputHandler);
      }
    },
  };
}
