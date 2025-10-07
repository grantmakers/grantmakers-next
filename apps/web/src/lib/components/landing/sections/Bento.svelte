<script lang="ts">
  import foundationSearchRadial from '$lib/assets/images/bento/foundation-search-radial.webp';
  import grantXml from '$lib/assets/images/bento/search-likeminded-funders.svg';
  import good from '$lib/assets/images/bento/foundation-profiles.webp';
  import better from '$lib/assets/images/bento/search-local-map.webp';
  import best from '$lib/assets/images/bento/donor-list.webp';
</script>

<div class="bg-white py-12 dark:bg-gray-900 sm:py-24">
  <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
    <h2 class="text-base/7 font-semibold tracking-normal text-indigo-600 dark:text-indigo-400">A Digital Public Good</h2>
    <p class="mt-2 max-w-lg text-pretty text-4xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
      Use Open Data to Find Your Next Funder
    </p>
    <div class="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
      <div class="relative lg:col-span-3">
        <div class="absolute inset-0 rounded-lg bg-white dark:bg-gray-800 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]"></div>
        <div
          class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]"
        >
          <div class="p-10 pt-4">
            <h3 class="tracking normal text-sm/4 font-semibold tracking-normal text-grantmakers-orange dark:text-indigo-400">
              Foundation Search
            </h3>
            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">Fast research. No barriers</p>
            <p class="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
              Access any foundation's complete public record in seconds. No barriers, no paywalls—just the data you have a right to. Forever
              free.
            </p>
          </div>
          <img src={foundationSearchRadial} alt="" class="object-top-left h-80 object-contain" />
          <!-- <img
            src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-performance.png"
            alt=""
            class="hidden h-80 object-cover object-left dark:block"
          /> -->
        </div>
        <div
          class="pointer-events-none absolute inset-0 rounded-lg shadow outline outline-1 outline-black/5 dark:outline-white/15 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]"
        ></div>
      </div>
      <div class="relative lg:col-span-3">
        <div class="absolute inset-0 rounded-lg bg-white dark:bg-gray-800 lg:rounded-tr-[2rem]"></div>
        <div
          class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]"
        >
          <div class="p-10 pt-4">
            <h3 class="tracking normal text-sm/4 font-semibold tracking-normal text-indigo-600 dark:text-indigo-400">Grants Search</h3>
            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">Explore millions of past grants</p>
            <p class="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
              Search the entire public history of foundation giving. This is the raw material for finding funders who believe in your cause.
            </p>
          </div>
          <img src={grantXml} alt="" class="h-80 w-full object-cover object-left" />
          <!-- <img
            src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-releases.png"
            alt=""
            class="hidden h-80 object-cover object-left dark:block lg:object-right"
          /> -->
        </div>
        <div
          class="pointer-events-none absolute inset-0 rounded-lg shadow outline outline-1 outline-black/5 dark:outline-white/15 lg:rounded-tr-[2rem]"
        ></div>
      </div>
      <div class="relative lg:col-span-2">
        <div class="absolute inset-0 rounded-lg bg-white dark:bg-gray-800 lg:rounded-bl-[2rem]"></div>
        <div
          class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]"
        >
          <div class="p-10 pt-4">
            <h3 class="tracking normal text-sm/4 font-semibold tracking-normal text-indigo-600 dark:text-indigo-400">Good</h3>
            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">Get instant clarity</p>
            <p class="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
              A board member mentioned a foundation? Vet them instantly. Your research process should be as fast as your passion.
            </p>
          </div>
          <img src={good} alt="" class="h-80 object-cover object-left" />
          <!-- <img
            src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-speed.png"
            alt=""
            class="hidden h-80 object-cover object-left dark:block"
          /> -->
        </div>
        <div
          class="pointer-events-none absolute inset-0 rounded-lg shadow outline outline-1 outline-black/5 dark:outline-white/15 lg:rounded-bl-[2rem]"
        ></div>
      </div>
      <div class="relative lg:col-span-2">
        <div class="absolute inset-0 rounded-lg bg-white dark:bg-gray-800"></div>
        <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
          <div class="p-10 pt-4">
            <h3 class="tracking normal text-sm/4 font-semibold tracking-normal text-indigo-600 dark:text-indigo-400">Better</h3>
            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">Uncover Local Support</p>
            <p class="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
              They say all philanthropy is local. Use the public data to find foundations that are already invested in your community.
            </p>
          </div>
          <img src={better} alt="" class="h-80 object-cover object-left" />
          <!-- <img
            src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-integrations.png"
            alt=""
            class="hidden h-80 object-cover dark:block"
          /> -->
        </div>
        <div class="pointer-events-none absolute inset-0 rounded-lg shadow outline outline-1 outline-black/5 dark:outline-white/15"></div>
      </div>
      <div class="relative lg:col-span-2">
        <div class="absolute inset-0 rounded-lg bg-white dark:bg-gray-800 max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]"></div>
        <div
          class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]"
        >
          <div class="p-10 pt-4">
            <h3 class="tracking normal text-sm/4 font-semibold tracking-normal text-indigo-600 dark:text-indigo-400">Best</h3>
            <p class="mt-2 text-lg font-medium tracking-tight text-gray-950 dark:text-white">Build a List of True Believers.</p>
            <p class="mt-2 max-w-lg text-sm/6 text-gray-600 dark:text-gray-400">
              This is where the data shines. Find foundations that share your vision by seeing who funds your peers.
            </p>
          </div>
          <img src={best} alt="" class="h-80 object-cover object-left-top" />
          <!-- <img
            src="https://tailwindcss.com/plus-assets/img/component-images/dark-bento-01-network.png"
            alt=""
            class="hidden h-80 object-cover dark:block"
          /> -->
        </div>
        <div
          class="pointer-events-none absolute inset-0 rounded-lg shadow outline outline-1 outline-black/5 dark:outline-white/15 max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]"
        ></div>
      </div>
    </div>
  </div>
</div>
