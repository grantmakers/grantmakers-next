import { default as npmSlugify } from 'slugify';

export function slugify(string: string): string {
  const options = {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: true, // slug.replace(/[^A-Za-z0-9\s]/g, '')
    trim: true,
  };

  // Slugify only handles characters, not substrings
  // Thus, need to define a preprocessor to process HTML entities
  // Note: This is now captured upstream in the ETL. Including here to handle legacy edge cases.
  const cleaned = string.replaceAll('&amp;', '&');

  const slug = npmSlugify(cleaned, options);
  console.log(slug);
  return slug;
}
