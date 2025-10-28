<script lang="ts">
  import { browser } from '$app/environment';
  import BackToTop from '$lib/components/shared/BackToTop.svelte';
  import Donate from '$lib/components/static/Donate.svelte';

  let isLoaded = $state(false);
  function handleLoader() {
    isLoaded = true;
  }
</script>

<svelte:head>
  <title>Grantmakers.io - Support Open Data</title>
  <link rel="preload" href="https://donorbox.org/widget.js" as="script" />
</svelte:head>

{#snippet skeleton()}
  <div
    role="status"
    class="max-w-md animate-pulse space-y-4 divide-y divide-gray-200 rounded-sm border border-gray-200 p-4 shadow-sm md:p-6 dark:divide-gray-700 dark:border-gray-700"
  >
    <div class="rounded-xs h-20 w-full bg-gray-300 dark:bg-gray-700"></div>
    <div class="flex items-center justify-between">
      <div>
        <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div class="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div class="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
      <div>
        <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div class="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div class="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
      <div>
        <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div class="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div class="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
      <div>
        <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div class="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div class="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    </div>
    <div class="flex items-center justify-between pt-4">
      <div>
        <div class="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div class="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div class="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
    </div>
    <span class="sr-only">Loading...</span>
  </div>
{/snippet}

<!-- https://tailwindui.com/components/application-ui/application-shells/stacked -->

<div class="min-h-full">
  <main class="relative -mt-24 pb-8">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="sr-only">Support Open Data</h1>
      <div class="overflow-hidden rounded-lg bg-white shadow">
        <div class="p-6">
          <!-- Main 3 column grid -->
          <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
            <!-- Left column -->
            <div class="lg:col-span-3">
              <section aria-labelledby="support-open-data">
                <h2 class="sr-only" id="support-open-data">Buy Chad a Coffee</h2>
                <div class="overflow-hidden rounded-lg">
                  <div>
                    <Donate />
                  </div>
                </div>
              </section>
            </div>

            <!-- Right column -->
            <div class="lg:col-span-2">
              <section aria-labelledby="faq">
                {#if browser}
                  <!-- @ts-expect-error paypalExpress option is valid DonorBox attribute-->
                  <script src="https://donorbox.org/widget.js" paypalExpress="false"></script>
                  {#if !isLoaded}
                    {@render skeleton()}
                  {/if}
                  <!-- @ts-expect-error seamless attribute is a valid DonorBox attribute-->
                  <iframe
                    onload={handleLoader}
                    class:hidden={!isLoaded}
                    title="Donation form"
                    allowpaymentrequest=""
                    frameborder="0"
                    height="900px"
                    name="donorbox"
                    scrolling="no"
                    seamless="seamless"
                    src="https://donorbox.org/embed/buy-chad-a-coffee"
                    style="max-width: 500px; min-width: 310px; max-height:none!important; border: none !important"
                    width="100%"
                  ></iframe>
                {/if}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <nav aria-label="Back to top navigation">
    <BackToTop />
  </nav>
</div>
