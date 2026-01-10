<script lang="ts">
  import { donors } from '@repo/shared/data/public/donors';
  import { formatDateToMonthYear } from '@repo/shared/functions/formatters/dates';

  interface Donor {
    initials: string;
    total: number;
    recurring: boolean;
    joined: string; // ISODate YYYY-MM-DD
    count: number;
  }

  const sortedDonors = donors.slice().sort((a, b) => b.joined.localeCompare(a.joined));

  const title = '100% Community Supported';
  const bubbleChartDescription = 'Every dot represents someone who decided this project matters.';
  const description = 'Individual supporters fund 100% of operating costs. No sponsors. No grants. No platforms. Just people like you.';
  const bullets = ['Nearly a decade of open access', 'Annual budget $200', 'Fully independent', 'Average gift $12'];

  // Helper to calculate bubble size based on total donation
  const getScale = (total: Donor['total']) => {
    const min = 25;
    const max = 50;
    const scale = Math.min(min + total * 0.35, max);
    return scale;
  };

  // Helper to determine if donor should show white border
  // Border indicates multiple contributions (recurring OR multiple one-time gifts)
  const shouldShowBorder = (donor: Donor): boolean => {
    return donor.recurring || donor.count > 1;
  };

  // Track which donor is currently hovered
  let hoveredId = $state<string | null>(null);
</script>

<div class="overflow-hidden bg-white py-24 sm:py-32">
  <div class="relative isolate">
    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div
        class="mx-auto flex max-w-2xl flex-col gap-16 bg-white/75 px-6 py-16 shadow-lg ring-1 ring-gray-900/5 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:py-20 xl:gap-x-20 xl:px-20"
      >
        <!-- Left side: Donor Bubbles (replaces image) -->
        <div
          class="hidden h-96 w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 p-6 lg:flex lg:aspect-square lg:h-auto lg:max-w-sm lg:flex-none lg:flex-wrap"
        >
          {#each sortedDonors as donor, i}
            {@const id = i.toString()}
            {@const hasBorder = shouldShowBorder(donor)}
            {@const isHovered = hoveredId === id}
            <div
              class="group relative flex items-center justify-center transition-all duration-300"
              style="width: {getScale(donor.total)}px; height: {getScale(donor.total)}px;"
              onmouseenter={() => (hoveredId = id)}
              onmouseleave={() => (hoveredId = null)}
              role="button"
              tabindex="0"
            >
              <!-- Donor Bubble -->
              <div
                class="flex h-full w-full cursor-help items-center justify-center rounded-full shadow-sm transition-all"
                class:border-2={hasBorder}
                class:border-white={hasBorder}
                class:z-20={isHovered}
                class:scale-110={isHovered}
                class:shadow-xl={isHovered}
                class:ring-4={isHovered}
                class:ring-slate-100={isHovered}
                class:z-10={!isHovered}
                style="background-color: {donor.recurring ? '#FFD700' : '#4682B4'};"
              >
                <span class="text-[10px] font-bold tracking-tighter text-slate-900">
                  {donor.initials}
                </span>
              </div>

              <!-- Tooltip -->
              {#if isHovered}
                <div
                  class="animate-in fade-in slide-in-from-bottom-2 pointer-events-none absolute bottom-full z-50 mb-3 w-48 rounded-lg bg-slate-900 p-3 text-xs text-white shadow-2xl"
                >
                  <div class="mb-1 border-b border-slate-700 pb-1 font-bold">
                    {#if donor.initials === 'An'}
                      Anonymous Donor
                    {:else}
                      Donor {donor.initials}
                    {/if}
                  </div>
                  <div class="mt-1 flex justify-between">
                    <span class="text-slate-400">Total Gifted:</span>
                    <span class="font-semibold">${donor.total.toFixed(2)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Times Donated:</span>
                    <span>{donor.count}</span>
                  </div>
                  <div class="mt-1 flex justify-between border-t border-slate-700 pt-1 text-[10px] italic">
                    <span class="text-slate-400">Joined:</span>
                    <span>{formatDateToMonthYear(donor.joined)}</span>
                  </div>
                  <!-- Tooltip Arrow -->
                  <div class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Right side: Text Content -->
        <div class="w-full flex-auto">
          <h2 class="text-4xl font-semibold tracking-tight text-pretty text-gray-950 sm:text-5xl">{title}</h2>
          <p class="mt-6 text-lg/8 text-pretty text-gray-600">
            <span class="hidden lg:inline">{bubbleChartDescription}&nbsp;</span>{description}
          </p>
          <ul role="list" class="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base/7 text-gray-950 sm:grid-cols-2">
            {#each bullets as bullet}
              <li class="flex gap-x-3">
                <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="h-7 w-5 flex-none text-indigo-500">
                  <path
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                  />
                </svg>
                {bullet}
              </li>
            {/each}
          </ul>
          <div class="mt-10 flex">
            <a href="/about/donate/" class="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-300">
              Support open data
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div aria-hidden="true" class="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl">
      <div
        style="clip-path: polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)"
        class="aspect-1318/752 w-329.5 flex-none bg-linear-to-r from-[#9fd6fc] to-[#8680fd] opacity-50"
      ></div>
    </div>
  </div>
</div>
