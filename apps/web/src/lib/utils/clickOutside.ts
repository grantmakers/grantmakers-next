// https://svelte.dev/docs/svelte/svelte-action#ActionReturn
import type { ActionReturn } from 'svelte/action';

interface Attributes {
  'on:outsideclick': (e: CustomEvent<boolean>) => void;
}

export default function clickOutside(node: HTMLElement): ActionReturn<undefined, Attributes> {
  const handleClick = (event: MouseEvent) => {
    if (node && !node.contains(event.target as HTMLElement) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent('outsideclick'));
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    },
  };
}
