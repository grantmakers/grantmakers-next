<script lang="ts">
  import type { PageData } from './$types.js';
  import Profile from '$lib/components/legacy/Profile.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const profile = $derived(data.profile);
</script>

<div class="profile-page">
  {#if profile}
    {#key profile.ein}
      <Profile {profile} />
    {/key}
  {:else}
    <p>No profile data available</p>
  {/if}
</div>
