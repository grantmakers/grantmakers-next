<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { ArrowsPointingOut } from 'svelte-heros-v2';
  import PeopleTable from './PeopleTable.svelte';

  export let people;
  export let taxPeriod: string;
</script>

<Dialog.Root>
  <Dialog.Trigger
    class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
  >
    <div class="flex flex-row items-center justify-center gap-1">
      View All Board Members and Leaders <ArrowsPointingOut class="h-4 w-4" />
    </div>
  </Dialog.Trigger>
  <Dialog.Content class="max-h-[85vh] w-full overflow-y-auto p-12 lg:max-w-max">
    <Dialog.Header>
      <Dialog.Title>Board Members and Key Personnel</Dialog.Title>
      <Dialog.Description>
        {#if people.length > 0}
          Accurate as of {taxPeriod}
        {:else}
          No key employees or board members listed
        {/if}
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4"><PeopleTable {people} isSummary={false} /></div>
  </Dialog.Content>
</Dialog.Root>
