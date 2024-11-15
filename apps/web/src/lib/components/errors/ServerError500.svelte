<script lang="ts">
  import { invalidate } from '$app/navigation';
  async function refreshPage() {
    // invalidate() refreshes all data for the current page
    await invalidate('app:data');
    // As a fallback, also do a hard refresh if needed
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
</script>

<main class="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
  <div class="text-center">
    <p class="text-base font-semibold text-slate-500">500</p>
    <h1 class="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">Server Error</h1>
    <p class="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">Oof. We've been notified and are working on a fix.</p>
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <button
        onclick={refreshPage}
        class="rounded-md bg-slate-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
        >Refresh the Page</button
      >
      Or, simply wait a few minutes
    </div>
  </div>
</main>
