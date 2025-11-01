import {
  UserGroup,
  MagnifyingGlassCircle,
  Gift,
  BookOpen,
  ClipboardDocumentCheck,
  Server,
  ChartBar,
  ClipboardDocumentList,
  CurrencyDollar,
  Users,
} from 'svelte-heros-v2';
import type { SecondaryNavItems } from './index.js';

export const profileNavItems: SecondaryNavItems[] = [
  {
    title: 'People',
    id: 'people',
    link: '#people',
    icon: Users,
  },
  {
    title: 'Grants',
    id: 'grants',
    link: '#grants',
    icon: CurrencyDollar,
  },
  {
    title: 'Guidelines',
    id: 'guidelines',
    link: '#guidelines', // This is '#application-info' on legacy profiles
    icon: ClipboardDocumentList,
  },
  {
    title: 'Financials',
    id: 'financials',
    link: '#financials',
    icon: ChartBar,
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
    description: 'With a budget of just $200 per year, the site was architected to last forever.',
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
    description: 'Results as you type. No submit button, no waiting. Just search.',
    icon: MagnifyingGlassCircle,
  },
];
