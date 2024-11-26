<script lang="ts">
  import HandDrawnBorder from '$lib/components/shared/HandDrawnBorder.svelte';
  import BarGrantsSnapshot from '../charts/BarGrantsSnapshot.svelte';
  import { isLikelyInactive } from '@repo/shared/algorithms/inactive';
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
    taxPeriod: number;
    eobmfStatus: boolean;
  }

  let {
    grantMin,
    grantMax,
    grantMedian,
    grantCount,
    grantsFacets,
    grantsReferenceAttachment,
    hasCharitableActivities,
    taxPeriod,
    eobmfStatus,
  }: Props = $props();

  let isHighlySkewed = $derived((grantMax - grantMedian) / (grantMedian - grantMin) > 3);
  let hideHandDrawn = $derived(isLikelyInactive(eobmfStatus, taxPeriod));
  let highlightMedian = $derived.by(() => {
    if (grantCount === 0 || grantCount < 3) return false;
    if (hideHandDrawn) return false;
    if (isHighlySkewed) return false;
    return true;
  });

  function getHandDrawnClass(
    median: number,
    count: number,
  ): 'grantmakers-green' | 'grantmakers-blue' | 'yellow-500' | 'grantmakers-orange' | 'transparent' {
    if (median === 0) return 'transparent';
    if (median >= 1000000) return 'grantmakers-green';
    if (median < 500) return 'yellow-500';
    if (median < 1000) return 'grantmakers-blue';
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
        <HandDrawnBorder fill={`fill-${getHandDrawnClass(grantMedian, grantCount)}`} show={highlightMedian}>
          <div class="relative z-10 flex flex-col items-center rounded-full p-6">
            <dt class="text-sm leading-normal text-inherit">Median</dt>
            <dd class="text-slate-700 {highlightMedian ? 'font-bold' : 'text-lg'}">
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
          {:else if isHighlySkewed}
            <span class="font-bold">{humanizeCurrency(grantMax)} - {humanizeCurrency(grantMin)}</span>
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
