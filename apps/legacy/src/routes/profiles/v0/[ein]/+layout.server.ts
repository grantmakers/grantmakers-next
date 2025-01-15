export function load({ cookies }) {
  return {
    hasSurpriseMeAccess: cookies.get('surprise-me-access') === 'granted',
  };
}
