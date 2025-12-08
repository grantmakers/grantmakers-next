<script lang="ts">
  import { formatTaxYear, formatDateToMonthYear, isOutdatedISOString } from '@repo/shared/functions/formatters/dates';
  import ContentBoxHeader from '../ContentBoxHeader.svelte';
  import irsLogo from '$lib/assets/images/irs-logo.webp';
  import Eyes from '$lib/components/shared/icons/Eyes.svelte';
  import { tooltip } from '$utils/tooltip';

  interface Props {
    taxYear: number;
    formattedTaxPeriodEnd: string;
    lastUpdatedIrs: string;
  }

  let { taxYear, formattedTaxPeriodEnd, lastUpdatedIrs }: Props = $props();
</script>

<div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
  <ContentBoxHeader title={'Data Source'}>
    <img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} />
  </ContentBoxHeader>
</div>

<div class="flex-auto items-center space-y-2 rounded-b-2xl bg-white p-4 text-sm text-slate-700">
  <div class="flex flex-col gap-0 p-2">
    <p class="font-bold">IRS Form 990-PF</p>
    <p class="text-slate-500">
      Available to the general public at <a
        href="https://apps.irs.gov/app/eos/"
        class="hover:text-slate-700"
        target="_blank"
        rel="noopener noreferrer">IRS.gov</a
      >.
    </p>
  </div>

  <hr class="border" />

  <div class="p-2 text-sm text-slate-700">
    <div class="flex flex-row items-center justify-between">
      <div>
        <div class="font-bold" title="Latest available filing for this EIN">Latest Filing</div>
        <div class="text-slate-500">
          Tax Year {formatTaxYear(taxYear)} ended {formattedTaxPeriodEnd ?? 'N/A'}
        </div>
        <div class="text-slate-500">Published by the IRS {formatDateToMonthYear(lastUpdatedIrs) ?? 'N/A'}</div>
      </div>
      {#if isOutdatedISOString(lastUpdatedIrs)}
        <div use:tooltip={{ content: 'Published over a year ago' }}>
          <Eyes />
        </div>
      {/if}
    </div>
  </div>
</div>
