<script lang="ts">
  import BackToTop from '$lib/components/shared/BackToTop.svelte';
  import FAQ from '$lib/components/static/FAQ.svelte';
  import placeholder from '$lib/assets/images/placeholder-faq.webp';
</script>

<!-- https://tailwindui.com/components/application-ui/application-shells/stacked -->

<div class="min-h-full">
  <main class="-mt-24 pb-8">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="sr-only">FAQ</h1>
      <!-- Main 3 column grid -->
      <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-4 lg:gap-8">
        <!-- Left column -->
        <div class="grid grid-cols-1 gap-4 lg:col-span-3">
          <section aria-labelledby="faq">
            <h2 class="sr-only" id="faq">FAQ</h2>
            <div class="overflow-hidden rounded-lg bg-white shadow">
              <div class="p-6">
                <FAQ />
              </div>
            </div>
          </section>
        </div>

        <!-- Right column -->
        <div class="grid grid-cols-1 gap-4 lg:col-span-1">
          <section aria-labelledby="faq">
            <h2 class="sr-only" id="faq-nav">On this page</h2>
            <div class="overflow-hidden rounded-lg bg-white shadow lg:min-h-60">
              <div class="relative isolate bg-white p-2">
                <img src={placeholder} alt="FAQ Placeholder" width={400} height={400} class="rounded-lg opacity-70" />
              </div>
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
