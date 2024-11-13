/**
 * Safely converts XML-encoded ampersands ('&amp;') to literal ampersands ('&')
 * in string data from XML->JSON pipeline. Limited to this specific conversion
 * for security purposes - other entities are intentionally not processed.
 * Consider handling upstream in xml-fast-parser as security allows
 */
export const convertAmpersandEntity = (value: string | null | undefined): string => {
  if (!value) {
    return '';
  }

  return value.replace(/&amp;/gi, '&');
};
