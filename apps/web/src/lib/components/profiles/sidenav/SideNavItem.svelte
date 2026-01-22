<script lang="ts">
  import { getActiveSection, setActiveSection } from './ActiveLink.svelte';
  import { slugify } from '@repo/shared/functions/formatters/names';

  interface NavItem {
    title: string;
  }

  interface Props {
    item: NavItem;
  }

  let { item }: Props = $props();

  let uppercaseTitle = item.title.toUpperCase();
  let lowercaseTitle = slugify(item.title.toLowerCase());
  let href = `#${lowercaseTitle}`;
  let isActive = $derived(getActiveSection() === lowercaseTitle);

  function handleClick(id: string): void {
    setActiveSection(id, true);
  }
</script>

<li class="mt-0.5">
  <a
    class="ease-nav-brand mx-4 my-0 flex items-center px-4 py-2.5 text-sm whitespace-nowrap transition-colors {isActive ?
      'shadow-soft-xl rounded-lg bg-white font-semibold text-slate-700'
    : ''}"
    {href}
    onclick={() => handleClick(lowercaseTitle)}
    aria-label={uppercaseTitle}
  >
    <div
      class="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg text-center {isActive ? 'bg-slate-700 text-white' : (
        'bg-white fill-current stroke-0 text-slate-900'
      )}"
    ></div>
    <span class="ease-soft pointer-events-none ml-1 opacity-100 duration-300">{item.title}</span>
  </a>
</li>
