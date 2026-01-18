<script lang="ts">
  import '@tailwindplus/elements';
  import { onDestroy, onMount } from 'svelte';
  import { pushState, replaceState } from '$app/navigation';
  import instantsearch, { type InstantSearch, type SearchClient, type TemplateParams, type UiState } from 'instantsearch.js';
  import { history } from 'instantsearch.js/es/lib/routers';
  import {
    searchBox,
    poweredBy,
    refinementList,
    currentRefinements,
    clearRefinements,
    stats,
    panel as panelWidget,
    pagination,
  } from 'instantsearch.js/es/widgets';
  import { connectHits, connectConfigure, connectMenu } from 'instantsearch.js/es/connectors';
  import type { ConfigureRenderState } from 'instantsearch.js/es/connectors/configure/connectConfigure';
  import type { HitsRenderState } from 'instantsearch.js/es/connectors/hits/connectHits';
  import type { MenuRenderState } from 'instantsearch.js/es/connectors/menu/connectMenu';
  import type { PlainSearchParameters } from 'algoliasearch-helper';
  import { formatToCurrency, formatNumber } from '@repo/shared/functions/formatters/numbers';
  import {
    searchBoxGrantsStyles,
    currentRefinementsStyles,
    clearRefinementsStyles,
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

  interface RouteState {
    query?: string;
    grantee_state?: string;
    grantee_city?: string;
    grantee_name?: string;
    grant_purpose?: string;
    tax_year?: string;
    page?: number;
  }

  let mobileFiltersOpen = $state(false);
  let searchAllFoundations = $state(false);
  let latestTaxYear = $state<string | null>(null);
  let taxYearFilterMode = $state<'all' | 'current'>('all');
  let refineTaxYear: ((value: string) => void) | null = null;

  let algoliaInstance: AlgoliaInstance;
  let refineConfig: ConfigureRenderState['refine'] | null = null;

  const FACETS: readonly FacetConfig[] = [
    { attribute: 'grantee_state', label: 'State', container: '#state' },
    { attribute: 'grantee_city', label: 'City', container: '#location' },
    { attribute: 'grantee_name', label: 'Recipient', container: '#recipient', compact: true },
    { attribute: 'grant_purpose', label: 'Purpose', container: '#purpose', compact: true },
  ];

  const EIN_FILTER_OPTIONS = [
    { value: 'current', label: 'this foundation' },
    { value: 'all', label: 'all foundations' },
  ] as const;

  const TAX_YEAR_FILTER_OPTIONS = [
    { value: 'all', label: 'all available' },
    { value: 'current', label: 'the current' },
  ] as const;

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
          return html`<span class="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-800">${text} ${chevron}</span>`;
        },
      },
    });
  };

  const renderHits = (renderOptions: HitsRenderState) => {
    const { items, results } = renderOptions;
    const hitsContainer = document.querySelector('#hits');

    if (!hitsContainer) {
      return 'No hits container found';
    }

    // Handle empty state with context-aware messaging
    if (items.length === 0) {
      const query = results?.query ?? '';
      const hasQuery = query.length > 0;

      // Check for active refinements via disjunctiveFacets in the results
      const hasRefinements =
        (results?.disjunctiveFacets && results.disjunctiveFacets.length > 0) ||
        (results?.hierarchicalFacets && results.hierarchicalFacets.length > 0);

      let emptyMessage: string;

      if (hasQuery) {
        // User searched, but no results found
        const sanitizedQuery = query.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        emptyMessage = `
          <div class="py-8 text-center">
            <p class="text-gray-700">No results found for "<strong>${sanitizedQuery}</strong>"</p>
            <p class="text-sm text-gray-500 mt-2">Try adjusting your search terms</p>
          </div>`;
      } else if (hasRefinements) {
        // Filters applied, but no results
        emptyMessage = `
          <div class="py-8 text-center">
            <p class="text-gray-700">No matching grants found</p>
            <p class="text-sm text-gray-500 mt-2">Try adjusting or clearing your filters</p>
          </div>`;
      } else {
        // Initial load with no results (could be ETL or index issue)
        emptyMessage = `<div class="py-6">No searchable grant records found</div>`;
      }

      hitsContainer.innerHTML = emptyMessage;
      return;
    }

    hitsContainer.innerHTML = `
      <div class="overflow-x-auto max-w-full">
        <table class="min-w-full table-auto divide-y divide-gray-300">
          <thead class="bg-slate-100 rounded">
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
                    <td class="px-3 py-4 text-sm">${grant.grant_purpose}</td>
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
              tax_year: indexUiState.menu?.tax_year,
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

            // Only include menu if tax_year is set
            const menu: { [attribute: string]: string } = {};
            if (routeState.tax_year) menu.tax_year = routeState.tax_year;

            return {
              [PUBLIC_ALGOLIA_INDEX_NAME_GRANTS]: {
                query: routeState.query,
                refinementList,
                menu,
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

    // Custom configure widget using connector pattern for dynamic filter updates
    const renderConfigure = (renderOptions: ConfigureRenderState) => {
      // Store the refine function so we can call it from the toggle handler
      refineConfig = renderOptions.refine;
    };
    const customConfigure = connectConfigure(renderConfigure);

    // Custom Tax Year menu widget using connector pattern for single-select dropdown
    const renderTaxYearMenu = (renderOptions: MenuRenderState) => {
      const { items, refine } = renderOptions;

      // Store refine function for use in event handlers
      refineTaxYear = refine;

      // Sort items by value descending and get the latest year
      const sortedItems = [...items].sort((a, b) => b.value.localeCompare(a.value));
      const latest = sortedItems[0];

      // Update reactive state with the latest year
      if (latest) {
        latestTaxYear = latest.value;
      }

      // Determine current filter mode based on refinement state
      const refinedItem = items.find((item) => item.isRefined);
      if (refinedItem) {
        // If a specific year is refined, we're in 'current' mode
        taxYearFilterMode = 'current';
      } else {
        taxYearFilterMode = 'all';
      }
    };
    const customTaxYearMenu = connectMenu(renderTaxYearMenu);

    algoliaInstance.addWidgets([
      customConfigure({
        searchParameters: {
          hitsPerPage: 15,
          filters: 'ein:' + ein,
        } as PlainSearchParameters,
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
              count += `${formatNumber(data.nbHits)} Grants`;
            } else if (data.hasOneResult) {
              count += `1 Grant`;
            } else {
              count += `0 Grants`;
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
          const labelMap: { [key: string]: string } = {
            ...Object.fromEntries(FACETS.map((f) => [f.attribute, f.label])),
            tax_year: 'Tax Year',
          };
          return items.map((item) => ({
            ...item,
            label: labelMap[item.attribute] || item.label,
          }));
        },
      }),

      clearRefinements({
        container: '#clear-refinements',
        cssClasses: clearRefinementsStyles,
        templates: {
          resetLabel(_data, { html }) {
            return html`Clear All Filters`;
          },
        },
      }),

      // Add all facet widgets
      ...facetWidgets,

      customTaxYearMenu({
        attribute: 'tax_year',
        sortBy: ['name:desc'],
        limit: 20,
      }),

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

  /**
   * Handle search scope selection change
   * Uses connectConfigure's refine() to dynamically update search parameters without widget replacement
   */
  function handleEinFilterToggle(event: Event) {
    const select = event.target as HTMLElement & { value: string };
    searchAllFoundations = select.value === 'all';

    if (!refineConfig) return;

    // Use refine() to update the filter dynamically
    refineConfig({
      hitsPerPage: 15,
      filters: searchAllFoundations ? '' : 'ein:' + ein,
    } as PlainSearchParameters);
  }

  /**
   * Handle tax year filter selection change
   * Uses connectMenu's refine() to toggle between all years and current year
   */
  function handleTaxYearFilterChange(event: Event) {
    const select = event.target as HTMLElement & { value: string };
    const mode = select.value as 'all' | 'current';
    taxYearFilterMode = mode;

    if (!refineTaxYear) return;

    if (mode === 'all') {
      // Clear the refinement to show all years
      refineTaxYear('');
    } else if (mode === 'current' && latestTaxYear) {
      // Refine to the latest (current) year
      refineTaxYear(latestTaxYear);
    }
  }
</script>

<!--
  Using data-sveltekit-preload-data="tap" to prevent SvelteKit from preloading data on hover for the pagination and other links.
  This limits unnecessary calls to Cloudflare/Algolia until we have a better handle on traffic patterns.
-->
<main
  id="grants-search-top"
  class="lg:max-w-8xl mx-auto max-w-full scroll-mt-24 px-4 py-8 sm:px-6 lg:px-8"
  data-sveltekit-preload-data="tap"
>
  <div class="mb-4 flex flex-col items-center gap-4 lg:mb-8 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
    <div class="w-full flex-1">
      <!-- Search Box Section -->
      <div class="flex gap-8">
        <div class="grow">
          <div class="relative rounded-lg bg-slate-100 p-2 shadow md:p-4 dark:bg-gray-800">
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
        <div class="flex h-full w-full items-center justify-center rounded-lg bg-white p-4 shadow sm:shadow-none dark:bg-gray-800">
          <div id="powered-by"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex gap-8">
    <div class="min-w-0 flex-1">
      <!-- Current Refinements - Only visible when filters are active -->
      <div class="mb-4 flex flex-wrap items-center gap-2 empty:hidden has-[.hidden]:hidden">
        <div id="current-refinements" class="contents"></div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <!-- Stats + Mini-filter bar -->
        <div class="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-gray-100 pb-3">
          <div id="stats" class="text-sm font-medium text-slate-600"></div>

          <!-- Separator -->
          <span class="hidden text-slate-300 md:block">|</span>

          <!-- Mini-filter bar -->
          <div class="hidden flex-wrap items-center gap-1.5 text-sm text-slate-600 md:flex">
            <span>Searching grants from</span>
            <el-select
              id="ein-filter-select"
              name="ein-scope"
              value={searchAllFoundations ? 'all' : 'current'}
              class="inline-block"
              onchange={handleEinFilterToggle}
            >
              <button
                type="button"
                class="grid cursor-default grid-cols-1 rounded-md bg-white py-0.5 pr-1.5 pl-2 text-left text-sm text-slate-600 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:focus-visible:outline-indigo-500"
              >
                <el-selectedcontent class="col-start-1 row-start-1 truncate pr-4">
                  {EIN_FILTER_OPTIONS.find((opt) => opt.value === (searchAllFoundations ? 'all' : 'current'))?.label}
                </el-selectedcontent>
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  data-slot="icon"
                  aria-hidden="true"
                  class="col-start-1 row-start-1 size-4 self-center justify-self-end text-gray-400"
                >
                  <path
                    d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                  />
                </svg>
              </button>

              <el-options
                anchor="bottom start"
                popover="manual"
                class="max-h-60 min-w-(--button-width) overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 [--anchor-gap:--spacing(1)] data-leave:transition data-leave:transition-discrete data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
              >
                {#each EIN_FILTER_OPTIONS as option}
                  <el-option
                    value={option.value}
                    class="group/option relative block cursor-default py-2 pr-9 pl-3 text-gray-900 select-none focus:bg-indigo-600 focus:text-white focus:outline-hidden dark:text-white dark:focus:bg-indigo-500"
                  >
                    <span class="block font-normal whitespace-nowrap group-aria-selected/option:font-semibold">{option.label}</span>
                    <span
                      class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-aria-selected/option:hidden group-focus/option:text-white in-[el-selectedcontent]:hidden dark:text-indigo-400"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5">
                        <path
                          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                          clip-rule="evenodd"
                          fill-rule="evenodd"
                        />
                      </svg>
                    </span>
                  </el-option>
                {/each}
              </el-options>
            </el-select>

            <span>across</span>

            <el-select
              id="tax-year-select"
              name="tax-year-scope"
              value={taxYearFilterMode}
              class="inline-block"
              onchange={handleTaxYearFilterChange}
              disabled={!latestTaxYear}
            >
              <button
                type="button"
                class="grid cursor-default grid-cols-1 rounded-md bg-white py-0.5 pr-1.5 pl-2 text-left text-sm text-slate-600 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:focus-visible:outline-indigo-500"
              >
                <el-selectedcontent class="col-start-1 row-start-1 truncate pr-4">
                  {TAX_YEAR_FILTER_OPTIONS.find((opt) => opt.value === taxYearFilterMode)?.label}{(
                    taxYearFilterMode === 'current' && latestTaxYear
                  ) ?
                    ` (${latestTaxYear})`
                  : ''}
                </el-selectedcontent>
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  data-slot="icon"
                  aria-hidden="true"
                  class="col-start-1 row-start-1 size-4 self-center justify-self-end text-gray-400"
                >
                  <path
                    d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                  />
                </svg>
              </button>

              <el-options
                anchor="bottom start"
                popover="manual"
                class="max-h-60 min-w-(--button-width) overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 [--anchor-gap:--spacing(1)] data-leave:transition data-leave:transition-discrete data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
              >
                {#each TAX_YEAR_FILTER_OPTIONS as option}
                  <el-option
                    value={option.value}
                    class="group/option relative block cursor-default py-2 pr-9 pl-3 text-gray-900 select-none focus:bg-indigo-600 focus:text-white focus:outline-hidden dark:text-white dark:focus:bg-indigo-500"
                  >
                    <span class="block font-normal whitespace-nowrap group-aria-selected/option:font-semibold">{option.label}</span>
                    <span
                      class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-aria-selected/option:hidden group-focus/option:text-white in-[el-selectedcontent]:hidden dark:text-indigo-400"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5">
                        <path
                          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                          clip-rule="evenodd"
                          fill-rule="evenodd"
                        />
                      </svg>
                    </span>
                  </el-option>
                {/each}
              </el-options>
            </el-select>

            <span>tax filing{taxYearFilterMode === 'all' ? 's' : ''}</span>
          </div>
        </div>
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
        <!-- Clear All Refinements -->
        <div id="clear-refinements" class="border-t border-gray-200 pt-4"></div>
      </div>
    </aside>
  </div>
</main>

{#snippet hitsSkeleton()}
  <div class="max-w-full animate-pulse overflow-x-auto">
    <table class="min-w-full table-auto divide-y divide-gray-300">
      <thead class="bg-slate-100">
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
