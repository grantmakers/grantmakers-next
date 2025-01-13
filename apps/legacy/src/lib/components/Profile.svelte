<script lang="ts">
  import legacyFavicon from '$lib/assets/legacy/images/favicon.png';
  import legacyLogo from '$lib/assets/legacy/images/logo.png';
  import algoliaPartnership from '$lib/assets/legacy/images/algolia-partnership-logo.svg';
  import nyc from '$lib/assets/legacy/images/NY.jpg';
  import irsLogo from '$lib/assets/legacy/images/irs-w-text.png';
  import irsLogoAlt from '$lib/assets/legacy/images/irs-w-text-alt.png';
  import proPublicaLogo from '$lib/assets/legacy/images/propublica.png';
  import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
  import { onMount } from 'svelte';
  import { formatNumber, formatToCurrency, humanizeCurrency, humanizeNumber } from '@repo/shared/functions/formatters/numbers';
  import { formatDateToMonthYear } from '@repo/shared/functions/formatters/dates';
  import { upperFirstLetter } from '@repo/shared/functions/formatters/names';
  import Footer from './Footer.svelte';
  interface Props {
    profile: GrantmakersExtractedDataObj;
  }

  let { profile }: Props = $props();

  // Mimic Jekyll
  const site = {
    baseurl: '/profiles',
    url: '', //'https://www.grantmakers.io',
    algolia_referral_link: 'https://www.algolia.com/?utm_source=grantmakersio&utm_medium=referral',
  };
  const page = $derived(profile);

  const firstLetter = $derived(upperFirstLetter(page.organization_name));
  const colors = ['red', 'blue', 'green', 'purple', 'yellow', 'pink', 'indigo', 'orange', 'grey', 'cyan', 'lime'];

  const colorIndex = $derived(firstLetter.charCodeAt(0) % colors.length);
  const bgColor = $derived(colors[colorIndex]);

  const orgFinancialStats = $derived(page.financial_stats);

  let algolia = $derived(() => {
    // Ensure profiles with only 2009, 2010, 2011, or 2012 grants do NOT use Algolia
    // Removed 2009-2012 grants from Algolia index to stay under the 6m record limit
    if (
      page.filings[0].tax_year == 2009 ||
      page.filings[0].tax_year == 2010 ||
      page.filings[0].tax_year == 2011 ||
      page.filings[0].tax_year == 2012
    )
      return false;

    return page.grant_count > 5 || (page.grant_count > 0 && page.filings[1]);
  });

  let filingCount = $derived(page.grants_facets.filter((filing) => filing.grant_count > 0).length);

  let simplify = $derived(page.grant_count_all_years < 20 || (filingCount <= 1 && page.grant_count <= 20));

  let enable_tax_year_dropdown = $derived(page.filings[1] && page.grants_facets[1].grant_count > 0);

  const taxPeriod = $derived(String(page.filings[0].tax_period));
  const fiscalMonth = $derived(taxPeriod.slice(4, 6));
  const fiscalYear = $derived(taxPeriod.slice(0, 4));
  const taxYear = $derived(page.filings[0].tax_year);

  const currentYear = $derived(new Date().getFullYear());
  const currentYearMinusOne = $derived(currentYear - 1);

  // Convert the IRS last updated date to a year number
  const lastUpdatedYear = $derived(new Date(page.last_updated_irs).getFullYear());

  // Determine if we need the warning class
  const cardPanelClasses = $derived(`card-panel-body${lastUpdatedYear < currentYearMinusOne ? ' yellow lighten-4' : ''}`);

  // Handle static grants
  let staticGrants = $derived(page.grants_current_year_top_20);
  const hasForeignGrantRecipients = $derived(() => {
    if (staticGrants && staticGrants.length > 0) {
      for (const grant of staticGrants) {
        if (grant.is_foreign) {
          return true;
        }
      }
    }

    return false;
  });

  onMount(async () => {
    let M = await import('materialize-css');
    const { initProfileJs } = await import('$lib/assets/legacy/js/profile');
    try {
      initProfileJs(M, orgFinancialStats);
    } catch (error) {
      console.log(error);
    }
    if (page.enable_algolia_search) {
      const { initSearchJs } = await import('$lib/assets/legacy/js/profile-embedded-search');
      try {
        initSearchJs(M);
      } catch (error) {
        console.log(error);
      }
    }
  });
</script>

<div id="main-nav" class="navbar-fixed">
  <nav id="scrollspy-target" class="navbar-profile affix-top pushpin-nav" data-target="main-nav">
    <div class="nav-wrapper">
      <div class="container-custom">
        <a href={'#'} data-target="mobile-nav" class="sidenav-trigger right disable-primary-color print-hidden"
          ><i class="material-icons">menu</i></a
        >
        <div class="row">
          <div class="col s8 m6 l2 xl2">
            <a data-sveltekit-reload href="/" data-ga="Homepage" class="brand-logo">
              <div class="logo-container">
                <div class="logo">
                  <img src={legacyLogo} alt="Grantmakers.io Logo" />
                </div>
                <div class="brand brand-name">Grantmakers.io</div>
              </div>
            </a>
          </div>
          <div class="col l4 xl5 hide-on-med-and-down valign-wrapper" style="height: 64px">
            <div class="breadcrumb-wrapper left">
              <a
                data-sveltekit-reload
                href="/search/profiles/"
                class="breadcrumb hide-on-large-and-down"
                data-ga="Breadcrumb Profile Search">Foundation Profiles</a
              >
              <span class="breadcrumb">{page.organization_name}</span>
            </div>
            {#if algolia()}
              <span class="algolia-partnership-logo print-hidden"
                ><a href={site.algolia_referral_link}><img src={algoliaPartnership} alt="Algolia Partnership Logo" /></a></span
              >
            {/if}
          </div>
          <div class="col m6 l6 xl5 hide-on-med-and-down print-hidden">
            <ul class="nav-primary right">
              <li><a href="#people" data-ga="People">People</a></li>
              <li><a href="#grants" data-ga="Grants">Grants</a></li>
              <li><a href="#application-info" data-ga="Application Guidelines">Guidelines</a></li>
              <li><a href="#financials" data-ga="Grants">Financials</a></li>
              <li>
                <a href={'#'} data-target="navbar-more" class="dropdown-trigger print-hidden" id="primary-navbar-dropdown-trigger"
                  >More <i style="margin-left:3px" class="material-icons right">arrow_drop_down</i></a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</div>

<!-- Navbar dropdown -->
<ul class="dropdown-content dropdown-content-profile" id="navbar-more">
  <li class="dropdown-title small grey darken-3 valign-wrapper white-text">
    <img src={legacyFavicon} alt="Grantmakers.io Logo" />Grantmakers.io
  </li>
  <li>
    <a data-sveltekit-reload href="/search/profiles/" class="waves-effect waves-light" data-ga="Profiles Search" title="Profiles Search"
      >Profiles Search</a
    >
  </li>
  <li>
    <a data-sveltekit-reload href="/search/grants/" class="waves-effect waves-light" data-ga="Grants Search" title="Grants Search"
      >Grants Search</a
    >
  </li>
  <li class="divider"></li>
  <li><a data-sveltekit-reload href="/about/" class="waves-effect waves-light" data-ga="About" title="About">About</a></li>
  <li><a data-sveltekit-reload href="/about/faq/" class="waves-effect waves-light" data-ga="FAQ" title="FAQ">FAQ</a></li>
  <li class="divider"></li>
  <li class="dropdown-bottom-cta grey darken-3 white-text">
    <a data-sveltekit-reload href="/buy-chad-a-coffee/" class="waves-effect waves-light small" data-ga="Coffee" title="Buy Chad a Coffee"
      ><i class="material-icons">emoji_food_beverage</i> Buy Chad a Coffee</a
    >
  </li>
</ul>

<!-- Mobile navbar -->
<ul class="nav-primary sidenav sidenav-close" id="mobile-nav">
  <li class="grey darken-3 sidenav-header">
    <a data-sveltekit-reload href="/" class="waves-effect waves-light" data-ga="Home">
      <div class="valign-wrapper">
        <img src={legacyLogo} alt="Grantmakers Logo" />
        <span class="strong white-text"> Grantmakers.io</span>
      </div>
    </a>
  </li>
  <li class="disabled"><a href={'#'} class="grey-text">Current Profile</a></li>
  <li><a data-sveltekit-reload href="#people">People</a></li>
  <li><a data-sveltekit-reload href="#grants">Grants</a></li>
  <li><a data-sveltekit-reload href="#application-info">Application Guidelines</a></li>
  <!-- <li><a href="#financial-overview">Financials</a></li> -->
  <li><hr class="divider" /></li>
  <li class="disabled"><a href={'#'} class="title grey-text">Search</a></li>
  <li>
    <a data-sveltekit-reload href="/search/profiles/" class="waves-effect waves-light"> Find a Foundation Profile </a>
  </li>
  <li>
    <a data-sveltekit-reload href="/search/grants" class="waves-effect waves-light"> Search all Grants </a>
  </li>
  <li><hr class="divider" /></li>
  <li class="disabled"><a href={'#'} class="title grey-text">The Project</a></li>
  <li><a data-sveltekit-reload href="/about/" class="waves-effect waves-light" data-ga="About">About</a></li>
  <li><a data-sveltekit-reload href="/about/faq/" class="waves-effect waves-light" data-ga="FAQ">FAQ</a></li>
  <li><hr class="divider" /></li>
  <li class="disabled"><a data-sveltekit-reload href={'#'} class="title grey-text">Get Involved</a></li>
  <li>
    <a data-sveltekit-reload href="/about/donate/" class="waves-effect waves-light" data-ga="Donate" title="Donate">Donate</a>
  </li>
</ul>

<div class="wrapper min-h-full">
  <div class="header header-bg" style="background-image: url({nyc});"></div>
  <div class="main main-raised">
    <div class="profile-content">
      <div class="row row-alert-fixed-to-top grey darken-4">
        <div class="col s6">
          <div
            class="alert-content alert-content-left right-align"
            data-position="left"
            data-html="true"
            data-tooltip="<b>Source</b><br>Profile pulled directly<br>from electronically filed<br>IRS Form 990 PF"
          >
            IRS Form 990 PF
          </div>
        </div>
        <div class="col s6 m2">
          <div
            class="alert-content alert-content-right tooltipped left-align"
            data-position="right"
            data-tooltip="Fiscal year ending {fiscalMonth}/{fiscalYear}"
          >
            Tax Year {taxYear}
          </div>
        </div>
        <div class="col m4 hide-on-small-only hidden">
          <div class="alert-content alert-content-icon right-align">
            <img class="tooltipped" src={legacyLogo} alt="Grantmakers Logo" data-position="left" data-tooltip="Grantmakers.io" />
          </div>
        </div>
      </div>
      <div class="container-custom">
        <div class="row">
          <div class="col s12">
            <div id="profile" class="profile center-align">
              <div class="profile-avatar">
                {#if firstLetter !== ''}
                  <div class="avatar-container">
                    <div class="avatar-letter {bgColor}">{firstLetter}</div>
                  </div>
                {:else}
                  <img
                    src="/default.png"
                    alt="Foundation First Initial Icon"
                    class="md:shadow-soft-sm size-12 w-full rounded-xl md:size-20"
                    width="74"
                    height="74"
                  />
                {/if}
              </div>
              <div class="name">
                <h1
                  id="org-data"
                  class="org-name"
                  data-ein={page.ein}
                  data-name={page.organization_name}
                  data-url="{site.baseurl}/{page.ein}/"
                  data-tax-year={taxYear}
                  data-tax-year-only-one={!(page.filings[1] && page.grants_facets[1].grant_count > 0)}
                >
                  {#if page.website}
                    <a
                      href={page.website}
                      class="js-ga-website-click disable-primary-color"
                      title="Click to visit website"
                      data-ga="Website H1 Click">{page.organization_name}</a
                    >
                  {:else}
                    {page.organization_name}
                  {/if}
                </h1>
                {#if page.is_foreign}
                  <h6 class="org-location">
                    {page.city}, {#if page.state == 'Foreign'}{page.country}*{:else}{page.state}{/if}
                  </h6>
                {:else}
                  <h6 class="org-location">{page.city}, {page.state}</h6>
                {/if}
                <ul class="list-inline org-location profile-summary-icons text-center">
                  <li>
                    {#if page.has_recent_grants}
                      <i class="material-icons material-icons-active tooltipped" data-tooltip="Recent grants">monetization_on</i>
                    {:else}
                      <i class="material-icons tooltipped" data-tooltip="No recent grants">monetization_on</i>
                    {/if}
                  </li>
                  <li>
                    {#if page.is_likely_staffed}
                      <i class="material-icons material-icons-active tooltipped" data-tooltip="Likely staffed">account_circle</i>
                    {:else}
                      <i class="material-icons tooltipped" data-tooltip="Limited staffing">account_circle</i>
                    {/if}
                  </li>
                  {#if page.website && page.website_is_an_email != true}
                    <li>
                      <a
                        href={page.website}
                        data-ga="Website Summary Icon"
                        class="js-ga-website-click tooltipped"
                        data-tooltip="Click to visit website"><i class="material-icons material-icons-active">public</i></a
                      >
                    </li>
                  {:else if page.website && page.website_is_an_email == true && page.grants_to_preselected_only != true}
                    <li>
                      <a
                        data-sveltekit-reload
                        href={page.website}
                        data-ga="Website Summary Icon"
                        class="js-ga-website-click tooltipped"
                        data-tooltip="The latest e-filed Form 990PF lists<br>an email in the website field"
                        ><i class="material-icons material-icons-active">public</i></a
                      >
                    </li>
                  {:else}
                    <li>
                      <i class="material-icons tooltipped" data-tooltip="No website available">public</i>
                    </li>
                  {/if}
                  <li>
                    {#if page.grants_to_preselected_only}
                      <a
                        href="#application-info"
                        data-ga="Application Summary Icon"
                        class="js-ga-summary-icon-click tooltipped"
                        data-tooltip="Grants to preselected organizations only"><i class="material-icons">lock</i></a
                      >
                    {:else}
                      <a
                        href="#application-info"
                        data-ga="Application Summary Icon"
                        class="js-ga-summary-icon-click tooltipped"
                        data-tooltip="Possibly accepts unsolicited applications"
                        ><i class="material-icons material-icons-active">lock_open</i></a
                      >
                    {/if}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col s12 l4">
            <div id="summary">
              <div class="card-panel">
                <div class="card-panel-header">
                  <h4>Summary</h4>
                </div>
                <div class="card-panel-body">
                  <div class="row row-tight">
                    <div class="col s12 center-align">
                      <p>Assets</p>
                      <h4 title={humanizeCurrency(page.assets)}>{humanizeCurrency(page.assets)}</h4>
                    </div>
                  </div>
                  <hr />
                  <div class="row row-tight">
                    <div class="col s12">
                      <div class="justify-align">
                        <div class="center-align">
                          <p>Distributions</p>
                          <h5 title={formatToCurrency(page.distributions)}>{humanizeCurrency(page.distributions)}</h5>
                        </div>
                        <div class="center-align">
                          <p>Contributions</p>
                          <h5 title={formatToCurrency(page.contributions)}>{humanizeCurrency(page.contributions)}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {#if page.grant_count > 0}
                <div class="card-panel">
                  <div class="card-panel-body">
                    <div class="row row-tight valign-wrapper">
                      <div class="col s12">
                        <div class="justify-align">
                          <div class="center-align">
                            <p>Grant Median</p>
                            <h5 title={formatToCurrency(page.grant_median)}>{humanizeCurrency(page.grant_median)}</h5>
                          </div>
                          <div
                            class="center-align tooltipped"
                            data-html="true"
                            data-tooltip="Number of grants listed<br>in its latest electronic tax filing"
                            data-position="top"
                          >
                            <p>Count</p>
                            <h5 title={formatNumber(page.grant_count)}>{humanizeNumber(page.grant_count)}</h5>
                          </div>
                          <div class="center-align">
                            <p>Grant Max</p>
                            <h5 title={humanizeCurrency(page.grant_max)}>{humanizeCurrency(page.grant_max)}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}

              <div class="card-panel">
                <div class={cardPanelClasses}>
                  <div class="row row-tight valign-wrapper">
                    <div class="col s2 valign-wrapper">
                      <img src={irsLogo} alt="IRS logo" class="irs-logo" />
                    </div>
                    <div class="col s5">
                      <p>Latest Tax e-Filing</p>
                      <p class="summary">{taxYear}</p>
                    </div>
                    <div class="col s5">
                      <p>Published by IRS</p>
                      <p class="summary">{formatDateToMonthYear(page.last_updated_irs) ?? 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col s12 l7 offset-l1">
            <div id="people" class="scrollspy">
              <div class="card card-panel">
                <div class="card-panel-header">
                  <h4>
                    People <button
                      class="tooltipped right valign-wrapper"
                      data-position="left"
                      data-html="true"
                      data-tooltip="Form 990 PF<br>Part VIII"><img src={irsLogoAlt} alt="IRS logo" class="icon-irs-alt" /></button
                    >
                  </h4>
                </div>
                <div class="card-content card-panel-body">
                  <div class="responsive-table-wrapper">
                    <table class="bordered">
                      <thead>
                        <tr>
                          <th class="text-center">#</th>
                          <th>Name</th>
                          <th>Title</th>
                          <th class="right-align text-nowrap">Hours / Wk</th>
                          <th class="right-align">Comp ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each page.people as each, i}
                          <tr>
                            <td class="text-center">{i + 1}</td>
                            <td>{each.name}</td>
                            <td>{each.title}</td>
                            <td class="right-align">{each.hours}</td>
                            <td class="right-align">{humanizeCurrency(each.compensation)}</td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div id="insights-alert"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="row hide-on-small-only">
          <div class="col s12">
            <div id="tagline">
              <h6 class="valign-wrapper valign-wrapper-center-align">
                <img src={legacyLogo} alt="Grantmakers.io logo" class="icon-logo-small" />
                Grantmakers.io is an open source project for my friends in the nonprofit community
              </h6>
            </div>
          </div>
        </div>
        <div class="row hide-on-small-only">
          <div class="col s12">
            <div id="activities">
              <div class="card card-panel">
                <div class="card-panel-header">
                  <h4>
                    Charitable Activities <button
                      class="tooltipped right valign-wrapper"
                      data-position="left"
                      data-html="true"
                      data-tooltip="Summary of Direct Charitable Activities<br>Form 990 PF<br>Part IX-A"
                      ><img src={irsLogoAlt} alt="IRS logo" class="icon-irs-alt" /></button
                    >
                  </h4>
                </div>
                <div class="card-content card-panel-body">
                  <div class="row row-tight">
                    <div class="col s12">
                      {#if page.has_charitable_activities === true}
                        {@const sorted_activities = [...page.charitable_activities].sort((a, b) => (b.expenses ?? 0) - (a.expenses ?? 0))}

                        <ul class="collection">
                          {#each sorted_activities as activity}
                            <li class="collection-item">
                              <span class="new badge blue-grey" data-badge-caption="">
                                ${activity.expenses?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? 'N/A'}
                              </span>
                              <div class="collection-item-content">
                                {activity.description}
                              </div>
                            </li>
                          {/each}
                        </ul>
                      {:else}
                        No Charitable Activities listed on Form 990 PF Part IX-A
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="grants-scroll-anchor" class="row">
          <div class="col s12">
            <div id="grants" class="scrollspy">
              {#if page.enable_algolia_search}
                <div class="center-align valign-wrapper justify-center">
                  <i class="material-icons yellow-text text-darken-3">error</i> Searchable grants are currently 2-3 tax years behind. Grant updates
                  coming soon.
                </div>
              {/if}

              <div class="card-panel">
                <div class="card-panel-header-wrapper">
                  <div class="card-panel-header">
                    <div class="row valign-wrapper">
                      <div class="col s3">
                        <h4>
                          Grants{#if algolia()}
                            <!-- <span class="algolia-logo right hide-on-med-and-up print-hidden text-muted"
                              >Search powered by<br /><a href={site.algolia_referral_link} class="algolia-light-bg"
                                ><img src={algoliaLightBg} alt="Powered by Algolia" /></a
                              ></span> -->
                            <a href={'#'} data-target="algolia-mobile" class="sidenav-trigger right hide"
                              ><i class="material-icons text-muted">filter_list</i></a
                            >{/if}
                        </h4>
                      </div>
                      <div class="col s9 m6 print-hidden">
                        {#if algolia()}
                          <div class="search js-ie-check">
                            <div class="input-field text-muted">
                              <div id="ais-widget-search-box"></div>
                            </div>
                          </div>
                        {/if}
                      </div>
                      <div class="col m3 right-align print-hidden">
                        {#if algolia()}
                          <div class="right-align algolia-logo hide-on-small-only text-muted">
                            <div id="powered-by" class="right print-hidden valign-wrapper"></div>
                            <!-- Search powered by<br /><a class="algolia-light-bg" href={site.algolia_referral_link}
                              ><img src={algoliaLightBg} alt="Powered by Algolia" /></a
                            > -->
                          </div>
                        {:else}
                          <h4 class="right hide-on-small-only">
                            <button class="tooltipped valign-wrapper" data-tooltip="Grants made in {taxYear} tax year"
                              ><img src={irsLogoAlt} alt="IRS logo" class="icon-irs-alt" /></button
                            >
                          </h4>
                        {/if}
                      </div>
                    </div>
                  </div>
                </div>
                {#if algolia()}
                  <div class="section section-results js-ie-check">
                    <div id="rate-limit-message" class="hidden">
                      <div class="row">
                        <div class="col s12">
                          <div class="card">
                            <div class="card-content">
                              <h5>You have reached the hourly search limit</h5>
                              <p>
                                We place limits on the number of searches to allow the maximum number of people access to this free service.
                                You and/or your colleagues have reached this limit. Please try again in one hour. If you feel this was in
                                error, please <a href="mailto:opensource@grantmakers.io">get in touch</a>.
                              </p>
                            </div>
                            <div class="card-action">
                              <p>
                                If you are trying to capture data using automated means, the data is freely available on <a
                                  href="https://github.com/grantmakers/grantmakers.github.io/">Github</a
                                >
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="forbidden-message" class="hidden">
                      <div class="row">
                        <div class="col s12">
                          <div class="card">
                            <div class="card-content">
                              <span class="card-title"
                                ><strong>Check your url</strong> <br />Search results are only available at
                                <a data-sveltekit-reload href="/">Grantmakers.io</a></span
                              >
                              <p>
                                We limit search results to Grantmakers.io to allow the maximum number of people access to this free service.
                                The page you landed on is not Grantmakers.io.
                              </p>
                            </div>
                            <div class="card-action">
                              <p><a class="btn-flat blue-grey white-text" href="https://www.grantmakers.io/">Go to Grantmakers</a></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="algolia-hits-wrapper" class="row">
                      <div class="col s12 l3">
                        <!-- Filters / Refinements header -->
                        <div class="ais-root ais-stats">
                          <div class="ais-body ais-stats--body">
                            <div class="hide-on-med-and-down text-muted">Filters</div>
                            <div class="hide-on-large-only center-align">
                              <ul class="actions">
                                <li>
                                  <span id="ais-widget-mobile-clear-all"></span>
                                  <a
                                    href={'#'}
                                    data-target="refinements-slide-out"
                                    class="sidenav-trigger show-on-med-and-down waves-effect waves-light button-collapse btn white grey-text text-darken-3"
                                    ><i class="material-icons right">filter_list</i> Filter</a
                                  >
                                </li>
                                <li></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div class="divider hide-on-med-and-down"></div>
                        <div class="section section-refinements hide-on-med-and-down">
                          <div id="ais-widget-refinements" class="row">
                            <!-- Add row class to remove added white space / padding -->
                            <div class="col s12">
                              <div id="ais-widget-refinement-list--seo-placeholder">
                                <div class="ais-Panel card">
                                  <div class="ais-Panel-header card-header grey lighten-4"><span>Tax Year</span></div>
                                  <div class="ais-Panel-body card-content">
                                    <div>
                                      <div class="ais-RefinementList">
                                        <ul class="ais-RefinementList-list">
                                          {#each page.grants_facets as each}
                                            {#if each.grant_count > 0}
                                              <li class="ais-RefinementList-item">
                                                <div>
                                                  <label class="ais-RefinementList-label">
                                                    <input
                                                      type="checkbox"
                                                      class="ais-RefinementList-checkbox filled-in"
                                                      value={each.tax_year}
                                                    />
                                                    <span class="ais-RefinementList-labelText small">{each.tax_year}</span>
                                                    <span class="ais-RefinementList-count right small">{each.grant_count}</span>
                                                  </label>
                                                </div>
                                              </li>
                                            {/if}
                                          {/each}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div id="ais-widget-refinement-list--seo-placeholder"></div>
                              <div id="ais-widget-range-slider"></div>
                              <div id="ais-widget-refinement-list--grantee_state"></div>
                              <div id="ais-widget-refinement-list--grantee_city"></div>
                              <div id="ais-widget-refinement-list--grantee_name" class:hidden={simplify}></div>
                              <div id="ais-widget-refinement-list--grant_purpose"></div>
                            </div>
                            <div class="col s12 print-hidden">
                              <div class="section section-clear-all">
                                <div id="ais-widget-clear-all" class="center-align"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col s12 l9">
                        <div class="col s12 m9 l9">
                          <div id="ais-widget-stats">
                            <div class="ais-Stats">
                              <span class="ais-Stats-text hide-on-med-and-down text-muted">{page.grant_count_all_years} results</span>
                            </div>
                          </div>
                        </div>
                        <div id="ais-widget-sort-by" class="col s12 m3 l3 right-align hidden">
                          <a href={'#'} class="dropdown-trigger hide-on-med-and-down text-muted" data-target="tax-year-dropdown">
                            {#if enable_tax_year_dropdown}
                              Tax Years<i class="material-icons right">arrow_drop_down</i>
                            {:else}
                              Tax Year: {taxYear}
                            {/if}
                          </a>
                          <div id="ais-widget-refinement-list--tax_year"></div>
                        </div>
                        <div class="col s12 divider"></div>
                        <div class="row">
                          <div class="col s12">
                            <!-- Add row class to remove added white space / padding -->
                            <div class="section">
                              <div id="ais-widget-current-refined-values"></div>
                              <div>
                                <!-- Add card class for alt view -->
                                <div class="card-content">
                                  <div class="responsive-table-wrapper">
                                    <div id="ais-widget-hits">
                                      <div id="grantsPlaceholderTableWrapper" class="seo-placeholder-table card-panel-body">
                                        <div class="responsive-table-wrapper">
                                          <table id="grantsPlaceholderTable" class="striped bordered">
                                            <thead>
                                              <tr>
                                                <th class="right-align text-nowrap" data-sort="int"><span>Amount ($)</span></th>
                                                <th data-sort="string"><span>Name</span></th>
                                                <th data-sort="string"><span>Purpose</span></th>
                                                <th data-sort="string"><span>Location</span></th>
                                                <th data-sort="int" class="text-center"><span>Year</span></th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {#if page.grants_current_year_top_20 && page.grants_current_year_top_20.length > 0}
                                                {#each page.grants_current_year_top_20.slice(0, 20) as each}
                                                  <tr>
                                                    <td class="right-align" data-sort-value={each.amount}
                                                      >{humanizeCurrency(each.amount)}</td
                                                    >
                                                    <td>{each.name}</td>
                                                    <td>{each.purpose}</td>
                                                    {#if each.is_foreign == true}
                                                      <td class="text-nowrap"
                                                        >{#if each.city != null}{each.city}, {each.country}*{/if}</td
                                                      >
                                                    {:else}
                                                      <td class="text-nowrap"
                                                        >{#if each.city != null}{each.city}, {each.state}{/if}</td
                                                      >
                                                    {/if}
                                                    <td class="left-align">{page.filings[0].tax_year}</td>
                                                  </tr>
                                                {/each}
                                              {:else}
                                                <tr>
                                                  <td></td>
                                                  <td>No Grants Listed</td>
                                                  <td></td>
                                                  <td></td>
                                                  <td></td>
                                                </tr>
                                              {/if}
                                            </tbody>
                                            {#if hasForeignGrantRecipients()}
                                              <tfoot>
                                                <tr>
                                                  <td colspan="5" class="small text-muted">(*) Denotes foreign country</td>
                                                  <!--TODO Add country list modal-->
                                                </tr>
                                              </tfoot>
                                            {/if}
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {#if page.grants_reference_attachment}
                                    <div class="row">
                                      <div class="col l8 offset-l2">
                                        <div class="card info-card grey lighten-4">
                                          <div class="card-content">
                                            <p>
                                              <i class="material-icons">warning</i> The IRS does not currently provide attachments in the electronic
                                              dataset from which this site is based. However, occasionally these attachments can be found in
                                              the PDF version of the filing which you can find below.
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  {/if}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col s12 l9 offset-l3">
                        <div class="section center-align {simplify ? 'hidden' : ''}">
                          <div id="ais-widget-pagination"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                {:else}
                  <div class="section section-results">
                    <div class="row">
                      <div class="col s12">
                        <div id="grantsTableWrapper" class="card-panel-body">
                          <div class="responsive-table-wrapper">
                            {#if page.grant_count > 1000}
                              <div class="row">
                                <div class="col s12">
                                  <div class="card blue-grey lighten-2">
                                    <div class="card-content white-text">
                                      <i class="material-icons">warning</i> You may experience a delay when sorting. This foundation has a large
                                      number of grants.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            {/if}
                            <div class="row">
                              <div class="col s12 text-light">
                                Tax Year {page.filings[0].tax_year}
                              </div>
                            </div>
                            <table id="grantsTable" class="striped bordered">
                              <thead>
                                <tr>
                                  <th data-sort="int" class="text-center"><span>#</span></th>
                                  <th data-sort="string"><span>Name</span></th>
                                  <th data-sort="string"><span>Purpose</span></th>
                                  <th data-sort="string"><span>Location</span></th>
                                  <th class="right-align text-nowrap" data-sort="int"><span>Amount ($)</span></th>
                                </tr>
                              </thead>
                              <tbody id="grantsTableBody">
                                {#if staticGrants && staticGrants.length > 0}
                                  {#each staticGrants.slice(0, 50) as each, i}
                                    <tr>
                                      <td class="left-align">{i + 1}</td>
                                      <td>{each.name}</td>
                                      <td>{each.purpose}</td>
                                      {#if each.is_foreign == true}
                                        <td class="text-nowrap"
                                          >{#if each.city != null}{each.city}, {each.country}*{/if}</td
                                        >
                                      {:else}
                                        <td class="text-nowrap"
                                          >{#if each.city != null}{each.city}, {each.state}{/if}</td
                                        >
                                      {/if}
                                      <td class="right-align" data-sort-value={each.amount}>{humanizeCurrency(each.amount)}</td>
                                    </tr>
                                  {/each}
                                {:else}
                                  <tr>
                                    <td></td>
                                    <td>No Grants Listed</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                {/if}
                              </tbody>
                              {#if hasForeignGrantRecipients()}
                                <tfoot>
                                  <tr>
                                    <td colspan="5" class="small text-muted">(*) Denotes foreign country</td>
                                    <!--TODO Add country list modal-->
                                  </tr>
                                </tfoot>
                              {/if}
                            </table>
                          </div>
                          {#if page.grant_count > 50}
                            <div class="row">
                              <div class="col s12">
                                <div class="card">
                                  <div class="card-content grey lighten-4 text-light">
                                    Note: The IRS dataset contains additional grants for this funder's {page.filings[0].tax_year} tax year ({page.grant_count}
                                    total grants)
                                  </div>
                                </div>
                              </div>
                            </div>
                          {/if}
                        </div>

                        {#if page.grants_reference_attachment}
                          <div class="row">
                            <div class="col l8 offset-l2">
                              <div class="card info-card grey lighten-4">
                                <div class="card-content">
                                  <p>
                                    <i class="material-icons">warning</i> The IRS does not currently provide attachments in the electronic dataset
                                    from which this site is based. However, occasionally these attachments can be found in the PDF version of
                                    the filing which you can find below.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        {/if}
                      </div>
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
        <div class="row print-hidden hide-on-small-only">
          <div class="col s12">
            <div id="information-source">
              <h6 class="valign-wrapper valign-wrapper-center-align">Information pulled directly from IRS Form 990 PF</h6>
            </div>
          </div>
        </div>
        <div class="row print-no-pagebreak flex">
          <div class="col s12 l6 flex-direction-column print-50 flex">
            <div id="application-info" class="flex-grow-1 scrollspy flex">
              <div class="card-panel card-panel-flex">
                <div class="card-panel-header-wrapper">
                  <div class="card-panel-header">
                    <div class="row">
                      <div class="col s12">
                        <h4>
                          Application Guidelines <button
                            class="tooltipped right valign-wrapper"
                            data-position="left"
                            data-html="true"
                            data-tooltip="Form 990 PF<br>Part XV<br>Line 2"
                            ><img src={irsLogoAlt} alt="IRS logo" class="icon-irs-alt" /></button
                          >
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-panel-body">
                  {#if page.website && page.website_is_an_email != true}
                    <ul class="collection">
                      <li class="collection-item avatar">
                        <a data-sveltekit-reload href={page.website} data-ga="Refer to Fdn Website"
                          ><i class="material-icons circle blue">public</i></a
                        >
                        <p>
                          Note: This foundation appears to have a website. We recommend starting your exploration there.
                          <a class="btn-link" href={page.website} data-ga="Refer to Fdn Website">Visit Website</a>.
                        </p>
                      </li>
                    </ul>
                    <hr class="divider" />
                  {:else if page.website && page.website_is_an_email == true && page.grants_to_preselected_only != true}
                    <ul class="collection">
                      <li class="collection-item avatar">
                        <a data-sveltekit-reload href={page.website} data-ga="Refer to Fdn Website"
                          ><i class="material-icons circle blue">public</i></a
                        >
                        <p>
                          Note: In lieu of providing a website in its latest e-filed Form 990PF, this foundation likely provided a contact
                          email instead. <a class="btn-link" href={page.website} data-ga="Refer to Fdn Website">View Email</a>.
                        </p>
                      </li>
                    </ul>
                    <hr class="divider" />
                  {/if}

                  {#if !(page.grants_to_preselected_only || page.grants_application_info)}
                    The foundation does not provide any guidance in its latest Form 990 PF Part XV, Lines 2-2d
                  {/if}

                  {#if page.grants_to_preselected_only}
                    <ul class="collection">
                      <li class="collection-item avatar">
                        <i class="material-icons circle red darken-2">lock</i>
                        <p>
                          The foundation has indicated it only makes contributions to preselected charitable organizations and does not
                          accept unsolicited requests for funds.
                        </p>
                      </li>
                    </ul>
                    {#if page.grants_application_info}
                      <hr class="divider" />
                    {/if}
                  {/if}

                  {#if page.grants_application_info}
                    <ul class="collection">
                      <li class="collection-item avatar">
                        <i
                          class="material-icons circle grey tooltipped"
                          data-position="right"
                          data-html="true"
                          data-tooltip="The form in which applications<br>should be submitted and information<br>and materials they should include<br>Line 2b"
                          >assignment</i
                        >
                        <span class="title">Instructions</span>
                        <p>{page.grants_application_info}</p>
                      </li>

                      <li class="collection-item avatar">
                        <i
                          class="material-icons circle grey tooltipped"
                          data-position="right"
                          data-html="true"
                          data-tooltip="Any submission deadlines<br>Line 2c">history</i
                        >
                        <span class="title">Deadlines</span>
                        <p>{page.grants_application_deadlines}</p>
                      </li>

                      <li class="collection-item avatar">
                        <i
                          class="material-icons circle grey tooltipped"
                          data-position="right"
                          data-html="true"
                          data-tooltip="Any restrictions or limitations on awards,<br>such as by geographical areas, charitable fields,<br>kinds of institutions, or other factors<br>Line 2d"
                          >assignment_late</i
                        >
                        <span class="title">Restrictions</span>
                        <p>{page.grants_application_restrictions}</p>
                      </li>

                      <li>
                        <hr class="divider" />
                      </li>
                      <!--sse-->
                      <li class="collection-item avatar">
                        <i
                          class="material-icons circle grey tooltipped"
                          data-position="right"
                          data-html="true"
                          data-tooltip="The name, address, and telephone number<br>or e-mail address of the person to<br>whom applications should be addressed<br>Line 2a"
                          >contact_phone</i
                        >
                        <span class="title">Contact</span>
                        {#if page.grants_application_contact}
                          <p>{page.grants_application_contact.name}</p>
                          {#if page.grants_application_contact.email?.includes('@')}
                            <p>
                              <a
                                href="mailto:{page.grants_application_contact.email.toLowerCase()}"
                                class="blue-grey-text"
                                data-ga="Refer to Fdn Email">{page.grants_application_contact.email.toLowerCase()}</a
                              >
                            </p>
                          {:else}
                            <p class="blue-grey-text">{page.grants_application_contact.email}</p>
                          {/if}
                          <p>{page.grants_application_contact.address.street}</p>
                          <p>{page.grants_application_contact.address.street2}</p>
                          <p>
                            {page.grants_application_contact.address.city}, {page.grants_application_contact.address.state}
                            {page.grants_application_contact.address.country}
                            {page.grants_application_contact.address.zip}
                          </p>
                          {#if page.grants_application_contact.phone}
                            {@const ph = page.grants_application_contact.phone}

                            {#if page.grants_application_contact.is_foreign == true}
                              <p>tel: {ph}</p>
                            {:else}
                              <p>({ph.slice(0, 3)}) {ph.slice(3, 6)}-{ph.slice(6, 10)}</p>
                            {/if}
                          {/if}
                        {:else}
                          <p>
                            This foundation's latest IRS Form 990 PF does not list contact information specific to their grant application
                            process.
                          </p>
                          <p>
                            Tip: General contact information can often be found elsewhere in the funders most recent Form 990 PF (see PDF
                            links below).
                          </p>
                        {/if}
                      </li>
                      <!--/sse-->
                    </ul>
                  {/if}
                </div>
              </div>
            </div>
          </div>
          <div class="col s12 l6 flex-direction-column print-50 flex">
            <div id="about" class="flex-grow-1 scrollspy flex">
              <div class="card-panel card-panel-flex">
                <div class="card-panel-header">
                  <h4>
                    About Grantmakers.io <span class="right valign-wrapper"
                      ><img src={legacyLogo} alt="Grantmakers.io logo" class="icon-logo-small" /></span
                    >
                  </h4>
                </div>
                <div class="card-panel-body">
                  <!-- Ensure has no set height -->
                  <ul class="collection">
                    <li class="collection-item collection-item-empty-state avatar">
                      <p>
                        Grantmakers.io is a free community project aimed at giving nonprofits unfettered access to a public dataset of Form
                        990 tax filings published by the IRS. Read more <a data-sveltekit-reload href="/about/">about the project</a>.
                      </p>
                      <p>
                        The project republishes the IRS dataset, verbatim, focusing exclusively on Form 990 PF, the form most commonly filed
                        by private foundations.
                      </p>
                      <p>
                        Note that the IRS dataset only contains information from <em>electronically-filed</em> tax returns. Read more
                        <a data-sveltekit-reload href="/about/the-dataset/">about the dataset</a>.
                      </p>
                      <div class="card info-card grey lighten-3">
                        <div class="card-content">
                          Grantmakers.io is not affiliated, associated, authorized, endorsed by, or in any way officially connected with any
                          foundation appearing on the site.
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="financials" class="row hide-on-med-and-down scrollspy flex">
          <div class="col s12 l6 flex-direction-column print-50 flex">
            <div id="financial-overview" class="flex-grow-1 flex">
              <div class="card card-panel card-panel-flex">
                <div class="card-panel-header">
                  <h4>
                    Financial Overview <button
                      class="tooltipped right valign-wrapper"
                      data-position="left"
                      data-html="true"
                      data-tooltip="Assets - Box I<br>Contributions - Part I Line 1<br>Distributions - Part XII Qualifying Distributions"
                      ><img src={irsLogoAlt} alt="IRS logo" class="icon-irs-alt" /></button
                    >
                  </h4>
                </div>
                <div class="card-content card-panel-body">
                  <div class="row row-tight">
                    <div class="col s12">
                      <div class="row row-tight valign-wrapper">
                        <div class="col s12">
                          <div class="justify-align">
                            <div class="center-align">
                              <p>Assets <i class="material-icons material-icons-tight left blue-grey-text">label</i></p>
                              <h5 title={humanizeCurrency(page.assets)}>{humanizeCurrency(page.assets)}</h5>
                            </div>
                            <div class="center-align">
                              <p>Distributions <i class="material-icons material-icons-tight left grantmakers-text">label</i></p>
                              <h5 title={humanizeCurrency(page.distributions)}>{humanizeCurrency(page.distributions)}</h5>
                            </div>
                            <div class="center-align">
                              <p>Contributions <i class="material-icons material-icons-tight left teal-text">label</i></p>
                              <h5 title={humanizeCurrency(page.contributions)}>{humanizeCurrency(page.contributions)}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div class="chart-wrapper default">
                        <div class="chart-default">
                          <div class="row row-tight">
                            <div class="col s12">
                              <div class="card white z-depth-4">
                                <div class="card-content">Charts will appear if your browser supports them.</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="chart-loader center-align">
                          <h4 class="preloader-text">Loading...</h4>
                          <div class="preloader-wrapper big active">
                            <div class="spinner-layer">
                              <div class="circle-clipper left">
                                <div class="circle"></div>
                              </div>
                              <div class="gap-patch">
                                <div class="circle"></div>
                              </div>
                              <div class="circle-clipper right">
                                <div class="circle"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <canvas id="chart-overview" width="500" height="300"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col s12 l6 flex-direction-column print-50 flex">
            <div id="financial-trends" class="flex-grow-1 flex">
              <div class="card card-panel card-panel-flex">
                <div class="card-panel-header">
                  <h4>
                    Financial Trends <button
                      class="tooltipped right valign-wrapper"
                      data-position="left"
                      data-html="true"
                      data-tooltip="Assets - Box I<br>Contributions - Part I Line 1<br>Distributions - Part XII Qualifying Distributions"
                      ><img src={irsLogoAlt} alt="IRS logo" class="icon-irs-alt" /></button
                    >
                  </h4>
                </div>
                <div class="card-content card-panel-body">
                  <div class="row row-tight">
                    <div class="col s12">
                      <div class="row row-tight valign-wrapper">
                        <div class="col s12">
                          <div class="justify-align">
                            <div class="center-align">
                              <p>
                                Tax e-Filings Available <i
                                  class="material-icons material-icons-rotate-180 text-muted-max tooltipped"
                                  data-tooltip="Electronically filed tax returns only">error_outline</i
                                >
                              </p>
                              <h5 title="Electronically filed tax returns">{page.filings.length}</h5>
                            </div>
                            <div class="center-align">
                              <p>Last Updated by IRS</p>
                              <h5 title={humanizeCurrency(page.distributions)}>{formatDateToMonthYear(page.last_updated_irs) ?? 'N/A'}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div class="chart-wrapper default">
                        <div class="chart-default">
                          <div class="card white z-depth-4">
                            <div class="card-content">
                              {#if page.financial_stats.length > 1}
                                Charts will appear if your browser supports them
                              {:else}
                                <div class="row row-tight valign-wrapper">
                                  <div class="col s2">
                                    <i class="material-icons material-icons-square blue-grey white-text">timeline</i>
                                  </div>
                                  <div class="col s10">Trends will appear as more e-filings become available</div>
                                </div>
                              {/if}
                            </div>
                          </div>
                        </div>
                        <div class="chart-loader center-align">
                          <h4 class="preloader-text">Loading...</h4>
                          <div class="preloader-wrapper big active">
                            <div class="spinner-layer">
                              <div class="circle-clipper left">
                                <div class="circle"></div>
                              </div>
                              <div class="gap-patch">
                                <div class="circle"></div>
                              </div>
                              <div class="circle-clipper right">
                                <div class="circle"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <canvas id="chart-trends" width="500" height="300"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row print-hidden js-enable-donorbox-popup">
          <div class="col s12">
            <div id="coffee-bottom-cta" class="center-align">
              <h5>If this free profile helped you, why not</h5>
              <a href="/buy-chad-a-coffee/" class="waves-effect waves-light btn white grey-text text-darken-1" data-ga="Buy Me a Coffee CTA"
                ><i class="material-icons left">emoji_food_beverage</i> Buy me a coffee</a
              >
            </div>
          </div>
        </div>
        <div class="row print-hidden">
          <div class="col s12">
            <div id="filings">
              <div class="card-panel">
                <div class="card-panel-header">
                  <h4>
                    Tax <a href={'#'} class="text-default">Filings</a>
                    <a
                      class="right valign-wrapper"
                      style="height: 27px"
                      href="https://projects.propublica.org/nonprofits/organizations/{page.ein}"
                      target="_blank"
                      title="Tax filings courtesy of our friends at ProPublica"
                      data-position="left"
                      data-html="true"
                      data-tooltip="Courtesy of<br>ProPublica"><img src={proPublicaLogo} alt="ProPublica logo" class="icon-propublica" /></a
                    >
                  </h4>
                </div>
                <div class="card-panel-body">
                  <ul class="list-inline">
                    <li id="js-pdfs" data-ein={page.ein} class="hide-on-med-and-down">
                      <i class="material-icons">picture_as_pdf</i> <span class="show-on-medium-and-down text-muted">PDF</span>
                    </li>
                    {#each page.filings.slice(0, 7) as filing}
                      {#if filing.object_id_irs}
                        <li>
                          <a
                            class="waves-effect waves-light btn grey lighten-3 grey-text text-darken-1"
                            style="text-transform:none"
                            href="https://projects.propublica.org/nonprofits/organizations/{page.ein}/{filing.object_id_irs}/full"
                            target="_blank"
                            rel="noopener"
                            data-ga="PDF View Latest"
                            data-ein={page.ein}
                            title="View latest filing">{filing.tax_year}</a
                          >
                        </li>
                      {/if}
                    {/each}
                    <li style="margin-top:12px">
                      <a
                        class="waves-effect waves-light btn-flat blue-grey-text"
                        style="text-transform:none"
                        href="https://projects.propublica.org/nonprofits/organizations/{page.ein}"
                        target="_blank"
                        rel="noopener"
                        data-ga="PDF View All"
                        data-ein={page.ein}
                        title="View all available tax filings">View more at ProPublica</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row print-hidden hide-on-small-only">
          <div class="col s12">
            <div id="information-source" class="center">
              <h6 class="valign-wrapper valign-wrapper-center-align">
                <strong>Reminder</strong>
              </h6>
              <p>Grantmakers.io is an automated, verbatim reproduction of a public IRS dataset.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="profile-content section-refinements">
  <!-- Filters / Refinements -->
  <div class="row">
    <div class="col s12">
      <ul id="refinements-slide-out" class="sidenav left-align grey lighten-5">
        <li><div class="card"><div id="ais-widget-mobile-refinement-list--grantee_state"></div></div></li>
        <li><div class="card"><div id="ais-widget-mobile-refinement-list--grantee_city"></div></div></li>
        <li><div class="card"><div id="ais-widget-mobile-refinement-list--grantee_name"></div></div></li>
        <li><div class="card"><div id="ais-widget-mobile-refinement-list--tax_year"></div></div></li>
        <li><div class="card"><div id="ais-widget-mobile-refinement-list--grant_purpose"></div></div></li>
      </ul>
    </div>
  </div>
</div>

<style>
  /* Dropdown width */
  .dropdown-content-profile {
    min-width: 170px;
  }

  /* Recreate profile avatar in pure css */
  .profile-avatar {
    display: flex;
    justify-content: center;
  }

  .avatar-container {
    margin: -50px auto 0;
    max-height: 160px;
    max-width: 160px;
  }

  .avatar-letter {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
    background-color: #f97316;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    font-weight: 100;
    color: white;
  }

  @media (min-width: 768px) {
    .avatar-container {
      margin: -100px auto 0;
    }
    .avatar-letter {
      width: 148px;
      height: 148px;
      font-size: 4.25rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
  /* Grants alert */
  #grants .valign-wrapper {
    line-height: 24px;
  }
  #grants .valign-wrapper i {
    margin-right: 3px;
  }
  /* Whitespace override */
  .profile-content #about .collection-item p {
    white-space: normal;
  }
  /* Flexbox helper */
  .valign-wrapper.justify-center {
    justify-content: center;
  }
</style>
