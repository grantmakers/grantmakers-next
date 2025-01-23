<script lang="ts">
  import '$lib/assets/legacy/css/instantsearch-reset-min.css';
  import '$lib/assets/legacy/css/unified-search.css';
  import Banner from '$src/lib/components/Banner.svelte';

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

{@render children?.()}
