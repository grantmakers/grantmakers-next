<script lang="ts">
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';
  import skeleton from '$lib/assets/images/blank-chart-trends.jpg';
  import { humanizeCurrency } from '@shared/functions/formatters/numbers';
  import { formatFullDate } from '@shared/functions/formatters/dates';
  import type { GrantmakersExtractedDataObj } from '@shared/typings/grantmakers/grants';
  import Divider from '$lib/components/shared/Divider.svelte';
  import { ChartBarSquare } from 'svelte-heros-v2';
  import type { Chart } from 'chart.js';

  export let orgFinancialStats: GrantmakersExtractedDataObj['financial_stats'];
  export let lastUpdatedByIrs: string;
  export let formattedTaxPeriodEnd: string;

  type Stats = GrantmakersExtractedDataObj['financial_stats'];

  const assets = orgFinancialStats.map((value: Stats) => value.assets).reverse();
  const distributions = orgFinancialStats.map((value: Stats) => value.distributions).reverse();
  const contributions = orgFinancialStats.map((value: Stats) => value.contributions).reverse();
  const years = orgFinancialStats.map((value: Stats) => value.tax_year).reverse();

  export let chartsColorPrimary = '#607d8b';
  export let chartsColorSecondary = '#c54e00';
  export let chartsColorTertiary = '#009688';

  let chartCanvas: HTMLCanvasElement;
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

    Chart.register(BarController, LineController, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

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

  onMount(async() => {
    // Only initialize charts if there's enough data
    if (orgFinancialStats && orgFinancialStats.length > 1) {
      initializeChart();
    }
  });

  onDestroy(() => {
    chart.destroy();
  })
</script>

<div class="p-4 h-full">
  <div class="flex flex-col items-center h-full gap-4">
    <div class="flex flex-col items-start">
      <dl class="text-2xl flex flex-row w-full justify-around items-center">
        <div class="p-2 flex flex-col items-center gap-2">
          <dt class="text-sm leading-normal text-inherit flex flex-row items-center gap-1">Tax Filings Available</dt>
          <dd class="text-slate-700">{orgFinancialStats.length}</dd>
        </div>
        <div class="p-2 flex flex-col items-center gap-2">
          <dt class="text-sm leading-normal text-inherit flex flex-row items-center gap-1">Last Updated by IRS</dt>
          <dd class="text-slate-700">{formatFullDate(lastUpdatedByIrs)}</dd>
        </div>
      </dl>
    </div>
    <Divider />
    {#if orgFinancialStats && orgFinancialStats.length > 1}
      <div class="w-full">
        <canvas bind:this={chartCanvas}></canvas>
      </div>
      <Divider />
      <p class="flex justify-end text-xs gap-1">
        Tax Year {orgFinancialStats[0].tax_year} ended {formattedTaxPeriodEnd ? formattedTaxPeriodEnd : 'N/A'}
      </p>
    {:else}
      <div class="relative h-full grow">
        <img src={skeleton} alt="Financial Overview Placeholder" class="h-full w-full object-cover" />

        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex items-center gap-4 text-slate-600 bg-white lg:mx-4 px-8 py-4 shadow-xl">
            <ChartBarSquare variation="solid" class="h-16 w-16 text-slate-500" />
            <p>Trends will appear as more tax filings become available</p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
