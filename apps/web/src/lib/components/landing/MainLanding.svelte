<script lang="ts">
  import SearchBoxTrigger from '../search/triggers/SearchBoxTrigger.svelte';
  import Bento from './sections/Bento.svelte';
  import Ethos from './sections/Ethos.svelte';
  import Features from './sections/Features.svelte';
  import Stats from './sections/Stats.svelte';
  import StatsSearches from './sections/StatsSearches.svelte';
  import Testimonial from './sections/Testimonial.svelte';
  import AllTestimonials from './sections/AllTestimonials.svelte';
  import PartnerLogos from './sections/PartnerLogos.svelte';
  import PillLink from '../shared/PillLink.svelte';
  import Market from './sections/Market.svelte';
  import Education from './sections/Education.svelte';
  import BottomCTA from './sections/BottomCTA.svelte';
  import { articleLinks } from '@repo/shared/constants/trustedConstants';
  import ClosingStatement from '$lib/components/landing/sections/ClosingStatement.svelte';
  import Supporters from '$lib/components/landing/sections/Supporters.svelte';
</script>

<div class="relative bg-white">
  <main>
    <!-- Hero section -->
    <div class="relative isolate overflow-hidden bg-gray-900 pt-14 lg:-top-24">
      <!-- Background image -->
      <img
        src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply&flip=h"
        alt=""
        class="absolute inset-0 -z-10 size-full object-cover object-right md:object-center"
      />

      <!-- Background gradient -->
      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-none lg:blur-3xl sm:-top-80" aria-hidden="true">
        <div
          class="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',"
        ></div>
      </div>

      <!-- Primary message -->
      <div class="mx-auto max-w-7xl px-6 pt-32 pb-24 sm:pb-32 lg:flex lg:flex-col lg:px-8 lg:py-60">
        <section class="flex flex-col items-center justify-center px-4 text-center">
          <h1 class="mb-4 w-full max-w-4xl font-bold text-white">
            <span class="text-grantmakers-orange block text-4xl sm:text-6xl">Foundation research</span>
            <span class="block text-4xl sm:text-6xl">Fully public. Finally unlocked.</span>
          </h1>
          <div class="w-full max-w-2xl">
            <h2 class="mt-6 text-lg font-normal text-gray-300">
              Research any US foundation in seconds. See their complete giving history, who they fund, and how much they give. Built from
              public 990s. Forever free.
              <!-- <span class="font-extrabold text-grantmakers-orange-light">Foundation 990 data</span> should be available to every nonprofit, not
              just those with big budgets. Grantmakers.io is a grassroots project created for grassroots changemakers. -->
            </h2>
            <div class="flex flex-col gap-4 text-base leading-7 md:p-6">
              <div class="mt-2 grow rounded-lg bg-white/5 p-4 text-gray-300 ring-1 ring-white/10 ring-inset">
                <SearchBoxTrigger placeholderText="Foundation Quick Search..." />
              </div>
            </div>
            <div class="hidden sm:mb-8 sm:flex sm:justify-center">
              <div class="relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
                Find foundations by who they've funded
                <a href="/search/grantees/" class="ml-2 font-semibold text-indigo-400"
                  ><span aria-hidden="true" class="absolute inset-0"></span>Grantee Search <span aria-hidden="true">&rarr;</span></a
                >
              </div>
            </div>
          </div>
        </section>

        <!-- Features -->
        <div class="mx-auto w-full shrink-0 lg:mx-0 lg:max-w-full lg:pt-8">
          <Features />
        </div>
      </div>
      <div
        class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-none lg:blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          class="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75"
          style="clipPath: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        ></div>
      </div>
    </div>

    <Bento />

    <!-- Ethos -->
    <div class="mt-12 sm:mt-24" id="ethos">
      <Ethos />
    </div>

    <!-- Stats -->
    <div id="impact" class="relative z-10 mt-32 bg-gray-900 pb-20 sm:mt-56 sm:pb-24 xl:pb-0">
      <Stats />
    </div>

    <div id="searches" class="relative isolate mt-32 bg-white px-6 sm:mt-56 lg:px-8">
      <StatsSearches />
    </div>

    <!-- Testimonial section -->
    <div id="testimonial" class="relative z-10 mt-32 bg-white pb-20 sm:mt-56 sm:pb-24 xl:pb-0">
      <Testimonial />
    </div>

    <!-- Education -->
    <div id="education" class="mx-auto mt-32 max-w-7xl sm:mt-56 sm:px-6 lg:px-8">
      <Education />
    </div>

    <!-- Market Dynamics -->
    <div id="market" class="mx-auto mt-32 max-w-7xl sm:mt-56 sm:px-6 lg:px-8">
      <Market />
    </div>

    <div id="testimonials" class="relative z-10 mt-32 bg-white pb-20 sm:mt-56 sm:pb-24 xl:pb-0">
      <AllTestimonials />
    </div>

    <div class="relative z-10 mt-20 bg-white pb-20 sm:mt-56 sm:pb-24 xl:pb-0">
      <ClosingStatement />
    </div>

    <!-- Partners section -->
    <div id="our-friends" class="relative isolate mt-32 bg-white px-6 sm:mt-56 lg:px-8">
      <div class="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true"></div>
      <div class="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 class="text-base leading-7 font-semibold text-indigo-600">Thank 🙏 You</h2>
        <p class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Grateful for our friends</p>
      </div>
      <p class="mx-auto mt-6 max-w-3xl text-center text-lg leading-8 text-gray-600">
        Grantmakers.io deeply appreciates <a
          class="text-indigo-600 underline decoration-indigo-300"
          href="https://www.algolia.com/"
          target="_blank"
          rel="noopener noreferrer">Algolia's</a
        > generous support, powering free, open, searchable access to grants data. Thank you for helping ensure this critical information remains
        accessible and transparent for nonprofits that need it most.
      </p>
      <PartnerLogos />

      <PillLink href={articleLinks.whyAlgolia}>
        <span>
          REVISIT: Why Algolia remains the perfect search engine for Grantmakers.io <span aria-hidden="true">→</span>
        </span>
      </PillLink>
    </div>

    <Supporters />

    <!-- CTA -->
    <div class="relative my-24 px-6 lg:px-12">
      <BottomCTA />
    </div>
  </main>
</div>
