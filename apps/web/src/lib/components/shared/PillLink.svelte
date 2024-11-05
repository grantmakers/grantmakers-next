<script lang="ts">
  interface Props {
    href?: string;
    children?: import('svelte').Snippet;
  }

  let { href = '', children }: Props = $props();
</script>

<div>
  <a {href} target="_blank" class="flex justify-center">
    <span class="rounded-full px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
      {@render children?.()}
    </span>
  </a>
</div>
