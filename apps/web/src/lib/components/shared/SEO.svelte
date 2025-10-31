<script lang="ts">
  import { page } from '$app/state';
  import { originProd, profilesVersionProd } from '@repo/shared/constants/trustedConstants';
  import { upperFirstLetter } from '@repo/shared/functions/formatters/names';
  import { sanitizeHtml } from '@repo/shared/utils/sanitize';
  import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';

  type Title = GrantmakersExtractedDataObj['organization_name'];
  type Description = Pick<GrantmakersExtractedDataObj, 'organization_name' | 'city' | 'state' | 'ein' | 'filings'>;

  interface Props {
    profile: GrantmakersExtractedDataObj;
  }

  let { profile }: Props = $props();
  const { organization_name, city, state, ein, filings } = profile;

  const title = createTitle(organization_name);
  const description = createDescription({ organization_name, city, state, ein, filings });
  const pathname = $derived(page.url.pathname);
  const canonicalUrl = $derived(createCanonical(pathname, originProd, profilesVersionProd));

  function createTitle(organization_name: Title): string {
    return `Grantmakers.io Profile - ${organization_name}`;
  }

  function createDescription({ organization_name, city, state, ein, filings }: Description): string {
    const firstTaxYear = filings[0].tax_year;
    const stringifiedTaxYr = firstTaxYear?.toString();
    const description = `Profile for ${organization_name} (${city}, ${state} - EIN ${ein}) including grantees and board members as of ${stringifiedTaxYr} tax year.`;
    return description;
  }

  function createCanonical(pathname: string, targetOrigin: string, profilesVersion: string) {
    const profileId = pathname.split('/').slice(-2)[0];
    const canonicalUrl = `${targetOrigin}/profiles/${profilesVersion}/${profileId}`;

    return canonicalUrl;
  }

  const jsonld = $derived({
    '@context': 'https://schema.org/',
    '@type': 'NGO',
    legalName: profile.organization_name,
    taxID: profile.ein,
    ...(profile.website && { url: profile.website }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.city,
      addressRegion: profile.state,
      postalCode: profile.zip,
      streetAddress: `${profile.street} ${profile.street2 ? profile.street2 : ''}`,
    },
  });

  const jsonldBreadcrumb = $derived({
    '@context': 'https://schema.org/',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@id': 'https://www.grantmakers.io/',
          name: 'Grantmakers.io',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@id': 'https://www.grantmakers.io/search/profiles/',
          name: 'Foundation Profiles',
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@id': canonicalUrl,
          name: profile.organization_name,
        },
      },
    ],
  });
</script>

<link rel="canonical" href={canonicalUrl} />
<title>{title}</title>
<meta name="description" content={description} />

<meta name="format-detection" content="telephone=no" />

<meta property="og:image" content="https://www.grantmakers.io/assets/img/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:title" content={profile.organization_name} />
<meta property="og:site_name" content="Grantmakers.io" />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:description" content={description} />
<meta property="og:type" content="profile" />

<!-- Twitter -->
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content={profile.organization_name} />
<meta name="twitter:description" content={description} />
<meta name="twitter:site" content="@grantmakersio" />
<meta name="twitter:creator" content="@chadkruser" />
<meta name="twitter:image:src" content="{originProd}/assets/img/icons-letters/{upperFirstLetter(profile.organization_name)}.png" />

<!-- Schema.org -->
<!-- Sanitized with DOMPurify -->
<!-- eslint-disable svelte/no-at-html-tags -->
{@html sanitizeHtml('<script type="application/ld+json">' + JSON.stringify(jsonld) + '</script>')}
{@html sanitizeHtml('<script type="application/ld+json">' + JSON.stringify(jsonldBreadcrumb) + '</script>')}
<!-- eslint-enable svelte/no-at-html-tags -->
