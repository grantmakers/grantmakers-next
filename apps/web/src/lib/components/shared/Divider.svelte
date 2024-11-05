<script lang="ts">
  interface Props {
    borderColorClass?: string;
  }

  let { borderColorClass = 'border-gray-200' }: Props = $props();
</script>

<div class="relative w-full">
  <div class="absolute inset-0 flex items-center" aria-hidden="true">
    <div class="w-full border-t {borderColorClass}"></div>
  </div>
</div>
