<!-- cspell:disable -->
<script lang="ts">
  import srOrgLogo from '$lib/assets/images/testimonials/wh-logo-alt.png';
  import sr from '$lib/assets/images/testimonials/sr-alt.jpg';
  import sg from '$lib/assets/images/testimonials/sg.webp';
  import rl from '$lib/assets/images/testimonials/rl.webp';
  import sj from '$lib/assets/images/testimonials/sj.webp';
  import jt from '$lib/assets/images/testimonials/jt.webp';

  const testimonials = {
    main: {
      quote:
        'As a brand new grantwriter for a smaller area, your site has helped me tremendously. Being able to see the numbers and not have to dig really helps me see the big picture. Thanks so much!',
      name: 'S. Roscoe',
      title: 'Grant Writer',
      image: sr,
      logo: srOrgLogo,
    },
    left: {
      quote: "Thank you so very much - this is a truly amazing service!!! I'm searching for grants for a small non profit in SF. 🙂",
      name: 'Rosalie Lack',
      title: 'Strategy & Engagement',
      image: rl,
    },
    right: {
      quote: 'I am the Development Manager for a nonprofit in Orange County, CA and I use this site often - thank you!',
      name: 'Susan Johnson',
      title: 'Development Manager',
      image: sj,
    },
    bottomLeft: {
      quote: 'Thanks to your wonderful website, Misfit Acres Inc has received another grant!!! Thank you!!!!!',
      name: 'Jody Thisted',
      title: 'President',
      image: jt,
    },
    bottomRight: {
      quote: 'This is an awesome tool - we are a very small non profit near Chicago, and we are broadening our donor base and grant base.',
      name: 'Sally Guglielmo',
      title: 'Founder',
      image: sg,
    },
  };
</script>

<div class="relative isolate bg-white pb-32 pt-24 sm:pt-12">
  <div class="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl" aria-hidden="true">
    <div
      class="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
      style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
    ></div>
  </div>
  <div
    class="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end"
    aria-hidden="true"
  >
    <div
      class="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] xl:ml-0 xl:mr-[calc(50%-12rem)]"
      style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
    ></div>
  </div>
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-xl text-center">
      <h2 class="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Every stage, every cause</h2>
      <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Loved by nonprofits just like yours</p>
      <p class="mt-2 text-lg">
        From nonprofits seeking their first grant to seasoned advancement professionals, Grantmakers.io is proud to support nonprofits of
        all sizes
      </p>
    </div>
    <div
      class="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4"
    >
      <figure class="rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 sm:col-span-2 xl:col-start-2 xl:row-end-1">
        <blockquote class="p-6 text-lg font-semibold leading-7 tracking-tight text-gray-900 sm:p-12 sm:text-xl sm:leading-8">
          <p>{testimonials.main.quote}</p>
        </blockquote>
        <figcaption class="flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-gray-900/10 px-6 py-4 sm:flex-nowrap">
          <img class="h-10 w-10 flex-none rounded-full bg-gray-50" src={testimonials.main.image} alt="" />
          <div class="flex-auto">
            <div class="font-semibold">{testimonials.main.name}</div>
            <div class="text-gray-600">{testimonials.main.title}</div>
          </div>
          <img class="h-10 w-auto flex-none" src={testimonials.main.logo} alt="" width="200" height="200" />
        </figcaption>
      </figure>
      <div class="space-y-8 xl:contents xl:space-y-0">
        <div class="space-y-8 xl:row-span-2">
          <figure class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
            <blockquote class="text-gray-900">
              <p>{testimonials.left.quote}</p>
            </blockquote>
            <figcaption class="mt-6 flex items-center gap-x-4">
              <img class="h-10 w-10 rounded-full bg-gray-50" src={testimonials.left.image} alt="" />
              <div>
                <div class="font-semibold">{testimonials.left.name}</div>
                <div class="text-gray-600">{testimonials.left.title}</div>
              </div>
            </figcaption>
          </figure>

          <!-- More testimonials... -->
        </div>
        <div class="space-y-8 xl:row-start-1">
          <figure class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
            <blockquote class="text-gray-900">
              <p>{testimonials.bottomLeft.quote}</p>
            </blockquote>
            <figcaption class="mt-6 flex items-center gap-x-4">
              <img class="h-10 w-10 rounded-full bg-gray-50" src={testimonials.bottomLeft.image} alt="" />
              <div>
                <div class="font-semibold">{testimonials.bottomLeft.name}</div>
                <div class="text-gray-600">{testimonials.bottomLeft.title}</div>
              </div>
            </figcaption>
          </figure>

          <!-- More testimonials... -->
        </div>
      </div>
      <div class="space-y-8 xl:contents xl:space-y-0">
        <div class="space-y-8 xl:row-start-1">
          <figure class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
            <blockquote class="text-gray-900">
              <p>{testimonials.bottomRight.quote}</p>
            </blockquote>
            <figcaption class="mt-6 flex items-center gap-x-4">
              <img class="h-10 w-10 rounded-full bg-gray-50" src={testimonials.bottomRight.image} alt="" />
              <div>
                <div class="font-semibold">{testimonials.bottomRight.name}</div>
                <div class="text-gray-600">{testimonials.bottomRight.title}</div>
              </div>
            </figcaption>
          </figure>

          <!-- More testimonials... -->
        </div>
        <div class="space-y-8 xl:row-span-2">
          <figure class="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
            <blockquote class="text-gray-900">
              <p>{testimonials.right.quote}</p>
            </blockquote>
            <figcaption class="mt-6 flex items-center gap-x-4">
              <img class="h-10 w-10 rounded-full bg-gray-50" src={testimonials.right.image} alt="" />
              <div>
                <div class="font-semibold">{testimonials.right.name}</div>
                <div class="text-gray-600">{testimonials.right.title}</div>
              </div>
            </figcaption>
          </figure>

          <!-- More testimonials... -->
        </div>
      </div>
    </div>
  </div>
</div>
