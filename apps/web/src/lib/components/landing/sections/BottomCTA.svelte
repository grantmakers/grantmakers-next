<script lang="ts">
  import { Envelope } from 'svelte-heros-v2';
</script>

<div class="relative bg-gray-900">
  <div class="relative h-80 overflow-hidden bg-indigo-600 md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2">
    <img
      class="size-full object-cover"
      src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&blend=6366F1&sat=-100&blend-mode=multiply"
      alt=""
    />
    <svg viewBox="0 0 926 676" aria-hidden="true" class="absolute -bottom-24 left-24 w-[57.875rem] transform-gpu blur-[118px]">
      <path
        fill="url(#60c3c621-93e0-4a09-a0e6-4c228a0116d8)"
        fill-opacity=".4"
        d="m254.325 516.708-90.89 158.331L0 436.427l254.325 80.281 163.691-285.15c1.048 131.759 36.144 345.144 168.149 144.613C751.171 125.508 707.17-93.823 826.603 41.15c95.546 107.978 104.766 294.048 97.432 373.585L685.481 297.694l16.974 360.474-448.13-141.46Z"
      />
      <defs>
        <linearGradient
          id="60c3c621-93e0-4a09-a0e6-4c228a0116d8"
          x1="926.392"
          x2="-109.635"
          y1=".176"
          y2="321.024"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#776FFF" />
          <stop offset={1} stop-color="#FF4694" />
        </linearGradient>
      </defs>
    </svg>
  </div>
  <div class="relative mx-auto max-w-7xl py-24 sm:py-32 lg:px-8 lg:py-40">
    <div class="px-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32">
      <h2 class="text-base font-semibold leading-7 tracking-normal text-indigo-400">Coming Soon</h2>
      <p class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Grantmakers NEXT</p>
      <p class="mt-6 text-base leading-7 text-gray-300">
        Grantmakers.io thrives on feedback and insights from our nonprofit community of fundraisers. If you're one of the hundreds of
        individuals that have provided feedback over the years, let's reconnect. If you're frustrated with the current landscape of grants
        research tools, we're listening.
      </p>
      <div class="mt-8">
        <div class="flex items-center">
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="mailto:next@grantmakers.io"
              target="_blank"
              rel="noreferrer"
              class="flex items-center gap-2 rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Envelope />&nbsp;Get in touch!
            </a>
            <a
              href="https://www.grantmakers.io"
              class="flex items-center gap-2 rounded-md bg-orange-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Back to Grantmakers.io <span aria-hidden="true">→</span>
            </a>
            <!-- <a href="#" class="text-sm font-semibold leading-6 text-white">
              Live demo <span aria-hidden="true">→</span>
            </a> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
