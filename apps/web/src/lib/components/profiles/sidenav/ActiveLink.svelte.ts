// With Runes, stores are no longer the preferred method for sharing state across components
// https://svelte.dev/docs/svelte/stores#When-to-use-stores
let activeSection = $state('overview');

export function getActiveSection() {
  return activeSection;
}

export function setActiveSection(newSection: string) {
  activeSection = newSection;
}
