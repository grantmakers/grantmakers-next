/**
 * Grant Recipients
 *
 * Recipient can be a person or a business, and either can have a US or foreign address, but not both
 *
 * ‼️ This is only for recent filings
 */

export interface IrsGrant {
  RecipientPersonNm?: PersonName;
  RecipientBusinessName?: BusinessName;
  RecipientUSAddress?: USAddress;
  RecipientForeignAddress?: ForeignAddress;
  RecipientRelationshipTxt?: string;
  RecipientFoundationStatusTxt?: string;
  GrantOrContributionPurposeTxt?: string;
  Amt: string;
}

/**
 * Grant Application Info
 */

export interface IrsGrantsApplication {
  RecipientPersonNm: PersonName;
  RecipientUSAddress?: USAddress;
  RecipientForeignAddress?: ForeignAddress;
  RecipientPhoneNum: string;
  RecipientEmailAddressTxt: string;
  FormAndInfoAndMaterialsTxt: string;
  SubmissionDeadlinesTxt: string;
  RestrictionsOnAwardsTxt: string;
}

/**
 * Grant misc
 */

export type IrsGrantsToPreselectedOnlyToggle = 'X' | undefined;

export interface IrsGrantsToPreselectedOnly {
  OnlyContriToPreselectedInd: 'X' | undefined;
}

/**
 * Common
 */

type PersonName = string; // 35 character max

interface BusinessName {
  BusinessNameLine1Txt: string; // 75 character max
  BusinessNameLine2Txt?: string; // 75 character max // Function should concatenate line1 and line2 for most, but it first check to see if line1 is included in line 2 (Line1 is often a short name, with line2 containing the full name). In this case, choose line2
}

export interface USAddress {
  AddressLine1Txt: string;
  AddressLine2Txt?: string;
  CityNm: string;
  StateAbbreviationCd: string;
  ZIPCd: string;
}

export interface ForeignAddress {
  AddressLine1Txt: string;
  AddressLine2Txt?: string;
  CityNm?: string;
  ProvinceOrStateNm?: string;
  CountryCd: string;
  ForeignPostalCd?: string;
}
