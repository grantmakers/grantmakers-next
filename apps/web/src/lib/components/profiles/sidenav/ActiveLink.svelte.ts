// ActiveLink.svelte
let activeSection = $state('overview');
let isClickNavigation = $state(false);

export function getActiveSection() {
  return activeSection;
}

export function setActiveSection(newSection: string, fromClick = false) {
  if (fromClick) {
    // Suppress scrollspy when nav clicked
    isClickNavigation = true;
    activeSection = newSection;
    setTimeout(() => {
      isClickNavigation = false;
    }, 1000);
  } else if (!isClickNavigation) {
    activeSection = newSection;
  }
}
