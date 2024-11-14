<script lang="ts">
  import type { ChartBar } from 'svelte-heros-v2';

  // HACK Uses types from a specific icon
  // A generic type does not appear to exist
  interface NavItem {
    title: string;
    icon: typeof ChartBar;
  }

  interface Props {
    item: NavItem;
    active?: boolean;
  }

  let { item, active = false }: Props = $props();

  let href = $derived(`#${item.title.toLowerCase()}`);
  let uppercase = $derived(item.title.toUpperCase());
</script>

<li class="mt-0.5 w-full">
  <a
    class="ease-nav-brand mx-4 my-0 flex items-center whitespace-nowrap px-4 py-2.5 text-sm transition-colors {active ?
      'shadow-soft-xl rounded-lg bg-white font-semibold text-slate-700'
    : ''}"
    {href}
    aria-label={uppercase}
  >
    <div
      class="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg text-center {active ? 'bg-slate-700 text-white' : (
        'bg-white fill-current stroke-0 text-slate-900'
      )}"
    >
      {#if item.icon}
        <item.icon size="16" variation="solid" />
      {/if}
    </div>
    <span class="ease-soft pointer-events-none ml-1 opacity-100 duration-300">{item.title}</span>
  </a>
</li>
