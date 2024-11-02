<script lang="ts">
  import { browser } from '$app/environment';
  import Autocomplete from './Autocomplete.svelte';
</script>

<div class="relative">
  <!-- SSR Placeholder -->
  <div class="relative mt-0 rounded-md shadow-sm transition-opacity duration-200" class:opacity-0={browser} class:invisible={browser}>
    <button
      type="button"
      class="aa-DetachedSearchButton !min-w-48"
      style="
        height: var(--aa-search-input-height);
        color: rgba(var(--aa-text-color-rgb), var(--aa-text-color-alpha));
        font-family: var(--aa-font-family);
        font-size: var(--aa-font-size);
      "
      disabled
    >
      <div class="flex items-center gap-2">
        <div style="color: rgba(var(--aa-icon-color-rgb), var(--aa-icon-color-alpha));">
          <svg
            viewBox="0 0 24 24"
            style="
              width: var(--aa-icon-size);
              height: var(--aa-icon-size);
            "
            fill="currentColor"
          >
            <path
              d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"
            ></path>
          </svg>
        </div>
        <span class="text-sm text-gray-400">Search</span>
      </div>
    </button>
  </div>

  <!-- Algolia Component -->
  <div class="absolute inset-0 transition-opacity duration-200" class:opacity-0={!browser} class:invisible={!browser}>
    <div class="relative mt-0 rounded-md shadow-sm">
      <Autocomplete />
    </div>
  </div>
</div>
