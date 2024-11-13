<script lang="ts">
  import '@fontsource/inter';
  import '../app.pcss';
  import { page } from '$app/stores';
  import SEO from '$lib/components/shared/SEO.svelte';
  import { meta } from '@utils/trustedConstants';
  import Footer from '$lib/components/footer/Footer.svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  let isProfileRoute = $derived($page.url.pathname.startsWith('/profiles/'));

  const {
    defaults: { title, description },
  } = meta;
</script>

<svelte:head>
  {#if $page.data.foundationData?.profile}
    <SEO profile={$page.data.foundationData.profile} />
  {:else}
    <title>{title}</title>
    <meta name="description" content={description} />
  {/if}
</svelte:head>

<div class="app-container">
  {@render children?.()}

  <Footer {isProfileRoute} />
</div>
