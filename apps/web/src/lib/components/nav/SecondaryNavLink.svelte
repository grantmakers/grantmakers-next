<script lang="ts">
  import { page } from '$app/state';

  interface Props {
    href: string;
    title: string;
  }

  let { href, title }: Props = $props();

  const isAnchorLink = $derived(href.startsWith('#'));

  let isActive = $derived.by(() => {
    if (isAnchorLink) {
      return page.url.hash === href;
    }
    return page.url.pathname === href;
  });
  let linkClasses = $derived(
    isActive ? 'rounded-none border-white text-white pointer-events-none' : 'border-transparent text-indigo-100 hover:bg-white/10',
  );
</script>

<a
  {href}
  class="rounded-md border-b-2 px-3 py-2 text-sm font-medium focus:outline-none focus-visible:outline-none {linkClasses}"
  aria-current={isActive ? 'page' : undefined}>{title}</a
>
