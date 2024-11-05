<script lang="ts">
  import '@fontsource/inter';
  import '../app.pcss';
  import { meta } from '@utils/trustedConstants';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  const {
    defaults: { title, description },
  } = meta;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

{@render children?.()}
