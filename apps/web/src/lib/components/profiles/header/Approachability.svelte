<script lang="ts">
  import { createDialog } from 'svelte-headlessui';
  import Transition from 'svelte-transition';
  import { tooltip } from '$utils/tooltip';
  import LockOpen from 'svelte-heros-v2/LockOpen.svelte';
  import LockClosed from 'svelte-heros-v2/LockClosed.svelte';
  import UserGroup from 'svelte-heros-v2/UserGroup.svelte';
  import GlobeAlt from 'svelte-heros-v2/GlobeAlt.svelte';
  import CurrencyDollar from 'svelte-heros-v2/CurrencyDollar.svelte';
  import InformationCircle from 'svelte-heros-v2/InformationCircle.svelte';

  interface Props {
    noUnsolicited: true | null;
    isStaffed: boolean;
    hasWebsite: boolean;
    hasRecentGrants: boolean;
    grantCount: number;
  }

  let { noUnsolicited, isStaffed, hasWebsite, hasRecentGrants, grantCount }: Props = $props();

  const dialog = createDialog({ label: 'Approachability Helpers' });

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
        delay: 150,
        content: noUnsolicited ? 'Preselected only' : 'Possibly accepts unsolicited applications',
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
    <div class={styles.staffing} use:tooltip={{ delay: 150, content: isStaffed ? 'Likely staffed' : 'Limited staffing' }}>
      <UserGroup variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
      <span class="sr-only">Organization {isStaffed ? 'is Staffed' : 'reports limited staffing'}</span>
    </div>

    <!-- Website Status -->
    <div class={styles.website} use:tooltip={{ delay: 150, content: hasWebsite ? 'Website 👍' : 'No website listed' }}>
      <GlobeAlt variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
      <span class="sr-only">Website {hasWebsite ? 'Available' : 'Not Available'}</span>
    </div>

    <!-- Grantmaking Status -->
    <div
      class="{styles.grants.base} {styles.grants.disabled ? 'bg-slate-200' : ''}"
      use:tooltip={{
        delay: 150,
        content: hasRecentGrants ? 'Recent grants' : 'No recent grants',
      }}
    >
      <CurrencyDollar variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
      <span class="sr-only">Has Recent Grants {hasRecentGrants ? 'Available' : 'Not Available'}</span>
    </div>
  </dd>
  <dt class="text-center text-sm leading-normal text-inherit">
    <button type="button" class="inline-flex items-center justify-center gap-1" onclick={dialog.open}
      >Approachability <InformationCircle size="18" /></button
    >
  </dt>
</dl>

<div class="relative z-20">
  <Transition show={$dialog.expanded}>
    <Transition
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <button class="fixed inset-0 bg-black bg-opacity-25" onclick={dialog.close} aria-label="Close"></button>
    </Transition>

    <div class="fixed inset-0 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center">
        <Transition
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            class="shadow-soft-xl w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle text-slate-700 transition-all lg:max-w-xl"
            use:dialog.modal
          >
            <h3 class="mb-2 text-lg font-medium leading-6 tracking-tighter text-slate-900">Approachability Helpers</h3>
            <div class="mt-4">
              <div class="mt-4 space-y-4 rounded-lg bg-gray-50 p-4 text-sm">
                <div class="flex items-start gap-2 p-2 text-slate-700">
                  These indicators are based solely on a foundation's latest tax filings. They help grantseekers quickly assess a
                  foundation's approachability.
                </div>
                <div class="grid grid-cols-1 gap-4">
                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <div class="flex h-6 w-6 items-center justify-center rounded bg-yellow-500">
                        <LockClosed class="h-4 w-4 text-white" variation={'solid'} />
                      </div>
                      <span class="text-base font-medium">"Preselected Only" Checkbox</span>
                      <span class="block text-xs text-gray-500">(71% of foundations check this box)</span>
                    </div>
                    <p class="pl-8 text-sm text-gray-600">
                      If checked, the foundation indicated it "only makes contributions to preselected charitable organizations and doesn't
                      accept unsolicited applications for funds". Green is good - the box was NOT checked.
                    </p>
                  </div>

                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <div class="flex h-6 w-6 items-center justify-center rounded bg-green-500">
                        <UserGroup class="h-4 w-4 text-white" variation={'solid'} />
                      </div>
                      <span class="text-base font-medium">Staffing Level</span>
                      <span class="block text-xs text-gray-500">(7% of foundations are likely staffed)</span>
                    </div>
                    <p class="pl-8 text-sm text-gray-600">
                      Based on annual compensation and avg weekly hours as reported in their latest tax filing. Green suggests dedicated
                      staff, while yellow indicates limited paid staffing.
                    </p>
                  </div>

                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <div class="flex h-6 w-6 items-center justify-center rounded bg-green-500">
                        <GlobeAlt class="h-4 w-4 text-white" variation={'solid'} />
                      </div>
                      <span class="text-base font-medium">Website Presence</span>
                      <span class="text-xs text-gray-500">(15% of foundations list a website)</span>
                    </div>
                    <p class="pl-8 text-sm text-gray-600">
                      Indicates whether the foundation listed a public website in their latest tax return.
                    </p>
                  </div>

                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <div class="flex h-6 w-6 items-center justify-center rounded bg-green-500">
                        <CurrencyDollar class="h-4 w-4 text-white" variation={'solid'} />
                      </div>
                      <span class="text-base font-medium">Grant Activity</span>
                      <span class="text-xs text-gray-500">(74% of foundations show recent activity)</span>
                    </div>
                    <p class="pl-8 text-sm text-gray-600">
                      Green indicates grant activity in recent filings. Yellow suggests inactive or irregular grantmaking or direct
                      charitable activities other than grantmaking.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <button
                type="button"
                class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onclick={dialog.close}
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</div>
