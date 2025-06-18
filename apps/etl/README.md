# Grantmakers.io NEXT

## ETL Pipeline

### Overview

The IRS publishes nonprofit tax filings publicly at IRS.gov[1]. Grantmakers.io currently focuses exclusively on Form 990-PF, the form filed by private foundations.

The Grantmakers.io ETL Pipeline transforms the raw XML data into structured MongoDB collections. These collections are then exported to:

1. Cloudflare R2 as individual JSON files
2. Algolia as search-optimized JS objects

### Prerequisites

- MongoDB running locally
- Node.js with tsx
- Bash shell
- rclone configured for Cloudflare R2
- Algolia credentials

### IRS Source

[1] https://www.irs.gov/charities-non-profits/form-990-series-downloads

## Pipeline Workflow

```mermaid
graph TD
    A[IRS.gov Zip Files] --> B{{irsZips/index.ts}} --> C[Local Zip Files]
    C --> D{{unzip.sh}} --> E[XML Files]
    E --> F{{xml2json.ts}} --> G[MongoDB: raw_filings]

    H[EOBMF Data] --> I{{eobmf.sh}} --> J[MongoDB: eobmf]
    K[Pub78 Data] --> L{{pub78.sh}} --> M[MongoDB: pub78]

    G --> N{{normalize.ts}}
    J --> N
    M --> N

    N --> O[MongoDB: filings]

    O --> P{{aggregate.ts}} --> Q[MongoDB: aggregated]
    O --> R{{grants/index.ts}} --> S[MongoDB: grants]

    Q --> T{{to-algolia.ts}} --> U[MongoDB: algolia]
    U --> V{{profiles sync}} --> W[Algolia Profiles Index]
    S --> X{{reduce-to-algolia.ts}} --> Y[MongoDB: grants_for_algolia]
    Y --> Z{{grants sync}} --> AA[Algolia Grants Index]

    Q --> BB{{to-r2-profiles.ts}} --> CC[MongoDB: r2]
    CC --> DD{{rclone sync}} --> EE[Cloudflare R2 Profiles]
```
