// TODO Move these to a centralized constants directory
const LOCALE = 'en-US';
const DATE_FORMATTERS = {
  monthYear: new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: 'short',
  }),
  fullDate: new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }),
} as const;

// Algo - the number of months after a tax filing is published by the IRS that it is considered outdated
const DEFAULT_MONTHS_OUTDATED = 14;

export function formatDateToMonthYear(dateString: string): string {
  const date = new Date(dateString);
  return DATE_FORMATTERS.monthYear.format(date);
}

export function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return DATE_FORMATTERS.fullDate.format(date);
}

// TODO Fix malformed EOBMF EIN edge case...will be upstream in ETL
// TODO Fix this upstream - should only send down a number OR a string
export function formatTaxPeriodDate(dateString: string | number): string {
  if (typeof dateString === 'number') {
    dateString = dateString.toString(); // Convert number to string if needed
  }

  if (dateString.length !== 6) {
    throw new Error('Invalid dateString format: yyyymm expected');
  }

  const year = dateString.slice(0, 4);
  const monthIndex = parseInt(dateString.slice(4, 6), 10) - 1; // Convert to zero-based index

  const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (monthIndex < 0 || monthIndex > 11) {
    // EIN 954259961 shows "000000" for eobmf date
    // throw new Error('Invalid month in dateString');
    console.log(`Invalid month in dateString: ${monthIndex}`);
  }

  const month = monthAbbreviations[monthIndex];

  return `${month} ${year}`;
}

export function formatTaxYear(dateNum: number) {
  return dateNum.toString();
}

export function isOutdatedYYYmm(yearMonth: string | number, monthsAgoIsOutdated: number = DEFAULT_MONTHS_OUTDATED): boolean {
  // Convert to string if number is provided
  const yearMonthStr = typeof yearMonth === 'number' ? yearMonth.toString() : yearMonth;

  // Convert YYYYMM to YYYY-MM-DD format
  const dateStr = `${yearMonthStr.substring(0, 4)}-${yearMonthStr.substring(4, 6)}-01`;

  // Create dates and compare
  const inputDate = new Date(dateStr);
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgoIsOutdated);

  return inputDate <= cutoffDate;
}

export function isOutdatedISOString(dateString: string, monthsAgoIsOutdated: number = DEFAULT_MONTHS_OUTDATED): boolean {
  const inputDate = new Date(dateString);
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgoIsOutdated);

  return inputDate <= cutoffDate;
}
