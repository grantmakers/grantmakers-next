<script lang="ts">
  import { onMount } from 'svelte';
  import { createDialog } from 'svelte-headlessui';
  import Transition from 'svelte-transition';
  import { normalizePerson } from '@shared/functions/formatters/names';
  import type { PeopleArray } from '@shared/typings/grantmakers/grants';
  import PeopleTable from './people/PeopleTable.svelte';
  import { ArrowsPointingOut } from 'svelte-heros-v2';

  export let people: PeopleArray;

  const dialog = createDialog({ label: 'Board Members and Leadership' });

  let normalizedPeople: PeopleArray;

  onMount(async () => {
    // The IRS People schemas are a hot mess. Attempt to normalize the array for presentation.
    normalizedPeople = people.map((person) => normalizePerson(person));
  });
</script>

<div class="mb-6 flex h-full flex-col justify-between p-4">
  <PeopleTable people={normalizedPeople} isSummary={true} />
  {#if people?.length > 5}
    <button
      class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
      on:click={dialog.open}
    >
      <div class="flex flex-row items-center justify-center gap-1">
        View All Board Members and Leaders <ArrowsPointingOut class="h-4 w-4" />
      </div>
    </button>
    <div class="flex justify-center">
      <div class="flex w-full flex-col items-center justify-center">
        <!-- The z-index is required to ensure the modal is above the hand drawn circle -->
        <div class="relative z-30">
          <Transition show={$dialog.expanded}>
            <Transition
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <button class="fixed inset-0 bg-black bg-opacity-25" on:click={dialog.close} />
            </Transition>

            <div class="fixed inset-0 overflow-y-auto">
              <div class="flex min-h-full items-center justify-center p-4 text-center">
                <Transition
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div
                    class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-12 py-6 text-left align-middle shadow-xl transition-all lg:max-w-fit"
                    use:dialog.modal
                  >
                    <!-- HACK - svelte-headlessui lacks an initialFocus ref for Dialogs https://github.com/CaptainCodeman/svelte-headlessui/issues/5 -->
                    <input hidden />
                    <PeopleTable {people} isSummary={false} />

                    <div class="mt-4 flex justify-center">
                      <button
                        type="button"
                        class="inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                        on:click={dialog.close}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  {/if}
</div>
