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
  import type { RefinementListItemData } from 'instantsearch.js/es/widgets/refinement-list/refinement-list';
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

  let algoliaInstance: AlgoliaInstance;
  const indexName = PUBLIC_ALGOLIA_INDEX_NAME_GRANTS;

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
        item(item: RefinementListItemData, { html }: TemplateParams) {
          const { label, count, value, isRefined } = item;
          const checkmarkClass = isRefined ? 'opacity-100' : 'opacity-0';
          return html`
            <div class="${refinementListStyles.item}">
              <div class="flex h-5 shrink-0 items-center">
                <div class="grid size-4 grid-cols-1">
                  <input
                    type="checkbox"
                    value="${value}"
                    class="${isRefined ? 'border-indigo-600 bg-indigo-600' : (
                      ''
                    )} col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white"
                  />
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white"
                  >
                    <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${checkmarkClass}" />
                  </svg>
                </div>
              </div>
              <label class="${refinementListStyles.label}">
                <span>${label}</span>
                <span class="${refinementListStyles.count}">${count}</span>
              </label>
            </div>
          `;
        },
        showMoreText(data, { html }) {
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
              // console.log(grant);
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
    `;
  };

  onMount(async () => {
    const { liteClient: algoliasearch } = await import('algoliasearch/lite');

    const searchClient = algoliasearch(PUBLIC_ALGOLIA_APP_ID_GRANTS, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY_GRANTS);

    if (!searchClient) throw new Error('Failed to init Algolia search client');

    algoliaInstance = instantsearch({
      indexName: indexName,
      searchClient: searchClient as SearchClient,
      future: {
        preserveSharedStateOnUnmount: true,
      },
      initialUiState: {
        [indexName]: {
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
          return items.filter((item) => {
            return item;
          });
        },
      }),

      // Add all facet widgets
      ...facetWidgets,

      // refinementList({
      //   container: '#amount',
      //   attribute: 'grant_amount',
      //   templates: {
      //     item(item, { html }) {
      //       const { label, count } = item;
      //       return html`
      //         <div class="flex items-center justify-between text-sm/6">
      //           <div class="font-medium text-gray-900 hover:text-indigo-500">${label}</div>
      //           <div class="text-gray-500">${count}</div>
      //         </div>
      //       `;
      //     },
      //   },
      //   transformItems(items) {
      //     return items.map((item) => {
      //       if (item.isRefined) {
      //         console.log(item);
      //       }
      //       return {
      //         ...item,
      //       };
      //     });
      //   },
      // }),

      customHits({
        //container: document.querySelector('#hits'),
      }),

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
  <main id="grants-search-top" class="max-w-8xl mx-auto scroll-mt-24 px-4 py-8 sm:px-6 lg:px-8">
    <!-- Search Box Section -->
    <div class="mb-8 flex gap-8">
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
      <aside class="flex w-64 items-stretch">
        <div class="flex grow items-center rounded-lg bg-white p-6 shadow">
          <div id="powered-by"></div>
        </div>
      </aside>
    </div>

    <div class="mx-auto max-w-7xl rounded-lg bg-slate-100 px-4 py-3 sm:flex sm:items-center sm:px-6 md:mb-8 lg:px-8">
      <div class="text-sm font-medium text-slate-500">
        <div id="stats" class="text-xs"></div>
      </div>

      <div aria-hidden="true" class="hidden h-5 w-px bg-slate-300 sm:ml-4 sm:block"></div>

      <div class="mt-2 sm:mt-0 sm:ml-4">
        <div id="current-refinements">
          <div class="-m-1 flex flex-wrap items-center">
            <span
              class="m-1 inline-flex items-center rounded-full border border-slate-200 bg-white py-1.5 pr-2 pl-3 text-sm font-medium text-slate-900"
            >
              <span class="sr-only">Refinements</span>
              <button
                type="button"
                class="ml-1 inline-flex size-4 shrink-0 rounded-full p-1 text-slate-400 hover:bg-gray-200 hover:text-slate-500"
              >
                <span class="sr-only">Remove filter for Refinements</span>
                <svg class="size-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-8">
      <div class="flex-1">
        <div class="rounded-lg bg-white p-6 shadow">
          <!-- InstantSearch Hits -->
          <div id="hits">
            {@render hitsSkeleton()}
          </div>
          <!-- InstantSearch Pagination -->
          <div id="pagination"></div>
        </div>
      </div>

      <aside class="w-64 flex-shrink-0">
        <div class="sticky top-8 rounded-lg bg-white p-6 shadow">
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
  <div class="animate-pulse">
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
