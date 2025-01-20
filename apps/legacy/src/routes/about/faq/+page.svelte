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
                It's likely they either do not file their taxes electronically or they do not file Form 990 PF. Only private foundations
                that file electronically in the U.S. are shown on Grantmakers.io.
              </p>
              <h5 id="toc-changes">Do you make any changes to the data?</h5>
              <div>
                <ul class="collapsible collapsible-faq">
                  <li>
                    <div class="collapsible-header">
                      <p>
                        All data found on Grantmakers.io is presented exactly as found in the tax filings, with the exception of two minor
                        formatting changes to improve readability. <a href={'#'}>Details...</a>
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
                <ul class="collapsible collapsible-faq">
                  <li>
                    <div class="collapsible-header">
                      <p>
                        Only to stay within the free tier limits of our search partner. Generally speaking, this affects only older grants
                        e.g. tax years 2009 and 2010. <a href={'#'}>Details...</a>
                      </p>
                    </div>
                    <div class="collapsible-body">
                      <ul class="browser-default">
                        <li>Grant listings for 2009-2012 tax years are excluded from the searchable database.</li>
                        <li>Grant listings for Bank of America Charitable Foundation are limited to tax years 2017 and later.</li>
                        <li>Profiles based on tax years 2009-2012 only show the 50 largest grants.</li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
              <h5 id="toc-free">Why is Grantmakers.io free?</h5>
              <p>
                The better question is why should it cost anything? The source data is published for free by the IRS. The site is hosted for
                free by Github Pages. The search is provided for free by Algolia. There is virtually <a href="/about/#toc-transparency"
                  >no cost</a
                > in hosting and maintaining this site.
              </p>
              <h5 id="toc-open">Does open source mean I can copy this site?</h5>
              <p>
                Yes, and I hope you do! All source code and content is <a href="https://github.com/grantmakers/grantmakers.github.io"
                  >published on Github</a
                > and liberally licensed for open use with the following exceptions: 1) I reserve all rights to the Grantmakers.io brand and
                logo, and 2) all third party logos and brands are property of their respective owners. In short, don't use any logos.
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
