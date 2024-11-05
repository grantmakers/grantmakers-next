<script lang="ts">
  /**
   * For future portability, limit imports to a single Svelte component and a SvelteKit Layout
   * Svelte components can easily be moved (e.g. to Astro), but not SvelteKit-specific page and layouts
   *
   * TODO This needs to be refactored
   * 1) #await-ing the profile data is an anti-pattern in SvelteKit
   * 2) Layouts in SvelteKit inherit parent layouts - this causes SEO issues with title and description
   *    - The result is a duplicate meta description and an unknown version of the title available for crawlers
   *    - Consider using SvelteKit Advanced Routing group, e.g. (profiles) and (landing)
   */
  import Layout from './+layout.svelte';
  import type { PageData } from './$types.js';
  import SEO from '$lib/components/shared/SEO.svelte';
  import Profile from '$lib/components/profiles/Profile.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let {
    foundationData: { profile },
  } = data;
</script>

<Layout>
  <!-- TODO The #await will be refactored: see note above -->
  {#await profile}
    <p class="bg-white text-white">Loading...</p>
  {:then profile}
    <SEO {profile} />
    <Profile {profile} />
  {:catch error}
    <p>Error loading profile data: {error.message}</p>
  {/await}
</Layout>
