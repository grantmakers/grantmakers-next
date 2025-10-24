<script lang="ts">
  import type { PageData } from './$types.js';
  import Profile from '$lib/components/legacy/Profile.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const { profile, hasSurpriseMeAccess } = data;
</script>

<div class="profile-page">
  {#if profile}
    <Profile {profile} {hasSurpriseMeAccess} />
  {:else}
    <p>No profile data available</p>
  {/if}
</div>
