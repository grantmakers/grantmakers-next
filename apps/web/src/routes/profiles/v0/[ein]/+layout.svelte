<script lang="ts">
  /**
   * Layouts in SvelteKit inherit parent layouts
   * Thus, svelte:head and the footer for [ein] route is set in +layout at /routes root
   */
  import '@fontsource/open-sans';
  import '../../../../app.pcss';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

{@render children?.()}

<style>
  :global(body) {
    background-color: #f8f9fe;
  }
</style>
