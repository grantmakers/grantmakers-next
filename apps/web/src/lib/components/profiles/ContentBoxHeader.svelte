<script lang="ts">
  interface Props {
    title: string;
    children?: import('svelte').Snippet;
  }

  let { title, children }: Props = $props();
</script>

<div class="flex items-center justify-between align-middle lg:scroll-mt-8">
  <h6 class="mb-0">{title}</h6>
  <h6 class="m-0 text-xs font-bold leading-tight text-slate-500">
    {@render children?.()}
  </h6>
</div>
