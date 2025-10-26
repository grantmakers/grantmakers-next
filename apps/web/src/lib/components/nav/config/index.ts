import { aboutLinks, profileNavItems, type SecondaryNavItems } from '@repo/shared/constants/trustedConstants';

export interface NavConfig {
  route: 'profiles' | 'about' | 'home';
  showSecondaryNav?: boolean;
  transparentBg?: boolean;
  absolute?: boolean; // HACK: This is a temporary prop to support the legacy profile pages
  secondaryNavLinks?: SecondaryNavItems[];
}

export const defaultConfig: NavConfig = {
  route: 'home',
  transparentBg: false,
  showSecondaryNav: false,
  absolute: false,
};

export function getNavConfig(path: string): NavConfig {
  if (path.startsWith('/profiles/v0')) {
    return { route: 'profiles', transparentBg: false, showSecondaryNav: false, absolute: true, secondaryNavLinks: profileNavItems };
  }
  if (path.startsWith('/profiles/v1')) {
    return { route: 'profiles', transparentBg: false, showSecondaryNav: false, absolute: true, secondaryNavLinks: profileNavItems };
  }
  if (path.startsWith('/about')) {
    return { route: 'about', transparentBg: false, showSecondaryNav: true, absolute: false, secondaryNavLinks: aboutLinks };
  }
  if (path === '/') {
    return { route: 'home', transparentBg: true, showSecondaryNav: false, absolute: true };
  }
  return defaultConfig;
}
