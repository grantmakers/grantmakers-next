/**
 * Grants Recipient Object
 *
 * Recipient can be a person or a business, and either can have a US or foreign address, but not both
 * */

export interface IrsGrantOld {
  RecipientPersonName?: PersonName; // 35 character max
  RecipientBusinessName?: BusinessName;
  RecipientUSAddress?: USAddress;
  RecipientForeignAddress?: ForeignAddress;
  RecipientRelationship?: string;
  RecipientFoundationStatus?: string;
  PurposeOfGrantOrContribution?: string;
  Amount: string;
}

/**
 * Grants Application
 */

export interface IrsGrantsApplicationOld {
  RecipientName?: string;
  RecipientUSAddress?: USAddress;
  RecipientForeignAddress?: ForeignAddress;
  RecipientPhoneNumber?: string;
  RecipientEmailAddress?: string;
  FormAndInfoAndMaterials?: string;
  SubmissionDeadlines?: string;
  RestrictionsOnAwards?: string;
}

/**
 * Grant misc
 */

export type IrsGrantsToPreselectedOnlyToggleOld = 'X' | undefined;

export interface IrsGrantsToPreselectedOnlyOld {
  OnlyContributesToPreselected: 'X' | undefined;
}

/**
 * Common
 */
type PersonName = string;

interface BusinessName {
  BusinessNameLine1: string; // 75 character max
  BusinessNameLine2?: string; // 75 character max
}

interface USAddress {
  AddressLine1: string;
  AddressLine2?: string;
  City: string;
  State: string;
  ZIPCode: string;
}

interface ForeignAddress {
  AddressLine1: string;
  AddressLine2?: string;
  City?: string;
  ProvinceOrState?: string;
  Country: string;
  PostalCode?: string;
}
