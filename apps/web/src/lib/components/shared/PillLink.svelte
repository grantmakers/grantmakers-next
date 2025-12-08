<script lang="ts">
  interface Props {
    href?: string;
    children?: import('svelte').Snippet;
  }

  let { href = '', children }: Props = $props();
</script>

<div>
  <a {href} target="_blank" class="flex justify-center">
    <span class="rounded-full px-3 py-1 text-sm leading-6 font-semibold text-indigo-600 ring-1 ring-indigo-500/20 ring-inset">
      {@render children?.()}
    </span>
  </a>
</div>
