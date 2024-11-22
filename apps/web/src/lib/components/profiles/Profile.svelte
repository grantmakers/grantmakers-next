<script lang="ts">
  import { Toaster } from 'svelte-french-toast';
  import People from './people/People.svelte';
  import SummaryBoxHeader from './SummaryBoxHeader.svelte';
  import Banner from './Banner.svelte';
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
  import SideNav from './sidenav/SideNav.svelte';
  import CommunityIntelligence from './community/CommunityIntelligence.svelte';
  import Overview from './overview/Overview.svelte';
  import DataSource from './about/DataSource.svelte';

  interface Props {
    profile: GrantmakersExtractedDataObj;
  }

  let { profile }: Props = $props();

  let {
    organization_name,
    filings,
    // grants,
    people,
    has_website: hasWebsite,
    grants_facets: grantsFacets,
    grants_reference_attachment: grantsReferenceAttachment,
    has_charitable_activities: hasCharitableActivities,
    grants_current_year_top_20: grantsCurrentTop20,
    grants_all_years_top_20: grantsAllYearsTop20,
  } = profile;

  let formattedTaxPeriodEnd: string = $derived(formatTaxPeriodDate(filings[0].tax_period) || 'N/A');
</script>

<Toaster />
<Banner />
<div class="relative flex min-h-screen">
  <!-- Left Navigation -->
  <aside
    class="ease-nav-brand z-990 sticky top-0 ml-4 hidden h-screen w-64 shrink-0 overflow-y-auto rounded-2xl border-0 bg-white p-0 py-2 pt-2 text-slate-500 antialiased shadow-none transition-transform duration-200 md:block xl:left-0 xl:translate-x-0 xl:bg-transparent"
    id="sidenav-main"
  >
    <div class="flex h-full flex-col">
      <div class="mx-auto ml-3 flex w-full flex-col items-start p-4 lg:mb-10">
        <LogoMark isLandingOrFooter={false} />
        <div class="ml-10 text-sm"></div>
      </div>
      <SideNav />

      <!-- <div class="mx-4 p-2">
        <button
          type="button"
          class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mx-auto h-8 w-8 text-gray-400"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>

          <span class="mt-2 block text-sm font-semibold text-gray-900">Enter your<br />Search Criteria</span>
        </button>
      </div> -->
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
        <nav class="flex flex-wrap items-center">
          <!-- <LogoMark isLandingOrFooter={false} /> -->
          <ol class="flex flex-wrap items-center bg-transparent">
            <li class="text-sm leading-normal">
              <a class="text-slate-700" href="/profiles">Foundation Profiles</a>
            </li>
            <li
              class="hidden pl-2 text-sm capitalize leading-normal text-slate-700 before:float-left before:pr-2 before:text-gray-600 before:content-['/'] md:block"
              aria-current="page"
            >
              {organization_name}
            </li>
          </ol>
        </nav>

        <!-- Top Nav -->
        <div class="mt-2 hidden grow items-center justify-end gap-4 sm:mr-6 sm:mt-0 md:mr-0 md:flex lg:flex lg:basis-auto">
          <SurpriseMe />
          <NavSearch />
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="mx-auto w-full px-6 py-6 text-slate-500">
      <!-- Alert -->
      <div class="lg:w-12/12 relative top-2 z-20 mx-auto w-full">
        <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
          <SummaryBoxHeader headerText={'IRS Form 990-PF'}>
            <img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} />
          </SummaryBoxHeader>
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

      <!-- Placeholder wrapper -->
      <div class="shadow-soft-xl relative mt-4 flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
        <!-- Content goes here -->
      </div>

      <!-- Core Body Sections -->
      <div class="mx-auto mt-4 w-full pb-6">
        <!-- Snapshot Boxes -->
        <div class="-mx-3 mb-4 grid grid-cols-1 space-y-4 md:space-y-0 lg:grid-cols-2 xl:grid-cols-3">
          <!-- Box 1 -->
          <div class="h-full w-full max-w-full px-3">
            <!-- Grant History -->
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                <SummaryBoxHeader headerText={'Grants Snapshot'} />
              </div>
              <GrantsSummaryBox
                grantMin={profile.grant_min}
                grantMax={profile.grant_max}
                grantMedian={profile.grant_median}
                grantCount={profile.grant_count}
                {grantsFacets}
                {grantsReferenceAttachment}
                {hasCharitableActivities}
              />
            </div>
          </div>
          <!-- Box 2 -->
          <div class="h-full w-full max-w-full px-3">
            <div class="flex h-full flex-col gap-4">
              <!-- Summary -->
              <div class="shadow-soft-xl relative flex min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
                <Overview rank={profile.rank} rankTotal={profile.rank_total} assets={profile.assets} />
              </div>

              <!-- Data Source -->
              <div class="shadow-soft-xl relative flex min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border md:h-full">
                <DataSource taxYear={filings[0].tax_year} {formattedTaxPeriodEnd} lastUpdatedIrs={profile.last_updated_irs} />
              </div>
            </div>
          </div>

          <!-- Box 3 -->
          <div class="h-full w-full max-w-full px-3">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                <SummaryBoxHeader headerText={'People'} />
              </div>
              <!-- @ts-expect-error Mixing Svelte versions causes issues with passed in props -->
              <People {people} />
            </div>
          </div>
        </div>

        <!-- Hello Message -->
        <div class="mb-4 mt-2 flex flex-row items-start justify-center gap-2 p-8">
          <img src={logo} class="inline-block h-6 w-6 rounded-full" alt="Grantmakers.io Logo" height={36} width={36} />
          <div>Grantmakers.io is an open source project built by changemakers for future changemakers</div>
        </div>

        <!-- Grants -->
        <div class="-mx-3 grid grid-cols-1">
          <div class="mb-4 w-full max-w-full px-3">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                <SummaryBoxHeader headerText={'Grants'}
                  ><img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} /></SummaryBoxHeader
                >
              </div>
              <div>
                {#if grantsFacets}
                  <GrantsTable
                    grantsAllYears={grantsAllYearsTop20}
                    grantsCurrent={grantsCurrentTop20}
                    grantCount={profile.grant_count}
                    grantCountAllYears={profile.grant_count_all_years}
                    filingsAvailable={profile.filings.length}
                    {grantsReferenceAttachment}
                  />
                {:else}
                  <div class="p-6">Unable to find an available free source of grants data</div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Charitable Activities -->
        <div class="-mx-3 grid grid-cols-1">
          <div class="mb-4 w-full max-w-full px-3">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                <SummaryBoxHeader headerText={'Charitable Activities'}
                  ><img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} /></SummaryBoxHeader
                >
              </div>
              <div>
                {#if profile.has_charitable_activities}
                  <CharitableActivities
                    activities={profile.charitable_activities}
                    areRestatement={profile.charitable_activities_are_restatement_of_grants}
                  />
                {:else}
                  <div class="p-6">No Direct Charitable Activities listed on Form 990 PF Part IX-A</div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- About & Guidelines Sections -->
        <div class="-mx-3 grid grid-cols-1 md:grid-cols-2">
          <!-- Guidelines -->
          <div class="mb-4 w-full max-w-full px-3">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                <SummaryBoxHeader headerText={'Application Guidelines'} anchorText={'guidelines'}
                  ><img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} /></SummaryBoxHeader
                >
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

          <!-- About -->
          <div class="mb-4 w-full max-w-full px-3 text-slate-700">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <CommunityIntelligence ein={profile.ein} />
            </div>
          </div>
        </div>

        <!-- Financial Sections -->
        <div class="-mx-3 grid grid-cols-1 md:grid-cols-2">
          <!-- Financial Overview -->
          <div class="mb-4 w-full max-w-full px-3">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                <SummaryBoxHeader headerText={'Financial Overview'} anchorText={'financials'} />
              </div>
              <div class="p-4">
                <BarFinancialOverview
                  year1={profile.financial_stats[0]}
                  orgCurrentTaxYear={profile.financial_stats[0].tax_year}
                  {formattedTaxPeriodEnd}
                />
              </div>
            </div>
          </div>

          <!-- Financial Trends -->
          <div class="mb-4 w-full max-w-full px-3">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                <SummaryBoxHeader headerText={'Financial Trends'} anchorText={'financial trends'} />
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
      </div>
    </div>
  </div>
</div>
