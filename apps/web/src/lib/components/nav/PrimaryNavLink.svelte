<script lang="ts">
  import { page } from '$app/state';

  interface Props {
    href: string;
    title: string;
  }

  let { href, title }: Props = $props();

  let isActive = $derived(
    page.url.pathname === href ||
    (page.url.pathname.startsWith(href) && !(href === '/about/' && page.url.pathname.startsWith('/about/donate/')))
  );
  let linkClasses = $derived(isActive ? 'bg-white/10 cursor-default pointer-events-none' : 'hover:bg-white/25');
  let requiresReload = $derived(href.startsWith('/search'));
</script>

<a
  data-sveltekit-reload={requiresReload}
  {href}
  class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 {linkClasses}"
  aria-current={isActive ? 'page' : undefined}>{title}</a
>
