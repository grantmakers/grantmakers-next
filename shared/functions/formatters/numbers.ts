/**
 * Utilities for formatting numbers
 *
 * Usage examples
 * const number = 1000000
 * console.log(formatNumber(number))        // Outputs: 1,000,000
 * console.log(formatToCurrency(number))    // Outputs: $1,000,000.00
 * console.log(humanizeNumber(number))      // Outputs: 1M
 * console.log(humanizeCurrency(number))    // Outputs: $1M
 */

// Focusing exclusively on the US for now
// Can add in dynamic locales and currency in the future if ever needed
const LOCALE = 'en-US';
const CURRENCY = 'USD';

// Define the formatters outside the functions so they can be re-used
// Creates the new formatter once, reuse many
const numberFormatter = new Intl.NumberFormat(LOCALE);

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const humanReadableFormatter = new Intl.NumberFormat(LOCALE, {
  notation: 'compact',
  compactDisplay: 'short',
});

export function formatEin(string: string): string {
  return string.replace(/(\d{2})/, '$1-');
}

export function formatNumber(num: number): string {
  return numberFormatter.format(num);
}

export function formatToCurrency(num: number): string {
  return currencyFormatter.format(num);
}

export function formatPercentage(num: number): string {
  return percentageFormatter.format(num);
}

export function humanizeNumber(num: number): string {
  return humanReadableFormatter.format(num);
}

export function humanizeCurrency(num: number): string {
  const currencySymbol = currencyFormatter.format(0).charAt(0);
  return currencySymbol + humanReadableFormatter.format(num);
}
