<script lang="ts">
  import grants from '@repo/shared/data/private/grants/112676434.json';
  import { humanizeCurrency } from '@repo/shared/functions/formatters/numbers';
  import VirtualList from '$lib/components/shared/VirtualList.svelte';

  let start = $state();
  let end = $state();
</script>

<div class="px-4 sm:px-6 lg:px-8">
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-base font-semibold text-gray-900">Users</h1>
      <p class="mt-2 text-sm text-gray-700">A list of all the users in your account including their name, title, email and role.</p>
    </div>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <button
        type="button"
        class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >Add user</button
      >
    </div>
  </div>
  <div class="mt-8 flow-root">
    <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle">
        <table class="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th
                scope="col"
                class="sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                >Recipient</th
              >
              <th
                scope="col"
                class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                >Location</th
              >
              <th
                scope="col"
                class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                >Purpose</th
              >
              <th
                scope="col"
                class="sticky top-0 z-10 border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                >Amount</th
              >
              <th
                scope="col"
                class="sticky top-0 z-10 border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                >Year</th
              >
            </tr>
          </thead>
          <tbody>
            {#if grants}
              <VirtualList {grants} bind:start bind:end>
                {#snippet children({ grant })}
                  <tr>
                    <td class="whitespace-nowrap border-b border-gray-200 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                      >{grant.name}</td
                    >
                    <td class="hidden whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500 sm:table-cell"
                      >{grant.city}, {grant.state}</td
                    >
                    <td class="hidden whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500 lg:table-cell"
                      >{grant.purpose}</td
                    >
                    <td class="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500"
                      >{humanizeCurrency(grant.amount)}</td
                    >
                    <td class="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500">{grant.tax_year}</td>
                  </tr>
                {/snippet}
              </VirtualList>
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
