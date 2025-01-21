<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import bg from '$lib/assets/legacy/images/bg.jpg';
  import Header from '$lib/components/search/Header.svelte';
  const site = {
    baseurl: '',
    number_of_searchable_grants: 4748595,
    title: 'Grantmakers.io - Search Foundation Grants',
  };

  const hostname = browser ? window.location.hostname : '';
  const allowedDomain = 'www.grantmakers.io';
  let isAllowedDomain = $derived(hostname === allowedDomain);

  onMount(async () => {
    let M = await import('materialize-css');
    const { initSearchJs } = await import('$lib/assets/legacy/js/search-grants');
    try {
      initSearchJs(M);
    } catch (error) {
      console.log(error);
    }
  });
</script>

<svelte:head>
  <title>{site.title}</title>
</svelte:head>

<div class="unified-search" data-sveltekit-preload-data="false">
  <Header />

  <main>
    <div class="parallax-container overlay">
      <div class="parallax">
        <img src={bg} alt="" />
      </div>
      <div class="intro valign-wrapper">
        <div class="intro-text center-align white-text">
          <h1 class="text-bold">Grants Search</h1>
          <h5>Discover who foundations are funding</h5>
          <p>
            Search through {(site.number_of_searchable_grants / 1e6).toFixed(1)} million grants contained in the public IRS 990-PF dataset
          </p>
        </div>
      </div>
      <canvas></canvas>
    </div>
    <div class="nav-search">
      <nav class="nav-center grey lighten-3 z-depth-1">
        <div class="nav-wrapper">
          <div class="row">
            <div class="col l2 hide-on-med-and-down">
              <div id="search-toggle" class="input-field valign-wrapper">
                <select class="browser-default grants-search white-text">
                  <optgroup class="disabled" label="Research a foundation">
                    <option value="profiles">Profile Search</option>
                  </optgroup>
                  <optgroup class="disabled" label="Search all grants">
                    <option value="grants" selected>Grants Search</option>
                  </optgroup>
                </select>
              </div>
            </div>
            <div class="col s12 l6 offset-l1 search-box-wrapper">
              <div id="ais-widget-search-box"></div>
              <div id="search-box-dropdown-trigger" class="hide-on-small-only">
                <div class="search-box-dropdown-trigger-wrapper valign-wrapper">
                  <a class="dropdown-trigger" href={'#'} data-target="search-box-dropdown"><i class="material-icons">arrow_drop_down</i></a>
                </div>
              </div>
              <div class="search-box-dropdown-wrapper"></div>
              <div id="search-box-dropdown" class="dropdown-content white text-default">
                <div class="dropdown-wrapper">
                  <span class="dropdown-header"><small>FIELDS TO SEARCH</small></span>
                  <ul id="dropdown-body">
                    <li class="valign-wrapper">
                      <label>
                        <input id="organization_name" type="checkbox" class="filled-in" checked />
                        <span>Funder</span>
                      </label>
                      <span class="checkbox-only" data-attribute="organization_name">only</span>
                    </li>
                    <li class="valign-wrapper">
                      <label>
                        <input id="grantee_name" type="checkbox" class="filled-in" checked />
                        <span>Recipient</span>
                      </label>
                      <span class="checkbox-only" data-attribute="grantee_name">only</span>
                    </li>
                    <li class="valign-wrapper">
                      <label>
                        <input id="grantee_city" type="checkbox" class="filled-in" checked />
                        <span>Recipient city</span>
                      </label>
                      <span class="checkbox-only" data-attribute="grantee_city">only</span>
                    </li>
                    <li class="valign-wrapper">
                      <label>
                        <input id="grant_purpose" type="checkbox" class="filled-in" checked />
                        <span>Grant purpose</span>
                      </label>
                      <span class="checkbox-only" data-attribute="grant_purpose">only</span>
                    </li>
                    <li class="valign-wrapper small text-light left-align">
                      <span id="select-all" style="margin:inherit">SELECT ALL</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col l3 hide-on-med-and-down">
              <div id="powered-by" class="right"></div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div class="section section-raised z-depth-4 grey lighten-3">
      <div id="rate-limit-message" class="hidden">
        <div class="row">
          <div class="col s12">
            <div class="card">
              <div class="card-content">
                <h5>You have reached the hourly search limit</h5>
                <p>
                  We place limits on the number of searches to allow the maximum number of people access to this free service. You and/or
                  your colleagues have reached this limit. Please try again in one hour. If you feel this was in error, please <a
                    href="mailto:opensource@grantmakers.io">get in touch</a
                  >.
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
                {#if isAllowedDomain}
                  <span class="card-title"
                    ><strong>Coming soon</strong> <br />We're working with our search partner to deploy millions of new grants!</span
                  >
                  <p>Please check back tomorrow.</p>
                {:else}
                  <span class="card-title"
                    ><strong>Check your url</strong> <br />Search results are only available at
                    <a data-sveltekit-reload href="/">Grantmakers.io</a></span
                  >
                  <p>
                    We limit search results to Grantmakers.io to allow the maximum number of people access to this free service. The page
                    you landed on is not Grantmakers.io.
                  </p>
                  <div class="card-action">
                    <p><a class="btn-flat blue-grey white-text" href="https://www.grantmakers.io/">Go to Grantmakers</a></p>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
        <div id="algolia-hits-wrapper" class="row js-hide-advanced-tools">
          <div class="col s12 l4">
            <!-- Filters / Refinements header -->
            <div class="hide-on-med-and-down text-muted">
              Filters
              <div class="switch switch-refinements right">
                <label class="search-toggle-advanced">
                  Show advanced tools
                  <input type="checkbox" />
                  <span class="lever"></span>
                </label>
              </div>
            </div>
            <div class="hidden">
              <ul class="actions">
                <li>
                  <span id="ais-widget-mobile-clear-all"></span>
                  <a
                    href={'#'}
                    data-target="refinements-slide-out"
                    class="sidenav-trigger waves-effect waves-light button-collapse btn white grey-text text-darken-3"
                    ><i class="material-icons right">filter_list</i> Filter</a
                  >
                </li>
                <li></li>
              </ul>
            </div>
            <div class="divider hide-on-med-and-down"></div>
            <div class="section-refinements section-refinements-grants-search hide-on-med-and-down grants-search">
              <div>
                <!-- Add row class to remove added white space / padding -->
                <div class="col s12">
                  <div id="ais-widget-range-input"></div>
                  <div id="ais-widget-refinement-list--grantee_name"></div>
                  <div id="ais-widget-refinement-list--organization_name"></div>
                  <div id="ais-widget-refinement-list--grantee_city"></div>
                  <div id="ais-widget-refinement-list--grantee_state"></div>
                </div>
                <div class="col s12">
                  <div class="section">
                    <div id="ais-widget-clear-all" class="center-align"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col s12 l8">
            <div class="row row-tight">
              <div class="col s12 m9 l10">
                <div id="ais-widget-stats"></div>
              </div>
              <div class="col m3 l2 hide-on-med-and-down">
                <div id="ais-widget-sort-by" class="small text-muted-max right">
                  <a href="#modal-tips" class="modal-trigger text-muted-max"
                    >Search types <i class="tiny material-icons material-icons-rounded grey lighten-2 icon-idea left">wb_incandescent</i></a
                  >
                </div>
              </div>
            </div>
            <div class="">
              <div class="">
                <div class="divider"></div>
              </div>
            </div>
            <div class="row">
              <!-- Add row class to remove added white space / padding -->
              <div class="col s12">
                <div id="ais-widget-current-refined-values"></div>
                <!-- Profiles ais-widget-hits goes here-->
                <div class="card card-grants-search">
                  <!-- Use class card for grants results-->
                  <div class="card-content">
                    <!-- Use class card-content for grants results-->
                    <div class="row row-tight hide-on-small-only">
                      <div class="col m6">Recipient</div>
                      <div class="col m5">Donor</div>
                      <div class="col m1">Actions</div>
                      <div class="col m12 divider"></div>
                    </div>
                    <div id="ais-widget-hits"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col s12 l9 offset-l3">
            <div class="section center-align">
              <div id="ais-widget-pagination" class="grants-search"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <div id="modal-tips" class="modal">
    <div class="modal-content">
      <div class="card card-search-tips">
        <div class="card-header blue-grey white-text">
          <i class="material-icons icon-idea left">wb_incandescent</i> How to search on Grantmakers.io like a pro
        </div>
        <div class="card-content">
          <span
            >There are two ways to search for information, driven by the primary goal of your search.<!-- Grantmakers.io provides direct access to the electronic IRS 990 datatset. We've pulled the useful components and made them fully searchable.--></span
          >
          <div class="divider"></div>
          <div class="row flex">
            <div class="col s12 m6 flex-direction-column flex">
              <ul class="search-details-header">
                <li class="text-bold">
                  <a class="grantmakers-text" href="{site.baseurl}/search/profiles/"
                    ><i class="material-icons left">find_in_page</i> Profiles Search</a
                  >
                </li>
                <li class="small">Perfect for researching a specific foundation</li>
              </ul>
              <div class="flex-grow-1 flex">
                <ul class="search-details-content card card-flex grey lighten-4 z-depth-0">
                  <li class="small">Search by</li>
                  <li class="small">Name</li>
                  <li class="small">EIN</li>
                </ul>
              </div>
            </div>
            <div class="col s12 m6 flex-direction-column flex">
              <ul class="search-details-header">
                <li class="text-bold">
                  <a class="blue-grey-text" href="{site.baseurl}/search/grants/"
                    ><i class="material-icons left">find_in_page</i> Grants Search</a
                  >
                </li>
                <li class="small">Discover new prospects</li>
              </ul>
              <div class="flex-grow-1 flex">
                <ul class="search-details-content card card-flex grey lighten-4 z-depth-0">
                  <li class="small">Search by</li>
                  <li class="small">Keyword</li>
                  <li class="small">Location</li>
                  <li class="small">Past Grantees</li>
                  <li class="small">Grant Amount</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- <p class="text-light">Use our <a href="{ site.baseurl }/search/grants/" class="blue-grey-text text-bold">Grants Search</a> tool for basic prospecting.</p> -->
        </div>
        <div class="card-action">
          <small>DATA SOURCE: Public electronic IRS 990 dataset</small>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  #algolia-hits-wrapper {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }
  :global(#algolia-hits-wrapper.loaded) {
    opacity: 1;
  }
  #stay-tuned-message {
    position: relative;
    top: -100px;
    z-index: 9999;
  }
</style>
