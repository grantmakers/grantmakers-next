<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { humanizeCurrency } from '@shared/functions/formatters/numbers';
  import Divider from '$lib/components/shared/Divider.svelte';
  import type { Chart } from 'chart.js';

  export let year1: {
    assets: number;
    distributions: number;
    contributions: number;
  };
  export let orgCurrentTaxYear: string;
  export let formattedTaxPeriodEnd: string;
  export let chartsColorPrimary = '#607d8b';
  export let chartsColorSecondary = '#c54e00';
  export let chartsColorTertiary = '#009688';

  let chartCanvas: HTMLCanvasElement;
  let chart: Chart;

  onMount(async () => {
    if (!chartCanvas) return;

    const ctx = chartCanvas.getContext('2d');
    if (!ctx) return;

    const { Chart, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip } = await import('chart.js');

    Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip);
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Assets EOY', 'Distributions', 'Contributions'],
        datasets: [
          {
            data: [year1.assets, year1.distributions, year1.contributions],
            backgroundColor: [chartsColorPrimary, chartsColorSecondary, chartsColorTertiary],
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Latest Available Tax Filing`,
          },
          legend: {
            display: false,
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
          x: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                return humanizeCurrency(value as number);
              },
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  });

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
</script>

<div class="p-4">
  <div class="flex flex-col gap-4">
    <div class="flex flex-col items-start">
      <dl class="flex w-full flex-row items-center justify-around text-2xl">
        <div class="flex flex-col items-center gap-2 p-2">
          <dt class="flex flex-row items-center gap-1 text-sm leading-normal text-inherit">
            <span class="h-2 w-3 rounded-md bg-grantmakers-blue"></span>
            Assets
          </dt>
          <dd class=" text-slate-700">{humanizeCurrency(year1.assets)}</dd>
        </div>

        <div class="flex flex-col items-center gap-2 p-2">
          <dt class="flex flex-row items-center gap-1 text-sm leading-normal text-inherit">
            <span class="h-2 w-3 rounded-md bg-grantmakers-orange"></span>
            Distributions
          </dt>
          <dd class=" text-slate-700">{humanizeCurrency(year1.distributions)}</dd>
        </div>

        <div class="flex flex-col items-center gap-2 p-2">
          <dt class="flex flex-row items-center gap-1 text-sm leading-normal text-inherit">
            <span class="h-2 w-3 rounded-md bg-grantmakers-green"></span>
            Contributions
          </dt>
          <dd class=" text-slate-700">{humanizeCurrency(year1.contributions)}</dd>
        </div>
      </dl>
    </div>
    <Divider />
    <div class="w-full">
      <canvas bind:this={chartCanvas}></canvas>
    </div>
    <Divider />
    <p class="flex justify-end gap-1 text-xs">
      Tax Year {orgCurrentTaxYear} ended {formattedTaxPeriodEnd ? formattedTaxPeriodEnd : 'N/A'}
    </p>
  </div>
</div>
