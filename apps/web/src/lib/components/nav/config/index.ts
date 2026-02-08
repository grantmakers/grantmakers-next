import { aboutLinks, type SecondaryNavItems, profilesVersionLegacy, profilesVersionNext } from '@repo/shared/constants/trustedConstants';
import { profileNavItems } from '@repo/shared/constants/trustedConstants/withIcons';

export interface NavConfig {
  route: 'profiles' | 'search' | 'about' | 'home';
  transparentBg?: boolean;
  absolute?: boolean;
  showSecondaryNav?: boolean;
  secondaryNavLinks?: SecondaryNavItems[];
  sticky?: boolean;
}

export const defaultConfig: NavConfig = {
  route: 'home',
  transparentBg: false,
  absolute: false,
  showSecondaryNav: false,
};

export function getNavConfig(path: string): NavConfig {
  if (path.startsWith(`/profiles/${profilesVersionLegacy}`)) {
    return {
      route: 'profiles',
      transparentBg: false,
      absolute: false,
      showSecondaryNav: true,
      secondaryNavLinks: profileNavItems,
      sticky: true,
    };
  }
  if (path.startsWith(`/profiles/${profilesVersionNext}`)) {
    return {
      route: 'profiles',
      transparentBg: false,
      absolute: false,
      showSecondaryNav: true,
      secondaryNavLinks: profileNavItems,
      sticky: true,
    };
  }
  if (path.startsWith('/search/')) {
    return { route: 'search', transparentBg: false, absolute: true, showSecondaryNav: false, sticky: false };
  }
  if (path.startsWith('/about')) {
    return { route: 'about', transparentBg: false, absolute: false, showSecondaryNav: true, secondaryNavLinks: aboutLinks, sticky: false };
  }
  if (path === '/') {
    return { route: 'home', transparentBg: true, absolute: true, showSecondaryNav: false, sticky: false };
  }
  return defaultConfig;
}
