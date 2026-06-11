import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
  return {
    hasSurpriseMeAccess: cookies.get('surprise-me-access') === 'granted',
  };
};
