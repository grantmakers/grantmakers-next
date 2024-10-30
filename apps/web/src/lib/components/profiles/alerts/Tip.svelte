<script lang="ts">
  import Blink from '$lib/components/shared/icons/Blink.svelte';
  // import logo from '$lib/assets/images/logo.svg';
  export let title: string = '';
  export let message: string;
  export let includeLogo: boolean = false;
</script>

<div class="p-6 rounded-md text-slate-700 bg-slate-100 border border-slate-200 shadow-sm text-sm">
  <div class="flex flex-row items-start align-start gap-2">
    {#if includeLogo}
      <!-- <img src={logo} class="inline-block h-4 w-4 rounded-full mt-[0.25em]" alt="Grantmakers.io Logo" height={36} width={36} /> -->
      <Blink classes="w-6 h-6" />
    {/if}
    <div class="leading-normal flex-inline">
      {#if title}
        <span class="font-bold mr-1">{title}</span>
      {/if}
      <p>{message}</p>
    </div>
  </div>
</div>
