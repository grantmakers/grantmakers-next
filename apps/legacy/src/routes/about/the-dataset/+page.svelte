<script>
  const title = 'Grantmakers.io - About the Dataset';
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<div class="simple-page">
  <main>
    <div class="header header-filter" style="background-image: url('/assets/img/files.jpg')">
      <div class="container valign-wrapper">
        <div class="row">
          <div class="col s12 center-align">
            <h1 class="title">The Dataset</h1>
            <h6>A public IRS dataset of 990s</h6>
          </div>
        </div>
      </div>
    </div>

    <div class="main main-raised">
      <nav class="clean grey darken-2 z-depth-1">
        <div class="container-custom">
          <div class="nav-wrapper">
            <div class="col s12">
              <ul class="list-inline left">
                <li class=""><a href="/about/" class="white-text">About</a></li>
                <li class="active diabled"><a href="/about/the-dataset/" class="white-text">The Dataset</a></li>
                <li class=""><a href="/about/faq/" class="white-text">FAQ</a></li>
              </ul>
              <ul class="list-inline right hide-on-small-only">
                <li class=""><a href="/donate/" class="white-text">Support Open Data</a></li>
                <!--<li class=""><a href="/donate/buy-chad-a-coffee/" class="white-text">Buy Me a Coffee</a></li>-->
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div class="container-custom">
        <div class="section section-simple-page section-about">
          <div id="main-content" class="row">
            <div class="col s12 m9 offset-m1 l10 offset-l1 xl8 offset-xl1">
              <div class="section section-about">
                <p class="summary blue-grey-text text-darken-3">
                  The best way to get to know Grantmakers.io is to first understand the public dataset from which the site is derived.
                </p>
              </div>
              <div id="toc-dataset" class="section section-about scrollspy">
                <h4>Public IRS dataset</h4>
                <p>
                  The IRS started publishing foundation tax returns in "machine-readable format" for the first time in 2016. Grantmakers.io
                  pulls data exclusively from this dataset. It's open...it's free...it's awesome.
                </p>

                <p>
                  Grantmakers.io focuses exclusively on Form 990-PF, the tax filing used by private foundations. If a foundation files a
                  different tax form, they will not be included in search results and will not have a profile on Grantmakers.io. For
                  example, community foundations and operating foundations file Form 990 (not Form 990-PF), so they will not appear on
                  Grantmakers.io.
                </p>
                <div class="card info-card grey lighten-4">
                  <div class="card-content">
                    <p><span class="emoji">✅</span>Private foundations</p>
                    <p><span class="emoji">🔲</span>Community foundations</p>
                    <p><span class="emoji">🔲</span>Operating foundations</p>
                  </div>
                </div>
              </div>
              <div id="toc-research" class="section section-about scrollspy">
                <h4>Great for quick research and initial prospecting</h4>
                <p>
                  Grantmakers.io was originally built to help a friend find information on a specific funding prospect previously
                  identified. <a class="text-bold bg-grantmakers-orange" href="/search/profiles/">Profiles Search</a> was the first search tool
                  created and is optimized to quickly find a funder's profile (if one exists).
                </p>
                <p>
                  The <a class="text-bold blue-grey-text" href="/search/grants/">Grants Search</a> tool was developed to allow fundraisers to
                  do basic prospecting by exploring which foundations have donated to similar grantees in the past.
                </p>
              </div>
              <div id="toc-updates" class="section scrollspy">
                <h4>IRS controls the frequency of updates</h4>
                <p>
                  The IRS publishes updates on a roughly monthly cadence. Updates are typically live on Grantmakers.io within a week of
                  being published by the IRS.
                </p>
                <p>
                  When using the Grant Search tool for basic prospecting, be mindful of the delay from the time a foundation makes a grant
                  to the time it makes its way through the tax filing and IRS publication process. "New" grants that appear in Grant Search
                  results were likely actually funded 9-18+ months before first appearing in results.
                </p>
              </div>
              <div id="toc-content" class="section scrollspy">
                <h4>Foundations control the content</h4>
                <p>
                  The information a foundation enters when filing their return <strong>appears exactly as entered</strong> on the return. Most
                  of the time foundations catch misspellings and mistakes before filing their returns, but don't be surprised if you come across
                  the occasional piece of data that simply looks odd.
                </p>
                <p>
                  You can certainly reach out to the foundation to give them a heads up on any errors you find, but the only way a
                  foundation can adjust their filing content is to file a full amendment to their return. This might come at significant
                  expense. For this reason, Grantmakers.io has a "Community Intelligence" section on each profile to provide context behind
                  suggested edits and adjustments.
                </p>
                <p>
                  Another thing to keep in mind is grantee names can be whatever the foundation wants to list. There is no IRS requirement
                  to use the actual legal name for the grantees, and no requirement to distinguish between national HQ recipients and their
                  local/regional organizations. Be sure to use the filter tools to select the names most relevant to your search, and be
                  mindful that misspellings do indeed exist.
                </p>
              </div>
              <div id="toc-get-involved" class="section section-about scrollspy">
                <h4>Your insight drives improvements</h4>
                <p>
                  If you're new to Grantmakers.io, welcome! I love surprising new visitors by implementing suggestions within hours whenever
                  possible, so if you have any thoughts or ideas on how the site can be improved to help other non-profit professionals, <a
                    href="mailto:feedback@grantmakers.io">I'd love to connect</a
                  >.
                </p>
                <p></p>
              </div>
              <div id="next" class="section section-about scrollspy">
                <div class="card info-card grey lighten-3">
                  <div class="card-content">
                    <h6 class="text-uppercase">Explore the dataset</h6>
                    <p>Think about organizations similar to yours, then <a href="/search/grants">try searching for them here</a>.</p>
                    <p></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col m2 l1 xl2 offset-xl1 hide-on-small-only">
              <div class="toc-wrapper pushpin pin-top">
                <div>
                  <ul class="table-of-contents">
                    <li><a href="#toc-dataset">Public dataset</a></li>
                    <li><a href="#toc-research">Research vs prospecting</a></li>
                    <li><a href="#toc-updates">Timing of updates</a></li>
                    <li><a href="#toc-content">Content quirks</a></li>
                    <li><a href="#toc-get-involved">Feedback welcome</a></li>
                    <li id="pin-anchor-bottom"></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col s12 m10 offset-m1 xl8 offset-xl1">
              <div class="divider"></div>
              <div class="section section-about-cta center-align">
                <h5>If you've found Grantmakers.io helpful, why not</h5>
                <a href="/buy-chad-a-coffee/" class="btn btn-coffee"
                  ><i class="material-icons left">emoji_food_beverage</i> Buy me a coffee</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
