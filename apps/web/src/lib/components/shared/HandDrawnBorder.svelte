<script lang="ts">
  import HandDrawnSvg from './HandDrawnSvg.svelte';

  type Fill = 'fill-grantmakers-orange' | 'fill-yellow-500' | 'fill-grantmakers-blue' | 'fill-grantmakers-green' | 'fill-transparent';

  interface Props {
    fill?: Fill;
    show: boolean;
    children?: import('svelte').Snippet;
  }

  let { fill = 'fill-grantmakers-blue', show, children }: Props = $props();
</script>

<div class="relative">
  {#if show}
    <div class="pointer-events-none absolute inset-0 -top-1 z-20 h-full w-full" role="presentation" aria-hidden="true">
      <HandDrawnSvg {fill} />
    </div>
  {/if}
  {@render children?.()}
</div>
