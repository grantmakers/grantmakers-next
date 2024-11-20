import type { ObjectId, InsertOneResult } from 'mongodb';
import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
import type { IrsGrant } from './grants';

// Placeholder types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type $TSFixMe = any;
export type $TSFixMeObject = { [key: string]: $TSFixMe };

/**
 * Common types
 */

// TODO Typescript can't ensure 9 characters, but other options exist to improve type safety (guards, assertion, etc)
export type Ein = string;

/**
 * Pub78 & EOBMF
 */
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
  _id?: ObjectId;
  deductibility_code: string[]; // Overrides the type from Pub78Item
  irs_file_last_modified: string;
  accessed_on: string;
}

export interface CheckAndUpdateFileResponse {
  ok: boolean;
  newerFileExists: boolean;
}

export interface EobmfRaw {
  EIN: string;
  NAME: string;
  ICO: string;
  STREET: string;
  CITY: string;
  STATE: string;
  ZIP: string;
  GROUP: string;
  SUBSECTION: string;
  AFFILIATION: string;
  CLASSIFICATION: string;
  RULING: string;
  DEDUCTIBILITY: string;
  FOUNDATION: string;
  ACTIVITY: string;
  ORGANIZATION: string;
  STATUS: string;
  TAX_PERIOD: string;
  ASSET_CD: string;
  INCOME_CD: string;
  FILING_REQ_CD: string;
  PF_FILING_REQ_CD: string;
  ACCT_PD: string;
  NTEE_CD: string;
  SORT_NAME: string;
}

export interface EobmfItem extends EobmfRaw {
  ASSET_AMT: string;
  INCOME_AMT: string;
  REVENUE_AMT: string;
  accessed_on: string;
}

export interface EobmfDoc extends EobmfRaw {
  _id?: ObjectId;
  // Strings to numbers
  ASSET_AMT: number;
  INCOME_AMT: number;
  REVENUE_AMT: number;
  // Added fields
  IS_PF_FILING: boolean;
  accessed_on: string;
}

// TODO Need to update with MongodB 7.0 response
export interface CollectionStats {
  ns: string;
  size: number;
  count: number;
  storageSize: number;
  totalIndexSize: number;
  indexSizes: {
    [index: string]: number;
  };
}

/**
 * Raw filing XML to MongoDB document
 */
export interface RawFilingXml {
  Return: $TSFixMeObject; // TODO Use IRS-provided schemas
  'irs:Return'?: $TSFixMeObject; // Handle Malformed scenario
}

// TODO Improve typing of ISODates (create type guards, assertions, etc)
// TODO Clarify typing of EIN (9 digits, no hyphens)
export interface GrantmakersRawFilingObj extends RawFilingXml {
  _id: string;
  ein: string;
  has_extra_grants?: boolean;
  outliers_collection_name?: string;
  outlier_irs_object_id?: string;
  metadata: {
    irs_xml_key: string;
    irs_zip_name: string;
    irs_zip_url: string;
    irs_year_filed: string;
    irs_form_type: string;
    schemas: {
      irs: string;
      grantmakers: string;
    };
    irs_xml_file_metadata: {
      last_modified: string;
      filesize: number;
    };
    grantmakers_processed: string;
  };
}

/**
 * Extracted Filing Data
 * Formerly 'normalized'
 */
export interface GrantmakersFilingObj {
  _id?: string;
  extracted_data: GrantmakersExtractedDataObj;
}

/**
 * Raw Filing Outlier Doc
 *
 * TODO This only handles newer filings
 * TODO Need to define IrsGrant - leverage NEXT repo
 */
export interface OutlierDoc {
  _id?: ObjectId;
  outlier_irs_object_id: string;
  irs_year_filed: string;
  Return: {
    ReturnData: {
      IRS990PF: {
        SupplementaryInformationGrp: {
          // This is different in earlier years
          GrantOrContributionPdDurYrGrp: IrsGrant[]; // This is different in earlier years
        };
      };
    };
  };
}

export type FilingInsertResult = InsertOneResult<GrantmakersRawFilingObj>;
export type OutlierInsertResult = InsertOneResult<OutlierDoc>;
export type FilingWithOutlierResult = [FilingInsertResult, OutlierInsertResult];

// Define the new type for the saveFiling function's return value
export type SaveFilingResult = Promise<FilingInsertResult | FilingWithOutlierResult | undefined>;
