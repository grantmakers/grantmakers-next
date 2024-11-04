<script lang="ts">
  import { slugify } from '@shared/functions/formatters/names';
  export let headerText: string;
  export let anchorText: string | undefined = undefined;
  const anchorSlug = slugify(anchorText ? anchorText : headerText);
</script>

<div id={anchorSlug} class="flex items-center justify-between align-middle lg:scroll-mt-8">
  <h6 class="mb-0">{headerText}</h6>
  <h6 class="m-0 text-xs font-bold leading-tight text-slate-500">
    <slot />
  </h6>
</div>
