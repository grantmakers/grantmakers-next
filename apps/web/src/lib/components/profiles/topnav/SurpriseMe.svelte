<script lang="ts">
  import ArrowPath from 'svelte-heros-v2/ArrowPath.svelte';

  interface Props {
    variant?: 'default' | 'fab';
  }

  let { variant = 'default' }: Props = $props();
</script>

{#if variant === 'fab'}
  <a
    href="/profiles/random/"
    aria-label="Random profile"
    class="
      fixed right-5 bottom-5 z-40
      inline-flex h-10 w-10
      items-center justify-center rounded-full

      bg-white text-slate-500
      opacity-60 shadow-sm
      ring-1

      ring-slate-200
      transition-all duration-200 ease-out

      hover:text-slate-700
      hover:opacity-100
      hover:shadow-md

      focus-visible:opacity-100
      focus-visible:ring-2
      focus-visible:ring-slate-400
      focus-visible:outline-none

      active:scale-95
    "
  >
    <ArrowPath class="h-5 w-5" />
  </a>
{:else}
  <a class="pr-3 text-xs font-semibold text-slate-500 uppercase" href="/profiles/random/">
    <div class="flex flex-row items-center gap-2">
      <ArrowPath class="size-4 text-gray-500" />
      Surprise me
    </div>
  </a>
{/if}
