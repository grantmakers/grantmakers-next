<script lang="ts">
  import SummaryBoxHeader from '../SummaryBoxHeader.svelte';
  import logo from '$lib/assets/images/logo.svg';
</script>

<div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
  <SummaryBoxHeader headerText={'About Grantmakers.io'}>
    <img src={logo} alt="Grantmakers.io logo" class="max-h-6 w-full" height={36} width={36} />
  </SummaryBoxHeader>
</div>
<div class="flex flex-col gap-6 p-6">
  <div>
    <div class="text-sm font-bold uppercase text-slate-700">Open Source</div>
    <p>
      Grantmakers.io is a free community project ensuring nonprofits unfettered access to the public IRS dataset of Form 990 tax filings.
    </p>
  </div>
  <div>
    <div class="text-sm font-bold uppercase text-slate-700">Data is Verbatim</div>
    <p>
      The project pulls from an open dataset published by the IRS. Data is presented exactly as found in the tax filings. Misspellings and
      cut off words are common as is the use of ALLCAPS.
    </p>
  </div>
  <div>
    <div class="text-sm font-bold uppercase text-slate-700">Historical Data</div>
    <p>
      Be mindful of the limitations of using historical data in your research - the data represents past activity and may not reflect
      current foundation priorities.
    </p>
  </div>
  <div class="flex justify-center">
    <a
      href="https://www.grantmakers.io/about/"
      class="shrink rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
    >
      <div class="flex flex-row items-center justify-center gap-1">Learn More</div>
    </a>
  </div>
</div>
