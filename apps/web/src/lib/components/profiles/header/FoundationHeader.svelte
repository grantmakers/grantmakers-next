<script lang="ts">
  import Approachability from './Approachability.svelte';
  import { copy } from 'svelte-copy';
  import toast from 'svelte-french-toast';
  import Dot from '$lib/components/shared/icons/Dot.svelte';
  import LetterAvatar from '$lib/components/shared/avatars/LetterAvatar.svelte';
  import { formatEin } from '@repo/shared/functions/formatters/ein';
  import { formatTaxPeriodDate, isOutdatedISOString } from '@repo/shared/functions/formatters/dates';
  import { upperFirstLetter } from '@repo/shared/functions/formatters/names';
  import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';

  interface Props {
    organization_name: GrantmakersExtractedDataObj['organization_name'];
    profile: GrantmakersExtractedDataObj;
    formattedTaxPeriodEnd: string;
  }

  let { organization_name, profile, formattedTaxPeriodEnd }: Props = $props();

  let {
    is_likely_staffed: isStaffed,
    grants_to_preselected_only: noUnsolicited,
    has_recent_grants: hasRecentGrants,
    filing_is_final_return: isFinalReturn,
  } = profile;
  const firstLetter = upperFirstLetter(organization_name);

  // Determine IRS status
  const hasValidIrsStatus = $derived((profile.eobmf_recognized_exempt && profile.eobmf_ruling_date) || !profile.filing_is_final_return);
  const isDataOutdated = $derived(isOutdatedISOString(profile.last_updated_irs));

  // Badge styling constant
  const BADGE_CLASSES = 'inline-flex w-32 items-center justify-start gap-1.5 rounded px-2.5 py-1 text-xs font-medium text-slate-600';
</script>

<!-- Main container using flex with items-end to align bottom edges -->
<div class="flex flex-wrap items-start justify-center gap-6 md:justify-between">
  <!-- Left Column: Avatar + Content Stack -->
  <div class="flex grow items-start gap-4 sm:grow-0">
    <!-- Avatar -->
    <div class="mt-1 shrink-0 md:mt-0">
      {#if firstLetter !== ''}
        <LetterAvatar letter={firstLetter} size="lg" />
      {:else}
        <img src="/default.png" alt="Foundation First Initial Icon" class="size-12 rounded-xl md:size-20" width="74" height="74" />
      {/if}
    </div>

    <!-- Name, Location, and Website stacked -->
    <div class="flex min-w-0 flex-col gap-3">
      <!-- Name and Location (grouped) -->
      <div>
        <h5 class="mb-1 w-full text-lg font-semibold text-wrap whitespace-normal text-slate-700 md:max-w-md">
          {organization_name}
        </h5>
        <div class="flex flex-col text-sm leading-normal font-normal sm:flex-row sm:items-center">
          <strong class="text-slate-700">
            {profile.city},
            {profile.is_foreign && profile.state === 'Foreign' ? profile.country : profile.state}
          </strong>
          <Dot />
          {#if profile.has_website}
            <a href={profile.website} target="_blank" rel="external noopener" class="text-slate-500 hover:text-indigo-600">
              {profile.website_verbatim?.toLowerCase()}
            </a>
          {:else}
            <span class="text-slate-500">No website listed</span>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Right Column: Metadata -->
  <div class="ml-4 grid w-full grid-cols-2 gap-x-2 gap-y-2 text-right md:mt-0 md:ml-2 md:w-auto md:gap-x-4">
    <!-- EIN -->
    <span class="inline-flex items-center justify-start text-sm md:justify-end">EIN</span>
    <span
      use:copy={{
        text: profile.ein,
        onCopy() {
          toast.success('Copied EIN');
        },
      }}
      class="inline-flex cursor-copy items-center justify-center rounded-md px-2 py-1 text-sm font-medium text-slate-700 tabular-nums"
    >
      {formatEin(profile.ein)}
    </span>

    <!-- IRS Status -->
    <span class="inline-flex items-center justify-start text-sm md:justify-end">IRS Status</span>
    <span class={BADGE_CLASSES}>
      <span class="size-1.5 shrink-0 rounded-full {hasValidIrsStatus ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
      {#if hasValidIrsStatus}
        {#if profile.eobmf_ruling_date === '000000'}
          Recognized
        {:else if profile.eobmf_ruling_date}
          Since {formatTaxPeriodDate(profile.eobmf_ruling_date)}
        {/if}
      {:else}
        Unknown
      {/if}
    </span>

    <!-- Data Valid as of -->
    <span class="inline-flex items-center justify-start text-sm md:justify-end">Data Valid as of</span>
    <span class={BADGE_CLASSES}>
      <span class="size-1.5 shrink-0 rounded-full {isDataOutdated ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
      FYE {formattedTaxPeriodEnd}
    </span>

    <!-- Final Return -->
    <!-- {#if isFinalReturn}
      <span class="inline-flex items-center justify-start text-sm md:justify-end">Final Return</span>
      <span class={BADGE_CLASSES}>
        <span class="size-1.5 shrink-0 rounded-full bg-red-500"></span>
        Filed {profile.filings[0]?.tax_year ?? ''}
      </span>
    {/if} -->
  </div>
</div>

<!-- Footer: Approachability -->
<div class="-mx-4 mt-6 flex items-center justify-between gap-6 border-t border-slate-200 bg-slate-50 px-4 py-3 lg:-mx-8 lg:px-8">
  <div class="shrink-0">
    {#if isFinalReturn}
      <span
        class="inline-flex items-center gap-1.5 rounded border border-red-200 bg-red-100 px-2.5 py-1 text-xs text-red-950 transition-colors hover:bg-red-200"
      >
        <span class="size-1.5 shrink-0 rounded-full bg-red-700"></span>
        <span class="font-bold">FINAL RETURN:</span> Tax Year {profile.filings[0]?.tax_year ?? ''}
      </span>
    {:else if hasValidIrsStatus}
      <Approachability {noUnsolicited} {isStaffed} {hasRecentGrants} />
    {:else}
      <span class="inline-flex items-center gap-1.5 rounded bg-transparent px-2.5 py-1 text-xs font-medium text-slate-600">
        <span class="size-1.5 shrink-0 rounded-full bg-amber-500"></span>
        Further research is required for this foundation. Review their IRS status.
      </span>
    {/if}
  </div>

  <div class="max-w-sm text-xs text-balance text-slate-500">
    Foundation tax returns are public records. Grantmakers.io is a free community project that republishes this IRS data.
  </div>
</div>
