<script lang="ts">
  import BackToTop from '$lib/components/shared/BackToTop.svelte';
  import Dataset from '$lib/components/static/Dataset.svelte';
  import { sticky } from '$src/lib/utils/sticky';
</script>

<svelte:head>
  <title>Grantmakers.io - The IRS 990 Dataset</title>
</svelte:head>

<!-- https://tailwindui.com/components/application-ui/application-shells/stacked -->

<div class="min-h-full">
  <main class="relative -mt-24 pb-8">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="sr-only">The Dataset</h1>
      <!-- Main 3 column grid -->
      <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-4 lg:gap-8">
        <!-- Left column -->
        <div class="grid grid-cols-1 gap-4 lg:col-span-3">
          <section aria-labelledby="the-dataset">
            <h2 class="sr-only" id="the-dataset">The Dataset</h2>
            <div class="overflow-hidden rounded-lg bg-white shadow">
              <div>
                <Dataset />
              </div>
            </div>
          </section>
        </div>

        <!-- Right column -->
        <div
          use:sticky={{
            fullWidth: false, // Preserves original width
            placeholder: false,
            minWidth: 280,
          }}
          class="grid grid-cols-1 gap-4 lg:col-span-1"
        >
          <section aria-labelledby="the-dataset">
            <h2 class="sr-only" id="the-dataset-nav">On this page</h2>
            <div class="overflow-hidden rounded-lg bg-white shadow lg:min-h-60">
              <div class="relative isolate bg-white p-8">
                <div class="mx-auto max-w-2xl lg:max-w-4xl">
                  <p class="text-gray-slate text-md font-bold tracking-tight sm:text-xl">On this page</p>
                </div>
                <ul class="flex flex-col gap-2 py-8 font-light text-slate-700">
                  <li><a href="#toc-public-data">Open Data</a></li>
                  <li><a href="#toc-foundations">Private Foundations</a></li>
                  <li><a href="#toc-research">Research & Prospecting</a></li>
                  <li><a href="#toc-updates">Timing of Updates</a></li>
                  <li><a href="#toc-quirks">Content Quirks</a></li>
                  <li><a href="#toc-feedback">Feedback Welcome</a></li>
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
