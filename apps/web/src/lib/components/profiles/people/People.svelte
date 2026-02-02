<script lang="ts">
  import { normalizePerson } from '@repo/shared/functions/formatters/names';
  import type { PeopleArray } from '@repo/shared/typings/grantmakers/all';
  import PeopleTable from './PeopleTable.svelte';

  interface Props {
    people: PeopleArray;
  }

  let { people }: Props = $props();

  // Normalize people data for presentation
  let normalizedPeople: PeopleArray = $derived(people.map((person) => normalizePerson(person)));

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
  <!-- Responsive scrollable table area -->
  <div class="relative flex min-h-0 flex-1 flex-col">
    <div bind:this={scrollContainer} onscroll={handleScroll} class="min-h-0 flex-1 overflow-x-auto overflow-y-auto px-4 pb-4 lg:px-8">
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
