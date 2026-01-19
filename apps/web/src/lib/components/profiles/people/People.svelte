<script lang="ts">
  import { normalizePerson } from '@repo/shared/functions/formatters/names';
  import type { PeopleArray } from '@repo/shared/typings/grantmakers/all';
  import PeopleTable from './PeopleTable.svelte';
  import ChevronDown from 'svelte-heros-v2/ChevronDown.svelte';
  import ChevronUp from 'svelte-heros-v2/ChevronUp.svelte';

  interface Props {
    people: PeopleArray;
  }

  let { people }: Props = $props();

  // Normalize people data for presentation
  let normalizedPeople: PeopleArray = $derived(people.map((person) => normalizePerson(person)));

  // Mobile collapsible state
  let mobileExpanded = $state(false);
  let mobileVisiblePeople: PeopleArray = $derived(mobileExpanded ? normalizedPeople : normalizedPeople.slice(0, 10));

  // Desktop scroll fade state
  let scrollContainer: HTMLDivElement | undefined = $state();
  let showFade = $state(true);

  function handleScroll() {
    if (!scrollContainer) return;
    const isAtBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 10;
    showFade = !isAtBottom;
  }
</script>

{#if people}
  <!-- Mobile view: Collapsible -->
  <div class="lg:hidden">
    <div class="p-4">
      <PeopleTable people={mobileVisiblePeople} />
      {#if normalizedPeople.length > 10}
        <div class="mt-4 flex justify-center border-t border-slate-200 pt-4">
          <button
            class="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline"
            onclick={() => (mobileExpanded = !mobileExpanded)}
          >
            {#if mobileExpanded}
              Show less <ChevronUp class="h-4 w-4" />
            {:else}
              Show all {normalizedPeople.length} people <ChevronDown class="h-4 w-4" />
            {/if}
          </button>
        </div>
      {/if}
    </div>
  </div>

  <!-- Desktop view: Scrollable with fade -->
  <div class="relative hidden min-h-0 flex-1 flex-col lg:flex">
    <!-- Scrollable table area -->
    <div bind:this={scrollContainer} onscroll={handleScroll} class="min-h-0 flex-1 overflow-y-auto px-8 pb-4">
      <PeopleTable people={normalizedPeople} />
    </div>

    <!-- Fade overlay + scroll indicator -->
    {#if showFade}
      <div class="pointer-events-none absolute right-0 bottom-0 left-0">
        <div class="h-12 bg-gradient-to-t from-white to-transparent"></div>
        <div class="bg-white px-4 py-2 text-center">
          <span class="text-xs text-slate-500">Scroll for more</span>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <div class="mb-6 flex h-full flex-col justify-between p-4">
    <p>Unable to load People</p>
  </div>
{/if}
