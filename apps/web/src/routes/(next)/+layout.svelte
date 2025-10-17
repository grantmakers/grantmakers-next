<script lang="ts">
  import '@fontsource-variable/inter';
  import Inter from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2';
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
  <link rel="preload" as="font" href={Inter} type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<!-- The Header is handled individually in children +layouts -->

{@render children?.()}

<!-- The Footer is consistent across all routes - so we place it here to be inherited across all child and grandchild routes -->
<Footer />
