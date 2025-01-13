<script lang="ts">
  /**
   * Layouts in SvelteKit inherit parent layouts
   * However, this layout is in it's own namespace, 'legacy'
   * This ensures it does NOT inherit Tailwind specifically
   */

  import '@fontsource/roboto/100.css';
  import '@fontsource/roboto/300.css';
  import '@fontsource/roboto/400.css';
  import '@fontsource/roboto/500.css';
  import '@fontsource/roboto/700.css';
  import '@fontsource/material-icons';
  import { page } from '$app/stores';
  import SEO from '$lib/components/SEO.svelte';
  import { meta } from '$utils/trustedConstants';
  import Footer from '$src/lib/components/Footer.svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  const {
    defaults: { title, description },
  } = meta;
</script>

<svelte:head>
  {#if $page.data.profile}
    <SEO profile={$page.data.profile} />
  {:else}
    <title>{title}</title>
    <meta name="description" content={description} />
  {/if}
</svelte:head>

{@render children?.()}

<Footer />

<style>
  :global(body) {
    background-color: #ccc;
  }
  :global(.material-icons) {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    font-feature-settings: 'liga';
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
  }
</style>
