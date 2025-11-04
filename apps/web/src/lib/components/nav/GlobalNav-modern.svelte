<script lang="ts">
  import '@tailwindplus/elements';
  import { page } from '$app/state';
  import LogoMark from '$lib/components/shared/LogoMark.svelte';
  import PrimaryNavLink from '$lib/components/nav/PrimaryNavLink.svelte';
  import { aboutLinks, type SecondaryNavItems } from '@repo/shared/constants/trustedConstants';
  import { profileNavItems } from '@repo/shared/constants/trustedConstants/withIcons';
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
    if (path.startsWith('/profiles')) {
      return { route: 'profiles', transparentBg: false, showSecondaryNav: true, absolute: true, secondaryNavLinks: profileNavItems };
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
  class="{config?.absolute ? 'absolute inset-x-0 top-0 z-20' : 'relative'} {config?.transparentBg ? 'bg-transparent' : (
    'bg-gradient-to-br from-[#e8ecfc] via-[#ede7f9] to-[#f3e7f9]'
  )} {config?.route === 'about' ? 'pb-24' : ''} lg:relative lg:isolate lg:overflow-hidden"
>
  {#if !config?.transparentBg}
    <!-- Noise texture overlay -->
    <div
      class="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
      aria-hidden="true"
      style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 200 200%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E');"
    ></div>
  {/if}

  <div class="mx-auto max-w-3xl px-6 sm:px-6 lg:max-w-7xl lg:px-8">
    <div class="py-6">
      <div
        class="relative flex items-center justify-center lg:h-fit lg:justify-between {!config?.transparentBg ?
          'rounded-2xl bg-slate-900/95 px-8 py-4 shadow-sm backdrop-blur-sm'
        : ''}"
      >
        <div class="flex items-center py-6 lg:py-0">
          <!-- Logo -->
          <div class="absolute left-0 shrink-0 lg:static lg:block {!config?.transparentBg ? 'lg:relative' : ''}">
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
        <div class="absolute right-0 shrink-0 lg:hidden {!config?.transparentBg ? 'lg:relative' : ''}">
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

    <!-- Desktop Secondary Nav - White Pill Style -->
    {#if config?.showSecondaryNav && config.secondaryNavLinks}
      <div class="hidden pb-8 pt-4 lg:block">
        <!-- White pill container -->
        <div class="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 shadow-lg shadow-black/5">
          {#if config.route === 'profiles' && organizationName}
            <!-- Foundation name - clickable -->
            <a href="/search/profiles/" class="text-[15px] font-semibold text-slate-900 transition-colors hover:text-slate-700">
              {organizationName}
            </a>

            <!-- Chevron separator -->
            <svg viewBox="0 0 20 20" fill="currentColor" class="size-4 shrink-0 text-slate-300" aria-hidden="true">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
              />
            </svg>
          {/if}

          <!-- Nav links -->
          {#each config?.secondaryNavLinks as item, index}
            <a
              href={item.link}
              class="rounded-lg px-3 py-1.5 text-[14px] font-medium
                     text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900"
            >
              {item.title}
            </a>

            <!-- Separator dot between links (not after last one) -->
            {#if index < config.secondaryNavLinks.length - 1}
              <span class="text-xs text-slate-300">•</span>
            {/if}
          {/each}
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
                  <PrimaryNavLinkMobile href={'/search/profiles/'} title={'Foundations'} />
                  <PrimaryNavLinkMobile href={'/search/grants/'} title={'Grants'} />
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
</header>
