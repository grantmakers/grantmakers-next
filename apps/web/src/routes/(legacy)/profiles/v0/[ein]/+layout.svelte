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

  // Note: Materialize is embedded in main.css
  import '$lib/assets/legacy/css/main.css';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://qa1231c5w9-dsn.algolia.net" crossorigin="anonymous" />
</svelte:head>

<div class="materialize-wrapper-main sm:dot-pattern min-h-full">
  {@render children?.()}
</div>

<style>
  .materialize-wrapper-main {
    color: #333;
    font-weight: 300;
    font-size: 15px;
    font-family:
      Roboto,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Oxygen-Sans,
      Ubuntu,
      Cantarell,
      'Helvetica Neue',
      sans-serif;
  }
  :global(.container-loader) {
    animation: fadeIn 0.4s ease-in forwards;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  :global(.material-icons) {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    font-feature-settings: 'liga';
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
    width: 24px;
    overflow: hidden;
  }
</style>
