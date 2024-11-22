<script lang="ts">
  import SummaryBoxHeader from '../SummaryBoxHeader.svelte';
  import propublicaLogo from '$lib/assets/images/propublica.svg';
  import irsLogo from '$lib/assets/images/irs-logo.webp';
  import { copy } from 'svelte-copy';
  import toast from 'svelte-french-toast';
  import { ClipboardDocument, DocumentText, MagnifyingGlassCircle } from 'svelte-heros-v2';

  interface Props {
    ein: string;
    irsObjectId: string;
  }

  let { ein, irsObjectId }: Props = $props();
</script>

<div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
  <SummaryBoxHeader headerText={'Further Research'}></SummaryBoxHeader>
</div>
<div class="grid grid-cols-1 md:grid-cols-2">
  <div class="flex-auto items-start justify-center gap-2 p-4">
    <div class="flex items-center">
      <div class="grow">
        <div class="text-xs text-green-500">Non-Commercial</div>
        <div class="pb-2 text-sm font-bold uppercase text-slate-700">ProPublica</div>
      </div>
      <div class="shrink"><img src={propublicaLogo} alt="ProPublica logo" class="max-h-4 shrink" height={24} width={184} /></div>
    </div>
    <p>
      Need to dive into the full 990 filing? Our favorite source is ProPublica. They share our mission of truly free and open access to 990
      data.
    </p>
    <div class="mt-4 flex flex-wrap items-center gap-4">
      <a
        href="https://projects.propublica.org/nonprofits/organizations/{ein}/{irsObjectId}/full"
        target="_blank"
        rel="noopener”"
        type="button"
        class="inline-flex items-center gap-x-1.5 rounded-md bg-slate-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <DocumentText variation={'solid'} class={'h-4 w-4'} />
        Latest Filing
      </a>
      <a
        href="https://projects.propublica.org/nonprofits/organizations/{ein}"
        class="text-sm/6 font-semibold text-slate-700 hover:text-slate-500">View All Filings <span aria-hidden="true">→</span></a
      >
    </div>
  </div>

  <div class="flex-auto items-start justify-center gap-2 p-4">
    <div class="flex items-center">
      <div class="grow">
        <div class="text-xs text-blue-500">Government Source</div>
        <div class="pb-2 text-sm font-bold uppercase text-slate-700">Tax Exempt Organization Search</div>
      </div>
      <img src={irsLogo} alt="IRS logo" class="max-h-6" height={24} width={48} />
    </div>
    <p>Straight from the source. Good for confirming IRS status, viewing determination letters, and checking revocation status.</p>
    <div class="mt-4 flex flex-wrap items-center gap-4">
      <a
        href="https://apps.irs.gov/app/eos/"
        target="_blank"
        rel="nofollow noreferrer"
        type="button"
        class="inline-flex items-center gap-x-1.5 rounded-md bg-slate-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <MagnifyingGlassCircle variation={'solid'} class={'h-4 w-4'} />
        Search at IRS.gov
      </a>
      <div class="flex flex-row items-center gap-2">
        <button
          use:copy={{
            text: ein,
            onCopy() {
              toast.success('Copied EIN');
            },
          }}
          type="button"
          class="flex cursor-copy flex-row items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
          ><ClipboardDocument variation={'solid'} class={'mr-2 h-4 w-4 text-slate-500'} /> EIN {ein}</button
        >
        <div class="text-xs">← Psst, copy this first</div>
      </div>
    </div>
  </div>
</div>
