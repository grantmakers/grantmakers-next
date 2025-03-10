<script lang="ts">
  import GrantRow from './GrantRow.svelte';
  import { ExclamationCircle } from 'svelte-heros-v2';
  import type { GrantsArray, GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
  import { humanizeNumber } from '@repo/shared/functions/formatters/numbers';
  import Tip from '../alerts/Tip.svelte';
  interface Props {
    grantsAllYears?: GrantsArray | null;
    grantsCurrent?: GrantsArray | null;
    grantCount: GrantmakersExtractedDataObj['grant_count'];
    grantCountAllYears: GrantmakersExtractedDataObj['grant_count_all_years'];
    filingsAvailable?: number | null;
    grantsReferenceAttachment: GrantmakersExtractedDataObj['grants_reference_attachment'];
  }

  type ViewMode = 'all-time' | 'latest';

  let {
    grantsAllYears = null,
    grantsCurrent = null,
    grantCount,
    grantCountAllYears,
    filingsAvailable = null,
    grantsReferenceAttachment = false,
  }: Props = $props();

  const numberOfGrantsToDisplay = 10;

  function determineInitialViewMode(
    grantCount: GrantmakersExtractedDataObj['grant_count'],
    grantCountAllYears: GrantmakersExtractedDataObj['grant_count_all_years'],
  ): ViewMode {
    if (!grantCount) return 'all-time';
    if (!grantCountAllYears) return 'latest';
    return grantCount >= 3 ? 'latest' : 'all-time';
  }

  let viewMode = $state<ViewMode>(determineInitialViewMode(grantCount, grantCountAllYears));
  let grants = $derived(viewMode === 'all-time' ? grantsAllYears : grantsCurrent);
</script>

<div>
  {#if grantCountAllYears > 0}
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="flex flex-wrap justify-center gap-8 lg:flex-nowrap">
        <div class="grow">
          <div class="flex h-full items-center rounded-lg bg-white p-4 shadow">
            <div class="text-sm text-slate-700">
              {#if viewMode === 'all-time'}
                {#if grantCountAllYears < numberOfGrantsToDisplay}
                  Showing all <span class="font-bold">{grantCountAllYears} grants</span> made across
                  <span class="font-bold">{filingsAvailable} years</span>
                {:else}
                  Showing the largest <span class="font-bold">{numberOfGrantsToDisplay} grants</span> from
                  <span class="font-bold">{grantCountAllYears ? humanizeNumber(grantCountAllYears) : 'N/A'} grants</span> made across
                  <span class="font-bold">{filingsAvailable} years</span>
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
          <div class="flex grow items-center justify-center rounded-lg bg-white p-2 shadow">
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
                onclick={() => (viewMode = 'all-time')}
                class="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium {viewMode === 'all-time' ?
                  'bg-slate-200 text-slate-700 hover:cursor-default'
                : 'text-slate-700 hover:text-slate-900'}"
              >
                All Time
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
                  <td colspan="5" class="flex items-center gap-2 px-3 py-4 text-sm">
                    <ExclamationCircle variation="solid" />
                    No grants {grantCount === 0 ? 'listed' : 'available for this foundation'}
                  </td>
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
