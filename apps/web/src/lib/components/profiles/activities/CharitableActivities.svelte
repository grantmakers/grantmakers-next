<script lang="ts">
  import Eyes from '$lib/components/shared/icons/Eyes.svelte';
  import { formatToCurrency } from '@repo/shared/functions/formatters/numbers';
  import { irsLinks } from '@repo/shared/constants/trustedConstants';
  import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
  import ExclamationCircle from 'svelte-heros-v2/ExclamationCircle.svelte';

  interface Props {
    activities: GrantmakersExtractedDataObj['charitable_activities'] | [];
    areRestatement: boolean;
    totalGiving?: number;
  }

  let { activities, areRestatement, totalGiving }: Props = $props();

  let sortedActivities = $derived(activities ? [...activities].sort((a, b) => (b.expenses ?? 0) - (a.expenses ?? 0)) : []);
  let totalActivitiesExpenses = $derived(activities ? activities.reduce((sum, a) => sum + (a.expenses ?? 0), 0) : 0);
  let combinedTotal = $derived((totalGiving ?? 0) + totalActivitiesExpenses);
  let grantsPct = $derived(combinedTotal > 0 ? Math.round(((totalGiving ?? 0) / combinedTotal) * 100) : 0);
  let activitiesPct = $derived(combinedTotal > 0 ? Math.round((totalActivitiesExpenses / combinedTotal) * 100) : 0);
</script>

<div class="mx-auto max-w-7xl px-4 pt-8 pb-2 text-sm text-slate-700 sm:px-6 lg:px-8">
  <div class="flex gap-8">
    <div class="grow">
      <div class="flex h-full items-center rounded-lg bg-white p-4 shadow-sm">
        <a
          class="mr-2 flex items-center font-semibold hover:underline"
          target="_blank"
          rel="external noopener"
          href={irsLinks?.instructions?.charitableActivities}>IRS Instructions:</a
        > "List the foundation's four largest programs...that consist of the direct active conduct of charitable activities."
      </div>
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
              {#each sortedActivities as activity}
                <tr class="relative">
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
          {#if activities && activities.length > 0}
            <tfoot class="border-t border-t-gray-300 bg-gray-50">
              <tr>
                <td class="px-3 py-4 text-right text-sm font-semibold">
                  {formatToCurrency(totalActivitiesExpenses)}
                </td>
                <td class="flex justify-between px-3 py-4 text-sm font-semibold">
                  <div class="Total Direct Charitable Activities">Total Direct Charitable Activities</div>
                  {#if totalGiving && totalGiving > 0}
                    <div class="font-normal text-slate-500">
                      Philanthropy Breakdown: Charitable Activities ({activitiesPct}%) vs Current Grantmaking ({grantsPct}%)
                    </div>
                  {/if}
                </td>
              </tr>
            </tfoot>
          {/if}
        </table>
      </div>
    </div>
  </div>
</div>
