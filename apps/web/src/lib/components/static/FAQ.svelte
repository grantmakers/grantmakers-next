<script lang="ts">
  import { faqData } from '@repo/shared/constants/trustedConstants';
  import Disclosure from './Disclosure.svelte';
</script>

<div class="bg-white px-6 py-8 lg:px-8">
  <div class="mx-auto max-w-3xl text-base/7 text-gray-700">
    <div class="mx-auto max-w-4xl divide-y divide-gray-900/10">
      <div>
        <p class="text-base/7 font-semibold text-indigo-600 md:hidden">FAQ</p>
        <p class="hidden text-base/7 font-semibold text-indigo-600 md:block">Simple answers to common questions</p>
        <h1 class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Frequently Asked Questions</h1>
        <!-- <p class="mt-6 text-xl/8"></p> -->
      </div>
    </div>
    <dl class="mt-10 space-y-6 divide-y divide-gray-900/10">
      {#each faqData as { question, answer }, index}
        <Disclosure label={question} content={answer} initialExpanded={index === 0 ? true : false} />
      {/each}
    </dl>
  </div>
</div>
