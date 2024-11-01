<script lang="ts">
  import HandDrawnBorder from '$lib/components/shared/HandDrawnBorder.svelte';
  import BarGrantsSnapshot from '../charts/BarGrantsSnapshot.svelte';
  import chartSkeleton from '$lib/assets/images/blank-chart.jpg';
  import { ChartBarSquare } from 'svelte-heros-v2';
  import { humanizeCurrency, humanizeNumber } from '@shared/functions/formatters/numbers';
  import type { GrantmakersExtractedDataObj } from '@shared/typings/grantmakers/grants';

  export let grantMin: number;
  export let grantMax: number;
  export let grantMedian: number;
  export let grantCount: number;
  export let grantsFacets: GrantmakersExtractedDataObj['grants_facets'];

  function getBackgroundClass(median: number) {
    if (median === 0) return 'bg-transparent';
    if (median >= 1000000) return 'bg-orange-50';
    if (median < 10000) return 'bg-teal-50';
    return 'bg-slate-50';
  }

  function getHandDrawnClass(
    median: number,
    count: number,
  ): 'grantmakers-green' | 'grantmakers-blue' | 'grantmakers-orange' | 'transparent' {
    if (median === 0) return 'transparent';
    if (count <= 1) return 'transparent';
    if (median >= 1000000) return 'grantmakers-orange';
    if (median < 1000) return 'grantmakers-green';
    return 'grantmakers-blue';
  }
</script>

<div class="flex h-full flex-col items-start p-4">
  <dl class="flex w-full flex-row items-center justify-around text-2xl">
    <div class="flex flex-col items-center p-2">
      <dd class="font-bold text-slate-700">{humanizeNumber(grantCount)}</dd>
      <dt class="text-sm leading-normal text-inherit">Grants</dt>
    </div>
    <div class="pointer-events-none inset-0 flex items-center justify-center">
      <div class="h-12 border-r border-slate-200"></div>
    </div>

    <HandDrawnBorder fill={`fill-${getHandDrawnClass(grantMedian, grantCount)}`}>
      <div class="relative z-10 flex flex-col items-center rounded-full {getBackgroundClass(grantMedian)} p-6">
        <dd class="font-bold text-slate-700">
          {humanizeCurrency(grantMedian)}
        </dd>
        <dt class="text-sm leading-normal text-inherit">Median</dt>
      </div>
    </HandDrawnBorder>
    <div class="pointer-events-none inset-0 flex items-center justify-center">
      <div class="h-12 border-r border-slate-200"></div>
    </div>
    <div class="flex flex-col items-center p-2">
      <dd class="text-lg text-slate-700">
        {humanizeCurrency(grantMax)} - {humanizeCurrency(grantMin)}
      </dd>
      <dt class="text-sm leading-normal text-inherit">Range</dt>
    </div>
  </dl>
  <div class="mt-4 text-sm font-bold text-slate-700">Grant Clusters</div>
  {#if grantsFacets}
    <BarGrantsSnapshot rawData={grantsFacets[0].facets.amount} />
  {:else if grantCount === 0}
    <div class="object-fit relative h-full">
      <img src={chartSkeleton} alt="Financial Overview Placeholder" class="object-fit h-full w-full" />

      <div class="absolute inset-0 flex items-center justify-center">
        <div class="flex items-center gap-4 bg-white px-8 py-4 text-slate-600 shadow-xl lg:mx-4">
          <ChartBarSquare variation="solid" class="h-16 w-16 text-slate-500" />
          <p>Clusters are provided for foundations with grants</p>
        </div>
      </div>
    </div>
  {:else}
    <p>Clusters not available for this tax year</p>
  {/if}
</div>
