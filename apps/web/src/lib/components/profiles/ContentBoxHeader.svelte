<script lang="ts">
  import SectionAnchor from './SectionAnchor.svelte';

  interface Props {
    title: string;
    sectionId?: string;
    children?: import('svelte').Snippet;
  }

  let { title, sectionId, children }: Props = $props();
</script>

<div class="flex items-center justify-between align-middle lg:scroll-mt-8">
  <h2 class="mb-0">
    {#if sectionId}
      <SectionAnchor {title} {sectionId} />
    {:else}
      <span class="text-base font-semibold text-slate-700">{title}</span>
    {/if}
  </h2>
  <span class="m-0 text-xs leading-tight font-bold text-slate-500">
    {@render children?.()}
  </span>
</div>
