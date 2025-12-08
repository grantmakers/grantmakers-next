<script lang="ts">
  interface Props {
    title: string;
    children?: import('svelte').Snippet;
  }

  let { title, children }: Props = $props();
</script>

<div class="flex items-center justify-between align-middle lg:scroll-mt-8">
  <h6 class="mb-0 text-base font-semibold text-slate-700">{title}</h6>
  <h6 class="m-0 text-xs leading-tight font-bold text-slate-500">
    {@render children?.()}
  </h6>
</div>
