<script lang="ts">
  import logo from '$lib/assets/images/logo.svg';

  interface Props {
    isLandingOrFooter?: boolean;
    isSticky?: boolean;
  }

  let { isLandingOrFooter = false, isSticky = false }: Props = $props();

  let classes = {
    img: 'h-6',
    span: ' text-slate-700 text-xl lg:text-base',
  };

  let landingOrFooterClasses = {
    img: 'mr-3 h-10',
    span: 'text-slate-50 text-2xl lg:text-lg',
  };

  let stickyClasses = {
    img: 'h-6',
    span: 'text-slate-50 text-xl lg:text-base',
  };
</script>

<div class="flex items-start">
  <a href="/" class="mr-2 flex items-center md:mr-4">
    <img
      src={logo}
      class={[
        isLandingOrFooter ? landingOrFooterClasses.img
        : isSticky ? stickyClasses.img
        : classes.img,
      ]}
      width="40"
      height="40"
      alt="Grantmakers.io Logo"
    />
    <span
      class={[
        'self-center whitespace-nowrap font-semibold md:text-base',
        isLandingOrFooter ? landingOrFooterClasses.span
        : isSticky ? stickyClasses.span
        : classes.span,
      ]}>Grantmakers.io</span
    >
  </a>
</div>
