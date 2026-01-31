import type { GenerateContentResponseUsageMetadata } from '@google/genai';

/** Common */
/**
 * Normalized Address
 *
 * Standardized address structure extracted from IRS filings across all schema versions.
 * Handles both US and foreign addresses with a boolean discriminator.
 *
 * The `isForeign` flag distinguishes between domestic and foreign addresses:
 * - US addresses: country = 'US', isForeign = false
 * - Foreign addresses: country = ISO country code, isForeign = true
 */
export interface NormalizedAddress {
  street: string | null;
  street2: string | null;
  city: string;
  state: string;
  zip: string | null;
  country: string;
  isForeign: boolean;
}

/** 990PF */
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
  filing_is_final_return: boolean;
  ein: string; // Note: See note above re: improving
  organization_name: string;
  organization_name_slug: string;
  organization_names_all?: AllOrgNamesObj;
  assets: number;
  total_giving: number;
  contributions: number;
  distributions: number;
  financial_stats: FinancialStats[];
  filings: Filing[]; // TODO Ensure flows through new additions to monorepo
  part_v: PartV | null;
  website: WebsiteLegacyObj['website'];
  website_good_crowdsource_candidate: WebsiteLegacyObj['goodCrowdsourceCandidate']; // TASK Remove from script. This is no longer needed.
  website_is_an_email: WebsiteLegacyObj['websiteIsAnEmail'];
  website_verbatim: WebsiteLegacyObj['verbatim'];
  website_modified: WebsiteLegacyObj['websiteWasModified'];
  contact: {
    website: WebsiteObj;
  };
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
  is_likely_inactive: boolean;
  has_website: WebsiteLegacyObj['filingHasValidWebsite'];
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
  grant_count_last_three_years: number;
  grants_to_preselected_only: true | null; // This field either exists as an 'X' in the raw filing or is not provided
  // TODO May have to change structure to handle arrays of Application Info (2k outliers)
  grants_application_info: string | null;
  grants_application_deadlines: string | null;
  grants_application_restrictions: string | null;
  grants_application_contact: GrantsApplicationContact | Record<string, never>;
  grants_reference_attachment: boolean;
  charitable_activities: CharitableActivitiesArray;
  grants_facets: Facets[];
  // TODO Need to create new interfaces matching downstream structures
  grants?: GrantsArray; // ✅ filings, ❌ aggregated, ❌ r2
  grants_last_three_years?: GrantsArray; // ❌filings, ✅ aggregated, ❌ r2
  grants_last_three_years_top_20: GrantsArray;
  grants_current_year_top_20: GrantsArray;
  people: PeopleArray;
  organization_name_legacy_slug: string | null;
  organization_name_legacy_slug_requires_redirect: boolean | null;
  organization_name_prior_year: string | null;
  organization_name_second_prior_year: string | null;
  enable_algolia_search: boolean;
  rank: number;
  rank_total: number;
  rank_giving: number;
  _tags: 'exclude_from_legacy_search'[];
}

export type GrantmakersExtractedDataObjR2 = Omit<
  GrantmakersExtractedDataObj,
  'phone' | 'organization_name_legacy_slug' | 'organization_names_all_years' | 'grants_last_three_years'
>;

export interface Organization990pf {
  _id?: GrantmakersExtractedDataObj['_id'];
  ein: GrantmakersExtractedDataObj['ein'];
  organization_name: GrantmakersExtractedDataObj['organization_name'];
  street: GrantmakersExtractedDataObj['street'];
  city: GrantmakersExtractedDataObj['city'];
  state: GrantmakersExtractedDataObj['state'];
  zip: GrantmakersExtractedDataObj['zip'];
  country: GrantmakersExtractedDataObj['country'];
  is_foreign: GrantmakersExtractedDataObj['is_foreign'];
  total_assets: GrantmakersExtractedDataObj['assets'];
  total_giving: GrantmakersExtractedDataObj['total_giving'];
  tax_year: GrantmakersExtractedDataObj['tax_year'];
  filing_form_type: '990pf';
  website: GrantmakersExtractedDataObj['website'];
  grant_count: GrantmakersExtractedDataObj['grant_count'];
  grant_count_all_years: GrantmakersExtractedDataObj['grant_count_all_years'];
  grant_count_last_three_years: GrantmakersExtractedDataObj['grant_count_last_three_years'];
  grants_to_preselected_only: GrantmakersExtractedDataObj['grants_to_preselected_only'];
  charitable_activities: GrantmakersExtractedDataObj['charitable_activities'];
  people: GrantmakersExtractedDataObj['people'];
  rank: GrantmakersExtractedDataObj['rank'];
  rank_total: GrantmakersExtractedDataObj['rank_total'];
  rank_giving: GrantmakersExtractedDataObj['rank_giving'];
}

// These are the core fields extracted directly from the IRS PF filings
interface GrantBase {
  name: string;
  city: string;
  state: string;
  country: string;
  amount: number;
  purpose: string;
}

// These include various helpers and enhancements
export interface Grant extends GrantBase {
  labeled_as_person: boolean;
  is_foreign: boolean;
  grants_reference_attachment?: boolean;
  is_likely_inactive?: boolean;
  tax_year: number;
}

// SummaryGrants are used in the Profiles json files
// They only contain parts of the full Grant objects
export type SummaryGrant = Omit<Grant, 'grants_reference_attachment' | 'is_likely_inactive' | 'country' | 'is_foreign'> & {
  country?: string;
  is_foreign?: boolean;
  is_malformed_grant?: boolean;
};

export interface SummaryGrantsData extends GrantmakersExtractedDataObj {
  grants_median: SummaryGrant;
  grants_largest: SummaryGrant[];
  grants_smallest: SummaryGrant[];
}

export interface WebsiteLegacyObj {
  verbatim: string | undefined | null; // Note: MongoDB serializes undefined to null upon insert https://www.mongodb.com/docs/drivers/node/current/fundamentals/bson/undefined-values/
  website: string | null;
  websiteWasModified: boolean;
  websiteIsAnEmail: boolean;
  filingHasValidWebsite: boolean;
  goodCrowdsourceCandidate: boolean;
}

/**
 * Represents the structured result of the website cleaning process.
 * See etl/src/processors/rawFilings/website/index.ts
 */
export interface WebsiteObj {
  /** The original, untouched input string. */
  original: string | null;
  /** The cleaned and formatted URL or mailto link. Null if invalid. */
  cleaned: string | null;
  /** The final status of the cleaning attempt. */
  status: 'VALID' | 'REPAIRED' | 'INVALID' | 'NEEDS_REVIEW';
  /** The detected type of the input string. */
  type: 'URL' | 'EMAIL' | 'PHONE-US' | 'NULL' | 'UNKNOWN';
  /** An array of notes detailing the transformations applied. */
  notes: string[];
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

export interface FinancialStats {
  tax_year: GrantmakersExtractedDataObj['tax_year'];
  assets: GrantmakersExtractedDataObj['assets'];
  total_giving: GrantmakersExtractedDataObj['total_giving'];
  contributions: GrantmakersExtractedDataObj['contributions'];
  distributions: GrantmakersExtractedDataObj['distributions'];
}

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

export interface Filing {
  object_id_irs: string;
  filing_version: string;
  filing_is_amendment: boolean;
  filing_is_final_return: boolean;
  tax_period: number; // yyyymm // Update to use tax_period_end
  tax_year: number; // yyyy
}

export interface Pub78Common {
  ein: string;
  name: string;
  city: string;
  state: string;
  country: string;
}

export interface Pub78Item extends Pub78Common {
  deductibility_code: string;
}

export interface Pub78Doc extends Pub78Common {
  _id?: string; // This was changed in the Astro file - too lazy to import all MongoDB types just for the ObjectId
  deductibility_code: string[]; // Overrides the type from Pub78Item
  irs_file_last_modified: string;
  accessed_on: string;
  name_normalized: string;
}

export interface ReducedPub78 {
  name: string;
  city: string;
}

export type CharitableActivitiesArray = CharitableActivity[];

export interface CharitableActivity {
  description: string;
  expenses?: number;
}

export type PeopleArray = Person[];

export interface PersonLocation {
  city: string | null;
  country: string | null;
  is_foreign: boolean;
  // Use either state (for US) or province (for foreign)
  state?: string | null; // Only present for US addresses
  province?: string | null; // Only present for foreign addresses
}

export interface Person {
  name: string | PersonNameWithAttributes | LegacyPersonNameWithAttributes;
  title: string;
  hours: number | null; // 990N is null
  compensation: number | null; // 990N is null
  location?: PersonLocation; // 990N
}

interface PersonNameWithAttributes {
  text: string;
  attributes: unknown;
}

interface LegacyPersonNameWithAttributes {
  // prettier-ignore
  _: string;
  attributes: unknown;
}

/** Embedded Grants */
export type GrantsArray = Grant[];

export interface Facets {
  tax_year: string;
  grant_count: number;
  facets: GrantsFacets;
}

export interface GrantsFacets {
  name: {
    [key: string]: number;
  };
  city: {
    [key: string]: number;
  };
  state: {
    [key: string]: number;
  };
  country: {
    [key: string]: number;
  };
  is_foreign: {
    [key: string]: number;
  };
  purpose: {
    [key: string]: number;
  };
  amount: {
    [key: string]: number;
  };
}

/** Grant Application Data */
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
  is_foreign?: boolean | null;
}

export interface GrantsApplicationContactAddress {
  street: string;
  street2: string | null;
  city: string;
  state: string;
  country: 'US' | string;
  zip: string;
}

/**
 * Grants Collection
 */

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
  grantee_labeled_as_person: boolean;
  grant_number: number;
  grants_to_preselected_only: true | null;
  foundation_is_likely_inactive: boolean;
}

export type ReducedGrantForLlm = Omit<
  GrantInCollection,
  | '_id'
  | 'objectID'
  | 'ein'
  | 'organization_name'
  | 'city'
  | 'state'
  | 'tax_year'
  | 'last_updated_grantmakers'
  | 'last_updated_irs'
  | 'grantee_state_displayed'
  | 'grantee_country'
  | 'grantee_is_foreign'
  | 'grantee_labeled_as_person'
  | 'grant_number'
  | 'grants_to_preselected_only'
  | 'foundation_is_likely_inactive'
> & {
  foundation_name: GrantInCollection['organization_name'];
};

/**
 * Grant Enhancements
 */

export enum EnhancementSource {
  FORMATTED_VIA_NODEJS = 'nodejs_formatter',
  FORMATTED_VIA_LLM = 'llm_formatter',
  AS_IS = 'verbatim_no_change',
  PRIVACY_SHIELD_INDIV = 'llm_is_individual',
  DIRECT_MATCH = 'direct_name_match',
  NORMALIZED_NAME_MATCH = 'normalized_name_match',
  LLM = 'llm', // Direct response from LLM
  LLM_CONFIRMED = 'llm_confirmed', // Cross-check LLM response with grounding, Pub78, EOBMF, or legal_names collections
}

export enum LlmModel {
  GEMINI_2_5_PRO = 'gemini-2.5-pro',
  GEMINI_2_5_FLASH = 'gemini-2.5-flash',
  GEMINI_2_5_FLASH_LITE = 'gemini-2.5-flash-lite',
  GEMINI_2_0_FLASH_LITE = 'gemini-2.0-flash-lite-001',
}

export enum LlmPrompt {
  GEMINI_EIN_V4 = 'v4_gemini_ein',
  GEMINI_EIN_V5 = 'v5_gemini_ein',
  GEMINI_EIN_V6 = 'v6_gemini_ein',
  GEMINI_MISSION_V9 = 'v9_gemini_mission',
  GEMINI_MISSION_V10 = 'v10_gemini_mission',
  GEMINI_MISSION_V11 = 'v11_gemini_mission',
  GEMINI_MISSION_V12 = 'v12_gemini_mission',
}

export interface Enhancement<T = undefined> {
  value: string | string[];
  source: EnhancementSource;
  confidence: number | 'high' | 'medium' | 'low';
  enhanced_at: string;
  metadata?: T;
}

// Specific metadata types for each enhancement
interface NameNormalizationMetadata {
  normalized: string;
  normalized_remove_parens: string;
  dba_aka_in_end_parens: string;
}

interface UsageTokenOutputDetails {
  candidates?: number;
  thinking?: number;
}

export interface UsageTokenDetails {
  input: number;
  output: number;
  output_detail: UsageTokenOutputDetails;
}

export interface LlmResponse {
  thinking?: string[];
  json: LlmTextResponse | null;
  usage: UsageTokenDetails | null;
}

export type StructuredApiResponse<T> = {
  data: T;
  usage: UsageTokenDetails;
};

export interface LlmResponseBooleanOnly {
  thinking: null;
  json: LlmTextResponseBooleanOnly;
  usage: null;
}

export interface LlmResponseMetadata extends LlmResponse {
  model: LlmModel;
  prompt: LlmPrompt;
}

export interface PrivacyShieldIndividual {
  is_individual: boolean;
  is_public_achievement: boolean;
}

export interface GrantPurposeFormatter {
  grant_purpose_formatted: string;
}

export interface LlmTextResponse {
  grantee_name: string;
  classification: 'individual' | 'nonprofit' | 'government' | 'educational' | 'foreign' | 'unknown';
  ein: string | null;
  confidence: 'high' | 'medium' | 'low';
  //legal_name: string | null; // Prompt v8 and lower - the EIN-centered approach
  grantee_name_suggested: string | null; // Prompt v9 and higher - the mission-centered approach
  name_mismatch_explanation: string | null;
}

export interface LlmTextResponseBooleanOnly {
  text: boolean;
}

export interface Enhancements {
  grantee_name_normalizations?: Enhancement<NameNormalizationMetadata>;
  grantee_name_displayed?: Enhancement<unknown>;
  grantee_ein?: Enhancement<LlmResponse>;
  grantee_classification?: Enhancement<unknown>;
  grantee_mission?: Enhancement;
  grantee_parent_mission?: Enhancement;
  grantee_keywords?: Enhancement;
  llm_response?: Enhancement<LlmResponseMetadata>;
  privacy_shield?: Enhancement<PrivacyShieldIndividual>;
  formatted_grant_purpose?: Enhancement<GrantPurposeFormatter>;
}

export interface EnhancedGrant extends GrantInCollection {
  enhancements?: Enhancements;
  _grouped_doc_ids?: string[];
  _group_count?: number;
}

export interface LlmCollection {
  _id?: string;
  grantee_name: string;
  grantee_city: string;
  grant_object_ids: string[];
  enhancements: Enhancements;
}

/** Algolia Grants Response */
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

/** Giving Tuesday Data Marts */

// cspell:disable
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
// cspell:enable
