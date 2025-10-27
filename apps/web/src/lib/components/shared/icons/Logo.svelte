<script lang="ts">
  import logo from '$lib/assets/images/logo.svg';
  interface Props {
    variation?: 'title' | 'body' | 'sticky';
  }
  let { variation = 'body' }: Props = $props();

  let sizeClasses = $derived(
    variation === 'title' ? 'max-h-10'
    : variation === 'body' ? 'max-h-6'
    : 'max-h-8',
  );
</script>

<div>
  <img src={logo} alt="Grantmakers.io logo" class="{sizeClasses} w-full" height={36} width={36} />
</div>
