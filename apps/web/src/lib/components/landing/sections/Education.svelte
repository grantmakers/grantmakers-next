<script lang="ts">
  import image from '$lib/assets/images/grants-lab.png';
</script>

<section class="isolate overflow-hidden bg-white px-6 lg:px-8">
  <div class="relative mx-auto max-w-2xl lg:max-w-5xl">
    <div
      class="absolute top-0 left-1/2 -z-10 h-240 w-400 -translate-x-1/2 bg-[radial-gradient(50%_100%_at_top,var(--color-indigo-100),white)] opacity-20 lg:left-36"
    ></div>
    <div
      class="absolute inset-y-0 right-1/2 -z-10 mr-12 w-[150vw] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-20 md:mr-0 lg:right-full lg:-mr-36 lg:origin-center"
    ></div>
    <figure class="grid grid-cols-1 items-center gap-x-6 gap-y-8 lg:gap-x-12">
      <div class="relative col-span-2 lg:col-start-1 lg:row-start-2">
        <div class="mx-auto max-w-2xl">
          <h2 class="text-base leading-7 font-semibold text-indigo-600">Empowering Communities</h2>
          <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Libraries Leverage Grantmakers.io to Empower Nonprofits
          </p>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            We're honored that the Toledo Library incorporates Grantmakers.io in their nonprofit programming, alongside trusted platforms
            like Foundation Directory Online. Their comprehensive curriculum uniquely equips local fundraisers with modern, real-world
            skills.
          </p>
        </div>
      </div>
      <div class="col-end-1 w-full lg:row-span-4 lg:w-96">
        <a href="https://events.toledolibrary.org/event/9313900" target="_blank" rel="noopener noreferrer">
          <img class="rounded-xl bg-indigo-50 lg:rounded-3xl" src={image} alt="Link to Grants Lab Workshop" />
        </a>
      </div>
    </figure>
  </div>
</section>
