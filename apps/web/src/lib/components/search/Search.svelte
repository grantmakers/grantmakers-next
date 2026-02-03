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
  import { searchBoxModalStyles, hitsStyles, poweredByStyles, highlightStyles } from '$src/lib/components/search/config/searchStyles';
  import { searchResultsNavigation } from '$src/lib/actions/focusNavigation';
  import RateLimit from './RateLimit.svelte';
  import OriginForbidden from './OriginForbidden.svelte';

  interface Props {
    profilesVersion: string;
  }

  type PlaceholderHit = (typeof placeholderHits)[number];

  let { profilesVersion }: Props = $props();

  let searchInstance: InstantSearch | null = null;
  let searchInputRef: HTMLElement | null = $state(null);
  let algoliaInput: HTMLElement | null = $state(null); // Reference to the actual input injected by Algolia
  let dialogElement: HTMLDialogElement | null = null;
  let rateLimitReached = $state(false);
  let originForbidden = $state(false);

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
    if (pct < 50) return 'Smallest 50%';
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
        hitsPerPage: placeholderHitsPerPage,
      }),

      searchBox({
        container: '#searchbox-profiles-compact',
        placeholder: 'Search by Foundation Name or EIN...',
        autofocus: true,
        cssClasses: searchBoxModalStyles,
      }),

      hits({
        container: '#hits-profiles-compact',
        cssClasses: hitsStyles,
        templates: {
          item: (item: PlaceholderHit, { html, components }) => {
            const url = `/profiles/${profilesVersion}/${item.ein}-${item.organization_name_slug}`;
            const percentile: number | 'N/A' = item.rank !== undefined ? ((item.rank_total - item.rank) / item.rank_total) * 100 : 'N/A';

            return html`<a
              href="${url}"
              class="group relative block cursor-pointer rounded-lg border-b border-slate-100 px-4 py-3 transition-all duration-150 last:border-0 hover:bg-slate-50 focus:z-10 focus:bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden focus:ring-inset"
            >
              <div>
                <div class="flex items-center justify-between gap-3">
                  <div class="w-full min-w-0">
                    <div class="flex items-start justify-between gap-x-3">
                      <!-- Added group-focus:text-indigo-600 to highlight the title when selected -->
                      <div class="text-base font-semibold text-gray-900 group-focus:text-indigo-600">
                        ${
                          /* @ts-expect-error - Placeholder hits is missing required "__position" field */
                          components.Highlight({ attribute: 'organization_name', hit: item, cssClasses: highlightStyles })
                        }
                      </div>
                      <p
                        class="${getColorClasses(
                          percentile,
                        )} mt-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ring-1 ring-inset"
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
        theme: 'dark',
      }),
    ]);

    // Start InstantSearch
    searchInstance.start();

    // Capture the input element for keyboard navigation once rendered
    searchInstance.on('render', () => {
      if (!algoliaInput && searchInputRef) {
        algoliaInput = searchInputRef.querySelector('.ais-SearchBox-input') as HTMLElement;
      }
    });

    // Handle Algolia errors (rate limiting, origin forbidden, etc.)
    searchInstance.on('error', ({ error }) => {
      console.error('Algolia search error:', error);
      // Check various possible error status properties
      const status = error?.status || error?.statusCode;
      if (status === 429) {
        rateLimitReached = true;
      }
      if (status === 403) {
        originForbidden = true;
      }
    });

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
      class="fixed inset-0 bg-gray-500/25 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
    ></el-dialog-backdrop>

    <div class="fixed inset-0 w-screen overflow-y-auto p-4 focus:outline focus:outline-0 sm:p-6 md:p-20">
      <el-dialog-panel
        class="mx-auto block max-w-3xl transform rounded-xl bg-slate-800 shadow-2xl ring-1 ring-black/5 transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:bg-gray-900 dark:ring-white/10"
      >
        <!-- Content Wrapper with White Background -->
        <div class="overflow-hidden rounded-t-xl bg-white dark:bg-gray-900">
          <!-- Search Box Header -->
          <div class="divide-y divide-gray-100 dark:divide-white/10">
            <div class="grid grid-cols-1">
              <div
                id="searchbox-profiles-compact"
                bind:this={searchInputRef}
                class="relative col-start-1 row-start-1 h-12 w-full pr-4 pl-11 text-base text-gray-900 outline-hidden placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 sm:text-sm dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
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
              <!-- Results Area -->
              <div class="min-w-0 flex-auto scroll-py-4 overflow-y-auto">
                {#if originForbidden}
                  <OriginForbidden />
                {:else if rateLimitReached}
                  <RateLimit />
                {:else}
                  <div
                    use:searchResultsNavigation={algoliaInput}
                    id="hits-profiles-compact"
                    class="px-4"
                    data-sveltekit-preload-data="tap"
                  ></div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between rounded-b-xl bg-slate-800 px-4 py-4 text-sm text-gray-400 dark:text-gray-400">
          <div id="powered-by-profiles-compact"></div>

          <div class="hidden items-center sm:flex">
            <div class="relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
              Prospecting? Try <a href="/search/grantees/" class="text-grantmakers-blue-dark-bg font-bold"
                ><span aria-hidden="true" class="absolute inset-0"></span>Grantee Search <span aria-hidden="true">→</span></a
              >
            </div>
          </div>
          <div class="flex items-center">
            <a class="hover:text-grey-500 dark:hover:text-grey-200 flex items-center gap-2" href="/search/profiles/">
              <span class="text-grantmakers-orange-light-dark-bg font-bold transition-colors">All Foundations</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="text-grantmakers-orange-light-dark-bg size-4"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </el-dialog-panel>
    </div>
  </dialog>
</el-dialog>

<style lang="postcss">
  @reference "../../../app.pcss";
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
