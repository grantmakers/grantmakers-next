<script lang="ts">
  import { onMount } from 'svelte';
  import { normalizePerson } from '@shared/functions/formatters/names';
  import type { PeopleArray } from '@shared/typings/grantmakers/grants';

  export let people: PeopleArray;

  let normalizedPeople: PeopleArray;

  onMount(async () => {
    // Normalize each person in an array, for example
    normalizedPeople = people.map((person) => normalizePerson(person));
  });
</script>

<div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
  <div class="mb-0 rounded-2xl border-b-0 bg-white p-4 pb-0">
    <h6 class="mb-0">People</h6>
  </div>
  <div class="flex-auto p-4">
    <ul class="mb-0 flex flex-col rounded-lg pl-0">
      {#if normalizedPeople}
        {#each normalizedPeople.slice(0, 5) as person}
          <li>
            {person.name}
          </li>
        {/each}
      {/if}
      {#if people?.length > 5}
        <li class="relative mb-2 flex items-center rounded-t-lg border-0 bg-white px-0 py-2 text-inherit">
          <div class="text-xs">{`view ${people.length - 5} more...`}</div>
        </li>
      {/if}
    </ul>
  </div>
</div>
