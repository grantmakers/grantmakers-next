<script lang="ts">
  import '@fontsource/open-sans';
  import '../../../../app.pcss';

  export let title: string = 'Default Title';
  export let description: string = 'Default Description';
  console.log('Layout title:', title);
  console.log('Layout description', description);
</script>

<svelte:head>
  <title>{title}</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
</svelte:head>

<slot />

<style>
  :global(body) {
    background-color: #f8f9fe;
  }
</style>
