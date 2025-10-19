<script lang="ts">
  import { page } from '$app/state';

  interface Props {
    href: string;
    title: string;
  }

  let { href, title }: Props = $props();

  let isActive = $derived(
    page.url.pathname === href ||
      (page.url.pathname.startsWith(href) && !(href === '/about/' && page.url.pathname.startsWith('/about/donate/'))),
  );
  let linkColor = $derived(href.includes('grants') ? 'text-grantmakers-blue-dark-bg' : 'text-grantmakers-orange-light');
  let linkClasses = $derived(isActive ? 'bg-white/10 cursor-default pointer-events-none' : 'hover:bg-white/25');
  let requiresReload = $derived(href.startsWith('/search'));
</script>

<a
  data-sveltekit-reload={requiresReload}
  {href}
  class="rounded-lg px-4 py-2 font-bold transition-colors {linkColor} {linkClasses}"
  aria-current={isActive ? 'page' : undefined}>{title}</a
>
