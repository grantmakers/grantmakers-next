<script lang="ts">
  import { page } from '$app/state';
  import { closeDialog } from '$lib/actions/closeDialog';

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
</script>

<a
  {href}
  use:closeDialog
  class="block py-2 pr-4 pl-3 text-base font-medium sm:pr-6 sm:pl-5 {linkClasses}"
  aria-current={isActive ? 'page' : undefined}>{href === '/about' ? 'The Project' : title}</a
>
