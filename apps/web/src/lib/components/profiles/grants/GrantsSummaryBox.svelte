<script lang="ts">
  import HandDrawnBorder from '$lib/components/shared/HandDrawnBorder.svelte';
  import BarGrantsSnapshot from '../charts/BarGrantsSnapshot.svelte';
  import { humanizeCurrency, humanizeNumber } from '@repo/shared/functions/formatters/numbers';
  import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
  import placeholderImage from '$lib/assets/images/placeholder-no-grants.webp';
  import Tip from '../alerts/Tip.svelte';
  import { tooltip } from '$utils/tooltip';

  interface Props {
    grantMin: number;
    grantMax: number;
    grantMedian: number;
    grantCount: number;
    grantsFacets: GrantmakersExtractedDataObj['grants_facets'];
    grantsReferenceAttachment: GrantmakersExtractedDataObj['grants_reference_attachment'];
    hasCharitableActivities: boolean;
  }

  let { grantMin, grantMax, grantMedian, grantCount, grantsFacets, grantsReferenceAttachment, hasCharitableActivities }: Props = $props();

  function getBackgroundClass(median: number, count: number) {
    if (count <= 2) return 'bg-transparent';
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
    if (count <= 2) return 'transparent';
    if (median >= 1000000) return 'grantmakers-orange';
    if (median < 1000) return 'grantmakers-green';
    return 'grantmakers-blue';
  }
</script>

<div class="items-justify flex h-full flex-col gap-2 p-4">
  <!-- Grant Statistics Section -->
  <dl class="flex w-full flex-row items-center justify-around text-2xl">
    <!-- Grant Count -->
    <div class="flex flex-col items-center">
      <dt class="text-sm leading-normal text-inherit">
        {grantCount === 1 ? 'Grant' : 'Grants'}
      </dt>
      <dd class="font-bold text-slate-700">{humanizeNumber(grantCount)}</dd>
    </div>

    <!-- Decorative Divider -->
    <div class="pointer-events-none inset-0 flex items-center justify-center" aria-hidden="true">
      <div class="h-12 border-r border-slate-200"></div>
    </div>

    {#if grantCount >= 2}
      <!-- Median Grant Amount -->
      <div class="flex flex-col items-center">
        <HandDrawnBorder fill={`fill-${getHandDrawnClass(grantMedian, grantCount)}`}>
          <div class="relative z-10 flex flex-col items-center rounded-full {getBackgroundClass(grantMedian, grantCount)} p-6">
            <dt class="text-sm leading-normal text-inherit">Median</dt>
            <dd class="{grantCount === 0 || grantCount < 3 ? 'text-lg' : ''} font-bold text-slate-700">
              {#if grantCount === 0 || grantCount < 3}
                N/A
              {:else}
                {humanizeCurrency(grantMedian)}
              {/if}
            </dd>
          </div>
        </HandDrawnBorder>
      </div>

      <!-- Decorative Divider -->
      <div class="pointer-events-none inset-0 flex items-center justify-center" aria-hidden="true">
        <div class="h-12 border-r border-slate-200"></div>
      </div>

      <!-- Grant Range -->
      <div class="flex flex-col items-center">
        <dt class="text-sm leading-normal text-inherit">Range</dt>
        <dd class="text-lg text-slate-700">
          {#if grantCount === 0}
            N/A
          {:else if grantCount === 1}
            {humanizeCurrency(grantMax)} - N/A
          {:else if grantMin < 0}
            {humanizeCurrency(grantMax)}
            &nbsp;-&nbsp;
            <span
              use:tooltip={{ content: 'Negative values may reflect grant returns, adjustments, or modifications to prior disbursements' }}
              >{humanizeCurrency(grantMin)}*</span
            >
          {:else}
            {humanizeCurrency(grantMax)} - {humanizeCurrency(grantMin)}
          {/if}
        </dd>
      </div>
    {:else}
      <div class="flex flex-col items-center">
        <dt class="text-sm leading-normal text-inherit">Amount</dt>
        <dd class="font-bold text-slate-700">{humanizeCurrency(grantMax)}</dd>
      </div>
    {/if}
  </dl>

  {#if grantsReferenceAttachment && grantCount === 1}
    <Tip title="Grantmaking reported as a single grant" message="See the Grants table below for details." includeLogo />
  {/if}

  <!-- Grant Clusters Section -->
  {#if grantCount && grantCount === 0}
    {#if hasCharitableActivities}
      <a href="#charitable-activities" class="mt-4">
        <Tip
          title="See Charitable Activities below"
          message="The foundation appears to directly serve its mission beyond grantmaking."
          includeLogo
        />
      </a>
    {/if}
  {:else if grantsFacets && grantsFacets[0].grant_count > 0}
    <h2 class="mt-4 text-sm font-bold text-slate-700">Grant Clusters</h2>
    <div class="w-full">
      <BarGrantsSnapshot rawData={grantsFacets[0].facets.amount} {grantCount} />
    </div>
  {:else}
    <div class="mt-4 opacity-30">
      <img src={placeholderImage} alt="Grant Chart Placeholder" width={400} height={400} class="rounded-lg opacity-90" />
    </div>
    <p class="text-center">No grants listed</p>
  {/if}
</div>
