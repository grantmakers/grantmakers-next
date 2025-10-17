<script lang="ts">
  import '$src/app.pcss';
  import { humanizeNumber } from '@repo/shared/functions/formatters/numbers';
  import { datasetStats } from '@repo/shared/constants/trustedConstants';
</script>

<div class="bg-white py-24 dark:bg-gray-900 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <h2 class="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400">Profiles Search</h2>
      <p class="mt-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Research Any US Foundation</p>
      <p class="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
        Profiles of {humanizeNumber(datasetStats?.profiles)} U.S. foundations from the IRS electronic 990 dataset
      </p>
    </div>
  </div>

  <div class="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 lg:px-8">
    <div class="mx-auto max-w-2xl lg:max-w-none">
      <div class="flex">
        <h3 class="text-lg font-semibold leading-9 tracking-tight text-gray-900 dark:text-white">Search by:</h3>
      </div>

      <dl class="mt-10 grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
        <div class="relative pl-9">
          <dt class="inline font-semibold text-gray-900 dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="absolute left-1 top-1 size-5 text-indigo-600 dark:text-indigo-400"
            >
              <path
                fill-rule="evenodd"
                d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                clip-rule="evenodd"
              />
            </svg>

            Foundation Name
          </dt>
          <dd class="inline">Search for specific foundations by their legal name</dd>
        </div>
        <div class="relative pl-9">
          <dt class="inline font-semibold text-gray-900 dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="absolute left-1 top-1 size-5 text-indigo-600 dark:text-indigo-400"
            >
              <path
                fill-rule="evenodd"
                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>

            Location
          </dt>
          <dd class="inline">Find foundations by city, state, or trustees</dd>
        </div>
        <div class="relative pl-9">
          <dt class="inline font-semibold text-gray-900 dark:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="absolute left-1 top-1 size-5 text-indigo-600 dark:text-indigo-400"
            >
              <path
                d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"
              />
            </svg>

            EIN
          </dt>
          <dd class="inline">Search by Employer Identification Number</dd>
        </div>
      </dl>
    </div>
  </div>
</div>
