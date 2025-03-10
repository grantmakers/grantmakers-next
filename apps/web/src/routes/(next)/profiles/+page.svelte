<script lang="ts">
  import { browser } from '$app/environment';
  import Logo from '$lib/components/shared/icons/Logo.svelte';
  import LogoMark from '$lib/components/shared/LogoMark.svelte';
  import ListItem from '$lib/components/profiles/root/ListItem.svelte';
  import PrimaryNavLink from '$lib/components/nav/PrimaryNavLink.svelte';
  import { createTabs } from 'svelte-headlessui';
  import PrimaryNavLinkMobile from '$lib/components/nav/PrimaryNavLinkMobile.svelte';
  import { demoLinks, profileRootLinks } from '@repo/shared/constants/trustedConstants';
  import { menuState, refs, toggleMobileMenu, toggleProfileMenu, handleClickOutside } from '$lib/components/search/menuState.svelte';
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
</script>

<!-- https://tailwindui.com/components/application-ui/application-shells/stacked -->

<svelte:body onclick={handleClickOutside} />

<div id="instantsearch"></div>

<div class="min-h-full">
  <header class="bg-slate-900 pb-24">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="relative flex h-fit items-center justify-center py-5 lg:justify-between">
        <div class="flex items-center">
          <!-- Logo -->
          <div class="absolute left-0 hidden shrink-0 lg:static lg:block">
            <LogoMark isLandingOrFooter />
          </div>
          <div class="absolute left-0 shrink-0 lg:hidden">
            <Logo variation={'title'} />
          </div>
          <!-- Desktop Primary Nav: Left -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <PrimaryNavLink href={'/profiles'} title={'Foundation Profiles'} />
              <PrimaryNavLink href={'/search/grants'} title={'Historical Grants'} />
            </div>
          </div>
        </div>

        <!-- Right section on desktop -->
        <div class="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
          <!-- Desktop Primary Nav: Right -->
          <div class="relative ml-4 flex flex-auto shrink-0 items-center">
            <PrimaryNavLink href={'/about'} title={'About'} />
            <div class="ml-4">
              <!-- User Preferences Menu -->
              <button
                type="button"
                class="relative flex rounded-full bg-white text-sm ring-2 ring-white/20 focus:outline-none focus:ring-white"
                bind:this={refs.profileButton}
                aria-expanded={menuState.isProfileMenuOpen}
                aria-haspopup="true"
                onclick={toggleProfileMenu}
              >
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">Open user menu</span>

                <div class="relative h-8 w-8 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-600">
                  <svg
                    class="absolute -left-1 h-10 w-10 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    ><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg
                  >
                </div>
              </button>
            </div>

            <!--
              Dropdown menu, show/hide based on menu state.

              Entering: ""
                From: ""
                To: ""
              Leaving: "transition ease-in duration-75"
                From: "transform opacity-100 scale-100"
                To: "transform opacity-0 scale-95"
            -->
            {#if menuState.isProfileMenuOpen}
              <div
                class="absolute -right-2 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                <!-- Active: "bg-gray-100 outline-none", Not Active: "" -->
                <a href="#profile" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0"
                  >Recent Searches</a
                >
                <!-- Active: "bg-gray-100 outline-none", Not Active: "" -->
                <a href="#settings" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1"
                  >Watchlist</a
                >
              </div>
            {/if}
          </div>
        </div>

        <!-- Secondary Nav Search -->
        <div class="min-w-0 flex-1 px-12 lg:hidden">
          <div id="searchBox" class="mx-auto w-full max-w-xs">
            <label for="mobile-search" class="sr-only">Foundation Search</label>
            <div class="relative text-white focus-within:text-gray-600">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                  <path
                    fill-rule="evenodd"
                    d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <!-- Secondary Nav Search Box -->
              <input
                id="mobile-search"
                onclick={openSearch}
                class="block w-full rounded-md border-0 bg-white/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm/6"
                placeholder={searchInputPlaceholder}
                type="search"
                name="search"
              />
            </div>
          </div>
        </div>

        <!-- Menu button -->
        <div class="absolute right-0 shrink-0 lg:hidden">
          <!-- Mobile menu button -->
          <button
            type="button"
            bind:this={refs.mobileMenuButton}
            class="relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded={menuState.isMobileMenuOpen}
            onclick={toggleMobileMenu}
          >
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open main menu</span>
            <!-- Menu open: "hidden", Menu closed: "block" -->
            <svg
              class={!menuState.isMobileMenuOpen ? 'block size-6' : 'hidden size-6'}
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <!-- Menu open: "block", Menu closed: "hidden" -->
            <svg
              class={menuState.isMobileMenuOpen ? 'block size-6' : 'hidden size-6'}
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Desktop Page links -->
      <div class="hidden border-t border-white/20 py-5 lg:block">
        <div class="grid grid-cols-3 items-center gap-8">
          <div class="col-span-2">
            <nav use:tabs.list class="flex space-x-4">
              {#each profileRootLinks.slice(0, 1) as item}
                {@const selected = $tabs.selected === item.id}
                <button
                  use:tabs.tab={{ value: item.id }}
                  class="rounded-md border-b-2 px-3 py-2 text-sm font-medium focus:outline-none focus-visible:outline-none {selected ?
                    'cursor-default rounded-none border-white text-white'
                  : 'border-transparent text-indigo-100 hover:bg-white/10'}"
                  aria-current="page">{item.title}</button
                >
              {/each}
            </nav>
          </div>
          <div>
            <div class="mx-auto w-full max-w-md">
              <label for="mobile-search" class="sr-only">Foundation Search</label>
              <div class="relative text-white focus-within:text-gray-600">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                    <path
                      fill-rule="evenodd"
                      d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="desktop-search"
                  onclick={openSearch}
                  class="block w-full rounded-md border-0 bg-white/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm/6"
                  placeholder={searchInputPlaceholder}
                  type="search"
                  name="search"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on mobile menu state. -->
    {#if menuState.isMobileMenuOpen}
      <div bind:this={refs.mobileMenu} class="lg:hidden">
        <!--
        Mobile menu overlay, show/hide based on mobile menu state.

        Entering: "duration-150 ease-out"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "duration-150 ease-in"
          From: "opacity-100"
          To: "opacity-0"
      -->
        <div class="fixed inset-0 z-20 bg-black/25" aria-hidden="true"></div>

        <!--
        Mobile menu, show/hide based on mobile menu state.

        Entering: "duration-150 ease-out"
          From: "opacity-0 scale-95"
          To: "opacity-100 scale-100"
        Leaving: "duration-150 ease-in"
          From: "opacity-100 scale-100"
          To: "opacity-0 scale-95"
      -->
        <div class="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition">
          <div class="divide-y divide-gray-200 rounded-lg bg-white shadow-lg ring-1 ring-black/5">
            <div class="pb-2 pt-3">
              <div class="flex items-center justify-between px-4">
                <div>
                  <LogoMark isLandingOrFooter={false} />
                </div>
                <div class="-mr-2">
                  <button
                    type="button"
                    class="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onclick={toggleMobileMenu}
                  >
                    <span class="absolute -inset-0.5"></span>
                    <span class="sr-only">Close menu</span>
                    <svg
                      class="size-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <!-- Primary Mobile Nav Links -->
              <div class="space-y-1 pb-3 pt-2">
                <!-- Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" -->
                <PrimaryNavLinkMobile href={'/profiles'} title={'Foundation Profiles'} />
                <PrimaryNavLinkMobile href={'/search/grants'} title={'Historical Grants'} />
                <PrimaryNavLinkMobile href={'/about'} title={'About'} />
              </div>
              <div use:tabs.list class="mt-3 space-y-1 border-t border-gray-200 px-1 py-3">
                <div class="p-3 pb-1 text-xs font-semibold uppercase text-slate-500">Foundation Profiles</div>
                <!-- Secondary Mobile Nav Links -->
                {#each profileRootLinks.slice(0, 1) as item}
                  {@const selected = $tabs.selected === item.id}
                  <button
                    use:tabs.tab={{ value: item.id }}
                    onclick={toggleMobileMenu}
                    class="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-800 {(
                      selected
                    ) ?
                      'pointer-events-none cursor-default rounded-none bg-gray-100 text-gray-500'
                    : ''}"
                    aria-current="page">{item.title}</button
                  >
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </header>
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
