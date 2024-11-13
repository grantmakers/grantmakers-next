import type { Person } from '@repo/shared/typings/grantmakers/all';
const convertToCapitalCase = (str: string): string => {
  /**
   * Capitalize non-profit specific words
   * fka: Formerly known as
   * fbo: For the benefit of
   * dba: Doing business as
   * llc: Limited liability company
   * llp: Limited liability partnership
   * tr: Trust
   * uw: Under will
   * u-w: Under will
   * tuw: Trust under will
   * ua: Under agreement
   * ir: Irrevocable
   * ta: Trust agreement
   * ttee: Trustee
   * ii: Roman numeral
   * Pf: Private foundation or Permanent Fund
   */
  // TODO Handle "U/a/d"
  // prettier-ignore
  const specialWords = [
    "fka",
    "fbo",
    "dba",
    "ii",
    "llc",
    "llp",
    "pf",
    "ta",
    "ttee",
    "tr",
    "tua",
    "tuw",
    "ua",
    "uw",
    "u-w",
  ];

  // Function to handle special word capitalization
  function capitalizeSpecialWords(word: string) {
    return specialWords.includes(word.toLowerCase()) ? word.toUpperCase() : capitalizeFirstLetter(word);
  }

  // Function to capitalize the first letter of a word
  function capitalizeFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  // Function to capitalize hyphenated names
  function capitalizeHyphenated(word: string) {
    return word
      .split('-')
      .map((part) => {
        // Check if the part is a special word
        if (specialWords.includes(part.toLowerCase())) {
          return part.toUpperCase();
        }
        return capitalizeFirstLetter(part);
      })
      .join('-');
  }

  // Check if the string is in uppercase
  if (str === str.toUpperCase()) {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => {
        // Handle the 'C/O' case
        if (word.toLowerCase().includes('c/o')) {
          return word;
        }

        // Handle hyphenated names and special words
        if (word.includes('-')) {
          return capitalizeHyphenated(word);
        }

        // Handle non-hyphenated special words and normal words
        return capitalizeSpecialWords(word);
      })
      .join(' ');
  }

  return str;
};

const toTitleCase = (str: string) => {
  if (typeof str === 'string') {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }
  return str;
};

const normalizePerson = (person: Person): Person => {
  if (typeof person.name === 'string') {
    return person;
  } else if ('_' in person.name) {
    return { ...person, name: person.name['_'] };
  } else if ('text' in person.name) {
    return { ...person, name: person.name['text'] };
  } else {
    return { ...person, name: '' }; // Fallback case
  }
};

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

const extractFirstLetter = (organization_name: string): string => {
  if (organization_name.startsWith('The ')) {
    const parts = organization_name.split(' ');
    return parts[1]?.[0] || '';
  }

  return organization_name[0] || '';
};

const upperFirstLetter = (name: string) => extractFirstLetter(name).toUpperCase();

// ESM export
export { convertToCapitalCase, normalizePerson, slugify, toTitleCase, extractFirstLetter, upperFirstLetter };
