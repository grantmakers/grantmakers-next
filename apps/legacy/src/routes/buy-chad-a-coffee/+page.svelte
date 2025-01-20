<script>
  const title = 'Grantmakers.io - Buy Chad a Coffee';
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
            <h1 class="title">Buy Chad a Coffee</h1>
            <h6>And show your support for open grants data!</h6>
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
                <li class=""><a href="/about/faq/" class="white-text">FAQ</a></li>
              </ul>
              <ul class="list-inline right hide-on-small-only">
                <li class=""><a href="/donate/" class="white-text">Support Open Data</a></li>
                <!--<li class="active disabled"><a href="/donate/buy-chad-a-coffee/" class="white-text">Buy Me a Coffee</a></li>-->
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <div class="container-custom">
        <div class="section section-simple-page section-donate">
          <div class="row">
            <div class="col s12 m6">
              <h4>Hi, I'm Chad 👋</h4>
              <p>I'm the creator of Grantmakers.io.</p>
              <p>
                Grantmakers.io is just me. While I do have a weekend gig that provides healthcare and enough $s for ramen, your monthly
                support directly impacts my ability to continue my open source work.
              </p>
              <h5>The impact of your contribution</h5>
              <p>
                A contribution to Grantmakers.io means you believe in open data. It means you support new models for ensuring grants data
                remains free and open for everyone, regardless of one's ability to afford expensive subscription-based databases.
              </p>
              <h5>Transparency</h5>
              <p>
                If you haven't done so already, <a href="/about/">read more</a> about the costs behind this site (hint: it's mostly coffee).
                If you have any questions, I'd love to hear from you, or if you're in Chicago, let's grab a coffee!
              </p>
              <h5>A sincere thank you 💖</h5>
              <p><img src="/assets/img/signature.png" alt="Chad" /></p>
              <p></p>
              <div class="divider"></div>
              <p>
                Legal Compliance and Disclaimer: You are contributing directly to an individual, not a formal nonprofit organization with
                501(c)3 status nor a fiscally sponsored organization. Thus, your contribution is unlikely to be tax deductible.
              </p>
            </div>
            <div class="col s12 m5 offset-m1">
              <script src="https://donorbox.org/widget.js" paypalExpress="false"></script><iframe
                title="Donation form"
                allowpaymentrequest=""
                frameborder="0"
                height="900px"
                name="donorbox"
                scrolling="no"
                seamless="seamless"
                src="https://donorbox.org/embed/buy-chad-a-coffee"
                style="max-width: 500px; min-width: 310px; max-height:none!important"
                width="100%"
              ></iframe>
              <p>Coffee not your thing? <a href="/donate/">Explore all the ways</a> to support Grantmakers.io.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
