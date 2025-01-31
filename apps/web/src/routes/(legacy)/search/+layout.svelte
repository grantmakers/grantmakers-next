<script lang="ts">
  import '$lib/assets/legacy/css/instantsearch-reset-min.css';
  import '$lib/assets/legacy/css/unified-search.css';
  import Inter from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2';
  import Banner from '$src/lib/components/legacy/Banner.svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<svelte:head>
  <link rel="preload" as="font" href={Inter} type="font/woff2" crossorigin="anonymous" />
  <link rel="preconnect" href="https://qa1231c5w9-dsn.algolia.net" crossorigin="anonymous" />
  <link rel="preconnect" href="https://kdwvszvs1i-dsn.algolia.net" crossorigin="anonymous" />
</svelte:head>

<Banner />
<div class="materialize-wrapper">
  {@render children?.()}
</div>

<style>
  .materialize-wrapper {
    line-height: 1.5;
    font-family:
      'Inter Variable',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Oxygen-Sans,
      Ubuntu,
      Cantarell,
      'Helvetica Neue',
      sans-serif;
    font-weight: normal;
    color: rgba(0, 0, 0, 0.87);
  }

  @media only screen and (min-width: 0) {
    .materialize-wrapper {
      font-size: 14px;
    }
  }

  @media only screen and (min-width: 992px) {
    .materialize-wrapper {
      font-size: 14.5px;
    }
  }

  @media only screen and (min-width: 1200px) {
    .materialize-wrapper {
      font-size: 15px;
    }
  }
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
