<script lang="ts">
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';
  import skeleton from '$lib/assets/images/blank-chart-trends.jpg';
  import { humanizeCurrency } from '@shared/functions/formatters/numbers';
  import { formatFullDate } from '@shared/functions/formatters/dates';
  import type { GrantmakersExtractedDataObj } from '@shared/typings/grantmakers/all';
  import Divider from '$lib/components/shared/Divider.svelte';
  import { ChartBarSquare } from 'svelte-heros-v2';
  import type { Chart } from 'chart.js';

  type Stats = GrantmakersExtractedDataObj['financial_stats'];

  interface Props {
    orgFinancialStats: GrantmakersExtractedDataObj['financial_stats'];
    lastUpdatedByIrs: string;
    formattedTaxPeriodEnd: string;
    chartsColorPrimary?: string;
    chartsColorSecondary?: string;
    chartsColorTertiary?: string;
  }

  let {
    orgFinancialStats,
    lastUpdatedByIrs,
    formattedTaxPeriodEnd,
    chartsColorPrimary = '#607d8b',
    chartsColorSecondary = '#c54e00',
    chartsColorTertiary = '#009688',
  }: Props = $props();

  const assets = orgFinancialStats.map((value: Stats) => value.assets).reverse();
  const distributions = orgFinancialStats.map((value: Stats) => value.distributions).reverse();
  const contributions = orgFinancialStats.map((value: Stats) => value.contributions).reverse();
  const years = orgFinancialStats.map((value: Stats) => value.tax_year).reverse();

  let chartCanvas: HTMLCanvasElement | undefined = $state();
  let chart: Chart;

  async function initializeChart() {
    if (!chartCanvas) return;

    const ctx = chartCanvas.getContext('2d');
    if (!ctx) return;

    const {
      Chart,
      BarController,
      LineController,
      CategoryScale,
      LinearScale,
      BarElement,
      LineElement,
      PointElement,
      Title,
      Tooltip,
      Legend,
    } = await import('chart.js');

    Chart.register(
      BarController,
      LineController,
      CategoryScale,
      LinearScale,
      BarElement,
      LineElement,
      PointElement,
      Title,
      Tooltip,
      Legend,
    );

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Assets EOY',
            borderColor: chartsColorPrimary,
            backgroundColor: chartsColorPrimary,
            data: assets,
            type: 'line',
            fill: false,
          },
          {
            label: 'Distributions',
            backgroundColor: chartsColorSecondary,
            data: distributions,
          },
          {
            label: 'Contributions',
            backgroundColor: chartsColorTertiary,
            data: contributions,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'All Available Tax Filings',
          },
          legend: {
            display: true,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                }).format(context.raw as number);
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                return humanizeCurrency(value as number);
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  onMount(async () => {
    // Only initialize charts if there's enough data
    if (orgFinancialStats && orgFinancialStats.length > 1) {
      initializeChart();
    }
  });

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
</script>

<div class="h-full p-4">
  <div class="flex h-full flex-col items-center gap-4">
    <div class="flex flex-col items-start">
      <dl class="flex w-full flex-row items-center justify-around text-2xl">
        <div class="flex flex-col items-center gap-2 p-2">
          <dt class="flex flex-row items-center gap-1 text-sm leading-normal text-inherit">Tax Filings Available</dt>
          <dd class="text-slate-700">{orgFinancialStats.length}</dd>
        </div>
        <div class="flex flex-col items-center gap-2 p-2">
          <dt class="flex flex-row items-center gap-1 text-sm leading-normal text-inherit">Last Updated by IRS</dt>
          <dd class="text-slate-700">{formatFullDate(lastUpdatedByIrs)}</dd>
        </div>
      </dl>
    </div>
    <Divider />
    {#if orgFinancialStats && orgFinancialStats.length > 1}
      <div class="min-h-full w-full">
        <canvas bind:this={chartCanvas}></canvas>
      </div>
      <Divider />
      <div class="flex w-full justify-end gap-1 text-xs">
        <p>Tax Year {orgFinancialStats[0].tax_year} ended {formattedTaxPeriodEnd ? formattedTaxPeriodEnd : 'N/A'}</p>
      </div>
    {:else}
      <div class="relative h-full grow">
        <img src={skeleton} alt="Financial Overview Placeholder" class="h-full w-full object-cover" />

        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex items-center gap-4 bg-white px-8 py-4 text-slate-600 shadow-xl lg:mx-4">
            <ChartBarSquare variation="solid" class="h-16 w-16 text-slate-500" />
            <p>Trends will appear as more tax filings become available</p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
