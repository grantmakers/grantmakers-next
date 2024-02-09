<script lang="ts">
  import People from './People.svelte';

  import SummaryBoxHeaderBadge from './SummaryBoxHeaderBadge.svelte';
  import SummaryBoxHeader from './SummaryBoxHeader.svelte';
  import { onMount } from 'svelte';
  import Banner from './Banner.svelte';
  import NavSearch from '../search/Nav.svelte';
  import GrantsTable from './grants/GrantsTable.svelte';
  import Dot from '../shared/icons/Dot.svelte';
  import ArrowRight from '../shared/icons/ArrowRight.svelte';
  import { formatDate } from '$lib/utils/dates';
  import { upperFirstLetter } from '@utils/names';
  import chatgptIcon from '$lib/assets/images/chatgpt.svg';
  import claudeIcon from '$lib/assets/images/claude.svg';
  import irsLogo from '$lib/assets/images/irs-logo.png';
  import { Clock, Sparkles, CheckCircle, XCircle } from 'svelte-heros-v2';
  import { convertToCapitalCase } from '@shared/functions/formatters/names';
  import type { GrantmakersExtractedDataObj } from '@shared/typings/grantmakers/grants';

  type ImageModule = {
    default: string;
  };

  export let profile: GrantmakersExtractedDataObj;

  let {
    aiSummary,
    aiSummarySource,
    organization_name,
    filings,
    grants,
    people,
    eobmf_recognized_exempt: isRecognized,
    grants_to_preselected_only: noUnsolicited,
    is_likely_staffed: isStaffed,
  } = profile;

  console.log(JSON.stringify(profile));

  const DEFAULT_AVATAR = 'default.png';
  const firstLetter = upperFirstLetter(organization_name);
  const aiImgDetails = {
    chatgpt: { src: chatgptIcon, width: 280, height: 54, maxHeightClass: 'max-h-6' },
    claude: { src: claudeIcon, width: 280, height: 54, maxHeightClass: 'max-h-6' },
  };

  let avatarImageModule: Promise<ImageModule> | undefined;
  let avatarImage: string;
  let sourceName: 'chatgpt' | 'claude';
  let currentAiIconDetails: { src: string; width: number; height: number; maxHeightClass: string };
  let formattedTaxPeriodEnd: string;
  let grantsMedianIndex: number;
  let medianGrantName: string;

  function isAiImgDetailsKey(key: string): key is keyof typeof aiImgDetails {
    return key === 'chatgpt' || key === 'claude';
  }

  onMount(async () => {
    avatarImageModule = await import(`../../assets/images/icons-letters/svg/${firstLetter}.svg`);
    // @ts-expect-error: Need to properly type Module, from Vite? SvelteKit?
    avatarImage = avatarImageModule ? avatarImageModule?.default : '/logo.svg';
    sourceName = aiSummarySource?.startsWith('chatgpt') ? 'chatgpt' : 'claude';
    if (isAiImgDetailsKey(sourceName)) {
      currentAiIconDetails = aiImgDetails[sourceName];
    }

    formattedTaxPeriodEnd = formatDate(filings[0].tax_period);

    if (profile.grant_count > 0 && grants) {
      grantsMedianIndex = Math.floor(profile.grant_count / 2);
      let medianGrantNameUnformatted = grants[grantsMedianIndex].name;
      medianGrantName = convertToCapitalCase(medianGrantNameUnformatted);
    }
  });
</script>

<Banner />
<div class="relative">
  <!-- Left Navigation -->
  <aside
    class="ease-nav-brand z-990 absolute inset-y-0 ml-4 mt-0 block w-full max-w-64 -translate-x-full flex-wrap items-center justify-between overflow-y-auto rounded-2xl border-0 bg-white p-0 py-2 pt-2 text-slate-500 antialiased shadow-none transition-transform duration-200 xl:left-0 xl:translate-x-0 xl:bg-transparent"
    id="sidenav-main"
  >
    <div class="h-20">
      <!-- <i class="hidden absolute top-0 right-0 hidden p-4 opacity-50 cursor-pointer fa fa-times text-slate-400 xl:hidden" sidenav-close="" aria-hidden="true"></i> -->
      <a href="/" class="group m-0 block flex-shrink-0 whitespace-nowrap px-8 py-2 text-sm text-slate-700">
        <div class="flex items-center">
          <div>
            <img src="/logo.svg" class="inline-block h-9 w-9 rounded-full" alt="Grantmakers.io Logo" height={36} width={36} />
          </div>
          <div class="ml-1 flex items-center">
            <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">Grantmakers.io</span>
          </div>
        </div>
      </a>
    </div>
    <div class="block max-h-screen w-auto grow basis-full items-center overflow-auto">
      <ul class="mb-0 flex flex-col pl-0">
        <!-- Overview Nav -->
        <li class="mt-0.5 w-full">
          <a
            class="shadow-soft-xl ease-nav-brand mx-4 my-0 flex items-center whitespace-nowrap rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors"
            href="/foo"
            aria-label="Overview"
          >
            <div
              class="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-gradient-to-tl from-purple-700 to-pink-500 bg-center stroke-0 text-center xl:p-2.5"
            >
              <svg
                width="12px"
                height="12px"
                viewBox="0 0 42 42"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>overview</title>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-1869.000000, -293.000000)" fill="#FFFFFF" fill-rule="nonzero">
                    <g transform="translate(1716.000000, 291.000000)">
                      <g transform="translate(153.000000, 2.000000)">
                        <path
                          class="opacity-60"
                          d="M12.25,17.5 L8.75,17.5 L8.75,1.75 C8.75,0.78225 9.53225,0 10.5,0 L31.5,0 C32.46775,0 33.25,0.78225 33.25,1.75 L33.25,12.25 L29.75,12.25 L29.75,3.5 L12.25,3.5 L12.25,17.5 Z"
                        ></path>
                        <path
                          class=""
                          d="M40.25,14 L24.5,14 C23.53225,14 22.75,14.78225 22.75,15.75 L22.75,38.5 L19.25,38.5 L19.25,22.75 C19.25,21.78225 18.46775,21 17.5,21 L1.75,21 C0.78225,21 0,21.78225 0,22.75 L0,40.25 C0,41.21775 0.78225,42 1.75,42 L40.25,42 C41.21775,42 42,41.21775 42,40.25 L42,15.75 C42,14.78225 41.21775,14 40.25,14 Z M12.25,36.75 L7,36.75 L7,33.25 L12.25,33.25 L12.25,36.75 Z M12.25,29.75 L7,29.75 L7,26.25 L12.25,26.25 L12.25,29.75 Z M35,36.75 L29.75,36.75 L29.75,33.25 L35,33.25 L35,36.75 Z M35,29.75 L29.75,29.75 L29.75,26.25 L35,26.25 L35,29.75 Z M35,22.75 L29.75,22.75 L29.75,19.25 L35,19.25 L35,22.75 Z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <span class="ease-soft pointer-events-none ml-1 opacity-100 duration-300">Overview</span>
          </a>
        </li>

        <!-- Grants Nav -->
        <li class="mt-0.5 w-full">
          <a
            class="ease-nav-brand mx-4 my-0 flex items-center whitespace-nowrap px-4 py-2.5 text-sm transition-colors"
            href="/foo"
            aria-label="Grants"
          >
            <div
              class="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center fill-current stroke-0 text-center xl:p-2.5"
            >
              <svg
                width="12px"
                height="12px"
                viewBox="0 0 43 36"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>grants</title>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-2169.000000, -745.000000)" fill="#FFFFFF" fill-rule="nonzero">
                    <g transform="translate(1716.000000, 291.000000)">
                      <g transform="translate(453.000000, 454.000000)">
                        <path
                          class="fill-slate-800 opacity-60"
                          d="M43,10.7482083 L43,3.58333333 C43,1.60354167 41.3964583,0 39.4166667,0 L3.58333333,0 C1.60354167,0 0,1.60354167 0,3.58333333 L0,10.7482083 L43,10.7482083 Z"
                        ></path>
                        <path
                          class="fill-slate-800"
                          d="M0,16.125 L0,32.25 C0,34.2297917 1.60354167,35.8333333 3.58333333,35.8333333 L39.4166667,35.8333333 C41.3964583,35.8333333 43,34.2297917 43,32.25 L43,16.125 L0,16.125 Z M19.7083333,26.875 L7.16666667,26.875 L7.16666667,23.2916667 L19.7083333,23.2916667 L19.7083333,26.875 Z M35.8333333,26.875 L28.6666667,26.875 L28.6666667,23.2916667 L35.8333333,23.2916667 L35.8333333,26.875 Z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <span class="ease-soft pointer-events-none ml-1 opacity-100 duration-300">Grants</span>
          </a>
        </li>

        <!-- People Nav -->
        <li class="mt-0.5 w-full">
          <a
            class="ease-nav-brand mx-4 my-0 flex items-center whitespace-nowrap px-4 py-2.5 text-sm transition-colors"
            href="/foo"
            aria-label="People"
          >
            <div
              class="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5"
            >
              <svg
                width="12px"
                height="12px"
                viewBox="0 0 45 40"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>People</title>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-1716.000000, -439.000000)" fill="#FFFFFF" fill-rule="nonzero">
                    <g transform="translate(1716.000000, 291.000000)">
                      <g transform="translate(0.000000, 148.000000)">
                        <path
                          class="fill-slate-800 opacity-60"
                          d="M46.7199583,10.7414583 L40.8449583,0.949791667 C40.4909749,0.360605034 39.8540131,0 39.1666667,0 L7.83333333,0 C7.1459869,0 6.50902508,0.360605034 6.15504167,0.949791667 L0.280041667,10.7414583 C0.0969176761,11.0460037 -1.23209662e-05,11.3946378 -1.23209662e-05,11.75 C-0.00758042603,16.0663731 3.48367543,19.5725301 7.80004167,19.5833333 L7.81570833,19.5833333 C9.75003686,19.5882688 11.6168794,18.8726691 13.0522917,17.5760417 C16.0171492,20.2556967 20.5292675,20.2556967 23.494125,17.5760417 C26.4604562,20.2616016 30.9794188,20.2616016 33.94575,17.5760417 C36.2421905,19.6477597 39.5441143,20.1708521 42.3684437,18.9103691 C45.1927731,17.649886 47.0084685,14.8428276 47.0000295,11.75 C47.0000295,11.3946378 46.9030823,11.0460037 46.7199583,10.7414583 Z"
                        ></path>
                        <path
                          class="fill-slate-800"
                          d="M39.198,22.4912623 C37.3776246,22.4928106 35.5817531,22.0149171 33.951625,21.0951667 L33.92225,21.1107282 C31.1430221,22.6838032 27.9255001,22.9318916 24.9844167,21.7998837 C24.4750389,21.605469 23.9777983,21.3722567 23.4960833,21.1018359 L23.4745417,21.1129513 C20.6961809,22.6871153 17.4786145,22.9344611 14.5386667,21.7998837 C14.029926,21.6054643 13.533337,21.3722507 13.0522917,21.1018359 C11.4250962,22.0190609 9.63246555,22.4947009 7.81570833,22.4912623 C7.16510551,22.4842162 6.51607673,22.4173045 5.875,22.2911849 L5.875,44.7220845 C5.875,45.9498589 6.7517757,46.9451667 7.83333333,46.9451667 L19.5833333,46.9451667 L19.5833333,33.6066734 L27.4166667,33.6066734 L27.4166667,46.9451667 L39.1666667,46.9451667 C40.2482243,46.9451667 41.125,45.9498589 41.125,44.7220845 L41.125,22.2822926 C40.4887822,22.4116582 39.8442868,22.4815492 39.198,22.4912623 Z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <span class="ease-soft pointer-events-none ml-1 opacity-100 duration-300">People</span>
          </a>
        </li>

        <!-- Guidelines Nav -->
        <li class="mt-0.5 w-full">
          <a
            class="ease-nav-brand mx-4 my-0 flex items-center whitespace-nowrap px-4 py-2.5 text-sm transition-colors"
            href="/foo"
            aria-label="Guidelines"
          >
            <div
              class="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5"
            >
              <svg
                width="12px"
                height="12px"
                viewBox="0 0 42 42"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>guidelines</title>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-2319.000000, -291.000000)" fill="#FFFFFF" fill-rule="nonzero">
                    <g transform="translate(1716.000000, 291.000000)">
                      <g transform="translate(603.000000, 0.000000)">
                        <path
                          class="fill-slate-800"
                          d="M22.7597136,19.3090182 L38.8987031,11.2395234 C39.3926816,10.9925342 39.592906,10.3918611 39.3459167,9.89788265 C39.249157,9.70436312 39.0922432,9.5474453 38.8987261,9.45068056 L20.2741875,0.1378125 L20.2741875,0.1378125 C19.905375,-0.04725 19.469625,-0.04725 19.0995,0.1378125 L3.1011696,8.13815822 C2.60720568,8.38517662 2.40701679,8.98586148 2.6540352,9.4798254 C2.75080129,9.67332903 2.90771305,9.83023153 3.10122239,9.9269862 L21.8652864,19.3090182 C22.1468139,19.4497819 22.4781861,19.4497819 22.7597136,19.3090182 Z"
                        ></path>
                        <path
                          class="fill-slate-800 opacity-60"
                          d="M23.625,22.429159 L23.625,39.8805372 C23.625,40.4328219 24.0727153,40.8805372 24.625,40.8805372 C24.7802551,40.8805372 24.9333778,40.8443874 25.0722402,40.7749511 L41.2741875,32.673375 L41.2741875,32.673375 C41.719125,32.4515625 42,31.9974375 42,31.5 L42,14.241659 C42,13.6893742 41.5522847,13.241659 41,13.241659 C40.8447549,13.241659 40.6916418,13.2778041 40.5527864,13.3472318 L24.1777864,21.5347318 C23.8390024,21.7041238 23.625,22.0503869 23.625,22.429159 Z"
                        ></path>
                        <path
                          class="fill-slate-800 opacity-60"
                          d="M20.4472136,21.5347318 L1.4472136,12.0347318 C0.953235098,11.7877425 0.352562058,11.9879669 0.105572809,12.4819454 C0.0361450918,12.6208008 6.47121774e-16,12.7739139 0,12.929159 L0,30.1875 L0,30.1875 C0,30.6849375 0.280875,31.1390625 0.7258125,31.3621875 L19.5528096,40.7750766 C20.0467945,41.0220531 20.6474623,40.8218132 20.8944388,40.3278283 C20.963859,40.1889789 21,40.0358742 21,39.8806379 L21,22.429159 C21,22.0503869 20.7859976,21.7041238 20.4472136,21.5347318 Z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <span class="ease-soft pointer-events-none ml-1 opacity-100 duration-300">Guidelines</span>
          </a>
        </li>

        <!-- Financials Nav -->
        <li class="mt-0.5 w-full">
          <a
            class="ease-nav-brand mx-4 my-0 flex items-center whitespace-nowrap px-4 py-2.5 text-sm transition-colors"
            href="/foo"
            aria-label="Financials"
          >
            <div
              class="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5"
            >
              <svg
                width="12px"
                height="12px"
                viewBox="0 0 40 40"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>financials</title>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-2020.000000, -442.000000)" fill="#FFFFFF" fill-rule="nonzero">
                    <g transform="translate(1716.000000, 291.000000)">
                      <g transform="translate(304.000000, 151.000000)">
                        <polygon
                          class="fill-slate-800 opacity-60"
                          points="18.0883333 15.7316667 11.1783333 8.82166667 13.3333333 6.66666667 6.66666667 0 0 6.66666667 6.66666667 13.3333333 8.82166667 11.1783333 15.315 17.6716667"
                        ></polygon>
                        <path
                          class="fill-slate-800 opacity-60"
                          d="M31.5666667,23.2333333 C31.0516667,23.2933333 30.53,23.3333333 30,23.3333333 C29.4916667,23.3333333 28.9866667,23.3033333 28.48,23.245 L22.4116667,30.7433333 L29.9416667,38.2733333 C32.2433333,40.575 35.9733333,40.575 38.275,38.2733333 L38.275,38.2733333 C40.5766667,35.9716667 40.5766667,32.2416667 38.275,29.94 L31.5666667,23.2333333 Z"
                        ></path>
                        <path
                          class="fill-slate-800"
                          d="M33.785,11.285 L28.715,6.215 L34.0616667,0.868333333 C32.82,0.315 31.4483333,0 30,0 C24.4766667,0 20,4.47666667 20,10 C20,10.99 20.1483333,11.9433333 20.4166667,12.8466667 L2.435,27.3966667 C0.95,28.7083333 0.0633333333,30.595 0.00333333333,32.5733333 C-0.0583333333,34.5533333 0.71,36.4916667 2.11,37.89 C3.47,39.2516667 5.27833333,40 7.20166667,40 C9.26666667,40 11.2366667,39.1133333 12.6033333,37.565 L27.1533333,19.5833333 C28.0566667,19.8516667 29.01,20 30,20 C35.5233333,20 40,15.5233333 40,10 C40,8.55166667 39.685,7.18 39.1316667,5.93666667 L33.785,11.285 Z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <span class="ease-soft pointer-events-none ml-1 opacity-100 duration-300">Financials</span>
          </a>
        </li>

        <!-- Search Profile Items -->
        <li class="mt-4 w-full">
          <h6 class="ml-2 pl-6 text-xs font-bold uppercase leading-tight opacity-60">Your Search Profile</h6>
        </li>
        <li class="mt-0.5 w-full">
          <a
            class="ease-nav-brand mx-4 my-0 flex items-center whitespace-nowrap px-4 py-2.5 text-sm transition-colors"
            href="/foo"
            aria-label="Profile"
          >
            <div
              class="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5"
            >
              <svg
                width="12px"
                height="12px"
                viewBox="0 0 46 42"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>Mission & Values</title>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-1717.000000, -291.000000)" fill="#FFFFFF" fill-rule="nonzero">
                    <g transform="translate(1716.000000, 291.000000)">
                      <g transform="translate(1.000000, 0.000000)">
                        <path
                          class="fill-slate-800 opacity-60"
                          d="M45,0 L26,0 C25.447,0 25,0.447 25,1 L25,20 C25,20.379 25.214,20.725 25.553,20.895 C25.694,20.965 25.848,21 26,21 C26.212,21 26.424,20.933 26.6,20.8 L34.333,15 L45,15 C45.553,15 46,14.553 46,14 L46,1 C46,0.447 45.553,0 45,0 Z"
                        ></path>
                        <path
                          class="fill-slate-800"
                          d="M22.883,32.86 C20.761,32.012 17.324,31 13,31 C8.676,31 5.239,32.012 3.116,32.86 C1.224,33.619 0,35.438 0,37.494 L0,41 C0,41.553 0.447,42 1,42 L25,42 C25.553,42 26,41.553 26,41 L26,37.494 C26,35.438 24.776,33.619 22.883,32.86 Z"
                        ></path>
                        <path
                          class="fill-slate-800"
                          d="M13,28 C17.432,28 21,22.529 21,18 C21,13.589 17.411,10 13,10 C8.589,10 5,13.589 5,18 C5,22.529 8.568,28 13,28 Z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <span class="ease-soft pointer-events-none ml-1 opacity-100 duration-300">Mission & Values</span>
          </a>
        </li>
        <li class="mt-0.5 w-full">
          <a class="ease-nav-brand mx-4 my-0 flex items-center whitespace-nowrap px-4 py-2.5 text-sm transition-colors" href="/foo">
            <div
              class="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5"
            >
              <svg
                width="12px"
                height="12px"
                viewBox="0 0 40 44"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>Avg Grant Size</title>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-1870.000000, -591.000000)" fill="#FFFFFF" fill-rule="nonzero">
                    <g transform="translate(1716.000000, 291.000000)">
                      <g transform="translate(154.000000, 300.000000)">
                        <path
                          class="fill-slate-800 opacity-60"
                          d="M40,40 L36.3636364,40 L36.3636364,3.63636364 L5.45454545,3.63636364 L5.45454545,0 L38.1818182,0 C39.1854545,0 40,0.814545455 40,1.81818182 L40,40 Z"
                        ></path>
                        <path
                          class="fill-slate-800"
                          d="M30.9090909,7.27272727 L1.81818182,7.27272727 C0.814545455,7.27272727 0,8.08727273 0,9.09090909 L0,41.8181818 C0,42.8218182 0.814545455,43.6363636 1.81818182,43.6363636 L30.9090909,43.6363636 C31.9127273,43.6363636 32.7272727,42.8218182 32.7272727,41.8181818 L32.7272727,9.09090909 C32.7272727,8.08727273 31.9127273,7.27272727 30.9090909,7.27272727 Z M18.1818182,34.5454545 L7.27272727,34.5454545 L7.27272727,30.9090909 L18.1818182,30.9090909 L18.1818182,34.5454545 Z M25.4545455,27.2727273 L7.27272727,27.2727273 L7.27272727,23.6363636 L25.4545455,23.6363636 L25.4545455,27.2727273 Z M25.4545455,20 L7.27272727,20 L7.27272727,16.3636364 L25.4545455,16.3636364 L25.4545455,20 Z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <span class="ease-soft pointer-events-none ml-1 opacity-100 duration-300">Avg Grant Size</span>
          </a>
        </li>
        <li class="mt-0.5 w-full">
          <a class="ease-nav-brand mx-4 my-0 flex items-center whitespace-nowrap px-4 py-2.5 text-sm transition-colors" href="/foo">
            <div
              class="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5"
            >
              <svg
                width="12px"
                height="20px"
                viewBox="0 0 40 40"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <title>Geographic Focus</title>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-1720.000000, -592.000000)" fill="#FFFFFF" fill-rule="nonzero">
                    <g transform="translate(1716.000000, 291.000000)">
                      <g transform="translate(4.000000, 301.000000)">
                        <path
                          class="fill-slate-800"
                          d="M39.3,0.706666667 C38.9660984,0.370464027 38.5048767,0.192278529 38.0316667,0.216666667 C14.6516667,1.43666667 6.015,22.2633333 5.93166667,22.4733333 C5.68236407,23.0926189 5.82664679,23.8009159 6.29833333,24.2733333 L15.7266667,33.7016667 C16.2013871,34.1756798 16.9140329,34.3188658 17.535,34.065 C17.7433333,33.98 38.4583333,25.2466667 39.7816667,1.97666667 C39.8087196,1.50414529 39.6335979,1.04240574 39.3,0.706666667 Z M25.69,19.0233333 C24.7367525,19.9768687 23.3029475,20.2622391 22.0572426,19.7463614 C20.8115377,19.2304837 19.9992882,18.0149658 19.9992882,16.6666667 C19.9992882,15.3183676 20.8115377,14.1028496 22.0572426,13.5869719 C23.3029475,13.0710943 24.7367525,13.3564646 25.69,14.31 C26.9912731,15.6116662 26.9912731,17.7216672 25.69,19.0233333 L25.69,19.0233333 Z"
                        ></path>
                        <path
                          class="fill-slate-800 opacity-60"
                          d="M1.855,31.4066667 C3.05106558,30.2024182 4.79973884,29.7296005 6.43969145,30.1670277 C8.07964407,30.6044549 9.36054508,31.8853559 9.7979723,33.5253085 C10.2353995,35.1652612 9.76258177,36.9139344 8.55833333,38.11 C6.70666667,39.9616667 0,40 0,40 C0,40 0,33.2566667 1.855,31.4066667 Z"
                        ></path>
                        <path
                          class="fill-slate-800 opacity-60"
                          d="M17.2616667,3.90166667 C12.4943643,3.07192755 7.62174065,4.61673894 4.20333333,8.04166667 C3.31200265,8.94126033 2.53706177,9.94913142 1.89666667,11.0416667 C1.5109569,11.6966059 1.61721591,12.5295394 2.155,13.0666667 L5.47,16.3833333 C8.55036617,11.4946947 12.5559074,7.25476565 17.2616667,3.90166667 L17.2616667,3.90166667 Z"
                        ></path>
                        <path
                          class="fill-slate-800 opacity-60"
                          d="M36.0983333,22.7383333 C36.9280725,27.5056357 35.3832611,32.3782594 31.9583333,35.7966667 C31.0587397,36.6879974 30.0508686,37.4629382 28.9583333,38.1033333 C28.3033941,38.4890431 27.4704606,38.3827841 26.9333333,37.845 L23.6166667,34.53 C28.5053053,31.4496338 32.7452344,27.4440926 36.0983333,22.7383333 L36.0983333,22.7383333 Z"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <span class="ease-soft pointer-events-none ml-1 opacity-100 duration-300">Geographic Focus</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>

  <!-- Main Content -->
  <div class="ease-soft-in-out relative h-full max-h-screen rounded-xl transition-all duration-200 xl:ml-64" id="panel">
    <nav
      class="duration-250 ease-soft-in relative mx-6 flex flex-wrap items-center justify-between rounded-2xl px-0 py-2 shadow-none transition-all lg:flex-nowrap lg:justify-start"
      id="navbarTop"
      data-navbar-scroll="true"
    >
      <div class="flex-wrap-inherit mx-auto flex w-full items-center justify-between px-4 py-1">
        <!-- Breadcrumbs wrapper -->
        <nav>
          <ol class="mr-12 flex flex-wrap rounded-lg bg-transparent pt-1 sm:mr-16">
            <li class="text-sm leading-normal">
              <a class="text-slate-700 opacity-50" href="/foo">Foundation Profiles</a>
            </li>
            <li
              class="pl-2 text-sm capitalize leading-normal text-slate-700 before:float-left before:pr-2 before:text-gray-600 before:content-['/']"
              aria-current="page"
            >
              IRS Form 990PF
            </li>
          </ol>
          <!-- <h6 class="mb-0 font-bold capitalize">A historic snapshot as of tax year { formattedTaxYear }</h6> -->
        </nav>

        <!-- Search -->
        <div class="mt-2 flex grow items-center justify-end sm:mr-6 sm:mt-0 md:mr-0 lg:flex lg:basis-auto">
          <NavSearch />
        </div>
      </div>
    </nav>

    <!-- Main -->
    <div class="mx-auto w-full px-6 py-6 text-slate-500">
      <!-- Foundation header -->
      <div
        class="shadow-blur relative flex min-w-0 flex-auto flex-col overflow-hidden break-words rounded-2xl border-0 bg-white bg-clip-border bg-center p-4 backdrop-blur"
      >
        <div class="-mx-3 flex flex-wrap items-center">
          <div class="w-auto max-w-full flex-none px-3">
            <div
              class="ease-soft-in-out size-18 relative inline-flex items-center justify-center rounded-xl text-base text-white transition-all duration-200"
            >
              <!-- src={foundationIcon()} -->
              <img
                src={typeof avatarImage === 'string' ? avatarImage : `/${DEFAULT_AVATAR}`}
                alt="Foundation First Initial Icon"
                class="shadow-soft-sm size-20 w-full rounded-xl"
                width="74"
                height="74"
              />
            </div>
          </div>
          <div class="my-auto w-auto max-w-full flex-none px-3">
            <div class="h-full">
              <h5 class="mb-1">{organization_name}</h5>
              <p class="mb-0 text-sm font-normal leading-normal">
                <strong class="text-slate-700">
                  {profile.city},
                  {profile.is_foreign && profile.state === 'Foreign' ? profile.country : profile.state}
                </strong>
                {#if profile.website}
                  <Dot />
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    {profile.website_verbatim?.toLowerCase()}
                  </a>
                  <!-- {:else}
                  {profile.website_verbatim} -->
                {/if}
              </p>
            </div>
          </div>
          <!-- Right-side Foundation Box -->
          <div class="mx-auto mt-4 w-full max-w-full px-3 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none">
            <div class="flex grow gap-x-3 rounded-xl bg-yellow-50 px-4 py-3">
              <div class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <Clock variation="solid" />
              </div>
              <div>
                <div class="flex-items my-0 flex justify-between text-sm/6">
                  <div><strong class="dark:text-zinc-200">Historical Data</strong></div>
                  <div>Fiscal year {formattedTaxPeriodEnd}</div>
                </div>
                <p class="my-0 mt-0.5 text-sm/6">
                  This profile is based on the foundation's latest IRS Form 990-PF tax filing. The data is freely available to the general
                  public via <a href="https://apps.irs.gov/app/eos/" target="_blank" rel="noopener noreferrer">IRS.gov</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="removable mx-auto mt-4 w-full pb-6">
        <!-- Summary Boxes -->
        <div class="-mx-3 grid grid-cols-1 lg:grid-cols-3">
          <!-- Box 1 -->
          <div class="lg-max:mt-6 mb-4 w-full max-w-full px-3">
            <!-- Summary -->
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-white p-4 pb-0">
                <div class="flex w-full flex-row items-center justify-between">
                  <h6 class="mb-0">Summary</h6>
                  {#if aiSummarySource && currentAiIconDetails}
                    <img
                      src={currentAiIconDetails.src}
                      class={`relative ${currentAiIconDetails?.maxHeightClass} w-full basis-0 text-sm text-white`}
                      alt={`${sourceName} logo`}
                      width={currentAiIconDetails.width}
                      height={currentAiIconDetails.height}
                    />
                  {/if}
                </div>
              </div>
              <div class="flex-auto p-4">
                <!-- TODO Add blank state for no aiSummary -->
                {#if aiSummary}
                  <p class="text-sm leading-normal">{aiSummary}</p>
                {:else}
                  <div class="rounded-lg border-2 border-dashed border-gray-300 p-6">
                    <div class="flex flex-col items-center text-sm text-gray-500">
                      <Sparkles variation="solid" />
                      <h2 class="mt-2 text-base font-semibold leading-6 text-gray-900">AI Summaries</h2>
                      <p class="mt-1">Grantmakers.io extracts key data while AI packages it easy to digest summaries</p>
                      <a class="mt-1" href="/profiles/v1/510381959">View an example <ArrowRight /></a>
                    </div>
                  </div>
                {/if}

                <!-- Foundation Metadata -->
                <ul class="mb-0 mt-4 flex flex-col rounded-lg pl-0">
                  <li class="flex justify-between rounded-t-lg border-0 bg-white px-4 py-2 pl-0 pt-0 text-sm leading-normal text-inherit">
                    <div>
                      <strong class="text-slate-700">EIN</strong>
                    </div>
                    <div>
                      {profile.ein}
                    </div>
                  </li>
                  <li class="flex justify-between border-0 border-t-0 bg-white px-4 py-2 pl-0 text-sm leading-normal text-inherit">
                    <div>
                      <strong class="text-slate-700">Website</strong>
                    </div>
                    <div>
                      {#if profile.website}
                        <a href={profile.website} target="_blank">
                          {profile.website_verbatim?.toLowerCase()}
                        </a>
                      {:else}
                        {profile.website_verbatim}
                      {/if}
                    </div>
                  </li>
                  <li class="flex justify-between border-0 border-t-0 bg-white px-4 py-2 pl-0 text-sm leading-normal text-inherit">
                    <div>
                      <strong class="text-slate-700">Tax Year End</strong>
                    </div>
                    <div>
                      {formattedTaxPeriodEnd}
                    </div>
                  </li>
                  <li class="flex justify-between border-0 border-t-0 bg-white px-4 py-2 pl-0 text-sm leading-normal text-inherit">
                    <div>
                      <strong class="text-slate-700">IRS Ruling Date</strong>
                    </div>
                    <div class="text-right">
                      {profile.eobmf_ruling_date ? formatDate(profile.eobmf_ruling_date) : 'N/A'}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Box 2 -->
          <div class="lg-max:mt-6 mb-4 w-full max-w-full px-3">
            <!-- Grant History -->
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-white p-4 pb-0">
                <SummaryBoxHeader headerText={'Grant Highlights'}>
                  {#if filings}
                    <span
                      class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-100/75"
                      >Tax year {filings[0]?.tax_year}</span
                    >
                  {/if}
                </SummaryBoxHeader>
              </div>
              <div class="mb-6 flex h-full flex-col justify-between p-4">
                <ul class="mb-0 flex flex-col rounded-lg pl-0">
                  {#if grants && grants[0]}
                    <!-- Median -->
                    {#if grants.length > 7}
                      {#each grants.slice(0, 1) as grant, i}
                        <li class="relative block rounded-t-lg border-0 bg-white px-2 py-2 text-sm leading-6">
                          <h3 class="mb-0 flex items-center justify-between text-sm font-normal tracking-normal text-slate-700">
                            <div class="mr-4 overflow-hidden text-ellipsis whitespace-nowrap">
                              {i + 1 + ') ' + convertToCapitalCase(grant.name)}
                            </div>
                            <div>
                              {grant.amount.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                maximumFractionDigits: 0,
                              })}
                            </div>
                          </h3>
                        </li>
                      {/each}

                      <li class="relative block rounded-lg bg-zinc-100 p-2 text-sm leading-6">
                        <div class="mb-0 flex items-center justify-between text-sm font-normal tracking-normal text-slate-700">
                          <div class="mr-4 overflow-hidden text-ellipsis whitespace-nowrap">
                            {grantsMedianIndex})&nbsp;{medianGrantName}
                          </div>
                          <div>
                            {grants[grantsMedianIndex]?.amount?.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              maximumFractionDigits: 0,
                            })}
                          </div>
                        </div>
                        <!-- <div class="text-slate-500">
                          {grants[grantsMedianIndex]?.purpose}
                        </div> -->
                      </li>
                    {/if}

                    <!-- Smallest -->
                    <!-- <h6
                      class="text-grantmakers-blue m-0 mb-1 mt-2 flex w-full items-center justify-center gap-1 text-xs font-thin uppercase leading-tight"
                    ></h6> -->
                    {#each grants.slice(-1) as grant, i}
                      <li class="relative block rounded-t-lg border-0 bg-white px-2 py-2 text-sm leading-6">
                        <h3 class="flex items-center justify-between text-sm font-normal tracking-normal text-slate-700">
                          <div class="mr-4 overflow-hidden text-ellipsis whitespace-nowrap">
                            {profile.grant_count + (i + 1 - 2) + ') ' + convertToCapitalCase(grant.name)}
                          </div>
                          <div>
                            {grant.amount.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              maximumFractionDigits: 0,
                            })}
                          </div>
                        </h3>
                      </li>
                    {/each}
                  {/if}
                </ul>
                <div class="flex justify-center">
                  <button
                    type="button"
                    class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                    >View All Grants</button
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Box 3 -->
          <div class="lg-max:mt-6 mb-4 w-full max-w-full px-3">
            <!-- Fast Facts -->
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-white p-4 pb-0">
                <SummaryBoxHeader headerText={'Approachability'}>
                  <SummaryBoxHeaderBadge variant={isRecognized ? 'positive' : 'negative'}>
                    EO<span class="mx-0.5">
                      {#if isRecognized}
                        <CheckCircle variation="solid" size="12" />
                      {:else}
                        <XCircle variation="solid" size="12" />
                      {/if}
                    </span>BMF
                  </SummaryBoxHeaderBadge>
                </SummaryBoxHeader>
              </div>
              <div class="mb-6 flex h-full flex-col justify-between p-4">
                <div>
                  <ul class="mb-0 flex flex-col rounded-lg py-2">
                    <!-- Pre-selected orgs only? -->
                    <li class="relative block rounded-t-lg border-0 bg-white px-0 py-1 text-inherit">
                      <h3
                        class="flex items-center text-sm font-normal tracking-normal {!noUnsolicited ? 'text-green-500' : 'text-rose-500'}"
                      >
                        {#if !noUnsolicited}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
                            <path
                              d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 0 1-1.5 0V6.75a3.75 3.75 0 1 0-7.5 0v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1-3 3H3.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3h9v-3c0-2.9 2.35-5.25 5.25-5.25Z"
                            />
                          </svg>
                        {:else}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
                            <path
                              fill-rule="evenodd"
                              d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        {/if}
                        <span class="ml-3 text-slate-500"
                          >{noUnsolicited ? 'Pre-selected applicants only' : 'Possibly accepts unsolicited applications'}</span
                        >
                      </h3>
                    </li>

                    <!-- Is staffed? -->
                    <li class="relative block rounded-t-lg border-0 bg-white px-0 py-1 text-inherit">
                      <h3 class="flex items-center text-sm font-normal tracking-normal {isStaffed ? 'text-green-500' : 'text-rose-500'}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
                          <path
                            fill-rule="evenodd"
                            d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z"
                          ></path>
                        </svg>

                        <span class="ml-3 text-slate-500"
                          >{isStaffed ? 'The foundation is likely staffed' : 'The foundation is not likely staffed'}</span
                        >
                      </h3>
                    </li>
                  </ul>
                  <div class="py-2">
                    <div class="rounded-lg bg-zinc-100 p-4 text-sm font-light">
                      <div class="flex items-center">
                        <div class="text-xs">
                          Items are pulled directly from a historical IRS tax filing. Be mindful of this major limitation.
                        </div>
                        <img src={irsLogo} class="h-6 w-12" alt="IRS Logo" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-center">
                  <button
                    type="button"
                    class="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                    >View Application Guidelines</button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Grants -->
        <div class="-mx-3 grid grid-cols-1">
          <div class="lg-max:mt-6 mb-4 w-full max-w-full px-3">
            <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
              <div class="mb-0 rounded-t-2xl border-b-0 bg-white p-4 pb-0">
                <GrantsTable {grants} />
              </div>
            </div>
          </div>
        </div>
        <div class="-mx-3 grid grid-cols-1">
          <!-- People -->
          <People {people} />
        </div>
      </div>
    </div>
    <!-- Footer -->
    <footer class="pt-4">
      <div class="mx-auto w-full px-6">
        <div class="-mx-3 flex flex-wrap items-center lg:justify-between">
          <div class="mb-6 mt-0 w-full max-w-full shrink-0 px-3 lg:mb-0 lg:w-1/2 lg:flex-none">
            <div class="text-size-sm text-center leading-normal text-slate-500 lg:text-left">
              <!-- <i class="fa fa-heart" aria-hidden="true"></i> -->
              © 2024, made with ❤️ and ☕ by
              <a href="https://www.chadkruse.com" class="font-semibold text-slate-700" target="_blank">Chad Kruse</a>
            </div>
          </div>
          <div class="mt-0 w-full max-w-full shrink-0 px-3 lg:w-1/2 lg:flex-none">
            <ul class="mb-0 flex list-none flex-wrap justify-center pl-0 lg:justify-end">
              <li class="nav-item">
                <a
                  href="https://www.grantmakers.io/about/"
                  class="ease-soft-in-out text-size-sm block px-4 pb-1 pt-0 font-normal text-slate-500 transition-colors"
                  target="_blank">The Project</a
                >
              </li>
              <li class="nav-item">
                <a
                  href="https://www.grantmakers.io/about/the-dataset/"
                  class="ease-soft-in-out text-size-sm block px-4 pb-1 pt-0 font-normal text-slate-500 transition-colors"
                  target="_blank">The Dataset</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</div>
