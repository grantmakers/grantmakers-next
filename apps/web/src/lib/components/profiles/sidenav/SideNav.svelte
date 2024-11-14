<script lang="ts">
  import { RectangleGroup, CurrencyDollar, Users, ClipboardDocumentList, ChartBar } from 'svelte-heros-v2';
  import NavItem from './SideNavItem.svelte';

  interface NavItemTypes {
    title: string;
    icon: typeof ChartBar;
  }

  const navItems: NavItemTypes[] = [
    {
      title: 'Overview',
      icon: RectangleGroup,
    },
    {
      title: 'Grants',
      icon: CurrencyDollar,
    },
    {
      title: 'People',
      icon: Users,
    },
    {
      title: 'Guidelines',
      icon: ClipboardDocumentList,
    },
    {
      title: 'Financials',
      icon: ChartBar,
    },
  ];
</script>

<nav>
  <ul>
    {#each navItems as item}
      <NavItem {item} active={item.title.toLowerCase() === 'overview'} />
    {/each}
  </ul>
</nav>
