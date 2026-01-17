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
  form: 'relative flex flex-row-reverse rounded-md bg-white dark:bg-gray-900 border-none',
  input:
    'block min-w-0 grow h-12 pl-11 pr-4 text-md bg-slate-100 focus:bg-white md:text-lg text-gray-900 border-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-gray-500 rounded ring-indigo-600',
  submit: 'hidden',
  submitIcon: 'hidden',
  reset: 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400',
  resetIcon: '',
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
 * Panel widget styles
 * Used to wrap widgets with headers/footers
 */
export const panelStyles = {
  root: '',
  noRefinementRoot: 'hidden',
  header: 'mb-3 flex w-full items-center justify-between border-b border-gray-200 bg-white pb-1 text-sm font-medium text-gray-900',
  body: '',
  footer: '',
} as const;

/**
 * RefinementList widget styles
 * Used for faceted search filters
 */
export const refinementListStyles = {
  root: 'root',
  list: 'space-y-3',
  item: 'flex w-full gap-3',
  innerItem: 'w-full',
  label: 'flex w-full grow flex-row items-start justify-between text-sm text-gray-600 cursor-pointer',
  labelText: 'ml-2 text-left break-words leading-snug',
  checkbox: 'mt-0.5 size-4 rounded border-gray-300 text-indigo-600 outline-hidden focus:outline-hidden ring-0 focus:ring-0',
  count: 'ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 shrink-0',
  selectedItem: 'font-semibold text-indigo-600',
  showMore: 'mt-4 w-full flex justify-end',
  disabledShowMore: '[&_span]:text-slate-400 pointer-events-none cursor-default',
} as const;

/**
 * Compact RefinementList widget styles
 * Used for facets with lengthy text (e.g. Recipient, Purpose) to improve readability and density.
 */
export const refinementListCompactStyles = {
  ...refinementListStyles,
  list: 'space-y-1.5',
  label: 'flex w-full grow flex-row items-start justify-between text-xs text-gray-600 cursor-pointer',
  labelText: 'ml-2 text-left break-words leading-tight',
  checkbox: 'mt-0.5 size-3.5 rounded border-gray-300 text-indigo-600 outline-hidden focus:outline-hidden ring-0 focus:ring-0',
  disabledShowMore: '[&_span]:text-slate-400 pointer-events-none cursor-default',
} as const;
/**
 * CurrentRefinements widget styles
 * Shows active filters with remove buttons
 */
export const currentRefinementsStyles = {
  root: 'contents',
  noRefinementRoot: 'hidden',
  list: 'contents',
  item: 'inline-flex items-center rounded-full bg-slate-100 py-1.5 pl-3 pr-2 text-sm font-medium text-slate-700',
  category: 'text-sm flex items-center',
  label: 'pr-2 uppercase text-xs text-slate-500',
  delete: 'ml-1 size-5 text-slate-400 hover:text-slate-600 cursor-pointer',
} as const;

/**
 * ClearRefinements widget styles
 * "Clear all" button to remove all active filters
 */
export const clearRefinementsStyles = {
  root: 'flex justify-center',
  button:
    'w-full rounded-md bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300 transition-colors cursor-pointer text-center',
  disabledButton: 'hidden',
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
  root: 'flex justify-center mt-8',
  list: 'flex gap-2',
  item: 'hidden sm:block',
  link: 'px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50',
  selectedItem: 'pointer-events-none [&_a]:bg-indigo-600 [&_a]:text-white [&_a]:border-indigo-600 [&_a]:cursor-default',
  disabledItem: 'pointer-events-none [&_a]:opacity-50 [&_a]:cursor-not-allowed',
} as const;

/**
 * Selected pagination item style (to be applied via global CSS if needed)
 */
export const paginationSelectedStyles = `
  .ais-Pagination-item--selected .ais-Pagination-link {
    @apply bg-indigo-600 text-white;
  }
`;

/**
 * MenuSelect widget styles
 * Used for single-select dropdown filters (e.g., Tax Year)
 */
export const menuSelectStyles = {
  root: 'inline-flex items-center',
  label: 'mr-2 text-sm text-gray-600',
  select:
    'rounded-md border border-gray-300 bg-white py-1.5 px-3 pr-8 text-sm text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer appearance-none bg-no-repeat bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236b7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E")]',
  option: '',
} as const;
