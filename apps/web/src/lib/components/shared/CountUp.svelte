<!-- Source: https://github.com/saadeghi/svelte-countup/blob/master/src/Component.svelte -->

<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import { inview } from 'svelte-inview';

  let isInView = $state();

  interface Props {
    value: number;
    initial?: number;
    duration?: number;
    step?: number;
    roundto?: number;
    format?: boolean;
  }

  /**
   * Svelte can't infer props when using let props = $props(), aka non-destructured.
   * This matters only for custom elements/web components, which we do not use.
   * It's safe to ignore the warning
   */
  // eslint-disable-next-line svelte/valid-compile
  let props: Props = $props();

  let initial = $derived(props.initial ?? 0);
  let duration = $derived(props.duration ?? 3000);
  let step = $derived(props.step ?? 1);
  let roundto = $derived(props.roundto ?? 1);
  let format = $derived(props.format ?? true);
  let value = $derived(props.value);

  function formatNumber(input) {
    if (format) {
      return Math.round(input).toLocaleString();
    }
    return input;
  }

  let counter = $state(props.initial ?? 0);

  const max = $derived(parseInt(value.toString()));

  let currentStep = $state(props.step ?? 1);

  $effect(() => {
    let s = step;
    let init = initial;
    let dur = duration;
    let m = max;

    // Safety check for infinite loop potential if params are weird
    if (m - init === 0) return;

    while (dur / ((m - init) / s) < 2) {
      s++;
    }
    currentStep = s;
  });

  $effect(() => {
    if (!isInView) return;

    const timer = setInterval(
      () => {
        if (counter <= max) {
          counter += currentStep;
        } else {
          clearInterval(timer);
          counter = Math.round(max / roundto) * roundto;
        }
      },
      duration / ((max - initial) / currentStep),
    );

    return () => clearInterval(timer);
  });
</script>

<span
  use:inview
  oninview_change={(event) => {
    const { inView } = event.detail;
    isInView = inView;
  }}>{formatNumber(counter)}</span
>
