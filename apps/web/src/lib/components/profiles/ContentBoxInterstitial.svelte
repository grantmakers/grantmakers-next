<script lang="ts">
  import logo from '$lib/assets/images/logo.svg';

  interface Props {
    message: string;
  }

  let { message }: Props = $props();
</script>

<div class="my-6 flex flex-row items-start justify-center gap-2 px-6 py-8 lg:my-8 lg:px-8 lg:py-10">
  <img src={logo} class="inline-block h-6 w-6 rounded-full" alt="Grantmakers.io Logo" height={36} width={36} />
  <div>{message}</div>
</div>
