<script lang="ts">
  import '@tailwindplus/elements';
  import { copy } from 'svelte-copy';
  import toast from 'svelte-french-toast';
  import { browser } from '$app/environment';

  interface Props {
    websiteUrl: string | null;
    websiteVerbatim: string | null | undefined;
  }

  let { websiteUrl, websiteVerbatim }: Props = $props();

  const DIALOG_ID = 'website-warning-dialog';

  function handleOpenLink() {
    if (!browser) return;

    const dialog = document.querySelector(`el-dialog:has(#${DIALOG_ID})`) as HTMLElement & { hide?: () => void };
    dialog?.hide?.();

    if (websiteUrl) {
      window.open(websiteUrl, '_blank', 'noopener,noreferrer');
    }
  }

  function handleCopySuccess() {
    if (!browser) return;

    toast.success('Copied link');
    const dialog = document.querySelector(`el-dialog:has(#${DIALOG_ID})`) as HTMLElement & { hide?: () => void };
    dialog?.hide?.();
  }
</script>

<button command="show-modal" commandfor={DIALOG_ID} type="button" class="cursor-pointer text-slate-500 hover:text-indigo-600">
  {websiteVerbatim?.toLowerCase()}
</button>
<el-dialog>
  <dialog id={DIALOG_ID} class="m-0 p-0 backdrop:bg-transparent">
    <el-dialog-backdrop
      class="fixed inset-0 bg-black/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:bg-gray-900/80"
    ></el-dialog-backdrop>

    <div class="fixed inset-0 overflow-y-auto p-4">
      <div class="flex min-h-full items-center justify-center text-center">
        <el-dialog-panel
          class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:bg-gray-800/50 dark:shadow-none dark:outline dark:-outline-offset-1 dark:outline-white/10"
        >
          <!-- Header & Close Button Area -->
          <div class="flex items-start justify-between px-4 pt-5 sm:px-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Check this link is safe</h3>
            <button
              command="close"
              commandfor={DIALOG_ID}
              type="button"
              class="rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
            >
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body Content -->
          <div class="px-4 py-4 sm:p-6 sm:pt-2">
            <!-- Description -->
            <div class="text-sm text-gray-500 dark:text-gray-400">
              <p>
                This link isn't verified. It was pulled directly from a historical tax filing. Make sure you trust this link before
                proceeding.
              </p>
            </div>

            <!-- URL Display Box -->
            <div class="mt-4 rounded-md bg-gray-50 p-3 ring-1 ring-gray-200 ring-inset dark:bg-white/5 dark:ring-white/10">
              <p class="font-mono text-xs break-all text-gray-600 dark:text-gray-300">
                {websiteUrl}
              </p>
            </div>
          </div>

          <!-- Footer / CTA Area -->
          <div class="bg-gray-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-white/5">
            <!-- Primary CTA: Open Link -->
            <button
              type="button"
              onclick={handleOpenLink}
              class="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:ml-3 sm:w-auto dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
            >
              Open link
            </button>

            <!-- Secondary CTA: Copy Link -->
            <button
              use:copy={{
                text: websiteUrl ?? '',
                onCopy: handleCopySuccess,
              }}
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-transparent dark:text-gray-300 dark:ring-white/20 dark:hover:bg-white/10"
            >
              Copy link
            </button>
          </div>
        </el-dialog-panel>
      </div>
    </div>
  </dialog>
</el-dialog>
