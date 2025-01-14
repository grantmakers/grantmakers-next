<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { PageData } from './$types.js';
  import Profile from '$lib/components/Profile.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const { profile } = data;
</script>

<div class="profile-page" data-sveltekit-preload-data="off">
  {#if profile}
    <Profile {profile} />
  {:else}
    <p>No profile data available</p>
  {/if}
</div>
