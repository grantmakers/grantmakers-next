<script lang="ts">
  import { Toaster } from 'svelte-french-toast';
  import People from './people/People.svelte';
  import ContentBoxWrapper from './ContentBoxWrapper.svelte';
  import ContentBoxHeader from './ContentBoxHeader.svelte';
  import NavSearch from './topnav/Nav.svelte';
  import SurpriseMe from './topnav/SurpriseMe.svelte';
  import FoundationHeader from './header/FoundationHeader.svelte';
  import GrantsTable from './grants/GrantsTable.svelte';
  import { formatTaxPeriodDate } from '@repo/shared/functions/formatters/dates';
  import logo from '$lib/assets/images/logo.svg';
  import irsLogo from '$lib/assets/images/irs-logo.webp';
  import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
  import ApplicationGuidelines from './guidelines/ApplicationGuidelines.svelte';
  import BarFinancialTrends from './charts/BarFinancialTrends.svelte';
  import BarFinancialOverview from './charts/BarFinancialOverview.svelte';
  import GrantsSummaryBox from './grants/GrantsSummaryBox.svelte';
  import LogoMark from '../shared/LogoMark.svelte';
  import CharitableActivities from './activities/CharitableActivities.svelte';
  import Rank from './ranking/Rank.svelte';
  import DataSource from './about/DataSourceSummaryBox.svelte';
  import Research from './research/Research.svelte';
  import About from './about/AboutSummaryBox.svelte';
  import type { AutocompleteInstance } from '@repo/shared/typings/algolia/autocomplete';
  import { browser } from '$app/environment';
  import CiModal from './community/CiModal.svelte';

  interface Props {
    profile: GrantmakersExtractedDataObj;
  }

  let { profile }: Props = $props();

  let {
    organization_name,
    filings,
    people,
    has_website: hasWebsite,
    grants_facets: grantsFacets,
    grants_reference_attachment: grantsReferenceAttachment,
    has_charitable_activities: hasCharitableActivities,
    grants_current_year_top_20: grantsCurrentTop20,
    grants_last_three_years_top_20: grantsLastThreeYearsTop20,
  } = profile;

  let formattedTaxPeriodEnd: string = $derived(formatTaxPeriodDate(filings[0].tax_period) || 'N/A');

  let autocompleteInstance: AutocompleteInstance | null = $state(null);

  function handleAutocompleteInit(instance: AutocompleteInstance) {
    autocompleteInstance = instance;
  }

  let openSearch = () => {
    if (browser) {
      autocompleteInstance?.setIsOpen(true);
    }
  };

  let sidebarWidthClass = 'w-64';
</script>

<Toaster />
<div class="relative flex min-h-screen">
  <!-- Left Navigation -->
  <aside
    class="ease-nav-brand z-990 sticky top-0 ml-4 hidden h-screen {sidebarWidthClass} shrink-0 overflow-y-auto rounded-2xl border-0 bg-white p-0 py-2 pt-2 text-slate-500 antialiased shadow-none transition-transform duration-200 md:block xl:left-0 xl:translate-x-0 xl:bg-transparent"
    id="sidenav-main"
  >
    <div class="flex h-full flex-row md:flex-col">
      <div class="mx-auto ml-3 flex w-full flex-col items-start p-4 lg:mb-10">
        <LogoMark isLandingOrFooter={false} />
        <div class="ml-10 text-sm"></div>
      </div>
      <SideNav />
    </div>
  </aside>

  <!-- Main Wrapper -->
  <div class="ease-soft-in-out relative h-full grow rounded-xl transition-all duration-200" id="panel">
    <!-- Top Nav -->
    <nav
      class="duration-250 ease-soft-in relative mx-6 flex flex-wrap items-center justify-between rounded-2xl px-0 py-2 shadow-none transition-all lg:flex-nowrap lg:justify-start"
      id="navbarTop"
      data-navbar-scroll="true"
    >
      <div class="flex-wrap-inherit mx-auto flex w-full items-center justify-between px-4 py-1">
        <!-- Breadcrumbs -->
        <nav class="flex w-full flex-wrap items-center justify-between md:w-fit">
          <div class="block md:hidden">
            <LogoMark isLandingOrFooter={false} />
          </div>
          <div>
            <a
              type="button"
              href="/profiles"
              class="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 md:hidden"
              >All profiles</a
            >
          </div>

          <ol class="hidden flex-wrap items-center bg-transparent md:flex">
            <li class="text-sm leading-normal">
              <a class="text-slate-700" href="/profiles">Foundation Profiles</a>
            </li>
            <li
              class="pl-2 text-sm capitalize leading-normal text-slate-700 before:float-left before:pr-2 before:text-gray-600 before:content-['/']"
              aria-current="page"
            >
              {organization_name}
            </li>
          </ol>
        </nav>

        <!-- Top Nav -->
        <div class="mt-2 hidden grow items-center justify-end gap-4 sm:mr-6 sm:mt-0 md:mr-0 md:flex lg:flex lg:basis-auto">
          <SurpriseMe />
          <NavSearch {handleAutocompleteInit} />
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="mx-auto w-full px-6 py-6 text-slate-500">
      <!-- Profile header -->
      <ContentBoxWrapper id="overview">
        <div class="lg:w-12/12 relative top-2 z-20 mx-auto w-full">
          <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
            <ContentBoxHeader title={'IRS Form 990-PF'}>
              <img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} />
            </ContentBoxHeader>
          </div>
        </div>

        <!-- Foundation header -->
        <div
          class="shadow-blur relative flex min-w-0 flex-auto flex-col overflow-hidden rounded-2xl border-0 bg-white bg-clip-border bg-center p-4"
        >
          <FoundationHeader
            {organization_name}
            {profile}
            {formattedTaxPeriodEnd}
            eobmfRecognizedExempt={profile.eobmf_recognized_exempt}
            grantCount={profile.grant_count}
          />
        </div>
      </ContentBoxWrapper>

      <!-- Community Intelligence Modal Body-->
      <CiModal ein={profile.ein} />

      <!-- Placeholder wrapper -->
      <div class="shadow-soft-xl relative mt-4 flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
        <!-- Content goes here -->
      </div>

      <!-- Core Body Sections -->
      <div class="mx-auto mt-4 w-full pb-6">
        <!-- Snapshot Boxes -->
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <!-- Grants Box (First on desktop, third on mobile) -->
          <div class="order-3 xl:order-1">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                <ContentBoxHeader title={'Grants Snapshot'} />
              </div>
              <GrantsSummaryBox
                grantMin={profile.grant_min}
                grantMax={profile.grant_max}
                grantMedian={profile.grant_median}
                grantCount={profile.grant_count}
                {grantsFacets}
                {grantsReferenceAttachment}
                {hasCharitableActivities}
                taxPeriod={profile.filings[0].tax_period}
                eobmfStatus={profile.eobmf_recognized_exempt}
              />
            </div>
          </div>

          <!-- Ranking & Data Source Boxes (Second on desktop, first on mobile) -->
          <div class="order-1 xl:order-2">
            <div class="flex h-full flex-col gap-4">
              <!-- Ranking (First on mobile) -->
              <div class="shadow-soft-xl relative flex min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
                <Rank rank={profile.rank} rankTotal={profile.rank_total} assets={profile.assets} />
              </div>

              <!-- Data Source (Second on mobile) -->
              <div class="shadow-soft-xl relative flex min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border md:h-full">
                <DataSource taxYear={filings[0].tax_year} {formattedTaxPeriodEnd} lastUpdatedIrs={profile.last_updated_irs} />
              </div>
            </div>
          </div>

          <!-- People Box (Third on desktop, fourth on mobile) -->
          <div class="order-4 xl:order-3">
            <ContentBoxWrapper id="people" classes="flex h-full">
              <div
                class="shadow-soft-xl relative flex h-full w-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border"
              >
                <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                  <ContentBoxHeader title={'People'} />
                </div>
                <!-- @ts-expect-error Mixing Svelte versions causes issues with passed in props -->
                <People {people} />
              </div>
            </ContentBoxWrapper>
          </div>
        </div>

        <!-- Interstitial Message -->
        <div class="mb-4 mt-2 flex flex-row items-start justify-center gap-2 p-8">
          <img src={logo} class="inline-block h-6 w-6 rounded-full" alt="Grantmakers.io Logo" height={36} width={36} />
          <div>Ensuring equitable access to a critical information source since 2016</div>
        </div>

        <!-- Grants -->
        <div class="-mx-3 grid grid-cols-1">
          <ContentBoxWrapper id="grants">
            <div class="mb-4 w-full max-w-full px-3">
              <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col overflow-hidden break-words rounded-2xl bg-white">
                <div class="mb-0 bg-slate-200 p-4">
                  <ContentBoxHeader title={'Grants'}
                    ><img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} /></ContentBoxHeader
                  >
                </div>
                <div>
                  <!-- Static Table - this will be replaced by an Algolia table eventually -->
                  <GrantsTable
                    grantCount={profile.grant_count}
                    grantCountLastThreeYears={profile.grant_count_last_three_years}
                    grantsCurrent={grantsCurrentTop20}
                    grantsLastThreeYears={grantsLastThreeYearsTop20}
                    grantsReferenceAttachment={profile.grants_reference_attachment}
                  />
                  {#if !grantsCurrentTop20}
                    <div class="p-6">Unable to find an available free source of grants data</div>
                  {/if}
                  {#if grantsCurrentTop20 && grantsCurrentTop20.length === 0}
                    <div class="p-6">No grants made.</div>
                  {/if}
                </div>
              </div>
            </div>
          </ContentBoxWrapper>
        </div>

        <!-- Charitable Activities -->
        <div id="charitable-activites" class="-mx-3 grid grid-cols-1">
          <div class="mb-4 w-full max-w-full px-3">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col overflow-hidden break-words rounded-2xl bg-white">
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
                  />
                {:else}
                  <div class="p-6">No Direct Charitable Activities listed on Form 990-PF Part IX-A</div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Interstitial Message -->
        <div class="mb-4 mt-2 flex flex-row items-start justify-center gap-2 p-8">
          <img src={logo} class="inline-block h-6 w-6 rounded-full" alt="Grantmakers.io Logo" height={36} width={36} />
          <div class="flex flex-col items-center justify-center gap-2">
            <div class="font-normal">88% of nonprofits have budgets less than $500k. Grantmakers.io is built for them.</div>
          </div>
        </div>

        <!-- About & Guidelines Sections -->
        <div class="-mx-3 grid grid-cols-1 md:grid-cols-2">
          <!-- Guidelines -->
          <ContentBoxWrapper id="guidelines" classes="flex flex-col">
            <div class="mb-4 h-full w-full max-w-full px-3">
              <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
                <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                  <ContentBoxHeader title={'Application Guidelines'}>
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
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <About />
            </div>
          </div>
        </div>

        <!-- Financial Sections -->
        <div class="-mx-3 grid grid-cols-1 md:grid-cols-2">
          <!-- Financial Overview -->
          <ContentBoxWrapper id="financials">
            <div class="mb-4 w-full max-w-full px-3">
              <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
                <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                  <ContentBoxHeader title={'Financial Overview'} />
                </div>
                <div class="p-4">
                  <BarFinancialOverview year1={profile.financial_stats[0]} {formattedTaxPeriodEnd} />
                </div>
              </div>
            </div>
          </ContentBoxWrapper>

          <!-- Financial Trends -->
          <div class="mb-4 w-full max-w-full px-3">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                <ContentBoxHeader title={'Financial Trends'} />
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

        <div class="-mx-3 grid grid-cols-1 md:grid-cols-1">
          <!-- Research -->
          <div class="mb-4 w-full max-w-full px-3 text-slate-700">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <Research ein={profile.ein} irsObjectId={profile.filings[0].object_id_irs} />
            </div>
          </div>
        </div>

        <div class="-mx-3 mt-12 grid grid-cols-1 items-center md:grid-cols-1">
          <!-- Bottom CTA -->
          <div class="mb-4 mt-2 flex flex-row items-start justify-center gap-2 p-8">
            <!-- <img src={logo} class="inline-block h-6 w-6 rounded-full" alt="Grantmakers.io Logo" height={36} width={36} /> -->
            <div class="flex flex-col items-center justify-center gap-2">
              <div class="text-lg font-semibold">Looking for another grantmaker?</div>
              <div class="text-sm">Free profiles for over 150,000 US private foundations</div>
              <div class="mt-4 flex flex-col flex-wrap items-center gap-4 md:flex-row">
                <button
                  type="button"
                  class="inline-flex items-center gap-x-1.5 rounded-md bg-grantmakers-orange px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onclick={openSearch}
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
                <button
                  type="button"
                  class="inline-flex items-center gap-x-1.5 rounded-md bg-white px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <SurpriseMe />
                </button>
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
</div>
