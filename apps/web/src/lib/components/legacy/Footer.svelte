<script lang="ts">
  import legacyLogo from '$lib/assets/legacy/images/logo.png';
  import githubLogo from '$lib/assets/legacy/images/github.svg';
  import twitterLogo from '$lib/assets/legacy/images/twitter.svg';
  import emailLogo from '$lib/assets/legacy/images/email.svg';
  import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';

  interface Props {
    profile?: GrantmakersExtractedDataObj;
  }

  let { profile }: Props = $props();
  const page = $derived(profile);

  const site = {
    baseurl: '/profiles',
    url: '', //'https://www.grantmakers.io',
    algolia_referral_link: 'https://www.algolia.com/?utm_source=grantmakersio&utm_medium=referral',
  };
</script>

<footer class="footer print-hidden js-enable-donorbox-popup">
  <div class="container-custom">
    <div class="row row-footer-primary-nav">
      <div class="col s4 m3 l3">
        <h6 class="mb-2 text-base font-semibold text-slate-700">The Project</h6>
        <p><a href="/about/the-dataset/">The 990 Dataset</a></p>
        <p><a href="/about/">About</a></p>
        <p><a href="/about/faq/">FAQ</a></p>
      </div>
      <div class="col s4 m3 l3">
        <h6 class="mb-2 text-base font-semibold text-slate-700">Get Involved</h6>
        <p><a href="/about/donate/">Support open data</a></p>
        <p><a href="/about/donate/">Donate</a></p>
      </div>
      <div class="col s4 m3 l3">
        <h6 class="mb-2 text-base font-semibold text-slate-700">Search</h6>
        <p><a href="/search/profiles/" title="Find a foundation profile">Foundation Search</a></p>
        <p><a href="/search/grants/" title="See who foundations are funding">Grants Search</a></p>
      </div>
      <div class="col s4 m3 l3 hide-on-small-only">
        <h6 class="valign-wrapper mb-2 text-base font-semibold text-slate-700">
          <img src={legacyLogo} alt="Grantmakers.io logo" class="icon-logo" />Grantmakers.io
        </h6>
        <p>Discover insights into your next funder. Built for a friend. Open sourced for the world.</p>
      </div>
    </div>
    <div class="divider divider-dark"></div>
    <div class="row row-tight row-footer-secondary-nav">
      <div class="col s12 m12 l4">
        <div class="left-align">
          <ul class="footer-nav list-inline">
            <!-- <li><a href="/profiles/">Profiles Index</a></li> -->
            {#if page && page.ein}
              <li>
                <a href="mailto:feedback@grantmakers.io?body=%0D%0A%0D%0A{page.organization_name}%0D%0A{site.baseurl}/{page.ein}/"
                  >Feedback</a
                >
              </li>
            {:else}
              <li><a href="mailto:feedback@grantmakers.io">Feedback</a></li>
            {/if}
          </ul>
        </div>
      </div>
      <div class="col s12 m12 l4">
        <div class="center-align">
          <ul class="footer-secondary-nav-icons list-inline">
            <li>
              <a data-ga="Github Share Icon" href="https://github.com/grantmakers/grantmakers-next"
                ><img src={githubLogo} alt="Visit Grantmakers.io on Github" /></a
              >
            </li>
            <li>
              <a data-ga="Email Hello Icon" href="mailto:hello@grantmakers.io"><img src={emailLogo} alt="Say hello" /></a>
            </li>
            <li>
              <a data-ga="Twitter Share Icon" href="https://twitter.com/Grantmakersio"
                ><img src={twitterLogo} alt="Follow Grantmakers.io on Twitter" /></a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="col s12 m12 l4">
        <div class="copyright right-align">
          Built with <i class="material-icons grantmakers-text">favorite</i> and
          <i class="material-icons" title="Sometimes tea, but mostly coffee">emoji_food_beverage</i>
          by <a data-ga="Github Chad Kruse Link" class="text-default" href="https://github.com/chadokruse"> Chad Kruse </a>
        </div>
      </div>
    </div>
  </div>
  <div class="footer-terms small">
    <div class="container-custom">
      <div class="row">
        <div class="col m9">
          <ul>
            <li class="small">
              All content is licensed under a <a href="http://creativecommons.org/licenses/by-sa/4.0/"
                >Creative Commons Attribution-ShareAlike 4.0 International License</a
              >, except Grantmakers.io logo (all rights reserved Chad Kruse)
            </li>
          </ul>
        </div>
        <div class="col m3 print-hidden">
          <ul class="list-inline right-align">
            <li>
              <a href="/about/terms/">Terms of Service</a>
            </li>
            <li>
              <a
                href="https://www.iubenda.com/privacy-policy/7996402"
                class="iubenda-nostyle no-brand iub-legal-only iubenda-embed"
                title="Privacy Policy">Privacy Policy</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</footer>

<style>
  img.icon-logo {
    height: 50px;
    width: 50px;
  }
  .divider-dark {
    background-color: #bdbdbd;
  }
</style>
