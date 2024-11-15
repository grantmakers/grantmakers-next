<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Chart } from 'chart.js';

  let { rawData }: { rawData: RawData } = $props();

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

  function prepareAndReduceChartData(rawData: RawData): GrantRange[] {
    const consolidatedData: { [range: string]: number } = {
      '<$1k': 0,
      '$1k-$10k': 0,
      '$10k-$100k': 0,
      '$100k-$1M': 0,
      '$1M-$10M': 0,
      '$10M+': 0,
    };

    for (const [range, count] of Object.entries(rawData)) {
      const [minStr, maxStr] = range.split(' - ');
      const min = parseInt(minStr);
      const max = maxStr === 'Infinity' ? Infinity : parseInt(maxStr);

      if (max < 1000) {
        consolidatedData['<$1k'] += count;
      } else if (min >= 1000 && max <= 9999) {
        consolidatedData['$1k-$10k'] += count;
      } else if (min >= 10000 && max <= 99999) {
        consolidatedData['$10k-$100k'] += count;
      } else if (min >= 100000 && max <= 999999) {
        consolidatedData['$100k-$1M'] += count;
      } else if (min >= 1000000 && max <= 9999999) {
        consolidatedData['$1M-$10M'] += count;
      } else if (min >= 10000000) {
        consolidatedData['$10M+'] += count;
      }
    }

    const processedData: GrantRange[] = Object.entries(consolidatedData).map(([displayRange, count]) => {
      let min: number, max: number;
      switch (displayRange) {
        case '<$1k':
          min = 0;
          max = 999;
          break;
        case '$1k-$10k':
          min = 1000;
          max = 9999;
          break;
        case '$10k-$100k':
          min = 10000;
          max = 99999;
          break;
        case '$100k-$1M':
          min = 100000;
          max = 999999;
          break;
        case '$1M-$10M':
          min = 1000000;
          max = 9999999;
          break;
        case '$10M+':
          min = 10000000;
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
      if (range.includes('$10M+')) return colorPalette[0];
      if (range.includes('$1M-$10M')) return colorPalette[1];
      if (range.includes('$100k-$1M')) return colorPalette[2];
      if (range.includes('$10k-$100k')) return colorPalette[3];
      if (range.includes('$1k-$10k')) return colorPalette[4];
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
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        aspectRatio: 0.8,
        maintainAspectRatio: true,
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: '# of Grants',
            },
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

<div class="relative max-h-[450px] min-h-[300px] w-full">
  <canvas bind:this={chartCanvas}></canvas>
</div>
