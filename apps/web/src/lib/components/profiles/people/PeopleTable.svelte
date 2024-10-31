<script lang="ts">
  import PeopleRow from './PeopleRow.svelte';

  export let people;
  export let showAll: boolean = false;
</script>

<table class="min-w-full divide-y divide-gray-300">
  <thead>
    <tr>
      <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
      <th scope="col" class="xs:hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Title</th>
      <th scope="col" class="hidden cursor-help px-3 py-3.5 text-left text-xs text-gray-900 sm:table-cell" title="Hours per Week">Hrs/Wk</th
      >
      <th scope="col" class="hidden cursor-help px-3 py-3.5 text-left text-xs text-gray-900 sm:table-cell" title="Annual Compensation"
        >Comp/Yr</th
      >
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200 bg-white">
    {#if people}
      {#if showAll}
        {#each people as person}
          <PeopleRow {person} />
        {/each}
      {:else}
        {#each people.slice(0, 5) as person}
          <PeopleRow {person} />
        {/each}
      {/if}

      {#if !showAll}
        <tr>
          <td colspan="4" class="relative mb-2 flex items-center rounded-t-lg border-0 bg-white px-0 py-2 text-inherit">
            <div class="text-xs">{`and ${people.length - 5} more...`}</div>
          </td>
        </tr>
      {/if}
    {/if}
  </tbody>
</table>
