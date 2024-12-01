export const menuState = $state({
  isMobileMenuOpen: false,
  isProfileMenuOpen: false,
});

export const elementRefs = $state({
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
    elementRefs.profileButton &&
    elementRefs.profileMenu &&
    !elementRefs.profileButton.contains(event.target as Node) &&
    !elementRefs.profileMenu.contains(event.target as Node)
  ) {
    menuState.isProfileMenuOpen = false;
  }

  // Handle mobile menu
  if (
    elementRefs.mobileMenuButton &&
    elementRefs.mobileMenu &&
    !elementRefs.mobileMenuButton.contains(event.target as Node) &&
    !elementRefs.mobileMenu.contains(event.target as Node)
  ) {
    menuState.isMobileMenuOpen = false;
  }
}
