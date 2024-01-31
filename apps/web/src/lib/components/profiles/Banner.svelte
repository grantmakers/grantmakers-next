<script lang="ts">
  import { ExclamationTriangle } from 'svelte-heros-v2';

  const message = {
    intro: "This is not the foundation's website",
    body: 'but we welcome the many foundations that use it as such 👋',
  };
</script>

<div class="flex justify-center bg-slate-700 px-6 py-2.5 sm:px-3.5">
  <p class="flex items-center text-sm leading-6 text-white">
    <ExclamationTriangle class="mr-2 h-5 w-5" variation="solid" />
    <strong class="font-semibold">{message.intro}</strong>
    <svg viewBox="0 0 2 2" class="mx-2 hidden h-0.5 w-0.5 fill-current lg:inline" aria-hidden="true"><circle cx="1" cy="1" r="1" /> </svg>
    <span class="hidden lg:inline">{message.body}</span>
  </p>
</div>
