<script lang="ts">
  import grantmakersIcon from '$lib/assets/images/logo.svg';
  interface Props {
    icon?: boolean;
    children?: import('svelte').Snippet;
  }
  let { icon = true, children }: Props = $props();
</script>

<div class="mt-2 mb-4 flex flex-row items-start justify-center gap-2 p-8">
  {#if icon}
    <img src={grantmakersIcon} class="inline-block h-6 w-6 rounded-full" alt="Grantmakers.io Logo" height={36} width={36} />
  {/if}
  <div class="flex flex-col items-center justify-center gap-2">
    {@render children?.()}
  </div>
</div>
