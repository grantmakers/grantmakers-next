<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import instantsearch, { type InstantSearch, type SearchClient, type TemplateParams } from 'instantsearch.js';
  import {
    searchBox,
    poweredBy,
    configure,
    refinementList,
    currentRefinements,
    stats,
    panel as panelWidget,
    pagination,
  } from 'instantsearch.js/es/widgets';
  import { connectHits } from 'instantsearch.js/es/connectors';
  import type { HitsRenderState } from 'instantsearch.js/es/connectors/hits/connectHits';
  import { formatToCurrency, formatNumber } from '@repo/shared/functions/formatters/numbers';
  import { sanitizeHtml } from '@repo/shared/utils/sanitize';
  import {
    searchBoxGrantsStyles,
    currentRefinementsStyles,
    refinementListStyles,
    panelStyles,
    statsStyles,
    poweredByGrantsStyles,
    paginationStyles,
  } from './config/searchStyles';
  import {
    PUBLIC_ALGOLIA_APP_ID_GRANTS,
    PUBLIC_ALGOLIA_SEARCH_ONLY_KEY_GRANTS,
    PUBLIC_ALGOLIA_INDEX_NAME_GRANTS,
  } from '$env/static/public';

  type AlgoliaInstance = InstantSearch;

  interface Props {
    ein: string;
  }

  let { ein }: Props = $props();

  let mobileFiltersOpen = $state(false);

  let algoliaInstance: AlgoliaInstance;

  // Facet configuration - defines the refinement lists to render
  const FACETS = [
    { attribute: 'grantee_state', label: 'State', container: '#state' },
    { attribute: 'grantee_city', label: 'City', container: '#location' },
    { attribute: 'grantee_name', label: 'Recipient', container: '#recipient' },
    { attribute: 'grant_purpose', label: 'Purpose', container: '#purpose' },
  ] as const;

  /**
   * Factory function to create a Panel-wrapped RefinementList widget
   * Uses shared template and styling for all facets (DRY principle)
   */
  const createFacetWidget = (facet: (typeof FACETS)[number]) => {
    const panelWrappedRefinementList = panelWidget({
      templates: {
        header(data, { html }) {
          return html`<span class="font-medium text-gray-900">${facet.label}</span>`;
        },
      },
      hidden(options) {
        return options.results?.nbHits === 0;
      },
      cssClasses: panelStyles,
    })(refinementList);

    return panelWrappedRefinementList({
      container: facet.container,
      attribute: facet.attribute,
      limit: 5,
      showMore: true,
      cssClasses: refinementListStyles,
      templates: {
        showMoreText(data: { isShowingMore: boolean }, { html }: TemplateParams) {
          return html`<span class="text-sm text-gray-700">${data.isShowingMore ? '[ - ] Show less' : '[ + ] Show more'}</span>`;
        },
      },
    });
  };

  const renderHits = (renderOptions: HitsRenderState) => {
    const { items } = renderOptions;
    const hitsContainer = document.querySelector('#hits');

    if (!hitsContainer) {
      return 'No hits container found';
    }

    hitsContainer.innerHTML = `
      <div class="overflow-x-auto max-w-full">
        <table class="min-w-full table-auto divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-center">Amount</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Grantee</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Purpose</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Year</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            ${items
              .map((grant) => {
                return `
                  <tr class="relative even:bg-gray-50 align-top">
                    <td class="px-3 py-4 text-sm text-right tabular-nums">${formatToCurrency(grant.grant_amount)}</td>
                    <td class="px-3 py-4 text-sm">
                      <div class="text-md font-bold text-gray-900">${grant.grantee_name}</div>
                    </td>
                    <td class="px-3 py-4 text-sm">${sanitizeHtml(grant.grant_purpose)}</td>
                    <td class="px-3 py-4 text-sm">
                      ${grant.grantee_city},<br>
                      ${grant.grantee_is_foreign && grant.grantee_state === 'Foreign' ? grant.grantee_country : grant.grantee_state}
                    </td>
                    <td class="px-3 py-4 text-sm">${grant.tax_year}</td>
                  </tr>`;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  onMount(async () => {
    const { liteClient: algoliasearch } = await import('algoliasearch/lite');

    if (!PUBLIC_ALGOLIA_APP_ID_GRANTS || !PUBLIC_ALGOLIA_SEARCH_ONLY_KEY_GRANTS || !PUBLIC_ALGOLIA_INDEX_NAME_GRANTS) {
      throw new Error('Failed to init Algolia: Missing required credentials');
    }

    const searchClient = algoliasearch(PUBLIC_ALGOLIA_APP_ID_GRANTS, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY_GRANTS);

    if (!searchClient) throw new Error('Failed to init Algolia search client');

    algoliaInstance = instantsearch({
      indexName: PUBLIC_ALGOLIA_INDEX_NAME_GRANTS,
      searchClient: searchClient as SearchClient,
      future: {
        preserveSharedStateOnUnmount: true,
      },
      initialUiState: {
        [PUBLIC_ALGOLIA_INDEX_NAME_GRANTS]: {
          query: '',
        },
      },
    });

    const customHits = connectHits(renderHits);

    // Create all facet widgets using the factory
    const facetWidgets = FACETS.map((facet) => createFacetWidget(facet));

    algoliaInstance.addWidgets([
      configure({
        /* @ts-expect-error Assumes PlainSearchParameters only, which is a narrow subset of all available search parameters */
        hitsPerPage: 10,
        filters: 'ein:' + ein,
      }),

      searchBox({
        container: '#search',
        searchAsYouType: true,
        showReset: true,
        showSubmit: false,
        placeholder: 'Search by Name, Location, or Purpose Keyword',
        cssClasses: searchBoxGrantsStyles,
      }),

      stats({
        container: '#stats',
        cssClasses: statsStyles,
        templates: {
          text(data, { html }) {
            let count = '';

            if (data.hasManyResults) {
              count += `${formatNumber(data.nbHits)} results`;
            } else if (data.hasOneResult) {
              count += `1 result`;
            } else {
              count += `no result`;
            }

            return html`<span>${count}</span>`;
          },
        },
      }),

      currentRefinements({
        container: '#current-refinements',
        cssClasses: currentRefinementsStyles,
        transformItems(items) {
          // Map attribute names to human-readable labels
          const labelMap = Object.fromEntries(FACETS.map((f) => [f.attribute, f.label]));
          return items.map((item) => ({
            ...item,
            label: labelMap[item.attribute] || item.label,
          }));
        },
      }),

      // Add all facet widgets
      ...facetWidgets,

      customHits({}),

      poweredBy({
        container: '#powered-by',
        theme: 'light',
        cssClasses: poweredByGrantsStyles,
      }),

      pagination({
        container: '#pagination',
        cssClasses: paginationStyles,
        scrollTo: '#grants-search-top',
      }),
    ]);

    algoliaInstance.start();
  });
  onDestroy(() => {
    if (algoliaInstance) {
      algoliaInstance.dispose();
    }
  });
</script>

<div class="">
  <main id="grants-search-top" class="lg:max-w-8xl mx-auto max-w-full scroll-mt-24 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-4 flex flex-col items-center gap-4 lg:mb-8 lg:flex-row lg:justify-between lg:gap-0">
      <div class="w-full flex-1">
        <!-- Search Box Section -->
        <div class="flex gap-8">
          <div class="grow">
            <div class="relative rounded-lg bg-white p-4 shadow dark:bg-gray-800">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                class="pointer-events-none absolute top-1/2 left-8 z-10 size-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                  clip-rule="evenodd"
                />
              </svg>
              <div id="search"></div>
            </div>
          </div>
          <!-- Desktop Powered By moves here ideally, but for now we keep layout similar -->
        </div>
      </div>

      <!-- Mobile Filter Toggle -->
      <button
        type="button"
        class="inline-flex items-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 lg:hidden"
        onclick={() => (mobileFiltersOpen = true)}
      >
        <svg class="-ml-0.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
            clip-rule="evenodd"
          />
        </svg>
        Filters
      </button>
    </div>

    <div class="mb-8 hidden lg:flex lg:gap-8">
      <aside class="ml-auto w-64">
        <div class="flex items-center rounded-lg bg-white p-6 shadow">
          <div id="powered-by"></div>
        </div>
      </aside>
    </div>

    <!-- Stats and Current Refinements Bar-->
    <div class="mx-auto mb-6 max-w-7xl rounded-lg bg-slate-100 px-4 py-3 outline-hidden sm:flex sm:items-center sm:px-6 md:mb-8 lg:px-8">
      <div class="text-sm font-medium text-slate-500">
        <div id="stats" class="min-w-[100px] text-xs"></div>
      </div>

      <div aria-hidden="true" class="hidden h-5 w-px bg-slate-300 sm:ml-4 sm:block"></div>

      <div class="mt-2 flex min-h-12 items-center sm:mt-0 sm:ml-4">
        <div id="current-refinements"></div>
      </div>
    </div>

    <div class="flex gap-8">
      <div class="min-w-0 flex-1">
        <div class="rounded-lg bg-white p-6 shadow">
          <!-- InstantSearch Hits -->
          <div id="hits">
            {@render hitsSkeleton()}
          </div>
          <!-- InstantSearch Pagination -->
          <div class="max-w-full overflow-x-auto">
            <div id="pagination"></div>
          </div>
        </div>
      </div>

      <!-- Backdrop -->
      {#if mobileFiltersOpen}
        <div class="fixed inset-0 z-40 bg-black/25 lg:hidden" aria-hidden="true" onclick={() => (mobileFiltersOpen = false)}></div>
      {/if}

      <aside
        class="
          fixed inset-y-0 right-0 z-50 w-80 transform overflow-y-auto bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out lg:static lg:z-0 lg:w-64 lg:transform-none lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none
          {mobileFiltersOpen ? 'translate-x-0' : 'hidden lg:block lg:translate-x-0'}
        "
      >
        <!-- Mobile Header -->
        <div class="mb-6 flex items-center justify-between lg:hidden">
          <h2 class="text-lg font-medium text-gray-900">Filters</h2>
          <button
            type="button"
            class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            onclick={() => (mobileFiltersOpen = false)}
          >
            <span class="sr-only">Close menu</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="sticky top-8 space-y-6 rounded-lg lg:bg-white lg:p-6 lg:shadow">
          <!-- InstantSearch RefinementLists -->
          <div id="state"></div>
          <div id="location"></div>
          <div id="recipient"></div>
          <div id="purpose"></div>
        </div>
      </aside>
    </div>
  </main>
</div>

{#snippet hitsSkeleton()}
  <div class="max-w-full animate-pulse overflow-x-auto">
    <table class="min-w-full table-auto divide-y divide-gray-300">
      <thead>
        <tr>
          <th scope="col" class="px-3 py-3.5 text-center text-left text-sm font-semibold text-gray-900">Amount</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Grantee</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Purpose</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Year</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each { length: 10 } as _}
          <tr class="relative align-top even:bg-gray-50">
            <td class="px-3 py-4 text-right text-sm">
              <div class="ml-auto h-4 w-20 rounded bg-gray-200"></div>
            </td>
            <td class="px-3 py-4 text-sm">
              <div class="mb-1 h-4 w-32 rounded bg-gray-200"></div>
            </td>
            <td class="px-3 py-4 text-sm">
              <div class="h-4 w-48 rounded bg-gray-200"></div>
            </td>
            <td class="px-3 py-4 text-sm">
              <div class="mb-1 h-4 w-24 rounded bg-gray-200"></div>
              <div class="h-3 w-12 rounded bg-gray-200"></div>
            </td>
            <td class="px-3 py-4 text-sm">
              <div class="h-4 w-12 rounded bg-gray-200"></div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/snippet}
