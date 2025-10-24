<script lang="ts">
  import '@tailwindplus/elements';
</script>

<el-dialog>
  <dialog
    id="irs-exclude-info"
    aria-labelledby="Exclusionary IRS language"
    class="fixed inset-0 m-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent p-0 backdrop:bg-transparent"
  >
    <el-dialog-backdrop
      class="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:bg-gray-900/50"
    ></el-dialog-backdrop>

    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div tabindex="0" class="flex min-h-full items-end justify-center p-4 text-center focus:outline focus:outline-0 sm:items-center sm:p-0">
      <el-dialog-panel
        class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:bg-gray-800 dark:outline dark:outline-1 dark:-outline-offset-1 dark:outline-white/10 sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
      >
        <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
          <button
            type="button"
            command="close"
            commandfor="irs-exclude-info"
            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 dark:bg-gray-800 dark:hover:text-gray-300 dark:focus:outline-white"
          >
            <span class="sr-only">Close</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              data-slot="icon"
              aria-hidden="true"
              class="size-6"
            >
              <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <div class="sm:flex sm:items-start">
          <div
            class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-500/10 sm:mx-0 sm:size-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 text-slate-600 dark:text-slate-400"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          </div>
          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <div id="dialog-title" class="text-base font-semibold text-gray-900 dark:text-white">
              Excludes funders who checked Part XV Line 2
            </div>
            <div class="mt-2">
              <p>IRS Form 990PF text</p>
              <blockquote class="text-sm text-gray-500 dark:text-gray-400">
                Check here [ ] if the foundation only makes contributions to preselected charitable organizations and does not accept
                unsolicited requests for funds.
              </blockquote>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Reference: <a class="blue-grey-text" href="https://www.irs.gov/instructions/i990pf#idm140500461586480" target="_blank"
                  >IRS Form 990PF Instructions</a
                >
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            command="close"
            commandfor="irs-exclude-info"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:ring-white/5 dark:hover:bg-white/20 sm:mt-0 sm:w-auto"
            >Close</button
          >
        </div>
      </el-dialog-panel>
    </div>
  </dialog>
</el-dialog>
