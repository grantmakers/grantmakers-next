<script lang="ts">
  interface Props {
    title?: string;
    message: string;
    variation?: 'inline' | 'xs' | undefined;
    align?: 'right' | undefined;
    includeLogo?: boolean;
  }

  let { title = '', message, variation = undefined, align = undefined, includeLogo = false }: Props = $props();
</script>

<div class="rounded-md bg-transparent {variation === 'xs' ? 'p-4 ' : 'p-6 '}{variation === 'xs' ? 'text-xs ' : 'text-sm '}text-slate-700">
  <div class="flex flex-row items-start {align === 'right' ? 'justify-end ' : ''}gap-2">
    {#if includeLogo}
      <div class="text-grantmakers-orange">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class:size-5={variation === 'xs'}
          ><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path
            d="M9 18h6"
          /><path d="M10 22h4" /></svg
        >
      </div>
    {/if}
    <div class="flex-inline leading-normal">
      {#if title}
        <span class="mr-1 font-bold">{title}</span>
      {/if}
      <div class="max-w-md">{message}</div>
    </div>
  </div>
</div>
