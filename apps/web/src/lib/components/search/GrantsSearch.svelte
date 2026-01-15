<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { pushState, replaceState } from '$app/navigation';
  import instantsearch, { type InstantSearch, type SearchClient, type TemplateParams, type UiState } from 'instantsearch.js';
  import { history } from 'instantsearch.js/es/lib/routers';
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
    refinementListCompactStyles,
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

  interface FacetConfig {
    attribute: string;
    label: string;
    container: string;
    compact?: boolean;
  }

  /**
   * Route state for URL serialization - flat structure for clean URLs
   */
  interface RouteState {
    query?: string;
    grantee_state?: string;
    grantee_city?: string;
    grantee_name?: string;
    grant_purpose?: string;
    page?: number;
  }

  let mobileFiltersOpen = $state(false);

  let algoliaInstance: AlgoliaInstance;

  // Facet configuration - defines the refinement lists to render
  const FACETS: readonly FacetConfig[] = [
    { attribute: 'grantee_state', label: 'State', container: '#state' },
    { attribute: 'grantee_city', label: 'City', container: '#location' },
    { attribute: 'grantee_name', label: 'Recipient', container: '#recipient', compact: true },
    { attribute: 'grant_purpose', label: 'Purpose', container: '#purpose', compact: true },
  ];

  /**
   * Factory function to create a Panel-wrapped RefinementList widget
   * Uses shared template and styling for all facets (DRY principle)
   */
  const createFacetWidget = (facet: FacetConfig) => {
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
      cssClasses: facet.compact ? refinementListCompactStyles : refinementListStyles,
      templates: {
        showMoreText(data: { isShowingMore: boolean }, { html }: TemplateParams) {
          const text = data.isShowingMore ? 'Show less' : 'Show more';
          const chevron =
            data.isShowingMore ?
              html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path
                  fill-rule="evenodd"
                  d="M9.47 5.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 7.56 6.28 11.28a.75.75 0 1 1-1.06-1.06l4.25-4.25Z"
                  clip-rule="evenodd"
                />
              </svg>`
            : html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                <path
                  fill-rule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>`;
          return html`<span class="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >${text} ${chevron}</span
          >`;
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

    algoliaInstance = instantsearch<UiState, RouteState>({
      indexName: PUBLIC_ALGOLIA_INDEX_NAME_GRANTS,
      searchClient: searchClient as SearchClient,
      future: {
        preserveSharedStateOnUnmount: true,
      },
      routing: {
        router: history<RouteState>({
          cleanUrlOnDispose: false,
          writeDelay: 400,
          push(url) {
            /**
             * Use SvelteKit's shallow routing (pushState/replaceState) to update the URL
             * without triggering load functions, which would cause unnecessary __data.json re-fetches.
             */
            const nextUrl = new URL(url);
            const currentBrowserUrl = new URL(window.location.href);
            const currentUrlSearchParams = currentBrowserUrl.searchParams;
            const hasSearch = currentUrlSearchParams.size > 0;

            // First search: PUSH to history. Subsequent refinements: REPLACE.
            if (!hasSearch) {
              pushState(nextUrl, {});
            } else {
              replaceState(nextUrl, {});
            }
          },
        }),
        stateMapping: {
          stateToRoute(uiState: UiState): RouteState {
            /**
             * Convert UI state to URL route params.
             * Uses ~ as separator for multiple facet values (readable in URLs).
             */
            const indexUiState = uiState[PUBLIC_ALGOLIA_INDEX_NAME_GRANTS];
            return {
              query: indexUiState.query,
              grantee_state: indexUiState.refinementList?.grantee_state?.join('~'),
              grantee_city: indexUiState.refinementList?.grantee_city?.join('~'),
              grantee_name: indexUiState.refinementList?.grantee_name?.join('~'),
              grant_purpose: indexUiState.refinementList?.grant_purpose?.join('~'),
              page: indexUiState.page,
            };
          },
          routeToState(routeState: RouteState): UiState {
            /**
             * Convert URL route params back to UI state for widgets.
             * Only include refinements that exist in the URL to satisfy type requirements.
             */
            const refinementList: { [attribute: string]: string[] } = {};
            if (routeState.grantee_state) refinementList.grantee_state = routeState.grantee_state.split('~');
            if (routeState.grantee_city) refinementList.grantee_city = routeState.grantee_city.split('~');
            if (routeState.grantee_name) refinementList.grantee_name = routeState.grantee_name.split('~');
            if (routeState.grant_purpose) refinementList.grant_purpose = routeState.grant_purpose.split('~');

            return {
              [PUBLIC_ALGOLIA_INDEX_NAME_GRANTS]: {
                query: routeState.query,
                refinementList,
                page: routeState.page,
              },
            };
          },
        },
      },
    });

    const customHits = connectHits(renderHits);

    // Create all facet widgets using the factory
    const facetWidgets = FACETS.map((facet) => createFacetWidget(facet));

    algoliaInstance.addWidgets([
      configure({
        /* @ts-expect-error Assumes PlainSearchParameters only, which is a narrow subset of all available search parameters */
        hitsPerPage: 15,
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

<main id="grants-search-top" class="lg:max-w-8xl mx-auto max-w-full scroll-mt-24 px-4 py-8 sm:px-6 lg:px-8">
  <div class="mb-4 flex flex-col items-center gap-4 lg:mb-8 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
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
      </div>
    </div>

    <!-- Mobile Layout: Filters + Powered By (Row 2 on Mobile) -->
    <!-- Desktop Layout: Filters hidden, Powered By joins Row 1 via lg:contents -->
    <div class="flex w-full items-center justify-between gap-4 lg:contents lg:w-auto">
      <!-- Mobile Filter Toggle -->
      <button
        type="button"
        class="flex items-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow hover:bg-gray-50 lg:hidden"
        onclick={() => (mobileFiltersOpen = true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="-ml-0.5 h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
          />
        </svg>

        Filters
      </button>

      <!-- Powered By -->
      <div class="flex items-center lg:w-64 lg:shrink-0">
        <div class="flex h-full w-full items-center justify-center rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <div id="powered-by"></div>
        </div>
      </div>
    </div>
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
        <div id="pagination"></div>
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
