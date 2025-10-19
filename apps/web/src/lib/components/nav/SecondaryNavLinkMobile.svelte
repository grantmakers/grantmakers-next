<script lang="ts">
  import { page } from '$app/state';
  import { toggleMobileMenu } from '$lib/components/search/menuState.svelte';

  interface Props {
    href: string;
    title: string;
  }

  let { href, title }: Props = $props();
  let isActive = $derived(page.url.pathname === href);
  let linkClasses = $derived(
    isActive ?
      'bg-slate-100 text-slate-700 cursor-default pointer-events-none'
    : ' text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-500',
  );
  let requiresReload = $derived(href.startsWith('/profiles'));
</script>

<a
  data-sveltekit-reload={requiresReload}
  {href}
  class="block py-2 pl-3 pr-4 text-base font-medium sm:pl-5 sm:pr-6 {linkClasses}"
  onclick={toggleMobileMenu}
  aria-current={isActive ? 'page' : undefined}>{href === '/about' ? 'The Project' : title}</a
>
