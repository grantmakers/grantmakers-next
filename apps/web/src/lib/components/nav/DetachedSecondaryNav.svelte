<script lang="ts">
  /**
   * To be used in scenarios where separating the secondary nav from the GlobalNav handling is beneficial
   * Uses a modern pill style nav, inspired by https://paper.design/ and https://www.toools.design/
   *
   * Early prototype to test alt styling for Profiles secondary navs
   */
  import { type NavConfig } from './config';
  import { type GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';

  interface Props {
    config: NavConfig;
    organizationName: GrantmakersExtractedDataObj['organization_name'];
  }

  let { config, organizationName }: Props = $props();
</script>

<div class="mx-auto max-w-3xl px-6 font-sans sm:px-6 lg:max-w-7xl lg:px-8">
  <div class="hidden pb-8 pt-4 lg:block">
    <!-- White pill container -->
    <div class="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 shadow-lg shadow-black/5">
      {#if config.route === 'profiles' && organizationName}
        <div class="text-[15px] font-semibold text-slate-900! transition-colors hover:text-slate-700!">
          {organizationName}
        </div>

        <svg viewBox="0 0 20 20" fill="currentColor" class="size-4 shrink-0 text-slate-300" aria-hidden="true">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
          />
        </svg>
      {/if}

      <!-- Nav links -->
      {#each config?.secondaryNavLinks as item, index}
        <a
          href={item.link}
          class="rounded-lg px-3 py-1.5 text-[14px] font-medium text-slate-600! transition-all duration-200 hover:bg-slate-50! hover:text-slate-900!"
        >
          {item.title}
        </a>

        <!-- Separator dot between links (not after last one) -->
        {#if config.secondaryNavLinks && index < config.secondaryNavLinks.length - 1}
          <span class="text-xs text-slate-300">•</span>
        {/if}
      {/each}
    </div>
  </div>
</div>
