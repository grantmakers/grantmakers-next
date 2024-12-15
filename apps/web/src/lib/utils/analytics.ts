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
