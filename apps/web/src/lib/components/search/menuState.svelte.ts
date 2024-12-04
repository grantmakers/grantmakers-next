export const menuState = $state({
  isMobileMenuOpen: false,
  isProfileMenuOpen: false,
});

export const refs = $state({
  profileButton: null as HTMLButtonElement | null,
  profileMenu: null as HTMLDivElement | null,
  mobileMenuButton: null as HTMLButtonElement | null,
  mobileMenu: null as HTMLDivElement | null,
});

export function toggleMobileMenu() {
  menuState.isMobileMenuOpen = !menuState.isMobileMenuOpen;
}

export function toggleProfileMenu() {
  menuState.isProfileMenuOpen = !menuState.isProfileMenuOpen;
}

export function handleClickOutside(event: MouseEvent) {
  // Handle profile menu
  if (
    refs.profileButton &&
    refs.profileMenu &&
    !refs.profileButton.contains(event.target as Node) &&
    !refs.profileMenu.contains(event.target as Node)
  ) {
    menuState.isProfileMenuOpen = false;
  }

  // Handle mobile menu
  if (
    refs.mobileMenuButton &&
    refs.mobileMenu &&
    !refs.mobileMenuButton.contains(event.target as Node) &&
    !refs.mobileMenu.contains(event.target as Node)
  ) {
    menuState.isMobileMenuOpen = false;
  }
}
