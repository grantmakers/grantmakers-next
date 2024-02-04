<script lang="ts">
  /**
   * For future portability, limit imports to a single Svelte component and a SvelteKit Layout
   * Svelte components can easily be moved (e.g. to Astro), but not SvelteKit-specific page and layouts
   */
  import MainLanding from '$lib/components/landing/MainLanding.svelte';
  import Layout from './+layout.svelte';
</script>

<Layout>
  <MainLanding />
</Layout>
