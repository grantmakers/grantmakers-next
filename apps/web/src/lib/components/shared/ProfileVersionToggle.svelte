<script lang="ts">
  import { page } from '$app/state';
  import ArrowPath from 'svelte-heros-v2/ArrowPath.svelte';

  // There is no need to track url state as a user interacts with the page
  // IF they click the toggle, we take a snapshot of the full URL
  // We swap the version and send the user on their way
  const v0 = '/profiles/v0/';
  const v1 = '/profiles/v1/';

  const isV0 = page.url.pathname.includes(v0);
  const showToggle = isV0 || page.url.pathname.includes(v1);

  const label = isV0 ? 'Try new layout' : 'Back to classic layout';

  let isNavigating = $state(false);

  function toggle() {
    if (isNavigating) return;
    isNavigating = true;

    const href = window.location.href;
    window.location.href = isV0 ? href.replace(v0, v1) : href.replace(v1, v0);
  }
</script>

{#if showToggle}
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
    <ArrowPath class="h-3.5 w-3.5 {isNavigating ? 'animate-spin' : ''}" />
    <span>{isNavigating ? 'Loading...' : label}</span>
  </button>
{/if}
