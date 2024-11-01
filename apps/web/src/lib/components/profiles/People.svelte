<script lang="ts">
  import { onMount } from 'svelte';
  import { normalizePerson } from '@shared/functions/formatters/names';
  import type { PeopleArray } from '@shared/typings/grantmakers/grants';
  import PeopleTable from './people/PeopleTable.svelte';
  import { ArrowsPointingOut } from 'svelte-heros-v2';

  export let people: PeopleArray;
  export let taxPeriod;

  let normalizedPeople: PeopleArray;

  onMount(async () => {
    console.log(taxPeriod);
    // The IRS People schemas are a hot mess. Attempt to normalize the array for presentation.
    normalizedPeople = people.map((person) => normalizePerson(person));
  });
</script>

<div class="mb-6 flex h-full flex-col justify-between p-4">
  <PeopleTable people={normalizedPeople} isSummary={true} />
  {#if people?.length > 5}
    <div class="flex justify-center">
      <div
        class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
      >
        <div class="flex flex-row items-center justify-center gap-1">
          View All Board Members and Leaders <ArrowsPointingOut class="h-4 w-4" />
        </div>
      </div>
    </div>
  {/if}
</div>
