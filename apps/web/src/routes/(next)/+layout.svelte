<script lang="ts">
  import '@fontsource-variable/inter';
  import '$src/app.pcss';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<!-- Wrap the layout to add a layout-specific background color -->
<div class="min-h-full bg-white">
  {@render children?.()}
</div>
