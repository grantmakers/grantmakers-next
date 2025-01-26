<script lang="ts">
  import '$lib/assets/legacy/css/instantsearch-reset-min.css';
  import '$lib/assets/legacy/css/unified-search.css';
  import Banner from '$src/lib/components/legacy/Banner.svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://qa1231c5w9-dsn.algolia.net" crossorigin="anonymous" />
  <link rel="preconnect" href="https://kdwvszvs1i-dsn.algolia.net" crossorigin="anonymous" />
</svelte:head>
<Banner />
<div class="legacy-materialize-css">
  {@render children?.()}
</div>

<style>
  :global(header) {
    position: relative;
  }
  :global(#algolia-hits-wrapper) {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }
  :global(#algolia-hits-wrapper.loaded) {
    opacity: 1;
  }
  :global(#ais-widget-sort-by i, #search-box-dropdown-trigger i) {
    width: auto;
  }
  :global(#ais-widget-sort-by i) {
    padding: 2px;
  }
</style>
