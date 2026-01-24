<script lang="ts">
  import { humanizeCurrency, formatNumber } from '@repo/shared/functions/formatters/numbers';
  import { rankTotal as rankTotalConstant } from '@repo/shared/constants/trustedConstants';
  import { badgeStyles } from '$src/lib/utils/badgeStyles';
  import ContentBoxHeader from '../ContentBoxHeader.svelte';

  interface Props {
    rank: number;
    rankTotal: number;
    assets: number;
  }

  let { rank, rankTotal, assets }: Props = $props();

  let latestTotal = $derived(rankTotalConstant > rankTotal ? rankTotalConstant : rankTotal);
  let percentile: number | 'N/A' = $derived(rank !== undefined ? ((latestTotal - rank) / latestTotal) * 100 : 'N/A');

  const getLabel = (pct: number | 'N/A') => {
    if (pct === 'N/A') return 'N/A';
    if (pct >= 99) return 'Top 1%';
    if (pct >= 90) return 'Top 10%';
    if (pct >= 75) return 'Top 25%';
    if (pct >= 50) return 'Top 50%';
    if (pct < 50) return 'Smallest 50%';
    return `Top ${(100 - pct).toFixed(0)}%`;
  };

  const getColorClasses = (pct: number | 'N/A') => {
    if (pct === 'N/A') return badgeStyles.default;
    if (pct >= 99) return badgeStyles.success;
    if (pct >= 90) return badgeStyles.success;
    if (pct >= 75) return badgeStyles.info;
    if (pct >= 50) return badgeStyles.indigo;
    return badgeStyles.default;
  };
</script>

{#if rank !== undefined}
  <div class="shadow-soft-xl relative flex min-w-0 flex-col rounded-2xl border-0 bg-white bg-clip-border break-words">
    <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
      <ContentBoxHeader title={'Ranking'} />
    </div>

    <div class="flex items-end justify-around gap-4 p-5">
      <div class="flex flex-col">
        <span class="text-4xl font-medium text-slate-800">
          {humanizeCurrency(assets)}
        </span>
        <span class="mt-1 text-sm text-slate-500">Assets</span>
      </div>

      <div class="flex flex-col items-end gap-2">
        <div class="{getColorClasses(percentile)} rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset">
          {getLabel(percentile)}
        </div>
        <div class="text-sm text-slate-500">
          Rank <span class="font-semibold text-slate-700">#{formatNumber(rank)}</span> of {formatNumber(latestTotal)}
        </div>
      </div>
    </div>
  </div>
{/if}
