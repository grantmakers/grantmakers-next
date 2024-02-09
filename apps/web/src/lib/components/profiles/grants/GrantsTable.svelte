<script lang="ts">
  import DOMPurify from 'dompurify';
  import type { GrantsArray } from '@shared/typings/grantmakers/grants';
  import { firstLetter } from '@utils/names';
  export let grants: GrantsArray;

  const { sanitize } = DOMPurify;
</script>

<!-- px-4 sm:px-6 lg:px-8 -->
<div>
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-base font-semibold leading-6 text-gray-900">Grants</h1>
      <p class="mt-2 max-w-sm text-sm text-gray-700">Grants to be paid out in the future are not included.</p>
    </div>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <!-- <button
        type="button"
        class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >Add user</button
      > -->
    </div>
  </div>
  <div class="mt-8 flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        {#if grants}
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Grantee</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Purpose</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Year</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              {#each grants as grant, i}
                <tr>
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div class="h-11 w-11 flex-shrink-0">
                        <span class="inline-flex">
                          <!-- <div class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-slate-700">
                            <div class="text-lg font-semibold">{i + 1}</div>
                          </div> -->

                          <img
                            class="h-11 w-11 rounded-full opacity-50"
                            src={`../../icons-letters/svg/${firstLetter(grant.name)}.svg`}
                            alt=""
                          />
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="font-medium text-gray-900">{grant.name}</div>
                        <div class="mt-1 text-indigo-700">
                          {#if i === 0 || i / 4 === 1}
                            <span
                              class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                              >New</span
                            >
                          {/if}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="flex items-center whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <!-- eslint-disable-next-line -->
                    <div class="mt-1 text-gray-500">{@html sanitize(grant.purpose)}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    {grant.city},
                    {grant.is_foreign && grant.state === 'Foreign' ? grant.country : grant.state}
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{grant.tax_year}</td>
                  <!-- <td class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <a href="/foo" class="text-indigo-600 hover:text-indigo-900">Edit<span class="sr-only">, {grant.name}</span></a>
                  </td> -->
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
    </div>
  </div>
</div>
