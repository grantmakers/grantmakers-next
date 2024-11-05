<script lang="ts">
  import logo from '$lib/assets/images/logo.svg';

  let { isFooter = false }: { isFooter: boolean } = $props();

  let classes = {
    img: 'h-6',
    span: ' text-slate-700 text-xl lg:text-base',
  };

  let footerClasses = {
    img: 'mr-3 h-10',
    span: 'text-slate-200 text-2xl lg:text-xl',
  };
</script>

<div class="flex items-center">
  <a href="/" class="mr-2 flex items-center md:mr-4">
    <img src={logo} class={isFooter ? footerClasses.img : classes.img} width="40" height="40" alt="Grantmakers.io Logo" />
    <span class="self-center whitespace-nowrap font-semibold md:text-base {isFooter ? footerClasses.span : classes.span}"
      >Grantmakers.io</span
    >
  </a>
</div>
