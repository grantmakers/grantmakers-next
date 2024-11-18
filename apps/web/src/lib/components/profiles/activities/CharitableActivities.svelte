<script lang="ts">
  import Eyes from '$lib/components/shared/icons/Eyes.svelte';
  import { formatToCurrency } from '@repo/shared/functions/formatters/numbers';
  import type { GrantmakersExtractedDataObj } from '@shared/typings/grantmakers/all';
  import { ExclamationCircle } from 'svelte-heros-v2';

  interface Props {
    activities: GrantmakersExtractedDataObj['charitable_activities'] | [];
    areRestatement: boolean;
  }

  let { activities, areRestatement }: Props = $props();
</script>

<div>
  <div class="sm:flex sm:items-center">
    <div class="w-1/2 sm:flex-auto">
      <!-- Source: IRS core dataset via Grantmakers ETL -->
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <div class="mt-2 px-3 text-sm text-gray-700">Summary of Direct Charitable Activities</div>
    </div>
  </div>
  <div class="mt-8 flow-root">
    <div class="-my-2 overflow-x-auto sm:-mx-6">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:mb-4 lg:px-8">
        {#if areRestatement}
          The listed Charitable Activities may be a restatement of their grants <Eyes />
        {/if}
        <table class="min-w-full table-auto divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Expenses</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            {#if activities}
              {#each activities as activity}
                <tr class="relative even:bg-gray-50">
                  <td class="px-3 py-4 text-sm">{typeof activity?.expenses === 'number' ? formatToCurrency(activity.expenses) : 'N/A'}</td>
                  <td class="px-3 py-4 text-sm">{activity?.description ? activity.description : 'N/A'}</td>
                </tr>
              {/each}
            {:else}
              <tr>
                <td colspan="2" class="flex items-center gap-2 px-3 py-4 text-sm">
                  <ExclamationCircle variation="solid" />
                  No activities available for this foundation
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
