<script lang="ts">
  import { page } from '$app/state';
  import { copy } from 'svelte-copy';

  interface Props {
    title: string;
    sectionId: string;
  }

  let { title, sectionId }: Props = $props();

  let showCopied = $state(false);
  let isHovered = $state(false);

  // Build the full URL with anchor
  const fullUrl = $derived(`${page.url.origin}${page.url.pathname}#${sectionId}`);

  function handleCopy() {
    showCopied = true;
    setTimeout(() => {
      showCopied = false;
    }, 2000);
  }
</script>

<span
  class="group/anchor relative inline-flex items-center gap-2"
  role="group"
  onmouseenter={() => (isHovered = true)}
  onmouseleave={() => (isHovered = false)}
>
  <span class="text-base font-semibold text-slate-700">{title}</span>

  <!-- Link icon - appears on hover -->
  <button
    type="button"
    use:copy={{
      text: fullUrl,
      onCopy: handleCopy,
    }}
    class="inline-flex size-5 items-center justify-center rounded text-slate-400 transition-opacity duration-150 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2
      {isHovered || showCopied ? 'opacity-100' : 'opacity-0'}"
    aria-label="Copy link to {title} section"
    title="Copy link to section"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
      <path
        d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z"
      />
      <path
        d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z"
      />
    </svg>
  </button>

  <!-- Copied feedback - appears after clicking -->
  {#if showCopied}
    <span class="text-xs font-medium text-green-600 transition-opacity duration-150" role="status" aria-live="polite"> Copied! </span>
  {/if}
</span>
