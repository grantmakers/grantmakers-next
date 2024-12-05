<script lang="ts">
  import ContentBoxHeader from '../ContentBoxHeader.svelte';
  import logo from '$lib/assets/images/logo.svg';
  import Tip from '../alerts/Tip.svelte';
</script>

<div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
  <ContentBoxHeader title={'About Grantmakers.io'}>
    <img src={logo} alt="Grantmakers.io logo" class="max-h-6 w-full" height={36} width={36} />
  </ContentBoxHeader>
</div>
<div class="flex flex-col gap-6 p-8">
  <p>Grantmakers.io is a free, open source project built to help nonprofits utilize the incredible IRS 990-PF dataset.</p>
  <p>
    The project exists to move the philanthropic data industry away from expensive subscriptions and towards decentralized data sharing.
  </p>
  <div class="">
    <Tip
      title="No Affiliation"
      message="Grantmakers.io is not affiliated, associated, authorized, endorsed by, or in any way officially connected with any
  foundation appearing on the site."
      bg={true}
      includeLogo
    />
  </div>
  <div class="flex justify-center">
    <a
      href="/about"
      class="shrink rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
    >
      <div class="flex flex-row items-center justify-center gap-1">Learn More</div>
    </a>
  </div>
</div>
