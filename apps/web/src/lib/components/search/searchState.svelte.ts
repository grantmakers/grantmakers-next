import type { InstantSearch } from 'instantsearch.js';

export const searchState = $state({
  algoliaInstance: null as InstantSearch | null,
  query: '',
  isSearchActive: false,
});

export function handleAlgoliaInit(instance: InstantSearch) {
  searchState.algoliaInstance = instance;
  if (searchState.query) {
    restoreSearch();
  }
}

export function handleSearchInput(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  searchState.query = value;
  searchState.isSearchActive = true;

  performSearch(value);

  if (searchState.algoliaInstance?.helper) {
    searchState.algoliaInstance.helper.setQuery(value).search();
  }
}

export function clearSearch() {
  searchState.query = '';
  searchState.isSearchActive = false;

  if (searchState.algoliaInstance?.helper) {
    searchState.algoliaInstance.helper.setQuery('').search();
  }
}

export function restoreSearch() {
  if (searchState.query && searchState.isSearchActive) {
    performSearch(searchState.query);
  }
}

function performSearch(query: string) {
  if (searchState.algoliaInstance?.helper) {
    searchState.algoliaInstance.helper.setQuery(query).search();
  }
}
