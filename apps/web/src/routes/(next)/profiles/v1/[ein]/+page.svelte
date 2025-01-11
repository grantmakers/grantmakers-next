<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { PageData } from './$types.js';
  import Profile from '$lib/components/profiles/Profile.svelte';
  import { trackEvent } from '$utils/analytics.js';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const { profile } = data;

  onMount(() => {
    const canonicalSlug = `${profile.ein}-${profile.organization_name_slug}`;
    if ($page.params.ein === profile.ein) {
      trackEvent('redirect_ein_shortcut_route', {
        event_category: 'Navigation',
        event_label: 'EIN Only Access',
        ein: profile.ein,
        original_url: $page.params.ein,
        destination_url: `/profiles/v1/${profile.ein}-${profile.organization_name_slug}`,
        organization_name: profile.organization_name,
      });
    }
    const referrer = document.referrer;
    if (referrer && referrer.includes('/profiles/v1/')) {
      trackEvent('redirect_slug_mismatch', {
        event_category: 'Navigation',
        event_label: 'Organization Name Slug Mismatch',
        ein: profile.ein,
        from_url: referrer,
        to_url: window.location.pathname,
        organization_name: profile.organization_name,
      });
    }
    if ($page.params.ein !== canonicalSlug) {
      console.log('Detected power user - redirecting to full URL');
      goto(`/profiles/v1/${canonicalSlug}`, { replaceState: true });
    }
  });
</script>

{#if profile}
  <Profile {profile} />
{:else}
  <p>No profile data available</p>
{/if}
