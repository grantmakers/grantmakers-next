<script lang="ts">
  import { page } from '$app/state';

  interface Props {
    href: string;
    title: string;
  }

  let { href, title }: Props = $props();

  let isActive = $derived(page.url.pathname === href || page.url.pathname.startsWith(href));
  let linkClasses = $derived(
    isActive ?
      'border-slate-500 bg-slate-100 text-slate-700 cursor-default pointer-events-none'
    : 'border-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-500',
  );
</script>

<a
  {href}
  class="block border-l-4 py-2 pr-4 pl-3 text-base font-medium sm:pr-6 sm:pl-5 {linkClasses}"
  aria-current={isActive ? 'page' : undefined}>{title}</a
>

<!-- Quick hack to have all Tailwind classes available at runtime -->
<!-- <div class="border-slate-500 bg-slate-50 text-slate-700 cursor-default pointer-events-none border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"></div> -->
