export interface Person {
  name: string;
  title: string;
}

export interface Filing {
  object_id_irs: string;
  filing_version: string;
  filing_is_amendment: boolean;
  tax_period: number;
  tax_year: number;
  url: string;
}

/**
 * Algolia highlight result structure for a single attribute
 * https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/highlighting-snippeting/js/
 */
export interface HighlightResult {
  value: string;
  matchLevel: 'none' | 'partial' | 'full';
  matchedWords: string[];
  fullyHighlighted?: boolean;
}

/**
 * Type for autocomplete placeholder hits (matches static JSON data)
 */
export interface AutocompleteHit {
  ein: string;
  organization_name: string;
  organization_name_slug: string;
  city: string;
  state: string;
  assets: number;
  rank: number;
  rank_total: number;
  objectID: string;
  _highlightResult?: {
    organization_name?: HighlightResult;
    [key: string]: HighlightResult | undefined;
  };
}

// Legacy response
export interface AlgoliaProfilesResponseLegacy {
  objectID: string;
  people: Person[];
  ein: string;
  organization_name: string;
  city: string;
  state: string;
  distributions: number;
  assets: number;
  eobmf_recognized_exempt: boolean;
  grants_to_preselected_only: boolean;
  has_recent_grants: boolean;
  is_likely_staffed: boolean;
  _id: string;
  last_updated_grantmakers: number;
  last_updated_irs: number;
  aws_index_year: string;
  organization_name_eobmf: string;
  website: string;
  website_is_an_email: boolean;
  website_good_crowdsource_candidate: boolean;
  website_verbatim: string;
  website_modified: boolean;
  street: string;
  street2: null | string;
  country: string;
  zip: string;
  phone: string;
  is_foreign: boolean;
  eobmf_ruling_date: string;
  has_website: boolean;
  has_grants: boolean;
  has_extra_grants: boolean;
  grant_max: number;
  grant_min: number;
  grant_median: number;
  grant_count: number;
  grant_count_all_years: number;
  grants_reference_attachment: boolean;
  filings: Filing[];
  organization_name_prior_year: string;
  organization_name_second_prior_year: string;
  enable_algolia_search: boolean;
  ein_dash: string;
  _highlightResult?: {
    organization_name?: HighlightResult;
    city?: HighlightResult;
    state?: HighlightResult;
    [key: string]: HighlightResult | undefined;
  };
  __position: number;
  __queryID?: string | undefined;
}
