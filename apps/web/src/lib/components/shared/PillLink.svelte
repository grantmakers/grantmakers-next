<script lang="ts">
  export let href = '';
</script>

<div>
  <a {href} target="_blank" class="flex justify-center">
    <span class="rounded-full px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
      <slot />
    </span>
  </a>
</div>
