<script lang="ts">
  import ContentBoxHeader from './ContentBoxHeader.svelte';
  import irsLogo from '$lib/assets/images/irs-logo.webp';

  interface Props {
    title: string;
    anchor?: string;
    logo?: string;
    fullWidth?: boolean;
    classes?: string;
    children?: import('svelte').Snippet;
  }

  let { title, logo = undefined, fullWidth = false, classes = '', children }: Props = $props();
</script>

<div class="mb-4 w-full max-w-full px-3 {fullWidth ? 'md:col-span-1' : 'md:col-span-2'} {classes}">
  <div class="shadow-soft-xl relative flex h-full min-w-0 flex-col wrap-break-word rounded-2xl border-0 bg-white bg-clip-border">
    <div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
      <ContentBoxHeader {title}>
        {#if logo}
          <img src={irsLogo} alt="IRS logo" class="max-h-6 w-full" height={24} width={48} />
        {/if}
      </ContentBoxHeader>
    </div>
    <div class="flex-1">
      {@render children?.()}
    </div>
  </div>
</div>
