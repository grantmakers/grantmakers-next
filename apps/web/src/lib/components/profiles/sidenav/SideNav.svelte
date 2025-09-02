<script lang="ts">
  import NavItem from './SideNavItem.svelte';
  import { profileNavItems } from '@repo/shared/constants/trustedConstants';
</script>

<nav>
  <ul class="flex flex-col">
    {#each profileNavItems as item}
      <NavItem {item} />
    {/each}
  </ul>
</nav>
