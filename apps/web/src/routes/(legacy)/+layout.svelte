<script lang="ts">
  /**
   * Layouts in SvelteKit inherit parent layouts
   * However, this layout is in it's own namespace, 'legacy'
   * This layout is in transition. It uses the global Tailwind-based components for the header and footer
   * Subsequent layouts handle the importing of the legacy CSS, in an effort to keep the legacy CSS as separated as possible
   */

  import '@fontsource/material-icons';
  import '@fontsource-variable/inter';
  import '$src/app.pcss';
  import { page } from '$app/state';
  import type { LayoutLoad } from './$types';
  import SEO from '$lib/components/shared/SEO.svelte';
  import { meta } from '@repo/shared/constants/trustedConstants';
  import Footer from '$src/lib/components/footer/Footer.svelte';
  import GlobalNav from '$lib/components/nav/GlobalNav.svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  const {
    defaults: { title, description },
  } = meta;

  const organizationName: string = $derived(page?.data?.profile?.organization_name ?? null);
</script>

<svelte:head>
  {#if page?.data?.profile}
    <SEO profile={page?.data?.profile} />
  {:else}
    <title>{title}</title>
    <meta name="description" content={description} />
  {/if}
</svelte:head>

<!-- Wrap the layout to add a layout-specific background color -->
<div class="min-h-screen bg-slate-200">
  <GlobalNav {organizationName} />

  {@render children?.()}

  <Footer />
</div>

<style>
  :global(.container-loader) {
    animation: fadeIn 0.4s ease-in forwards;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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
    width: 24px;
    overflow: hidden;
  }
</style>
