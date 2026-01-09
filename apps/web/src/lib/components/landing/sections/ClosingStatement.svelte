<script lang="ts">
  import { inview } from 'svelte-inview';

  let isInView = $state(false);

  const textAnimationInitClasses = 'opacity-0 translate-y-4';
  const textAnimationClasses = 'opacity-100 translate-y-0';
</script>

<div
  use:inview
  oninview_change={(event) => {
    const { inView } = event.detail;
    isInView = inView;
  }}
  class="bg-gray-900"
  data-sveltekit-preload-code="eager"
>
  <div class="relative isolate">
    <div class="absolute inset-x-0 -top-40 -z-10 overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div
        class="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
        style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
      ></div>
    </div>
    <div class="px-6 py-24 sm:py-32 lg:px-8">
      <div class="mx-auto max-w-7xl">
        <div
          class="mx-auto max-w-2xl text-center will-change-scroll {isInView ? textAnimationClasses : (
            textAnimationInitClasses
          )} pointer-events-none duration-500 ease-in-out"
        >
          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl">IRS 990-PF.<br />Plain and Simple.</h1>
          <p class="mt-6 text-lg leading-8 text-gray-300">
            Open, unfettered access to a critical grants information source for nonprofits.
          </p>
        </div>
      </div>
    </div>
    <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
      <div
        class="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75"
        style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
      ></div>
    </div>
  </div>
</div>
