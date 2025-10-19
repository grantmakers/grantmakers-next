<script lang="ts">
  import '@fontsource-variable/inter';
  import '$src/app.pcss';
  import { page } from '$app/state';
  import SEO from '$lib/components/shared/SEO.svelte';
  import { meta } from '@repo/shared/constants/trustedConstants';
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
  {#if page.data.profile}
    <SEO profile={page.data.profile} />
  {:else}
    <title>{title}</title>
    <meta name="description" content={description} />
  {/if}
</svelte:head>

<!-- Wrap the layout to add a layout-specific background color -->
<div class="min-h-screen bg-white">
  <!-- The Header is handled individually in children +layouts -->

  {@render children?.()}

  <!-- The Footer is consistent across all routes - so we place it here to be inherited across all child and grandchild routes -->
  <Footer />
</div>
