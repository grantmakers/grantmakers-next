<script lang="ts">
  import { createDisclosure } from 'svelte-headlessui';
  interface Props {
    label: string;
    content: string;
    initialExpanded: boolean;
  }

  /**
   * Svelte can't infer props when using let props = $props(), aka non-destructured.
   * This matters only for custom elements/web components, which we do not use.
   * It's safe to ignore the warning
   */
  // eslint-disable-next-line svelte/valid-compile
  let props: Props = $props();

  const disclosure = createDisclosure({
    label: props.label,
    expanded: props.initialExpanded,
  });

  // Derived for template usage to maintain cleaner template
  let label = $derived(props.label);
  let content = $derived(props.content);
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path
              fill-rule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clip-rule="evenodd"
            />
          </svg>
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
