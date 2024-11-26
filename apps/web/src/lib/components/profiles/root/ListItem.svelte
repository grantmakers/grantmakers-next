<script lang="ts">
  /**
   * https://tailwindui.com/components/application-ui/lists/stacked-lists
   */
  interface Props {
    name: string;
    ein: string;
    category: string;
  }

  let { name, ein, category }: Props = $props();

  let badgeVariation = $derived.by(() => {
    if (category === 'Typical') return 'success';
    if (category === 'Unique Orgs') return 'info';
    if (category === 'Edge Cases') return 'warning';
    if (category === 'Large People Array') return 'danger';
    if (category === 'Direct Activities') return 'indigo';
    if (category === 'See Attached') return 'purple';
    return 'default';
  });

  let badgeClasses = $derived.by(() => {
    if (badgeVariation === 'default') return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    if (badgeVariation === 'danger') return 'bg-red-50 text-red-700 ring-red-600/10';
    if (badgeVariation === 'warning') return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20';
    if (badgeVariation === 'success') return 'bg-green-50 text-green-700 ring-green-600/20';
    if (badgeVariation === 'info') return 'bg-blue-50 text-blue-700 ring-blue-700/10';
    if (badgeVariation === 'indigo') return 'bg-indigo-50 text-indigo-700 ring-indigo-700/10';
    if (badgeVariation === 'purple') return 'bg-purple-50 text-purple-700 ring-purple-700/10';
  });
  let url = $derived('/profiles/v0/' + ein);
</script>

<li class="flex items-center justify-between gap-x-6 py-5 odd:bg-white even:bg-slate-50">
  <div class="min-w-0">
    <div class="flex items-start gap-x-3">
      <a href={url} class="text-normal/6 font-semibold text-gray-900">{name}</a>
      <p class="mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset {badgeClasses}">
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
      class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
      >View profile<span class="sr-only">, {name}</span></a
    >
  </div>
</li>
