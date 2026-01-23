<script lang="ts">
  import GrantRow from './GrantRow.svelte';
  import type { GrantsArray, GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
  import { humanizeNumber } from '@repo/shared/functions/formatters/numbers';
  import Tip from '../alerts/Tip.svelte';
  interface Props {
    grantsLastThreeYears?: GrantsArray;
    grantsCurrent?: GrantsArray;
    grantCount: GrantmakersExtractedDataObj['grant_count'];
    grantCountLastThreeYears: GrantmakersExtractedDataObj['grant_count_all_years'];
    grantsReferenceAttachment: GrantmakersExtractedDataObj['grants_reference_attachment'];
  }

  type ViewMode = 'last-three-years' | 'latest';

  /**
   * Svelte can't infer props when using let props = $props(), aka non-destructured.
   * This matters only for custom elements/web components, which we do not use.
   * It's safe to ignore the warning
   */
  // eslint-disable-next-line svelte/valid-compile
  let props: Props = $props();
  // Derived values for safer access
  let grantsLastThreeYears = $derived(props.grantsLastThreeYears);
  let grantsCurrent = $derived(props.grantsCurrent);
  let grantCount = $derived(props.grantCount);
  let grantCountLastThreeYears = $derived(props.grantCountLastThreeYears);
  let grantsReferenceAttachment = $derived(props.grantsReferenceAttachment ?? false);

  const numberOfGrantsToDisplay = 10;

  function determineInitialViewMode(
    grantCount: GrantmakersExtractedDataObj['grant_count'],
    grantCountLastThreeYears: GrantmakersExtractedDataObj['grant_count_last_three_years'],
  ): ViewMode {
    if (!grantCount) return 'last-three-years';
    if (!grantCountLastThreeYears) return 'latest';
    return grantCount >= 3 ? 'latest' : 'last-three-years';
  }

  let viewMode = $state<ViewMode>(determineInitialViewMode(props.grantCount, props.grantCountLastThreeYears));
  let grants = $derived(viewMode === 'last-three-years' ? grantsLastThreeYears : grantsCurrent);

  // $inspect('View Mode', viewMode);
  // $inspect('Grants', grants);
</script>

<div>
  {#if grantCountLastThreeYears > 0}
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex flex-wrap justify-center gap-8 lg:flex-nowrap">
        <div class="grow">
          <div class="flex h-full items-center rounded-lg bg-white p-4 shadow-sm">
            <div class="text-sm text-slate-700">
              {#if viewMode === 'last-three-years'}
                {#if grantCountLastThreeYears < numberOfGrantsToDisplay}
                  Showing all <span class="font-bold">{grantCountLastThreeYears} grants</span> made across the
                  <span class="font-bold">last three years</span>
                {:else}
                  Showing the largest <span class="font-bold">{numberOfGrantsToDisplay} grants</span> from
                  <span class="font-bold">{grantCountLastThreeYears ? humanizeNumber(grantCountLastThreeYears) : 'N/A'} grants</span> made
                  across the
                  <span class="font-bold">last three years</span>
                {/if}
              {:else if grantCount === 0}
                No grants listed in the latest available tax filing
              {:else if grantCount < numberOfGrantsToDisplay}
                Showing all <span class="font-bold">{grantCount ? grantCount : 'N/A'} grants</span> made in the
                <span class="font-bold">most recent year</span>
              {:else}
                Showing the largest <span class="font-bold">{numberOfGrantsToDisplay} grants</span> from
                <span class="font-bold">{grantCount ? humanizeNumber(grantCount) : 'N/A'} grants</span> made in the
                <span class="font-bold">most recent year</span>
              {/if}
            </div>
          </div>
        </div>
        <aside class="flex w-64">
          <div class="flex grow items-center justify-center rounded-lg bg-white p-2 shadow-sm">
            <div class="inline-flex p-1 hover:cursor-default">
              {#if grantsCurrent}
                <button
                  onclick={() => (viewMode = 'latest')}
                  class="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium {viewMode === 'latest' ?
                    'bg-slate-200 text-slate-700 hover:cursor-default'
                  : 'text-slate-700 hover:text-slate-900'}"
                >
                  Latest Filing
                </button>
              {/if}
              <button
                onclick={() => (viewMode = 'last-three-years')}
                class="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium {viewMode === 'last-three-years' ?
                  'bg-slate-200 text-slate-700 hover:cursor-default'
                : 'text-slate-700 hover:text-slate-900'}"
              >
                Last 3 Years
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  {/if}

  <div class="flow-root">
    <div class="-my-2 overflow-x-auto sm:-mx-6">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:mb-4 lg:px-8">
        <div class="rounded-lg bg-white p-6">
          <table class="min-w-full table-auto divide-y divide-gray-300">
            {#if grants && grants.length > 0}
              <thead>
                <tr>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Grantee</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Purpose</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Year</th>
                </tr>
              </thead>
            {/if}
            <tbody class="divide-y divide-gray-200 bg-white">
              {#if grants && grants.length > 0}
                {#each grants.slice(0, numberOfGrantsToDisplay) as grant}
                  <GrantRow {grant} />
                {/each}
              {:else}
                <tr>
                  <td colspan="5" class="px-3 py-4 text-sm"> No grants listed on Form 990-PF </td>
                </tr>
              {/if}
            </tbody>
          </table>
          {#if grantsReferenceAttachment && grantCount === 1}
            <div class="mx-auto mt-4 flex">
              <Tip
                title="Grants reference an attachment"
                message="The use of attachments and statements to provide grant details is a holdover from before foundation tax returns were filed electronically. Unfortunately, these attachments are often not available. "
                includeLogo
              />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
