<!-- Source: https://github.com/saadeghi/svelte-countup/blob/master/src/Component.svelte -->

<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import { inview } from 'svelte-inview';

  // const id = nanoid();
  const id = Symbol();

  let isInView = $state();

  interface Props {
    value: number;
    initial?: number;
    duration?: number;
    step?: number;
    roundto?: number;
    format?: boolean;
  }

  let { value, initial = 0, duration = 3000, step = $bindable(1), roundto = 1, format = true }: Props = $props();

  function formatNumber(input) {
    if (format) {
      return Math.round(input).toLocaleString();
    }
    return input;
  }

  const counterResult = $state([]);
  const timers = [];

  const max = parseInt(value);
  while (duration / ((max - initial) / step) < 2) {
    step++;
  }

  counterResult[id] = initial;
  timers[id] = setInterval(
    () => {
      if (isInView) {
        if (counterResult[id] <= max) {
          counterResult[id] += step;
        } else {
          clearInterval(timers[id]);
          counterResult[id] = Math.round(max / roundto) * roundto;
        }
      }
    },
    duration / ((max - initial) / step),
  );
</script>

<span
  use:inview
  onchange={(event) => {
    const { inView } = event.detail;
    isInView = inView;
  }}>{formatNumber(counterResult[id])}</span
>
