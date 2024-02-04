declare namespace svelteHTML {
  interface HTMLAttributes {
    'on:enterViewport'?: () => void;
    'on:exitViewport'?: () => void;
  }
}
