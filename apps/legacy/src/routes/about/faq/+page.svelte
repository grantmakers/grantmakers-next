<script>
  const title = 'Grantmakers.io - Frequently Asked Questions';
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
            <h1 class="title">Frequently Asked Questions</h1>
            <h6>Simple answers to common questions</h6>
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
                <li class=""><a href="/about/the-dataset/" class="white-text">The Dataset</a></li>
                <li class="active disabled"><a href="/about/faq/" class="white-text">FAQ</a></li>
              </ul>
              <ul class="list-inline right hide-on-small-only">
                <li class=""><a href="/donate/" class="white-text">Support Open Data</a></li>
                <!--<li class=""><a href="/donate/buy-chad-a-coffee/" class="white-text">Buy Me a Coffee</a></li>-->
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div class="container">
        <div class="section section-simple-page section-faq">
          <div class="row">
            <div class="col s12 m8 offset-m2">
              <h5 id="toc-source">Where does the data come from?</h5>
              <p>
                IRS Form 990 PF published in machine-readable format, openly available via <a
                  href="https://www.irs.gov/charities-non-profits/form-990-series-downloads">IRS.gov</a
                >.
              </p>
              <h5 id="toc-edit">Can profiles be edited or removed?</h5>
              <p>
                Grantmakers.io has no control over the information provided in the public dataset by the IRS. Any inquiries as to removing
                information should be made <a href="https://www.irs.gov/e-file-providers/e-file-for-charities-and-non-profits"
                  >directly with the IRS</a
                >.
              </p>
              <h5 id="toc-missing">Why can't I find a foundation?</h5>
              <p>
                Grantmakers.io focuses exclusively on US private foundations, those that file IRS Form 990-PF. Other types of foundations
                including community foundations, operating foundations, and public foundations are beyond the current scope of the project.
              </p>
              <h5 id="toc-changes">Do you make any changes to the data?</h5>
              <div>
                <ul class="collapsible collapsible-faq">
                  <li>
                    <div class="collapsible-header">
                      <p>
                        All data found on Grantmakers.io is presented exactly as found in the tax filings, with the exception of two minor
                        formatting changes to improve readability. <span class="trigger">Details...</span>
                      </p>
                    </div>
                    <div class="collapsible-body">
                      <ul class="browser-default">
                        <li>City names are converted from UPPERCASE to Titlecase as needed.</li>
                        <li>
                          An 'N/A' label is added to missing or omitted fields in foreign address listings (e.g. if the state field is
                          omitted, Grantmakers.io shows the 'N/A' label).
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
              <h5 id="toc-grants">Do you exclude any data?</h5>
              <div>
                <ul class="collapsible collapsible-faq-data">
                  <li>
                    <div class="collapsible-header">
                      <p>
                        Due to the high number of very small grants, two donor-advised-fund providers and one now-closed corporate giving
                        program do not appear on the site. <span class="trigger">Details...</span>
                      </p>
                    </div>
                    <div class="collapsible-body">
                      <ul class="browser-default">
                        <li>Amazonsmile Foundation (EIN 462626883)</li>
                        <li>Bank of America Charitable Foundation Inc. (EIN 200721133)</li>
                        <li>JPMorgan Chase Foundation (EIN 237049738)</li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
              <h5 id="toc-free">Why is Grantmakers.io free?</h5>
              <p>
                The better question is why should it cost anything? The source data is published for free by the IRS. The site is hosted for
                free by Cloudflare Pages. The search is provided for free by Algolia. There is virtually <a href="/about/#toc-transparency"
                  >no cost</a
                > in hosting and maintaining this site.
              </p>
              <h5 id="toc-open">Does open source mean I can copy this site?</h5>
              <p>
                Yes, and I hope you do! All source code is <a
                  href="https://github.com/grantmakers/grantmakers-next"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Github">published on Github</a
                >
                and liberally licensed for open use with the following exceptions: 1) I reserve all rights to the Grantmakers.io brand and logo,
                and 2) all third party logos and brands are property of their respective owners. In short, don't use any logos.
              </p>
              <div id="next" class="section section-about scrollspy">
                <div class="card info-card grey lighten-3">
                  <div class="card-content">
                    <h6 class="text-uppercase">NEXT UP</h6>
                    <h5 class="text-weight-reset">Get to know <a href="/about/">the project</a>.</h5>
                    <p></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  .collapsible-header .trigger {
    color: #c54e00;
    text-decoration: none;
  }
</style>
