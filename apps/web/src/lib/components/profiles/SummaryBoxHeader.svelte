<script lang="ts">
  export let headerText: string;
</script>

<div class="flex items-center justify-between align-middle">
  <h6 class="mb-0">{headerText}</h6>
  <h6 class="m-0 text-xs font-bold uppercase leading-tight text-slate-500">
    <slot />
  </h6>
</div>
