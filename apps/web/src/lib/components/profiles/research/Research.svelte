<script lang="ts">
  import ContentBoxHeader from '../ContentBoxHeader.svelte';
  import propublicaLogo from '$lib/assets/images/propublica.svg';
  import irsLogo from '$lib/assets/images/irs-logo.webp';
  // import grantadvisorLogo from '$lib/assets/images/grantadvisor.svg';
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
  <ContentBoxHeader title={'Further Research'}></ContentBoxHeader>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 md:grid-rows-1">
  <div class="flex-auto items-start justify-center gap-2 p-8">
    <div class="flex items-end justify-between rounded">
      <div class="flex flex-col gap-3">
        <div
          class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
        >
          Non-Commercial
        </div>
        <!-- <div class="text-xs uppercase text-green-500">Non-Commercial</div> -->
        <div class="flex flex-row justify-start">
          <img src={propublicaLogo} alt="ProPublica logo" class="h-4 w-auto object-contain" height={16} width={184} />
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <div class="text-sm font-semibold text-slate-700">Review the 990</div>
      </div>
    </div>
    <div class="mt-8 flex flex-wrap items-center justify-center gap-4 rounded-md bg-slate-100 p-4 md:justify-start">
      <a
        href="https://projects.propublica.org/nonprofits/organizations/{ein}/{irsObjectId}/full"
        target="_blank"
        rel="noopener"
        type="button"
        class="inline-flex items-center gap-x-1.5 rounded-md bg-slate-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <DocumentText variation={'solid'} class={'h-4 w-4'} />
        Latest Filing
      </a>
      <a
        href="https://projects.propublica.org/nonprofits/organizations/{ein}"
        target="_blank"
        rel="noopener"
        class="text-sm/6 font-semibold text-slate-700 hover:text-slate-500">View All Filings <span aria-hidden="true">→</span></a
      >
    </div>
  </div>

  <div class="flex-auto items-start justify-center gap-4 p-8">
    <div class="flex w-full items-end justify-between rounded">
      <div class="flex flex-col gap-2">
        <span
          class="inline-flex items-center whitespace-nowrap rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
        >
          Government Source
        </span>
        <!-- <div class="whitespace-nowrap text-xs text-blue-500">Government Source</div> -->
        <img src={irsLogo} alt="IRS logo" class="max-h-6" height={24} width={48} />
      </div>
      <div class="flex flex-col gap-4">
        <div class="ml-8 text-sm font-semibold text-slate-700">Review Other IRS docs</div>
      </div>
    </div>
    <div class="mt-8 flex flex-wrap items-center justify-center gap-4 rounded-md bg-slate-100 p-4 md:justify-start">
      <a
        href="https://apps.irs.gov/app/eos/"
        target="_blank"
        rel="noopener noreferrer"
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
          ><ClipboardDocument variation={'solid'} class={'mr-2 h-4 w-4 text-slate-500'} /> Copy EIN</button
        >
        <div class="text-xs">← Psst, click this first</div>
      </div>
    </div>
  </div>

  <!-- <div class="flex-auto items-start justify-center gap-2 p-8">
    <div class="flex items-center rounded bg-slate-100 p-2">
      <div class="flex grow flex-col gap-1">
        <div class="text-xs text-green-500">Non-Commercial</div>
        <div class="text-sm font-bold uppercase text-slate-700">Foundation Reviews</div>
        <div class="text-sm text-slate-700">GrantAdvisor</div>
      </div>
      <img src={grantadvisorLogo} alt="IRS logo" class="max-h-6 max-w-fit" height={40} width={40} />
    </div>
    <p class="mt-4">Community-sourced reviews from your peers. Nearly 1,000 reviews from professional fundraisers just like you.</p>
    <div class="mt-4 flex flex-wrap items-center gap-4 lg:mt-12">
      <a
        href="https://grantadvisor.org/"
        target="_blank"
        rel="noopener"
        type="button"
        class="inline-flex items-center gap-x-1.5 rounded-md bg-slate-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <MagnifyingGlassCircle variation={'solid'} class={'h-4 w-4'} />
        Visit site
      </a>
      <div class="flex flex-row items-center gap-2">
        <a
          href="https://grantadvisor.org/profile/{formatEin(ein)}"
          target="_blank"
          rel="noopener noreferrer"
          type="button"
          class="flex flex-row items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
          ><DocumentText variation={'solid'} class={'mr-2 h-4 w-4 text-slate-500'} /> Feeling lucky?</a
        >
        <div class="text-xs">← Go direct (1% chance it works)</div>
      </div>
    </div>
  </div> -->
</div>
