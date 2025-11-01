<script lang="ts">
  import { features } from '@repo/shared/constants/trustedConstants/withIcons';
</script>

<div class="mx-auto max-w-7xl px-6 lg:px-8">
  <div class="mx-auto max-w-2xl sm:text-center">
    <div class="text-base font-semibold leading-7 text-indigo-600">Ethos</div>
    <h1 class="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
      Truly open access to <span class="text-indigo-600">Foundation 990 Data</span>
    </h1>
    <p class="mt-6 p-2 text-lg leading-8 text-gray-600 lg:p-6">
      Foundation tax filings have been public since the 1950s, but remain inaccessible, stuck behind subscriptions, paywalls, and the growth
      aspirations of for-profit startups. If you need the advanced features of the paid tools, great. If you just need the data, welcome
      home.
    </p>
  </div>
</div>
<div class="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
  <dl
    class="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16"
  >
    {#each features as feature}
      <div class="relative pl-9">
        <dt class="inline font-semibold text-gray-900">
          <feature.icon class="absolute left-1 top-1 size-5 text-indigo-600" aria-hidden="true" />
          {feature.name}
        </dt>
        {' '}
        <dd class="inline">{feature.description}</dd>
      </div>
    {/each}
  </dl>
</div>
<div class="mt-16 flex justify-center">
  <p
    class="relative rounded-full bg-white/25 px-4 py-1.5 text-sm/6 text-gray-600 ring-1 ring-inset ring-gray-900/10 dark:bg-gray-800/25 dark:text-gray-400 dark:ring-white/10"
  >
    <span class="hidden md:inline">8,000 of your nonprofit peers spend 4 minutes every week searching on Grantmakers.io.</span>
    <a href="/about/" class="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      ><span aria-hidden="true" class="absolute inset-0"></span> Learn more about the project
      <span aria-hidden="true">&rarr;</span></a
    >
  </p>
</div>
