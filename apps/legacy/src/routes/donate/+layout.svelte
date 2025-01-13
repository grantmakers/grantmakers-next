<script lang="ts">
  /**
   * Layouts in SvelteKit inherit parent layouts
   * However, this layout is in it's own namespace, 'legacy'
   * This ensures it does NOT inherit Tailwind specifically
   */
  // Materialize embedded in main.css
  import '$lib/assets/legacy/css/main-materialize.css';
  import Header from '$src/lib/components/Header.svelte';
  import { onMount } from 'svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  onMount(async () => {
    const M = await import('materialize-css');
    const { initJs } = await import('$lib/assets/legacy/js/pages-materialize');
    try {
      initJs(M);
    } catch (error) {
      console.log(error);
    }
  });
</script>

<Header />

{@render children?.()}

<!-- Footer is handled by parent +layout -->
