<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  const linkToHome = '/';
  const linkToAbout = '/about';

  function goBack() {
    if (history.length > 1) {
      history.back();
    } else {
      goto(linkToHome);
    }
  }

  let hasHistory = false;

  onMount(() => {
    hasHistory = history.length > 1;
  });
</script>

<main class="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
  <div class="text-center">
    <!-- <p class="text-base font-semibold text-slate-500">404</p> -->
    <h1 class="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">LOL</h1>
    <p class="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">The mission is to eliminate paywalls</p>
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <button
        onclick={goBack}
        class="rounded-md bg-gray-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
        >{hasHistory ? '← Go Back' : 'Return Home'}</button
      >
      <a href={linkToAbout}>Learn more</a>
    </div>
  </div>
</main>
