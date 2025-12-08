/**
 * Centralized Tailwind CSS class configurations for Algolia InstantSearch widgets
 *
 * These configurations provide consistent styling across all InstantSearch implementations
 * using the cssClasses API, avoiding global style pollution.
 *
 * Usage:
 * import { searchBoxStyles, hitsStyles } from '$lib/config/instantsearch-styles';
 *
 * searchBox({
 *   container: '#searchbox',
 *   cssClasses: searchBoxStyles,
 * })
 */

/**
 * SearchBox widget styles
 * Used for the main search input field
 */
export const searchBoxStyles = {
  root: '',
  form: '',
  input: '',
  submit: 'hidden',
  reset: '',
  loadingIndicator: 'hidden',
} as const;

/**
 * SearchBox styles for modal dialog implementations
 * Enhanced with specific positioning and styling for modal contexts
 */
export const searchBoxModalStyles = {
  root: 'col-start-1 row-start-1 w-full',
  form: 'relative',
  input:
    'col-start-1 row-start-1 h-12 w-full border-0 pl-1 pr-4 text-base text-gray-900 outline-hidden placeholder:text-gray-400! sm:text-sm dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500',
  submit: 'hidden',
  reset: 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600',
  loadingIndicator: 'hidden',
} as const;

/**
 * SearchBox styles for foundation search components
 */
export const searchBoxFoundationStyles = {
  root: '',
  form: '',
  input:
    'w-full rounded-md border-0 bg-gray-100 px-4 py-2.5 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
  submit: 'hidden',
  reset: 'hidden',
  loadingIndicator: 'hidden',
} as const;

/**
 * SearchBox styles for grants search with modern form styling
 */
export const searchBoxGrantsStyles = {
  root: '',
  form: 'flex flex-row-reverse rounded-md bg-white outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600',
  input: 'block min-w-0 grow px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6',
  submit: 'bg-slate-100 p-4 pointer-events-none',
  submitIcon: 'fill-gray-700',
  reset: 'hidden',
  loadingIndicator: 'hidden',
} as const;

/**
 * Hits widget styles
 * Used for search results lists
 */
export const hitsStyles = {
  root: '-mx-2 text-sm text-gray-700 dark:text-gray-300',
  list: '',
  item: '',
} as const;

/**
 * Hits styles for foundation search with alternating row colors
 */
export const hitsFoundationStyles = {
  root: '',
  list: '',
  item: 'odd:bg-white even:bg-slate-50',
} as const;

/**
 * Highlight component styles
 * Used for highlighting search terms in results via components.Highlight()
 */
export const highlightStyles = {
  root: '',
  highlighted: 'bg-blue-100 dark:bg-blue-800',
  nonHighlighted: '',
  separator: '',
} as const;

/**
 * Snippet component styles
 * Used for highlighting search terms in snippets via components.Snippet()
 */
export const snippetStyles = {
  root: '',
  highlighted: 'bg-blue-100 dark:bg-blue-800',
  nonHighlighted: '',
} as const;

/**
 * PoweredBy widget styles
 * Shows "Search by Algolia" branding
 */
export const poweredByStyles = {
  root: '',
  link: '',
  logo: 'h-4',
} as const;

/**
 * PoweredBy styles for grants search
 */
export const poweredByGrantsStyles = {
  root: '',
  link: '',
  logo: 'w-full!',
} as const;

/**
 * RefinementList widget styles
 * Used for faceted search filters
 */
export const refinementListStyles = {
  root: '',
  list: '',
  item: 'flex items-center justify-between text-sm/6',
  label: 'font-medium text-gray-900 hover:text-indigo-500',
  checkbox: '',
  labelText: '',
  count: 'text-gray-500',
  showMore: 'bg-transparent border-0 p-0 cursor-pointer',
} as const;

/**
 * CurrentRefinements widget styles
 * Shows active filters with remove buttons
 */
export const currentRefinementsStyles = {
  root: '',
  list: '',
  item: 'm-1 inline-flex items-center rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-slate-900',
  category: 'text-sm',
  label: 'pr-2 uppercase text-xs text-slate-400',
  delete: 'size-6 text-slate-500 mr-2',
} as const;

/**
 * Stats widget styles
 * Displays search results count and timing
 */
export const statsStyles = {
  root: 'text-xs',
  text: '',
} as const;

/**
 * Pagination widget styles
 */
export const paginationStyles = {
  root: '',
  list: '',
  item: '',
  link: '',
  selectedItem: '',
} as const;

/**
 * Selected pagination item style (to be applied via global CSS if needed)
 */
export const paginationSelectedStyles = `
  .ais-Pagination-item--selected .ais-Pagination-link {
    @apply bg-indigo-600 text-white;
  }
`;
