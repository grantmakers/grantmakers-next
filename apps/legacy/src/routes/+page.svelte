<script lang="ts">
  import { onMount } from 'svelte';
  import '$lib/assets/legacy/css/main-materialize.css';

  onMount(async () => {
    let M = await import('materialize-css');
    const { initJs } = await import('$lib/assets/legacy/js/pages-materialize');
    try {
      initJs(M);
    } catch (error) {
      console.log(error);
    }
  });
</script>

<div class="main-landing">
  <div class="top-cta black white-text center-align">
    🎉 After eight years and millions of searches, <span class="text-bold">Grantmakers.io is going 2.0!</span>
    <a class="grantmakers-color-light" href="https://next.grantmakers.io" target="_blank">Take a sneak peek.</a>
  </div>
  <header>
    <!-- Navbar -->
    <div>
      <nav class="navbar-unified-search transparent" id="primary-navbar">
        <div class="nav-wrapper">
          <div class="container-custom">
            <a href={'#'} data-target="mobile-nav" class="sidenav-trigger right disable-primary-color"><i class="material-icons">menu</i></a
            >
            <div class="row">
              <div class="col s8 m4 l4">
                <a href="/" data-ga="Homepage" class="brand-logo">
                  <div class="logo-container">
                    <div class="logo">
                      <img src="/assets/img/logo.png" alt="Grantmakers Logo" />
                    </div>
                    <div class="brand brand-name">Grantmakers.io</div>
                  </div>
                </a>
              </div>
              <div class="col m4 l8">
                <ul class="collection right hide-on-med-and-down">
                  <li class="collection-item avatar">
                    <a href="/search/profiles/" title="Profiles Search">
                      <i class="material-icons circle grantmakers">search</i> <span class="title">Find a Foundation Profile</span>
                      <p class="grantmakers-text">Profiles Search</p>
                    </a>
                  </li>
                  <li class="collection-item avatar">
                    <a href="/search/grants/" title="Grants Search">
                      <i class="material-icons circle blue-grey">search</i> <span class="title">Search all Grants</span>
                      <p class="blue-grey-text text-lighten-1">Grants Search</p>
                    </a>
                  </li>
                  <li class="collection-item avatar">
                    <a href={'#'} data-target="navbar-more" class="dropdown-trigger" id="primary-navbar-dropdown-trigger">
                      <i class="material-icons circle grey darken-2">keyboard_arrow_down</i>
                      <div class="valign-wrapper">
                        <p class="grey-text">More</p>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <!-- End Navbar -->
  </header>

  <!-- Navbar dropdown menu item -->
  <ul class="dropdown-content" id="navbar-more">
    <li class="disabled"><a href={'#'} class="title grey-text">The Project</a></li>
    <li><a href="/about/" class="waves-effect waves-light" data-ga="About" title="About">About</a></li>
    <li><a href="/about/faq/" class="waves-effect waves-light" data-ga="FAQ" title="FAQ">FAQ</a></li>
    <li class="divider"></li>
    <li class="disabled"><a href={'#'} class="title grey-text">Get Involved</a></li>
    <li><a href="/donate/" class="waves-effect waves-light" data-ga="Donate" title="Donate">Donate</a></li>
  </ul>
  <!-- End navbar dropdown -->

  <!-- Mobile Navbar -->
  <ul class="nav-primary sidenav" id="mobile-nav">
    <li class="grey darken-2 sidenav-header">
      <a href="/" class="waves-effect waves-light" data-ga="Home">
        <div class="valign-wrapper">
          <img src="/assets/img/logo.png" alt="Grantmakers Logo" />
          <span class="strong white-text"> Grantmakers.io</span>
        </div>
      </a>
    </li>
    <li class="disabled"><a href={'#'} class="title grey-text">Search</a></li>
    <li>
      <a href="/search/profiles/" class="waves-effect waves-light"> Find a Foundation Profile </a>
    </li>
    <li>
      <a href="/search/grants" class="waves-effect waves-light"> Search all Grants </a>
    </li>
    <li><hr class="divider" /></li>
    <li class="disabled"><a href={'#'} class="title grey-text">The Project</a></li>
    <li><a href="/about/" class="waves-effect waves-light" data-ga="About">About</a></li>
    <li><a href="/about/faq/" class="waves-effect waves-light" data-ga="FAQ">FAQ</a></li>
    <li><hr class="divider" /></li>
    <li class="disabled"><a href={'#'} class="title grey-text">Get Involved</a></li>
    <li><a href="/donate/" class="waves-effect waves-light" data-ga="Donate" title="Donate">Donate</a></li>
  </ul>
  <!-- End Mobile Navbar -->

  <main>
    <div class="header header-filter" style="background-image: url('/assets/img/files.jpg')">
      <div class="container valign-wrapper">
        <div class="row">
          <div class="col s12 m10 l8 left-align">
            <h1 class="title">Discover insights into your next funder</h1>
            <h6>
              Grantmakers.io makes the public IRS 990 dataset useful to any nonprofit with an Internet connection. If a foundation files
              taxes electronically, you'll find them here.
            </h6>
            <ul class="list-inline">
              <li>
                <a class="btn btn-large grantmakers" href="/search/profiles/"><i class="material-icons left">search</i>Find a Profile</a>
              </li>
              <li><a class="btn btn-large blue-grey" href="/search/grants/"><i class="material-icons left">search</i> Search Grants</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="main main-raised">
      <!-- Profiles Search -->
      <div class="container">
        <div class="section section-extra-padding">
          <div class="row">
            <div class="col s12 m8 offset-m2 center-align">
              <h3 class="title">Foundation Profiles</h3>
              <h6>Basic stats, full grant listings, and key personnel.</h6>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="section section-extra-padding valign-wrapper">
          <div class="row">
            <div class="col s12 m10 offset-m1 valign-wrapper">
              <div class="row">
                <div class="col s12 m5">
                  <img class="img responsive-img z-depth-3" src="/assets/img/screenshot-summary-zoom.png" alt="" />
                </div>
                <div class="col s12 m7 center-align">
                  <h6 class="subheader">Summary Info</h6>
                  <h5 class="title">Fast information at your fingertips</h5>
                  <p>What's the average grant size? Is the foundation professionally managed? Get a quick snapshot of every foundation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="section section-extra-padding valign-wrapper">
          <div class="row">
            <div class="col s12 m10 offset-m1 valign-wrapper">
              <div class="row">
                <div class="col s12 m7 center-align">
                  <h6 class="subheader">Giving trends</h6>
                  <h5 class="title">Understand giving priorities</h5>
                  <p>View a foundation's historical giving trends to see if your organization is a match.</p>
                </div>
                <div class="col s12 m5">
                  <img class="img responsive-img z-depth-3" src="/assets/img/screenshot-search-zoom.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="section section-extra-padding center-align">
          <div class="row">
            <div class="col s12">
              <h4 class="title">Profiles Search</h4>
              <h6>When you want information on a specific funder</h6>
              <a class="btn btn-large btn-cta grantmakers" href="/search/profiles/"
                ><i class="material-icons left">search</i>Find a Profile</a
              >
            </div>
          </div>
        </div>
      </div>
      <!-- End Profiles Search -->
      <!-- Grants Search -->
      <div class="section section-extra-padding section-feature-grants-search blue-grey darken-1">
        <div class="row row-tight">
          <div class="col s12 m8 offset-m2 center-align">
            <h6 class="subheader white-text">Featuring</h6>
            <h4 class="title">
              In partnership with <a href="https://www.algolia.com/?utm_source=grantmakersio&utm_medium=referral"
                ><img src="/assets/img/algolia-logo-white.svg" alt="Algolia logo" /></a
              >
            </h4>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="section section-extra-padding">
          <div class="row">
            <div class="col s12 m8 offset-m2 center-align">
              <h3 class="title">Grants Search</h3>
              <h6>It's the free grants search tool nonprofits have long deserved!</h6>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="section section-extra-padding valign-wrapper">
          <div class="row">
            <div class="col s12 m10 offset-m1 valign-wrapper">
              <div class="row">
                <div class="col s12 m5">
                  <img class="img responsive-img z-depth-3" src="/assets/img/screenshot-count.png" alt="" />
                </div>
                <div class="col s12 m7 center-align">
                  <h6 class="subheader">Research</h6>
                  <h5 class="title">Search through 4.7 million grants</h5>
                  <p>
                    Thanks to the generosity of our friends at <a
                      href="https://www.algolia.com/?utm_source=grantmakersio&utm_medium=referral">Algolia</a
                    >, nonprofits can conduct research across millions of grants. For free!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="section section-extra-padding valign-wrapper">
          <div class="row">
            <div class="col s12 m10 offset-m1 valign-wrapper">
              <div class="row">
                <div class="col s12 m7 center-align">
                  <h6 class="subheader">Prospecting</h6>
                  <h5 class="title">Find foundations that fund similar organizations</h5>
                  <p>Lightning fast search technology allows fundraisers to cover all their relevant search terms, quickly.</p>
                </div>
                <div class="col s12 m5">
                  <img class="img responsive-img z-depth-3" src="/assets/img/screenshot-similar.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="section section-extra-padding center-align">
          <div class="row">
            <div class="col s12">
              <h4 class="title">Grants Search</h4>
              <h6>When you want to find new funders</h6>
              <a class="btn btn-large btn-cta blue-grey" href="/search/grants/"
                ><i class="material-icons left">search</i>Search all Grants</a
              >
            </div>
          </div>
        </div>
      </div>
      <!-- End Grants Search Feature-->
      <div class="section section-extra-padding-2x section-community-driven grey lighten-3">
        <div class="row row-tight">
          <div class="col s12 m8 offset-m2 center-align">
            <h4>Grantmakers.io was created by me, Chad 👋</h4>
            <h6 class="extra-padding">I built the site to ensure the electronic IRS 990 dataset remained open and free.</h6>
            <ul class="list-inline">
              <li><a class="btn white grey-text text-darken-2" href="/about/">Learn more</a></li>
            </ul>
            <p></p>
          </div>
        </div>
      </div>
      <div class="section section-extra-padding section-current-stats white-text">
        <div class="row row-tight">
          <div class="col s12 l6 offset-l3 center-align">
            <h5 class="white-text">Last updated Jan 17, 2025</h5>
            <div class="row row-tight">
              <div class="col s12 m4">
                <div class="card">
                  <div class="card-content">
                    <div class="card-title grantmakers">Foundations</div>
                    <h1>153k</h1>
                  </div>
                </div>
              </div>
              <div class="col s12 m4">
                <div class="card">
                  <div class="card-content">
                    <div class="card-title grantmakers">Filings</div>
                    <h1>1.0m</h1>
                  </div>
                </div>
              </div>
              <div class="col s12 m4">
                <div class="card">
                  <div class="card-content">
                    <div class="card-title grantmakers">Grants</div>
                    <h1>13.1m</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="section section-extra-padding-2x section-bottom-cta">
        <div class="row row-tight">
          <div class="col s12 l6 offset-l3 center-align">
            <h4>Get started</h4>
            <h6>There are two primary ways to search on Grantmakers.io</h6>
            <ul class="list-inline">
              <li>
                <a class="btn btn-large grantmakers" href="/search/profiles/"><i class="material-icons left">search</i>Find a Profile</a>
                <p class="small hide-on-small-only">Research a specific funder</p>
              </li>
              <li>
                <a class="btn btn-large blue-grey" href="/search/grants/"><i class="material-icons left">search</i> Search Grants</a>
                <p class="small hide-on-small-only">Good for prospect research</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="section section-grantmakers-next grey darken-2 center-align">
        <div class="row row-tight">
          <div class="col s12 l6 offset-l3 center-align">
            <h6 class="grey-text text-lighten-4">🎉 Announcing 🎉</h6>
            <h4>Grantmakers.io NEXT</h4>
            <h6>After eight years and millions of searches, Grantmakers.io is going 2.0</h6>
            <ul class="list-inline">
              <li>
                <a
                  class="btn btn-large waves-effect waves-light white grey-text text-darken-3 bold-text"
                  href="https://next.grantmakers.io"
                  target="_blank">Sneak Peek <i class="material-icons right">open_in_new</i></a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  header {
    position: relative;
  }
</style>
