<script lang="ts">
  import SummaryBoxHeader from '../SummaryBoxHeader.svelte';
  import { humanizeCurrency } from '@shared/functions/formatters/numbers';
  import PercentileBar from './PercentileBar.svelte';

  interface Props {
    rank: number;
    rankTotal: number;
    assets: number;
  }

  let { rank, rankTotal, assets }: Props = $props();
</script>

<div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
  <SummaryBoxHeader headerText={'Overview'} />
</div>

<div class="flex flex-auto flex-col gap-4 p-4">
  <!-- Core stats -->
  <dl class="grid grid-cols-1 overflow-hidden rounded-lg bg-white p-2">
    <!-- Assets section -->
    <dt class="text-center text-sm leading-normal text-inherit">Assets</dt>
    <dd class="text-center text-2xl font-bold text-slate-700">
      {humanizeCurrency(assets)}
    </dd>
  </dl>
  <PercentileBar {rank} total={rankTotal} classes={'p-2'} />
</div>
