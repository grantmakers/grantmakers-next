<script lang="ts">
  export let variant: 'positive' | 'negative';
  const positiveClasses = 'bg-green-50 text-green-700 ring-green-100/75';
  const negativeClasses = 'bg-red-100 text-red-700 ring-red-100/75';
</script>

<span
  class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset {variant === 'positive' ? positiveClasses : (
    negativeClasses
  )}"
>
  <slot />
</span>
