<script lang="ts">
  import { formatNumber } from '@repo/shared/functions/formatters/numbers';
  interface Props {
    rank: number | undefined;
    total: number;
    classes?: string;
  }

  let { rank, total, classes = '' }: Props = $props();

  let percentile: number | 'N/A' = $derived(rank !== undefined ? ((total - rank) / total) * 100 : 'N/A');

  const getLabel = (pct: number | 'N/A') => {
    if (pct === 'N/A') return 'N/A';
    if (pct <= 50) return '<50% Percentile';
    if (pct >= 99) return 'Top 1%';
    return `Top ${Math.ceil(100 - pct)}%`;
  };

  let getBarColor = (pct: number | 'N/A') => {
    if (pct === 'N/A') return 'bg-yellow-500';
    if (pct >= 90) return 'bg-grantmakers-green';
    if (pct >= 75) return 'bg-grantmakers-blue';
    if (pct >= 50) return 'bg-grantmakers-blue opacity-80';
    if (pct >= 30) return 'bg-grantmakers-blue opacity-50';
    return 'bg-yellow-500';
  };
</script>

{#if rank !== undefined}
  <div class="flex w-full flex-1 flex-col items-center gap-2 sm:gap-3 {classes}">
    <div class="flex w-full items-center justify-between gap-4">
      <!-- Percentile -->
      <div class="flex shrink flex-col gap-1">
        <span class="text-sm font-bold text-slate-700">{getLabel(percentile)}</span>
        <span class="text-xs text-slate-500">Rank</span>
      </div>

      <!-- Bar -->
      <div class="grow">
        <div class="h-2 overflow-hidden rounded-full bg-slate-200">
          <div class="h-full {getBarColor(percentile)} rounded-full transition-all duration-500" style:width="{percentile}%"></div>
        </div>
      </div>

      <!-- Rank - hidden on mobile -->
      <div class="flex shrink flex-col gap-1 text-right">
        <span class="text-sm font-bold text-slate-700">#{formatNumber(rank)}</span>
        <span class="text-xs text-slate-500">of 150,188</span>
      </div>
    </div>
  </div>
{/if}
