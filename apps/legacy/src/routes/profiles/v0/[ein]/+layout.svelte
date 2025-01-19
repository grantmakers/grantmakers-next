<script lang="ts">
  /**
   * Layouts in SvelteKit inherit parent layouts
   * However, this layout is in it's own namespace, 'legacy'
   * This ensures it does NOT inherit Tailwind specifically
   */
  // Materialize embedded in main.css
  import '$lib/assets/legacy/css/main.css';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<svelte:head>
  <link rel="preload" as="image" href="/assets/img/NY.webp" fetchpriority="high" />
  <link rel="preconnect" href="https://qa1231c5w9-dsn.algolia.net" crossorigin="anonymous" />
</svelte:head>

{@render children?.()}
