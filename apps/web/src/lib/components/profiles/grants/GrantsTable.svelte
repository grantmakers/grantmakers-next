<script lang="ts">
  import GrantRow from './GrantRow.svelte';
  import { ExclamationCircle } from 'svelte-heros-v2';
  import type { GrantsArray } from '@shared/typings/grantmakers/all';
  import { humanizeNumber } from '@shared/functions/formatters/numbers';
  interface Props {
    grants?: GrantsArray | null;
    grantCount?: number | null;
    filingsAvailable?: number | null;
  }

  let { grants = null, grantCount = null, filingsAvailable = null }: Props = $props();

  const showGrantsCount = 5;
  const grantSummary = `Showing the largest <span class="font-bold">${humanizeNumber(showGrantsCount)} grants</span> from <span class="font-bold">${grantCount ? humanizeNumber(grantCount) : 'N/A'} grants</span> made across <span class="font-bold">${filingsAvailable} years</span> of available tax filings.`;
</script>

<div>
  <div class="sm:flex sm:items-center">
    <div class="w-1/2 sm:flex-auto">
      <!-- Source: IRS core dataset via Grantmakers ETL -->
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <div class="mt-2 px-3 text-sm text-gray-700">{@html grantSummary}</div>
    </div>
  </div>
  <div class="mt-8 flow-root">
    <div class="-my-2 overflow-x-auto sm:-mx-6">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table class="min-w-full table-auto divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Grantee</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Purpose</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Year</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            {#if grants}
              {#each grants.slice(0, showGrantsCount) as grant}
                <GrantRow {grant} />
              {/each}
            {:else}
              <tr>
                <td colspan="5" class="flex items-center gap-2 px-3 py-4 text-sm">
                  <ExclamationCircle variation="solid" />
                  No grants available for this foundation
                </td>
              </tr>
            {/if}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" class="mt-2 max-w-sm text-sm text-gray-700">
                <p class="mb-4 mt-8 p-2 text-justify">Grants to be paid out in the future are not included.</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</div>
