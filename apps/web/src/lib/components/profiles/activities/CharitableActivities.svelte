<script lang="ts">
  import Eyes from '$lib/components/shared/icons/Eyes.svelte';
  import { formatToCurrency } from '@repo/shared/functions/formatters/numbers';
  import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
  import { ExclamationCircle } from 'svelte-heros-v2';

  interface Props {
    activities: GrantmakersExtractedDataObj['charitable_activities'] | [];
    areRestatement: boolean;
  }

  let { activities, areRestatement }: Props = $props();
</script>

<div class="mx-auto max-w-7xl px-4 pb-2 pt-8 text-sm text-slate-700 sm:px-6 lg:px-8">
  <div class="flex gap-8">
    <div class="grow">
      <div class="flex h-full items-center rounded-lg bg-white p-4 shadow">Summary of Direct Charitable Activities</div>
    </div>
    <!-- <aside class="hidden w-64 md:flex md:items-stretch">
      <div class="flex grow items-center justify-center rounded-lg bg-white p-2 shadow">
        <div class="inline-flex p-1 text-center hover:cursor-default">Learn more about Direct Charitable Activities</div>
      </div>
    </aside> -->
  </div>
</div>

<div class="flow-root">
  <div class="-my-2 overflow-x-auto sm:-mx-6">
    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:mb-4 lg:px-8">
      {#if areRestatement}
        The listed Charitable Activities may be a restatement of their grants <Eyes />
      {/if}
      <div class="rounded-lg bg-white p-6">
        <table class="min-w-full table-fixed">
          <colgroup>
            <col style="width: 100px" />
            <col style="width: calc(100% - 100px)" />
          </colgroup>
          <thead class="border-b border-b-gray-300">
            <tr>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Expenses</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            {#if activities}
              {#each activities as activity}
                <tr class="relative even:bg-gray-50">
                  <td class="px-3 py-4 text-right text-sm"
                    >{typeof activity?.expenses === 'number' ? formatToCurrency(activity.expenses) : 'N/A'}</td
                  >
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
