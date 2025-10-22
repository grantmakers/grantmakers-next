<script lang="ts">
  import { browser } from '$app/environment';
  import Logo from '$lib/components/shared/icons/Logo.svelte';
  import LogoMark from '$lib/components/shared/LogoMark.svelte';
  import ListItem from '$lib/components/profiles/root/ListItem.svelte';
  import PrimaryNavLink from '$lib/components/nav/PrimaryNavLink.svelte';
  import { createTabs } from 'svelte-headlessui';
  import PrimaryNavLinkMobile from '$lib/components/nav/PrimaryNavLinkMobile.svelte';
  import { demoLinks, profileRootLinks } from '@repo/shared/constants/trustedConstants';
  import Autocomplete from '$lib/components/search/Autocomplete.svelte';
  import type { AutocompleteInstance } from '@repo/shared/typings/algolia/autocomplete';
  import BackToTop from '$lib/components/shared/BackToTop.svelte';
  import Tip from '$lib/components/profiles/alerts/Tip.svelte';

  const defaultTab = 'demo-links';
  const tabs = createTabs({ selected: defaultTab });
  let activeTitle = $derived.by(() => {
    const target = profileRootLinks.find(({ id }) => id === $tabs.active);
    return target?.title;
  });

  let autocompleteInstance: AutocompleteInstance | null = $state(null);

  function handleAutocompleteInit(instance: AutocompleteInstance) {
    autocompleteInstance = instance;
  }

  let openSearch = () => {
    if (browser) {
      autocompleteInstance?.setIsOpen(true);
    }
  };

  const searchInputPlaceholder = 'Quick search...';

  // Local menu state for this page's navigation
  const menuState = $state({
    isMobileMenuOpen: false,
    isProfileMenuOpen: false,
  });

  const refs = $state({
    profileButton: null as HTMLButtonElement | null,
    profileMenu: null as HTMLDivElement | null,
    mobileMenuButton: null as HTMLButtonElement | null,
    mobileMenu: null as HTMLDivElement | null,
  });

  function toggleMobileMenu() {
    menuState.isMobileMenuOpen = !menuState.isMobileMenuOpen;
  }

  function toggleProfileMenu() {
    menuState.isProfileMenuOpen = !menuState.isProfileMenuOpen;
  }

  function handleClickOutside(event: MouseEvent) {
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
</script>

<!-- https://tailwindui.com/components/application-ui/application-shells/stacked -->

<svelte:body onclick={handleClickOutside} />

<div id="instantsearch"></div>

<div class="min-h-full">
  <main class="relative -mt-24 pb-8">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="sr-only">{activeTitle}</h1>
      <!-- Main 3 column grid -->
      <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
        <!-- Left column -->
        <div class="grid grid-cols-1 gap-4 lg:col-span-2">
          <section use:tabs.panel aria-labelledby="demo-links" class={$tabs.selected === 'demo-links' ? 'block' : 'hidden'}>
            <h2 class="sr-only" id="demo-links">Demo Links</h2>
            <div class="overflow-hidden rounded-lg bg-white shadow">
              <div class="p-6">
                <div class="border-b border-gray-200 pb-8">
                  <div class="max-w-xl">
                    <h1 id="order-history-heading" class="text-3xl font-bold tracking-tight text-gray-900">Demo Links</h1>
                    <p class="mt-2 text-sm text-gray-500">
                      A collection of demo profiles. They cover a diverse spectrum of foundation profiles and are used to ensure the
                      template engine correctly handles edge cases. Community feedback is most welcome!
                    </p>
                  </div>
                </div>
                <ul role="list" class="mx-auto mt-8 max-w-xl divide-y divide-gray-100">
                  {#each demoLinks as link}
                    <ListItem name={link.name} ein={link.ein} category={link.category} />
                  {/each}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <!-- Right column -->
        <div class="grid grid-cols-1 gap-4">
          <section aria-labelledby="section-2-title">
            <h2 class="sr-only" id="section-2-title">Search History</h2>
            <div class="overflow-hidden rounded-lg bg-white shadow lg:min-h-60">
              <div id="our-friends" class="relative isolate bg-white p-6">
                <div class="mx-auto max-w-2xl lg:max-w-4xl">
                  <p class="text-gray-slate text-xl font-bold tracking-tight sm:text-3xl">Grateful for our friends</p>
                  <div id="powered-by" class="mt-6"></div>
                </div>
                <div>
                  <p class="text-normal mx-auto mt-6 max-w-2xl text-left leading-6 text-slate-600">
                    Grantmakers.io deeply appreciates <a
                      class="text-indigo-600 underline decoration-indigo-300"
                      href="https://www.algolia.com/"
                      target="_blank"
                      rel="noopener noreferrer">Algolia's</a
                    > generous ongoing support, powering free, open, searchable access to grants data.
                  </p>
                  <p class="text-normal mx-auto mt-6 max-w-2xl text-left leading-6 text-slate-600">
                    Thank you for helping ensure this critical information remains accessible and transparent for nonprofits that need it
                    most.
                  </p>
                  <p class="text-normal mx-auto mt-6 max-w-2xl text-left leading-6 text-slate-600">On behalf of all changemakers,</p>
                </div>
                <h2 class="mt-2 text-base font-semibold leading-7 text-indigo-600">🙏 Thank You</h2>
              </div>
            </div>
            <div class="px-8">
              <Tip message={'Algolia powers all search functionality on Grantmakers.io'} includeLogo />
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
  <nav aria-label="Back to top navigation">
    <BackToTop />
  </nav>
</div>

<div class="hidden">
  <nav>
    <Autocomplete onAutocompleteInit={handleAutocompleteInit} />
  </nav>
</div>
