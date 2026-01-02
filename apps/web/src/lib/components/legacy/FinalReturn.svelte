<script lang="ts">
  interface Props {
    taxYear: number | 'N/A';
  }
  let { taxYear = 'N/A' }: Props = $props();
</script>

<div class="rounded-md bg-red-50 p-4 dark:bg-red-500/15 dark:outline dark:outline-1 dark:outline-red-500/25">
  <div class="flex">
    <div class="shrink-0">
      <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5 text-red-400">
        <path
          d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
          clip-rule="evenodd"
          fill-rule="evenodd"
        />
      </svg>
    </div>
    <div class="ml-3">
      <p class="text-sm font-medium text-red-800 dark:text-red-200">
        FINAL RETURN FILED<span class="ml-2 text-sm font-normal text-red-700 dark:text-red-200/80">Tax Year {taxYear} </span>
      </p>
    </div>
  </div>
</div>
