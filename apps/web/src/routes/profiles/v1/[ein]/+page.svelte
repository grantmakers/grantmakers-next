<script lang="ts">
  /**
   * For future portability, limit imports to a single Svelte component and a SvelteKit Layout
   * Svelte components can easily be moved (e.g. to Astro), but not SvelteKit-specific page and layouts
   */
  import Layout from './+layout.svelte';
  import type { PageData } from './$types.js';
  import Profile from '$lib/components/profiles/Profile.svelte';

  export let data: PageData;
  let {
    foundationData: { profile },
    title,
    description,
  } = data;
  console.log('Page Title:', title);
  console.log('Page Description:', description);
</script>

<!-- TODO: The description error likely occurs here -->
<Layout {title} {description}>
  <!-- TODO Improve or remove awaiting state -->
  {#await profile}
    <p class="bg-white text-white">Loading...</p>
  {:then profile}
    <Profile {profile} />
  {:catch error}
    <p>Error loading profile data: {error.message}</p>
  {/await}
</Layout>
