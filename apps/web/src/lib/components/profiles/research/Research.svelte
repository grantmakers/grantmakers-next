<script lang="ts">
  import propublicaLogo from '$lib/assets/images/propublica.svg';
  import irsLogo from '$lib/assets/images/irs-logo.webp';
  import grantadvisorLogo from '$lib/assets/images/grantadvisor.svg';
  import { copy } from 'svelte-copy';
  import toast from 'svelte-french-toast';
  import Sparkles from 'svelte-heros-v2/Sparkles.svelte';
  import DocumentText from 'svelte-heros-v2/DocumentText.svelte';
  import MagnifyingGlassCircle from 'svelte-heros-v2/MagnifyingGlassCircle.svelte';
  import ClipboardDocument from 'svelte-heros-v2/ClipboardDocument.svelte';
  import grantmakersLogo from '$lib/assets/images/logo.svg';
  import { tooltip } from '$utils/tooltip';

  interface Props {
    ein: string;
    irsObjectId: string;
  }

  let { ein, irsObjectId }: Props = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-3">
  <div class="flex flex-col items-start gap-2 p-8 md:border-r md:border-slate-100">
    <div class="flex h-8 items-end">
      <img src={propublicaLogo} alt="ProPublica logo" class="h-4 w-auto" height={16} width={184} />
    </div>
    <p class="text-sm text-slate-700">Review the 990</p>
    <div class="mt-8 flex w-full flex-wrap items-center justify-center gap-4 rounded-md bg-slate-100 p-4 md:mt-auto md:justify-start">
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

  <div class="flex flex-col items-start gap-2 p-8 md:border-r md:border-slate-100">
    <div class="flex h-8 items-end">
      <img src={irsLogo} alt="IRS logo" class="h-6 w-auto" height={24} width={48} />
    </div>
    <p class="text-sm text-slate-700">Review Other IRS docs</p>
    <div class="mt-8 flex w-full flex-wrap items-center justify-center gap-4 rounded-md bg-slate-100 p-4 md:mt-auto md:justify-start">
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
          class="flex cursor-copy flex-row items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-300 ring-inset hover:bg-slate-50"
          ><ClipboardDocument variation={'solid'} class={'mr-2 h-4 w-4 text-slate-500'} /> Copy EIN</button
        >
      </div>
    </div>
  </div>

  <div class="flex flex-col items-start gap-2 p-8">
    <div class="flex h-8 items-end gap-1">
      <img src={grantadvisorLogo} alt="GrantAdvisor logo" class="h-6 w-auto" height={24} width={24} />
      <div class="text-base font-semibold">GrantAdvisor</div>
    </div>
    <p class="text-sm text-slate-700">Read foundation reviews from your peers</p>
    <div class="mt-8 flex w-full flex-wrap items-center justify-start gap-4 rounded-md bg-slate-100 p-4 md:mt-auto">
      <a
        href="https://grantadvisor.org/"
        target="_blank"
        rel="noopener"
        type="button"
        class="inline-flex items-center gap-x-1.5 rounded-md bg-slate-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <MagnifyingGlassCircle variation={'solid'} class={'h-4 w-4'} />
        Search on GrantAdvisor
      </a>
    </div>
  </div>
</div>

<!-- Divider -->
<div class="px-8">
  <div class="border-t border-dashed border-slate-200"></div>
</div>

<div class="p-8">
  <div class="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
    <div class="flex flex-col gap-3 md:flex-1">
      <div class="flex items-center gap-1">
        <img src={grantmakersLogo} alt="Grantmakers.io logo" class="h-6 w-auto" height={24} width={24} />
        <span class="text-base font-semibold text-slate-800">Grantmakers.io</span>
      </div>
      <p class="max-w-lg text-sm leading-relaxed text-slate-600">
        You know your organization best. Generate an AI-ready version of this profile for ChatGPT, Claude, or Gemini and ask the questions
        that matter to your fundraising goals.
      </p>
    </div>
    <div class="flex flex-col items-start gap-3 rounded-md bg-slate-100 p-5 md:min-w-[280px]">
      <span class="w-full cursor-not-allowed" use:tooltip={{ content: 'Coming soon' }}>
        <button
          disabled
          class="pointer-events-none inline-flex w-full cursor-not-allowed items-center justify-center gap-x-1.5 rounded-md bg-slate-300 px-3 py-2 text-sm font-semibold text-white shadow-sm"
        >
          <Sparkles variation={'solid'} class={'h-4 w-4'} />
          Generate AI-Ready Profile
        </button>
      </span>

      <p class="text-xs text-slate-500">Creates a Markdown file you can paste into any AI assistant</p>
    </div>
  </div>
</div>
