<script lang="ts">
  import '@tailwindplus/elements';
  import ApproachabilityInfoItem from './ApproachabilityInfoItem.svelte';

  interface Props {
    noUnsolicited: true | null;
    isStaffed: boolean;
    hasRecentGrants: boolean;
  }

  let { noUnsolicited, isStaffed, hasRecentGrants }: Props = $props();

  const DIALOG_ID = 'approachability-dialog';

  const DOT_COLORS = { positive: 'bg-emerald-500', caution: 'bg-amber-500' };
  const BADGE_CLASSES =
    'inline-flex cursor-help items-center gap-1.5 rounded bg-transparent px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100';
</script>

{#snippet badge(isPositive: boolean, positiveLabel: string, negativeLabel: string, title: string)}
  <button type="button" class={BADGE_CLASSES} {title} command="show-modal" commandfor={DIALOG_ID}>
    <span class="size-1.5 shrink-0 rounded-full {isPositive ? DOT_COLORS.positive : DOT_COLORS.caution}"></span>
    {isPositive ? positiveLabel : negativeLabel}
  </button>
{/snippet}

<!-- Badges + About trigger -->
<!-- Note: All Badges are triggers as well - see badge #snippet -->
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
    'Limited staffing',
    isStaffed ? 'Likely has dedicated staff based on compensation data' : 'Limited or no paid staffing based on compensation data',
  )}

  {@render badge(
    hasRecentGrants,
    'Recent grants',
    'No recent grants',
    hasRecentGrants ? 'Grant activity found in recent tax filings' : 'No grant activity found in recent tax filings',
  )}
</div>

<!-- Modal -->
<el-dialog>
  <dialog id={DIALOG_ID} class="m-0 p-0 backdrop:bg-transparent">
    <el-dialog-backdrop
      class="fixed inset-0 bg-black/25 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
    ></el-dialog-backdrop>

    <div class="fixed inset-0 overflow-y-auto p-4">
      <div class="flex min-h-full items-center justify-center text-center">
        <el-dialog-panel
          class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle text-slate-700 shadow-xl transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in lg:max-w-xl"
        >
          <h3 class="mb-2 text-lg leading-6 font-medium tracking-tight text-slate-900">Approachability Indicators</h3>
          <div class="mt-4">
            <div class="space-y-4 rounded-lg bg-gray-50 p-4 text-sm">
              <p class="text-slate-600">
                These indicators are based solely on a foundation's latest tax filings. They help grantseekers quickly assess a foundation's
                approachability.
              </p>

              <div class="mt-4 space-y-6">
                <ApproachabilityInfoItem
                  isPositive={!noUnsolicited}
                  positiveLabel="Possibly open to applications"
                  negativeLabel="Preselected only"
                  description={!noUnsolicited ?
                    'The "Preselected Only" checkbox was NOT checked.'
                  : 'The "Preselected Only" checkbox was checked.'}
                  explanation={'If checked, the foundation indicated it "only makes contributions to preselected charitable organizations and doesn\'t accept unsolicited applications for funds".'}
                  stat={'71% of foundations check "preselected only"'}
                />

                <ApproachabilityInfoItem
                  isPositive={isStaffed}
                  positiveLabel="Likely staffed"
                  negativeLabel="Limited staffing"
                  description={isStaffed ?
                    'Based on reported board members and key employees, this foundation likely has dedicated paid staff.'
                  : 'Based on reported board members and key employees, this foundation likely has limited or no paid staffing.'}
                  explanation={'Tax filings include data on annual compensation and avg weekly hours. Green suggests dedicated staff, while yellow indicates limited paid staffing.'}
                  stat={'Only 7% of foundations are likely staffed'}
                />

                <ApproachabilityInfoItem
                  isPositive={hasRecentGrants}
                  positiveLabel="Recent grants"
                  negativeLabel="No recent grants"
                  description={hasRecentGrants ? 'Grant activity found in recent filings.' : 'No grant activity found in recent filings.'}
                  explanation={'Green indicates grant activity in recent filings. Yellow suggests inactive or irregular grantmaking or direct charitable activities other than grantmaking.'}
                  stat={'74% of foundations show recent grantmaking activity'}
                />
              </div>
            </div>
          </div>

          <div class="mt-4">
            <button
              type="button"
              class="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              command="close"
              commandfor={DIALOG_ID}
            >
              Got it, thanks!
            </button>
          </div>
        </el-dialog-panel>
      </div>
    </div>
  </dialog>
</el-dialog>
