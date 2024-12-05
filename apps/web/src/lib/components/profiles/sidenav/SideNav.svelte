<script lang="ts">
  import NavItem from './SideNavItem.svelte';
  import { profileNavItems } from '$lib/utils/trustedConstants';
  import Tip from '../alerts/Tip.svelte';
</script>

<nav>
  <ul class="flex flex-col">
    {#each profileNavItems as item}
      <NavItem {item} />
    {/each}
  </ul>
</nav>
