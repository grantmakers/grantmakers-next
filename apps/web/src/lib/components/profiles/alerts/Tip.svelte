<script lang="ts">
  import Blink from '$lib/components/shared/icons/Blink.svelte';
  // import logo from '$lib/assets/images/logo.svg';
  export let title: string = '';
  export let message: string;
  export let includeLogo: boolean = false;
</script>

<div class="rounded-md border border-slate-200 bg-slate-100 p-6 text-sm text-slate-700 shadow-sm">
  <div class="align-start flex flex-row items-start gap-2">
    {#if includeLogo}
      <!-- <img src={logo} class="inline-block h-4 w-4 rounded-full mt-[0.25em]" alt="Grantmakers.io Logo" height={36} width={36} /> -->
      <Blink classes="w-6 h-6" />
    {/if}
    <div class="flex-inline leading-normal">
      {#if title}
        <span class="mr-1 font-bold">{title}</span>
      {/if}
      <p>{message}</p>
    </div>
  </div>
</div>
