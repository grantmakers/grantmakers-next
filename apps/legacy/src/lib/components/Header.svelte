<script lang="ts"></script>

<header>
  <!-- Navbar -->
  <div>
    <nav class="navbar-unified-search transparent" id="primary-navbar">
      <div class="nav-wrapper">
        <div class="container-custom">
          <a href={'#'} data-target="mobile-nav" class="sidenav-trigger right disable-primary-color"><i class="material-icons">menu</i></a>
          <div class="row">
            <div class="col s8 m4 l4">
              <a data-sveltekit-reload href="/" data-ga="Homepage" class="brand-logo">
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
                  <a data-sveltekit-reload href="/search/profiles/" title="Profiles Search">
                    <i class="material-icons circle grantmakers">search</i> <span class="title">Find a Foundation Profile</span>
                    <p class="grantmakers-text">Profiles Search</p>
                  </a>
                </li>
                <li class="collection-item avatar">
                  <a data-sveltekit-reload href="/search/grants/" title="Grants Search">
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
