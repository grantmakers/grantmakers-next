/**
 * Utility functions for handling Employer Identification Numbers (EINs)
 */

/**
 * Formats a 9-digit EIN string by adding a hyphen after the second digit
 * @param ein - A 9-digit EIN string or number
 * @returns The formatted EIN string (XX-XXXXXXX) or null if invalid
 */
export function formatEin(ein: string | number): string | null {
  // Convert to string and remove any existing hyphens or spaces
  const cleanEIN = ein.toString().replace(/[-\s]/g, '');

  // Validate that we have exactly 9 digits
  if (!/^\d{9}$/.test(cleanEIN)) {
    return null;
  }

  // Format as XX-XXXXXXX
  return `${cleanEIN.slice(0, 2)}-${cleanEIN.slice(2)}`;
}

/**
 * Strips formatting from an EIN, returning just the 9 digits
 * @param ein - An EIN string in any format
 * @returns A 9-digit string or null if invalid
 */
export function stripEinFormatting(ein: string): string | null {
  // Remove any hyphens or spaces
  const cleanEIN = ein.replace(/[-\s]/g, '');

  // Validate that we have exactly 9 digits
  if (!/^\d{9}$/.test(cleanEIN)) {
    return null;
  }

  return cleanEIN;
}
