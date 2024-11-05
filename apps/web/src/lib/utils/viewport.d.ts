declare namespace svelteHTML {
  interface HTMLAttributes {
    onEnterViewport?: () => void;
    onExitViewport?: () => void;
  }
}
