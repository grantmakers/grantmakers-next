import tippy, { type Props, type Content } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { browser } from '$app/environment';

interface TooltipParams extends Partial<Props> {
  content?: Content; // Using tippy's Content type instead of just string
}

let tippyInstance: typeof tippy | undefined;

if (browser) {
  tippyInstance = tippy;
}

export function tooltip(node: HTMLElement, params: TooltipParams = {}) {
  if (!browser || !tippyInstance) {
    return {
      update: () => {},
      destroy: () => {},
    };
  }

  // Determine the title to show. Prefer custom content, then title, then aria-label
  const custom = params.content;
  const title = node.title;
  const label = node.getAttribute('aria-label');

  // Ensure content is properly typed
  const content: Content = (custom ?? title ?? label ?? '') as Content;

  // Ensure the "aria-label" attribute is set for accessibility
  if (!label && content) {
    node.setAttribute('aria-label', typeof content === 'string' ? content : '');
  }

  // Clear the HTML title attribute to prevent default browser behavior
  node.title = '';

  // Create a Tippy instance with the provided content and parameters
  const tip = tippyInstance(node as Element, {
    content,
    ...params,
    animation: true,
    arrow: true,
    touch: false,
  });

  return {
    update(newParams: TooltipParams) {
      const newContent = newParams.content ?? content;
      tip.setProps({
        content: newContent,
        ...newParams,
      });
    },
    destroy() {
      tip.destroy();
    },
  };
}
