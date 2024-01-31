<script lang="ts">
  import '@fontsource/inter';
  import '../app.pcss';

  export let title: string;
  export let description: string;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

<slot />
