import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 *
 * Uses DOMPurify with a safe configuration that:
 * - Allows basic formatting tags (b, i, strong, em, br, p)
 * - Allows links with safe attributes
 * - Strips all scripts, event handlers, and dangerous content
 *
 * @param dirty - The untrusted HTML string to sanitize
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'strong', 'em', 'br', 'p', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}


