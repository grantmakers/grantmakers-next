<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import legacyLogo from '$lib/assets/legacy/images/logo.png';
  import irsLogo from '$lib/assets/legacy/images/irs-w-text.png';
  import irsLogoAlt from '$lib/assets/legacy/images/irs-w-text-alt.png';
  import proPublicaLogo from '$lib/assets/legacy/images/propublica.png';

  import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
  import { formatNumber, formatToCurrency, humanizeCurrency, humanizeNumber } from '@repo/shared/functions/formatters/numbers';
  import { formatCompensation } from '$src/lib/utils/peopleComp';
  import { formatDateToMonthYear } from '@repo/shared/functions/formatters/dates';
  import { upperFirstLetter } from '@repo/shared/functions/formatters/names';
  import FinalReturn from './FinalReturn.svelte';
  import RateLimit from '../search/RateLimit.svelte';
  import OriginForbidden from '../search/OriginForbidden.svelte';

  interface Props {
    profile: GrantmakersExtractedDataObj;
  }

  let { profile }: Props = $props();

  let cssConfig = {
    mainBody: 'relative top-16 md:top-36 mx-0 mb-40 bg-slate-50 rounded-2xl shadow lg:top-0 lg:mx-6 lg:mb-4',
    topBar: 'bg-slate-200 text-zinc-700 rounded-t-2xl border-t border-gray-300/60 dark:border-white/15',
  };

  let hasInsights = false;
  let insight = undefined;

  // Mimic Jekyll
  const site = {
    baseurl: '/profiles',
    url: '', //'https://www.grantmakers.io',
    algolia_referral_link: 'https://www.algolia.com/?utm_source=grantmakersio&utm_medium=referral',
  };

  const firstLetter = $derived(upperFirstLetter(profile.organization_name));
  const colors = ['red', 'blue', 'green', 'purple', 'yellow', 'pink', 'indigo', 'orange', 'grey', 'cyan', 'lime'];

  const colorIndex = $derived(firstLetter.charCodeAt(0) % colors.length);
  const bgColor = $derived(colors[colorIndex]);

  const orgFinancialStats = $derived(profile.financial_stats);

  const displayedFilingIsAmendment = $derived(profile.filings.some((f) => f.filing_is_amendment));

  let algolia = $derived(profile.enable_algolia_search);

  let filingCount = $derived(profile.grants_facets.filter((filing) => filing.grant_count > 0).length);

  let simplify = $derived(profile.grant_count_last_three_years < 20 || (filingCount <= 1 && profile.grant_count <= 20));

  let enable_tax_year_dropdown = $derived(profile.filings[1] && profile.grants_facets[1].grant_count > 0);

  const taxPeriod = $derived(String(profile.filings[0].tax_period));
  const fiscalMonth = $derived(taxPeriod.slice(4, 6));
  const fiscalYear = $derived(taxPeriod.slice(0, 4));
  const taxYear = $derived(profile.filings[0].tax_year);

  const currentYear = $derived(new Date().getFullYear());
  const currentYearMinusOne = $derived(currentYear - 1);

  // Convert the IRS last updated date to a year number
  const lastUpdatedYear = $derived(new Date(profile.last_updated_irs).getFullYear());

  // Determine if we need the warning class
  const cardPanelClasses = $derived(`card-panel-body${lastUpdatedYear < currentYearMinusOne ? ' yellow lighten-4' : ''}`);

  // Handle static grants
  let staticGrants = $derived(profile.grants_last_three_years_top_20);
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

  let destroyProfile: () => void;
  let destroySearch: () => void;

  onMount(async () => {
    let M = await import('materialize-css');
    const { initProfileJs, destroyProfileJs } = await import('$lib/assets/legacy/js/profile');
    destroyProfile = destroyProfileJs;

    try {
      await initProfileJs(M, orgFinancialStats);
    } catch (error) {
      console.log(error);
    }
    if (algolia) {
      const { initSearchJs, destroySearchJs } = await import('$src/lib/assets/legacy/js/profile-embedded-search.svelte');
      destroySearch = destroySearchJs;

      try {
        initSearchJs(M);
      } catch (error) {
        console.log(error);
      }
    }
    try {
      const { initGaEvents } = await import('$src/lib/assets/legacy/js/ga-events');
      initGaEvents();
    } catch (error) {
      // Silently fail if an ad blocker prevents GA events definitions from loading - respecting user preferences
    }
  });
  onDestroy(() => {
    if (destroyProfile) {
      destroyProfile();
    }

    if (destroySearch) {
      destroySearch();
    }
  });
</script>

<div class="sm:dot-pattern min-h-full">
  <div id="mini-hero" class="flex min-h-24 items-center justify-center md:min-h-52">
    {#if profile.filing_is_final_return}
      <FinalReturn {taxYear} />
    {/if}
  </div>

  <div class="main main-raised {cssConfig.mainBody}">
    <div class="profile-content">
      <div class="row row-alert-fixed-to-top {cssConfig.topBar}">
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
                  data-ein={profile.ein}
                  data-name={profile.organization_name}
                  data-url="{site.baseurl}/{profile.ein}/"
                  data-tax-year={taxYear}
                  data-tax-year-only-one={!(profile.filings[1] && profile.grants_facets[1].grant_count > 0)}
                >
                  {#if profile.website}
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="external noopener"
                      class="js-ga-website-click disable-primary-color"
                      title="Click to visit website"
                      data-ga="Website H1 Click">{profile.organization_name}</a
                    >
                  {:else}
                    {profile.organization_name}
                  {/if}
                </h1>
                {#if profile.is_foreign}
                  <h6 class="org-location">
                    {profile.city}, {#if profile.state == 'Foreign'}{profile.country}*{:else}{profile.state}{/if}
                  </h6>
                {:else}
                  <h6 class="org-location">{profile.city}, {profile.state}</h6>
                {/if}
                <ul class="list-inline org-location profile-summary-icons text-center">
                  <li>
                    {#if profile.has_recent_grants}
                      <i class="material-icons material-icons-active tooltipped" data-tooltip="Recent grants">monetization_on</i>
                    {:else}
                      <i class="material-icons tooltipped" data-tooltip="No recent grants">monetization_on</i>
                    {/if}
                  </li>
                  <li>
                    {#if profile.is_likely_staffed}
                      <i class="material-icons material-icons-active tooltipped" data-tooltip="Likely staffed">account_circle</i>
                    {:else}
                      <i class="material-icons tooltipped" data-tooltip="Limited staffing">account_circle</i>
                    {/if}
                  </li>
                  {#if profile.website && profile.website_is_an_email != true}
                    <li>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="external noopener"
                        data-ga="Website Summary Icon"
                        class="js-ga-website-click tooltipped"
                        data-tooltip="Click to visit website"><i class="material-icons material-icons-active">public</i></a
                      >
                    </li>
                  {:else if profile.website && profile.website_is_an_email == true && profile.grants_to_preselected_only != true}
                    <li>
                      <a
                        href={profile.website}
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
                    {#if profile.grants_to_preselected_only}
                      <a
                        href="#guidelines"
                        data-ga="Application Summary Icon"
                        class="js-ga-summary-icon-click tooltipped"
                        data-tooltip="Grants to preselected organizations only"><i class="material-icons">lock</i></a
                      >
                    {:else}
                      <a
                        href="#guidelines"
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
        {#if hasInsights}
          <div class="row">
            <div class="col s12 l8 offset-l2">
              <div id="alerts">
                <div class="card-title left-align valign-wrapper">
                  <img src="/logo.svg" alt="Grantmakers.io logo" class="icon-logo-small" style="margin-right:4px" /><span
                    >Community Insights</span
                  >
                </div>
                <div class="card white left-align z-depth-0">
                  <div class="card-content info-card">
                    <div class="card-title"></div>
                    <ul class="collection">
                      {#if insight}
                        {insight}
                      {/if}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
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
                      <h4 title={humanizeCurrency(profile.assets)}>{humanizeCurrency(profile.assets)}</h4>
                    </div>
                  </div>
                  <hr />
                  <div class="row row-tight">
                    <div class="col s12">
                      <div class="justify-align">
                        <div class="center-align">
                          <p>Distributions</p>
                          <h5 title={formatToCurrency(profile.distributions)}>{humanizeCurrency(profile.distributions)}</h5>
                        </div>
                        <div class="center-align">
                          <p>Contributions</p>
                          <h5 title={formatToCurrency(profile.contributions)}>{humanizeCurrency(profile.contributions)}</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {#if profile.grant_count > 0}
                <div class="card-panel">
                  <div class="card-panel-body">
                    <div class="row row-tight valign-wrapper">
                      <div class="col s12">
                        <div class="justify-align">
                          <div class="center-align">
                            <p>Grant Median</p>
                            <h5 title={formatToCurrency(profile.grant_median)}>{humanizeCurrency(profile.grant_median)}</h5>
                          </div>
                          <div
                            class="center-align tooltipped"
                            data-html="true"
                            data-tooltip="Number of grants listed<br>in its latest electronic tax filing"
                            data-position="top"
                          >
                            <p>Count</p>
                            <h5 title={formatNumber(profile.grant_count)}>{humanizeNumber(profile.grant_count)}</h5>
                          </div>
                          <div class="center-align">
                            <p>Grant Max</p>
                            <h5 title={humanizeCurrency(profile.grant_max)}>{humanizeCurrency(profile.grant_max)}</h5>
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
                      <p class="summary">{formatDateToMonthYear(profile.last_updated_irs) ?? 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {#if profile.filing_is_final_return}
                <div class="card-panel">
                  <FinalReturn {taxYear} />
                </div>
              {/if}
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
                        {#each profile.people as each, i}
                          <tr>
                            <td class="text-center">{i + 1}</td>
                            <td>{each.name}</td>
                            <td>{each.title}</td>
                            <td class="right-align">{each.hours}</td>
                            <td class="right-align">{formatCompensation(each.compensation)}</td>
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
                      <div class="flow-root">
                        <div class="-my-2 overflow-x-auto sm:-mx-6">
                          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:mb-4 lg:px-8">
                            {#if profile.has_charitable_activities === true}
                              {@const sorted_activities = [...profile.charitable_activities].sort(
                                (a, b) => (b.expenses ?? 0) - (a.expenses ?? 0),
                              )}
                              <div class="rounded-lg bg-white p-6">
                                <table class="min-w-full table-fixed">
                                  <colgroup>
                                    <col style="width: 120px" />
                                    <col style="width: calc(100% - 120px)" />
                                  </colgroup>
                                  <thead class="border-b border-b-gray-300">
                                    <tr>
                                      <th scope="col" class="px-4! py-3.5 text-right! text-sm font-semibold text-gray-900">Expenses</th>
                                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody class="divide-y divide-gray-200 bg-white">
                                    {#each sorted_activities as activity}
                                      <tr class="relative even:bg-gray-50">
                                        <td class="px-4! py-4 text-right! lg:py-6" style="text-align: right !important;">
                                          {typeof activity?.expenses === 'number' ? formatToCurrency(activity.expenses) : 'N/A'}
                                        </td>
                                        <td class="px-3 py-4 lg:py-6">{activity?.description ? activity.description : 'N/A'}</td>
                                      </tr>
                                    {/each}
                                  </tbody>
                                  <tfoot class="border-t border-t-gray-300">
                                    <tr>
                                      <td class="px-4! py-4 text-right! font-semibold lg:py-6" style="text-align: right !important;">
                                        {formatToCurrency(sorted_activities.reduce((sum, activity) => sum + (activity.expenses ?? 0), 0))}
                                      </td>
                                      <td class="px-3 py-4 font-semibold lg:py-6"> Total Direct Charitable Activities </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            {:else}
                              <p class="!mt-6">No charitable activities listed</p>
                            {/if}
                          </div>
                        </div>
                      </div>
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
              <div class="card-panel">
                <div class="card-panel-header-wrapper">
                  <div class="card-panel-header">
                    <div class="row">
                      <div class="col s5 m3 valign-wrapper">
                        <h4>
                          Grants{#if algolia}
                            <a href={'#'} data-target="algolia-mobile" class="sidenav-trigger right hide"
                              ><i class="material-icons text-muted">filter_list</i></a
                            >{/if}
                        </h4>
                      </div>
                      <div class="col s7 m3 push-m6 valign-wrapper print-hidden flex-hack">
                        {#if algolia}
                          <div class="valign-wrapper algolia-logo text-muted">
                            <div id="powered-by" class="right print-hidden"></div>
                          </div>
                        {:else}
                          <h4 class="right hide-on-small-only">
                            <button class="tooltipped valign-wrapper" data-tooltip="Grants made in {taxYear} tax year"
                              ><img src={irsLogoAlt} alt="IRS logo" class="icon-irs-alt" /></button
                            >
                          </h4>
                        {/if}
                      </div>
                      <div class="col s12 m6 pull-m3 print-hidden">
                        {#if algolia}
                          <div class="search js-ie-check">
                            <div class="input-field text-muted">
                              <div id="ais-widget-search-box"></div>
                            </div>
                          </div>
                        {/if}
                      </div>
                    </div>
                  </div>
                </div>
                {#if algolia}
                  <div class="section section-results js-ie-check">
                    <div id="rate-limit-message" class="hidden">
                      <div class="row">
                        <div class="col s12">
                          <RateLimit />
                        </div>
                      </div>
                    </div>
                    <div id="forbidden-message" class="hidden">
                      <div class="row">
                        <div class="col s12">
                          <OriginForbidden />
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
                                    ><i class="material-icons right flex items-center">filter_list</i> Filter</a
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
                                          {#each profile.grants_facets.slice(0, 3) as each}
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
                              <span class="ais-Stats-text hide-on-med-and-down text-muted"
                                >{profile.grant_count_last_three_years} results</span
                              >
                            </div>
                          </div>
                        </div>
                        <div id="ais-widget-sort-by" class="col s12 m3 l3 right-align hidden">
                          <a
                            href={'#!'}
                            class="dropdown-trigger hide-on-med-and-down text-muted flex items-center justify-end"
                            data-target="tax-year-dropdown"
                          >
                            {#if enable_tax_year_dropdown}
                              Tax Years<i class="material-icons right flex items-center">arrow_drop_down</i>
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
                                                <th class="right-align text-nowrap" data-sort="int"><span>Amount</span></th>
                                                <th data-sort="string"><span>Name</span></th>
                                                <th data-sort="string"><span>Purpose</span></th>
                                                <th data-sort="string"><span>Location</span></th>
                                                <th data-sort="int" class="text-center"><span>Year</span></th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {#if staticGrants && staticGrants.length > 0}
                                                {#each staticGrants.slice(0, 20) as each}
                                                  <tr>
                                                    <td class="valign-top right-align" data-sort-value={each.amount}
                                                      >{formatToCurrency(each.amount)}</td
                                                    >
                                                    <td class="valign-top">{each.name}</td>
                                                    <td class="valign-top">{each.purpose}</td>
                                                    {#if each.is_foreign == true}
                                                      <td class="valign-top text-nowrap"
                                                        >{#if each.city != null}{each.city}, {each.country}*{/if}</td
                                                      >
                                                    {:else}
                                                      <td class="valign-top text-nowrap"
                                                        >{#if each.city != null}{each.city}, {each.state}{/if}</td
                                                      >
                                                    {/if}
                                                    <td class="valign-top left-align">{profile.filings[0].tax_year}</td>
                                                  </tr>
                                                {/each}
                                              {:else}
                                                <tr>
                                                  <td></td>
                                                  <td>No grants listed</td>
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
                                  {#if profile.grants_reference_attachment}
                                    <div class="row">
                                      <div class="col l8 offset-l2">
                                        <div class="card info-card grey lighten-4">
                                          <div class="card-content">
                                            <p>
                                              <i class="material-icons">warning</i> The IRS does not currently provide attachments in the electronic
                                              dataset from which this site is based. However, occasionally these attachments can be found in the
                                              PDF version of the filing which you can find below.
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
                            <!-- <div class="row">
                              <div class="col s12 text-light right-align">
                                Latest Filing: Tax Year {profile.filings[0].tax_year}
                              </div>
                            </div> -->
                            {#if staticGrants && staticGrants.length > 0}
                              <table id="grantsTable" class="striped bordered">
                                <thead>
                                  <tr>
                                    <th data-sort="int" class="right-align text-nowrap"><span>Amount</span></th>
                                    <th data-sort="string"><span>Name</span></th>
                                    <th data-sort="string"><span>Purpose</span></th>
                                    <th data-sort="string"><span>Location</span></th>
                                    <th class="text-center" data-sort="int"><span>Year</span></th>
                                  </tr>
                                </thead>
                                <tbody id="grantsTableBody">
                                  {#each staticGrants as each}
                                    <tr>
                                      <td class="valign-top right-align" data-sort-value={each.amount}>{formatToCurrency(each.amount)}</td>
                                      <td class="valign-top">{each.name}</td>
                                      <td class="valign-top">{each.purpose}</td>
                                      {#if each.is_foreign == true}
                                        <td class="valign-top text-nowrap"
                                          >{#if each.city != null}{each.city}, {each.country}*{/if}</td
                                        >
                                      {:else}
                                        <td class="valign-top text-nowrap"
                                          >{#if each.city != null}{each.city}, {each.state}{/if}</td
                                        >
                                      {/if}

                                      <td class="valign-top left-align">{each.tax_year}</td>
                                    </tr>
                                  {/each}
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
                            {:else}
                              <p class="!mt-8 !font-light">No grants listed</p>
                            {/if}
                          </div>
                          {#if profile.grant_count > 20}
                            <div class="row">
                              <div class="col s12">
                                <div class="card">
                                  <div class="card-content grey lighten-4 text-light">
                                    Note: The IRS dataset contains additional grants for this funder's {profile.filings[0].tax_year} tax year
                                    ({profile.grant_count}
                                    total grants)
                                  </div>
                                </div>
                              </div>
                            </div>
                          {/if}
                        </div>

                        {#if profile.grants_reference_attachment}
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
        <div class="row print-no-pagebreak flex flex-col sm:flex-row">
          <div class="col s12 l6 flex-direction-column print-50 flex">
            <div id="guidelines" class="scrollspy flex grow">
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
                  {#if profile.website && profile.website_is_an_email != true}
                    <ul class="collection">
                      <li class="collection-item avatar">
                        <a href={profile.website} data-ga="Refer to Fdn Website"><i class="material-icons circle blue">public</i></a>
                        <p>
                          Note: This foundation appears to have a website. We recommend starting your exploration there.
                          <a class="btn-link" href={profile.website} data-ga="Refer to Fdn Website">Visit Website</a>.
                        </p>
                      </li>
                    </ul>
                    <hr class="divider" />
                  {:else if profile.website && profile.website_is_an_email == true && profile.grants_to_preselected_only != true}
                    <ul class="collection">
                      <li class="collection-item avatar">
                        <a href={profile.website} data-ga="Refer to Fdn Website"><i class="material-icons circle blue">public</i></a>
                        <p>
                          Note: In lieu of providing a website in its latest e-filed Form 990PF, this foundation likely provided a contact
                          email instead. <a class="btn-link" href={profile.website} data-ga="Refer to Fdn Website">View Email</a>.
                        </p>
                      </li>
                    </ul>
                    <hr class="divider" />
                  {/if}

                  {#if !(profile.grants_to_preselected_only || profile.grants_application_info)}
                    The foundation does not provide any guidance in its latest Form 990 PF Part XV, Lines 2-2d
                  {/if}

                  {#if profile.grants_to_preselected_only}
                    <ul class="collection">
                      <li class="collection-item avatar">
                        <i class="material-icons circle red darken-2">lock</i>
                        <p>
                          The foundation has indicated it only makes contributions to preselected charitable organizations and does not
                          accept unsolicited requests for funds.
                        </p>
                      </li>
                    </ul>
                    {#if profile.grants_application_info}
                      <hr class="divider" />
                    {/if}
                  {/if}

                  {#if profile.grants_application_info}
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
                        <p>{profile.grants_application_info}</p>
                      </li>

                      <li class="collection-item avatar">
                        <i
                          class="material-icons circle grey tooltipped"
                          data-position="right"
                          data-html="true"
                          data-tooltip="Any submission deadlines<br>Line 2c">history</i
                        >
                        <span class="title">Deadlines</span>
                        <p>{profile.grants_application_deadlines}</p>
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
                        <p>{profile.grants_application_restrictions}</p>
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
                        {#if profile.grants_application_contact}
                          <p>{profile.grants_application_contact.name}</p>
                          {#if profile.grants_application_contact.email?.includes('@')}
                            <p>
                              <a
                                href="mailto:{profile.grants_application_contact.email.toLowerCase()}"
                                class="blue-grey-text"
                                data-ga="Refer to Fdn Email">{profile.grants_application_contact.email.toLowerCase()}</a
                              >
                            </p>
                          {:else}
                            <p class="blue-grey-text">{profile.grants_application_contact.email}</p>
                          {/if}
                          <p>{profile.grants_application_contact.address.street}</p>
                          <p>{profile.grants_application_contact.address.street2}</p>
                          <p>
                            {profile.grants_application_contact.address.city}, {profile.grants_application_contact.address.state}
                            {profile.grants_application_contact.address.country}
                            {profile.grants_application_contact.address.zip}
                          </p>
                          {#if profile.grants_application_contact.phone}
                            {@const ph = profile.grants_application_contact.phone}

                            {#if profile.grants_application_contact.is_foreign == true}
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
            <div id="about" class="scrollspy flex grow">
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
                        990 tax filings published by the IRS. Read more <a href="/about/">about the project</a>.
                      </p>
                      <p>
                        The project republishes the IRS dataset, verbatim, focusing exclusively on Form 990 PF, the form most commonly filed
                        by private foundations.
                      </p>
                      <p>
                        Note that the IRS dataset only contains information from <em>electronically-filed</em> tax returns. Read more
                        <a href="/about/the-dataset/">about the dataset</a>.
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
            <div id="financial-overview" class="flex grow">
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
                              <h5 title={humanizeCurrency(profile.assets)}>{humanizeCurrency(profile.assets)}</h5>
                            </div>
                            <div class="center-align">
                              <p>Distributions <i class="material-icons material-icons-tight left grantmakers-text">label</i></p>
                              <h5 title={humanizeCurrency(profile.distributions)}>{humanizeCurrency(profile.distributions)}</h5>
                            </div>
                            <div class="center-align">
                              <p>Contributions <i class="material-icons material-icons-tight left teal-text">label</i></p>
                              <h5 title={humanizeCurrency(profile.contributions)}>{humanizeCurrency(profile.contributions)}</h5>
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
            <div id="financial-trends" class="flex grow">
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
                              <h5 title="Electronically filed tax returns">{profile.filings.length}</h5>
                            </div>
                            <div class="center-align">
                              <p>Last Updated by IRS</p>
                              <h5 title={humanizeCurrency(profile.distributions)}>
                                {formatDateToMonthYear(profile.last_updated_irs) ?? 'N/A'}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div class="chart-wrapper default">
                        <div class="chart-default">
                          <div class="card white z-depth-4">
                            <div class="card-content">
                              {#if profile.financial_stats.length > 1}
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
              <a
                href="/about/buy-chad-a-coffee/"
                class="waves-effect waves-light btn white grey-text text-darken-1"
                data-ga="Buy Me a Coffee CTA"><i class="material-icons left">emoji_food_beverage</i> Buy me a coffee</a
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
                      href="https://projects.propublica.org/nonprofits/organizations/{profile.ein}"
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
                    <li id="js-pdfs" data-ein={profile.ein} class="hide-on-med-and-down">
                      <i class="material-icons">picture_as_pdf</i> <span class="show-on-medium-and-down text-muted">PDF</span>
                    </li>
                    {#each profile.filings.slice(0, 7) as filing}
                      {#if filing.object_id_irs}
                        <li>
                          <a
                            class="waves-effect waves-light btn white grey-text text-darken-1"
                            style="text-transform:none"
                            href="https://projects.propublica.org/nonprofits/organizations/{profile.ein}/{filing.object_id_irs}/full"
                            target="_blank"
                            rel="noopener"
                            data-ga="PDF View Latest"
                            data-ein={profile.ein}
                            title="View latest filing">{filing.tax_year}{filing.filing_is_amendment ? '*' : ''}</a
                          >
                        </li>
                      {/if}
                    {/each}
                    <li style="margin-top:12px">
                      <a
                        class="waves-effect waves-light btn-flat blue-grey-text text-darken-1 font-normal"
                        style="text-transform:none"
                        href="https://projects.propublica.org/nonprofits/organizations/{profile.ein}"
                        target="_blank"
                        rel="noopener"
                        data-ga="PDF View All"
                        data-ein={profile.ein}
                        title="View all available tax filings">View more at ProPublica</a
                      >
                    </li>
                  </ul>
                  {#if displayedFilingIsAmendment}
                    <ul class="list-inline mt-3">
                      <li id="js-pdfs" data-ein={profile.ein} class="hide-on-med-and-down" style="visibility: hidden;">
                        <i class="material-icons">picture_as_pdf</i> <span class="show-on-medium-and-down text-muted">PDF</span>
                      </li>
                      <li class="grey-text text-darken-1">* Filing is an amendment</li>
                    </ul>
                  {/if}
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
  <div class="row m-0!">
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
  .header-bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
    margin: -100px auto 0;
    max-height: 160px;
    max-width: 160px;
  }

  .avatar-letter {
    width: 148px;
    height: 148px;
    font-size: 6.25rem;
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

  /* Search box */
  .flex-hack {
    height: 70px;
    justify-content: right;
  }
  @media (min-width: 768px) {
    .flex-hack {
      height: 75px;
    }
  }
  /* Grants Table */
  :global(.valign-top) {
    vertical-align: top;
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
