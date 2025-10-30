<script lang="ts">
  import { onMount } from 'svelte';
  import { beforeNavigate } from '$app/navigation';
  import 'instantsearch.css/themes/reset.css';
  import '@tailwindplus/elements';
  import { searchClient, INDEX_NAME as indexName, PLACEHOLDER_HITS_COUNT as placeholderHitsPerPage } from './config/algolia';
  import instantsearch, { type InstantSearch } from 'instantsearch.js';
  import { searchBox, hits, poweredBy, configure } from 'instantsearch.js/es/widgets';
  import placeholderHits from '@repo/shared/data/public/autocomplete-static-data.json';
  import { normalizeCurrencyToMillions } from '@repo/shared/functions/formatters/numbers';
  import { formatEin } from '@repo/shared/functions/formatters/ein';
  import { badgeStyles } from '$src/lib/utils/badgeStyles';
  import {
    searchBoxModalStyles,
    hitsStyles,
    poweredByStyles,
    highlightStyles,
  } from '$src/lib/components/search/config/instantsearch-styles';

  interface Props {
    profilesVersion: string;
  }

  type PlaceholderHit = (typeof placeholderHits)[number];

  let { profilesVersion }: Props = $props();

  let searchInstance: InstantSearch | null = null;
  let searchInputRef: HTMLElement | null = $state(null);
  let dialogElement: HTMLDialogElement | null = null;

  // Close the modal when navigation occurs (e.g., clicking a search result link)
  beforeNavigate(() => {
    dialogElement?.close();
  });

  const getLabel = (pct: number | 'N/A') => {
    if (pct === 'N/A') return 'N/A';
    if (pct >= 99) return 'Top 1%';
    if (pct >= 90) return 'Top 10%';
    if (pct >= 75) return 'Top 25%';
    if (pct >= 50) return 'Top 50%';
    if (pct < 50) return '<50%';
    return `Top ${(100 - pct).toFixed(0)}%`;
  };

  let getColorClasses = (pct: number | 'N/A') => {
    if (pct === 'N/A') return badgeStyles.default;
    if (pct >= 99) return badgeStyles.success;
    if (pct >= 90) return badgeStyles.success;
    if (pct >= 75) return badgeStyles.info;
    if (pct >= 50) return badgeStyles.indigo;
    return badgeStyles.default;
  };

  onMount(() => {
    // Initialize InstantSearch
    searchInstance = instantsearch({
      indexName,
      searchClient,
      routing: false,
      future: {
        preserveSharedStateOnUnmount: true,
      },
      initialUiState: {
        [indexName]: {
          query: '',
        },
      },
    });

    // Add widgets
    searchInstance.addWidgets([
      configure({
        /* @ts-expect-error Assumes PlainSearchParameters only, which is a narrow subset of all available search parameters*/
        hitsPerPage: placeholderHitsPerPage,
      }),

      searchBox({
        container: '#searchbox-profiles-compact',
        placeholder: 'Search by Foundation Name or EIN...',
        autofocus: false,
        cssClasses: searchBoxModalStyles,
      }),

      hits({
        container: '#hits-profiles-compact',
        cssClasses: hitsStyles,
        templates: {
          item: (item: PlaceholderHit, { html, components }) => {
            const url = `/profiles/${profilesVersion}/${item.ein}-${item.organization_name_slug}`;
            const percentile: number | 'N/A' = item.rank !== undefined ? ((item.rank_total - item.rank) / item.rank_total) * 100 : 'N/A';

            return html`<a href="${url}">
              <div
                class="block cursor-pointer rounded-lg rounded-lg !border-b border-slate-100 px-4 py-3 transition-colors duration-150 last:border-0 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="w-full min-w-0 ">
                    <div class="flex items-start justify-between gap-x-3">
                      <div class="text-base font-semibold text-gray-900">
                        ${
                          /* @ts-expect-error - Placeholder hits is missing required "__position" field, but works fine with normal results */
                          components.Highlight({ attribute: 'organization_name', hit: item, cssClasses: highlightStyles })
                        }
                      </div>
                      <p
                        class="${getColorClasses(
                          percentile,
                        )} mt-0.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset"
                      >
                        ${getLabel(percentile)}
                      </p>
                    </div>
                    <div class="mt-1.5 flex w-full items-center justify-between gap-x-3 text-xs leading-normal text-gray-500">
                      <div class="flex items-center gap-x-2">
                        <p class="whitespace-nowrap">${item.city}, ${item.state}</p>
                        <svg viewBox="0 0 2 2" class="size-0.5 fill-current">
                          <circle cx="1" cy="1" r="1" />
                        </svg>
                        <p class="truncate">${formatEin(item.ein)}</p>
                      </div>
                      <div class="tabular-nums">${normalizeCurrencyToMillions(item.assets)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </a>`;
          },
          empty: (results, { html }) => html`
            <div class="px-6 py-14 text-center text-sm sm:px-14">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
                class="mx-auto size-6 text-gray-400 dark:text-gray-500"
              >
                <path
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p class="mt-4 font-semibold text-gray-900 dark:text-white">No foundations found</p>
              <p class="mt-2 text-gray-500 dark:text-gray-400">
                We couldn't find any foundations matching "${results.query}". Please try again.
              </p>
            </div>
          `,
        },
      }),

      poweredBy({
        container: '#powered-by-profiles-compact',
        cssClasses: poweredByStyles,
      }),
    ]);

    // Start InstantSearch
    searchInstance.start();

    return () => {
      if (searchInstance) {
        searchInstance.dispose();
      }
    };
  });
</script>

<!-- Modal Dialog -->
<el-dialog>
  <dialog
    bind:this={dialogElement}
    id="search-dialog-profiles-compact"
    class="m-0 p-0 backdrop:bg-gray-500/25 backdrop:backdrop-blur-sm dark:backdrop:bg-gray-900/50"
  >
    <el-dialog-backdrop
      class="fixed inset-0 bg-gray-500/25 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
    ></el-dialog-backdrop>

    <div class="fixed inset-0 w-screen overflow-y-auto p-4 focus:outline focus:outline-0 sm:p-6 md:p-20">
      <el-dialog-panel
        class="mx-auto block max-w-3xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:bg-gray-900 dark:ring-white/10"
      >
        <!-- Search Box Header -->
        <div class="divide-y divide-gray-100 dark:divide-white/10">
          <div class="grid grid-cols-1">
            <div
              id="searchbox-profiles-compact"
              bind:this={searchInputRef}
              class="relative col-start-1 row-start-1 h-12 w-full pl-11 pr-4 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              >
                <path
                  d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Main Body -->
          <div class="flex transform-gpu divide-x divide-gray-100 dark:divide-white/10">
            <!-- Sidebar Filters -->
            <!-- <div class="hidden max-h-96 w-64 min-w-0 flex-none scroll-py-4 overflow-y-auto px-6 py-4 sm:block">
              <div id="clear-filters"></div>

              <h2 class="mx-2 mb-4 mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">FILTERS</h2>

              <div class="mb-6">
                <h3 class="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">STATE</h3>
                <div id="state-list"></div>
              </div>
            </div> -->

            <!-- Results Area -->
            <div class="min-w-0 flex-auto scroll-py-4 overflow-y-auto">
              <!-- Headers -->
              <!-- Ask AI Example -->
              <!-- <div class="flex items-center justify-start border-y border-b-gray-100 border-t-gray-100 bg-gray-50 px-4 py-2">
                <div class="pr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-7 w-5 flex-none text-indigo-400">
                    <path
                      fill-rule="evenodd"
                      d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                      clip-path="evenodd"
                    ></path>
                  </svg>
                </div>
                <div class="text-xs font-semibold uppercase text-gray-500">Ask AI</div>
              </div> -->

              <!-- Search Tips -->
              <!-- <div class="flex items-center justify-end border-y border-b-gray-100 border-t-gray-100 bg-gray-50 px-4 py-2">
                <div class="text-xs font-semibold uppercase text-gray-500">Search Tips</div>
                <div class="pl-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-gray-400">
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div> -->

              <!-- Search CTA Example -->
              <!-- <div class="flex items-center justify-start border-y border-b-gray-100 border-t-gray-100 bg-gray-50 px-4 py-2">
              <div class="text-xs font-semibold text-gray-500">👋 Full searchable access to the entire 990-PF dataset. No gimmicks.</div>
            </div> -->

              <!-- Subtitle example -->
              <!-- <h2 class="mb-2 mt-4 flex items-center justify-start px-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
              Quick Search
            </h2> -->

              <!-- Subtitle example 2 -->
              <!-- <div class="flex items-center justify-between border-y border-b-gray-200 border-t-gray-100 bg-gray-50 px-4 py-2">
              <div class="py-2 text-xs font-semibold uppercase text-gray-500">Foundation Profiles</div>
              <div class="py-2 text-xs font-semibold uppercase text-gray-500">Assets</div>
            </div> -->

              <!-- Subtitle example 3 -->
              <!-- <div class="flex items-center justify-start border-y border-b-gray-100 border-t-gray-100 bg-gray-50 px-4 py-2">
              <div class="text-xs font-semibold uppercase text-gray-500">Quick Search</div>
            </div> -->
              <div id="hits-profiles-compact" class="px-4" data-sveltekit-preload-data="tap"></div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-4 py-4 text-sm text-gray-900 dark:text-gray-400">
            <div id="powered-by-profiles-compact"></div>

            <div class="flex items-center space-x-4">
              <span class="flex items-center">
                <a class="hover:text-grey-500 dark:hover:text-grey-200 flex items-center gap-2" href="/search/profiles/">
                  <div class="font-semibold">Search by board members, location and more</div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                    <path
                      fill-rule="evenodd"
                      d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </span>
            </div>
          </div>
        </div>
      </el-dialog-panel>
    </div>
  </dialog>
</el-dialog>

<style lang="postcss">
  /* Override InstantSearch's default transparent background for input */
  :global(#search-dialog-profiles-compact .ais-SearchBox-input) {
    background-color: transparent;
    @apply pl-1;
  }

  /* Remove default focus styles - Tailwind classes handle this */
  :global(#search-dialog-profiles-compact .ais-SearchBox-input:focus) {
    --tw-ring-color: transparent;
    --tw-ring-offset-color: transparent;
    box-shadow:
      0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color),
      var(--tw-ring-shadow);
  }
</style>
