/**
 * Evaluates foundation staffing patterns based on tax return data
 *
 * Considers:
 * - Full-time compensated positions (35+ hrs, $65k+)
 * - Significant part-time roles (20+ hrs, $40k+)
 * - Multiple part-time staff presence (15+ hrs, $20k+)
 * - High-engagement leadership (30+ hrs)
 */
import type { GrantmakersExtractedDataObj } from '../typings/grantmakers/all';

export function isLikelyStaffed(people: GrantmakersExtractedDataObj['people']) {
  let isLikelyStaffed = false;

  // Check for any full-time reasonably-compensated staff as of 2024 norms
  // Underpaid EDs and staff, we see you
  const hasFullTimeStaff = people.some((person) => Number(person.hours) >= 35 && Number(person.compensation) > 65000);

  // Check for significant part-time professional staff
  const hasSignificantPartTime = people.some((person) => Number(person.hours) >= 20 && Number(person.compensation) > 40000);

  // Check for multiple part-time staff - indicates organization
  const partTimeStaffCount = people.filter((person) => Number(person.hours) >= 15 && Number(person.compensation) > 20000).length;

  // Check for unpaid but committed leadership - e.g. active founders/benefactors and family members
  const hasActiveCommitted = people.some((person) => Number(person.hours) >= 30 && Number(person.compensation) <= 20000);

  // Set the flag based on any qualifying condition
  if (hasFullTimeStaff || hasSignificantPartTime || partTimeStaffCount >= 2 || hasActiveCommitted) {
    isLikelyStaffed = true;
  }

  // TODO Return an object including details from above
  return isLikelyStaffed;
}
