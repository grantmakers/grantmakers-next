<script lang="ts">
  import { onMount } from 'svelte';
  import { normalizePerson } from '@shared/functions/formatters/names';
  import type { PeopleArray } from '@shared/typings/grantmakers/grants';
  import PeopleDialog from './people/PeopleDialog.svelte';
  import PeopleTable from './people/PeopleTable.svelte';

  export let people: PeopleArray;
  export let taxPeriod;

  let normalizedPeople: PeopleArray;

  onMount(async () => {
    // The IRS People schemas are a hot mess. Attempt to normalize the array for presentation.
    normalizedPeople = people.map((person) => normalizePerson(person));
  });
</script>

<div class="mb-6 flex h-full flex-col justify-between p-4">
  <PeopleTable people={normalizedPeople} isSummary={true} />
  {#if people?.length > 5}
    <div class="flex justify-center">
      <PeopleDialog people={normalizedPeople} {taxPeriod} />
    </div>
  {/if}
</div>
