<script lang="ts">
  import '@tailwindplus/elements';
  import { page } from '$app/state';
  import LogoMark from '$lib/components/shared/LogoMark.svelte';
  import PrimaryNavLink from '$lib/components/nav/PrimaryNavLink.svelte';
  import { aboutLinks, profileNavItems, type SecondaryNavItems } from '@repo/shared/constants/trustedConstants';
  import SecondaryNavLink from '$lib/components/nav/SecondaryNavLink.svelte';
  import PrimaryNavLinkMobile from '$lib/components/nav/PrimaryNavLinkMobile.svelte';
  import SecondaryNavLinkMobile from '$lib/components/nav/SecondaryNavLinkMobile.svelte';
  import PrimarySearchNavLink from './PrimarySearchNavLink.svelte';

  interface Props {
    organizationName?: string;
  }

  interface NavConfig {
    route?: 'profiles' | 'about' | 'home';
    showSecondaryNav?: boolean;
    transparentBg?: boolean;
    absolute?: boolean; // HACK: This is a temporary prop to support the legacy profile pages
    secondaryNavLinks?: SecondaryNavItems[];
  }

  let { organizationName }: Props = $props();

  let defaultConfig: NavConfig = {
    route: 'home',
    transparentBg: false,
    showSecondaryNav: false,
    absolute: false,
  };
  const path = $derived(page.url.pathname);
  const config = $derived.by(() => {
    if (path.startsWith('/profiles/v0')) {
      return { route: 'profiles', transparentBg: false, showSecondaryNav: false, absolute: true, secondaryNavLinks: [] };
    }
    if (path.startsWith('/profiles/v1')) {
      return { route: 'profiles', transparentBg: false, showSecondaryNav: false, absolute: true, secondaryNavLinks: profileNavItems };
    }
    if (path.startsWith('/about')) {
      return { route: 'about', transparentBg: false, showSecondaryNav: true, absolute: false, secondaryNavLinks: aboutLinks };
    }
    if (path === '/') {
      return { route: 'home', transparentBg: true, showSecondaryNav: false, absolute: true };
    }
    return defaultConfig;
  });
</script>

<header
  class="{config?.absolute ? 'absolute inset-x-0 top-0 z-20' : 'relative'} {config?.transparentBg ? 'bg-transparent' : 'bg-slate-900'} {(
    config?.route === 'about'
  ) ?
    'pb-24'
  : ''} lg:relative lg:isolate lg:overflow-hidden"
>
  {#if !config?.transparentBg}
    <div class="hidden lg:block">
      <div class="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div
          class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',"
        ></div>
      </div>
    </div>
  {/if}

  <div class="mx-auto max-w-3xl px-6 sm:px-6 lg:max-w-7xl lg:px-8">
    <div class="py-6">
      <div class="relative flex items-center justify-center lg:h-fit lg:justify-between">
        <div class="flex items-center py-6 lg:py-0">
          <!-- Logo -->
          <div class="absolute left-0 shrink-0 lg:static lg:block">
            <LogoMark isLandingOrFooter />
          </div>
          {#if config.route !== 'profile'}
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <PrimaryNavLink href={'/about/'} title={'About'} />
                <PrimaryNavLink href={'/about/donate/'} title={'Support Open Data'} />
              </div>
            </div>
          {/if}
        </div>

        <!-- Right section on desktop -->
        <div class="hidden lg:ml-4 lg:flex lg:items-center lg:justify-end">
          <div class="flex items-center gap-6 text-white">
            <PrimarySearchNavLink href={'/search/profiles/'} title={'Foundations'} />
            <PrimarySearchNavLink href={'/search/grants/'} title={'Grants'} />
          </div>
          <!-- <PrimaryNavDropdown /> -->
        </div>

        <!-- Menu button -->
        <div class="absolute right-0 shrink-0 lg:hidden">
          <!-- Mobile menu button -->
          <button
            type="button"
            command="show-modal"
            commandfor="mobile-menu"
            class="relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-indigo-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open main menu</span>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              class="size-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Page links -->
    {#if config?.showSecondaryNav && config.secondaryNavLinks}
      <div class="hidden border-t border-white/20 py-6 lg:block">
        <div class="grid grid-cols-1 items-center gap-8">
          <div class="col-span-2">
            <nav class="flex items-center space-x-4">
              {#if config.route === 'profiles' && organizationName}
                <!-- TODO This should only appear on scroll, when the primary nav disappears -->
                <!-- <div class="absolute left-0 shrink-0 lg:static lg:block">
                <Logo />
              </div>
              <div class="flex items-center text-indigo-400">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  data-slot="icon"
                  aria-hidden="true"
                  class="size-5 shrink-0 text-gray-400 dark:text-gray-500"
                >
                  <path
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="flex items-center gap-6 text-white">
                <PrimarySearchNavLink href={'/search/profiles/'} title={'Foundations'} />
              </div>

              <div class="flex items-center text-indigo-400">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  data-slot="icon"
                  aria-hidden="true"
                  class="size-5 shrink-0 text-gray-400 dark:text-gray-500"
                >
                  <path
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                  />
                </svg>
              </div>
              -->
                <div
                  class="rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-indigo-100 focus:outline-none focus-visible:outline-none"
                  aria-current="page"
                >
                  {organizationName}
                </div>
                <!-- <SecondaryNavLink href={'#'} title={organizationName} /> -->
                <div class="flex items-center text-indigo-400">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    data-slot="icon"
                    aria-hidden="true"
                    class="size-5 shrink-0 text-gray-400 dark:text-gray-500"
                  >
                    <path
                      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                    />
                  </svg>
                </div>
              {/if}

              {#each config?.secondaryNavLinks as item}
                <SecondaryNavLink href={item.link} title={item.title} />
              {/each}
            </nav>
          </div>
        </div>
      </div>
    {/if}

    <!-- Mobile menu -->
    <el-dialog>
      <dialog id="mobile-menu" class="m-0 p-0 backdrop:bg-transparent lg:hidden">
        <el-dialog-backdrop
          class="fixed inset-0 bg-black/25 duration-150 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in"
        ></el-dialog-backdrop>

        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div tabindex="0" class="fixed inset-0 focus:outline focus:outline-0">
          <el-dialog-panel
            class="absolute inset-x-0 top-0 mx-auto w-full max-w-3xl origin-top transform p-2 transition duration-150 data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div
              class="divide-y divide-gray-200 rounded-lg bg-white shadow-lg outline outline-1 outline-black/5 dark:divide-white/10 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
            >
              <div class="pb-2 pt-3">
                <div class="flex items-center justify-between px-4">
                  <div>
                    <LogoMark isLandingOrFooter={false} />
                  </div>
                  <div class="-mr-2">
                    <button
                      type="button"
                      command="close"
                      commandfor="mobile-menu"
                      class="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-white dark:bg-gray-800 dark:hover:bg-white/5 dark:hover:text-white dark:focus-visible:outline-white"
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
          </el-dialog-panel>
        </div>
      </dialog>
    </el-dialog>
  </div>
  {#if !config?.transparentBg}
    <div
      class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 hidden transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] lg:block"
      aria-hidden="true"
    >
      <div
        class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        style="clipPath: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
      ></div>
    </div>
  {/if}
</header>
