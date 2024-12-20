<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { PageData } from './$types.js';
  import Profile from '$lib/components/legacy/Profile.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const { profile } = data;

  onMount(() => {
    const canonicalSlug = `${profile.ein}-${profile.organization_name_slug}`;
    if ($page.params.ein !== canonicalSlug) {
      goto(`/profiles/vL/${canonicalSlug}`, { replaceState: true });
    }
  });
</script>

<div class="profile-page">
  {#if profile}
    <Profile {profile} />
  {:else}
    <p>No profile data available</p>
  {/if}
</div>
