<script lang="ts">
  /**
   * Layouts in SvelteKit inherit parent layouts
   * However, this layout is in it's own namespace, 'legacy'
   * This layout is in transition. It uses the global Tailwind-based components for the header and footer
   * Subsequent layouts handle the importing of the legacy CSS, in an effort to keep the legacy CSS as separated as possible
   */

  import '@fontsource/material-icons';
  import '$src/app.pcss';
  import { page } from '$app/state';
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
</script>

<svelte:head>
  {#if page.data.profile}
    <SEO profile={page.data.profile} />
  {:else}
    <title>{title}</title>
    <meta name="description" content={description} />
  {/if}
</svelte:head>

<GlobalNav showSecondaryNav={false} transparentBg={false} absolute={false} />

{@render children?.()}

<Footer />

<style>
  @font-face {
    font-family: 'Inter Variable';
    font-style: normal;
    font-display: swap;
    font-weight: 100 900;
    src: url(@fontsource-variable/inter/files/inter-latin-wght-normal.woff2) format('woff2-variations');
    unicode-range:
      U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191,
      U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  :global(body) {
    background-color: #e2e8f0;
  }
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
