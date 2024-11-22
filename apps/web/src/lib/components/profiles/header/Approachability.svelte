<script lang="ts">
  import { tooltip } from '$utils/tooltip';
  import { LockOpen, LockClosed, UserGroup, GlobeAlt, CurrencyDollar } from 'svelte-heros-v2';

  interface Props {
    noUnsolicited: true | null;
    isStaffed: boolean;
    hasWebsite: boolean;
    hasRecentGrants: boolean;
    grantCount: number;
  }

  let { noUnsolicited, isStaffed, hasWebsite, hasRecentGrants, grantCount }: Props = $props();

  const getBaseClasses = (isActive: boolean) => `m-1 inline rounded p-2 ${isActive ? 'bg-green-500' : 'bg-yellow-500'}`;

  const styles = $derived.by(() => ({
    solicitation: {
      base: getBaseClasses(!noUnsolicited),
      disabled: grantCount < 2 && noUnsolicited === null,
    },
    staffing: getBaseClasses(isStaffed),
    website: getBaseClasses(hasWebsite),
    grants: {
      base: getBaseClasses(hasRecentGrants),
      disabled: grantCount < 2,
    },
  }));
</script>

<dl class="grid grid-cols-1 overflow-hidden rounded-lg bg-white p-2">
  <dd class="flex flex-row items-center justify-center text-2xl font-bold text-slate-700">
    <!-- Solicitation Status -->
    <div
      class="{styles.solicitation.base} {styles.solicitation.disabled ? 'bg-slate-200' : ''}"
      use:tooltip={{
        content: noUnsolicited ? 'Preselected only?' : 'Possibly accepts unsolicited applications',
      }}
    >
      {#if !noUnsolicited}
        <LockOpen variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
      {:else}
        <LockClosed variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
      {/if}
      <span class="sr-only">Solicitation {!noUnsolicited ? 'Allowed' : 'Not Allowed'}</span>
    </div>

    <!-- Staffing Status -->
    <div class={styles.staffing} use:tooltip={{ content: isStaffed ? 'Likely staffed' : 'No paid staff' }}>
      <UserGroup variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
      <span class="sr-only">Organization {isStaffed ? 'is Staffed' : 'is not Staffed'}</span>
    </div>

    <!-- Website Status -->
    <div class={styles.website} use:tooltip={{ content: hasWebsite ? 'Website 👍' : 'No website listed' }}>
      <GlobeAlt variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
      <span class="sr-only">Website {hasWebsite ? 'Available' : 'Not Available'}</span>
    </div>

    <!-- Grantmaking Status -->
    <div
      class="{styles.grants.base} {styles.grants.disabled ? 'bg-slate-200' : ''}"
      use:tooltip={{
        content: hasRecentGrants ? 'Recent grants' : 'No recent grants',
      }}
    >
      <CurrencyDollar variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
      <span class="sr-only">Has Recent Grants {hasRecentGrants ? 'Available' : 'Not Available'}</span>
    </div>
  </dd>
  <dt class="text-center text-sm leading-normal text-inherit">Approachability</dt>
</dl>
