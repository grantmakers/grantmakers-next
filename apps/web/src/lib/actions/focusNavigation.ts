/**
 * Svelte action for keyboard navigation through search results.
 *
 * Handles:
 * - ArrowDown/Up to navigate between results
 * - ArrowDown from input to enter results
 * - ArrowUp from first result to return to input
 * - Home/End to jump to first/last result
 */
export function searchResultsNavigation(container: HTMLElement, inputElement: HTMLElement | null) {
  function getItems(): HTMLElement[] {
    return Array.from(container.querySelectorAll('a')) as HTMLElement[];
  }

  function handleContainerKeydown(e: KeyboardEvent) {
    const items = getItems();
    if (!items.length) return;

    const idx = items.indexOf(document.activeElement as HTMLElement);
    if (idx === -1) return;

    if (e.key === 'ArrowDown' && idx < items.length - 1) {
      e.preventDefault();
      items[idx + 1].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (idx === 0 && inputElement) {
        inputElement.focus();
      } else if (idx > 0) {
        items[idx - 1].focus();
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1].focus();
    }
  }

  function handleInputKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      const items = getItems();
      if (items.length) {
        e.preventDefault();
        items[0].focus();
      }
    }
  }

  container.addEventListener('keydown', handleContainerKeydown);
  inputElement?.addEventListener('keydown', handleInputKeydown);

  return {
    update(newInput: HTMLElement | null) {
      inputElement?.removeEventListener('keydown', handleInputKeydown);
      inputElement = newInput;
      inputElement?.addEventListener('keydown', handleInputKeydown);
    },
    destroy() {
      container.removeEventListener('keydown', handleContainerKeydown);
      inputElement?.removeEventListener('keydown', handleInputKeydown);
    },
  };
}
