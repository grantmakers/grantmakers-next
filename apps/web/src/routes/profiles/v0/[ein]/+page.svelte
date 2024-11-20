<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { PageData } from './$types.js';
  import SEO from '$lib/components/shared/SEO.svelte';
  import Profile from '$lib/components/profiles/Profile.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const { profile } = data;

  onMount(() => {
    const canonicalSlug = `${profile.ein}-${profile.organization_name_slug}`;
    if ($page.params.ein !== canonicalSlug) {
      goto(`/profiles/v0/${canonicalSlug}`, { replaceState: true });
    }
  });
</script>

{#if profile}
  <SEO {profile} />
  <Profile {profile} />
{:else}
  <p>No profile data available</p>
{/if}
