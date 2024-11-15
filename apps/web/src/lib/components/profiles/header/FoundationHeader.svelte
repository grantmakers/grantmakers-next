<script lang="ts">
  import Approachability from './Approachability.svelte';
  import Dot from '$lib/components/shared/icons/Dot.svelte';
  import LetterAvatar from '$lib/components/shared/avatars/LetterAvatar.svelte';
  import { formatEin } from '@shared/functions/formatters/ein';
  import { formatTaxPeriodDate, isOutdatedISOString } from '@shared/functions/formatters/dates';
  import { upperFirstLetter } from '@shared/functions/formatters/names';
  import type { GrantmakersExtractedDataObj } from '@shared/typings/grantmakers/all';

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
    has_website: hasWebsite,
  } = profile;
  const firstLetter = upperFirstLetter(organization_name);
</script>

<div class="flex flex-wrap items-center justify-center gap-6 md:justify-between">
  <!-- Left side -->
  <div class="flex items-start gap-4 md:items-start">
    <!-- Icon -->
    <div class="mt-1 w-auto max-w-full md:mt-0 md:flex-none">
      <div
        class="ease-soft-in-out relative inline-flex size-12 items-center justify-center rounded-xl text-base text-white transition-all duration-200 md:size-20"
      >
        {#if firstLetter !== ''}
          <LetterAvatar letter={firstLetter} size="lg" />
        {:else}
          <img
            src="/default.png"
            alt="Foundation First Initial Icon"
            class="md:shadow-soft-sm size-12 w-full rounded-xl md:size-20"
            width="74"
            height="74"
          />
        {/if}
      </div>
    </div>
    <!-- Name -->
    <div class="relative my-auto w-auto max-w-full flex-none md:px-3">
      <div class="h-full">
        <h5 class="mb-1 w-full max-w-md whitespace-normal text-wrap">{organization_name}</h5>
        <div class="mb-0 text-sm font-normal leading-normal">
          <strong class="text-slate-700">
            {profile.city},
            {profile.is_foreign && profile.state === 'Foreign' ? profile.country : profile.state}
          </strong>
          {#if profile.has_website}
            <a href={profile.website} target="_blank" rel="noopener noreferrer">
              <Dot />
              {profile.website_verbatim?.toLowerCase()}
            </a>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <Approachability {noUnsolicited} {isStaffed} {hasWebsite} {hasRecentGrants} />

  <!-- Right side of box: metadata -->
  <div class="ml-4 grid w-full grid-cols-2 gap-x-2 gap-y-1 text-right md:ml-2 md:mt-0 md:w-auto md:gap-x-4">
    <span class="inline-flex items-center justify-start text-sm md:justify-end">EIN</span>
    <span
      class="inline-flex items-center justify-center rounded-md bg-slate-50 px-2 py-1 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-700/10"
      >{formatEin(profile.ein)}</span
    >
    <span class="inline-flex items-center justify-start text-sm md:justify-end">IRS Status</span>
    {#if profile.eobmf_recognized_exempt && profile.eobmf_ruling_date}
      <span
        class="inline-flex items-center justify-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
      >
        <!-- Capture malformed EOBMF ruling date - 4.4k of 150k -->
        {#if profile.eobmf_ruling_date === '000000'}
          Recognized
        {:else}
          Since {formatTaxPeriodDate(profile.eobmf_ruling_date)}
        {/if}
      </span>
    {:else}
      <span
        class="inline-flex items-center justify-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
        >Unknown</span
      >
    {/if}
    <span class="inline-flex items-center justify-start text-sm md:justify-end">Data Valid as of</span>
    {#if !isOutdatedISOString(profile.last_updated_irs)}
      <span
        class="inline-flex items-center justify-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
        >FYE {formattedTaxPeriodEnd}</span
      >
    {:else}
      <span
        class="inline-flex items-center justify-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
        >FYE {formattedTaxPeriodEnd}</span
      >
    {/if}
  </div>
</div>
