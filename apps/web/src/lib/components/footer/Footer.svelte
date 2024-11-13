<script lang="ts">
  import LogoMark from '../shared/LogoMark.svelte';
  import { footerNavigation } from '@utils/trustedConstants';
  import { Heart } from 'svelte-heros-v2';
  import PrivacyPolicy from './PrivacyPolicy.svelte';
  import Divider from '../shared/Divider.svelte';
</script>

<footer class="relative m-auto h-full bg-gray-900" aria-labelledby="footer-heading">
  <Divider borderColorClass="border-slate-800" />
  <h2 id="footer-heading" class="sr-only">Footer</h2>
  <div class="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
    <div class="xl:grid xl:grid-cols-3 xl:gap-8">
      <LogoMark isFooter={true} />
      <div class="mt-16 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
        <div class="md:grid md:grid-cols-3 md:gap-8">
          <div>
            <div class="font-semibold leading-6 text-white">The Project</div>
            <!-- a11y Explanation: This is helpful in the context of a mobile menu as part of a slide-out -->
            <!-- eslint-disable-next-line jsx-a11y/no-redundant-roles -->
            <ul role="list" class="mt-6 space-y-4">
              {#each footerNavigation.project as item}
                <li>
                  <a href={item.href} class="leading-6 text-gray-300 hover:text-white">
                    {item.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>

          <div class="mt-10 md:mt-0">
            <div>
              <div class="font-semibold leading-6 text-white">Get Involved</div>
              <ul class="mt-6 space-y-4">
                {#each footerNavigation.getInvolved as item}
                  <li>
                    <a href={item.href} class="leading-6 text-gray-300 hover:text-white">
                      {item.name}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          </div>

          <div class="mt-10 md:mt-0">
            <div>
              <div class="font-semibold leading-6 text-white">Search</div>
              <ul class="mt-6 space-y-4">
                {#each footerNavigation.search as item}
                  <li>
                    <a href={item.href} class="leading-6 text-gray-300 hover:text-white">
                      {item.name}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="gap-4 text-slate-200">
    <div class="mx-auto max-w-7xl">
      <Divider borderColorClass="border-slate-800" />
    </div>
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:py-8 lg:px-8 lg:py-6">
      <div class="w-full text-sm uppercase md:inline-block md:w-fit"><a href="mailto:feedback@grantmakers.io">Feedback</a></div>
      <div class="hidden h-4 w-5 md:inline-block">
        <a href="https://github.com/grantmakers" target="_blank" rel="noopener noreferrer" aria-label="Github"
          ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 96"
            ><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
              fill="#fff"
            /></svg
          ></a
        >
      </div>
      <div>
        Built with <Heart class="inline size-5 text-red-700" variation="solid" /> and
        <span class="inline size-5 text-amber-800"
          ><svg xmlns="http://www.w3.org/2000/svg" class="inline size-5 text-amber-800" viewBox="0 0 640 512"
            ><path
              fill="currentColor"
              d="M96 64c0-17.7 14.3-32 32-32H448h64c70.7 0 128 57.3 128 128s-57.3 128-128 128H480c0 53-43 96-96 96H192c-53 0-96-43-96-96V64zM480 224h32c35.3 0 64-28.7 64-64s-28.7-64-64-64H480V224zM32 416H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
            /></svg
          ></span
        > by Chad Kruse
      </div>
    </div>
  </div>
  <div class="flex items-center justify-between gap-4 bg-black px-4 py-2 lg:px-6">
    <div class="hidden text-sm text-gray-300 lg:flex">
      All content is licensed under a&nbsp;<a href="http://creativecommons.org/licenses/by-sa/4.0/"
        >Creative Commons Attribution-ShareAlike 4.0 International License</a
      >, except Grantmakers.io logo (all rights reserved Chad Kruse)
    </div>
    <ul class="flex items-center gap-6">
      {#each footerNavigation.legal as item}
        {#if item.name === 'Privacy'}
          <li>
            <PrivacyPolicy />
          </li>
        {:else}
          <li>
            <a href={item.href} class="text-sm leading-6 text-gray-300 hover:text-white">
              {item.name}
            </a>
          </li>
        {/if}
      {/each}
    </ul>
  </div>
</footer>
