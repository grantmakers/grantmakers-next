<script lang="ts">
  import { page } from '$app/stores';

  interface Props {
    href: string;
    title: string;
  }

  let { href, title }: Props = $props();

  let isActive = $derived($page.url.pathname === href);

  const getLinkClasses = (path: string) => {
    const active = 'bg-slate-700 cursor-default pointer-events-none';
    const inactive = 'hover:bg-slate-500/75';
    return `${$page.url.pathname === path ? active : inactive}`;
  };
</script>

<a
  {href}
  class="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-slate-500/75 {getLinkClasses(href)}"
  aria-current={isActive ? 'page' : undefined}>{title}</a
>
