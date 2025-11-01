<script lang="ts">
  import { inview, type Options } from 'svelte-inview';
  import { setActiveSection } from './sidenav/ActiveLink.svelte';
  import { slugify } from '@repo/shared/functions/formatters/names';
  import { type SideNavIds } from '@repo/shared/constants/trustedConstants';
  import { profileNavItems } from '@repo/shared/constants/trustedConstants/withIcons';

  interface Props {
    id: SideNavIds;
    classes?: string;
    children?: import('svelte').Snippet;
  }

  let { id, classes = '', children }: Props = $props();

  let options: Options = {
    threshold: id === 'overview' || id === 'people' ? 1 : 0.6,
    unobserveOnEnter: false,
  };

  // Not all section headers have sidenav links
  // Only activate scrollspy if the section is also a sidenav link
  const isNavItem = profileNavItems.some((item) => slugify(item.title).toLowerCase() === slugify(id).toLowerCase());
</script>

<div
  {id}
  class={'scroll-mt-5 ' + classes}
  use:inview={options}
  {...isNavItem && {
    'use:inview': options,
    oninview_change: (event) => {
      if (event.detail.inView) {
        // People requires special treatment given its proximity to the Overview section, and the Overview sections small height, nearly guaranteeing they are almost always both in the viewport
        if (id === 'people') {
          if (event.detail.entry.intersectionRatio >= 1) {
            setActiveSection(id);
          }
        } else {
          setActiveSection(id);
        }
      }
    },
  }}
>
  {@render children?.()}
</div>
