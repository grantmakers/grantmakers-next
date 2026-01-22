// @ts-nocheck
// Legacy JS ported from the previous version of Grantmakers.io.
// Added to suppress type checking errors while maintaining original functionality.

import { browser } from '$app/environment';
import { pushState, replaceState } from '$app/navigation';
import { algoliasearch } from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { history } from 'instantsearch.js/es/lib/routers';
import {
  configure,
  stats,
  searchBox,
  panel,
  rangeSlider,
  refinementList,
  clearRefinements,
  pagination,
  poweredBy,
} from 'instantsearch.js/es/widgets';
import { connectHits, connectRefinementList, connectCurrentRefinements } from 'instantsearch.js/es/connectors';
import { highlight } from 'instantsearch.js/es/helpers';
import { PUBLIC_ALGOLIA_APP_ID_GRANTS, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY_GRANTS, PUBLIC_ALGOLIA_INDEX_NAME_GRANTS } from '$env/static/public';

if (!PUBLIC_ALGOLIA_APP_ID_GRANTS || !PUBLIC_ALGOLIA_SEARCH_ONLY_KEY_GRANTS || !PUBLIC_ALGOLIA_INDEX_NAME_GRANTS) {
  throw new Error('Missing required Algolia public keys. Please ensure environment variables are set.');
}

let search;

export let searchState = $state({
  initialEmptyQuery: false,
  noHits: false,
});

// Materilize JS Plugins
let instances = {
  dropdowns: [],
  sidenavs: [],
  formSelects: [],
  scrollSpies: [],
  tooltips: [],
};

export async function initSearchJs(M) {
  // Capture InstantSearch warnings re Hogan templates
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (!args[0]?.includes('[InstantSearch.js]')) {
      originalWarn.apply(console, args);
    }
  };
  // Helper definitions
  // =======================================================
  const targetEIN = document.querySelector('h1.org-name').dataset.ein;
  const targetOrgName = document.querySelector('h1.org-name').dataset.name;
  const targetTaxYearOnlyOne = document.querySelector('h1.org-name').dataset.taxYearOnlyOne === 'true'; // resolves to boolean true or false

  const scrollAnchor = document.querySelector('#grants');
  // Note - fixed grants header handled by profile.js

  // Initialize Materialize components
  // =======================================================
  // Note: if the element is created dynamically via Instantsearch widget,
  // the plugin needs to be initialized in the normal Instantsearch workflow
  // using the render method (e.g. search.once('render'...)

  // This legacy sidebar handles filters on mobile
  // It returns a NodeList array, though there will only ever be one
  const elemsSN = document.querySelectorAll('.sidenav');
  instances.sidenavs = M.Sidenav.init(elemsSN);

  // Algolia Instantsearch
  // =======================================================
  // Config
  const algoliaClient = algoliasearch(PUBLIC_ALGOLIA_APP_ID_GRANTS, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY_GRANTS);
  //const searchClient = algoliasearch(PUBLIC_ALGOLIA_APP_ID_GRANTS, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY_GRANTS);
  // To set initial state w/out a query...
  // ...need to wrap a custom searchClient around Algolia's
  // https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-requests/js/#implementing-a-proxy
  const searchClient = {
    ...algoliaClient,
    // Capture empty requests
    // https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-requests/js/#detecting-empty-search-requests
    search(requests) {
      // TODO Use InstantSearch to show initial results, instead of legacy ais-placeholder-hits strategy
      // if (requests.every(({ params }) => !params.query)) {
      //   searchState.initialEmptyQuery = true;
      //   // Render an initial set of results here
      //   return [];
      // }
      return algoliaClient.search(requests);
    },
  };
  const algoliaIndex = PUBLIC_ALGOLIA_INDEX_NAME_GRANTS;
  const facets = [
    {
      facet: 'tax_year',
      label: 'Tax Year',
    },
    {
      facet: 'grantee_city',
      label: 'City',
    },
    {
      facet: 'grantee_state',
      label: 'State',
    },
    {
      facet: 'grantee_name',
      label: 'Recipient',
    },
    {
      facet: 'grant_purpose',
      label: 'Purpose',
    },
    {
      facet: 'grant_amount',
      label: 'Amount',
    },
  ];
  search = instantsearch({
    indexName: algoliaIndex,
    searchClient,
    numberLocale: 'en-US',
    future: {
      preserveSharedStateOnUnmount: true,
    },
    routing: {
      router: history({
        cleanUrlOnDispose: false,
        writeDelay: 400,
        push(url) {
          /**
           * The SvelteKit app is an SPA
           * The goal of these router settings is to leverage the power of the InstantSearch routing,
           * but do so in a way that works well with SvelteKit best practices.
           * - let each of them do what they do best
           *
           * We use SvelteKit's shallow routing (pushState/replaceState) to update the URL
           * without triggering load functions, which would cause unnecessary __data.json refetches.
           */
          // Get the next url from Algolia 'url' parameter passed into this push function
          // Confirm it's a properly formatted url
          const nextUrl = new URL(url);

          // Get the current url search params from the window object
          // Note: Any attempt at pulling from SvelteKit { page } state object results in a signifcant performance hit
          // The symptom - entering queries becomes very jittery
          const currentBrowserUrl = new URL(window.location.href);
          const currentUrlSearchParams = currentBrowserUrl.searchParams;

          // Check if the current URL contains search params
          const hasSearch = currentUrlSearchParams.size > 0;

          // If the current URL has no search params, it's the FIRST search.
          // Thus, we want to PUSH this to history.
          if (!hasSearch) {
            pushState(nextUrl, {});
          } else {
            // The URL already has search params, so this is a REFINEMENT.
            // We want to REPLACE the current history entry.
            replaceState(nextUrl, {});
          }
        },
      }),
      stateMapping: {
        stateToRoute(uiState) {
          /**
           * State to Route updates the url from whatever is happening in Instantsearch
           * We use the character ~ as it is one that is rarely present in data and renders well in URLs
           */
          const indexUiState = uiState[algoliaIndex];
          return {
            query: indexUiState.query,
            tax_year: indexUiState.refinementList && indexUiState.refinementList.tax_year && indexUiState.refinementList.tax_year.join('~'),
            grantee_city:
              indexUiState.refinementList && indexUiState.refinementList.grantee_city && indexUiState.refinementList.grantee_city.join('~'),
            grantee_state:
              indexUiState.refinementList &&
              indexUiState.refinementList.grantee_state &&
              indexUiState.refinementList.grantee_state.join('~'),
            grantee_name:
              indexUiState.refinementList && indexUiState.refinementList.grantee_name && indexUiState.refinementList.grantee_name.join('~'),
            grant_purpose:
              indexUiState.refinementList &&
              indexUiState.refinementList.grant_purpose &&
              indexUiState.refinementList.grant_purpose.join('~'),
            grant_amount: indexUiState.range && indexUiState.range.grant_amount && indexUiState.range.grant_amount.replace(':', '~'),
            page: indexUiState.page,
          };
        },
        /* eslint-disable camelcase */
        routeToState(routeState) {
          /**
           * Route to State takes the url and parses it
           * The object it creates is sent to the widgets
           */
          return {
            [algoliaIndex]: {
              query: routeState.query,
              refinementList: {
                tax_year: routeState.tax_year && routeState.tax_year.split('~'),
                grantee_city: routeState.grantee_city && routeState.grantee_city.split('~'),
                grantee_state: routeState.grantee_state && routeState.grantee_state.split('~'),
                grantee_name: routeState.grantee_name && routeState.grantee_name.split('~'),
                grant_purpose: routeState.grant_purpose && routeState.grant_purpose.split('~'),
              },
              range: {
                grant_amount: routeState.grant_amount && routeState.grant_amount.replace('~', ':'),
              },
              page: routeState.page,
            },
          };
        },
      },
    },
  });
  /* eslint-enable camelcase */

  // Define templates
  const templateStats = `
  {{#hasNoResults}}No results{{/hasNoResults}}
  {{#hasOneResult}}1 result{{/hasOneResult}}
  {{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} results{{/hasManyResults}}
  <span class="small text-muted-max hidden">found in {{processingTimeMS}}ms</span>
`;

  // Define color palette
  const panelHeaderClasses = ['card-header', 'grey', 'lighten-4'];
  const panelHeaderClassesMobile = ['card-header', 'blue-grey', 'lighten-4'];

  /* ---------------------------- */
  /* Connector - Hits Widget      */
  /* ---------------------------- */

  const renderHits = (renderOptions) => {
    const { hits, results, widgetParams } = renderOptions;

    if (!hits.length && results) {
      document.getElementById('ais-widget-pagination').classList.add('hidden');

      widgetParams.container.innerHTML = `
        <div id="no-results-ctas" class="hits-empty">\
          <div class="card">
            <div class="card-content">
              <p>No results found for your query <strong>"${results.query}"</strong></p>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <p>
                <span class="text-muted-max small">Searching grants from</span><br>
                ${targetOrgName}
              </p>
            </div>
          </div>

          <div class="card z-depth-0 grey lighten-4">
            <div class="card-content">
              <div class="card-title">Not finding what you're looking for?</div>
              <p>Search for a <a href="https://www.grantmakers.io/search/profiles/" class="grantmakers-text" data-ga="Foundation Search">different foundation</a></p>
              <p>Search for your query across the entire <a href="https://www.grantmakers.io/search/grants/?query=${results.query}" class="grantmakers-text" data-ga="Grants Search">grants dataset</a></p>
            </div>
          </div>

          <!-- 
          <div class="card z-depth-0 grey lighten-4">
            <div class="card-content">
              <p>Learn more about <a href="https://www.grantmakers.io/faq/" class="grantmakers-text" data-ga="FAQ">searching on Grantmakers.io</a></p>
            </div>
          </div>
          -->
          
        </div>
      `;
    } else {
      document.getElementById('ais-widget-pagination').classList.remove('hidden');
      widgetParams.container.innerHTML = `
        <table class="striped ais-hits-table">
          <thead>
            <tr>
              <th class="text-nowrap"><span>Amount</span></th>
              <th><span>Name</span></th>
              <th><span>Purpose</span></th>
              <th><span>Location</span></th>
              <th><span>Year</span></th>
            </tr>
          </thead>
          <tbody>
            ${hits
              .map(
                (item) => `
              <tr>
                <td class="valign-top right-align" data-facet="grant_amount" data-facet-value="${item.grant_amount}">$${item.grant_amount.toLocaleString()}</td>
                <td class="valign-top pointer" data-facet="grantee_name" data-facet-value="${item.grantee_name}">${highlight({ attribute: 'grantee_name', hit: item })}</td>
                <td class="valign-top pointer" data-facet="grant_purpose" data-facet-value="${item.grant_purpose}">${highlight({ attribute: 'grant_purpose', hit: item })}</td>
                <td class="valign-top pointer no-wrap" 
                  data-facet="${item.grantee_city ? 'grantee_city' : 'grantee_state'}" 
                  data-facet-value="${item.grantee_city && item.grantee_city.length ? item.grantee_city : item.grantee_state}"
                >
                  ${item.grantee_city && item.grantee_city.length ? highlight({ attribute: 'grantee_city', hit: item }) + ',&nbsp;' + item.grantee_state : item.grantee_state || ''}
                </td>
                <td class="valign-top pointer" data-facet="tax_year" data-facet-value="${item.tax_year}">${item.tax_year}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      `;
      document.querySelectorAll('#ais-widget-hits td').forEach((e) => e.addEventListener('click', refineIfTableItemClicked));
    }
  };

  const customHits = connectHits(renderHits);

  /* --------------------------------------------------- */
  /* Connector - RefinementList Widget (Tax Year Toggle) */
  /* --------------------------------------------------- */
  const renderRefinementList = (renderOptions) => {
    const { items, refine, widgetParams } = renderOptions;

    widgetParams.container.innerHTML = `
      <ul id="tax-year-dropdown" class="dropdown-content">
        ${items
          .map(
            (item) => `
          <li data-value="${item.value}">
            <label>
              <input type="checkbox" class="filled-in" ${item.isRefined ? 'checked="checked"' : ''} ${targetTaxYearOnlyOne ? 'disabled="disabled"' : ''} value="${item.value}"/>
              <span class="ais-RefinementList-labelText">${item.label}</span>
              <span class="ais-RefinementList-count right small">${item.count}</span>
            </label>
          </li>
        `,
          )
          .join('')}
      </ul>
    `;

    // Only enable click events and dropdown if multiple tax years exist
    if (!targetTaxYearOnlyOne) {
      // Initialize Materialize dropdown plugin
      reInitDropdown();
      // Create click events to allow Algolia to refine
      [...widgetParams.container.querySelectorAll('li')].forEach((element) => {
        element.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          refine(event.currentTarget.dataset.value);
          //scrollToGrants();
        });
      });
    }
  };

  const customRefinementList = connectRefinementList(renderRefinementList);

  /* ---------------------------- */
  /* Connector - Range Slider     */
  /* ---------------------------- */
  const customRangeSliderWithPanel = panel({
    templates: {
      header: 'Amount',
    },
    hidden(options) {
      return options.results.nbHits === 0;
    },
    cssClasses: {
      root: 'card',
      header: panelHeaderClasses,
      body: 'card-content',
    },
  })(rangeSlider);

  /* ------------------------------- */
  /* Connector - Current Refinements */
  /* ------------------------------- */
  const createDataAttributes = (refinement) =>
    Object.keys(refinement)
      .map((key) => `data-${key}="${refinement[key]}"`)
      .join(' ');

  const renderListItem = (item) => `
    ${item.refinements
      .map(
        (refinement) => `
      <li>
        <button class="waves-effect btn blue-grey lighten-3 grey-text text-darken-3 truncate" ${createDataAttributes(refinement)}><i class="material-icons right">remove_circle</i><small>${getLabel(item.label)}</small> ${formatIfRangeLabel(refinement)} </button>
      </li>
    `,
      )
      .join('')}
  `;

  const renderCurrentRefinements = (renderOptions) => {
    const { items, refine, widgetParams } = renderOptions;

    widgetParams.container.innerHTML = `<ul class="list list-inline">${items.map(renderListItem).join('')}</ul>`;

    [...widgetParams.container.querySelectorAll('button')].forEach((element) => {
      element.addEventListener('click', (event) => {
        const item = Object.keys(event.currentTarget.dataset).reduce(
          (acc, key) => ({
            ...acc,
            [key]: event.currentTarget.dataset[key],
          }),
          {},
        );

        refine(item);
      });
    });
  };

  const customCurrentRefinements = connectCurrentRefinements(renderCurrentRefinements);

  /* ---------------------------- */
  /* Create all other refinements */
  /* ---------------------------- */
  facets.forEach((refinement) => {
    let sortBy = ['isRefined', 'count:desc', 'name:asc'];
    // Amount handled by range widget
    if (refinement.facet === 'grant_amount') {
      return;
    }
    // Sorting by year, not count, makes more sense w/ Tax Years
    if (refinement.facet === 'tax_year') {
      sortBy = ['isRefined', 'name:desc', 'count:desc'];
    }

    /* Mobile */
    const mobileRefinementListWithPanel = panel({
      templates: {
        header: refinement.label,
      },
      hidden(options) {
        return options.results.nbHits === 0;
      },
      cssClasses: {
        root: 'card',
        header: panelHeaderClassesMobile,
        body: 'card-content',
      },
    })(refinementList);

    search.addWidget(
      mobileRefinementListWithPanel({
        container: `#ais-widget-mobile-refinement-list--${refinement.facet}`,
        attribute: refinement.facet,
        limit: 8,
        showMore: false,
        cssClasses: {
          checkbox: 'filled-in',
          count: ['right', 'small'],
          selectedItem: ['grantmakers-text'],
        },
      }),
    );

    // On desktop, tax year uses custom widget
    if (refinement.facet === 'tax_year') {
      return;
    }

    /* Desktop */
    const refinementListWithPanel = panel({
      templates: {
        header: refinement.label,
      },
      hidden(options) {
        return options.results.nbHits === 0;
      },
      cssClasses: {
        root: 'card',
        header: panelHeaderClasses,
        body: 'card-content',
      },
    })(refinementList);

    search.addWidget(
      refinementListWithPanel({
        container: `#ais-widget-refinement-list--${refinement.facet}`,
        attribute: refinement.facet,
        limit: 3,
        showMore: true,
        sortBy: sortBy,
        // 'searchable': true,
        cssClasses: {
          checkbox: 'filled-in',
          //label: 'flex',
          labelText: 'small',
          count: ['right', 'small'],
          showMore: ['btn-flat', 'btn-small'],
          disabledShowMore: ['disabled'],
          // 'selectedItem': ['grants-search-text'],
          // 'searchableRoot': 'ais-SearchBox-refinements',
          // 'searchableSubmit': 'hidden',
        },
      }),
    );
  });

  /* ---------------------------- */
  /* Instantiate all Widgets
  /* ---------------------------- */
  search.addWidgets([
    searchBox({
      container: '#ais-widget-search-box',
      placeholder: 'Search by keyword or recipient name',
      autofocus: false,
      reset: true,
      // QueryHook Docs: https://www.algolia.com/doc/api-reference/widgets/search-box/js/#widget-param-queryhook
      // queryHook: function (query, searchInstance) {
      //   searchInstance(query);
      // },
    }),

    configure({
      filters: 'ein:' + targetEIN,
    }),

    stats({
      container: '#ais-widget-stats',
      templates: {
        text: templateStats,
      },
      cssClasses: {
        root: 'center-align-on-mobile',
        text: ['text-muted', 'hide-on-med-and-down'],
      },
    }),

    poweredBy({
      container: '#powered-by',
    }),

    customHits({
      container: document.querySelector('#ais-widget-hits'),
    }),

    customRangeSliderWithPanel({
      container: '#ais-widget-range-slider',
      attribute: 'grant_amount',
      tooltips: {
        format: function (rawValue) {
          return `$${numberHuman(rawValue, 0)}`;
        },
      },
      pips: false,
    }),

    customRefinementList({
      container: document.querySelector('#ais-widget-refinement-list--tax_year'),
      attribute: 'tax_year',
      limit: 8,
      sortBy: ['isRefined', 'name:desc'],
    }),

    customCurrentRefinements({
      container: document.querySelector('#ais-widget-current-refined-values'),
    }),

    clearRefinements({
      container: '#ais-widget-clear-all',
      templates: {
        resetLabel: 'Clear filters',
      },
      cssClasses: {
        button: ['btn', 'btn-custom', 'blue-grey', 'lighten-3', 'grey-text', 'text-darken-3', 'waves-effect', 'waves-light'],
      },
    }),

    clearRefinements({
      container: '#ais-widget-mobile-clear-all',
      cssClasses: {
        button: ['waves-effect', 'waves-light', 'btn', 'btn', 'grey', 'lighten-5', 'grey-text', 'text-darken-3'],
      },
      templates: {
        resetLabel: 'Clear',
      },
    }),

    pagination({
      container: '#ais-widget-pagination',
      scrollTo: document.getElementById('grants'),
      cssClasses: {
        root: 'pagination',
        page: 'waves-effect',
        selectedItem: ['active', 'grey'],
        disabledItem: 'disabled',
      },
    }),
  ]);

  /* ---------------------------- */
  /* Render Widgets
  /* ---------------------------- */
  search.once('render', async function () {
    hideSeoPlaceholders();

    // Tax Year Dropdown
    showSortByDropdown();
  });

  /**
   * Helper function to auto scroll back to the top of the search box
   * Use sparingly, if at all - scrolljacking is an anti-pattern
   */
  // search.on('render', async function () {
  //   scrollToGrants();
  // })

  search.on('error', function (e) {
    if (e.status === 429) {
      renderRateLimit();
      console.log('Rate limit reached'); // eslint-disable-line no-console
    }
    if (e.status === 403) {
      renderForbidden();
      console.log('Origin forbidden'); // eslint-disable-line no-console
    }
    //console.log(e);
  });

  /* ---------------------------- */
  /* Start Search
  /* ---------------------------- */
  search.start();

  // Materialize - initialize tax year dropdown
  // =======================================================
  function reInitDropdown() {
    // Destroy all prior instances
    if (instances.dropdowns?.length > 0) {
      instances.dropdowns.forEach((instance) => {
        if (instance) {
          instance.destroy();
        }
      });
      instances.dropdowns = [];
    }

    const elems = document.querySelectorAll('.dropdown-trigger');
    const containerEl = document.querySelector('#ais-widget-refinement-list--tax_year');

    // Only initialize if both trigger and container exist
    if (elems.length === 0 || !containerEl) {
      return;
    }

    try {
      instances.dropdowns = M.Dropdown.init(elems, {
        container: containerEl,
      });
    } catch (e) {
      console.warn('Materialize Dropdown init failed:', e);
    }
  }

  // Helper functions
  // =======================================================
  function scrollToGrants() {
    console.log('Scroll To Grants called');
    const grantsElement = document.getElementById('grants');

    if (grantsElement) {
      const elementPosition = grantsElement.getBoundingClientRect().top;
      const offsetPosition = window.scrollY;
      const offset = 64;
      const targetPosition = elementPosition + offsetPosition - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  }

  function hideSeoPlaceholders() {
    const target = document.getElementById('ais-widget-refinement-list--seo-placeholder');
    target.classList.add('hidden');
  }

  function showSortByDropdown() {
    // Tax Year dropdown
    const el = document.getElementById('ais-widget-sort-by');
    const trigger = el.querySelector('a.dropdown-trigger');
    el.classList.remove('hidden');
    // Check if only one tax year exists
    // and disable clicks to prevent confusion
    if (targetTaxYearOnlyOne) {
      trigger.classList.add('disabled');
      trigger.addEventListener('click', function () {
        M.Toast.dismissAll();
        M.toast({
          html: '<span class="toast-intro">Nothing to filter</span> Only one tax year available',
          displayLength: 4000,
        });
      });
    }
  }

  function refineIfTableItemClicked(e) {
    const elem = e.target.closest('td');
    const facet = elem.dataset.facet;
    let value = elem.dataset.facetValue;

    if (facet !== 'grant_amount' && facet !== 'tax_year') {
      search.helper.toggleFacetRefinement(facet, value).search();
    } else if (facet === 'grant_amount') {
      M.Toast.dismissAll();
      M.toast({
        html: '<span class="toast-intro">ProTip</span> Try the Amount slider',
        displayLength: 4000,
      });
    } else if (facet === 'tax_year') {
      // Only allow refining if multiple tax years exist
      if (targetTaxYearOnlyOne) {
        M.Toast.dismissAll();
        M.toast({
          html: '<span class="toast-intro">Nothing to filter</span> Only one tax year available',
          displayLength: 4000,
        });
      } else {
        search.helper.toggleFacetRefinement(facet, value).search();
      }
    }
  }

  function renderRateLimit() {
    const message = document.getElementById('rate-limit-message');
    message.classList.remove('hidden');

    const results = document.getElementById('algolia-hits-wrapper');
    results.classList.add('hidden');
  }

  function renderForbidden() {
    const message = document.getElementById('forbidden-message');
    message.classList.remove('hidden');

    const results = document.getElementById('algolia-hits-wrapper');
    results.classList.add('hidden');
  }

  function getLabel(item) {
    const obj = facets.filter((each) => each.facet === item);
    return obj[0].label;
  }

  function formatIfRangeLabel(refinement) {
    if (refinement.attribute !== 'grant_amount') {
      return refinement.label;
    } else {
      return `${refinement.operator} $${numberHuman(refinement.value)}`;
    }
  }

  function numberHuman(num, decimals) {
    if (num === null) {
      return null;
    } // terminate early
    if (num === 0) {
      return '0';
    } // terminate early
    if (isNaN(num)) {
      return num;
    } // terminate early if already a string - handles edge case likely caused by caching
    const fixed = !decimals || decimals < 0 ? 0 : decimals; // number of decimal places to show
    const b = num.toPrecision(2).split('e'); // get power
    const k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3); // floor at decimals, ceiling at trillions
    const c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed); // divide by power
    const d = c < 0 ? c : Math.abs(c); // enforce -0 is 0
    const e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
    return e;
  }
}

export function destroySearchJs() {
  try {
    if (browser) {
      if (search) {
        search.dispose();
        search = null;
      }
      if (instances.dropdowns) {
        instances.dropdowns.forEach((instance) => {
          if (instance) instance.destroy();
        });
      }
      // Confirmed - this is an array
      if (instances.sidenavs) {
        instances.sidenavs.forEach((instance) => {
          if (instance) instance.destroy();
        });
      }

      if (instances.scrollSpies) {
        instances.scrollSpies.forEach((instance) => {
          if (instance) instance.destroy();
        });
      }
      // There should no longer be any of these
      if (instances.formSelects) {
        instances.formSelects.forEach((instance) => {
          if (instance) instance.destroy();
        });
      }

      if (instances.tooltips) {
        instances.tooltips.forEach((instance) => {
          if (instance) instance.destroy();
        });
      }
    }

    instances = {
      dropdown: null,
      sidenavs: [],
      formSelects: [],
      scrollSpies: [],
      tooltips: [],
    };
  } catch (error) {
    console.warn('Leaving embedded Grants Search - failed to destroy search items and/or Materialize plugins');
  }
}
