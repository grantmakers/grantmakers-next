<script lang="ts">
  import '@fontsource/inter';
  import '$src/app.pcss';
  import { page } from '$app/stores';
  import SEO from '$lib/components/shared/SEO.svelte';
  import { meta } from '$utils/trustedConstants';
  import Footer from '$lib/components/footer/Footer.svelte';
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
