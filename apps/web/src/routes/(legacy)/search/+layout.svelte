<script lang="ts">
  import '$lib/assets/legacy/css/instantsearch-reset-min.css';
  import '$lib/assets/legacy/css/unified-search-wrapped.css';
  import { page } from '$app/state';
  import ProfilesHero from '$src/lib/components/search/hero/ProfilesHero.svelte';
  import GrantsHero from '$src/lib/components/search/hero/GrantsHero.svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  const pathname = $derived(page.url.pathname);
</script>

<svelte:head>
  <!-- <link rel="preload" as="font" href={Inter} type="font/woff2" crossorigin="anonymous" /> -->
  <link rel="preconnect" href="https://qa1231c5w9-dsn.algolia.net" crossorigin="anonymous" />
  <link rel="preconnect" href="https://kdwvszvs1i-dsn.algolia.net" crossorigin="anonymous" />
</svelte:head>

<!-- 
  Conditionally render the correct Hero depending on the path
  Note: This is a legacy approach, and should eventually be refactored when the need for wrapping the legacy CSS goes away
-->

{#if pathname.includes('/profiles')}
  <ProfilesHero />
{:else if pathname.includes('/grants')}
  <GrantsHero />
{/if}

<div class="materialize-wrapper min-h-full">
  {@render children?.()}
</div>
