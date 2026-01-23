
/**
 * Escapes plain text values for safe use in HTML attribute contexts
 *
 * Use this when inserting dynamic values into HTML attributes like data-* attributes.
 * For sanitizing HTML content that will be rendered, use sanitizeHtml() instead.
 *
 * @param value - The plain text value to escape
 * @returns Escaped string safe for use in quoted HTML attributes
 */
export function escapeAttr(value: string | number | null | undefined): string {
  if (value == null) return '';
  return String(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
