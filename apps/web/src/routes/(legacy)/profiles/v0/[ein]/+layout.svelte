<script lang="ts">
  /**
   * Layouts in SvelteKit inherit parent layouts
   * However, this layout is in it's own namespace, 'legacy'
   * This ensures it does NOT inherit Tailwind specifically
   */

  // Import just the font weights used
  // Source: DevTools > More Tools > CSS Overview
  import '@fontsource/roboto/100.css';
  import '@fontsource/roboto/300.css';
  import '@fontsource/roboto/400.css';
  import '@fontsource/roboto/500.css';
  import '@fontsource/roboto/700.css';

  // Materialize is embedded in main.css
  import '$lib/assets/legacy/css/main.css';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://qa1231c5w9-dsn.algolia.net" crossorigin="anonymous" />
</svelte:head>

<div class="materialize-wrapper-main">
  {@render children?.()}
</div>
