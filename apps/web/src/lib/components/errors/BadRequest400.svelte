<script lang="ts">
  import { meta } from '@repo/shared/constants/trustedConstants';
  const linkToHome = '/';
  const linkToSupport = meta.emails.support;
  let { message = '' } = $props();
</script>

<main class="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
  <div class="text-center">
    <p class="text-base font-semibold text-slate-500">400</p>
    <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Bad Request</h1>
    <p class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
      {message ? message : 'You are trying to access a route that does not exist'}
    </p>
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <a
        href={linkToHome}
        class="rounded-md bg-slate-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
        >Go back home</a
      >
      <a href={`mailto:${linkToSupport}`} class="text-sm font-semibold text-gray-900"
        >Contact support <span aria-hidden="true">&rarr;</span></a
      >
    </div>
  </div>
</main>
