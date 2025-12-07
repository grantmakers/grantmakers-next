<svelte:options runes={false} />

<script lang="ts">
  import { onMount } from 'svelte';
  import { createDialog } from 'svelte-headlessui';
  import Transition from 'svelte-transition';
  import { normalizePerson } from '@repo/shared/functions/formatters/names';
  import type { PeopleArray } from '@repo/shared/typings/grantmakers/all';
  import type TransitionProps from 'svelte-transition';
  import PeopleTable from './PeopleTable.svelte';
  import ArrowsPointingOut from 'svelte-heros-v2/ArrowsPointingOut.svelte';

  // Svelte 5 props - can't use until svelte-headlessui and svelte-transition are Svelte 5 compatible (has to do with slots vs children)
  // interface Props {
  //   people: PeopleArray;
  // }
  // let { people }: Props = $props();
  // let dialog = $state<ReturnType<typeof createDialog> | null>(null);
  // let normalizedPeople: PeopleArray | undefined = $state();

  // Svelte 4 HACK - required to force the Transition component to accept children when running as a Svelte 4 component via runes = false
  interface MimicSvelte5 extends TransitionProps {
    children?: Node | Node[];
  }

  // Svelte 4 props
  export let people: PeopleArray;
  let dialog: ReturnType<typeof createDialog>;
  let normalizedPeople: PeopleArray;

  // The IRS People schemas are a hot mess. Attempt to normalize the array for presentation.
  normalizedPeople = people.map((person) => normalizePerson(person));

  let props = {};

  onMount(async () => {
    // Init Dialog
    dialog = createDialog({ label: 'Board Members and Leadership' });
  });
</script>

{#if people}
  <div class="mb-6 flex h-full flex-col justify-between overflow-x-auto p-4">
    <PeopleTable people={normalizedPeople} isSummary={true} />
    {#if people?.length > 5}
      {#if dialog}
        <div class="flex h-full items-end justify-center">
          <button
            class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
            onclick={dialog.open}
          >
            <div class="flex flex-row items-center justify-center gap-1">
              View All Board Members and Leaders <ArrowsPointingOut class="h-4 w-4" />
            </div>
          </button>
          <div class="flex justify-center">
            <div class="flex w-full flex-col items-center justify-center">
              <!-- The z-index is required to ensure the modal is above the hand drawn circle -->
              <div class="relative z-30">
                <Transition show={$dialog?.expanded} {...props as MimicSvelte5}>
                  <Transition
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    {...props as MimicSvelte5}
                  >
                    <button class="fixed inset-0 bg-black bg-opacity-25" onclick={dialog.close} aria-label="Close dialog"></button>
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
                        {...props as MimicSvelte5}
                      >
                        <div
                          class="shadow-soft-xl w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-12 py-6 text-left align-middle transition-all lg:max-w-fit"
                          use:dialog.modal
                        >
                          <!-- HACK - svelte-headlessui lacks an initialFocus ref for Dialogs https://github.com/CaptainCodeman/svelte-headlessui/issues/5 -->
                          <input hidden />
                          <PeopleTable {people} isSummary={false} />

                          <div class="mt-4 flex justify-center">
                            <button
                              type="button"
                              class="inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                              onclick={dialog.close}
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
        </div>
      {/if}
    {/if}
  </div>
{:else}
  <div class="mb-6 flex h-full flex-col justify-between p-4">
    <p>Unable to load People</p>
  </div>
{/if}
