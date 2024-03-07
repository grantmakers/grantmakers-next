<script lang="ts">
  /**
   * Layouts in SvelteKit inherit parent layouts
   * See notes in [ein]/+page.svelte re: moving to SvelteKit Advance Routing groups
   */
  import '@fontsource/open-sans';
  import '../../../../app.pcss';
</script>

<slot />

<style>
  :global(body) {
    background-color: #f8f9fe;
  }
</style>
