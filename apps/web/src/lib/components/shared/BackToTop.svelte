<script lang="ts">
  import { backToTop } from '$lib/utils/scroll';
</script>

<div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
  <div class="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
    <button
      type="button"
      onclick={backToTop}
      class="inline-flex items-center gap-2 rounded-md p-1 transition-colors duration-200 hover:text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
        <path
          fill-rule="evenodd"
          d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
          clip-rule="evenodd"
        />
      </svg>

      <span>Back to Top</span>
    </button>
  </div>
</div>
