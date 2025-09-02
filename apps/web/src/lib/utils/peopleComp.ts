import { humanizeCurrency } from '@repo/shared/functions/formatters/numbers';
export function formatCompensation(value: number | null | undefined): string {
  // Note: It's important to handle comp of 0 properly. Always show any number
  if (value === null || value === undefined) {
    return 'N/A';
  }
  return humanizeCurrency(value);
}
