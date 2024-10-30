<script lang="ts">
  import logo from '$lib/assets/images/logo.svg';
  import { ExclamationTriangle } from 'svelte-heros-v2';

  const message = {
    intro: 'Welcome to Grantmakers.io NEXT',
    body: 'ensuring the IRS 990 dataset remains truly open and free',
    type: '',
  };
</script>

<div class="flex justify-center bg-slate-700 px-6 py-2.5 sm:px-3.5">
  <p class="flex items-center text-sm leading-6 text-white">
    {#if message.type == 'warning'}
      <ExclamationTriangle class="mr-2 h-5 w-5" variation="solid" />
    {:else}
      <img src={logo} class="inline-block mr-2 h-6 w-6 rounded-full" alt="Grantmakers.io Logo" height={36} width={36} />
    {/if}

    <strong class="font-semibold">{message.intro}</strong>
    <svg viewBox="0 0 2 2" class="mx-2 hidden h-0.5 w-0.5 fill-current lg:inline" aria-hidden="true"><circle cx="1" cy="1" r="1" /> </svg>
    <span class="hidden lg:inline">{message.body}</span>
  </p>
</div>
