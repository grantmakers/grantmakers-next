<script lang="ts">
  import CountUp from '$lib/components/shared/CountUp.svelte';
  const counterEnd = 9872958;
  const counterStart = counterEnd - 50000;
</script>

<div class="mx-auto mt-32 max-w-7xl bg-white sm:mt-56 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-2xl text-center">
    <p class="text-base font-semibold leading-7 text-indigo-600">Searches Performed</p>
    <h2 class="mt-2 text-4xl font-bold tabular-nums tracking-tight text-gray-900 sm:text-6xl">
      <CountUp initial={counterStart} value={counterEnd} duration={500} step={1} roundto={1} format={true} />
    </h2>
    <p class="mt-6 text-lg leading-8 text-gray-600">
      Visitors have generated nearly 10 million search queries on Grantmakers.io.<br />All for free. No login required.
    </p>
  </div>
</div>
