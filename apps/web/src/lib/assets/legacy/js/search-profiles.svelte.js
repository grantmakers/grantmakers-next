import { page } from '$app/state';
import { goto } from '$app/navigation';
import { algoliasearch } from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { history } from 'instantsearch.js/es/lib/routers';
import {
  stats,
  hits,
  searchBox,
  panel,
  refinementList,
  toggleRefinement,
  clearRefinements,
  pagination,
  poweredBy,
} from 'instantsearch.js/es/widgets';
import { connectRange, connectCurrentRefinements, connectConfigure } from 'instantsearch.js/es/connectors';

import { PUBLIC_ALGOLIA_APP_ID, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY, PUBLIC_ALGOLIA_INDEX_NAME } from '$env/static/public';

if (!PUBLIC_ALGOLIA_APP_ID || !PUBLIC_ALGOLIA_SEARCH_ONLY_KEY || !PUBLIC_ALGOLIA_INDEX_NAME) {
  throw new Error('Missing required Algolia public keys. Please ensure environment variables are set.');
}

// InstantSearch
let search;

// Materialize JS Plugins
let instances = {
  dropdowns: [],
  collapsibles: [],
  formSelects: [],
  sidenavs: [],
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

  const elemsCollapsible = document.querySelectorAll('.collapsible');
  if (elemsCollapsible.length > 0) {
    const initialized = M.Collapsible.init(elemsCollapsible);
    const validInstances =
      Array.isArray(initialized) ?
        initialized.filter((instance) => instance != null)
      : [initialized].filter((instance) => instance != null);
    instances.collapsibles.push(...validInstances);
  }

  const elemsSideNav = document.querySelectorAll('.sidenav');
  if (elemsSideNav.length > 0) {
    const initialized = M.Sidenav.init(elemsSideNav);
    const validInstances =
      Array.isArray(initialized) ?
        initialized.filter((instance) => instance != null)
      : [initialized].filter((instance) => instance != null);
    instances.sidenavs.push(...validInstances);
  }

  const elSearchBoxDropdown = document.querySelectorAll('.dropdown-trigger')[0]; // HACK Hard coding using bracket notation is precarious
  if (elSearchBoxDropdown) {
    const optionsSearchBoxDropdown = {
      alignment: 'right',
      constrainWidth: false,
      coverTrigger: false,
      closeOnClick: false,
      onCloseEnd: function () {
        forceInputFocus();
      },
    };
    const instance = M.Dropdown.init(elSearchBoxDropdown, optionsSearchBoxDropdown);
    if (instance) {
      instances.dropdowns.push(instance);
    }
  }

  const searchClient = algoliasearch(PUBLIC_ALGOLIA_APP_ID, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY);
  const algoliaIndex = PUBLIC_ALGOLIA_INDEX_NAME;
  const facets = [
    {
      facet: 'city',
      label: 'City',
    },
    {
      facet: 'state',
      label: 'State',
    },
    {
      facet: 'assets',
      label: 'Assets',
    },
    {
      facet: 'grants_to_preselected_only',
      label: 'Part XV Line 2 is Not Checked',
    },
  ];

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
           */
          // Get the current page.url
          const currentPageUrl = page.url;
          // Get the "next ur", passed in by Algolia as a parameter
          // Reformat as needed
          const href = typeof url === 'string' ? url : `${url.pathname}${url.search}${url.hash}`;

          // Check if the current URL contains has search params.
          const hasSearch = currentPageUrl.search.includes('?');

          // If the current URL has no search, it's the FIRST search.
          // Thus, we want to PUSH this to history.
          if (!hasSearch) {
            goto(href, {
              keepFocus: true,
              noScroll: true,
              // Explicitly set replaceState to false - which is the default
              replaceState: false,
            });
          } else {
            // The URL already has search params, so this is a REFINEMENT.
            // We want to REPLACE the current history entry.
            goto(href, {
              keepFocus: true,
              noScroll: true,
              replaceState: true,
            });
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
            /*
            'restrict_to':
              indexUiState.configure &&
              indexUiState.configure.restrictSearchableAttributes &&
              indexUiState.configure.restrictSearchableAttributes.join('~'),
              */
            city: indexUiState.refinementList && indexUiState.refinementList.city && indexUiState.refinementList.city.join('~'),
            state: indexUiState.refinementList && indexUiState.refinementList.state && indexUiState.refinementList.state.join('~'),
            exclude_grants_to_preselected_only: indexUiState.toggle && indexUiState.toggle.grants_to_preselected_only,
            assets: indexUiState.range && indexUiState.range.assets && indexUiState.range.assets.replace(':', '~'),
            page: indexUiState.page,
          };
        },
        routeToState(routeState) {
          /**
           * Route to State takes the url and parses it
           * The object it creates is sent to the widgets
           */
          return {
            [algoliaIndex]: {
              query: routeState.query,
              /*
              'configure': {
                'restrictSearchableAttributes': routeState.restrict_to && routeState.restrict_to.split('~'),
              },
              */
              refinementList: {
                city: routeState.city && routeState.city.split('~'),
                state: routeState.state && routeState.state.split('~'),
              },
              toggle: {
                grants_to_preselected_only: routeState.exclude_grants_to_preselected_only,
              },
              range: {
                assets: routeState.assets && routeState.assets.replace('~', ':'),
              },
              page: routeState.page,
            },
          };
        },
      },
    },
  });

  // Define templates
  const templateStats = `{{#hasNoResults}}No results{{/hasNoResults}}
    {{#hasOneResult}}1 Grantmaker{{/hasOneResult}}
    {{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} Grantmakers{{/hasManyResults}}`;

  const templateHits = `  <div class="card">
    <div class="card-content">
      <div class="row">
        <div class="col s6">
          <ul class="inline-list hit-summary-icons">
            <li class="left">
              <i class="material-icons {{#has_recent_grants}}material-icons-active{{/has_recent_grants}} tooltipped" {{#has_recent_grants}} data-tooltip="Has recent grants"{{/has_recent_grants}}{{^has_recent_grants}} data-tooltip="No recent grants"{{/has_recent_grants}}>monetization_on</i>
            </li>
            <li class="left">
              <i class="material-icons {{#is_likely_staffed}}material-icons-active{{/is_likely_staffed}} tooltipped" {{#is_likely_staffed}} data-tooltip="Is likely staffed"{{/is_likely_staffed}}{{^is_likely_staffed}} data-tooltip="No paid, full-time staff<br>listed in tax return"{{/is_likely_staffed}}>account_circle</i>
            </li>
            <li class="left">
              {{#website}}
                {{#website_is_an_email}}
                <i class="material-icons tooltipped" data-tooltip="No website available">public</i>
                {{/website_is_an_email}}
                {{^website_is_an_email}}
                <i class="material-icons material-icons-active website tooltipped" data-tooltip="Website available">public</i>
                {{/website_is_an_email}}
              {{/website}}
              {{^website}}
              <i class="material-icons tooltipped" data-tooltip="No website available">public</i>
              {{/website}}
            </li>
            <li class="left">
              {{#grants_to_preselected_only}}
              <i class="material-icons tooltipped" data-tooltip="Grants to preselected organizations only.<br>Part XV Line 2 is checked.">lock</i>
              {{/grants_to_preselected_only}}
              {{^grants_to_preselected_only}}
              <i class="material-icons material-icons-active tooltipped" data-tooltip="Possibly accepts unsolicited applications.<br>Part XV Line 2 is unchecked.">lock_open</i>
              {{/grants_to_preselected_only}}
            </li>
          </ul>
        </div>
        <div class="col s6 right-align">
          <span class="text-light tooltipped" data-tooltip="EIN">{{ ein_formatted }}</span>
        </div>
      </div>
      <span class="card-title">
        {{#_highlightResult.organization_name}}
        <a class="hit-name" href="/profiles/v0/{{ ein }}-{{ organization_name_slug }}/" title="View Profile">{{#helpers.highlight}}{ "attribute": "organization_name" }{{/helpers.highlight}}</a>
        {{/_highlightResult.organization_name}}
        {{^_highlightResult.organization_name}}
        <a class="hit-name" href="/profiles/v0/{{ ein }}-{{ organization_name_slug }}/" title="View Profile">{{{organization_name}}}</a>
        {{/_highlightResult.organization_name}}
      </span>
      {{#_highlightResult.city}}
      <p class="grantmakers-text">{{#helpers.highlight}}{ "attribute": "city" }{{/helpers.highlight}}, {{#helpers.highlight}}{ "attribute": "state" }{{/helpers.highlight}}</p>
      {{/_highlightResult.city}}
      {{^_highlightResult.city}}
      <p class="grantmakers-text">{{{city}}}, {{{state}}}</p>
      {{/_highlightResult.city}}
      {{#hits_people.length}}
      <div class="hits-people text-light">
        <div class="small">People matches</div>
        {{#hits_people}}
        <div>{{{name}}} - {{{title}}}</div>
        {{/hits_people}}
      </div>
      {{/hits_people.length}}
      <ul class="list-inline hit-summary-financials grey lighten-4">
        <li>
          <h6 class="text-muted">{{ assets }}<br><small>Total Assets</small></h6>
        </li>
        <li class="right center">
          {{#grants_reference_attachment}}
          <h6 class="text-muted tooltipped" data-tooltip="Additional grant details may be available<br>in tax filing attachments">{{ grant_count }}*<br><small>Grant{{^grant_count_only_one}}s{{/grant_count_only_one}}</small></h6>
          {{/grants_reference_attachment}}
          {{^grants_reference_attachment}}
          <h6 class="text-muted tooltipped" data-tooltip="No. of grants listed in<br>latest tax filing<br>FY {{filings.0.tax_year}}">{{ grant_count }}{{#grants_reference_attachment}}*{{/grants_reference_attachment}}<br><small>Grant{{^grant_count_only_one}}s{{/grant_count_only_one}}</small></h6>
          {{/grants_reference_attachment}}
        </li>
        <li class="right center">
          <h6 class="text-muted tooltipped" data-tooltip="<span class='left'>Max </span><span class='right'>{{grant_max}}</span><br><span class='left'>Min </span><span class='right'>{{grant_min}}</span>">{{ grant_median }}<br><small>Median Grant</small></h6>
        </li>
      </ul>
    </div>
  </div>`;

  const templateShowMore = `  {{#isShowingMore}}
    [ - ] Showing top 20 results
  {{/isShowingMore}}
  {{^isShowingMore}}
    [ + ] Show top 20 results
  {{/isShowingMore}}`;

  // Define default search parameters
  const defaultSearchableAttributes = ['organization_name', 'city', 'state', 'ein', 'people.name'];
  const defaultAttributesToHighlight = ['organization_name', 'city', 'state', 'ein', 'people.name', 'people.title'];

  /* ---------------------------- */
  /* Connector - Configure Widget */
  /* ---------------------------- */
  const renderConfigure = (renderOptions, isFirstRender) => {
    const { refine, widgetParams } = renderOptions;
    if (isFirstRender) {
      const searchDropdownItems = document.getElementById('dropdown-body');
      const searchDropDownOnlyButtons = document.querySelectorAll('.checkbox-only');

      // Create event listener for "Only" link clicks
      searchDropDownOnlyButtons.forEach((element) => {
        element.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent Materialize Dropdown from taking over
          const attribute = e.target.dataset.attribute;

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

          // Refine Algolia parameters
          refine({
            restrictSearchableAttributes: addOrRemoveAttributes(
              true,
              'restrictSearchableAttributes',
              widgetParams.searchParameters.restrictSearchableAttributes,
              attribute,
            ),
            attributesToHighlight: addOrRemoveAttributes(
              true,
              'attributesToHighlight',
              widgetParams.searchParameters.attributesToHighlight,
              attribute,
            ),
          });
        });
      });

      // Create event listener for "Select All" link clicks
      document.getElementById('select-all').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent Materialize Dropdown from taking over

        // Mimic default Materialize Dropdown functionality
        searchDropdownItems.querySelectorAll('input').forEach((el) => {
          el.checked = true;

          // Hide Materialize after selection
          // Materialize default for dropdowns requires clicking off dropdown wrapper
          const instance = M.Dropdown.getInstance(elSearchBoxDropdown);
          instance.close();
          readyToSearchScrollPosition();
        });
        refine({
          restrictSearchableAttributes: defaultSearchableAttributes,
          attributesToHighlight: defaultAttributesToHighlight,
        });
      });

      // Create event listener for individual checkbox selections
      searchDropdownItems.addEventListener('change', (e) => {
        const attribute = e.target.id;
        const isChecked = e.target.checked; // Note: this is the status AFTER the change

        // Show message if user checkbox selections result in invalid state
        // Note: EIN will always remain in searchable attributes
        // Thus array.length should at least be 2, not 1
        if (widgetParams.searchParameters.restrictSearchableAttributes.length === 2 && isChecked === false) {
          e.target.checked = !isChecked;
          M.Toast.dismissAll();
          M.toast({ html: 'At least one item must be selected' });
          return;
        }

        // Refine Algolia parameters
        // Note: EIN will always remain in searchable attributes
        // EIN "always searchable" is primarily a UI design decision
        refine({
          restrictSearchableAttributes: addOrRemoveAttributes(
            false,
            'restrictSearchableAttributes',
            widgetParams.searchParameters.restrictSearchableAttributes,
            attribute,
          ),
          // Add/remove people from highlighted attributes
          // Effectively hides people matches section from Mustache template
          attributesToHighlight: addOrRemoveAttributes(
            false,
            'attributesToHighlight',
            widgetParams.searchParameters.attributesToHighlight,
            attribute,
          ),
        });
        readyToSearchScrollPosition();
      });
    }

    // Adjust UI based on selections
    // Add or remove visual cue implying a customization was made
    // Change input placeholder text => default is somewhat redundant as also declared in searchBox widget
    const inputEl = document.querySelector('input.ais-SearchBox-input');
    const triggerEl = document.getElementById('search-box-dropdown-trigger')?.querySelector('.search-box-dropdown-trigger-wrapper');

    if (inputEl && triggerEl) {
      if (widgetParams.searchParameters.restrictSearchableAttributes.length === 5) {
        triggerEl.classList.remove('adjusted');
        inputEl.placeholder = 'Search by foundation name, location, trustees, or EIN';
      } else {
        triggerEl.classList.add('adjusted');
        inputEl.placeholder = 'Search by custom fields selected';
      }
    }
  };

  // Create the custom widget
  const customConfigure = connectConfigure(renderConfigure, () => {});

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
        <button class="waves-effect btn blue-grey lighten-3 grey-text text-darken-3 truncate" ${createDataAttribtues(refinement)}><i class="material-icons right">remove_circle</i><small>${getLabel(item.label)}</small> ${formatIfRangeOrToggleLabel(refinement)} </button>
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

  search.addWidget(
    customCurrentRefinements({
      container: document.querySelector('#ais-widget-current-refined-values'),
    }),
  );

  /* ----------------------- */
  /* Connector - Range Input */
  /* ----------------------- */
  // Create the render function
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
      const helperEl = event.target.nextElementSibling;
      let amount = parseFloat(event.target.value);
      let formattedAmount = `${amount ? '$' + numberHuman(amount) : ''}`;
      helperEl.textContent = formattedAmount;

      // UI reminder to click button
      const button = document.querySelector('.ais-RangeInput-submit');
      button.classList.remove('grey', 'lighten-3');
      button.classList.add('blue-grey', 'white-text');

      // Text reminder to click button
      const reminderEl = document.querySelector('.ais-Panel-footer');
      reminderEl.textContent = "Don't forget to click Go";
    });

    widgetParams.container.querySelector('form').innerHTML = `
      <div id="range-input-min" class="label-wrapper">
        <label class="ais-RangeInput-label valign-wrapper">
          <input
            class="ais-RangeInput-input ais-RangeInput-input--min !outline !outline-1 !-outline-offset-1 !outline-gray-200"
            type="number"
            name="min"
            placeholder="$0"
            value="${Number.isFinite(min) ? min : ''}"
          />
          <span class="label-helper">${Number.isFinite(min) ? '$' + numberHuman(min) : 'Min'}</span>
        </label>
      </div>
      <div id="range-input-max" class="label-wrapper">
        <label class="ais-RangeInput-label valign-wrapper">
          <input
            class="ais-RangeInput-input ais-RangeInput-input--max !outline !outline-1 !-outline-offset-1 !outline-gray-200"
            type="number"
            name="max"
            placeholder="$0"
            value="${Number.isFinite(max) ? max : ''}"
          />
          <span class="label-helper">${Number.isFinite(max) ? '$' + numberHuman(max) : 'Max'}</span>
        </label>
      </div>
      <button class="ais-RangeInput-submit btn grey lighten-3" type="submit">Go</button>
    `;
  };

  // Create the custom range input widget
  const customRangeInput = connectRange(renderRangeInput);

  // Create the panel widget wrapper
  const customRangeInputWithPanel = panel({
    templates: {
      header: 'Assets',
      footer: '&nbsp;',
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
    // Assets handled via its own widget
    if (refinement.facet === 'assets') {
      return;
    }
    // Exclusionary handled via their own widget
    if (refinement.facet === 'grants_to_preselected_only') {
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
    const mobileRefinementListWithPanel = panel({
      templates: {
        header: refinement.label,
      },
      hidden(options) {
        return options.results.nbHits === 0;
      },
      cssClasses: {
        root: 'card',
        header: ['card-header', 'grey', 'lighten-2'],
        body: 'card-content',
      },
    })(refinementList);

    /* Create desktop refinements */
    search.addWidget(
      refinementListWithPanel({
        container: `#ais-widget-refinement-list--${refinement.facet}`,
        attribute: refinement.facet,
        limit: 8,
        showMore: true,
        showMoreLimit: 20,
        // 'searchable': true,
        cssClasses: {
          checkbox: 'filled-in',
          labelText: 'small',
          count: ['right', 'small', 'tabular-nums'],
          showMore: 'btn-flat small',
          disabledShowMore: 'hidden',
          // 'selectedItem': ['grants-search-text'],
          // 'searchableRoot': 'ais-SearchBox-refinements',
          // 'searchableSubmit': 'hidden',
        },
        templates: {
          showMoreText: templateShowMore,
        },
      }),
    );

    /* Create mobile refinements */
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
  });

  /* -------------------- */
  /* Exclusionary Toggles */
  /* -------------------- */
  const toggleRefinementWithPanel = panel({
    templates: {
      header:
        'Grant Guidelines <button command="show-modal" commandfor="irs-exclude-info" type="button" class="focus:!bg-transparent right"><i class="material-icons right text-muted-max modal-trigger" title="Click to learn more">info</i></button>',
    },
    hidden(options) {
      return options.results.nbHits === 0;
    },
    cssClasses: {
      root: 'card',
      header: ['card-header'],
      body: 'card-content',
    },
  })(toggleRefinement);

  /* ---------------------------- */
  /* Instantiate all Widgets
  /* ---------------------------- */
  search.addWidgets([
    searchBox({
      container: '#ais-widget-search-box',
      placeholder: 'Search by foundation name, location, trustees, or EIN',
      autofocus: false,
      showSubmit: true,
      showReset: true,
      showLoadingIndicator: false,
      cssClasses: {
        input:
          'flex-grow h-12 pl-10 pr-4 w-full bg-white text-gray-900 text-base rounded-lg border-0 appearance-none shadow-none transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 !outline !outline-1 !-outline-offset-1 !outline-gray-200',
      },
      queryHook: function (query, searchInstance) {
        // Query hook is called just before search is triggered
        const queryCleaned = checkForEIN(query);
        readyToSearchScrollPosition();
        searchInstance(queryCleaned);
      },
    }),

    customConfigure({
      container: document.querySelector('#search-box-dropdown'),
      searchParameters: {
        hitsPerPage: 8,
        restrictSearchableAttributes: defaultSearchableAttributes,
        attributesToHighlight: defaultAttributesToHighlight,
      },
    }),

    poweredBy({
      container: '#powered-by',
    }),

    hits({
      container: '#ais-widget-hits',
      templates: {
        item: templateHits,
        empty(results) {
          let params = results._state.restrictSearchableAttributes;
          let paramsText;
          if (params.length === defaultSearchableAttributes.length) {
            paramsText = `across foundation names, locations, trustees, and EINs`; // eslint-disable-line no-undef
          } else {
            paramsText = `and narrowed Fields to Search`; // eslint-disable-line no-undef
          }
          const templateHitsEmpty = `<div id="no-results-ctas" class="hits-empty">
            <div class="card">
              <div class="card-content">
                <p>No results found for your query <strong>"<span>${results.query}</span>"</strong></p>
              </div>
            </div>
            <div class="card">
              <div class="card-content">
                <p>You conducted a Foundation Search ${paramsText}</p>
              </div>
            </div>
            <div class="card z-depth-0 grey lighten-4">
              <div class="card-content">
                <div class="card-title">Not looking for a specific funder?</div>
                <p>Try your query using a <a href="{{ site.baseurl }}/search/grants/?query={{ query }}" data-ga="Grants Search">Grants Search</a></p>
              </div>
            </div>
            <div class="card z-depth-0 grey lighten-4">
              <div class="card-content">
                <div class="card-title">
                  Get to know Grantmakers.io
                </div>
                <p><a href="/about/" data-ga="Get to know link">Tips and tricks</a> to get the most out of your searches</p>
              </div>
            </div>
          </div>`;
          return templateHitsEmpty;
        },
      },
      cssClasses: {
        list: 'row',
        item: ['col', 's12'],
      },
      transformItems(items) {
        return items.map((item) => ({
          ...item,
          ein_formatted: item.ein.replace(/(\d{2})(\d{7})/, '$1-$2'),
          grant_median: `$${item.grant_median.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`,
          grant_min: `$${item.grant_min.toLocaleString()}`,
          grant_max: `$${item.grant_max.toLocaleString()}`,
          grant_count: `${item.grant_count.toLocaleString()}`,
          grant_count_only_one: item.grant_count === 1 ? true : false,
          assets: `$${numberHuman(item.assets, 0)}`,
          hits_people: hitsPeople(item._highlightResult.people),
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
      attribute: 'assets',
    }),

    toggleRefinementWithPanel({
      container: '#ais-widget-refinement-list--grants_to_preselected_only',
      attribute: 'grants_to_preselected_only',
      on: false,
      templates: {
        labelText: 'Exclude funders that do not accept unsolicited requests for funds',
      },
      cssClasses: {
        checkbox: 'filled-in',
        labelText: 'small',
      },
    }),

    clearRefinements({
      container: '#ais-widget-clear-all',
      cssClasses: {
        button: ['btn grantmakers white-text waves-effect waves-light'],
      },
      templates: {
        resetLabel: 'Clear filters',
      },
    }),

    clearRefinements({
      container: '#ais-widget-mobile-clear-all',
      cssClasses: {
        button: ['btn waves-effect waves-light'],
        disabledButton: 'hidden',
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
    // Search toggle
    initSelect();
  });

  search.on('render', async function () {
    // Destory any existing tooltips
    destroyTooltips();
    // Init Materialize items
    initTooltips();
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
    console.log(e);
  });

  /* ---------------------------- */
  /* Start Search
  /* ---------------------------- */
  search.start();

  /* ---------------------------- */
  /* Materialize init helpers
  /* ---------------------------- */
  function initTooltips() {
    const elems = document.querySelectorAll('.tooltipped');
    const options = {
      position: 'top',
      exitDelay: 0, // Default is 0
      enterDelay: 100, // Default is 200
      inDuration: 300, // Default is 300
      outDuration: 250, // Default is 250
    };
    M.Tooltip.init(elems, options);
  }

  function destroyTooltips() {
    // Note: Cannot use Materialize tooltip destroy() method due to apparent bug in v1.0.0
    // Note: This likely to be brittle if swtiching to Vue due to async
    const elems = document.getElementsByClassName('material-tooltip');
    while (elems.length > 0) {
      elems[0].parentNode.removeChild(elems[0]);
    }
  }

  function initSelect() {
    /**
     * There is only one select element - the search toggle in the search box element
     * TODO This is consistently NOT destroyed in the cleanup function at Svelte component dismount
     */
    const elem = document.getElementById('toggle-search-type-profiles');
    if (elem?.length === 0) return;

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
  // Accessibility fix
  const submitButton = document.querySelector('.ais-SearchBox-submit');
  if (submitButton) {
    submitButton.setAttribute('aria-label', 'Search');
  }
  function addOrRemoveAttributes(isOnly, type, array, attribute) {
    // TODO lots of opportunities to DRY this up
    // If attribute is 'city', need to also add/remove 'state'
    // If attribute is 'people.name', need to add/remove 'people.title from attributes to highlight
    const unchangedArray = array;
    let index = array.indexOf(attribute);

    // Handle "only" link clicks
    // EIN will always be included
    if (isOnly) {
      // City attribute is combined with State
      if (attribute === 'city') {
        return ['ein', 'city', 'state'];
        // People attribute requires special handling
        // Need to add title to highlight attributes, but not search restrictions
      } else if (attribute === 'people.name') {
        if (type === 'attributesToHighlight') {
          return ['ein', 'people.name', 'people.title'];
        } else {
          return ['ein', 'people.name'];
        }
        // Anything else, just return it
      } else if (attribute === 'organization_name') {
        return ['ein', 'organization_name'];
      }
    }

    // If the attribute is not already in the array, add it
    if (index === -1) {
      array.push(attribute);
      // City attribute requires adding State
      if (attribute === 'city') {
        array.push('state');
      }
      // People attribute requires adding Title, but only to highlight attributes
      if (type === 'attributesToHighlight' && attribute === 'people.name') {
        array.push('people.title');
      }
      // If the attribute already exists in the array, remove it
    } else {
      array.splice(index, 1);
      // City requires removing State as well
      if (attribute === 'city') {
        let indexState = array.indexOf('state');
        array.splice(indexState, 1);
      }
      // People attribute requires removing Title, but only from highlight attributes
      if (type === 'attributesToHighlight' && attribute === 'people.name') {
        let indexPeople = array.indexOf('people.title');
        array.splice(indexPeople, 1);
      }
    }

    // Ensure at least one item is checked
    if (array.length < 2) {
      // ein will always be there
      return unchangedArray;
    } else {
      return array;
    }
  }

  function forceInputFocus() {
    document.querySelector('.ais-SearchBox-input').focus();
  }

  function hitsPeople(people) {
    if (!people) {
      return [];
    }

    const arr = [];
    people.map((person) => {
      const obj = {};
      if ((person.name && person.name.matchLevel === 'partial') || (person.name && person.name.matchLevel === 'full')) {
        obj.name = person.name.value;
        obj.title = person.title ? person.title.value : '';
        arr.push(obj);
      }
    });
    return arr;
  }

  function getLabel(item) {
    const obj = facets.filter((each) => each.facet === item);
    return obj[0].label;
  }

  function formatIfRangeOrToggleLabel(refinement) {
    if (refinement.attribute === 'assets') {
      return `${refinement.operator} $${numberHuman(refinement.value)}`;
    } else if (refinement.attribute === 'grants_to_preselected_only') {
      return '';
    } else {
      return refinement.label;
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

export function destroySearchJs() {
  try {
    if (search) {
      search.dispose();
      search = null;
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

    if (instances.collapsibles && instances.collapsibles.length > 0) {
      instances.collapsibles.forEach((instance) => {
        if (instance && typeof instance.destroy === 'function') {
          try {
            instance.destroy();
          } catch (e) {
            console.warn('Failed to destroy collapsible instance:', e);
          }
        }
      });
    }

    if (instances.sidenavs && instances.sidenavs.length > 0) {
      instances.sidenavs.forEach((instance) => {
        if (instance && typeof instance.destroy === 'function') {
          try {
            instance.destroy();
          } catch (e) {
            console.warn('Failed to destroy sidenav instance:', e);
          }
        }
      });
    }

    const toggleCleanupElement = document.getElementById('toggle-search-type-profiles');
    if (toggleCleanupElement) {
      toggleCleanupElement.remove();
    }

    instances = {
      dropdowns: [],
      collapsibles: [],
      formSelects: [],
      sidenavs: [],
    };
  } catch (error) {
    console.warn('Leaving Profiles Search - failed to destroy search items and/or Materialize plugins');
  }
}
