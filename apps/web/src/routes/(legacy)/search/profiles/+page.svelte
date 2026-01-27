<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { sticky } from '$src/lib/utils/sticky';
  import SearchTypesModal from '$src/lib/components/legacy/modals/SearchTypesModal.svelte';
  import IrsExcludeModal from '$src/lib/components/legacy/modals/IrsExcludeModal.svelte';

  const site = {
    baseurl: '',
    title: 'Search Foundation Profiles - Grantmakers.io',
  };

  // Search box sticky header
  let searchAnchor: HTMLElement;

  // Initial search-type toggle state
  let currentSearch = 'profiles';

  function handleSearchChange(event: Event) {
    const target = event.target;

    if (target instanceof HTMLSelectElement) {
      const selectedSearch = target.value;
      if (selectedSearch) {
        goto(`/search/${selectedSearch}`, { invalidateAll: true });
      }
    }
  }

  onMount(async () => {
    let M = await import('materialize-css');
    const { initSearchJs } = await import('$src/lib/assets/legacy/js/search-profiles.svelte.js');
    try {
      initSearchJs(M);
    } catch (error) {
      console.log(error);
    }
  });
  onDestroy(async () => {
    const { destroySearchJs } = await import('$src/lib/assets/legacy/js/search-profiles.svelte.js');
    if (destroySearchJs) {
      destroySearchJs();
    }
  });
</script>

<svelte:head>
  <title>{site.title}</title>
</svelte:head>

<div class="unified-search pb-8" data-sveltekit-preload-data="false">
  <main>
    <div class="nav-search" bind:this={searchAnchor}>
      <nav
        class="nav-center grey lighten-3 z-depth-1"
        use:sticky={{
          minWidth: 992,
          placeholder: true,
        }}
      >
        <div class="nav-wrapper">
          <div class="row">
            <div class="col l2 hide-on-med-and-down">
              <div id="search-toggle" class="input-field valign-wrapper">
                <select
                  id="toggle-search-type-profiles"
                  class="browser-default grantmakers white-text"
                  aria-label="Foundations"
                  bind:value={currentSearch}
                  on:change={handleSearchChange}
                >
                  <optgroup class="disabled" label="Research a foundation">
                    <option value="profiles">Foundations</option>
                  </optgroup>
                  <optgroup class="disabled" label="Search all Grantees">
                    <option value="grantees">Grantees</option>
                  </optgroup>
                </select>
              </div>
            </div>
            <div class="col s12 l6 offset-l1 search-box-wrapper">
              <div id="ais-widget-search-box"></div>
              <div id="search-box-dropdown-trigger" class="hide-on-small-only">
                <div class="search-box-dropdown-trigger-wrapper valign-wrapper">
                  <a class="dropdown-trigger flex justify-center" href={'#'} data-target="search-box-dropdown"
                    ><i class="material-icons">arrow_drop_down</i></a
                  >
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
                        <span>Foundation name</span>
                      </label>
                      <span class="checkbox-only" data-attribute="organization_name">only</span>
                    </li>
                    <li class="valign-wrapper">
                      <label>
                        <input id="city" type="checkbox" class="filled-in" checked />
                        <span>Foundation location</span>
                      </label>
                      <span class="checkbox-only" data-attribute="city">only</span>
                    </li>
                    <li class="valign-wrapper">
                      <label>
                        <input id="people.name" type="checkbox" class="filled-in" checked />
                        <span>Trustees</span>
                      </label>
                      <span class="checkbox-only" data-attribute="people.name">only</span>
                    </li>
                    <li class="valign-wrapper small text-light">
                      EIN is always searchable
                      <span id="select-all" class="right">SELECT ALL</span>
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
                <span class="card-title"
                  ><strong>Check your url</strong> <br />Search results are only available at
                  <a href="/">Grantmakers.io</a></span
                >
                <p>
                  We limit search results to Grantmakers.io to allow the maximum number of people access to this free service. The page you
                  landed on is not Grantmakers.io.
                </p>
              </div>
              <div class="card-action">
                <a class="btn-flat blue-grey white-text" href="https://www.grantmakers.io/">Go to Grantmakers</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="algolia-hits-wrapper" class="row">
        <div class="col s12 l3">
          <!-- Filters / Refinements header -->
          <div class="hide-on-med-and-down text-muted">
            Filters
            <div class="switch switch-refinements right">
              <label class="search-toggle-advanced hidden">
                Show advanced tools
                <input type="checkbox" />
                <span class="lever"></span>
              </label>
            </div>
          </div>
          <div class="hide-on-large-only center-align">
            <ul class="actions list-inline">
              <li>
                <a
                  href={'#'}
                  data-target="refinements-slide-out"
                  class="sidenav-trigger show-on-med-and-down waves-effect waves-light button-collapse btn white grey-text text-darken-3"
                  ><i class="material-icons right">filter_list</i> Filter</a
                >
              </li>
              <li>
                <span id="ais-widget-mobile-clear-all"></span>
              </li>
            </ul>
          </div>
          <div class="divider hide-on-med-and-down"></div>
          <div class="section-refinements section-refinements-profiles-search hide-on-med-and-down">
            <div>
              <!-- Add row class to remove added white space / padding -->
              <div class="col s12">
                <div id="ais-widget-refinement-list--city"></div>
                <div id="ais-widget-refinement-list--state"></div>
                <div id="ais-widget-range-input"></div>
                <div id="ais-widget-refinement-list--eobmf_recognized_exempt"></div>
                <div id="ais-widget-refinement-list--has_recent_grants"></div>
                <div id="ais-widget-refinement-list--grants_to_preselected_only"></div>
                <div id="ais-widget-refinement-list--is_likely_staffed"></div>
              </div>
              <!-- Exclusion Definition Modal-->
              <IrsExcludeModal />

              <div class="col s12">
                <div class="section">
                  <div id="ais-widget-clear-all" class="center-align"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col s12 l9">
          <div class="row row-tight">
            <div class="col s12 m9 l10">
              <div id="ais-widget-stats"></div>
            </div>
            <div class="col m3 l2 hide-on-small-only">
              <div id="ais-widget-sort-by" class="small text-muted-max right">
                <SearchTypesModal />
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
            <div class="col s12 l9">
              <div id="ais-widget-current-refined-values"></div>
              <!-- Profiles ais-widget-hits goes here-->
              <div>
                <!-- Use class card for grants results-->
                <div>
                  <!-- Use class card-content for grants results-->
                  <div id="ais-widget-hits"></div>
                </div>
              </div>
            </div>
            <div id="dataset-info" class="col l3">
              <div class="card z-depth-0">
                <div class="card-content">
                  <h6 class="subheader">Get to know the data</h6>
                  <p>Grantmakers.io pulls from the public IRS 990 dataset. The dataset is comprised of:</p>
                  <ul class="collapsible z-depth-0">
                    <li>
                      <div class="collapsible-header"><i class="material-icons">arrow_right</i>Electronically filed returns</div>
                      <div class="collapsible-body">
                        <span
                          >All foundations are now required to e-file returns. Historical tax filings only appear if filed electronically.</span
                        >
                      </div>
                    </li>
                  </ul>
                  <!--<p>Built exclusively for nonprofit fundraising professionals, Grantmakers.io focuses on:</p>-->
                  <p>Data is extracted exclusively from Form 990 PF, the form filed by:</p>
                  <ul class="collapsible z-depth-0">
                    <li>
                      <div class="collapsible-header"><i class="material-icons">arrow_right</i>Private foundations</div>
                      <div class="collapsible-body">
                        <span>Keep in mind many community foundations and certain other foundations file Form 990.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="center-align">
                <div class="waves-effect waves-light btn-flat">
                  <a href="/about/the-dataset/">
                    Learn more
                    <span class="sr-only">about the dataset</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col s12 l6 offset-l3">
          <div class="section center-align">
            <div id="ais-widget-pagination"></div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Filters Sidenav-->
  <div class="row m-0!">
    <div class="col s12">
      <ul id="refinements-slide-out" class="sidenav section-refinements left-align grey lighten-5">
        <li><div id="ais-widget-mobile-refinement-list--city"></div></li>
        <li><div id="ais-widget-mobile-refinement-list--state"></div></li>
        <div id="ais-widget-mobile-refinement-list--has_recent_grants"></div>
        <div id="ais-widget-mobile-refinement-list--is_likely_staffed"></div>
        <div id="ais-widget-mobile-refinement-list--grants_to_preselected_only"></div>
        <div id="ais-widget-mobile-refinement-list--eobmf_recognized_exempt"></div>
        <div id="ais-widget-mobile-refinement-list--grantee_name"></div>
        <div id="ais-widget-mobile-refinement-list--organization_name"></div>
        <div id="ais-widget-mobile-refinement-list--grantee_city"></div>
        <div id="ais-widget-mobile-refinement-list--grantee_state"></div>
      </ul>
    </div>
  </div>
  <!-- End Filters sidenav -->
</div>
