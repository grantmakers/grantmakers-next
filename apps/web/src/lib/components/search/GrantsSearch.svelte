<script lang="ts">
  import '@tailwindplus/elements';
  import { browser } from '$app/environment';
  import { onDestroy, onMount } from 'svelte';
  import { pushState, replaceState } from '$app/navigation';
  import instantsearch, { type InstantSearch, type SearchClient, type TemplateParams, type UiState } from 'instantsearch.js';
  import type { $TSFixMe } from '@repo/shared/typings/irs/all';
  import { history } from 'instantsearch.js/es/lib/routers';
  import {
    searchBox,
    poweredBy,
    refinementList,
    numericMenu,
    currentRefinements,
    clearRefinements,
    stats,
    panel as panelWidget,
    pagination,
  } from 'instantsearch.js/es/widgets';
  import { connectHits, connectConfigure } from 'instantsearch.js/es/connectors';
  import type { ConfigureRenderState } from 'instantsearch.js/es/connectors/configure/connectConfigure';
  import type { HitsRenderState } from 'instantsearch.js/es/connectors/hits/connectHits';
  import type { PlainSearchParameters } from 'algoliasearch-helper';
  import { formatToCurrency, formatNumber, humanizeCurrency } from '@repo/shared/functions/formatters/numbers';
  import { escapeAttr } from '@repo/shared/utils/strings';
  import {
    searchBoxGrantsStyles,
    currentRefinementsStyles,
    clearRefinementsStyles,
    refinementListStyles,
    refinementListCompactStyles,
    highlightStyles,
    clickableTextStyles,
    panelStyles,
    statsStyles,
    poweredByGrantsStyles,
    paginationStyles,
    numericMenuStyles,
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
    collapsedByDefault?: boolean;
    showMore?: boolean;
    sortBy?: string[];
  }

  interface RouteState {
    query?: string;
    grantee_state?: string;
    grantee_city?: string;
    grantee_name?: string;
    grant_purpose?: string;
    tax_year?: string;
    grant_amount?: string;
    page?: number;
  }

  // Grant amount range options matching the Grants Summary chart buckets
  const GRANT_AMOUNT_RANGES = [
    { label: 'All amounts' },
    { label: 'Under $500', end: 499 },
    { label: '$500 – $5k', start: 500, end: 4999 },
    { label: '$5k – $25k', start: 5000, end: 24999 },
    { label: '$25k – $100k', start: 25000, end: 99999 },
    { label: '$100k – $500k', start: 100000, end: 499999 },
    { label: '$500k+', start: 500000 },
  ] as const;

  let mobileFiltersOpen = $state(false);
  let searchAllFoundations = $state(false);

  let algoliaInstance: AlgoliaInstance;
  let refineConfig: ConfigureRenderState['refine'] | null = null;
  let hitsContainer: HTMLElement | null = null;

  const FACETS: readonly FacetConfig[] = [
    { attribute: 'tax_year', label: 'Tax Year', container: '#tax-year', collapsedByDefault: true, showMore: false, sortBy: ['name:desc'] },
    { attribute: 'grantee_state', label: 'State', container: '#state' },
    { attribute: 'grantee_city', label: 'City', container: '#location' },
    { attribute: 'grantee_name', label: 'Recipient', container: '#recipient', compact: true },
    { attribute: 'grant_purpose', label: 'Purpose', container: '#purpose', compact: true },
  ];

  const EIN_FILTER_OPTIONS = [
    { value: 'current', label: 'this foundation' },
    { value: 'all', label: 'all foundations' },
  ] as const;

  // Searchable fields configuration for the "Fields to Search" dropdown
  const SEARCHABLE_FIELDS = [
    { id: 'grantee_name', label: 'Grantee Name' },
    { id: 'grantee_city', label: 'Grantee City' },
    { id: 'grant_purpose', label: 'Grant Purpose' },
  ] as const;

  // Map attribute names to human-readable labels for currentRefinements
  const FACET_LABEL_MAP: { [key: string]: string } = {
    ...Object.fromEntries(FACETS.map((f) => [f.attribute, f.label])),
    grant_amount: 'Amount',
  };

  /**
   * Format grant_amount refinements to human-readable labels
   * Transforms numeric values like 25000 to "$25K" using the shared humanizeCurrency helper
   */
  const formatGrantAmountRefinements = <T extends { label: string; value: number | string; operator?: string }>(refinements: T[]): T[] => {
    return refinements.map((ref) => {
      const numValue = typeof ref.value === 'number' ? ref.value : parseFloat(String(ref.value));
      if (!isNaN(numValue)) {
        const formattedValue = humanizeCurrency(numValue);
        const label = ref.operator ? `${ref.operator} ${formattedValue}` : formattedValue;
        return { ...ref, label };
      }
      return ref;
    });
  };

  // Fields to Search dropdown state
  let selectedFields = $state<string[]>(SEARCHABLE_FIELDS.map((f) => f.id));
  let fieldsDropdownOpen = $state(false);
  let hoveredField = $state<string | null>(null);
  let showFieldWarning = $state(false);
  let fieldWarningTimeout: ReturnType<typeof setTimeout> | null = null;

  // Derived state for label
  const allFieldsSelected = $derived(selectedFields.length === SEARCHABLE_FIELDS.length);
  const fieldsLabel = $derived(allFieldsSelected ? 'all fields' : 'selected fields');

  /**
   * Create panel widget configuration with optional collapsible behavior
   * Shared helper used for both createFacetWidget and standalone panel-wrapped widgets
   */
  const createPanelConfig = (label: string, collapsedByDefault?: boolean) => {
    const isCollapsible = collapsedByDefault !== undefined;
    return {
      templates: {
        header(_data: unknown, { html }: TemplateParams) {
          return html`<span class="font-medium text-gray-900">${label}</span>`;
        },
        // Render chevron icon for collapsible panels
        ...(isCollapsible && {
          collapseButtonText({ collapsed }: { collapsed: boolean }, { html }: TemplateParams) {
            return html`
              <span class="sr-only">${collapsed ? 'Expand' : 'Collapse'} ${label}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="${collapsed ? '' : 'rotate-180'} size-5 text-gray-400 transition-transform duration-200"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            `;
          },
        }),
      },
      hidden(options: $TSFixMe) {
        return options.results?.nbHits === 0;
      },
      // Set initial collapsed state - only applies when collapsed function is defined
      ...(isCollapsible && {
        collapsed() {
          return collapsedByDefault ?? false;
        },
      }),
      cssClasses: panelStyles,
    };
  };

  /**
   * Factory function to create a Panel-wrapped RefinementList widget
   * Supports collapsible panels with optional collapsed-by-default behavior
   */
  const createFacetWidget = (facet: FacetConfig) => {
    const panelConfig = createPanelConfig(facet.label, facet.collapsedByDefault);
    const panelWrappedRefinementList = panelWidget(panelConfig)(refinementList);

    // Determine showMore: default true unless explicitly set to false
    const showMore = facet.showMore !== false;

    return panelWrappedRefinementList({
      container: facet.container,
      attribute: facet.attribute,
      limit: showMore ? 5 : 20,
      showMore,
      ...(facet.sortBy && { sortBy: facet.sortBy }),
      cssClasses: facet.compact ? refinementListCompactStyles : refinementListStyles,
      templates:
        showMore ?
          {
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
              return html`<span class="flex items-center gap-1 text-sm text-indigo-700 hover:text-indigo-900">${text} ${chevron}</span>`;
            },
          }
        : {},
    });
  };

  /**
   * Handle click-to-filter on table cells
   * Uses InstantSearch's helper API to add facet refinements (additive only)
   * Note: This uses addFacetRefinement (not toggle) so clicking a cell always adds the filter.
   */
  const handleCellClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const cell = target.closest('td[data-facet]') as HTMLElement | null;
    if (!cell || !algoliaInstance?.helper) return;

    const facets = cell.dataset.facet?.split(',') ?? [];
    const values = cell.dataset.facetValue?.split(',') ?? [];

    if (facets.length > 0 && facets.length === values.length) {
      let hasNewRefinements = false;

      // Add refinements only if they don't already exist
      // Uses disjunctive refinements since refinementList widgets use disjunctive facets
      facets.forEach((facet, index) => {
        const value = values[index]?.trim();
        const facetTrimmed = facet.trim();
        if (facetTrimmed && value && !algoliaInstance.helper!.state.isDisjunctiveFacetRefined(facetTrimmed, value)) {
          algoliaInstance.helper!.addDisjunctiveFacetRefinement(facetTrimmed, value);
          hasNewRefinements = true;
        }
      });

      // Only trigger search if we added new refinements
      if (hasNewRefinements) {
        algoliaInstance.helper.search();
      }
    }
  };

  const renderHits = (renderOptions: HitsRenderState) => {
    const { items, results } = renderOptions;
    const hitsContainer = document.querySelector('#hits');

    if (!hitsContainer) {
      return 'No hits container found';
    }

    // Highlight hits
    // The docs only provide example for the Highlights widget in the context of a Hits widget. We use a Hits Connector.
    // There are likely better ways to do this, but this works for now.
    const replaceHighlightTags = (value: string) => {
      if (!value) return '';
      return value.replace(/<mark>/g, ` <span class="${highlightStyles.highlighted}">`).replace(/<\/mark>/g, '</span>');
    };

    const getHighlight = (hit: $TSFixMe, attr: string) => {
      const value = hit._highlightResult?.[attr]?.value || hit[attr];
      return replaceHighlightTags(value);
    };

    // --- Empty State ---
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
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-center">Amount</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Grantee</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Purpose</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Year</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          ${items
            .map(
              (grant) => `
              <tr class="relative even:bg-gray-50 align-top">
                <td class="px-3 py-4 text-sm text-right tabular-nums">
                  ${formatToCurrency(grant.grant_amount)}
                </td>
                
                <td class="px-3 py-4 text-sm" data-facet="grantee_name" data-facet-value="${escapeAttr(grant.grantee_name)}">
                  <div class="text-md font-bold text-gray-900">
                    <span class="${clickableTextStyles.base}">${getHighlight(grant, 'grantee_name')}</span>
                  </div>
                </td>
                
                <td class="px-3 py-4 text-sm" data-facet="grant_purpose" data-facet-value="${escapeAttr(grant.grant_purpose)}">
                  <span class="${clickableTextStyles.base}">${getHighlight(grant, 'grant_purpose')}</span>
                </td>
                
                <td class="px-3 py-4 text-sm" data-facet="grantee_city,grantee_state" data-facet-value="${escapeAttr(grant.grantee_city)},${escapeAttr(grant.grantee_is_foreign && grant.grantee_state === 'Foreign' ? grant.grantee_country : grant.grantee_state)}">
                  <span class="${clickableTextStyles.base}">
                    ${getHighlight(grant, 'grantee_city')},<br>
                    ${grant.grantee_is_foreign && grant.grantee_state === 'Foreign' ? grant.grantee_country : grant.grantee_state}
                  </span>
                </td>
                
                <td class="px-3 py-4 text-sm" data-facet="tax_year" data-facet-value="${escapeAttr(grant.tax_year)}">
                  <span class="${clickableTextStyles.base}">${grant.tax_year}</span>
                </td>
              </tr>`,
            )
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
              tax_year: indexUiState.refinementList?.tax_year?.join('~'),
              grant_amount: indexUiState.numericMenu?.grant_amount?.replace(':', '~'),
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
            if (routeState.tax_year) refinementList.tax_year = routeState.tax_year.split('~');

            // Build numericMenu state if grant_amount exists
            const numericMenuState: { [attribute: string]: string } = {};
            if (routeState.grant_amount) numericMenuState.grant_amount = routeState.grant_amount.replace('~', ':');

            return {
              [PUBLIC_ALGOLIA_INDEX_NAME_GRANTS]: {
                query: routeState.query,
                refinementList,
                numericMenu: numericMenuState,
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
          return items.map((item) => {
            // For grant_amount refinements, transform to human-readable labels
            if (item.attribute === 'grant_amount' && item.refinements?.length > 0) {
              return {
                ...item,
                label: FACET_LABEL_MAP[item.attribute] || item.label,
                refinements: formatGrantAmountRefinements(item.refinements),
              };
            }
            return {
              ...item,
              label: FACET_LABEL_MAP[item.attribute] || item.label,
            };
          });
        },
      }),

      // Desktop Clear Refinements
      clearRefinements({
        container: '#clear-refinements',
        cssClasses: clearRefinementsStyles,
        templates: {
          resetLabel(_data, { html }) {
            return html`Clear all`;
          },
        },
      }),

      // Mobile Clear Refinements (same widget, different container)
      clearRefinements({
        container: '#clear-refinements-mobile',
        cssClasses: clearRefinementsStyles,
        templates: {
          resetLabel(_data, { html }) {
            return html`Clear all`;
          },
        },
      }),

      // Grant Amount uses numericMenu (radio buttons for numeric ranges) instead of refinementList,
      // so it's handled separately from the FACETS array which uses createFacetWidget for refinementList widgets
      panelWidget(createPanelConfig('Amount', true))(numericMenu)({
        container: '#grant-amount',
        attribute: 'grant_amount',
        items: GRANT_AMOUNT_RANGES as unknown as Array<{ label: string; start?: number; end?: number }>,
        cssClasses: numericMenuStyles,
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

    // Attach single click handler via event delegation
    hitsContainer = document.querySelector('#hits');
    if (hitsContainer) {
      hitsContainer.addEventListener('click', handleCellClick);
    }
  });
  onDestroy(() => {
    if (algoliaInstance) {
      algoliaInstance.dispose();
    }
    if (fieldWarningTimeout) {
      clearTimeout(fieldWarningTimeout);
    }
    if (hitsContainer) {
      hitsContainer.removeEventListener('click', handleCellClick);
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

    // Use refine() to update the filter dynamically, including current restrictSearchableAttributes
    refineConfig({
      hitsPerPage: 15,
      filters: searchAllFoundations ? '' : 'ein:' + ein,
      ...(selectedFields.length < SEARCHABLE_FIELDS.length && { restrictSearchableAttributes: selectedFields }),
    } as PlainSearchParameters);
  }

  /**
   * Update Algolia restrictSearchableAttributes based on selected fields
   */
  function updateRestrictSearchableAttributes() {
    if (!refineConfig) return;

    refineConfig({
      hitsPerPage: 15,
      filters: searchAllFoundations ? '' : 'ein:' + ein,
      // Only pass restrictSearchableAttributes if not all fields are selected
      ...(selectedFields.length < SEARCHABLE_FIELDS.length && { restrictSearchableAttributes: selectedFields }),
    } as PlainSearchParameters);
  }

  /**
   * Toggle field selection with last-field protection
   */
  function handleFieldToggle(fieldId: string) {
    const isCurrentlySelected = selectedFields.includes(fieldId);

    // Prevent unchecking the last field
    if (isCurrentlySelected && selectedFields.length === 1) {
      showFieldWarning = true;
      // Clear any existing timeout
      if (fieldWarningTimeout) clearTimeout(fieldWarningTimeout);
      fieldWarningTimeout = setTimeout(() => {
        showFieldWarning = false;
      }, 2000);
      return;
    }

    showFieldWarning = false;
    if (isCurrentlySelected) {
      selectedFields = selectedFields.filter((id) => id !== fieldId);
    } else {
      selectedFields = [...selectedFields, fieldId];
    }

    updateRestrictSearchableAttributes();
  }

  /**
   * Select all fields
   * UX: Auto-closes the dropdown as this is a terminal action
   */
  function handleSelectAllFields() {
    showFieldWarning = false;
    selectedFields = SEARCHABLE_FIELDS.map((f) => f.id);
    updateRestrictSearchableAttributes();
    closeFieldsDropdown();
  }

  /**
   * Select only a specific field
   * UX: Auto-closes the dropdown as this is a terminal action
   */
  function handleSelectOnlyField(fieldId: string) {
    showFieldWarning = false;
    selectedFields = [fieldId];
    updateRestrictSearchableAttributes();
    closeFieldsDropdown();
  }

  /**
   * Close fields dropdown
   */
  function closeFieldsDropdown() {
    fieldsDropdownOpen = false;
    hoveredField = null;
  }

  /**
   * Handle keyboard events for the fields dropdown (global Escape key)
   */
  function handleFieldsDropdownKeydown(event: KeyboardEvent) {
    if (fieldsDropdownOpen && event.key === 'Escape') {
      closeFieldsDropdown();
    }
  }
</script>

<svelte:window onkeydown={handleFieldsDropdownKeydown} />

<!--
  Using data-sveltekit-preload-data="tap" to prevent SvelteKit from preloading data on hover for the pagination and other links.
  This limits unnecessary calls to Cloudflare/Algolia until we have a better handle on traffic patterns.
-->
<main
  id="grants-search-top"
  class="lg:max-w-8xl mx-auto max-w-full scroll-mt-24 px-4 py-8 sm:px-6 lg:px-8"
  data-sveltekit-preload-data="tap"
>
  <div class="flex flex-col items-center gap-4 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
    <div class="w-full flex-1">
      <!-- Search Box Section -->
      <div class="flex gap-8">
        <div class="grow">
          <div class="relative flex items-center justify-between gap-2 rounded-lg bg-slate-100 p-2 shadow md:p-4 lg:gap-4 dark:bg-gray-800">
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
            <div id="search" class="grow"></div>
            <div class="lg:flex lg:w-64 lg:shrink-0 lg:items-center lg:justify-center">
              <div id="powered-by"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Layout: Filters + Powered By (Row 2 on Mobile) -->
    <!-- Desktop Layout: Filters hidden, Powered By joins Row 1 via lg:contents -->
    <div class="flex w-full items-center justify-between gap-4 lg:hidden">
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
      <!-- Mini-filter bar -->
      <div class="hidden flex-wrap items-center gap-1.5 rounded bg-slate-50 px-2 py-3 text-sm text-slate-500 md:flex">
        <span>Searching grants from</span>
        <!-- Tailwind Elements web components cause hydration mismatch during SSR; render only on client -->
        {#if browser}
          <el-select
            id="ein-filter-select"
            name="ein-scope"
            value={searchAllFoundations ? 'all' : 'current'}
            class="inline-block"
            onchange={handleEinFilterToggle}
          >
            <button
              type="button"
              class="grid cursor-default grid-cols-1 rounded-md bg-white py-0.5 pr-1.5 pl-2 text-left text-sm text-slate-500 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:focus-visible:outline-indigo-500"
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
                  class="group/option relative block cursor-default py-2 pr-9 pl-3 text-slate-900 select-none focus:bg-indigo-600 focus:text-white focus:outline-hidden dark:text-white dark:focus:bg-indigo-500"
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
        {:else}
          <span class="font-medium">this foundation</span>
        {/if}
        <span>across</span>
        {#if browser}
          <!-- Fields to Search Dropdown -->
          <div class="relative">
            <!-- Trigger Button -->
            <button
              type="button"
              onclick={() => (fieldsDropdownOpen = !fieldsDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={fieldsDropdownOpen}
              aria-label="Fields to search"
              class="grid cursor-default grid-cols-1 rounded-md bg-white py-0.5 pr-1.5 pl-2 text-left text-sm text-slate-500 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:focus-visible:outline-indigo-500"
            >
              <span class="col-start-1 row-start-1 truncate pr-4">{fieldsLabel}</span>
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
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

            <!-- Dropdown Panel -->
            {#if fieldsDropdownOpen}
              <!-- Backdrop for outside click -->
              <button
                type="button"
                class="fixed inset-0 z-10 cursor-default"
                onclick={closeFieldsDropdown}
                aria-label="Close dropdown"
                tabindex="-1"
              ></button>

              <div
                class="absolute top-full left-0 z-20 mt-1 min-w-[200px] rounded-lg border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-gray-800"
              >
                <!-- Select All Link -->
                <div class="border-b border-slate-100 px-3 py-2 dark:border-white/10">
                  <button
                    type="button"
                    onclick={handleSelectAllFields}
                    disabled={allFieldsSelected}
                    class="text-xs {allFieldsSelected ?
                      'cursor-not-allowed text-slate-400 dark:text-slate-500'
                    : 'text-indigo-600 hover:text-indigo-800 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300'}"
                  >
                    Select all
                  </button>
                </div>

                <!-- Checkbox List -->
                <div class="py-1">
                  {#each SEARCHABLE_FIELDS as field (field.id)}
                    {@const isSelected = selectedFields.includes(field.id)}
                    {@const isLastSelected = isSelected && selectedFields.length === 1}
                    <div
                      class="group flex items-center justify-between px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5"
                      role="group"
                      onmouseenter={() => (hoveredField = field.id)}
                      onmouseleave={() => (hoveredField = null)}
                    >
                      <!-- Checkbox with label -->
                      <label class="flex flex-1 items-center gap-2.5 {isLastSelected ? 'cursor-not-allowed' : 'cursor-pointer'}">
                        <div class="group/checkbox grid size-4 grid-cols-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onchange={() => handleFieldToggle(field.id)}
                            class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-white/20 dark:bg-white/5 dark:checked:border-indigo-500 dark:checked:bg-indigo-500 {(
                              isLastSelected
                            ) ?
                              'cursor-not-allowed'
                            : ''}"
                          />
                          <svg
                            viewBox="0 0 14 14"
                            fill="none"
                            class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white"
                          >
                            <path
                              d="M3 8L6 11L11 3.5"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="opacity-0"
                              class:opacity-100={isSelected}
                            />
                          </svg>
                        </div>
                        <span class="text-sm text-slate-700 dark:text-slate-200">{field.label}</span>
                      </label>

                      <!-- "Only" link on hover -->
                      {#if hoveredField === field.id && !isLastSelected}
                        <button
                          type="button"
                          onclick={() => handleSelectOnlyField(field.id)}
                          class="ml-2 text-xs text-indigo-600 hover:text-indigo-800 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          only
                        </button>
                      {/if}
                    </div>
                  {/each}
                </div>

                <!-- Warning Message -->
                {#if showFieldWarning}
                  <div class="border-t border-slate-100 bg-amber-50 px-3 py-2 dark:border-white/10 dark:bg-amber-900/20" role="alert">
                    <p class="text-xs text-amber-700 dark:text-amber-400">At least one field required</p>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <span class="font-medium">all fields (name, city, purpose)</span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Main Results Element -->
  <div class="flex gap-8">
    <div class="min-w-0 flex-1">
      <!-- Stats + Current Refinements -->
      <div class="hidden min-h-16 flex-wrap items-center gap-2 px-2 py-4 md:flex">
        <div id="stats"></div>
        <div id="current-refinements" class="contents"></div>
      </div>

      <div class="overflow-hidden rounded-lg bg-white shadow">
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
        <div class="flex items-center gap-4">
          <h2 class="text-lg font-medium text-gray-900">Filters</h2>
          <div id="clear-refinements-mobile"></div>
        </div>
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

      <div class="sticky top-0 space-y-6 rounded-lg lg:bg-white lg:p-6 lg:shadow">
        <!-- Desktop Header: Filters title + Clear all -->
        <div class="hidden items-center justify-between border-b border-gray-200 pb-3 lg:flex">
          <h2 class="text-base font-semibold text-gray-900">Filters</h2>
          <div id="clear-refinements"></div>
        </div>
        <!-- InstantSearch RefinementLists -->
        <div id="tax-year"></div>
        <div id="grant-amount"></div>
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
