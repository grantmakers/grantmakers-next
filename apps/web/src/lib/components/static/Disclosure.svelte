<script lang="ts">
  import { createDisclosure } from 'svelte-headlessui';
  import { Plus, Minus } from 'svelte-heros-v2';

  interface Props {
    label: string;
    content: string;
    initialExpanded: boolean;
  }

  let { label, content, initialExpanded }: Props = $props();

  const disclosure = createDisclosure({
    label,
    expanded: initialExpanded,
  });
</script>

<div class="pt-6">
  <dt class="mt-2 first:mt-0">
    <button
      use:disclosure.button
      type="button"
      class="flex w-full items-start justify-between text-left text-gray-900"
      aria-controls={label}
      aria-expanded="false"
    >
      <span class="text-base/7 font-semibold">{label}</span>
      <span class="ml-6 flex h-7 items-center">
        {#if $disclosure.expanded}
          <Minus />
        {:else}
          <Plus />
        {/if}
      </span>
    </button>
  </dt>
  {#if $disclosure.expanded}
    <dd use:disclosure.panel class="mt-2 pr-12">
      <!-- Source: Internal trustedConstants -->
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html content}
    </dd>
  {/if}
</div>
