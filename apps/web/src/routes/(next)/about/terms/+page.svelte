<script lang="ts">
  import BackToTop from '$lib/components/shared/BackToTop.svelte';
  import Terms from '$lib/components/static/Terms.svelte';
  import placeholder from '$lib/assets/images/placeholder-faq.webp';
</script>

<!-- https://tailwindui.com/components/application-ui/application-shells/stacked -->

<div class="min-h-full">
  <main class="-mt-24 pb-8">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="sr-only">Terms</h1>
      <!-- Main 3 column grid -->
      <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-4 lg:gap-8">
        <!-- Left column -->
        <div class="grid grid-cols-1 gap-4 lg:col-span-3">
          <section aria-labelledby="terms">
            <h2 class="sr-only" id="terms">Terms</h2>
            <div class="overflow-hidden rounded-lg bg-white shadow">
              <div>
                <Terms />
              </div>
            </div>
          </section>
        </div>

        <!-- Right column -->
        <div class="hidden grid-cols-1 gap-4 lg:col-span-1 lg:grid">
          <section aria-labelledby="terms">
            <h2 class="sr-only" id="terms-nav">On this page</h2>
            <div class="overflow-hidden rounded-lg bg-white shadow lg:min-h-60">
              <div class="relative isolate bg-white p-2">
                <img src={placeholder} alt="Terms Placeholder" width={400} height={400} class="rounded-lg opacity-70" />
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
