<script lang="ts">
  /**
   * The Algolia Autocomplete implementation uses the Detached Mode UX
   * When someone clicks on the search box in the navbar, the primary search experience opens in a modal
   * Because we use SSR and Autocomplete can only init in an onMount, a brief flash occurs
   * The SSR placeholder search box is removed from the DOM and the Autocomplete-generated search box replaces it
   * To prevent this, we hide the Autocomplete-generated search box - this only serves as a trigger anyway
   * Instead, we use the SSR placeholder as the trigger to open the full Autocomplete experience in the modal
   */
  import { onDestroy, onMount } from 'svelte';
  import { browser } from '$app/environment';
  import '@algolia/autocomplete-theme-classic';
  import algoliaLogo from '$lib/assets/images/Algolia-logo-blue.svg';
  import { formatEin } from '@repo/shared/functions/formatters/ein';
  import { badgeStyles } from '$utils/badgeStyles';
  import { datasetStats } from '@repo/shared/constants/trustedConstants';
  import staticData from '@repo/shared/data/public/autocomplete-static-data.json';
  import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
  import type { BaseItem } from '@algolia/autocomplete-core';
  import type { AutocompleteInstance } from '@repo/shared/typings/algolia/autocomplete';
  import type { AutocompleteState } from '@algolia/autocomplete-shared';
  import type { HTMLTemplate } from '@algolia/autocomplete-shared';
  import type { LiteClient } from 'algoliasearch/lite';
  import type { AlgoliaProfilesResponseLegacy } from '@repo/shared/typings/algolia/profiles';

  import { PUBLIC_ALGOLIA_APP_ID, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY, PUBLIC_ALGOLIA_INDEX_NAME } from '$env/static/public';
  import { formatNumber, normalizeCurrencyToMillions } from '@repo/shared/functions/formatters/numbers';

  interface AlgoliaProfilesItem extends BaseItem, AlgoliaProfilesResponseLegacy {}

  interface AlgoliaItemTemplateProps {
    item: GrantmakersExtractedDataObj;
    html: HTMLTemplate;
  }

  interface AlgoliaNoResultsTemplateProps {
    html: HTMLTemplate;
    state: AutocompleteState<BaseItem>;
  }

  interface Props {
    size?: 'large' | undefined;
    profilesVersion?: 'v0' | 'v1';
    placeholderVersion?: 'foundation' | 'quick';
    onAutocompleteInit: (instance: AutocompleteInstance) => void;
  }

  if (!datasetStats) {
    throw new Error('Missing dataset stats');
  }

  let profilesCount = $derived(formatNumber(datasetStats?.profiles));

  let { size = undefined, profilesVersion = 'v0', placeholderVersion = 'quick', onAutocompleteInit = () => {} }: Props = $props();

  let placeholderText = $derived(placeholderVersion === 'foundation' ? 'Search by Name or EIN...' : 'Quick search...');

  let searchClient: LiteClient;
  const indexName = PUBLIC_ALGOLIA_INDEX_NAME;

  let container: HTMLElement | undefined = $state();
  let autocompleteInstance: AutocompleteInstance;

  const mockResults = staticData;

  const getLabel = (pct: number | 'N/A') => {
    if (pct === 'N/A') return 'N/A';
    if (pct >= 99) return 'Top 1%';
    if (pct >= 90) return 'Top 10%';
    if (pct >= 75) return 'Top 25%';
    if (pct >= 50) return 'Top 50%';
    if (pct < 50) return '<50%';
    return `Top ${(100 - pct).toFixed(0)}%`;
  };

  let getColorClasses = (pct: number | 'N/A') => {
    if (pct === 'N/A') return badgeStyles.default;
    if (pct >= 99) return badgeStyles.success;
    if (pct >= 90) return badgeStyles.success;
    if (pct >= 75) return badgeStyles.info;
    if (pct >= 50) return badgeStyles.indigo;
    // if (pct >= 30) return badgeStyles.purple; // Purple
    return badgeStyles.default;
  };

  const algoliaTemplates = {
    header: ({ html }: { html: HTMLTemplate }) => html`
      <div class="flex items-center justify-between">
        <div class="px-3 py-2 text-xs font-semibold uppercase text-gray-500">Foundation Profiles</div>
        <div class="px-3 py-2 text-xs font-semibold uppercase text-gray-500">Assets</div>
      </div>
    `,
    item: ({ item, html }: AlgoliaItemTemplateProps) => {
      const url = `/profiles/${profilesVersion}/${item.ein}-${item.organization_name_slug}`;
      let percentile: number | 'N/A' = item.rank !== undefined ? ((item.rank_total - item.rank) / item.rank_total) * 100 : 'N/A';
      return html`<a href="${url}" data-sveltekit-reload>
        <div class="px-2 py-3 transition-colors duration-100 hover:bg-slate-100">
          <div class="flex items-center justify-between gap-3">
            <div class="w-full min-w-0 ">
              <div class="flex items-start justify-between gap-x-3">
                <div class="text-normal/6 font-semibold text-gray-900">${item.organization_name}</div>
                <p
                  class="${getColorClasses(
                    percentile,
                  )} mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                >
                  ${getLabel(percentile)}
                </p>
              </div>
              <div class="mt-1 flex w-full items-center justify-between gap-x-2 text-xs/5 text-gray-500">
                <div class="flex items-center gap-x-2">
                  <p class="whitespace-nowrap">${item.city}, ${item.state}</p>
                  <svg viewBox="0 0 2 2" class="size-0.5 fill-current">
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  <p class="truncate">${formatEin(item.ein)}</p>
                </div>
                <div>${normalizeCurrencyToMillions(item.assets)}</div>
              </div>
            </div>
          </div>
        </div></a
      >`;
    },
    footer: ({ html }: { html: HTMLTemplate }) =>
      html`<div class="h-full border-t px-3 py-4 text-base">
        <div class="flex items-center justify-between">
          <a
            data-sveltekit-reload
            class="flex items-center gap-2 text-grantmakers-blue hover:text-grantmakers-orange"
            href="/search/profiles/"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
              <path d="M11.625 16.5a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Z" />
              <path
                fill-rule="evenodd"
                d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6 16.5c.66 0 1.277-.19 1.797-.518l1.048 1.048a.75.75 0 0 0 1.06-1.06l-1.047-1.048A3.375 3.375 0 1 0 11.625 18Z"
                clip-rule="evenodd"
              />
              <path
                d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z"
              />
            </svg>
            <span>Advanced Search</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
          <a
            href="https://algolia.com"
            class="mt-2 flex items-center justify-end gap-2 text-xs text-gray-400 hover:text-gray-500"
            target="_blank"
            rel="noopener"
          >
            Search by
            <img src="${algoliaLogo}" alt="Algolia Logo" style="height: 1rem;" />
          </a>
        </div>
      </div>`,
    noResults: ({ html, state }: AlgoliaNoResultsTemplateProps) => {
      const { query } = state;
      return html`<div class="px-2 py-3 transition-colors duration-100">
        <div class="flex items-center justify-between gap-3">
          <div class="w-full min-w-0 ">
            <div class="flex items-start justify-between gap-x-3">
              <div class="text-normal/6 font-semibold text-gray-900">No matches found</div>
            </div>
            <div class="mt-2 flex  w-full items-center justify-between gap-x-2 text-sm text-gray-500">
              <div class="flex flex-col gap-y-4">
                <p class="w-3/4">
                  We searched the IRS dataset of ${profilesCount} private foundations, but didn't find any matches for:
                  <span class="ml-1 font-bold text-indigo-500">${query}</span>
                </p>
                <div class="flex flex-col gap-2 bg-slate-100 p-4">
                  <div>
                    <div class="flex flex-row items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                        <path
                          fill-rule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      Community and Operating Foundations are not yet included
                    </div>
                  </div>
                </div>
                <a class="flex flex-row items-center gap-1 text-grantmakers-blue" href="/about/the-dataset/"
                  >Learn more about the dataset
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                    <path
                      fill-rule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>`;
    },
  };

  const getItemUrl = ({ item }: { item: AlgoliaProfilesItem }) => `/profiles/${profilesVersion}/${item.ein}-${item.organization_name_slug}`;

  let openSearch = () => {
    if (browser) {
      autocompleteInstance?.setIsOpen(true);
    }
  };

  onMount(async () => {
    // Define Algolia client
    const { liteClient: algoliasearch } = await import('algoliasearch/lite');
    searchClient = algoliasearch(PUBLIC_ALGOLIA_APP_ID, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY);

    // Init Algolia Autocomplete
    const pkg = await import('@algolia/autocomplete-js');
    const { autocomplete, getAlgoliaResults } = pkg;

    if (container) {
      autocompleteInstance = autocomplete({
        container,
        detachedMediaQuery: '',
        placeholder: placeholderText,
        openOnFocus: true,
        classNames: {
          // Docs: https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-classnames
          // Note: Most classes are set in Svelte style tag below
          detachedSearchButton: '!hidden', // Hide the navbar search box and use our SSR placeholder search box as the trigger.
        },
        // @ts-expect-error The Algolia response is properly typed - thus, there's no need to go into the underpinnings of Autocomplete to satisfy this error
        getSources({ query }) {
          if (!query) {
            return [
              {
                sourceId: 'recommended',
                getItems() {
                  return mockResults.slice(0, 5);
                },
                getItemUrl,
                templates: algoliaTemplates,
              },
            ];
          }
          return [
            {
              sourceId: 'foundations',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: indexName,
                      params: {
                        query,
                        hitsPerPage: 5,
                      },
                    },
                  ],
                });
              },
              getItemUrl,
              templates: algoliaTemplates,
            },
          ];
        },
        navigator: {
          // Enables keyboard navigation, e.g. using arrows and enter to select
          navigate({ itemUrl }) {
            // TODO Switch to goto when move to loading data into a profiles store is complete
            window.location.href = itemUrl;
            // goto(itemUrl, { invalidateAll: true });
          },
          navigateNewTab({ itemUrl }) {
            const windowReference = window.open(itemUrl, '_blank', 'noopener');

            if (windowReference) {
              windowReference.focus();
            }
          },
          navigateNewWindow({ itemUrl }) {
            window.open(itemUrl, '_blank', 'noopener');
          },
        },
      });
    }
    onAutocompleteInit(autocompleteInstance);
  });
  onDestroy(() => {
    if (autocompleteInstance) {
      autocompleteInstance.destroy();
    }
  });
</script>

<!-- https://tailwindui.com/components/application-ui/navigation/command-palettes -->

<!-- SSR Placeholder -->
<!-- This mimics the Autocomplete-generated search box -->
<div class="relative mt-0 rounded-md shadow-sm transition-opacity duration-200 {size === 'large' ? 'w-fit' : ''}">
  <button
    type="button"
    class="aa-DetachedSearchButton !placeholder:text-red-900 {size === 'large' ?
      '!min-w-72 ring-4 ring-indigo-400 focus:!ring-indigo-600 sm:!text-base'
    : '!min-w-48 ring-1 ring-inset !ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:!text-sm'} !rounded-md !border-0 sm:!leading-6"
    title="Search"
    onclick={openSearch}
    ><div class="aa-DetachedSearchButtonIcon !cursor-pointer !text-slate-500">
      <svg class="aa-SubmitIcon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"
        ><path
          d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"
        ></path></svg
      >
    </div>
    <div class="aa-DetachedSearchButtonPlaceholder {size === 'large' ? 'text-base' : 'text-sm'} text-slate-500">{placeholderText}</div>
    <div class="aa-DetachedSearchButtonQuery"></div></button
  >
</div>

<div id="#autocomplete" class="hidden" bind:this={container}></div>

<style lang="postcss">
  :global(aa-DetachedContainer--modal) {
    @apply lg:rounded-2xl;
  }
  :global(.aa-DetachedFormContainer) {
    @apply border-b-0 bg-slate-200;
  }
  :global(.aa-DetachedContainer--modal .aa-PanelLayout) {
    max-height: 515px;
  }
  :global(.aa-Form) {
    &:focus-within {
      @apply border-slate-300;
    }
  }
  :global(.aa-SourceHeader) {
    @apply border-b;
  }
  :global(.aa-Item) {
    /* Zebra stripes */
    &:nth-child(odd) {
      @apply bg-white;
    }
    &:nth-child(even) {
      @apply bg-slate-100;
    }
  }
</style>
