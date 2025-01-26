<script lang="ts">
  import { onMount } from 'svelte';
  import cm from '$lib/assets/images/testimonials/cm.jpg';
  import chicagoFlag from '$lib/assets/images/emoji_chicago_flag.png';
  import { browser } from '$app/environment';

  function initGoogleSheets() {
    const gsDefer = document.getElementsByTagName('iframe');
    for (let i = 0; i < gsDefer.length; i++) {
      const dataSrc = gsDefer[i].getAttribute('data-src');
      if (dataSrc && isValidUrl(dataSrc)) {
        gsDefer[i].setAttribute('src', dataSrc);
      }
    }
    function isValidUrl(url: string) {
      const trustedDomains = ['docs.google.com'];
      try {
        const parsedUrl = new URL(url);
        return trustedDomains.includes(parsedUrl.hostname);
      } catch (e) {
        return false;
      }
    }
  }

  onMount(() => {
    initGoogleSheets();
  });
</script>

<!-- https://tailwindui.com/components/marketing/sections/content-sections#component-3f7a35fa653498b2c62441a98df3dc08 -->

<div class="flex flex-col gap-12 bg-white px-6 py-8 lg:px-8">
  <div class="mx-auto max-w-3xl text-base/7 text-gray-700">
    <p class="text-base/7 font-semibold text-indigo-600">Leading the industry forward</p>
    <h1 class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Truly open data</h1>
    <p class="mt-6 text-xl/8">
      Grantmakers.io makes the public IRS 990-PF dataset useful to any nonprofit with an Internet connection. Fully open source and forever
      free, the project ensures truly equitable access to a critical information source for nonprofits of all sizes.
    </p>
    <div class="mt-10 max-w-2xl">
      <p>
        The project demonstrates that searchable access to 990 data can be offered for free, even at significant scale. To us, truly free
        means:
      </p>
      <ul role="list" class="mt-8 max-w-xl space-y-8 text-gray-600">
        <li class="flex gap-x-3">
          <svg class="mt-1 size-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
              clip-rule="evenodd"
            />
          </svg>
          <span
            ><strong class="font-semibold text-gray-900">No budget required.</strong> Grantmakers.io's mission is to be the antidote to the continued
            industry practice of charging for basic 990 data.
          </span>
        </li>
        <li class="flex gap-x-3">
          <svg class="mt-1 size-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
              clip-rule="evenodd"
            />
          </svg>
          <span
            ><strong class="font-semibold text-gray-900">No hoops.</strong> No forms to fill out, no accounts to create, no affinity groups to
            join - and while we love our libraries, you shouldn't need to visit one just to access basic foundation data. Your time is valuable.</span
          >
        </li>
        <li class="flex gap-x-3">
          <svg class="mt-1 size-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
              clip-rule="evenodd"
            />
          </svg>
          <span
            ><strong class="font-semibold text-gray-900">No limits.</strong> No limits on views, no limited free trials, no frustrating pop-ups.
            The cost of providing another view is a fraction of a cent.</span
          >
        </li>
      </ul>
      <p class="mt-8"></p>

      <h2 id="toc-intro" class="mt-16 text-pretty text-3xl font-semibold tracking-tight text-gray-900">
        An open window into a critically important dataset
      </h2>
      <p class="mt-6">
        Grantmakers.io was created by me, Chad Kruse 👋. I originally <a
          class="text-grantmakers-orange hover:text-slate-700"
          href="https://medium.com/@chadkruser/building-grantmakers-io-d1f78326a0b5"
          target="_blank"
          rel="noopener noreferrer">built the site for a friend</a
        >, then open sourced it for the world when I saw how useful the data was to her. Fewer trips to the library to conduct simple donor
        searches meant more time to run her nonprofit.
      </p>
      <p class="mt-6">
        The amazing folks at <a
          class="text-grantmakers-orange hover:text-slate-700"
          href="https://www.algolia.com/?utm_source=grantmakersio&utm_medium=referral"
          target="_blank"
          rel="noopener">Algolia</a
        >
        stepped in shortly after launch and provided an expanded free tier to their search service which made the 990-PF portion of the dataset
        entirely searchable. The speed and accuracy of their search is truly remarkable -
        <a
          class="text-grantmakers-orange hover:text-slate-700"
          href="https://medium.com/@chadkruser/unlocking-irs-form-990-pf-data-through-hosted-search-f1bfecac2d5e"
          target="_blank"
          rel="noopener noreferrer">it's the search nonprofits deserve</a
        >.
      </p>

      <h2 id="toc-freedom" class="mt-16 text-pretty text-3xl font-semibold tracking-tight text-gray-900">
        Free as in freedom and free as in food
      </h2>
      <p class="mt-6">
        Grantmakers.io serves as an example of the power of Free and Open Source Software (FOSS). Anyone can access it without paying (free
        as in food), and anyone can leverage the code to continue innovating in however they please (free as in freedom).
      </p>

      <figure class="mt-10 border-l border-indigo-600 pl-9">
        <blockquote class="font-semibold text-gray-900">
          <p>
            “As a board chair of a small non-profit that has a small operating budget, I cannot thank you enough for providing simplified,
            public, free access to this information. Thank you!”
          </p>
        </blockquote>
        <figcaption class="mt-6 flex gap-x-4">
          <img class="size-6 flex-none rounded-full bg-gray-50" src={cm} alt="" />
          <div class="text-sm/6"><strong class="font-semibold text-gray-900">Candice Miles</strong> – Fmr. Board Chair</div>
        </figcaption>
      </figure>
      <p class="mt-10">
        I'm proud to work on Grantmakers.io and support all the amazing nonprofit professionals in their important work. Saying I "donate"
        my time doesn't feel right. Creating and running the site has been one of the most rewarding experiences of my career, and the
        countless thank you messages I receive from nonprofits truly warms my heart. Grantmakers.io will remain free and open forever. 💕
      </p>
    </div>
    <div class="mt-16 max-w-2xl">
      <h2 id="toc-transparency" class="text-pretty text-3xl font-semibold tracking-tight text-gray-900">Transparency 💯</h2>
      <p class="mt-6">
        Grantmakers.io leads by example: fully transparent and self-sustaining. Every line of code and every dollar spent is open for
        everyone to see, learn from, and build upon.
      </p>
      <p class="mt-6"></p>
      <div class="mt-8 min-h-64 w-full">
        {#if browser}
          <iframe
            id="gsheets"
            title="Grantmakers.io Financials Spreadsheet"
            src=""
            data-src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRd9v4_McKmXGjR-pA1cW33vNjwAnky1gtIQlfvaA1miv3PhbR6QXxHVMVV-5x7kqEOTdfIkVoy87YC/pubhtml?widget=true&amp;headers=false"
          ></iframe>
        {/if}
      </div>
    </div>
    <div class="mt-16 max-w-2xl">
      <h2 id="toc-chad" class="text-pretty text-3xl font-semibold tracking-tight text-gray-900">Meet Chad</h2>
      <p class="mt-6">
        Before launching my own ventures and teaching myself to code, I was often brought on as the first "business hire" at startups of all
        shapes and sizes, online and offline. I've run development teams, owned product strategy, raised venture, seed, debt, and
        philanthropic capital, and closed business development deals with organizations both large and small. I'm a generalist through and
        through.
      </p>
      <p class="mt-8">
        My career started as a strategist and dealmaker for large tech companies, and I'm often told I have a unique ability to talk shop
        with programmers, VC's, designers, boards of directors, philanthropists and everyone in between. My head is in SF, my heart is in
        Bend (OR), and my body is currently in Chicago. <img
          class="inline-flex w-6"
          width={231}
          height={167}
          src={chicagoFlag}
          alt="Chicago Flag"
        />
      </p>
    </div>
  </div>
  <div class="rounded-lg bg-indigo-100">
    <div class="mx-auto max-w-7xl px-6 py-24 sm:py-24 lg:flex lg:items-center lg:justify-between lg:px-8">
      <h2 class="max-w-2xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        New to Grantmakers.io? <br />Read more about the IRS dataset.
      </h2>
      <div class="mt-10 flex items-center gap-x-6 lg:mt-0 lg:shrink-0">
        <a
          href="/about/the-dataset/"
          class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >Learn more <span aria-hidden="true">→</span></a
        >
        <!-- <a href="#" class="text-sm/6 font-semibold text-gray-900">Learn more <span aria-hidden="true">→</span></a> -->
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  iframe {
    @apply min-h-64 w-full;
  }
</style>
