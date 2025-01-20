/*global gtag*/
export function initGaEvents() {
  if (typeof gtag === 'function') {
    // Profile header links
    document.querySelectorAll('.navbar-profile [data-ga]').forEach((each) => {
      each.addEventListener('click', (e) => {
        gtag('event', 'profile_events', {
          event_category: 'Profile Events',
          event_action: 'Profile Header Click',
          event_label: e.target.dataset.gtag,
        });
      });
    });

    // Summary icon clicks
    document.querySelectorAll('.js-ga-summary-icon-click').forEach((each) => {
      each.addEventListener('click', (e) => {
        gtag('event', 'profile_events', {
          event_category: 'Profile Events',
          event_action: 'Profile Summary Icon Click',
          event_label: e.target.dataset.gtag,
        });
      });
    });

    // Clicks to foundation websites
    document.querySelectorAll('.js-ga-website-click').forEach((each) => {
      each.addEventListener('click', (e) => {
        gtag('event', 'profile_events', {
          event_category: 'Profile Events',
          event_action: 'Profile Org Website Click',
          event_label: e.target.dataset.gtag,
        });
      });
    });

    // Table sort (Algolia table)
    // See search.js

    // Algolia grants search box
    // see search.js

    // Algolia Autocomplete search box
    // document.getElementById('autocomplete-input').addEventListener('focus', () => {
    //   gtag('event', 'profile_events', {
    //     'event_category': 'Profile Events',
    //     'event_action': 'Profile Search Focus',
    //     'event_label': 'Autocomplete search',
    //   });
    // });

    // Tax filings
    document.querySelectorAll('#filings ul li a').forEach((each) => {
      each.addEventListener('click', (e) => {
        gtag('event', 'profile_events', {
          event_category: 'Profile Events',
          event_action: 'Profile Tax Filings Click',
          event_label: e.target.dataset.gtag,
        });
      });
    });

    // Left Action Bar
    document.querySelectorAll('.left-action-bar a').forEach((each) => {
      each.addEventListener('click', (e) => {
        gtag('event', 'profile_events', {
          event_category: 'Profile Events',
          event_action: 'Profile Left Action Bar Click',
          event_label: e.target.dataset.gtag,
        });
      });
    });

    // Charts
    // see profile.js

    // Bottom CTAs: Share and feedback buttons
    document
      .querySelectorAll('#profile-share a, #community a, #feedback a, #application-info a, #search-links a, #coffee-bottom-cta a')
      .forEach((each) => {
        each.addEventListener('click', (e) => {
          gtag('event', 'profile_events', {
            event_category: 'Profile Events',
            event_action: 'Profile Bottom CTAs',
            event_label: e.target.dataset.gtag,
          });
        });
      });

    // Footer links
    document.querySelectorAll('footer a, .footer-terms a').forEach((each) => {
      each.addEventListener('click', (e) => {
        gtag('event', 'profile_events', {
          event_category: 'Profile Events',
          event_action: 'Profile Footer Click',
          event_label: e.textContent || e.target.dataset.gtag,
        });
      });
    });

    // Note: URLs are cleaned of UTM info AFTER the intial pageview is send to gtag
    // This was moved to the initial pageview send, currently located in a Jekyll include
  }
}
