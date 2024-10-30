<script>
  import HandDrawnSvg from './HandDrawnSvg.svelte';
  export let fill = 'fill-slate-500';
</script>

<div class="relative">
  <!-- Border SVG Container -->
  <div class="absolute inset-0 -top-1 z-20 w-full h-full pointer-events-none">
    <HandDrawnSvg {fill} />
  </div>
  <slot />
</div>
