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
    eobmfRecognizedExempt: boolean;
    grantCount: number;
  }

  let { organization_name, profile, formattedTaxPeriodEnd, eobmfRecognizedExempt, grantCount }: Props = $props();

  let {
    is_likely_staffed: isStaffed,
    grants_to_preselected_only: noUnsolicited,
    has_recent_grants: hasRecentGrants,
    has_website: hasWebsite,
  } = profile;
  const firstLetter = upperFirstLetter(organization_name);
</script>

<div class="mt-3 flex flex-wrap items-center justify-center gap-6 sm:mt-0 md:justify-between">
  <!-- Left side -->
  <div class="flex grow items-start justify-start gap-4 sm:grow-0 md:items-start">
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
    <div class="relative my-auto w-auto md:flex-none md:px-3 lg:max-w-full">
      <div class="h-full">
        <h5 class="mb-1 w-full text-lg font-semibold text-wrap whitespace-normal text-slate-700 md:max-w-md">{organization_name}</h5>
        <div class="align-left mb-0 flex flex-col text-sm leading-normal font-normal sm:flex-row sm:items-center">
          <strong class="text-slate-700">
            {profile.city},
            {profile.is_foreign && profile.state === 'Foreign' ? profile.country : profile.state}
          </strong>
          {#if profile.has_website}
            <Dot />
            <a href={profile.website} target="_blank" rel="external noopener">
              {profile.website_verbatim?.toLowerCase()}
            </a>
          {/if}
        </div>
      </div>
    </div>
  </div>

  {#if eobmfRecognizedExempt}
    <Approachability {noUnsolicited} {isStaffed} {hasWebsite} {hasRecentGrants} {grantCount} />
  {/if}

  <!-- Right side of box: metadata -->
  <div class="ml-4 grid w-full grid-cols-2 gap-x-2 gap-y-1 text-right md:mt-0 md:ml-2 md:w-auto md:gap-x-4">
    <span class="inline-flex items-center justify-start text-sm md:justify-end">EIN</span>
    <span
      use:copy={{
        text: profile.ein,
        onCopy() {
          toast.success('Copied EIN');
        },
      }}
      class="inline-flex cursor-copy items-center justify-center rounded-md px-2 py-1 text-sm font-medium text-slate-700"
      >{formatEin(profile.ein)}</span
    >
    <span class="inline-flex items-center justify-start text-sm md:justify-end">IRS Status</span>
    {#if profile.eobmf_recognized_exempt && profile.eobmf_ruling_date}
      <span
        class="inline-flex items-center justify-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
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
        class="inline-flex items-center justify-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset"
        >Unknown</span
      >
    {/if}
    <span class="inline-flex items-center justify-start text-sm md:justify-end">Data Valid as of</span>
    {#if !isOutdatedISOString(profile.last_updated_irs)}
      <span
        class="inline-flex items-center justify-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
        >FYE {formattedTaxPeriodEnd}</span
      >
    {:else}
      <span
        class="inline-flex items-center justify-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset"
        >FYE {formattedTaxPeriodEnd}</span
      >
    {/if}
  </div>
</div>
