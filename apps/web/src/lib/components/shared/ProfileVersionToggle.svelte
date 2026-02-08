<script lang="ts">
  import { page } from '$app/state';
  import ArrowPath from 'svelte-heros-v2/ArrowPath.svelte';

  type ProfileVersion = 'v0' | 'v1';

  let isNavigating = $state(false);

  function getCurrentVersion(pathname: string): ProfileVersion | null {
    if (pathname.includes('/profiles/v0/')) return 'v0';
    if (pathname.includes('/profiles/v1/')) return 'v1';
    return null;
  }

  function toggle() {
    if (isNavigating) return; // Prevent rapid clicks

    const pathname = page.url.pathname;
    const current = getCurrentVersion(pathname);
    if (!current) return;

    isNavigating = true;
    const target: ProfileVersion = current === 'v0' ? 'v1' : 'v0';
    window.location.href = pathname.replace(`/profiles/${current}/`, `/profiles/${target}/`);
  }

  const version = $derived(getCurrentVersion(page.url.pathname));
  const label = $derived(version === 'v0' ? 'Try new layout' : 'Back to classic layout');
  const isVisible = $derived(version !== null);
</script>

{#if isVisible}
  <button
    onclick={toggle}
    disabled={isNavigating}
    aria-label={label}
    aria-busy={isNavigating}
    class="
      fixed right-5 bottom-5 z-40
      inline-flex items-center gap-1.5
      rounded-full
      
      bg-slate-900/80 px-4
      py-3
      text-sm
      font-medium text-slate-50
      shadow-sm
      
      ring-1 ring-slate-200 backdrop-blur-md
      
      transition-all duration-200 ease-out

      hover:bg-slate-900/90
      hover:text-slate-100
      hover:shadow-md

      focus-visible:ring-2
      focus-visible:ring-slate-400
      focus-visible:outline-none

      active:scale-95

      disabled:cursor-not-allowed
      disabled:opacity-60
      disabled:active:scale-100
    "
  >
    <ArrowPath class={`h-3.5 w-3.5 ${isNavigating ? 'animate-spin' : ''}`} />
    <span>{isNavigating ? 'Loading...' : label}</span>
  </button>
{/if}
