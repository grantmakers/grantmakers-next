<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { AutocompleteApi } from '@algolia/autocomplete-js';
  import type { BaseItem } from '@algolia/autocomplete-core';
  import type { LiteClient } from 'algoliasearch/lite';
  import '@algolia/autocomplete-theme-classic';
  import algoliaLogo from '$lib/assets/images/Algolia-logo-blue.svg';

  import { PUBLIC_ALGOLIA_APP_ID, PUBLIC_ALGOLIA_SEARCH_ONLY_KEY, PUBLIC_ALGOLIA_INDEX_NAME } from '$env/static/public';

  let searchClient: LiteClient;
  const indexName = PUBLIC_ALGOLIA_INDEX_NAME;

  let container: HTMLElement;
  let panelContainer: HTMLElement;
  let autocompleteInstance: AutocompleteApi<BaseItem>;

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
        panelContainer,
        detachedMediaQuery: '',
        openOnFocus: true,
        classNames: {
          // https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#components
          detachedFormContainer: '!rounded-t-2xl !border-b-0 !bg-slate-200',
          detachedSearchButton:
            '!rounded-md !border-0 !min-w-48 ring-1 ring-inset !ring-gray-300 !placeholder:text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 !sm:text-sm !sm:leading-6',
          detachedSearchButtonIcon: '!text-slate-500',
          detachedSearchButtonPlaceholder: 'text-slate-500 text-sm',
        },
        getSources({ query }) {
          return [
            {
              sourceId: 'foundations',
              getItemUrl({ item }) {
                return `/profiles/v1/${item.ein}`;
              },
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
              templates: {
                header({ html }) {
                  return html`<div class="px-3 py-2 text-xs font-semibold uppercase text-gray-500">Foundation Profiles</div>`;
                },
                item({ item, html }) {
                  // HACK data-sveltekit-reload forces a full refresh
                  // TODO Enable client-side fetch for these situations
                  // AKA There is no need to re-download chart.js, etc
                  return html`<a href="/profiles/v1/${item.ein}" data-sveltekit-reload
                    ><div class="px-3 py-2 transition-colors duration-100 hover:bg-gray-100">
                      <div class="flex items-center gap-3">
                        <div class="min-w-0 flex-1">
                          <div class="truncate text-sm font-medium text-gray-900">${item.organization_name}</div>
                          ${item.city && item.state ?
                            html` <div class="truncate text-xs text-gray-500">${item.city}, ${item.state}</div> `
                          : ''}
                        </div>
                      </div>
                    </div></a
                  >`;
                },
                footer({ html }) {
                  return html`<div class="border-t px-3 py-2 text-xs text-gray-400">
                    <a
                      href="https://algolia.com"
                      class="mt-2 flex items-center justify-end gap-2 hover:text-gray-500"
                      target="_blank"
                      rel="noopener"
                    >
                      Search by
                      <img src="${algoliaLogo}" alt="Algolia Logo" style="height: 1rem;" />
                    </a>
                  </div>`;
                },
              },
            },
          ];
        },
        navigator: {
          navigate({ itemUrl }) {
            // Force a full page reload
            // Temp solution until we upgrade to SvelteKit 5 and add client-side fetch
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
  });
  onDestroy(() => {
    if (autocompleteInstance) {
      autocompleteInstance.destroy();
    }
  });
</script>

<div id="#autocomplete" bind:this={container} class=""></div>
