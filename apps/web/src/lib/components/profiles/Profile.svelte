<script lang="ts">
  import { onMount } from 'svelte';
  import People from './People.svelte';
  import SummaryBoxHeader from './SummaryBoxHeader.svelte';
  import Banner from './Banner.svelte';
  import NavSearch from '../search/Nav.svelte';
  import GrantsTable from './grants/GrantsTable.svelte';
  import Eyes from '../shared/icons/Eyes.svelte';
  import Dot from '../shared/icons/Dot.svelte';
  import { formatTaxPeriodDate, formatDateToMonthYear, formatTaxYear, isOutdatedISOString } from '@shared/functions/formatters/dates';
  import { upperFirstLetter } from '@shared/functions/formatters/names';
  import { humanizeCurrency } from '@shared/functions/formatters/numbers';
  import { formatEin } from '@shared/functions/formatters/ein';
  // import chatgptIcon from '$lib/assets/images/chatgpt.svg';
  // import claudeIcon from '$lib/assets/images/claude.svg';
  import logo from '$lib/assets/images/logo.svg';
  import irsLogo from '$lib/assets/images/irs-logo.webp';
  import { Sparkles, LockOpen, LockClosed, UserGroup, GlobeAlt } from 'svelte-heros-v2';
  import type { GrantmakersExtractedDataObj } from '@shared/typings/grantmakers/all';
  import ApplicationGuidelines from './guidelines/ApplicationGuidelines.svelte';
  import Tip from './alerts/Tip.svelte';
  // import Blink from '../shared/icons/Blink.svelte';
  import BarFinancialTrends from './charts/BarFinancialTrends.svelte';
  import BarFinancialOverview from './charts/BarFinancialOverview.svelte';
  import GrantsSummaryBox from './grants/GrantsSummaryBox.svelte';
  import LogoMark from '../shared/LogoMark.svelte';
  import Blink from '../shared/icons/Blink.svelte';
  import CharitableActivities from './activities/CharitableActivities.svelte';
  import SideNav from './sidenav/SideNav.svelte';

  type ImageModule = {
    default: string;
  };

  interface Props {
    profile: GrantmakersExtractedDataObj;
  }

  let { profile }: Props = $props();

  const aiSummaries: { [key: string]: string } = {
    // The Plant Memorial uses the Claude prompt but in Google AI Studio with Gemini Pro 002
    '010131950':
      'The Plant Memorial Home functions as a private operating foundation, primarily serving as a direct provider of elder care services rather than a traditional grantmaker. Their consistent, hyperlocal giving demonstrates a deep commitment to their immediate community in Maine, specifically focused on subsidized assisted living. They champion practical solutions to the challenges faced by their residents and are unlikely to fund untested programs. Given their operating nature and limited staff, their engagement style is likely transactional rather than relationship-driven. Building a connection with key decision-makers will be essential for any external organization seeking collaboration, though funding opportunities are extremely limited given their focused mission. Their primary value is ensuring the well-being of the elderly they serve directly, viewing their role as a direct service provider.',
    // This suggest the Claude prompt needs to adjusting...they don't donate to nonprofits directly, which is cool, time to move on
    '611913297':
      "Every Org is a supplementary funder, acting as a facilitator rather than a primary grantmaker. Their giving supports a wide range of organizations, suggesting an openness to diverse approaches and a willingness to fund newer, less established ventures. Their online platform indicates a preference for streamlined, tech-forward interactions. While relationship-building might not be their primary focus, their emphasis on accessibility suggests a commitment to empowering both nonprofits and donors. Every Org's mission centers on democratizing philanthropy, indicating a belief in the power of collective giving to solve global problems. They envision their role as a catalyst for change, providing the infrastructure for a more generous world. The best approach is likely through their online platform, highlighting a project's alignment with their values of accessibility and broad impact.",
    '832856275':
      'Expa Org appears to be a supplementary funder, providing substantial but infrequent grants. Their giving pattern suggests a preference for established organizations and initiatives, demonstrated by grants marked as “general support” or “operating support,” rather than early-stage, high-risk ventures. While their grant amounts are significant, their limited staff suggests a streamlined, potentially transaction-focused approach. This likely means cultivating a relationship with key decision-makers is crucial. Geographically focused on their local community and select national partners, Expa Org prioritizes organizations within their network. Their funding choices indicate a commitment to strengthening core organizational capacity and enabling existing programs to scale, playing a supportive role in fostering growth within specific organizations. Direct and concise communication about a project’s alignment with their chosen grantees’ missions and demonstrable impact will likely be most effective.',
    '810718077':
      "The Thierer Family Foundation, based in Chicago, IL, primarily supports organizations located in the Chicago metropolitan area, though some grants extend to other US locations. The foundation has a website, http://thiererfamilyfoundation.org, and appears to have paid staff. While tax filings indicate the foundation only funds pre-selected organizations, further research may be warranted. Giving appears to focus on basic needs, arts & culture, healthcare, and education. Grants range from $1,000 to $165,500, with many grants clustering in the $5,000-$50,000 range and a small number exceeding $50,000. Nonprofits in the Chicago area working in the aforementioned program areas could be a good fit, but should be prepared for additional cultivation given the foundation's history of primarily supporting a smaller, set group of organizations.",
    '510381959':
      'The Harnisch Family Foundation, Inc. is a private foundation supporting primarily charitable purposes. In 2022, they awarded 69 grants ranging from $1,000 to $275,000, with most grants clustered between $1,000 and $49,999. Grantmaking appears to focus on organizations serving women and girls, media/film, and racial equity. The foundation has a history of grantmaking with over 700 grants distributed over multiple years. Geographic giving appears to be national, though New York and California receive a higher volume of funding. With assets of roughly $8.7 million, the foundation appears to be staffed, and lists contact information for grant applications on their website, http://www.thehf.org. Nonprofits focused on issues impacting women and girls, particularly those engaged in media and/or racial equity work, may find pursuing funding to be worthwhile.',
    '131684331':
      'The Ford Foundation is a large, staffed private foundation with assets exceeding $16 billion (2022). Their website, http://www.fordfoundation.org, offers additional information. The foundation supports a variety of causes, but a significant portion of grants appears to be dedicated to social justice initiatives, arts, and international development. Grants range from $75 to over $16 million, with a median grant amount of $100,000. While many grants fall within the $100,000 - $999,999 range, a considerable number are designated as "Matching Gift," suggesting an employee matching program. Excluding these, general operating support is frequently provided. The foundation\'s programs, including the BUILD program, Global Fellowship program, and Art for Justice, constitute a major part of their grantmaking. Geographically, while the foundation supports organizations across the U.S. and internationally, higher concentrations of funding are directed to organizations in New York and the greater Washington D.C. area. Nonprofits working in social justice, particularly those focused on combating inequality, along with arts organizations and international development groups, appear to be the best fit for pursuing further research. The provided application instructions on the tax form indicate an open application process.',
  };

  let {
    // aiSummary,
    // aiSummarySource,
    organization_name,
    filings,
    grants,
    people,
    is_likely_staffed: isStaffed,
    has_website: hasWebsite,
    grants_facets: grantsFacets,
    grants_to_preselected_only: noUnsolicited,
    grants_current_year_top_20: grantsTop20,
    grants_all_years_top_20: grantsAllYearsTop20,
  } = profile;

  const DEFAULT_AVATAR = 'default.png';
  // const aiImgDetails = {
  //   chatgpt: { src: chatgptIcon, width: 280, height: 54, maxHeightClass: 'max-h-6' },
  //   claude: { src: claudeIcon, width: 280, height: 54, maxHeightClass: 'max-h-6' },
  // };

  let avatarImageModule: Promise<ImageModule> | undefined;
  let avatarImage: string | undefined = $state();
  // let sourceName: 'chatgpt' | 'claude';
  // let currentAiIconDetails: { src: string; width: number; height: number; maxHeightClass: string };
  let formattedTaxPeriodEnd: string = $state('N/A');

  // function isAiImgDetailsKey(key: string): key is keyof typeof aiImgDetails {
  //   return key === 'chatgpt' || key === 'claude';
  // }

  onMount(async () => {
    /**
     * Handle generic letter avatars
     */
    const firstLetter = upperFirstLetter(organization_name);
    avatarImageModule = await import(`../../assets/images/icons-letters/svg/${firstLetter}.svg`);
    // @ts-expect-error: Need to properly type Module, from Vite? SvelteKit?
    avatarImage = avatarImageModule ? avatarImageModule?.default : '/logo.svg';

    /**
     * Handle AI Summary logos
     */
    // sourceName = aiSummarySource?.startsWith('chatgpt') ? 'chatgpt' : 'claude';
    // if (isAiImgDetailsKey(sourceName)) {
    //   currentAiIconDetails = aiImgDetails[sourceName];
    // }

    /**
     * Misc formatting helpers
     */
    formattedTaxPeriodEnd = formatTaxPeriodDate(filings[0].tax_period);
  });
</script>

<Banner />
<div class="relative">
  <!-- Left Navigation -->
  <aside
    class="ease-nav-brand z-990 absolute inset-y-0 ml-4 mt-0 block w-full max-w-64 -translate-x-full flex-wrap items-center justify-between overflow-y-auto rounded-2xl border-0 bg-white p-0 py-2 pt-2 text-slate-500 antialiased shadow-none transition-transform duration-200 xl:left-0 xl:translate-x-0 xl:bg-transparent"
    id="sidenav-main"
  >
    <!-- LogoMark -->
    <!-- <div class="p-2">
      <a href="/" class="group m-0 block flex-shrink-0 whitespace-nowrap px-8 py-2 text-sm text-slate-700">
        <div class="flex items-center">
          <div>
            <img src={logo} class="inline-block h-9 w-9 rounded-full" alt="Grantmakers.io Logo" height={36} width={36} />
          </div>
          <div class="ml-1 flex items-center">
            <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Grantmakers.io</span>
          </div>
        </div>
      </a>
    </div> -->
    <!-- Side Navigation -->
    <div class="block max-h-screen w-auto grow basis-full items-center overflow-auto">
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
  <div class="ease-soft-in-out relative h-full rounded-xl transition-all duration-200 xl:ml-64" id="panel">
    <!-- Top Nav -->
    <nav
      class="duration-250 ease-soft-in relative mx-6 flex flex-wrap items-center justify-between rounded-2xl px-0 py-2 shadow-none transition-all lg:flex-nowrap lg:justify-start"
      id="navbarTop"
      data-navbar-scroll="true"
    >
      <div class="flex-wrap-inherit mx-auto flex w-full items-center justify-between px-4 py-1">
        <!-- Breadcrumbs -->
        <nav class="flex flex-wrap items-center">
          <LogoMark isLandingOrFooter={false} />
          <ol class="flex flex-wrap items-center bg-transparent">
            <li
              class="text-sm leading-normal before:float-left before:hidden before:pr-2 before:text-gray-600 before:content-['/'] before:md:block"
            >
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

        <!-- Search -->
        <div class="mt-2 hidden grow items-center justify-end sm:mr-6 sm:mt-0 md:mr-0 md:flex lg:flex lg:basis-auto">
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
        class="shadow-blur relative flex min-w-0 flex-auto flex-col overflow-hidden break-words rounded-2xl border-0 bg-white bg-clip-border bg-center p-4 backdrop-blur"
      >
        <div class="-mx-3 flex flex-wrap items-center justify-center md:justify-between">
          <!-- Left side -->
          <div class="flex items-start space-x-0 md:space-x-4">
            <!-- Icon -->
            <div class="w-auto max-w-full px-3 md:flex-none">
              <div
                class="ease-soft-in-out size-18 relative inline-flex items-center justify-center rounded-xl text-base text-white transition-all duration-200"
              >
                <img
                  src={typeof avatarImage === 'string' ? avatarImage : `/${DEFAULT_AVATAR}`}
                  alt="Foundation First Initial Icon"
                  class="md:shadow-soft-sm size-20 w-full rounded-xl"
                  width="74"
                  height="74"
                />
              </div>
            </div>
            <!-- Name -->
            <div class="relative my-auto w-auto max-w-full flex-none px-3">
              <div class="h-full">
                <h5 class="mb-1">{organization_name}</h5>
                <p class="mb-0 text-sm font-normal leading-normal">
                  <strong class="text-slate-700">
                    {profile.city},
                    {profile.is_foreign && profile.state === 'Foreign' ? profile.country : profile.state}
                  </strong>
                  {#if profile.has_website}
                    <Dot />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer">
                      {profile.website_verbatim?.toLowerCase()}
                    </a>
                  {/if}
                </p>
              </div>
            </div>
          </div>

          <!-- Right side of box: metadata -->
          <div class="ml-4 mt-4 grid grid-cols-2 gap-x-2 gap-y-1 text-right md:ml-2 md:mt-0 md:gap-x-4">
            <span class="inline-flex items-center justify-start text-sm md:justify-end">EIN</span>
            <span
              class="inline-flex items-center justify-center rounded-md bg-slate-50 px-2 py-1 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-700/10"
              >{formatEin(profile.ein)}</span
            >
            <span class="inline-flex items-center justify-start text-sm md:justify-end">IRS Status</span>
            {#if profile.eobmf_recognized_exempt && profile.eobmf_ruling_date}
              <span
                class="inline-flex items-center justify-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                >Since {formatTaxPeriodDate(profile.eobmf_ruling_date)}</span
              >
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
      </div>

      <!-- AI Summary -->
      <div class="shadow-soft-xl relative mt-4 flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
        <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
          <SummaryBoxHeader headerText={'Community Intelligence'}>
            <div class="flex items-center justify-center gap-2">
              <Blink />
            </div>
          </SummaryBoxHeader>
        </div>
        <div class="flex-auto items-start justify-center space-x-2 p-4">
          {#if aiSummaries[profile.ein]}
            <p class="text-sm">{aiSummaries[profile.ein]}</p>
          {:else}
            <div class="rounded-lg border-2 border-dashed border-gray-300 p-6">
              <div class="flex flex-col items-center text-sm text-gray-500">
                <Sparkles variation="solid" />
                <h2 class="mt-2 text-base font-semibold leading-6 text-gray-900">AI Summaries</h2>
                <div class="mt-1 flex flex-row items-center gap-4">
                  🌐 Public data
                  <div>></div>
                  <div class="flex items-center gap-1">
                    <img src={logo} alt="Grantmakers.io Logo" class="wr-0 h-4 w-4" /> Grantmakers.io excerpts
                  </div>
                  <div>+</div>
                  <div class="flex items-center gap-1">
                    <Blink classes={'h-4 w-4'} /> Community curation of AI-generated summaries
                  </div>
                  <div>=</div>
                  💯
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Core Body Sections -->
      <div class="mx-auto mt-4 w-full pb-6">
        <!-- Snapshot Boxes -->
        <div class="-mx-3 mb-4 grid grid-cols-1 space-y-4 md:space-y-0 lg:grid-cols-2 xl:grid-cols-3">
          <!-- Box 2 -->
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
              />
            </div>
          </div>
          <!-- Box 1 -->
          <div class="h-full w-full max-w-full px-3">
            <div class="flex h-full flex-col gap-4">
              <!-- Summary -->
              <div class="shadow-soft-xl relative flex min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
                <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                  <SummaryBoxHeader headerText={'Overview'} />
                </div>

                <div class="flex-auto p-4">
                  <!-- Core stats -->
                  <dl class="grid grid-cols-1 overflow-hidden rounded-lg bg-white p-2">
                    <!-- Assets section -->
                    <dt class="text-center text-sm leading-normal text-inherit">Assets</dt>
                    <dd class="mb-4 text-center text-2xl font-bold text-slate-700">
                      {humanizeCurrency(profile.assets)}
                    </dd>

                    <!-- Approachability section -->
                    <dt class="text-center text-sm leading-normal text-inherit">Approachability</dt>
                    <dd class="flex flex-row items-center justify-center text-2xl font-bold text-slate-700">
                      <!-- Solicitation Status -->
                      <div class="m-1 inline rounded p-2 {!noUnsolicited ? 'bg-green-500' : 'bg-yellow-500'}">
                        {#if !noUnsolicited}
                          <LockOpen variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
                        {:else}
                          <LockClosed variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
                        {/if}
                        <span class="sr-only">Solicitation {!noUnsolicited ? 'Allowed' : 'Not Allowed'}</span>
                      </div>

                      <!-- Staffing Status -->
                      <div class="m-1 inline rounded p-2 {isStaffed ? 'bg-green-500' : 'bg-yellow-500'}">
                        <UserGroup variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
                        <span class="sr-only">Organization {isStaffed ? 'is Staffed' : 'is not Staffed'}</span>
                      </div>

                      <!-- Website Status -->
                      <div class="m-1 inline rounded p-2 {hasWebsite ? 'bg-green-500' : 'bg-yellow-500'}">
                        <GlobeAlt variation="solid" class="h-4 w-4 text-white" aria-hidden="true" />
                        <span class="sr-only">Website {hasWebsite ? 'Available' : 'Not Available'}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>

              <!-- Data Source -->
              <div class="shadow-soft-xl relative flex min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border md:h-full">
                <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                  <SummaryBoxHeader headerText={'Data Source'}>
                    <img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} />
                  </SummaryBoxHeader>
                </div>

                <div class="flex-auto items-center space-y-2 rounded-b-2xl bg-white p-4">
                  <div class="flex flex-col gap-0 p-2">
                    <!-- <img src={irsLogo} alt="IRS logo" class="h-6 w-auto" height={24} width={48}/> -->
                    <p class="text-sm font-bold text-slate-700">IRS Form 990-PF</p>
                    <p class="flex flex-row items-start gap-2 text-sm text-slate-700">Available to the general public at IRS.gov.</p>
                  </div>

                  <hr class="border-1" />

                  <div class="p-2 text-sm text-slate-700">
                    <div class="flex flex-row items-center justify-between">
                      <div>
                        <div class="font-bold">Latest Available Filing</div>
                        <div>Tax Year {formatTaxYear(profile.filings[0].tax_year)} ended {formattedTaxPeriodEnd ?? 'N/A'}</div>
                        <div>Published by the IRS {formatDateToMonthYear(profile.last_updated_irs) ?? 'N/A'}</div>
                      </div>
                      {#if isOutdatedISOString(profile.last_updated_irs)}
                        <div>
                          <Eyes />
                        </div>
                      {/if}
                    </div>
                  </div>
                  <Tip
                    message="Grantmakers.io is not affiliated, associated, authorized, endorsed by, or in any way officially connected with any
                  foundation appearing on the site."
                    includeLogo
                  />
                </div>
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
                    grants={grants || grantsTop20 || grantsAllYearsTop20}
                    grantCount={profile.grant_count_all_years}
                    filingsAvailable={profile.filings.length}
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
                <SummaryBoxHeader headerText={'Direct Charitable Activities'}
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
              <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
                <SummaryBoxHeader headerText={'About Grantmakers.io'}>
                  <img src={logo} alt="Grantmakers.io logo" class="max-h-6 w-full" height={36} width={36} />
                </SummaryBoxHeader>
              </div>
              <div class="flex flex-col gap-6 p-6">
                <div>
                  <div class="text-sm font-bold uppercase text-slate-700">Open Source</div>
                  <p>
                    Grantmakers.io is a free community project ensuring nonprofits unfettered access to the public IRS dataset of Form 990
                    tax filings.
                  </p>
                </div>
                <div>
                  <div class="text-sm font-bold uppercase text-slate-700">Data is Verbatim</div>
                  <p>
                    The project pulls from an open dataset published by the IRS. Data is presented exactly as found in the tax filings.
                    Misspellings and cut off words are common as is the use of ALLCAPS.
                  </p>
                </div>
                <div>
                  <div class="text-sm font-bold uppercase text-slate-700">Historical Data</div>
                  <p>
                    Be mindful of the limitations of using historical data in your research - the data represents past activity and may not
                    reflect current foundation priorities.
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
