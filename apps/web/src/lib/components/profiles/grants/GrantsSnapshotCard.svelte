<script lang="ts">
  import BarGrantsSnapshot from '../charts/BarGrantsSnapshot.svelte';
  import { humanizeCurrency, humanizeNumber } from '@repo/shared/functions/formatters/numbers';
  import { formatTaxYear, formatDateToMonthYear, isOutdatedISOString } from '@repo/shared/functions/formatters/dates';
  import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
  import placeholderImage from '$lib/assets/images/placeholder-no-grants.webp';
  import irsLogo from '$lib/assets/images/irs-logo.webp';
  import Tip from '../alerts/Tip.svelte';

  import ContentBoxHeader from '../ContentBoxHeader.svelte';

  interface Props {
    grantMin: number;
    grantMax: number;
    grantMedian: number;
    grantCount: number;
    grantsFacets: GrantmakersExtractedDataObj['grants_facets'];
    grantsReferenceAttachment: GrantmakersExtractedDataObj['grants_reference_attachment'];
    hasCharitableActivities: boolean;
    taxYear: number;
    lastUpdatedIrs: string;
  }

  let {
    grantMin,
    grantMax,
    grantMedian,
    grantCount,
    grantsFacets,
    grantsReferenceAttachment,
    hasCharitableActivities,
    taxYear,
    lastUpdatedIrs,
  }: Props = $props();

  const negativeGrantMessage = 'Negative grant values may reflect grant returns, adjustments, or modifications to prior disbursements';
</script>

<div class="shadow-soft-xl relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border-0 bg-white bg-clip-border break-words">
  <!-- Header -->
  <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
    <ContentBoxHeader title={'Grants Snapshot'} />
  </div>

  <!-- Top Section: Stats & Tips -->
  <div class="flex flex-col gap-4 p-5">
    <!-- Hero Stats Section (labels below) -->
    <div class="flex items-start justify-around gap-8">
      <!-- Grants Count -->
      <div class="flex flex-col">
        <span class="text-2xl font-medium text-slate-800">
          {humanizeNumber(grantCount)}
        </span>
        <span class="mt-1 text-sm text-slate-500">
          {grantCount === 1 ? 'Grant' : 'Grants'}
        </span>
      </div>

      <!-- Median -->
      {#if grantCount >= 2}
        <div class="flex flex-col">
          <span class="text-2xl font-medium text-slate-800">
            {#if grantCount === 0 || grantCount < 3}
              N/A
            {:else}
              {humanizeCurrency(grantMedian)}
            {/if}
          </span>
          <span class="mt-1 text-sm text-slate-500">Median</span>
        </div>
      {:else if grantCount === 1}
        <div class="flex flex-col">
          <span class="text-2xl font-medium text-slate-800">
            {humanizeCurrency(grantMax)}
          </span>
          <span class="mt-1 text-sm text-slate-500">Amount</span>
        </div>
      {/if}
    </div>

    <!-- Secondary Stat: Range -->
    {#if grantCount > 0}
      <div class="flex justify-center border-t border-slate-200 pt-4 text-sm text-slate-500">
        {#if grantCount === 1}
          Range: {humanizeCurrency(grantMax)}<span class="mx-1">–</span>N/A
        {:else if grantMin < 0}
          Range: <span class="ml-2 font-medium text-slate-900">{humanizeCurrency(grantMin)}*</span><span class="mx-1">–</span>
          <span class="font-medium text-slate-700">{humanizeCurrency(grantMax)}</span>
        {:else}
          Range: <span class="ml-2 font-medium text-slate-700">{humanizeCurrency(grantMin)}</span><span class="mx-1">–</span>
          <span class="font-medium text-slate-700">{humanizeCurrency(grantMax)}</span>
        {/if}
      </div>
    {/if}

    <!-- Tips -->
    {#if grantsReferenceAttachment && grantCount === 1}
      <Tip title="Grantmaking reported as a single grant" message="See the Grants table below for details." includeLogo bg={true} />
    {/if}

    {#if grantMin < 0}
      <Tip message={negativeGrantMessage} includeLogo bg={true} />
    {/if}

    {#if grantCount === 0 && hasCharitableActivities}
      <a href="#charitable-activities" class="mt-2">
        <Tip
          title="See Charitable Activities below"
          message="The foundation appears to directly serve its mission beyond grantmaking."
          includeLogo
        />
      </a>
    {/if}
  </div>

  <!-- Grant Clusters Section / Placeholder -->
  {#if grantCount > 0}
    <div class="border-t border-slate-200 bg-slate-50 px-5 py-4">
      {#if grantsFacets && grantsFacets[0].grant_count > 0}
        <div class="hidden sm:block">
          <h2 class="mb-2 text-xs font-semibold tracking-wider text-slate-900 uppercase">Grant Clusters</h2>
          <div class="w-full min-w-0">
            <BarGrantsSnapshot rawData={grantsFacets[0].facets.amount} {grantCount} />
          </div>
        </div>
      {:else}
        <div class="mt-4 opacity-30">
          <img src={placeholderImage} alt="Grant Chart Placeholder" width={400} height={400} class="rounded-lg opacity-90" />
        </div>
        <p class="text-center text-slate-500">No grants listed</p>
      {/if}
    </div>
  {/if}

  <!-- Data Source Footer Band -->
  <div
    class="flex items-end justify-between gap-3 border-t border-slate-200 px-5 py-3 {isOutdatedISOString(lastUpdatedIrs) ? 'bg-yellow-50'
    : ''}"
  >
    <div class="flex flex-col">
      <div class="flex items-center gap-2 text-sm font-medium text-slate-700">IRS Form 990-PF</div>
      <div class="flex items-center gap-1 text-xs text-slate-500">
        Tax Year {formatTaxYear(taxYear)} · Published {formatDateToMonthYear(lastUpdatedIrs) ?? 'N/A'}
      </div>
    </div>
    {#if isOutdatedISOString(lastUpdatedIrs)}
      <div class="hidden flex-1 text-right text-xs text-slate-500 sm:block">
        The latest available tax filing was published over a year ago, {formatDateToMonthYear(lastUpdatedIrs) ?? 'N/A'}
      </div>
    {:else}
      <img src={irsLogo} alt="IRS logo" class="max-h-6 w-auto" height={24} width={48} />
    {/if}
  </div>
</div>
