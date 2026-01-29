/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// Legacy JS ported from the previous version of Grantmakers.io.
// Added to suppress type checking errors while maintaining original functionality.

import { browser } from '$app/environment';
import { pushState, replaceState } from '$app/navigation';
import { algoliasearch } from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { history } from 'instantsearch.js/es/lib/routers';
import { stats, hits, searchBox, panel, refinementList, clearRefinements, pagination, poweredBy } from 'instantsearch.js/es/widgets';
import { connectRange, connectCurrentRefinements, connectConfigure } from 'instantsearch.js/es/connectors';

import { PUBLIC_ALGOLIA_APP_ID_GRANTS, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY_GRANTS, PUBLIC_ALGOLIA_INDEX_NAME_GRANTS } from '$env/static/public';

if (!PUBLIC_ALGOLIA_APP_ID_GRANTS || !PUBLIC_ALGOLIA_SEARCH_ONLY_KEY_GRANTS || !PUBLIC_ALGOLIA_INDEX_NAME_GRANTS) {
  throw new Error('Missing required Algolia public keys. Please ensure environment variables are set.');
}

// InstantSearch
let search;

// Materialize JS Plugins
let instances = {
  dropdowns: [],
  formSelects: [],
};

export function initSearchJs(M) {
  // Capture InstantSearch warnings re Hogan templates
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (!args[0]?.includes('[InstantSearch.js]')) {
      originalWarn.apply(console, args);
    }
  };

  // Helper definitions
  const scrollAnchor = document.querySelector('.nav-search');

  // INITIALIZE MATERIALIZE COMPONENTS
  // =================================
  // Note: if the element is created dynamically via Instantsearch widget,
  // the plugin needs to be initialized in the normal Instantsearch workflow
  // using the render method (e.g. search.on('render'...)

  const elSearchBoxDropdown = document.querySelectorAll('.dropdown-trigger')[0]; // HACK Hard coding using bracket notation is precarious
  if (elSearchBoxDropdown) {
    const optionsSearchBoxDropdown = {
      alignment: 'right',
      constrainWidth: false,
      coverTrigger: false,
      closeOnClick: false,
    };
    const instance = M.Dropdown.init(elSearchBoxDropdown, optionsSearchBoxDropdown);
    if (instance) {
      instances.dropdowns.push(instance);
    }
  }

  // ALGOLIA
  // ==============
  const searchClient = algoliasearch(PUBLIC_ALGOLIA_APP_ID_GRANTS, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY_GRANTS);
  const algoliaIndex = PUBLIC_ALGOLIA_INDEX_NAME_GRANTS;
  const facets = [
    {
      facet: 'grantee_name',
      label: 'Recipient',
    },
    {
      facet: 'organization_name',
      label: 'Donor',
    },
    {
      facet: 'grantee_city',
      label: 'Recipient City',
    },
    {
      facet: 'grantee_state',
      label: 'Recipient State',
    },
    {
      facet: 'grant_amount',
      label: 'Amount',
    },
  ];

  // Define RangeInput min/max - for placeholders only
  const rangeMin = 0;
  const rangeMax = 1051049025;

  // Valid field IDs for restrictSearchableAttributes URL sync
  const validFieldIds = ['organization_name', 'grantee_name', 'grantee_city', 'grant_purpose'];

  // Track selected searchable fields (for UI state, independent of widget params)
  // This follows the same pattern as GrantsSearch.svelte's selectedFields state
  let selectedSearchableFields = $state([...validFieldIds]); // Start with all fields selected

  // Toogle Advanced Search tools
  // Advanced search features are hidden by default via css
  // Could handle initial show/hide directly in Instantsearch via cssClasses, but too many side effects
  // Even listener set in search.once InstantSearch event
  const toggleAdvancedElem = document.querySelector('.search-toggle-advanced input[type="checkbox"]');

  /* ---------------------------- */
  /* Algolia configuration        */
  /* ---------------------------- */
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

          // If the current URL has no search, it's the FIRST search.
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
          const restrictedFields = indexUiState.configure?.restrictSearchableAttributes;
          const validRestrictedFields = restrictedFields?.filter((f) => validFieldIds.includes(f));
          return {
            query: indexUiState.query,
            grantee_name:
              indexUiState.refinementList && indexUiState.refinementList.grantee_name && indexUiState.refinementList.grantee_name.join('~'),
            organization_name:
              indexUiState.refinementList &&
              indexUiState.refinementList.organization_name &&
              indexUiState.refinementList.organization_name.join('~'),
            grantee_city:
              indexUiState.refinementList && indexUiState.refinementList.grantee_city && indexUiState.refinementList.grantee_city.join('~'),
            grantee_state:
              indexUiState.refinementList &&
              indexUiState.refinementList.grantee_state &&
              indexUiState.refinementList.grantee_state.join('~'),
            grant_amount: indexUiState.range && indexUiState.range.grant_amount && indexUiState.range.grant_amount.replace(':', '~'),
            fields:
              validRestrictedFields?.length > 0 && validRestrictedFields.length < validFieldIds.length ?
                validRestrictedFields.join('~')
              : undefined,
            page: indexUiState.page,
          };
        },
        routeToState(routeState) {
          /**
           * Route to State takes the url and parses it
           * The object it creates is sent to the widgets
           */
          const selectedFields = routeState.fields && routeState.fields.split('~').filter((f) => validFieldIds.includes(f));
          console.log('routeToState selectedFields', selectedFields);
          console.log('Should updated configure', selectedFields && selectedFields.length > 0);
          return {
            [algoliaIndex]: {
              query: routeState.query,
              refinementList: {
                grantee_name: routeState.grantee_name && routeState.grantee_name.split('~'),
                organization_name: routeState.organization_name && routeState.organization_name.split('~'),
                grantee_city: routeState.grantee_city && routeState.grantee_city.split('~'),
                grantee_state: routeState.grantee_state && routeState.grantee_state.split('~'),
              },
              range: {
                grant_amount: routeState.grant_amount && routeState.grant_amount.replace('~', ':'),
              },
              configure: selectedFields && selectedFields.length > 0 ? { restrictSearchableAttributes: selectedFields } : undefined,
              page: routeState.page,
            },
          };
        },
      },
    },
  });

  // Define templates
  const templateStats = `
    {{#hasNoResults}}No results{{/hasNoResults}}
    {{#hasOneResult}}1 result{{/hasOneResult}}
    {{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} results{{/hasManyResults}}
    <span class="small text-muted-max hidden">found in {{processingTimeMS}}ms</span>
  `;

  // Define Grants hit template
  const templateHits = `<div class="row row-grant-names">
    <div class="col s12 m6">
      <span class="text-bold">{{#helpers.highlight}}{ "attribute": "grantee_name" }{{/helpers.highlight}}</span> <!--<span class="text-muted small">({{ tax_year }})</span>-->
    </div>
    <div class="col s12 m5">
      <a class="truncate text-light" href="/profiles/v0/{{ ein }}" title="View foundation profile">{{ organization_name }}</a>
    </div>
    <div class="col m1 hide-on-small-only">
      <div class="actions-wrapper center-align">
        <a href="#" class="dropdown-trigger dropdown-trigger-hits blue-grey-text" data-target="{{ _id }}"><i class="material-icons md-18">more_vert</i></a>
        <ul id="{{ _id }}" class='dropdown-content'>
          <li><a href="/profiles/v0/{{ ein }}"><i class="material-icons md-18 left">list_alt</i>View Foundation Profile</a></li>
        </ul>
      </div>
    </div>
  </div>

  <div class="row"> 
    <div class="col s12 m6">
      <span class="small text-light">
        {{#grantee_city}}
          {{#helpers.highlight}}{ "attribute": "grantee_city" }{{/helpers.highlight}}, {{ grantee_state }}
        {{/grantee_city}}
      </span>
    </div>
    <div class="col s12 m5">
      <span class="small text-light">
        {{ grant_amount }}
      </span>
    </div>            
  </div>

  <div class="row">
    <div class="col s10 grant-purpose">
      <span class="text-muted-max small">{{#helpers.highlight}}{ "attribute": "grant_purpose" }{{/helpers.highlight}} ({{ tax_year }})</span>
    </div>
  </div>`;

  const templateHitsEmpty = `<div id="no-results-ctas" class="hits-empty">
    <div class="card">
      <div class="card-content">
        <p>No results found for your query <strong>"<span>{{ query }}</span>"</strong></p>
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <p>You conducted a Grantee Search across keywords, locations, and organization names</p>
      </div>
    </div>
    <div class="card z-depth-0 grey lighten-4">
      <div class="card-content">
        <div class="card-title">Not finding what you're looking for?</div>
        <p>Remember, only private foundations that file taxes electronically are found on Grantmakers.io</p>
      </div>
    </div>
    <div class="card z-depth-0 grey lighten-4">
      <div class="card-content">
        <div class="card-title">Get to know Grantmakers.io</div>
        <p><a href="{{ site.baseurl }}/about/" data-ga="Get to know link">Tips and tricks</a> to get the most out of your searches</p>
      </div>
    </div>
  </div>`;

  const templateShowMore = `  {{#isShowingMore}}
    [ - ] Showing top 20 results
  {{/isShowingMore}}
  {{^isShowingMore}}
    [ + ] Show top 20 results
  {{/isShowingMore}}`;

  /* ---------------------------- */
  /* Connector - Configure Widget */
  /* ---------------------------- */
  const renderConfigure = (renderOptions, isFirstRender) => {
    /**
     * We use the Configure Connector to hande the "fields to search" feature
     * It uses the restrictSearchableAttributes field to narrow the fields to search
     * By default, there are no restrictions - all default fields are searched
     */
    const { refine } = renderOptions;

    if (isFirstRender) {
      // On the first rendering, ensure the checkboxes reflect searchState
      // It also sets up the event listeners
      const uiState = search.getUiState();
      const routeConfigureState = uiState[algoliaIndex]?.configure;
      const currentAttributes = routeConfigureState?.restrictSearchableAttributes;

      if (currentAttributes?.length > 0 && currentAttributes.length < validFieldIds.length) {
        // Checkbox UI - Update to match state
        const dropdownBody = document.getElementById('dropdown-body');
        if (dropdownBody) {
          dropdownBody.querySelectorAll('input').forEach((el) => {
            el.checked = currentAttributes.includes(el.id);
          });
        }

        // Update module-level state to match InstantSearch uiState
        selectedSearchableFields = [...currentAttributes];
      }

      const searchDropdownItems = document.getElementById('dropdown-body');
      const searchDropDownOnlyButtons = document.querySelectorAll('.checkbox-only');

      // Only - event listener
      searchDropDownOnlyButtons.forEach((element) => {
        element.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent Materialize Dropdown from taking over
          const attribute = e.currentTarget.dataset.attribute;

          // Mimic default Materialize Dropdown functionality
          searchDropdownItems.querySelectorAll('input').forEach((el) => {
            if (el.id === attribute) {
              el.checked = true;
            } else {
              el.checked = false;
            }

            // Hide Materialize after selection
            // Materialize default for dropdowns requires clicking off dropdown wrapper
            const instance = M.Dropdown.getInstance(elSearchBoxDropdown);
            instance.close();
            readyToSearchScrollPosition();
          });

          // Update module-level state to match InstantSearch uiState
          selectedSearchableFields = [attribute];

          // Refine Algolia parameters
          refine({
            restrictSearchableAttributes: [attribute],
          });
        });
      });

      // Select All - event listener
      document.getElementById('select-all').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent Materialize Dropdown from taking over

        // Mimic default Materialize Dropdown functionality
        searchDropdownItems.querySelectorAll('input').forEach((el) => {
          el.checked = true;
        });

        // Hide Materialize after selection
        // Materialize default for dropdowns requires clicking off dropdown wrapper
        const instance = M.Dropdown.getInstance(elSearchBoxDropdown);
        instance.close();
        readyToSearchScrollPosition();

        // Reset state to all fields
        selectedSearchableFields = [...validFieldIds];

        // Clear restriction in Algolia (all fields selected = no restriction)
        refine({
          restrictSearchableAttributes: undefined,
        });
      });

      // Checkbox selections - event listener
      searchDropdownItems.addEventListener('change', (e) => {
        const attribute = e.target.id;
        const isChecked = e.target.checked; // Note: this is the status AFTER the change
        if (selectedSearchableFields.length === 1 && isChecked === false) {
          e.target.checked = !isChecked;
          M.Toast.dismissAll();
          M.toast({ html: 'At least one item needs to be searchable' });
          return;
        }

        const updatedAttributes = addOrRemoveSearchableAttributes(selectedSearchableFields, attribute);
        selectedSearchableFields = updatedAttributes;
        // When all fields selected, send undefined to Algolia to indicate "no restriction"
        refine({
          restrictSearchableAttributes: updatedAttributes.length === validFieldIds.length ? undefined : updatedAttributes,
        });
        readyToSearchScrollPosition();
      });
    }
  };

  // Create the custom widget
  const customConfigure = connectConfigure(renderConfigure, () => {});

  /* ----------------------- */
  /* Connector - Range Input */
  /* ----------------------- */
  const renderRangeInput = (renderOptions, isFirstRender) => {
    const { start, refine, widgetParams } = renderOptions; // Not using 'range' argument
    const [min, max] = start;

    if (isFirstRender) {
      // Create panel
      const wrapper = document.createElement('div');
      wrapper.setAttribute('class', 'ais-RangeInput');
      const form = document.createElement('form');
      form.setAttribute('class', 'ais-RangeInput-form');

      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const rawMinInputValue = parseFloat(event.target.elements.min.value);
        const rawMaxInputValue = parseFloat(event.target.elements.max.value);

        refine([
          Number.isFinite(rawMinInputValue) ? rawMinInputValue : undefined,
          Number.isFinite(rawMaxInputValue) ? rawMaxInputValue : undefined,
        ]);
      });

      widgetParams.container.appendChild(wrapper);
      wrapper.appendChild(form);

      return;
    }

    widgetParams.container.querySelector('form').addEventListener('input', (event) => {
      event.preventDefault();

      // Show helper text
      // TODO This feels unnecessarily complicated
      const helperEl = document.querySelector('.ais-Panel-footer');
      const helperElMin = helperEl.querySelector('#range-footer-min');
      const helperElMax = helperEl.querySelector('#range-footer-max');
      const helperElSymbol = helperEl.querySelector('#range-footer-symbol');
      let amount = parseFloat(event.target.value);
      let amountMin;
      let amountMax;
      if (event.target.classList.contains('ais-RangeInput-input--min')) {
        amountMin = numberHuman(amount);
        amountMax = helperElMax.textContent || null;
        helperElMin.textContent = `${amountMin ? '$' + amountMin : ''}`;
      }
      if (event.target.classList.contains('ais-RangeInput-input--max')) {
        amountMax = numberHuman(amount);
        amountMin = helperElMin.textContent || null;
        helperElMax.textContent = `${amountMax ? '$' + amountMax : ''}`;
      }
      helperElSymbol.textContent = getRangeFooterSymbol(amountMin, amountMax);
    });

    widgetParams.container.querySelector('form').innerHTML = `
      <label class="ais-RangeInput-label">
        <input
          class="ais-RangeInput-input ais-RangeInput-input--min outline! outline-1! -outline-offset-1! outline-gray-200!"
          type="number"
          name="min"
          placeholder="${rangeMin}"
          value="${Number.isFinite(min) ? min : ''}"
        />
      </label>
      <span>to</span>
      <label class="ais-RangeInput-label">
        <input
          class="ais-RangeInput-input ais-RangeInput-input--max outline! outline-1! -outline-offset-1! outline-gray-200!"
          type="number"
          name="max"
          placeholder="${rangeMax}"
          value="${Number.isFinite(max) ? max : ''}"
        />
      </label>
      <button class="ais-RangeInput-submit btn-flat blue-grey white-text" type="submit">Go</button>
    `;
  };

  // Create the custom range input widget
  const customRangeInput = connectRange(renderRangeInput);

  function getRangeFooterSymbol(min, max) {
    let symbol;
    if (min && max) {
      symbol = ' - ';
    } else if (min && !max) {
      symbol = '+';
    } else if (!min && max) {
      symbol = '<';
    } else if (!min && !max) {
      symbol = '';
    }
    return symbol;
  }

  // Create the panel widget wrapper
  const customRangeInputWithPanel = panel({
    templates: {
      header: 'Grant Amount',
      footer(options) {
        // TODO DRY it up
        if (options.state && options.state.numericRefinements && options.state.numericRefinements.grant_amount) {
          const min = options.state.numericRefinements.grant_amount['>='];
          const max = options.state.numericRefinements.grant_amount['<='];
          let minFormatted;
          let maxFormatted;
          if (min) {
            const minFloat = parseFloat(min.toString());
            minFormatted = numberHuman(minFloat);
          }
          if (max) {
            const maxFloat = parseFloat(max.toString());
            maxFormatted = numberHuman(maxFloat);
          }
          return `<span id="range-footer-min">${minFormatted ? '$' + minFormatted : ''}</span><span id="range-footer-symbol">${getRangeFooterSymbol(minFormatted, maxFormatted)}</span><span id="range-footer-max">${maxFormatted ? '$' + maxFormatted : ''}</span>`;
        } else {
          return '<span id="range-footer-min"></span><span id="range-footer-symbol"></span><span id="range-footer-max"></span>';
        }
      },
    },
    hidden(options) {
      return options.results.nbHits === 0;
    },
    cssClasses: {
      root: ['card'],
      header: ['card-header'],
      body: 'card-content',
      footer: 'small',
    },
  })(customRangeInput);

  /* ---------------------------- */
  /* Create all other refinements */
  /* ---------------------------- */
  facets.forEach((refinement) => {
    // Amount handled by range widget
    if (refinement.facet === 'grant_amount') {
      return;
    }
    const refinementListWithPanel = panel({
      templates: {
        header: refinement.label,
      },
      hidden(options) {
        return options.results.nbHits === 0;
      },
      cssClasses: {
        root: 'card',
        header: [
          'card-header',
          // 'grey',
          // 'lighten-4',
        ],
        body: 'card-content',
      },
    })(refinementList);

    // TODO DRY it up
    // Hiding on mobile as grants search refinements not useful on mobile
    /*
    const mobileRefinementListWithPanel = instantsearch.widgets.panel({
      'templates': {
        'header': refinement.label,
      },
      hidden(options) {
        return options.results.nbHits === 0;
      },
      'cssClasses': {
        'root': 'card',
        'header': [
          'card-header',
          'blue-grey',
          'lighten-4',
        ],
        'body': 'card-content',
      },
    })(instantsearch.widgets.refinementList);
    */

    /* Create desktop refinements */
    search.addWidget(
      refinementListWithPanel({
        container: `#ais-widget-refinement-list--${refinement.facet}`,
        attribute: refinement.facet,
        limit: 8,
        showMore: true,
        showMoreLimit: 20,
        cssClasses: {
          checkbox: 'filled-in',
          labelText: 'small',
          count: ['right', 'small', 'tabular-nums'],
          showMore: 'btn-flat blue-grey-text small',
          disabledShowMore: 'hidden',
        },
        templates: {
          showMoreText: templateShowMore,
        },
      }),
    );

    /* Create mobile refinements */
    /* Hiding on mobile as grants search refinements not useful on mobile
    search.addWidget(
      mobileRefinementListWithPanel({
        'container': `#ais-widget-mobile-refinement-list--${refinement.facet}`,
        'attribute': refinement.facet,
        'limit': 8,
        'showMore': false,
        'cssClasses': {
          'checkbox': 'filled-in',
          'count': ['right', 'small'],
          'selectedItem': ['grantmakers-text'],
        },
      })
    );
    */
  });

  /* ------------------------------- */
  /* Connector - Current Refinements */
  /* ------------------------------- */
  const createDataAttribtues = (refinement) =>
    Object.keys(refinement)
      .map((key) => `data-${key}="${refinement[key]}"`)
      .join(' ');

  const renderListItem = (item) => `
    ${item.refinements
      .map(
        (refinement) => `
      <li>
        <button class="waves-effect btn blue-grey lighten-3 grey-text text-darken-3 truncate" ${createDataAttribtues(refinement)}><i class="material-icons right">remove_circle</i><small>${getLabel(item.label)}</small> ${formatIfRangeLabel(refinement)} </button>
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
  /* Instantiate all Widgets
  /* ---------------------------- */
  search.addWidgets([
    searchBox({
      container: '#ais-widget-search-box',
      placeholder: 'Search by keywords, location, or grantee name',
      showSubmit: true,
      showReset: true,
      showLoadingIndicator: false,
      cssClasses: {
        input:
          'grow h-12 pl-10 pr-4 w-full bg-white text-gray-900 text-base rounded-lg border-0 appearance-none shadow-none transition duration-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 outline! outline-1! -outline-offset-1! outline-gray-200!',
      },
      queryHook: function (query, searchInstance) {
        const queryCleaned = checkForEIN(query);
        readyToSearchScrollPosition();
        searchInstance(queryCleaned);
      },
    }),

    customConfigure({
      container: document.querySelector('#search-box-dropdown'),
      searchParameters: {
        hitsPerPage: 12,
      },
    }),

    poweredBy({
      container: '#powered-by',
    }),

    hits({
      container: '#ais-widget-hits',
      templates: {
        item: templateHits,
        empty: templateHitsEmpty,
      },
      cssClasses: {
        root: '',
        list: 'striped row',
        item: ['col', 's12', 'li-grants-search'],
      },
      transformItems(items) {
        return items.map((item) => ({
          ...item,
          grant_amount: `$${item.grant_amount.toLocaleString()}`,
        }));
      },
    }),

    stats({
      container: '#ais-widget-stats',
      templates: {
        text: templateStats,
      },
      cssClasses: {
        text: 'text-muted',
      },
    }),

    customRangeInputWithPanel({
      container: document.querySelector('#ais-widget-range-input'),
      attribute: 'grant_amount',
    }),

    customCurrentRefinements({
      container: document.querySelector('#ais-widget-current-refined-values'),
    }),

    clearRefinements({
      container: '#ais-widget-clear-all',
      cssClasses: {
        button: ['btn blue-grey white-text waves-effect waves-light'],
      },
      templates: {
        resetLabel: 'Clear filters',
      },
    }),

    pagination({
      container: '#ais-widget-pagination',
      maxPages: 20,
      scrollTo: '.nav-search',
      cssClasses: {
        root: 'pagination',
        page: 'waves-effect',
        selectedItem: 'active',
        disabledItem: 'disabled',
      },
    }),
  ]);

  /* ---------------------------- */
  /* Render Widgets
  /* ---------------------------- */
  search.once('render', function () {
    const loader = document.getElementById('algolia-hits-wrapper');
    loader?.classList.add('loaded');
    // Initialize static Materialize JS components created by Instantsearch widgets
    initSelect();
    // Show range input if initial URL contains an amount refinement
    setInitialAdvancedSearchToggleState();
    // Create advanced search toggle listener
    toggleAdvancedElem.addEventListener('change', toggleAdvancedListener, false);
  });

  search.on('render', function () {
    // Initialize dynamic Materialize JS components created by Instantsearch widgets
    initHitsDropdowns();
    // Update Search box elements per "fields to search" state
    syncSearchBoxUI();
  });

  search.on('error', function (e) {
    if (e.status === 429) {
      renderRateLimit();
      console.log('Rate limit reached');
    }
    if (e.status === 403) {
      renderForbidden();
      console.log('Origin forbidden');
    }
    // console.log(e);
  });

  /* ---------------------------- */
  /* Start Search
  /* ---------------------------- */
  search.start();

  function initHitsDropdowns() {
    const elems = document.querySelectorAll('.dropdown-trigger-hits');
    if (elems.length === 0) return;

    const options = {
      constrainWidth: false,
    };
    const initialized = M.Dropdown.init(elems, options);
    const validInstances =
      Array.isArray(initialized) ?
        initialized.filter((instance) => instance != null)
      : [initialized].filter((instance) => instance != null);
    instances.dropdowns.push(...validInstances);
  }

  function initSelect() {
    /**
     * There is only one select element - the search toggle in the search box element
     */
    const elem = document.getElementById('toggle-search-type-grantees');
    if (!elem) return;

    // Skip Materialize initialization if element has browser-default class
    if (elem.classList.contains('browser-default')) return;

    const options = {
      classes: 'btn blue-grey white-text',
    };
    const initialized = M.FormSelect.init(elem, options);
    const validInstances =
      Array.isArray(initialized) ?
        initialized.filter((instance) => instance != null)
      : [initialized].filter((instance) => instance != null);
    instances.formSelects.push(...validInstances);
  }

  function setInitialAdvancedSearchToggleState() {
    // If any numeric refinements, automatically show ALL advanced tools, not just range input
    const obj = search.helper.state.numericRefinements;
    const check = Object.keys(obj).length;
    if (check > 0) {
      // Show advanced search elements
      document.getElementById('algolia-hits-wrapper').classList.remove('js-hide-advanced-tools');
      // Flip switch to on position
      toggleAdvancedElem.checked = true;
    }
  }

  function toggleAdvancedListener(e) {
    if (e.target.checked) {
      showAdvancedSearchTools();
    } else {
      hideAdvancedSearchTools();
    }
  }

  function showAdvancedSearchTools() {
    document.getElementById('algolia-hits-wrapper').classList.remove('js-hide-advanced-tools');
  }

  function hideAdvancedSearchTools() {
    document.getElementById('algolia-hits-wrapper').classList.add('js-hide-advanced-tools');
  }

  // QUERY HOOKS
  // ==============
  // Handle EINs entered in searchbox with a hyphen
  function checkForEIN(query) {
    // Base Regex: /^[0-9]{2}\-\d{7}$/g;
    // Assume query is an EIN as soon as 2 digits entered after hyphen
    const regexEIN = /^[0-9]{2}-\d{2}/g;
    const isEIN = regexEIN.test(query);
    if (query.includes('-') && isEIN) {
      // TODO Will remove hyphen if query ALSO includes prohibit string (e.g. -foo 12-3456789)
      // TODO Add toast - will assist with any confusion caused by routing:true setting...
      // ...which autoupdates the url withOUT the hyphen
      return query.replace('-', '');
    } else {
      return query;
    }
  }

  // Scroll to top of results upon input change
  function readyToSearchScrollPosition() {
    window.scrollTo({
      top: scrollAnchor.offsetTop,
      left: 0,
      behavior: 'auto',
    });
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
  // MISC HELPER FUNCTIONS
  // ==============
  function addOrRemoveSearchableAttributes(array, value) {
    const index = array.indexOf(value);

    // If the value isn't there, add it and return a new array
    if (index === -1) {
      return [...array, value];
    }

    // Ensure there is always at least one item
    if (array.length <= 1) {
      return array;
    }

    // Else, return a new array with the item filtered out
    return array.filter((item) => item !== value);
  }

  function syncSearchBoxUI() {
    const inputs = document.querySelectorAll('input.ais-SearchBox-input');
    const triggerEl = document.getElementById('search-box-dropdown-trigger')
                      ?.querySelector('.search-box-dropdown-trigger-wrapper');

    if (!inputs.length) return;

    const isFiltered = selectedSearchableFields.length !== validFieldIds.length;
    const nextPlaceholder = isFiltered 
      ? 'Search by custom fields selected'
      : 'Search by keywords, location, or grantee name';

    // 1. Handle the Trigger UI
    triggerEl?.classList.toggle('adjusted', isFiltered);

    // 2. Sync all inputs (Mobile + Desktop)
    inputs.forEach((input, index) => {
      // Update Placeholder only if it changed
      if (input.placeholder !== nextPlaceholder) {
        input.placeholder = nextPlaceholder;
      }
    });
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
    } // terminate early if already a string - handles edge case likely caused by cacheing
    const fixed = !decimals || decimals < 0 ? 0 : decimals; // number of decimal places to show
    const b = num.toPrecision(2).split('e'); // get power
    const k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3); // floor at decimals, ceiling at trillions
    const c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed); // divide by power
    const d = c < 0 ? c : Math.abs(c); // enforce -0 is 0
    const e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
    return e;
  }
}

// Store references for cleanup
let originalPushState;
let originalReplaceState;
let popstateHandler;

export function destroySearchJs() {
  try {
    if (browser) {
      if (search) {
        search.dispose();
        search = null;
      }
      // Restore original history methods
      if (originalPushState) {
        window.history.pushState = originalPushState;
      }
      if (originalReplaceState) {
        window.history.replaceState = originalReplaceState;
      }
      if (popstateHandler) {
        window.removeEventListener('popstate', popstateHandler);
      }

      if (instances.dropdowns && instances.dropdowns.length > 0) {
        instances.dropdowns.forEach((instance) => {
          if (instance && typeof instance.destroy === 'function') {
            try {
              instance.destroy();
            } catch (e) {
              console.warn('Failed to destroy dropdown instance:', e);
            }
          }
        });
      }

      if (instances.formSelects && instances.formSelects.length > 0) {
        instances.formSelects.forEach((instance) => {
          if (instance && typeof instance.destroy === 'function' && instance.el) {
            try {
              instance.destroy();
            } catch (e) {
              console.warn('Failed to destroy formSelect instance:', e);
            }
          }
        });
      }

      const toggleCleanupElement = document.getElementById('toggle-search-type-grants');
      if (toggleCleanupElement) {
        toggleCleanupElement.remove();
      }
    }

    instances = {
      dropdowns: [],
      formSelects: [],
    };
  } catch (error) {
    console.warn('Leaving Grants Search - failed to destroy search items and/or Materialize plugins');
  }
}
