<script lang="ts">
  /**
   * TODO This will be moved to SvelteKit layout
   * See notes in [ein]/+page.svelte
   */
  import type { GrantmakersExtractedDataObj } from '@shared/typings/grantmakers/grants';

  type Title = GrantmakersExtractedDataObj['organization_name'];
  type Description = Pick<GrantmakersExtractedDataObj, 'organization_name' | 'city' | 'state' | 'ein' | 'filings'>;

  export let profile: GrantmakersExtractedDataObj;

  const { organization_name, city, state, ein, filings } = profile;
  const title = createTitle(organization_name);
  const description = createDescription({ organization_name, city, state, ein, filings });

  function createTitle(organization_name: Title): string {
    return `Grantmakers.io Profile - ${organization_name}`;
  }

  function createDescription({ organization_name, city, state, ein, filings }: Description): string {
    const firstTaxYear = filings[0].tax_year;
    const stringifiedTaxYr = firstTaxYear.toString();
    const description = `Profile for ${organization_name} (${city}, ${state} - EIN ${ein}) including grantees and board members as of ${stringifiedTaxYr} tax year.`;
    return description;
  }

  // console.log('Post-Hydration Page Title:', title);
  // console.log('Post-Hydration Page Description:', description);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>
