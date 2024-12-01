import {
  UserGroup,
  MagnifyingGlassCircle,
  Gift,
  BookOpen,
  ClipboardDocumentCheck,
  Server,
  ChartBar,
  RectangleGroup,
  ClipboardDocumentList,
  CurrencyDollar,
  Users,
} from 'svelte-heros-v2';
export interface EachFAQ {
  question: string;
  answer: string;
}

export const meta = {
  defaults: {
    title: 'Grantmakers.io - A Community Project',
    description: 'Quickly find data on 150,000 grantmaking institutions in the US. A free, open source project.',
  },
  emails: {
    support: 'help@grantmakers.io',
  },
};

export const hostnameLegacy = 'https://legacy.grantmakers.io';
export const hostnameNext = 'https://next.grantmakers.io';
export const hostnameProd = 'https://www.grantmakers.io';

export const cutoverDate = new Date('2024-12-01').toISOString().replace(/\.\d{3}Z$/, 'Z');

export const articleLinks = {
  whyAlgolia: 'https://stories.algolia.com/why-hosted-search-made-sense-for-grantmakers-io-8974f5ed6bd6',
};
export const anecdote =
  'Grantmakers.io is the espresso shot of grants research &ndash; small, powerful, and exactly what you need when you need it most. No login required.';

export type SideNavIds = 'overview' | 'people' | 'grants' | 'guidelines' | 'financials';

export interface ProfileNavItems {
  title: string;
  icon: typeof ChartBar;
}

export const profileNavItems: ProfileNavItems[] = [
  {
    title: 'Overview',
    icon: RectangleGroup,
  },
  {
    title: 'People',
    icon: Users,
  },
  {
    title: 'Grants',
    icon: CurrencyDollar,
  },
  {
    title: 'Guidelines',
    icon: ClipboardDocumentList,
  },
  {
    title: 'Financials',
    icon: ChartBar,
  },
];

/**
 * Profiles root route e.g /profiles
 */

export const profileRootLinks = [
  {
    title: 'Search',
    id: 'foundation-search',
    link: '/profiles',
  },
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

export const features = [
  {
    name: 'Radical transparency.',
    description: 'A tiny budget but a giant commit to real-time transparency.',
    icon: BookOpen,
  },
  {
    name: 'Forever free.',
    description: 'Fully community supported and forever free. No changes here.',
    icon: Gift,
  },
  {
    name: 'Open source.',
    description: 'Free as in food. Free as in freedom. Fully open source.',
    icon: Server,
  },
  {
    name: 'Decentralized.',
    description: 'No login, no lock up. Your data is yours to move around as you wish.',
    icon: ClipboardDocumentCheck,
  },
  {
    name: 'Community-driven.',
    description: 'Community input and insights shape project goals and direction.',
    icon: UserGroup,
  },
  {
    name: 'The search you deserve.',
    description: 'The same great search experience you know and love.',
    icon: MagnifyingGlassCircle,
  },
];
export const faqData: EachFAQ[] = [
  {
    question: 'How does Grantmakers.io sustain itself?',
    answer:
      "All hard costs are covered by contributions from our community. The technology is architected to minimize maintenance requirements. Algolia's support plays a major role here, as their technology effectively eliminates a full time software engineer. Further, operational aspects requiring humans are simply out of scope of the project - there are no humans tagging grants or creating content. If you require these features, we highly recommend trying out FDO at your local library or Instrumentl if you can afford it.",
  },
  {
    question: "Why don't you publish foundation contact info?",
    answer:
      'We actually do, but only when a foundation explicitly provides this (Part XIV, section 2a of Form 990-PF). We take an ethics-first approach to republishing contact info - e.g. a phone number is only relevant when used for its intended purpose. Consider a small family foundation that explicitly states they do not accept unsolicited applications (Part XIV, section 2 of Form 990-PF). Is it really worth your time to track them down? Maybe, maybe not.',
  },
  {
    question: 'I saw a Grantmakers.io profile appear in [insert news outlet here]. How does that come about?',
    answer:
      "The project started republishing the IRS e-file dataset shortly after the IRS first published it on AWS in 2016. Grantmakers.io's product goal is to facilitate a more efficient path to getting to a go/no-go decision on a foundation prospect. We appreciate the tireless efforts of journalists and watchdog groups in holding public benefit organizations accountable. If you're journalist, watchdog group, or simply a concerned citizen, check out ProPublica's Nonprofit Explorer.",
  },
];
export const footerNavigation = {
  search: [
    { name: 'Profiles Search', href: 'https://www.grantmakers.io/search/profiles/' },
    { name: 'Grants Search', href: 'https://www.grantmakers.io/search/grants/' },
  ],
  getInvolved: [
    { name: 'Support Open Data', href: 'https://www.grantmakers.io/donate/' },
    { name: 'Donate', href: 'https://www.grantmakers.io/donate/' },
  ],
  project: [
    { name: 'The 990 Dataset', href: 'https://www.grantmakers.io/about/the-dataset/' },
    { name: 'About', href: 'https://www.grantmakers.io/about/' },
    { name: 'FAQ', href: 'https://www.grantmakers.io/about/faq/' },
  ],
  legal: [
    { name: 'Privacy', href: 'https://www.iubenda.com/privacy-policy/7996402/full-legal' },
    { name: 'Terms', href: 'https://www.grantmakers.io/terms/' },
  ],
};
