<script lang="ts">
  import { slide } from 'svelte/transition';

  interface Props {
    isPositive: boolean;
    positiveLabel: string;
    negativeLabel: string;
    description: string;
    explanation: string;
    stat: string;
  }

  let { isPositive, positiveLabel, negativeLabel, description, explanation, stat }: Props = $props();

  let expanded = $state(false);

  const DOT_COLORS = { positive: 'bg-emerald-500', caution: 'bg-amber-500' };
</script>

<div class="space-y-0">
  <div class="group">
    <button
      type="button"
      class="flex w-full items-start justify-between text-left {explanation ? 'cursor-pointer' : 'cursor-default'}"
      onclick={() => explanation && (expanded = !expanded)}
    >
      <div class="flex items-center gap-2">
        <span class="size-2 rounded-full {isPositive ? DOT_COLORS.positive : DOT_COLORS.caution}"></span>
        <span class="font-medium text-slate-900">{isPositive ? positiveLabel : negativeLabel}</span>
      </div>

      {#if explanation}
        <div class="p-1 text-slate-400 transition-colors" aria-label={expanded ? 'Show less' : 'Show more'}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-5 transition-transform duration-200 {expanded ? 'rotate-180' : ''}"
          >
            <path
              fill-rule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      {/if}
    </button>
  </div>

  <button
    type="button"
    class="w-full pr-5 pl-4 text-left text-slate-600 {explanation ? 'cursor-pointer' : 'cursor-default'}"
    onclick={() => explanation && (expanded = !expanded)}
  >
    {description}
  </button>

  {#if expanded}
    <div transition:slide class="space-y-2 pl-4">
      <p class="rounded border border-slate-100 bg-slate-50 p-2 text-sm text-slate-600 italic">
        {explanation}
      </p>
      <p class="text-xs text-slate-600">{stat}</p>
    </div>
  {/if}
</div>
