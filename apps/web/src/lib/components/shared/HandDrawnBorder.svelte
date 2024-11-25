<script lang="ts">
  import HandDrawnSvg from './HandDrawnSvg.svelte';
  interface Props {
    fill?: Fill;
    children?: import('svelte').Snippet;
  }

  let { fill = 'fill-grantmakers-blue', children }: Props = $props();

  type Fill = 'fill-grantmakers-orange' | 'fill-yellow-500' | 'fill-grantmakers-blue' | 'fill-grantmakers-green' | 'fill-transparent';
</script>

<div class="relative">
  <!-- Border SVG Container -->
  <div class="pointer-events-none absolute inset-0 -top-1 z-20 h-full w-full" role="presentation" aria-hidden="true">
    <HandDrawnSvg {fill} />
  </div>
  {@render children?.()}
</div>
