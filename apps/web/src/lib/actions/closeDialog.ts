/**
 * Svelte action that closes the nearest parent el-dialog when the element is clicked.
 * Uses Tailwind Elements' native hide() method.
 *
 * @example
 * <a href="/about" use:closeDialog>About</a>
 */
export function closeDialog(node: HTMLElement) {
  function handleClick() {
    const dialog = node.closest('el-dialog') as HTMLElement & { hide: () => void };
    dialog?.hide();
  }

  node.addEventListener('click', handleClick);

  return {
    destroy() {
      node.removeEventListener('click', handleClick);
    }
  };
}
