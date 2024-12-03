<script lang="ts">
  import BackToTop from '$lib/components/shared/BackToTop.svelte';
  import About from '$lib/components/static/About.svelte';
</script>

<!-- https://tailwindui.com/components/application-ui/application-shells/stacked -->

<div class="min-h-full">
  <main class="-mt-24 pb-8">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="sr-only">About</h1>
      <!-- Main 3 column grid -->
      <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-4 lg:gap-8">
        <!-- Left column -->
        <div class="grid grid-cols-1 gap-4 lg:col-span-3">
          <section aria-labelledby="about">
            <h2 class="sr-only" id="about">About</h2>
            <div class="overflow-hidden rounded-lg bg-white shadow">
              <div class="p-6">
                <About />
              </div>
            </div>
          </section>
        </div>

        <!-- Right column -->
        <div class="grid grid-cols-1 gap-4 lg:col-span-1">
          <section aria-labelledby="about">
            <h2 class="sr-only" id="about-nav">On this page</h2>
            <div class="overflow-hidden rounded-lg bg-white shadow lg:min-h-60">
              <div class="relative isolate bg-white p-8">
                <div class="mx-auto max-w-2xl lg:max-w-4xl">
                  <p class="text-gray-slate text-md font-bold tracking-tight sm:text-xl">On this page</p>
                </div>
                <ul class="flex flex-col gap-2 py-8 font-light text-slate-700">
                  <li><a href="#toc-intro">Open access</a></li>
                  <li><a href="#toc-freedom">Free forever</a></li>
                  <li><a href="#toc-transparency">Transparent</a></li>
                  <li><a href="#toc-chad">Meet Chad</a></li>
                </ul>
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
