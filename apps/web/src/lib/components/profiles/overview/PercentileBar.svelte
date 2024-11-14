<script lang="ts">
  interface Props {
    rank: number;
    total: number;
    classes?: string;
  }

  let { rank, total, classes = '' }: Props = $props();

  let percentile = $derived(((total - rank) / total) * 100);

  const getLabel = (pct: number) => {
    if (pct <= 50) {
      return '<50% Percentile';
    } else if (pct > 99) {
      return 'Top 1%';
    } else {
      return `Top ${(100 - pct).toFixed(0)}%`;
    }
  };

  let getBarColor = (pct: number) => {
    if (pct >= 90) return 'bg-grantmakers-orange';
    if (pct >= 75) return 'bg-grantmakers-blue';
    if (pct >= 50) return 'bg-grantmakers-blue opacity-80';
    return 'bg-grantmakers-green';
  };
</script>

<div class="flex w-full flex-1 flex-col items-center gap-2 sm:gap-3 {classes}">
  <!-- Foundation name - full width on mobile, fixed width on desktop -->
  <!-- <div class="text-center text-sm font-medium">
    <div class="flex">Rank</div>
  </div> -->

  <!-- Percentile and bar container -->
  <div class="flex w-full items-center justify-between gap-2">
    <!-- Percentile -->
    <div class="flex shrink flex-col gap-1">
      <span class="text-sm font-bold text-slate-700">{getLabel(percentile)}</span>
      <span class="text-xs text-slate-500">Rank</span>
    </div>

    <!-- Bar -->
    <div class="grow">
      <div class="h-2 overflow-hidden rounded-full bg-gray-100">
        <div class="h-full {getBarColor(percentile)} rounded-full transition-all duration-500" style:width="{percentile}%"></div>
      </div>
    </div>

    <!-- Rank - hidden on mobile -->
    <div class="hidden w-20 gap-1 text-right md:flex md:shrink md:flex-col">
      <span class="text-sm font-bold text-slate-700">#{rank.toLocaleString()}</span>
      <span class="text-xs text-slate-500">of 150,188</span>
    </div>
  </div>
</div>
