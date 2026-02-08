<script lang="ts">
  import { badgeStyles } from '$utils/badgeStyles';
  import { profilesVersionProd } from '@repo/shared/constants/trustedConstants';
  interface Props {
    name: string;
    ein: string;
    category: string;
  }

  let { name, ein, category }: Props = $props();

  let badgeClasses = $derived.by(() => {
    if (category === 'Typical') return badgeStyles.success;
    if (category === 'Unique Orgs') return badgeStyles.info;
    if (category === 'Edge Cases') return badgeStyles.warning;
    if (category === 'Large People Array') return badgeStyles.danger;
    if (category === 'Direct Activities') return badgeStyles.indigo;
    if (category === 'See Attached') return badgeStyles.purple;
    return badgeStyles.default;
  });

  let url = $derived(`/profiles/${profilesVersionProd}/` + ein);
</script>

<!-- https://tailwindui.com/components/application-ui/lists/stacked-lists -->

<li class="flex items-center justify-between gap-x-6 py-5 odd:bg-white even:bg-slate-50">
  <div class="min-w-0">
    <div class="flex items-start gap-x-3">
      <a href={url} class="text-normal/6 font-semibold text-gray-900">{name}</a>
      <p class="mt-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset {badgeClasses}">
        {category}
      </p>
    </div>
    <div class="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
      <p class="whitespace-nowrap">EIN: {ein}</p>
      <!-- <svg viewBox="0 0 2 2" class="size-0.5 fill-current">
        <circle cx="1" cy="1" r="1" />
      </svg>
      <p class="truncate">Created by Leslie Alexander</p> -->
    </div>
  </div>
  <div class="flex flex-none items-center gap-x-4">
    <a
      href={url}
      class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:block"
      >View profile<span class="sr-only">, {name}</span></a
    >
  </div>
</li>
