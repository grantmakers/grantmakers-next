<script lang="ts">
  import { RectangleGroup, CurrencyDollar, Users, ClipboardDocumentList, ChartBar } from 'svelte-heros-v2';
  import NavItem from './SideNavItem.svelte';
  import Tip from '../alerts/Tip.svelte';

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
  <ul class="flex flex-col">
    {#each navItems as item}
      <NavItem {item} active={item.title.toLowerCase() === 'overview'} />
    {/each}
  </ul>
  <div class="mt-12">
    <Tip
      title="No Affiliation"
      message="Grantmakers.io is not affiliated, associated, authorized, endorsed by, or in any way officially connected with any
  foundation appearing on the site."
      variation="xs"
      includeLogo
    />
  </div>
</nav>
