<script lang="ts">
  /**
   * Layouts in SvelteKit inherit parent layouts - this is the master grandparent layout
   * Subsequent layouts handle the importing of the legacy CSS, in an effort to keep the legacy CSS as separated as possible
   * The (next) layouts are intended to be the 'pristine' Tailwind-only routes
   *
   * TYPE SAFETY:
   * - Profile data comes from child +page.server.ts files
   * - Types are defined in src/app.d.ts under App.PageData interface - for simplicity as no data transformation occurs - else use a load function in +layout.ts using LayoutLoad types
   * - Accessed via page.data.profile (from $app/state)
   *
   * DATA FLOW:
   * - Each profile page (+page.server.ts) loads its own profile data
   * - Layout accesses this data via page.data to display in global navigation
   * - Fallback to "Unnamed Organization" if profile or organization_name is missing
   */
  import '@fontsource-variable/inter';
  import '$src/app.pcss';
  import { page } from '$app/state';
  import SEO from '$lib/components/shared/SEO.svelte';
  import { meta } from '@repo/shared/constants/trustedConstants';
  import GlobalNav from '$lib/components/nav/GlobalNav.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  const {
    defaults: { title, description },
  } = meta;

  // TODO Move this to trustedConstants
  const organizationName = $derived(page.data.profile?.organization_name ?? 'Unnamed Organization');
</script>

<svelte:head>
  {#if page.data.profile}
    <SEO profile={page.data.profile} />
  {:else}
    <title>{title}</title>
    <meta name="description" content={description} />
  {/if}
</svelte:head>

<!-- Wrap the layout to add a global default background color -->
<div class="min-h-screen bg-white">
  <GlobalNav {organizationName} />

  {@render children?.()}

  <Footer />
</div>
