<script lang="ts">
  import NavItem from './SideNavItem.svelte';
  import { navItems } from '$lib/utils/trustedConstants';
  import Tip from '../alerts/Tip.svelte';
</script>

<nav>
  <ul class="flex flex-col">
    {#each navItems as item}
      <NavItem {item} />
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
