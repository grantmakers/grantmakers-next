// TODO Fix malformed EOBMF EIN edge case...will be upstream in ETL
// TODO Fix this upstream - should only send down a number OR a string
export function formatDate(dateString: string | number): string {
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
