<script lang="ts">
  import logo from '$lib/assets/images/logo.svg';
  interface Props {
    variation?: 'title' | 'body';
  }
  let { variation = 'body' }: Props = $props();

  let sizeClasses = $derived(variation === 'title' ? 'max-h-10' : 'max-h-6');
</script>

<div>
  <img src={logo} alt="Grantmakers.io logo" class="{sizeClasses} w-full" height={36} width={36} />
</div>
