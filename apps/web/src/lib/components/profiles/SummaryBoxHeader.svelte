<script lang="ts">
  import { inview, type Options } from 'svelte-inview';
  import { setActiveSection } from '../profiles/sidenav/ActiveLink.svelte';
  import { slugify } from '@repo/shared/functions/formatters/names';
  import { navItems } from '$lib/utils/trustedConstants';

  interface Props {
    headerText: string;
    anchorText?: string | undefined;
    children?: import('svelte').Snippet;
  }

  let { headerText, anchorText = undefined, children }: Props = $props();
  let anchorSlug = slugify(anchorText ? anchorText : headerText);

  let options: Options = {
    // HACK Optimized for desktop, but effectively skips People
    threshold: anchorSlug === 'overview' ? 0.8 : 0.6,
  };

  // Not all section headers have sidenav links
  // Only activate scrollspy if the section is also a sidenav link
  const isNavItem = navItems.some((item) => slugify(item.title).toLowerCase() === slugify(anchorSlug).toLowerCase());
</script>

<div
  id={anchorSlug}
  use:inview={options}
  class="flex items-center justify-between align-middle lg:scroll-mt-8"
  {...isNavItem && {
    'use:inview': options,
    oninview_change: (event) => {
      if (event.detail.inView) {
        setActiveSection(anchorSlug);
      }
    },
  }}
>
  <h6 class="mb-0">{headerText}</h6>
  <h6 class="m-0 text-xs font-bold leading-tight text-slate-500">
    {@render children?.()}
  </h6>
</div>
