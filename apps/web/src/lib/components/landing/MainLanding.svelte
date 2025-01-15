<script lang="ts">
  import screenshot from '$lib/assets/images/screenshot.webp';
  import LogoMark from '../shared/LogoMark.svelte';
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
  import { features, articleLinks } from '$utils/trustedConstants';
  import ClosingStatement from './sections/ClosingStatement.svelte';
</script>

<div class="bg-white">
  <header class="absolute inset-x-0 top-0 z-50">
    <nav class="flex items-center justify-start p-6 md:justify-end lg:px-8" aria-label="Global">
      <div class="">
        <LogoMark isLandingOrFooter={true} />
      </div>
    </nav>
  </header>

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
      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',"
        ></div>
      </div>

      <!-- Primary message -->
      <div class="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pb-32 lg:flex lg:flex-col lg:px-8 lg:py-36">
        <div class="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div class="text-left">
            <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Foundation research<br />
              <span class="text-slate-500"><del>is expensive</del></span><br /> just got easier
            </h1>
            <!-- Overriding h2 defaults is an anti-pattern. Consider removing all header tag defaults -->
            <h2 class="mt-6 text-lg font-normal leading-8 tracking-normal text-gray-300">
              Grantmakers.io makes the public <span class="font-extrabold text-orange-600">IRS 990-PF dataset</span> useful to any nonprofit
              with an Internet connection. Ensuring equitable access to a critical information source for nonprofits since 2016.
              <!-- If a foundation files taxes electronically, you'll find them here. -->
            </h2>
          </div>
        </div>

        <!-- Features -->
        <div class="mx-auto w-full shrink-0 lg:mx-0 lg:max-w-full lg:pt-8">
          <Features />
        </div>
      </div>
      <div
        class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style="clipPath: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        ></div>
      </div>
    </div>

    <!-- Grantmakers NEXT announcement -->
    <div class="mt-12 sm:mt-24" id="announcement">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl sm:text-center">
          <div class="text-base font-semibold leading-7 text-indigo-600">Announcing</div>
          <h1 class="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Grantmakers <span class="bg-gradient-to-r from-indigo-600 to-indigo-300 bg-clip-text text-transparent">NEXT</span>
          </h1>
          <p class="mt-6 p-2 text-lg leading-8 text-gray-600 lg:p-6">
            Grantmakers.io is evolving from its roots as a <a
              class="text-indigo-600 underline decoration-indigo-300 hover:cursor-pointer"
              href="https://medium.com/@chadkruser/building-grantmakers-io-d1f78326a0b5"
              target="_blank"
              rel="noopener noreferrer">weekend project</a
            >
            built for a friend. Uncomplicated and community-driven, just like before.
          </p>
        </div>
      </div>
      <div class="relative overflow-hidden pt-16">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <img
            src={screenshot}
            alt="App screenshot"
            class="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            width={2432}
            height={1442}
          />
          <div class="relative" aria-hidden="true">
            <div class="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]"></div>
          </div>
        </div>
      </div>
      <div class="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl
          class="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16"
        >
          {#each features as feature}
            <div class="relative pl-9">
              <dt class="inline font-semibold text-gray-900">
                <feature.icon class="absolute left-1 top-1 size-5 text-indigo-600" aria-hidden="true" />
                {feature.name}
              </dt>
              {' '}
              <dd class="inline">{feature.description}</dd>
            </div>
          {/each}
        </dl>
      </div>
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
        <h2 class="text-base font-semibold leading-7 text-indigo-600">Thank 🙏 You</h2>
        <p class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Grateful for our friends</p>
      </div>
      <p class="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
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

    <!-- FAQ section -->
    <!-- <div class="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
      <FAQ {faqData} />
    </div> -->

    <!-- CTA -->
    <div class="relative isolate mt-32 bg-gray-900 px-6 sm:mt-56 lg:px-8">
      <BottomCTA />
    </div>
  </main>
</div>
