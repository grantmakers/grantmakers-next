<script>
  import '@tailwindplus/elements';
</script>

<!-- Trigger Button -->
<button
  command="show-modal"
  commandfor="modal-tips"
  class="modal-trigger text-muted-max flex items-center bg-transparent! focus:bg-transparent!"
  ><i class="tiny material-icons material-icons-rounded grey lighten-2 icon-idea left flex items-center justify-center">wb_incandescent</i
  >Search types
</button>

<!-- Tailwind Elements Dialog -->
<el-dialog>
  <dialog id="modal-tips" class="m-0 p-0 backdrop:bg-transparent dark:backdrop:bg-gray-900/50">
    <el-dialog-backdrop
      class="fixed inset-0 bg-gray-500/25 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
    ></el-dialog-backdrop>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div tabindex="0" class="fixed inset-0 w-screen overflow-y-auto p-4 focus:outline focus:outline-0 sm:p-6 md:p-20">
      <el-dialog-panel
        class="mx-auto block max-w-4xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:bg-gray-900 dark:ring-white/10"
      >
        <!-- Header -->
        <div class="bg-slate-600 px-6 py-4 text-white">
          <div class="flex items-center">
            <svg class="mr-3 h-6 w-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"
              />
            </svg>
            <div class="grow text-base font-semibold">How to search on Grantmakers.io like a pro</div>
            <button
              command="close"
              commandfor="modal-tips"
              class="ml-4 shrink-0 text-white/80 hover:text-white focus:bg-transparent!"
              aria-label="Close modal"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-6">
          <p class="mb-6 text-base text-gray-700">
            There are two ways to search for information, driven by the primary goal of your search.
          </p>

          <div class="mb-6 h-px bg-gray-200"></div>

          <!-- Two Column Layout -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Foundation Search Column -->
            <div class="flex flex-col">
              <div class="mb-4">
                <a
                  href="/search/profiles/"
                  class="text-grantmakers-orange hover:text-grantmakers-orange-light inline-flex items-center text-lg font-semibold"
                >
                  <svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10zM8 13.5l2.5 3.01L14.5 12l4.5 6H5l3-4.5z"
                    />
                  </svg>
                  Foundation Search
                </a>
                <p class="mt-1 text-sm text-gray-500">Perfect for researching a specific foundation</p>
              </div>

              <div class="flex-1 rounded-lg bg-gray-100 p-4">
                <p class="mb-3 text-sm font-medium text-gray-600">Search by</p>
                <ul class="space-y-2 text-sm text-gray-700">
                  <li>Foundation Name</li>
                  <li>Location</li>
                  <li>EIN</li>
                  <li>Trustees and board members</li>
                  <li>Key employees</li>
                </ul>
              </div>
            </div>

            <!-- Grants Search Column -->
            <div class="flex flex-col">
              <div class="mb-4">
                <a
                  href="/search/grantees/"
                  class="hover:text-grantmakers-blue-dark-bg! text-grantmakers-blue! inline-flex items-center text-lg font-semibold"
                >
                  <svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10zM8 13.5l2.5 3.01L14.5 12l4.5 6H5l3-4.5z"
                    />
                  </svg>
                  Grants Search
                </a>
                <p class="mt-1 text-sm text-gray-500">Discover new prospects</p>
              </div>

              <div class="flex-1 rounded-lg bg-gray-100 p-4">
                <p class="mb-3 text-sm font-medium text-gray-600">Search by</p>
                <ul class="space-y-2 text-sm text-gray-700">
                  <li>Keyword</li>
                  <li>Location</li>
                  <li>Past Grantees</li>
                  <li>Grant Amount</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 bg-gray-50 px-6 py-3">
          <p class="text-xs text-gray-500">DATA SOURCE: Public electronic IRS 990 dataset</p>
        </div>
      </el-dialog-panel>
    </div>
  </dialog>
</el-dialog>
