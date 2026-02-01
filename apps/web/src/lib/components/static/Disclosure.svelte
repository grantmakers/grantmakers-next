<script lang="ts">
  interface Props {
    label: string;
    content: string;
    initialExpanded: boolean;
  }

  let { label, content, initialExpanded }: Props = $props();
</script>

<div class="pt-6">
  <details class="group" open={initialExpanded}>
    <summary
      class="flex w-full cursor-pointer list-none items-start justify-between text-left text-gray-900 [&::-webkit-details-marker]:hidden"
    >
      <span class="text-base/7 font-semibold">{label}</span>
      <span class="ml-6 flex h-7 items-center">
        <!-- Minus Icon (shown when open) -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="hidden size-6 group-open:block">
          <path fill-rule="evenodd" d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
        </svg>
        <!-- Plus Icon (shown when closed) -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="block size-6 group-open:hidden">
          <path
            fill-rule="evenodd"
            d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </summary>
    <div class="mt-2 pr-12">
      <!-- Source: Internal trustedConstants -->
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html content}
    </div>
  </details>
</div>
