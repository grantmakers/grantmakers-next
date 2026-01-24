import { liteClient as algoliasearch } from 'algoliasearch/lite';
import type { SearchClient } from 'instantsearch.js';
import type { FacetHits, SearchResponses, Hit } from '@algolia/client-search';
import type { AutocompleteHit } from '@repo/shared/typings/algolia/profiles';
import { PUBLIC_ALGOLIA_APP_ID, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY, PUBLIC_ALGOLIA_INDEX_NAME } from '$env/static/public';
import placeholderHits from '@repo/shared/data/public/autocomplete-static-data.json';

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

export const PLACEHOLDER_HITS_COUNT = 5;
const limitedHits = (placeholderHits as AutocompleteHit[]).slice(0, 5).map((hit) => ({
  ...hit,
  // Ensure _highlightResult exists for all hits to support highlighting
  _highlightResult: hit._highlightResult || {
    organization_name: {
      value: hit.organization_name,
      matchLevel: 'none' as const,
      matchedWords: [],
      fullyHighlighted: false,
    },
  },
}));
export const INDEX_NAME = PUBLIC_ALGOLIA_INDEX_NAME;
const baseSearchClient = algoliasearch(PUBLIC_ALGOLIA_APP_ID, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY);

if (!baseSearchClient) {
  // TODO Properly handle error
  throw new Error('Failed to init Algolia search client');
}

export const searchClient = {
  ...baseSearchClient,
  search(requests: CustomSearchRequest[]) {
    if (requests.every(({ params }) => !params.query)) {
      return Promise.resolve<SearchResponses<T>>({
        results: requests.map(() => ({
          hits: limitedHits as Hit<AutocompleteHit & Record<string, unknown>>[],
          query: '',
          params: '',
          nbHits: limitedHits.length,
          processingTimeMS: 0,
        })),
      });
    }
    return baseSearchClient.search(requests);
  },
} as SearchClient;
