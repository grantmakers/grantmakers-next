<script lang="ts">
  let { columns = 1, classes = '', children } = $props();
</script>

<div class="-mx-3 grid grid-cols-1 {columns > 1 ? `md:grid-cols-${columns}` : ''} {classes}">
  {@render children()}
</div>
