<script lang="ts">
  import HandDrawnSvg from './HandDrawnSvg.svelte';
  export let fill: Fill = 'fill-grantmakers-blue';

  type Fill = 'fill-grantmakers-orange' | 'fill-grantmakers-blue' | 'fill-grantmakers-green' | 'fill-transparent';
</script>

<div class="relative">
  <!-- Border SVG Container -->
  <div class="pointer-events-none absolute inset-0 -top-1 z-20 h-full w-full">
    <HandDrawnSvg {fill} />
  </div>
  <slot />
</div>
