<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import instantsearch, { type InstantSearch } from 'instantsearch.js';
  import { searchBox, hits, poweredBy, configure } from 'instantsearch.js/es/widgets';
  import { formatEin } from '@repo/shared/functions/formatters/ein';
  import type { FacetHits, SearchResponses } from '@algolia/client-search';
  import type { LiteClient } from 'algoliasearch/lite';
  import placeholderHits from '@repo/shared/data/public/autocomplete-static-data.json';

  import { PUBLIC_ALGOLIA_APP_ID, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY, PUBLIC_ALGOLIA_INDEX_NAME } from '$env/static/public';
  import { normalizeCurrencyToMillions } from '@repo/shared/functions/formatters/numbers';

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
    onAlgoliaInit: (instance: AlgoliaInstance) => void;
  }

  type PlaceholderHit = (typeof placeholderHits)[number];

  let { onAlgoliaInit }: Props = $props();

  let searchClient: LiteClient;
  const indexName = PUBLIC_ALGOLIA_INDEX_NAME;
  let algoliaInstance: AlgoliaInstance;
  // let percentile: number | 'N/A' = (rank, total): Rank => {
  //   return rank !== undefined ? ((total - rank) / total) * 100 : 'N/A';
  // };
  const getLabel = (pct: number | 'N/A') => {
    if (pct === 'N/A') return 'N/A';
    if (pct >= 99) return 'Top 1%';
    if (pct >= 90) return 'Top 10%';
    if (pct >= 75) return 'Top 25%';
    if (pct >= 50) return 'Top 50%';
    if (pct < 50) return '<50%';
    return `Top ${(100 - pct).toFixed(0)}%`;
  };

  // TODO Pull from new badgeStyles.ts utility
  let getColorClasses = (pct: number | 'N/A') => {
    if (pct === 'N/A') return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    if (pct >= 99) return 'bg-green-50 text-green-700 ring-green-600/20';
    if (pct >= 90) return 'bg-green-50 text-green-700 ring-green-600/20'; // Green
    if (pct >= 75) return 'bg-blue-50 text-blue-700 ring-blue-700/10'; // blue
    if (pct >= 50) return 'bg-indigo-50 text-indigo-700 ring-indigo-700/10'; // Indigo
    // if (pct >= 30) return 'bg-purple-50 text-purple-700 ring-purple-700/10'; // Purple
    return 'bg-gray-50 text-gray-600 ring-gray-500/10';
  };

  onMount(async () => {
    const { liteClient: algoliasearch } = await import('algoliasearch/lite');
    // Start with a base search client - we'll extend this later
    const baseSearchClient = algoliasearch(PUBLIC_ALGOLIA_APP_ID, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY);

    // Extend the base search client so we can capture empty queries and show placeholder results instead of making an initial round trip to Algolia
    searchClient = {
      ...baseSearchClient,
      // @ts-expect-error SearchResponse could be a facetHits response. There's no need to go into the underpinnings of the Algolia client to resolve
      search(requests: CustomSearchRequest[]) {
        if (requests.every(({ params }) => !params.query)) {
          return Promise.resolve<SearchResponses<T>>({
            results: requests.map(() => ({
              hits: placeholderHits,
              query: '',
              params: '',
              nbHits: placeholderHits.length,
              processingTimeMS: 0,
            })),
          });
        }

        return baseSearchClient.search(requests);
      },
    };

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

    algoliaInstance.addWidgets([
      configure({
        hitsPerPage: 8,
      }),

      searchBox({
        container: '#instantsearch',
        searchAsYouType: true,
        cssClasses: {
          root: 'hidden',
        },
      }),

      hits({
        container: '#hits',
        cssClasses: {
          item: 'odd:bg-white even:bg-slate-50',
        },
        templates: {
          item: (item: PlaceholderHit, { html }) => {
            const url = `/profiles/v1/${item.ein}-${item.organization_name_slug}`;
            let percentile: number | 'N/A' = item.rank !== undefined ? ((item.rank_total - item.rank) / item.rank_total) * 100 : 'N/A';
            return html`<a href="${url}"
              ><div class="flex items-center justify-between gap-x-6 py-5">
                <div class="w-full min-w-0">
                  <div class="flex items-start justify-between gap-x-3">
                    <div class="text-normal/6 font-semibold text-gray-900">${item.organization_name}</div>
                    <p
                      class="${getColorClasses(
                        percentile,
                      )} mt-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset"
                    >
                      ${getLabel(percentile)}
                    </p>
                  </div>
                  <div class="mt-1 flex w-full items-center justify-between gap-x-2 text-xs/5 text-gray-500">
                    <div class="flex items-center gap-x-2">
                      <p class="whitespace-nowrap">${item.city}, ${item.state}</p>
                      <svg viewBox="0 0 2 2" class="size-0.5 fill-current">
                        <circle cx="1" cy="1" r="1" />
                      </svg>
                      <p class="truncate">${formatEin(item.ein)}</p>
                    </div>
                    <div>${normalizeCurrencyToMillions(item.assets)}</div>
                  </div>
                </div>
              </div></a
            >`;
          },
          empty(results, { html }) {
            return html`<div class="mb-4">No results for <q>${results.query}</q></div>`;
          },
        },
      }),

      poweredBy({
        container: '#powered-by',
        theme: 'light',
      }),
    ]);

    algoliaInstance.start();
    onAlgoliaInit(algoliaInstance);
  });
  onDestroy(() => {
    if (algoliaInstance) {
      algoliaInstance.dispose();
    }
  });
</script>
