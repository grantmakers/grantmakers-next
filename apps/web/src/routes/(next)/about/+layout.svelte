<script lang="ts">
  import { refs, menuState, toggleMobileMenu } from '$lib/components/search/menuState.svelte';
  import LogoMark from '$lib/components/shared/LogoMark.svelte';
  import PrimaryNavLink from '$lib/components/nav/PrimaryNavLink.svelte';
  import { aboutLinks } from '@repo/shared/constants/trustedConstants';
  import SecondaryNavLink from '$lib/components/nav/SecondaryNavLink.svelte';
  import PrimaryNavLinkMobile from '$lib/components/nav/PrimaryNavLinkMobile.svelte';
  import SecondaryNavLinkMobile from '$lib/components/nav/SecondaryNavLinkMobile.svelte';
  import Banner from '$src/lib/components/legacy/Banner.svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<Banner />
<div class="min-h-full">
  <header class="bg-slate-900 pb-24 lg:relative lg:isolate lg:overflow-hidden">
    <div class="hidden lg:block">
      <div class="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div
          class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',"
        ></div>
      </div>
    </div>

    <div class="mx-auto max-w-3xl px-4 py-2 sm:px-6 lg:max-w-7xl lg:px-8 lg:py-0">
      <div class="relative flex h-16 items-center justify-center lg:h-fit lg:justify-between">
        <div class="flex items-center">
          <!-- Logo -->
          <div class="absolute left-0 shrink-0 lg:static lg:block">
            <LogoMark isLandingOrFooter />
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <PrimaryNavLink href={'/about/'} title={'About'} />
            </div>
          </div>
        </div>

        <!-- Right section on desktop -->
        <div class="hidden lg:ml-4 lg:flex lg:items-center lg:justify-end">
          <div class="hidden items-center justify-end gap-4 text-white md:flex">
            <div class="group relative flex items-center gap-x-4 rounded-lg p-4 text-sm/6">
              <div class="flex size-11 flex-none items-center justify-center rounded-full bg-grantmakers-orange">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                  <path
                    fill-rule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="flex-auto">
                <a data-sveltekit-reload href="/search/profiles/" class="block text-base text-white">
                  Find a Foundation Profile
                  <span class="absolute inset-0"></span>
                </a>
                <p class="text-base font-semibold text-grantmakers-orange">Foundation Search</p>
              </div>
            </div>
            <div class="group relative flex items-center gap-x-4 rounded-lg p-4 pr-0 text-sm/6">
              <div class="flex size-11 flex-none items-center justify-center rounded-full bg-grantmakers-blue">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                  <path
                    fill-rule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="flex-auto">
                <a data-sveltekit-reload href="/search/grants/" class="block text-base text-white">
                  Search Historical Grants
                  <span class="absolute inset-0"></span>
                </a>
                <p class="text-base font-semibold text-grantmakers-blue">Grants Search</p>
              </div>
            </div>
          </div>
          <!-- Profile dropdown -->
          <div class="relative ml-4 flex flex-auto shrink-0 items-center">
            <!-- <PrimaryNavLink href={'/search/profiles/'} title={'Foundation Profiles'} />
            <PrimaryNavLink href={'/search/grants/'} title={'Historical Grants'} /> -->

            <!-- FEAT: Future preferences -->
            <!-- <div class="ml-4">
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
            </div> -->

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
        <div class="grid grid-cols-1 items-center gap-8">
          <div class="col-span-2">
            <div class="flex justify-between">
              <nav class="flex space-x-4">
                {#each aboutLinks as item}
                  <SecondaryNavLink href={item.link} title={item.title} />
                {/each}
              </nav>
              <div>
                <SecondaryNavLink href="/about/donate/" title="Support Open Data" />
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
                <div class="space-y-1 pb-1 pt-2">
                  <!-- Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" -->
                  <PrimaryNavLinkMobile href={'/search/profiles/'} title={'Foundation Profiles'} />
                  <PrimaryNavLinkMobile href={'/search/grants/'} title={'Historical Grants'} />
                  <PrimaryNavLinkMobile href={'/about/'} title={'About'} />
                </div>
                <div class="mt-3 space-y-1 px-4 pb-3">
                  <!-- Secondary Mobile Nav Links -->
                  <div class="flex justify-between">
                    <div class="space-y-1">
                      {#each aboutLinks as item}
                        <SecondaryNavLinkMobile href={item.link} title={item.title} />
                      {/each}
                      <SecondaryNavLinkMobile href="/about/donate/" title="Support Open Data" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
    <div
      class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 hidden transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] lg:block"
      aria-hidden="true"
    >
      <div
        class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        style="clipPath: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
      ></div>
    </div>
  </header>

  {@render children?.()}

  <!-- Footer inherited from root +layout -->
</div>
