<script lang="ts">
  import { LockOpen, LockClosed, UserGroup, GlobeAlt, CurrencyDollar } from 'svelte-heros-v2';

  interface Props {
    noUnsolicited: true | null;
    isStaffed: boolean;
    hasWebsite: boolean;
    hasRecentGrants: boolean;
    grantCount: number;
  }

  let { noUnsolicited, isStaffed, hasWebsite, hasRecentGrants, grantCount }: Props = $props();
</script>

<dl class="grid grid-cols-1 overflow-hidden rounded-lg bg-white p-2">
  <dd class="flex flex-row items-center justify-center text-2xl font-bold text-slate-700">
    <!-- Solicitation Status -->
    <div class="m-1 inline rounded p-2 {!noUnsolicited ? 'bg-green-500' : 'bg-yellow-500'} {grantCount < 2 ? 'bg-slate-200' : ''}">
      {#if !noUnsolicited}
        <LockOpen variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
      {:else}
        <LockClosed variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
      {/if}
      <span class="sr-only">Solicitation {!noUnsolicited ? 'Allowed' : 'Not Allowed'}</span>
    </div>

    <!-- Staffing Status -->
    <div class="m-1 inline rounded p-2 {isStaffed ? 'bg-green-500' : 'bg-yellow-500'}">
      <UserGroup variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
      <span class="sr-only">Organization {isStaffed ? 'is Staffed' : 'is not Staffed'}</span>
    </div>

    <!-- Website Status -->
    <div class="m-1 inline rounded p-2 {hasWebsite ? 'bg-green-500' : 'bg-yellow-500'}">
      <GlobeAlt variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
      <span class="sr-only">Website {hasWebsite ? 'Available' : 'Not Available'}</span>
    </div>

    <!-- Grantmaking Status -->
    <div class="m-1 inline rounded p-2 {hasRecentGrants ? 'bg-green-500' : 'bg-yellow-500'} {grantCount < 2 ? 'bg-slate-200' : ''}">
      <CurrencyDollar variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
      <span class="sr-only">Has Recent Grants {hasRecentGrants ? 'Available' : 'Not Available'}</span>
    </div>
  </dd>
  <dt class="text-center text-sm leading-normal text-inherit">Approachability</dt>
</dl>
