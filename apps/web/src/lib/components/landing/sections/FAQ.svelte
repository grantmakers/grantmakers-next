<script lang="ts">
  // import { createDisclosure } from 'svelte-headlessui';
  import { faqData } from '@utils/trustedConstants';
</script>

<div class="mx-auto max-w-4xl divide-y divide-gray-900/10">
  <h2 class="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
  <dl class="mt-10 space-y-6 divide-y divide-gray-900/10">
    {#each faqData as faq}
      {faq}
      <!-- <Disclosure as="div" class="pt-6">
      <dt>
        <Disclosure.Button class="flex w-full items-start justify-between text-left text-gray-900">
          <span class="text-base font-semibold leading-7">{faq.question}</span>
          <span class="ml-6 flex h-7 items-center">
            <MinusIcon class="size-6" aria-hidden="true" />
            <PlusIcon class="size-6" aria-hidden="true" />
          </span>
        </Disclosure.Button>
      </dt>
      <Disclosure.Panel as="dd" class="mt-2 pr-12">
        <p class="text-base leading-7 text-gray-600">{faq.answer}</p>
      </Disclosure.Panel>
    </Disclosure> -->
    {/each}
  </dl>
</div>
