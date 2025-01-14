/**
 * Example Usage
 import { trackEvent } from '@repo/shared/utils/analytics.js';
 if (page.params.ein === profile.ein) {
    trackEvent('redirect_ein_shortcut_route', {
      event_category: 'Navigation',
      event_label: 'EIN Only Access',
      ein: profile.ein,
      original_url: page.params.ein,
      destination_url: `/profiles/v1/${profile.ein}-${profile.organization_name_slug}`,
      organization_name: profile.organization_name,
    });
  }
  const referrer = document.referrer;
  if (referrer && referrer.includes('/profiles/v1/')) {
    trackEvent('redirect_slug_mismatch', {
      event_category: 'Navigation',
      event_label: 'Organization Name Slug Mismatch',
      ein: profile.ein,
      from_url: referrer,
      to_url: window.location.pathname,
      organization_name: profile.organization_name,
    });
  }
 */

type GtagEvent = {
  event_category: string;
  event_label: string;
  ein: string;
  original_url?: string;
  destination_url?: string;
  organization_name?: string;
  from_url?: string;
  to_url?: string;
};

export const trackEvent = (eventName: string, params: GtagEvent) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    window.gtag('event', eventName, params);
  }
};
