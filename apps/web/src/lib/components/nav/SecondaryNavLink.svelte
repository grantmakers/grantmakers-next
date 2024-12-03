<script lang="ts">
  import { page } from '$app/stores';

  interface Props {
    href: string;
    title: string;
  }

  let { href, title }: Props = $props();

  let isActive = $derived($page.url.pathname === href);

  const getLinkClasses = (path: string) => {
    const active = 'rounded-none border-white text-white pointer-events-none';
    const inactive = 'border-transparent text-indigo-100 hover:bg-white/10';
    return `${$page.url.pathname === path ? active : inactive}`;
  };
</script>

<a
  {href}
  class="rounded-md border-b-2 px-3 py-2 text-sm font-medium focus:outline-none focus-visible:outline-none {getLinkClasses(href)}"
  aria-current={isActive ? 'page' : undefined}>{title}</a
>
