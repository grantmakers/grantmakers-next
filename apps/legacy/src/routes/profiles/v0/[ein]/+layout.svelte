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

{@render children?.()}
