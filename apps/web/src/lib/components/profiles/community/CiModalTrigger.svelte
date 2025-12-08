<script lang="ts">
  import { slugify } from '@repo/shared/functions/formatters/names';
  import Sparkles from 'svelte-heros-v2/Sparkles.svelte';

  let { title } = $props();

  function handleClick() {
    return 'TODO';
  }
</script>

<button
  type="button"
  class="ease-nav-brand mx-4 my-0 flex items-center px-4 py-2.5 text-sm whitespace-nowrap transition-colors"
  onclick={handleClick}
  aria-label={'Community Intelligence'}
>
  <div
    class="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white fill-current stroke-0 text-center text-slate-900"
    class:text-grantmakers-green={slugify(title) === 'community-intelligence'}
  >
    <Sparkles size="16" variation="solid" />
  </div>
  <span class="ease-soft pointer-events-none ml-1 opacity-100 duration-300">{title}</span>
</button>
