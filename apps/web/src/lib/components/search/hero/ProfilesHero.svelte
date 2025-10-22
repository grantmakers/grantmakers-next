<script lang="ts">
</script>

<section class="sm:dot-pattern relative isolate overflow-hidden py-24 sm:py-32">
  <div class="relative mx-auto max-w-4xl px-6 lg:px-8">
    <div class="rounded-3xl bg-white/90 p-10 text-center ring-1 ring-black/5 backdrop-blur-xl dark:bg-gray-900/90">
      <h2 class="text-base/7 font-semibold text-grantmakers-orange">Foundation Search</h2>
      <p class="mt-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Open Foundation Data</p>
      <p class="mx-auto mt-6 w-3/4 text-center text-lg text-gray-600 dark:text-gray-300">
        Access any foundation's complete public record in seconds.<br />Free forever, no account required.
      </p>
      <!-- <div class="mt-8">
        <a href="#" class="rounded-lg bg-[#c54e00] px-6 py-3 font-medium text-white shadow-md transition hover:bg-[#a44200]">
          Explore Foundations
        </a>
      </div> -->
    </div>
  </div>

  <div class="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 lg:px-8">
    <div class="mx-auto max-w-2xl lg:max-w-none">
      <div class="hidden sm:mb-8 sm:flex sm:justify-center">
        <div
          class="relative rounded-full bg-white/70 px-3 py-1 text-sm/6 text-gray-500 ring-1 ring-inset ring-gray-300 hover:ring-white/20"
        >
          Find foundations by who they've funded
          <a href="/search/grants/" class="ml-2 font-semibold text-indigo-600"
            ><span aria-hidden="true" class="absolute inset-0"></span>Grants Search <span aria-hidden="true">&rarr;</span></a
          >
        </div>
      </div>
      <!-- <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
        <div
          class="dark:inset-ring dark:inset-ring-white/5 flex gap-x-4 rounded-xl bg-white/30 p-6 ring-1 ring-gray-900/5 backdrop-blur-sm dark:bg-white/5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-7 w-5 flex-none text-indigo-600 dark:text-indigo-400"
          >
            <path
              fill-rule="evenodd"
              d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
              clip-rule="evenodd"
            />
            <path
              d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z"
            />
          </svg>

          <div class="text-base/7">
            <h3 class="font-semibold text-gray-900 dark:text-white">People Search</h3>
            <p class="mt-2 text-gray-700 dark:text-gray-300">Board members, trustees, and key employees</p>
          </div>
        </div>
        <div
          class="dark:inset-ring dark:inset-ring-white/5 flex gap-x-4 rounded-xl bg-white/30 p-6 ring-1 ring-gray-900/5 backdrop-blur-sm dark:bg-white/5"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            data-slot="icon"
            aria-hidden="true"
            class="h-7 w-5 flex-none text-indigo-600 dark:text-indigo-400"
          >
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path
              fill-rule="evenodd"
              d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
              clip-rule="evenodd"
            />
          </svg>

          <div class="text-base/7">
            <h3 class="font-semibold text-gray-900 dark:text-white">Private Foundations</h3>
            <p class="mt-2 text-gray-700 dark:text-gray-300">If a foundation files IRS Form 990-PF, you'll find them here.</p>
          </div>
        </div>
        <div
          class="dark:inset-ring dark:inset-ring-white/5 flex gap-x-4 rounded-xl bg-white/30 p-6 ring-1 ring-gray-900/5 backdrop-blur-sm dark:bg-white/5"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            data-slot="icon"
            aria-hidden="true"
            class="h-7 w-5 flex-none text-indigo-600 dark:text-indigo-400"
          >
            <path
              fill-rule="evenodd"
              d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="text-base/7">
            <h3 class="font-semibold text-gray-900 dark:text-white">Grants Data</h3>
            <p class="mt-2 text-gray-700 dark:text-gray-300">Industry leading grants search on every profile. Unlimited, fast search.</p>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</section>
