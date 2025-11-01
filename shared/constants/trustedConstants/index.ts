import type { ComponentType, SvelteComponent } from 'svelte';

export interface EachFAQ {
  question: string;
  answer: string;
}

export const datasetStats = {
  profiles: 156049,
  grants: 13704808,
  grants_searchable: 5372457,
};

export const allTimeSearchCount = 11_015_668;

export const meta = {
  defaults: {
    title: 'Grantmakers.io - Unlocking Foundation Research for Nonprofits',
    description: 'Quickly find data on 156,000 grantmaking institutions in the US. A free, open source project.',
  },
  emails: {
    support: 'help@grantmakers.io',
  },
};

export const originLegacy = 'https://legacy.grantmakers.io';
export const originNext = 'https://next.grantmakers.io';
export const originProd = 'https://www.grantmakers.io';

export const profilesVersionLegacy = 'v0';
export const profilesVersionNext = 'v1';
export const profilesVersionProd = 'v0';

export const cutoverDate = new Date('2025-01-18').toISOString().replace(/\.\d{3}Z$/, 'Z');
export const rankTotal = datasetStats.profiles;

export const articleLinks = {
  whyAlgolia: 'https://stories.algolia.com/why-hosted-search-made-sense-for-grantmakers-io-8974f5ed6bd6',
};
export const anecdote =
  'Grantmakers.io is the espresso shot of grants research &ndash; small, powerful, and exactly what you need when you need it most. No login required.';

export type SideNavIds = 'overview' | 'people' | 'grants' | 'guidelines' | 'financials';

export interface SecondaryNavItems {
  title: string;
  id: string;
  link: string;
  icon?: ComponentType<SvelteComponent>;
}

/**
 * Profiles root route e.g /profiles
 */

export const profileRootLinks = [
  {
    title: 'Demo Links',
    id: 'demo-links',
    link: '#demo-links',
  },

  {
    title: 'Popular',
    id: 'popular',
    link: '#popular',
  },
  {
    title: 'Research-Ready 990s',
    id: 'digital-ready-990s',
    link: '#digital-ready-990s',
  },
  {
    title: 'Grantmakers 10k',
    id: 'grantmakers-10k',
    link: '#grantmakers-10k',
  },
  {
    title: 'All Active',
    id: 'all-active',
    link: '#all-active',
  },
  {
    title: 'Search',
    id: 'foundation-search',
    link: '/profiles',
  },
];

export const demoLinks = [
  {
    name: 'Thierer Family Foundation',
    ein: '810718077',
    category: 'Typical',
  },
  {
    name: 'Harnisch Family Foundation',
    ein: '510381959',
    category: 'Typical',
  },
  {
    name: 'Ford Foundation',
    ein: '131684331',
    category: 'Typical',
  },
  {
    name: 'The Clarence E Mulford Trust',
    ein: '010247548',
    category: 'Typical',
  },
  // Unique Orgs
  {
    name: 'Every Org',
    ein: '611913297',
    category: 'Unique Orgs',
  },
  {
    name: 'Expa Org',
    ein: '832856275',
    category: 'Unique Orgs',
  },
  // Direct Activities
  {
    name: 'McArthur Home for Aged People Assoc',
    ein: '010212437',
    category: 'Direct Activities',
  },
  {
    name: 'Plant Memorial Home',
    ein: '010131950',
    category: 'Direct Activities',
  },
  // Edge Cases
  {
    name: 'Margaret A Cargill Foundation (old EIN)',
    ein: '205434405',
    category: 'Edge Cases',
  },
  {
    name: 'Margaret A Cargill Foundation (new EIN)',
    ein: '371758406',
    category: 'Edge Cases',
  },
  {
    name: 'Cape Elizabeth Home',
    ein: '010238086',
    category: 'Edge Cases',
  },
  // Large people array
  {
    name: 'Coastal Virginia Building Industry Association Scholarship Foundation',
    ein: '546057730',
    category: 'Large People Array',
  },
  // See Attached, but high rank
  {
    name: 'Morton-Kelly Charitable Tr',
    ein: '010442078',
    category: 'See Attached',
  },
];

export const aboutLinks = [
  {
    title: 'The Project',
    id: 'about',
    link: '/about/',
  },
  {
    title: 'The Dataset',
    id: 'the-dataset',
    link: '/about/the-dataset/',
  },
  {
    title: 'FAQ',
    id: 'faq',
    link: '/about/faq/',
  },
];

export const faqData: EachFAQ[] = [
  {
    question: 'Where does the data come from?',
    answer:
      'IRS Form 990-PF published in machine-readable format, openly available via <a href="https://www.irs.gov/charities-non-profits/form-990-series-downloads">IRS.gov</a>.',
  },
  {
    question: 'Can profiles be edited or removed?',
    answer:
      'Grantmakers.io has no control over the information provided in the public dataset by the IRS. Any inquiries as to removing information should be made <a href="https://www.irs.gov/e-file-providers/e-file-for-charities-and-non-profits">directly with the IRS</a>.',
  },
  {
    question: "Why can't I find a foundation?",
    answer:
      'Grantmakers.io focuses exclusively on US private foundations, those that file IRS Form 990-PF. Other types of foundations including community foundations, operating foundations, and public foundations are beyond the current scope of the project.',
  },
  {
    question: 'Do you make any changes to the data?',
    answer:
      'All data found on Grantmakers.io is presented exactly as found in the tax filings, with the exception of a very limited number of formatting changes to improve readability. ',
  },
  {
    question: 'Do you exclude any data?',
    answer:
      'Due to the high number of very small grants, two donor-advised-fund providers (Bank of American Charitable Foundation and JPMorgan Chase Foundation) and one now-closed corporate giving program (Amazonsmile Foundation) do not appear on the site.',
  },
  {
    question: 'Why is Grantmakers.io free?',
    answer:
      'The better question is why should it cost anything? The source data is published for free by the IRS. The site is hosted for free by Cloudflare. The search is provided for free by our friends at Algolia. The few direct costs, generally less than a monthly subscription to Netflix, are generously covered by the community.',
  },
];
export const footerNavigation = {
  search: [
    { name: 'Foundation Search', href: '/search/profiles/' },
    { name: 'Grants Search', href: '/search/grants/' },
  ],
  getInvolved: [
    { name: 'Support Open Data', href: '/about/donate/' },
    { name: 'Donate', href: '/about/donate/' },
  ],
  project: [
    { name: 'The 990 Dataset', href: '/about/the-dataset/' },
    { name: 'About', href: '/about/' },
    { name: 'FAQ', href: '/about/faq/' },
  ],
  legal: [
    { name: 'Privacy', href: 'https://www.iubenda.com/privacy-policy/7996402/full-legal' },
    { name: 'Terms', href: '/about/terms/' },
  ],
};
