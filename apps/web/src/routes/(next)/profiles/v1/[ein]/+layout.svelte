<script lang="ts">
  /**
   * Layouts in SvelteKit inherit parent layouts
   * Tailwind is imported at root layout
   * svelte:head is set in root layout
   * footer is also set in root layout
   */
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="min-h-full" style="background-color: #f8f9fe;">
  {@render children?.()}
</div>
