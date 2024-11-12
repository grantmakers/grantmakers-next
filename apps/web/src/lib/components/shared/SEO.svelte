<script lang="ts">
  /**
   * TODO This will be moved to SvelteKit layout
   * See notes in [ein]/+page.svelte
   */
  import type { GrantmakersExtractedDataObj } from '@shared/typings/grantmakers/all';

  type Title = GrantmakersExtractedDataObj['organization_name'];
  type Description = Pick<GrantmakersExtractedDataObj, 'organization_name' | 'city' | 'state' | 'ein' | 'filings'>;

  interface Props {
    profile: GrantmakersExtractedDataObj;
  }

  let { profile }: Props = $props();

  const { organization_name, city, state, ein, filings } = profile;
  const title = $derived(createTitle(organization_name));
  const description = $derived(createDescription({ organization_name, city, state, ein, filings }));

  function createTitle(organization_name: Title): string {
    return `Grantmakers.io Profile - ${organization_name}`;
  }

  function createDescription({ organization_name, city, state, ein, filings }: Description): string {
    const firstTaxYear = filings[0].tax_year;
    const stringifiedTaxYr = firstTaxYear?.toString();
    const description = `Profile for ${organization_name} (${city}, ${state} - EIN ${ein}) including grantees and board members as of ${stringifiedTaxYr} tax year.`;
    return description;
  }
</script>

<title>{title}</title>
<meta name="description" content={description} />
