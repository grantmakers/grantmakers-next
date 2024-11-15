<script lang="ts">
  import GrantRow from './GrantRow.svelte';
  import { ExclamationCircle } from 'svelte-heros-v2';
  import type { GrantsArray } from '@shared/typings/grantmakers/all';
  import { humanizeNumber } from '@shared/functions/formatters/numbers';
  import Tip from '../alerts/Tip.svelte';
  interface Props {
    grants?: GrantsArray | null;
    grantCount?: number | null;
    grantCountAllYears?: number | null;
    filingsAvailable?: number | null;
    grantsReferenceAttachment: boolean;
  }

  let {
    grants = null,
    grantCount = null,
    grantCountAllYears = null,
    filingsAvailable = null,
    grantsReferenceAttachment = false,
  }: Props = $props();

  const numberOfGrantsToDisplay = 5;
</script>

<div>
  {#if grantCountAllYears && grantCountAllYears > 1}
    <div class="sm:flex sm:items-center">
      <div class="flex w-full flex-row items-center justify-between">
        <div class="mt-2 px-3 text-sm text-gray-700">
          {#if grantCountAllYears <= 5}
            Showing all {grantCountAllYears} grants listed in <span class="font-bold">{filingsAvailable} years</span> of available tax filings.
          {:else}
            Showing the largest <span class="font-bold">{humanizeNumber(numberOfGrantsToDisplay)} grants</span> from
            <span class="font-bold">{grantCountAllYears ? humanizeNumber(grantCountAllYears) : 'N/A'} grants</span>
            made across <span class="font-bold">{filingsAvailable} years</span> of available tax filings.
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <div class="{grantCountAllYears && grantCountAllYears > 1 ? 'mt-8 ' : 'mt-4 '}flow-root">
    <div class="-my-2 overflow-x-auto sm:-mx-6">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:mb-4 lg:px-8">
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
                  No grants {grantCount === 0 ? 'listed' : 'available'} for this foundation
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
        {#if grantsReferenceAttachment && grantCount === 1}
          <div class="mt-4 flex w-1/2 justify-center">
            <Tip
              title="Grants reference an attachment"
              message="The use of attachments and statements to provide grant details is a holdover from before foundation tax returns were filed electronically. Though unlikely, further grant details may be available in the tax filing itself. "
              includeLogo
            />
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
