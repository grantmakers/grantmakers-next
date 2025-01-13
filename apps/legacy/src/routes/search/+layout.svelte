<script lang="ts">
  import '$lib/assets/legacy/css/instantsearch-reset-min.css';
  import '$lib/assets/legacy/css/unified-search.css';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

{@render children?.()}
