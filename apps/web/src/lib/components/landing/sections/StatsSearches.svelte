<script lang="ts">
  import CountUp from '$lib/components/shared/CountUp.svelte';
  import { allTimeSearchCount } from '@repo/shared/constants/trustedConstants';
  const countInMillions = Math.floor(allTimeSearchCount / 1_000_000);
  const counterEnd = allTimeSearchCount;
  const counterStart = counterEnd - 50000;
</script>

<div class="mx-auto mt-32 max-w-7xl bg-white sm:mt-56 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-2xl text-center">
    <p class="text-base leading-7 font-semibold text-indigo-600">Searches Performed</p>
    <h2 class="mt-2 text-4xl font-bold tracking-tight text-gray-900 tabular-nums sm:text-6xl">
      <CountUp initial={counterStart} value={counterEnd} duration={500} step={1} roundto={1} format={true} />
    </h2>
    <p class="mt-6 text-lg leading-8 text-gray-600">
      Visitors have generated over {countInMillions} million search queries on Grantmakers.io.<br />All for free. No login required.
    </p>
  </div>
</div>
