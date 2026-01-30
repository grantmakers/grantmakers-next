<script lang="ts">
  import { Toaster } from 'svelte-french-toast';
  import People from './people/People.svelte';
  import ContentBoxWrapper from './ContentBoxWrapper.svelte';
  import ContentBoxHeader from './ContentBoxHeader.svelte';
  import SectionAnchor from './SectionAnchor.svelte';
  import SurpriseMe from './topnav/SurpriseMe.svelte';
  import FoundationHeader from './header/FoundationHeader.svelte';
  import GrantsTable from './grants/GrantsTable.svelte';
  import GrantsSearch from '$lib/components/search/GrantsSearch.svelte';
  import { formatTaxPeriodDate } from '@repo/shared/functions/formatters/dates';
  import ContentBoxInterstitial from './ContentBoxInterstitial.svelte';
  import logo from '$lib/assets/images/logo.svg';
  import irsLogo from '$lib/assets/images/irs-logo.webp';
  import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
  import ApplicationGuidelines from './guidelines/ApplicationGuidelines.svelte';
  import BarFinancialTrends from './charts/BarFinancialTrends.svelte';
  import BarFinancialOverview from './charts/BarFinancialOverview.svelte';
  import GrantsSnapshotCard from './grants/GrantsSnapshotCard.svelte';
  import RankingCard from './ranking/RankingCard.svelte';
  import CharitableActivities from './activities/CharitableActivities.svelte';
  import Research from './research/Research.svelte';
  import About from './about/AboutSummaryBox.svelte';
  import CiModal from './community/CiModal.svelte';

  interface Props {
    profile: GrantmakersExtractedDataObj;
    hasSurpriseMeAccess?: boolean;
  }

  let { profile, hasSurpriseMeAccess = false }: Props = $props();

  let organization_name = $derived(profile.organization_name);
  let filings = $derived(profile.filings);
  let people = $derived(profile.people);
  let hasWebsite = $derived(profile.has_website);
  let grantsFacets = $derived(profile.grants_facets);
  let grantsReferenceAttachment = $derived(profile.grants_reference_attachment);
  let hasCharitableActivities = $derived(profile.has_charitable_activities);
  let grantsCurrentTop20 = $derived(profile.grants_current_year_top_20);
  let grantsLastThreeYearsTop20 = $derived(profile.grants_last_three_years_top_20);
  let formattedTaxPeriodEnd: string = $derived(formatTaxPeriodDate(filings[0].tax_period) || 'N/A');
</script>

<Toaster />
<div class="relative flex min-h-screen">
  <!-- Main Wrapper -->
  <div
    class="ease-soft-in-out relative mx-auto h-full w-full max-w-3xl min-w-0 grow rounded-xl px-2 transition-all duration-200 sm:px-6 lg:max-w-7xl lg:px-8"
    id="panel"
  >
    <!-- Main Content -->
    <div class="mx-auto w-full py-6 text-slate-500">
      <!-- Profile header -->
      <ContentBoxWrapper id="overview">
        <div class="mx-auto w-full lg:w-12/12">
          <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
            <ContentBoxHeader title={'IRS Form 990-PF'}>
              <img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} />
            </ContentBoxHeader>
          </div>
        </div>

        <!-- Foundation header -->
        <div
          class="shadow-blur relative flex min-w-0 flex-auto flex-col overflow-hidden rounded-b-2xl border-0 bg-white bg-clip-border bg-center px-4 pt-4 pb-0 lg:px-8 lg:pt-8"
        >
          <FoundationHeader {organization_name} {profile} {formattedTaxPeriodEnd} />
        </div>
      </ContentBoxWrapper>

      <ContentBoxInterstitial message="Grantmakers.io ensures equitable access to a critical information source for nonprofits." />

      <!-- Core Body Sections -->
      <div class="mx-auto mt-6 w-full pb-6 lg:mt-8">
        <!-- Snapshot Boxes - 2 column layout (40/60 split) -->
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_3fr]">
          <!-- Left Column: Two stacked cards -->
          <div class="order-2 flex flex-col gap-5 lg:order-1">
            <!-- Card 1: Ranking -->
            <RankingCard rank={profile.rank} rankTotal={profile.rank_total} assets={profile.assets} />

            <!-- Card 2: Grants Snapshot -->
            <GrantsSnapshotCard
              grantMin={profile.grant_min}
              grantMax={profile.grant_max}
              grantMedian={profile.grant_median}
              grantCount={profile.grant_count}
              {grantsFacets}
              {grantsReferenceAttachment}
              {hasCharitableActivities}
              taxYear={filings[0].tax_year}
              lastUpdatedIrs={profile.last_updated_irs}
            />
          </div>

          <!-- Right Column: People Card - constrained to left column height on desktop -->
          <div class="order-1 flex min-h-0 flex-col lg:relative lg:order-2">
            <ContentBoxWrapper id="people" classes="flex min-h-0 flex-1 flex-col lg:absolute lg:inset-0">
              <div
                class="shadow-soft-xl relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border-0 bg-white bg-clip-border break-words"
              >
                <div class="mb-0 shrink-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                  <ContentBoxHeader title={'People'} sectionId="people">
                    <img src={irsLogo} alt="IRS logo" class="max-h-6 w-auto" height={24} width={48} />
                  </ContentBoxHeader>
                </div>
                <People {people} />
              </div>
            </ContentBoxWrapper>
          </div>
        </div>

        <ContentBoxInterstitial message="Built for nonprofits. Sustained by the generosity of the nonprofits it serves." />

        <!-- Grants -->
        <!-- Full Width Breakout - this section breaks out of the standard page container width to maximize space for the faceted search experience -->
        <!-- When there are no grants, use the standard narrower layout matching Charitable Activities -->
        <div class="mt-6 lg:mt-8">
          {#if profile.grant_count > 0}
            <div class="relative -mx-3 w-auto lg:left-1/2 lg:mx-0 lg:w-screen lg:-translate-x-1/2">
              <div class="mx-auto max-w-screen-2xl px-3 lg:px-8">
                <ContentBoxWrapper id="grantees">
                  <div class="mb-4 w-full">
                    <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white break-words">
                      <div class="mb-0 bg-slate-200 p-4">
                        <div class="flex items-center justify-between">
                          <h2 class="mb-0"><SectionAnchor title="Grantees" sectionId="grantees" /></h2>
                          <span class="hidden text-sm text-slate-600 sm:block">Grants reported on IRS Form 990-PF</span>
                          <img src={irsLogo} alt="IRS logo" class="max-h-6" height={24} width={48} />
                        </div>
                      </div>
                      <div>
                        {#if profile.enable_algolia_search}
                          <GrantsSearch ein={profile.ein} />
                        {:else}
                          <GrantsTable
                            grantCount={profile.grant_count}
                            grantCountLastThreeYears={profile.grant_count_last_three_years}
                            grantsCurrent={grantsCurrentTop20}
                            grantsLastThreeYears={grantsLastThreeYearsTop20}
                            grantsReferenceAttachment={profile.grants_reference_attachment}
                          />
                        {/if}
                        {#if !grantsCurrentTop20}
                          <div class="p-6">Unable to find an available free source of grants data</div>
                        {/if}
                      </div>
                    </div>
                  </div>
                </ContentBoxWrapper>
              </div>
            </div>
          {:else}
            <!-- Empty state: Use narrower layout matching Charitable Activities -->
            <div id="grantees" class="-mx-3 grid grid-cols-1">
              <div class="mb-4 w-full max-w-full px-3">
                <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white break-words">
                  <div class="mb-0 border-b-0 bg-slate-200 p-4">
                    <ContentBoxHeader title={'Grantees'} sectionId="grantees">
                      <img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} />
                    </ContentBoxHeader>
                  </div>
                  <div>
                    <div class="p-6">No grants listed on Form 990-PF</div>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>

        <!-- Charitable Activities -->
        <div id="charitable-activities" class="-mx-3 mt-6 grid grid-cols-1 lg:mt-8">
          <div class="mb-4 w-full max-w-full px-3">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white break-words">
              <div class="mb-0 border-b-0 bg-slate-200 p-4">
                <ContentBoxHeader title={'Charitable Activities'}
                  ><img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} /></ContentBoxHeader
                >
              </div>
              <div>
                {#if profile.has_charitable_activities}
                  <CharitableActivities
                    activities={profile.charitable_activities}
                    areRestatement={profile.charitable_activities_are_restatement_of_grants}
                    totalGiving={profile.total_giving}
                  />
                {:else}
                  <div class="p-6">No Direct Charitable Activities listed on Form 990-PF Part IX-A</div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <ContentBoxInterstitial message="88% of nonprofits have budgets less than $500k. They deserve access too." />

        <!-- About & Guidelines Sections -->
        <div class="-mx-3 mt-6 grid grid-cols-1 md:grid-cols-2 lg:mt-8">
          <!-- Guidelines -->
          <ContentBoxWrapper id="guidelines" classes="flex flex-col">
            <div class="mb-4 h-full w-full max-w-full px-3">
              <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col rounded-2xl border-0 bg-white bg-clip-border break-words">
                <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                  <ContentBoxHeader title={'Application Guidelines'} sectionId="guidelines">
                    <img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} />
                  </ContentBoxHeader>
                </div>
                <ApplicationGuidelines
                  website={hasWebsite ? profile.website : null}
                  websiteIsEmail={profile.website_is_an_email}
                  grantsToPreselectedOnly={profile.grants_to_preselected_only}
                  applicationInfo={profile.grants_application_info}
                  applicationDeadlines={profile.grants_application_deadlines}
                  applicationRestrictions={profile.grants_application_restrictions}
                  applicationContact={profile.grants_application_contact}
                />
              </div>
            </div>
          </ContentBoxWrapper>

          <!-- About -->
          <div class="mb-4 w-full max-w-full px-3 text-slate-700">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col rounded-2xl border-0 bg-white bg-clip-border break-words">
              <About />
            </div>
          </div>
        </div>

        <!-- Financial Sections -->
        <div class="-mx-3 mt-6 grid grid-cols-1 md:grid-cols-2 lg:mt-8">
          <!-- Financial Overview -->
          <ContentBoxWrapper id="financials" classes="h-full">
            <div class="mb-4 w-full max-w-full px-3">
              <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col rounded-2xl border-0 bg-white bg-clip-border break-words">
                <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                  <ContentBoxHeader title={'Financial Overview'} sectionId="financials" />
                </div>
                <div class="p-4">
                  <BarFinancialOverview year1={profile.financial_stats[0]} {formattedTaxPeriodEnd} />
                </div>
              </div>
            </div>
          </ContentBoxWrapper>

          <!-- Financial Trends -->
          <div class="mb-4 w-full max-w-full px-3">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col rounded-2xl border-0 bg-white bg-clip-border break-words">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                <ContentBoxHeader title={'Financial Trends'}>
                  <img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} />
                </ContentBoxHeader>
              </div>
              <div class="grow p-4">
                <BarFinancialTrends
                  orgFinancialStats={profile.financial_stats}
                  lastUpdatedByIrs={profile.last_updated_irs}
                  {formattedTaxPeriodEnd}
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Donation CTA -->
        <div class="-mx-3 mt-6 grid grid-cols-1 pb-4 md:grid-cols-1 lg:mt-8">
          <ContentBoxWrapper id="donate">
            <div class="my-6 hidden md:block lg:my-8">
              <div
                class="shadow-soft-xl relative mx-auto flex w-full max-w-2xl flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-8 text-center ring-1 ring-slate-900/5 lg:p-10"
              >
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <img src={logo} class="inline-block h-6 w-6 rounded-full" alt="Grantmakers.io Logo" height={36} width={36} />
                </div>

                <p class="mb-6 text-lg font-semibold text-slate-900">Grantmakers.io is entirely community-funded</p>
                <a
                  href="/about/donate/"
                  class="inline-flex items-center gap-x-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-95 active:transform"
                >
                  <span>Support Open Data</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <h3 class="mt-6 max-w-md text-slate-600">Ensuring equitable access since 2016</h3>
              </div>
            </div>
          </ContentBoxWrapper>
        </div>

        <!-- Data -->
        <div class="-mx-3 mt-6 grid grid-cols-1 md:grid-cols-1 lg:mt-8">
          <ContentBoxWrapper id="data">
            <div class="mb-4 w-full max-w-full px-3 text-slate-700">
              <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col rounded-2xl border-0 bg-white bg-clip-border break-words">
                <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                  <ContentBoxHeader title={'Further Research'} sectionId="data">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                      <path
                        d="M21.721 12.752a9.711 9.711 0 0 0-.945-5.003 12.754 12.754 0 0 1-4.339 2.708 18.991 18.991 0 0 1-.214 4.772 17.165 17.165 0 0 0 5.498-2.477ZM14.634 15.55a17.324 17.324 0 0 0 .332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 0 0 .332 4.647 17.385 17.385 0 0 0 5.268 0ZM9.772 17.119a18.963 18.963 0 0 0 4.456 0A17.182 17.182 0 0 1 12 21.724a17.18 17.18 0 0 1-2.228-4.605ZM7.777 15.23a18.87 18.87 0 0 1-.214-4.774 12.753 12.753 0 0 1-4.34-2.708 9.711 9.711 0 0 0-.944 5.004 17.165 17.165 0 0 0 5.498 2.477ZM21.356 14.752a9.765 9.765 0 0 1-7.478 6.817 18.64 18.64 0 0 0 1.988-4.718 18.627 18.627 0 0 0 5.49-2.098ZM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 0 0 1.988 4.718 9.765 9.765 0 0 1-7.478-6.816ZM13.878 2.43a9.755 9.755 0 0 1 6.116 3.986 11.267 11.267 0 0 1-3.746 2.504 18.63 18.63 0 0 0-2.37-6.49ZM12 2.276a17.152 17.152 0 0 1 2.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0 1 12 2.276ZM10.122 2.43a18.629 18.629 0 0 0-2.37 6.49 11.266 11.266 0 0 1-3.746-2.504 9.754 9.754 0 0 1 6.116-3.985Z"
                      />
                    </svg>
                  </ContentBoxHeader>
                </div>
                <Research ein={profile.ein} irsObjectId={profile.filings[0].object_id_irs} />
              </div>
            </div>
          </ContentBoxWrapper>
        </div>

        <div class="-mx-3 mt-10 grid grid-cols-1 items-center md:grid-cols-1 lg:mt-16">
          <!-- Bottom CTA -->
          <div class="mt-2 mb-4 flex flex-row items-start justify-center gap-2 p-8">
            <!-- <img src={logo} class="inline-block h-6 w-6 rounded-full" alt="Grantmakers.io Logo" height={36} width={36} /> -->
            <div class="flex flex-col items-center justify-center gap-2">
              <div class="text-lg font-semibold">Looking for another grantmaker?</div>
              <div class="text-sm">Free profiles for over 150,000 US private foundations</div>
              <div class="mt-4 flex flex-col flex-wrap items-center gap-4 md:flex-row">
                <button
                  command="show-modal"
                  commandfor="search-dialog-profiles-compact"
                  type="button"
                  class="bg-grantmakers-orange inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
                    <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
                    <path
                      fill-rule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  Foundation search
                </button>
                {#if hasSurpriseMeAccess}
                  <button
                    type="button"
                    class="inline-flex items-center gap-x-1.5 rounded-md bg-white px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <SurpriseMe />
                  </button>
                {/if}
                <div class="flex flex-row items-center gap-2"></div>
              </div>
            </div>
          </div>
          <!-- Placeholder grid 1 col 1/2 width -->
          <div class="mb-4 w-full max-w-full px-3 text-slate-700"></div>
        </div>
      </div>
    </div>
  </div>
  {#if hasSurpriseMeAccess}
    <SurpriseMe variant="fab" />
  {/if}
</div>
