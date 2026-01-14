import { Grant, GrantInCollection } from '@repo/shared/typings/grantmakers/all';
type NormalizedGrant = Omit<
  GrantInCollection,
  | '_id'
  | 'objectID'
  | 'ein'
  | 'last_updated_grantmakers'
  | 'last_updated_irs'
  | 'organization_name'
  | 'city'
  | 'state'
  | 'grant_number'
  | 'grantee_state_displayed'
  | 'grants_to_preselected_only'
  | 'foundation_is_likely_inactive'
>;
export function remapGrants(grants: Grant[]): NormalizedGrant[] {
  if (!grants) return [];
  return grants.map((grant) => ({
    tax_year: grant.tax_year,
    grantee_name: grant.name,
    grantee_city: grant.city,
    grantee_state: grant.state,
    grantee_country: grant.country,
    grantee_is_foreign: grant.is_foreign,
    grant_amount: grant.amount,
    grant_purpose: grant.purpose,
  }));
}
