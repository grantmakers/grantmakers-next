<script lang="ts">
  import GlobalNav from '$lib/components/nav/GlobalNav.svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="min-h-full">
  <GlobalNav />

  {@render children?.()}

  <!-- Footer inherited from root +layout -->
</div>
