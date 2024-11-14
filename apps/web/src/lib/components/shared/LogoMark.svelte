<script lang="ts">
  import logo from '$lib/assets/images/logo.svg';

  let { isLandingOrFooter = false }: { isLandingOrFooter: boolean | undefined } = $props();

  let classes = {
    img: 'h-6',
    span: ' text-slate-700 text-xl lg:text-base',
  };

  let landingOrFooterClasses = {
    img: 'mr-3 h-10',
    span: 'text-slate-200 text-2xl lg:text-xl',
  };
</script>

<div class="flex items-start">
  <a href="/" class="mr-2 flex items-center md:mr-4">
    <img src={logo} class={isLandingOrFooter ? landingOrFooterClasses.img : classes.img} width="40" height="40" alt="Grantmakers.io Logo" />
    <span class="self-center whitespace-nowrap font-semibold md:text-base {isLandingOrFooter ? landingOrFooterClasses.span : classes.span}"
      >Grantmakers.io</span
    >
  </a>
</div>
