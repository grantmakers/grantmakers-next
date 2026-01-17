<script lang="ts">
  import { createDialog } from 'svelte-headlessui';
  import Transition from 'svelte-transition';
  import InformationCircle from 'svelte-heros-v2/InformationCircle.svelte';

  interface Props {
    noUnsolicited: true | null;
    isStaffed: boolean;
    hasRecentGrants: boolean;
  }

  let { noUnsolicited, isStaffed, hasRecentGrants }: Props = $props();

  const dialog = createDialog({ label: 'Approachability Indicators' });

  // Style constants
  const DOT_COLORS = { positive: 'bg-emerald-500', caution: 'bg-amber-500' };
  const BADGE_CLASSES =
    'inline-flex cursor-help items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100';
</script>

{#snippet badge(isPositive: boolean, positiveLabel: string, negativeLabel: string, title: string)}
  <span class={BADGE_CLASSES} {title}>
    <span class="size-1.5 shrink-0 rounded-full {isPositive ? DOT_COLORS.positive : DOT_COLORS.caution}"></span>
    {isPositive ? positiveLabel : negativeLabel}
  </span>
{/snippet}

{#snippet infoItem(isPositive: boolean, positiveLabel: string, negativeLabel: string, description: string, stat: string)}
  <div class="space-y-1">
    <div class="flex items-center gap-2">
      <span class="size-2 rounded-full {isPositive ? DOT_COLORS.positive : DOT_COLORS.caution}"></span>
      <span class="font-medium">{isPositive ? positiveLabel : negativeLabel}</span>
    </div>
    <p class="pl-4 text-slate-600">{description}</p>
    <p class="pl-4 text-xs text-slate-400 italic">{stat}</p>
  </div>
{/snippet}

<div class="flex flex-wrap items-center gap-2">
  {@render badge(
    !noUnsolicited,
    'Possibly open to applications',
    'Preselected only',
    !noUnsolicited ?
      'The "Preselected Only" checkbox was NOT checked on the tax filing'
    : 'The "Preselected Only" checkbox was checked on the tax filing',
  )}

  {@render badge(
    isStaffed,
    'Likely staffed',
    'Likely unstaffed',
    isStaffed ? 'Likely has dedicated staff based on compensation data' : 'Limited or no paid staffing based on compensation data',
  )}

  {@render badge(
    hasRecentGrants,
    'Recent grants',
    'No recent grants',
    hasRecentGrants ? 'Grant activity found in recent tax filings' : 'No grant activity found in recent tax filings',
  )}

  <button
    type="button"
    class="inline-flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-slate-700"
    onclick={dialog.open}
  >
    About
    <InformationCircle size="16" />
    <span class="sr-only">Learn about approachability indicators</span>
  </button>
</div>

<!-- Info Dialog -->
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
      <button class="fixed inset-0 bg-black/25" onclick={dialog.close} aria-label="Close"></button>
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
            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle text-slate-700 shadow-xl transition-all lg:max-w-xl"
            use:dialog.modal
          >
            <h3 class="mb-2 text-lg leading-6 font-medium tracking-tight text-slate-900">Approachability Indicators</h3>
            <div class="mt-4">
              <div class="space-y-4 rounded-lg bg-gray-50 p-4 text-sm">
                <p class="text-slate-600">
                  These indicators are based solely on a foundation's latest tax filings. They help grantseekers quickly assess a
                  foundation's approachability.
                </p>

                <div class="space-y-3">
                  {@render infoItem(
                    !noUnsolicited,
                    'Possibly open to applications',
                    'Preselected only',
                    !noUnsolicited ? 'The "Preselected Only" checkbox was NOT checked.' : 'The "Preselected Only" checkbox was checked.',
                    '71% of foundations check this box.',
                  )}

                  {@render infoItem(
                    isStaffed,
                    'Likely staffed',
                    'Limited staffing',
                    isStaffed ?
                      'Based on compensation data, this foundation likely has dedicated staff.'
                    : 'Based on compensation data, this foundation has limited or no paid staffing.',
                    'Only 7% of foundations are likely staffed.',
                  )}

                  {@render infoItem(
                    hasRecentGrants,
                    'Recent grants',
                    'No recent grants',
                    hasRecentGrants ? 'Grant activity found in recent filings.' : 'No grant activity found in recent filings.',
                    '74% of foundations show recent activity.',
                  )}
                </div>
              </div>
            </div>

            <div class="mt-4">
              <button
                type="button"
                class="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
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
