<script lang="ts">
  import '@tailwindplus/elements';
  import CommunityIntelligence from './CommunityIntelligence.svelte';

  let { ein } = $props();

  const DIALOG_ID = 'community-intelligence-modal';
</script>

<el-dialog>
  <dialog id={DIALOG_ID} class="m-0 p-0 backdrop:bg-transparent">
    <el-dialog-backdrop
      class="fixed inset-0 bg-black/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:bg-gray-900/80"
    ></el-dialog-backdrop>

    <div class="fixed inset-0 overflow-y-auto p-4">
      <div class="flex min-h-full items-center justify-center text-center">
        <el-dialog-panel
          class="shadow-soft-xl w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        >
          <CommunityIntelligence {ein} />

          <div class="mt-4">
            <button
              command="close"
              commandfor={DIALOG_ID}
              type="button"
              class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Close
            </button>
          </div>
        </el-dialog-panel>
      </div>
    </div>
  </dialog>
</el-dialog>
