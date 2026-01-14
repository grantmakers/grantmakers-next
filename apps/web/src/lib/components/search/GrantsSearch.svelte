<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import instantsearch, { type InstantSearch, type SearchClient } from 'instantsearch.js';
  import {
    searchBox,
    poweredBy,
    configure,
    refinementList,
    currentRefinements,
    stats,
    panel as panelWidget,
  } from 'instantsearch.js/es/widgets';
  import { connectHits } from 'instantsearch.js/es/connectors';
  import type { HitsRenderState } from 'instantsearch.js/es/connectors/hits/connectHits';
  import type { FacetHits, SearchResponses } from '@algolia/client-search';
  import type { RefinementListItemData } from 'instantsearch.js/es/widgets/refinement-list/refinement-list';
  import type { Facets, GrantsArray, GrantsFacets } from '@repo/shared/typings/grantmakers/all';
  import { formatToCurrency } from '@repo/shared/functions/formatters/numbers';
  import { remapGrants } from '@repo/shared/functions/formatters/grants';
  import { sanitizeHtml } from '@repo/shared/utils/sanitize';
  import {
    searchBoxGrantsStyles,
    currentRefinementsStyles,
    refinementListStyles,
    panelStyles,
    statsStyles,
    poweredByGrantsStyles,
  } from './config/searchStyles';
  import {
    PUBLIC_ALGOLIA_APP_ID_GRANTS,
    PUBLIC_ALGOLIA_SEARCH_ONLY_KEY_GRANTS,
    PUBLIC_ALGOLIA_INDEX_NAME_GRANTS,
  } from '$env/static/public';

  type AlgoliaInstance = InstantSearch;

  interface CustomSearchRequest {
    indexName: string;
    params: {
      highlightPostTag: string;
      highlightPreTag: string;
      hitsPerPage: number;
      query: string;
    };
  }

  type T = Record<string, unknown> | FacetHits;

  interface Props {
    staticGrants: GrantsArray;
    grantsFacets: Facets[];
    ein: string;
  }

  let { staticGrants, grantsFacets, ein }: Props = $props();

  let remappedGrants = $derived(remapGrants(staticGrants));

  let currentYearFacets = $derived(grantsFacets[0]);

  const facets = [
    {
      facet: 'tax_year',
      label: 'Tax Year',
      show: false,
    },
    {
      facet: 'grantee_city',
      alt: 'city',
      label: 'City',
      show: true,
    },
    {
      facet: 'grantee_state',
      alt: 'state',
      label: 'State',
      show: true,
    },
    {
      facet: 'grantee_name',
      alt: 'name',
      label: 'Recipient',
      show: false,
    },
    {
      facet: 'grant_purpose',
      alt: 'purpose',
      label: 'Purpose',
      show: false,
    },
    {
      facet: 'grant_amount',
      alt: 'amount',
      label: 'Amount',
      show: true,
    },
  ];

  function showFacet(facetName: string) {
    return facets.some((facet) => facet.alt === facetName && facet.show);
  }

  function getFacetLabel(facetName: string) {
    const target = facets.find((facet) => facetName === facet.alt);
    return target?.label;
  }

  let searchClient: SearchClient;
  let algoliaInstance: AlgoliaInstance;
  const indexName = PUBLIC_ALGOLIA_INDEX_NAME_GRANTS;

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
    // Define a base search client
    // This will be extended to allow for static results on page load
    const baseSearchClient = algoliasearch(PUBLIC_ALGOLIA_APP_ID_GRANTS, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY_GRANTS);

    if (!baseSearchClient) throw new Error('Failed to init Algolia search client');

    // Extend the base search client
    // Prevents an initial round trip to Algolia
    searchClient = {
      ...baseSearchClient,
      search(requests: CustomSearchRequest[]) {
        if (requests.every(({ params }) => !params.query)) {
          return Promise.resolve<SearchResponses<T>>({
            // @ts-expect-error SearchResponse could be a facetHits response. There's no need to go into the underpinnings of the Algolia client to resolve
            results: requests.map(() => ({
              hits: remappedGrants?.slice(0, 10),
              query: '',
              params: '',
              nbHits: staticGrants?.length,
              processingTimeMS: 0,
              facets: {
                grantee_city: currentYearFacets.facets.city,
              },
            })),
          });
        }

        return baseSearchClient.search(requests);
      },
    } as SearchClient;

    algoliaInstance = instantsearch({
      indexName: indexName,
      searchClient,
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

    const cityRefinementListWithPanel = panelWidget({
      templates: {
        header(data, { html }) {
          return html`<span class="font-medium text-gray-900">City</span>`;
        },
      },
      hidden(options) {
        return options.results?.nbHits === 0;
      },
      cssClasses: panelStyles,
    })(refinementList);

    algoliaInstance.addWidgets([
      configure({
        /* @ts-expect-error Assumes PlainSearchParameters only, which is a narrow subset of all available search parameters*/
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
              count += `${data.nbHits} results`;
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

      cityRefinementListWithPanel({
        container: '#location',
        attribute: 'grantee_city',
        cssClasses: refinementListStyles,
        templates: {
          item(item: RefinementListItemData, { html }: { html: any }) {
            const { label, count, value, isRefined } = item;
            return html`
              <div class="${refinementListStyles.item}">
                <div class="flex h-5 shrink-0 items-center">
                  <div class="group grid size-4 grid-cols-1">
                    <input
                      type="checkbox"
                      value="${value}"
                      ${isRefined ? 'checked' : ''}
                      class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                    />
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                    >
                      <path
                        d="M3 8L6 11L11 3.5"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="opacity-0 group-has-[:checked]:opacity-100"
                      />
                      <path
                        d="M3 7H11"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="opacity-0 group-has-[:indeterminate]:opacity-100"
                      />
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
        },
        transformItems(items: RefinementListItemData[]) {
          return items.map((item: RefinementListItemData) => {
            if (item.isRefined) {
              //console.log(item);
            }
            return {
              ...item,
            };
          });
        },
      }),

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
    ]);

    algoliaInstance.start();
    // onAlgoliaInit(algoliaInstance);
  });
  onDestroy(() => {
    if (algoliaInstance) {
      algoliaInstance.dispose();
    }
  });
</script>

<div class="">
  <main class="max-w-8xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <!-- Search Box Section -->
    <div class="mb-8 flex gap-8">
      <div class="grow">
        <div class="relative rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            class="pointer-events-none absolute left-8 top-1/2 z-10 size-5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
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

    <div class="mx-auto max-w-7xl px-4 sm:flex sm:items-center sm:px-6 lg:px-8">
      <div id="stats" class="text-xs"></div>
    </div>

    <div class="flex gap-8">
      <!-- Results Section -->
      <div class="flex-1">
        <div class="">
          <div class="bg-slate-100">
            <div class="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
              <div class="text-sm font-medium text-slate-500">
                Filters
                <span class="sr-only">, active</span>
              </div>

              <div aria-hidden="true" class="hidden h-5 w-px bg-slate-300 sm:ml-4 sm:block"></div>

              <div class="mt-2 sm:ml-4 sm:mt-0">
                <div id="current-refinements">
                  <div class="-m-1 flex flex-wrap items-center">
                    <span
                      class="m-1 inline-flex items-center rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-slate-900"
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
          </div>
        </div>
        <div class="rounded-lg bg-white p-6 shadow">
          <!-- InstantSearch Hits -->
          <div id="hits"></div>
        </div>
      </div>

      <aside class="w-64 flex-shrink-0">
        <div class="sticky top-8 rounded-lg bg-white p-6 shadow">
          <!-- InstantSearch RefinementLists -->
          <div id="location"></div>
          <!-- <div id="amount">TODO</div> -->
          <!-- Static Refinements -->
          {#each Object.entries(currentYearFacets.facets) as [facetName, values]}
            {#if showFacet(facetName)}
              {@render panel(facetName, values)}
            {/if}
          {/each}
        </div>
      </aside>
    </div>
  </main>
</div>

{#snippet panel(facetName: string, facetValues: GrantsFacets)}
  <div class="py-6">
    <div class="flow-root">
      <!-- Expand/collapse section button -->
      <button
        type="button"
        class="mb-3 flex w-full items-center justify-between border-b border-gray-200 bg-white pb-1 text-sm text-gray-400 hover:text-gray-500"
        aria-controls="filter-section-0"
        aria-expanded="false"
      >
        <span class="font-medium text-gray-900">{getFacetLabel(facetName)}</span>
        <span class="ml-6 flex items-center">
          <!-- Expand icon, show/hide based on section open state. -->
          <!-- <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
            <path
              d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
            />
          </svg> -->
          <!-- Collapse icon, show/hide based on section open state. -->
          <!-- <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
            <path fill-rule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clip-rule="evenodd" />
          </svg> -->
        </span>
      </button>
    </div>
    <!-- Filter section, show/hide based on section state. -->
    <div class="" id="filter-section-0">
      <div class="space-y-2">
        {#each Object.entries(facetValues).slice(0, 3) as [key, value]}
          <div class="flex gap-3">
            <div class="flex h-5 shrink-0 items-center">
              <div class="group grid size-4 grid-cols-1">
                <input
                  id="filter-color-0"
                  name="color[]"
                  value="white"
                  type="checkbox"
                  class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                />
                <svg
                  class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    class="opacity-0 group-has-[:checked]:opacity-100"
                    d="M3 8L6 11L11 3.5"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    class="opacity-0 group-has-[:indeterminate]:opacity-100"
                    d="M3 7H11"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            <label for="filter-color-0" class="flex w-full flex-row items-center justify-between text-sm text-gray-600">
              <div>{key}</div>
              <div>{value}</div>
            </label>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/snippet}
