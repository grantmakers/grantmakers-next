<script lang="ts">
  import GrantRow from './GrantRow.svelte';
  import DOMPurify from 'isomorphic-dompurify';
  import { ExclamationCircle } from 'svelte-heros-v2';
  import type { GrantsArray } from '@shared/typings/grantmakers/grants';
  export let grants: GrantsArray | null = null;

  const sanitize = DOMPurify.sanitize;

  const grantSummary = `TODO Add grant summary info`;
</script>

<div>
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-base font-semibold leading-6 text-gray-900">Grants</h1>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <div class="mt-2 px-3 text-sm text-gray-700">{@html sanitize(grantSummary)}</div>
    </div>
  </div>
  <div class="mt-8 flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
              {#each grants as grant}
                <GrantRow {grant} />
              {/each}
            {:else}
              <tr>
                <td colspan="5" class="px-3 py-4 text-sm flex items-center gap-2">
                  <ExclamationCircle variation="solid" />
                  No grants available for this foundation
                </td>
              </tr>
            {/if}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" class="mt-2 max-w-sm text-sm text-gray-700">
                <p class="mt-8 mb-4 text-justify">Grants to be paid out in the future are not included.</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</div>
