<script lang="ts">
  import type { PageData } from './$types.js';
  import SEO from '$lib/components/shared/SEO.svelte';
  import Profile from '$lib/components/profiles/Profile.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const {
    foundationData: { profile },
  } = data;
</script>

{#if profile}
  <SEO {profile} />
  <Profile {profile} />
{:else}
  <p>No profile data available</p>
{/if}
