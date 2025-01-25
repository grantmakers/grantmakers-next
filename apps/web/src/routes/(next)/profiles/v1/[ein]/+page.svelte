<script lang="ts">
  import type { PageData } from './$types.js';
  import Profile from '$lib/components/profiles/Profile.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const { profile } = data;
</script>

{#if profile}
  <Profile {profile} />
{:else}
  <p>No profile data available</p>
{/if}
