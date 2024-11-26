<script lang="ts">
  import { ArrowUpTray } from 'svelte-heros-v2';

  function backToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
</script>

<div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
  <div class="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
    <button
      type="button"
      on:click={backToTop}
      class="inline-flex items-center gap-2 rounded-md p-1 transition-colors duration-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
    >
      <ArrowUpTray class="h-4 w-4" />
      <span>Back to Top</span>
    </button>
  </div>
</div>
