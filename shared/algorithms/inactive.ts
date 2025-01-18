/**
 * Extracts month and year components from a fiscal year end date in YYYYMM format.
 *
 * The algorithm efficiently parses fiscal year dates using modulo arithmetic rather than
 * string manipulation, optimizing for both performance and reliability. It handles any
 * valid YYYYMM formatted date (e.g., 202403 for March 2024).
 *
 * Key features:
 * - Year extraction using integer division (YYYYMM / 100)
 * - Month extraction using modulo operator (YYYYMM % 100)
 * - No string conversion or manipulation required
 * - Maintains numerical type for direct use in calculations
 *
 * Usage example:
 * const fyeDate = 202403;  // March 2024
 * const fyeYear = Math.floor(fyeDate / 100);  // 2024
 * const fyeMonth = fyeDate % 100;             // 3
 */

interface Config {
  monthsThreshold: number;
}

const config: Config = {
  monthsThreshold: 36,
};

const calculateMonthsBetween = (fyeDate: number, currentDate: Date): number => {
  const fyeYear = Math.floor(fyeDate / 100);
  const fyeMonth = fyeDate % 100;

  if (fyeDate < 100000 || fyeDate > 999999 || fyeMonth < 1 || fyeMonth > 12) {
    throw new Error('fyeDate is expected to be in IRS tax period format YYYYMM');
  }

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  return (currentYear - fyeYear) * 12 + (currentMonth - fyeMonth);
};

export const isLikelyInactive = (eobmfStatus: boolean, taxPeriod: number): boolean => {
  const monthsSinceFye = calculateMonthsBetween(taxPeriod, new Date());
  if (eobmfStatus === false) {
    if (monthsSinceFye >= config.monthsThreshold) {
      return true;
    }
  }
  return false;
};
