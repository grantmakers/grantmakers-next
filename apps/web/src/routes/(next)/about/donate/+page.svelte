<script lang="ts">
  import BackToTop from '$lib/components/shared/BackToTop.svelte';
  import Donate from '$lib/components/static/Donate.svelte';
</script>

<!-- https://tailwindui.com/components/application-ui/application-shells/stacked -->

<div class="min-h-full">
  <main class="-mt-24 pb-8">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 class="sr-only">Support Open Data</h1>
      <div class="overflow-hidden rounded-lg bg-white shadow">
        <div class="p-6">
          <!-- Main 3 column grid -->
          <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
            <!-- Left column -->
            <div class="lg:col-span-3">
              <section aria-labelledby="support-open-data">
                <h2 class="sr-only" id="support-open-data">Donate</h2>
                <div class="overflow-hidden rounded-lg">
                  <div>
                    <Donate />
                  </div>
                </div>
              </section>
            </div>

            <!-- Right column -->
            <div class="hidden lg:col-span-2 lg:block">
              <section aria-labelledby="faq">
                <script src="https://donorbox.org/widget.js" paypalExpress="false"></script>
                <iframe
                  title="Donation form"
                  allowpaymentrequest=""
                  frameborder="0"
                  height="900px"
                  name="donorbox"
                  scrolling="no"
                  seamless="seamless"
                  src="https://donorbox.org/embed/buy-chad-a-coffee"
                  style="max-width: 500px; min-width: 310px; max-height:none!important; border: none !important"
                  width="100%"
                ></iframe>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <nav aria-label="Back to top navigation">
    <BackToTop />
  </nav>
</div>
