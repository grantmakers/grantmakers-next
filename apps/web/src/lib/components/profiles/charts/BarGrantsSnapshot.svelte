<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Chart } from 'chart.js';

  let { rawData, grantCount }: { rawData: RawData; grantCount: number } = $props();

  type RawData = {
    [key: string]: number;
  };

  interface GrantRange {
    range: string;
    count: number;
    min: number;
    max: number;
    displayRange: string;
  }

  interface TicksConfig {
    stepSize?: number;
    maxTicksLimit: number;
  }

  const ticksConfig: TicksConfig = {
    stepSize: 1,
    maxTicksLimit: 5,
  };
  // Chart.js will generate an unlimited amount of ticks if stepSize set to 1
  // Causes a performance hit, and a console warning, when the number of ticks is over 1k
  if (grantCount > 5) {
    delete ticksConfig.stepSize;
  }

  function prepareAndReduceChartData(rawData: RawData): GrantRange[] {
    const consolidatedData: { [range: string]: number } = {
      '<$500': 0,
      '$500-$5k': 0,
      '$5k-$25k': 0,
      '$25k-$100k': 0,
      '$100k-$500k': 0,
      '$500k+': 0,
    };

    for (const [range, count] of Object.entries(rawData)) {
      const [minStr, maxStr] = range.split(' - ');
      const min = parseInt(minStr);
      const max = maxStr === 'Infinity' ? Infinity : parseInt(maxStr);

      if (max < 500) {
        consolidatedData['<$500'] += count;
      } else if (min >= 500 && max <= 4999) {
        consolidatedData['$500-$5k'] += count;
      } else if (min >= 5000 && max <= 24999) {
        consolidatedData['$5k-$25k'] += count;
      } else if (min >= 25000 && max <= 99999) {
        consolidatedData['$25k-$100k'] += count;
      } else if (min >= 100000 && max <= 499999) {
        consolidatedData['$100k-$500k'] += count;
      } else if (min >= 500000) {
        consolidatedData['$500k+'] += count;
      }
    }

    const processedData: GrantRange[] = Object.entries(consolidatedData).map(([displayRange, count]) => {
      let min: number, max: number;
      switch (displayRange) {
        case '<$500':
          min = 0;
          max = 500;
          break;
        case '$500-$5k':
          min = 500;
          max = 4999;
          break;
        case '$5k-$25k':
          min = 5000;
          max = 24999;
          break;
        case '$25k-$100k':
          min = 25000;
          max = 99999;
          break;
        case '$100k-$500k':
          min = 100000;
          max = 499999;
          break;
        case '$500k+':
          min = 500000;
          max = Infinity;
          break;
        default:
          min = 0;
          max = Infinity;
      }

      return { range: `${min} - ${max === Infinity ? 'Infinity' : max}`, count, min, max, displayRange };
    });

    processedData.sort((a, b) => b.min - a.min);
    return processedData;
  }

  let chartCanvas: HTMLCanvasElement | undefined = $state();
  let chart: Chart;

  const data = prepareAndReduceChartData(rawData);

  onMount(async () => {
    if (!chartCanvas) return;

    const ctx = chartCanvas.getContext('2d');
    if (!ctx) return;

    const { Chart, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } = await import('chart.js');
    Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const colorPalette = ['#c54e00', '#e65c00', '#607d8b', '#7891a1', '#009688', '#00b3a1'];

    const getColorForRange = (range: string) => {
      if (range.includes('$500k+')) return colorPalette[0];
      if (range.includes('$100k-$500k')) return colorPalette[1];
      if (range.includes('$25k-$100k')) return colorPalette[2];
      if (range.includes('$5k-$25k')) return colorPalette[3];
      if (range.includes('$500-$5k')) return colorPalette[4];
      return colorPalette[5];
    };

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((d: GrantRange) => d.displayRange),
        datasets: [
          {
            // label: 'Amount Clusters',
            data: data.map((d) => d.count),
            backgroundColor: data.map((d) => getColorForRange(d.displayRange)),
            borderColor: data.map((d) => getColorForRange(d.displayRange)),
            borderWidth: 1,
            barThickness: 26,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        aspectRatio: 0.8,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: '# of Grants',
            },
            grid: {
              display: false,
            },
            ticks: ticksConfig,
          },
          y: {
            position: 'left',
          },
        },
        plugins: {
          title: {
            display: false,
            text: 'Grant Ranges',
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.formattedValue} grants`;
              },
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

<div class="relative max-h-[350px] min-h-[300px] w-full">
  <canvas bind:this={chartCanvas}></canvas>
</div>
