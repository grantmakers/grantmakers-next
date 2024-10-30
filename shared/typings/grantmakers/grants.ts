export interface GrantmakersExtractedDataObj {
  _id?: string;
  aiSummary?: string;
  aiSummarySource?: string;
  aiAccessDate?: string;
  irs_object_id?: string;
  last_updated_irs: string;
  last_updated_grantmakers: string;
  filing_version?: string; // TASK Limit this in the function to just the major version
  filing_is_amendment: boolean;
  ein: string; // Note: See note above re: improving
  organization_name: string;
  organization_names_all?: AllOrgNamesObj;
  assets: number;
  contributions: number;
  distributions: number;
  financial_stats?: any; // TODO
  filings: Filing[]; // TODO Ensure flows through new additions to monorepo
  part_v: PartV | null;
  website: WebsiteObj['website'];
  website_good_crowdsource_candidate: WebsiteObj['goodCrowdsourceCandidate']; // TASK Remove from script. This is no longer needed.
  website_is_an_email: WebsiteObj['websiteIsAnEmail'];
  website_verbatim: WebsiteObj['verbatim'];
  website_modified: WebsiteObj['websiteWasModified'];
  is_foreign: boolean;
  street: string;
  street2: string | null;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
  tax_period?: string; // yyyy-mm-dd
  tax_year?: number; // yyyy
  pub78: Pub78Doc | null; // Includes the array for deductibility_code. Pub78Item is the raw IRS doc item
  pub78_tax_deductibility?: string[] | undefined; // TASK Is this stull useful?
  eobmf_recognized_exempt: boolean;
  eobmf_ruling_date: string | undefined; // yyyymm
  is_likely_staffed: boolean;
  has_website: WebsiteObj['filingHasValidWebsite'];
  has_charitable_activities: boolean;
  charitable_activities_count: number;
  charitable_activities_are_restatement_of_grants: boolean; // TASK Is this still useful?
  has_grants: boolean;
  has_recent_grants: boolean;
  has_extra_grants: boolean;
  grant_max: number;
  grant_min: number;
  grant_median: number;
  grant_count: number;
  grant_count_all_years: number;
  grants_to_preselected_only: true | null; // This field either exists as an 'X' in the raw filing or is not provided
  // TODO May have to change structure to handle arrays of Application Info (2k outliers)
  grants_application_info: string | null;
  grants_application_deadlines: string | null;
  grants_application_restrictions: string | null;
  grants_application_contact: GrantsApplicationContact | {};
  grants_reference_attachment: boolean;
  charitable_activities: CharitableActivitiesArray;
  grants_facet_tax_year: any;
  grants_facets?: Facets[];
  grants?: GrantsArray;
  grants_current_year_top_20?: GrantsArray;
  grants_all_years_top_20?: GrantsArray;
  people: PeopleArray;
  organization_name_prior_year: string | null;
  organization_name_second_prior_year: string | null;
  enable_algolia_search: boolean;
}

export interface SummaryGrant {
  name: string;
  city: string;
  state: string;
  country?: string;
  is_foreign?: boolean;
  amount: number;
  purpose: string;
  tax_year: number;
}

export interface SummaryGrantsData extends GrantmakersExtractedDataObj {
  grants_median: SummaryGrant;
  grants_largest: SummaryGrant[];
  grants_smallest: SummaryGrant[];
}

export interface GivTuesGrant {
  _id: string; // Assuming ObjectId is converted to string
  TAXYEAR: number;
  FILERNAME1: string;
  FILEREIN: number;
  TAXPEREND: Date; // Assuming ISODate is converted to Date
  TAXPERBEGIN: Date; // Assuming ISODate is converted to Date
  URL: string;
  SIGOCPYRBNBN1: string;
  SIGOCPYRFAAL1: string;
  SIGOCPYRFAAL2: string;
  SIGOCPYRFACI: string;
  SIGOCPYRFAPO: string;
  SIGOCPYRFAPC: string;
  SIGOCPYAMOUN: number;
  SIGOCPYPOGOC: string;
  SIGOCPYRFSTA: string;
  SIGOCPYRRELA: string;
}

export interface WebsiteObj {
  verbatim: string | undefined | null; // Note: MongoDB serializes undefined to null upon insert https://www.mongodb.com/docs/drivers/node/current/fundamentals/bson/undefined-values/
  website: string | null;
  websiteWasModified: boolean;
  websiteIsAnEmail: boolean;
  filingHasValidWebsite: boolean;
  goodCrowdsourceCandidate: boolean;
}

// cspell:disable
export interface PartV {
  LiableSection4942TaxInd: boolean;

  // Yearly fields - can range from Yr1 to Yr5
  'AdjustedQlfyDistriYr1Amt?': number;
  'NetVlNoncharitableAssetsYr1Amt?': number;
  'DistributionYr1Rt?': number;
  // yearly cont'd
  'AdjustedQlfyDistriYr2Amt?': number;
  'NetVlNoncharitableAssetsYr2Amt?': number;
  'DistributionYr2Rt?': number;
  // yearly cont'd
  'AdjustedQlfyDistriYr3Amt?': number;
  'NetVlNoncharitableAssetsYr3Amt?': number;
  'DistributionYr3Rt?': number;
  // yearly cont'd
  'AdjustedQlfyDistriYr4Amt?': number;
  'NetVlNoncharitableAssetsYr4Amt?': number;
  'DistributionYr4Rt?': number;
  // yearly cont'd
  'AdjustedQlfyDistriYr5Amt?': number;
  'NetVlNoncharitableAssetsYr5Amt?': number;
  'DistributionYr5Rt?': number;

  // Remaining fields
  TotalDistributionRt: number;
  AverageDistributionRt: number;
  NetVlNoncharitableAssetsAmt: number;
  AdjNetVlNoncharitableAssetsAmt: number;
  NetInvestmentIncomePctAmt: number;
  AdjNonchrtblNetInvstIncmPctAmt: number;
  QualifyingDistributionsAmt: number;
}
// cspell:enable

export interface AllOrgNamesObj {
  filing: FilingOrgNamesObj;
  eobmf?: EobmfOrgNamesObj;
  pub78?: string;
}

export interface EobmfOrgNamesObj {
  name: string;
  ico: string | '';
  sort_name: string | '';
  formatted: string;
}

export interface FilingOrgNamesObj {
  line1: string;
  line2: string | null;
  combined: string;
  formatted: string;
}

export interface Pub78Common {
  ein: string;
  name: string;
  city: string;
  state: string;
  country: string;
}

export interface Filing {
  object_id_irs: string;
  filing_version: string;
  filing_is_amendment: boolean;
  tax_period: number; // yyyymm
  tax_year: number; // yyyy
}

export interface Pub78Item extends Pub78Common {
  deductibility_code: string;
}

export interface Pub78Doc extends Pub78Common {
  _id?: string; // This was changed in the Astro file - too lazy to import all MongoDB types just for the ObjectId
  deductibility_code: string[]; // Overrides the type from Pub78Item
  irs_file_last_modified: string;
  accessed_on: string;
}

export type CharitableActivitiesArray = CharitableActivity[];

export interface CharitableActivity {
  description: string;
  expenses?: number;
}

export type PeopleArray = Person[];

export interface Person {
  name: string | PersonNameWithAttributes | LegacyPersonNameWithAttributes;
  title: string;
  hours: number;
  compensation: number;
}

interface PersonNameWithAttributes {
  text: string;
  attributes: any;
}

interface LegacyPersonNameWithAttributes {
  // prettier-ignore
  _: string;
  attributes: any;
}

export type GrantsArray = Grant[] | null; // This is normalized: Filings with only 1 grant will be normalized to be have one grant in an array

export interface Grant {
  name: string;
  city: string;
  state: string;
  country: string;
  is_foreign: boolean;
  amount: number;
  purpose: string;
  tax_year: number; // yyyy
  labeled_as_person?: boolean;
  grants_reference_attachment?: boolean;
}

export interface Facets {
  'tax_year': string;
  'grant_count': number;
  'facets': GrantsFacets
}

export interface GrantsFacets {
  'name': {
    [key: string]: number;
  };
  'city': {
    [key: string]: number;
  };
  'state': {
    [key: string]: number;
  };
  'country': {
    [key: string]: number;
  };
  // TODO Upstream, convert null to boolean
  'is_foreign': Record<string, never>;
  'purpose': {
    [key: string]: number;
  };
  'amount': {
    [key: string]: number;
  };
}

export type GrantsCollection = GrantInCollection[];

export interface GrantInCollection {
  _id: string;
  objectID: string;
  ein: string;
  organization_name: string;
  city: string;
  state: string;
  tax_year: number;
  last_updated_grantmakers: string;
  last_updated_irs: string;
  grant_amount: number;
  grant_purpose: string;
  grantee_name: string;
  grantee_city: string;
  grantee_state: string;
  grantee_state_displayed: string;
  grantee_country: string;
  grantee_is_foreign: boolean;
  grant_number: number;
  grants_to_preselected_only: true | null;
}

export interface AlgoliaMockResponse {
  query: string;
  hits: GrantInCollection[];
  index: string;
  hitsPerPage: number;
  nbHits: number;
  nbPages: number;
  page: number;

  facets: {
    tax_year: Record<string, number>;
    grant_amount: Record<string, number>;
    grantee_city: Record<string, number>;
    grantee_name: Record<string, number>;
    grant_purpose: Record<string, number>;
    grantee_state: Record<string, number>;
  };
  facets_stats: {
    tax_year: FacetStats;
    grant_amount: FacetStats;
  };
  exhaustiveFacetsCount: boolean;
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  exhaustive: { facetsCount: boolean; nbHits: boolean; typo: boolean };

  params: string;

  processingTimeMS: number;
  serverTimeMS: number;
}

interface FacetStats {
  min: number | null;
  max: number | null;
  avg?: number;
  sum?: number;
}

export interface GrantsApplicationObj {
  grants_application_info: string | null;
  grants_application_deadlines: string | null;
  grants_application_restrictions: string | null;
  grants_application_contact: GrantsApplicationContact | null;
}

export interface GrantsApplicationContact {
  name: string | null;
  email: string | null;
  phone: string | null;
  address: GrantsApplicationContactAddress;
}

export interface GrantsApplicationContactAddress {
  street: string;
  street2: string | null;
  city: string;
  state: string;
  country: 'US' | string;
  zip: string;
}
