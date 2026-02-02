<script lang="ts">
  import PeopleRow from './PeopleRow.svelte';
  import type { PeopleArray } from '@repo/shared/typings/grantmakers/all';

  interface Props {
    people: PeopleArray;
  }

  let { people }: Props = $props();
</script>

<table class="min-w-full">
  <thead>
    <tr>
      <th
        scope="col"
        class="sticky top-0 z-10 border-b border-gray-300 bg-white pt-12 pr-3 pb-3.5 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
        >Name</th
      >
      <th
        scope="col"
        class="sticky top-0 z-10 border-b border-gray-300 bg-white px-3 pt-12 pb-3.5 text-left text-sm font-semibold text-gray-900"
        >Title</th
      >
      <th
        scope="col"
        class="sticky top-0 z-10 cursor-help border-b border-gray-300 bg-white px-3 pt-12 pb-3.5 text-right text-xs text-gray-900"
        title="Hours per Week">Hours/Wk</th
      >
      <th
        scope="col"
        class="sticky top-0 z-10 cursor-help border-b border-gray-300 bg-white px-3 pt-12 pb-3.5 text-right text-xs text-gray-900"
        title="Annual Compensation">Comp/Yr</th
      >
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200 bg-white">
    {#if people}
      {#each people as person}
        <PeopleRow {person} />
      {/each}
    {/if}
  </tbody>
</table>
