<script lang="ts">
  import { page } from '$app/stores';

  interface Props {
    reload?: boolean;
    href: string;
    title: string;
  }

  let { href, title, reload = false }: Props = $props();

  let isActive = $derived($page.url.pathname === href || $page.url.pathname.startsWith(href));
  let linkClasses = $derived(isActive ? 'bg-slate-700 cursor-default pointer-events-none' : 'hover:bg-slate-500/75');
</script>

<a
  data-sveltekit-reload={reload || undefined}
  {href}
  class="rounded-md px-3 py-2 text-sm font-medium text-white {linkClasses}"
  aria-current={isActive ? 'page' : undefined}>{title}</a
>
