<div align="center">
  <a href="https://next.grantmakers.io">
    <img src="./apps/web/static/logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Grantmakers.io NEXT</h1>

  <p align="center">
    Grantmakers.io is a free, open source project built to help nonprofits
    <br />
    utilize the incredible IRS electronic 990-PF dataset.
    <br />
    <a href="https://next.grantmakers.io"><strong>next.grantmakers.io »</strong></a>
    <br />
    <br />
    <a href="https://github.com/grantmakers/grantmakers-next/tree/main/apps/web">SvelteKit App</a>
    ·
    <a href="https://github.com/grantmakers/grantmakers-next/tree/main/apps/api">Cloudflare Workers API</a>
    ·
    <a href="https://github.com/grantmakers/grantmakers-next/tree/main/apps/etl">NodeJS ETL</a>
  </p>
</div>

# The Project

Since its creation in 2016, Grantmakers.io has become one of the largest free sources of searchable philanthropic data on the Internet. Grantmakers NEXT is a complete rebuild of Grantmakers.io.

### Core Values

✅ Non-commercial  
✅ Forever free  
🎁 Powered solely by generous in-kind support

Grantmakers.io has thrived as a project because no money changes hands. There is no overhead to support, no employees to feed, and no time spent fundraising. No overhead means no paywalls.

> No paywalls means **truly equitable access** to an important dataset for nonprofits.

### Emerging Ideals

🌻 Built to inspire, not compete  
🌐 AI as a tool to empower, not replace  
🔒 Respecting "Publicly Private" foundations

The project embraces ideals of openness, privacy, and decentralization. The nonprofit data community has relied on centralized data access for over half a century - the Grantmakers.io project leverages modern tooling and technologies to explore what the next century of philanthropic data access might look like.

> Hypothesis: For philanthropic data, the value of **collective intelligence** will far exceed artificial intelligence

## The Project's Superpower: Algolia Search

<br />
<div align="left">
  <a href="https://www.algolia.com/" alt="Algolia Logo">
    <img src="./apps/web/src/lib/assets/images/Algolia-logo-blue-for-README.png" alt="Algolia Logo" width="144" height="33">
  </a>
</div>
<br />

The superpower behind Grantmakers.io's popularity is a JAMstack integration with Algolia, specifically their Instantsearch product. The original site leverages an incredibly generous free-tier that effectively [negates the need for a backend](https://stories.algolia.com/why-hosted-search-made-sense-for-grantmakers-io-8974f5ed6bd6) and the software engineering time to maintain it.

The most used feature on Grantmakers.io is the ability to search through the millions of grant descriptions contained in the IRS 990-PF dataset. The integration provides fully-faceted live search, allowing nonprofit fundraisers to quickly conduct prospect research into an important resource. All at no cost, no paywall, and no login.

<a href="https://www.grantmakers.io/search/grants/"><strong>Try it out »</strong></a>
<br />

In addition to the full dataset grants search, Algolia Instantsearch is embedded on all ~110k foundation profiles. Over the years, some foundations have even referred grantseekers to this embedded search in lieu of building their own grants database search experiences.

> Algolia provides the live search experience nonprofits have long deserved.

# This Monorepo

Note: This public repo is a work in progress. It was published early in the rebuild process to a) develop in the open, and b) provide reference code for other developers exploring the modern JS tooling and frameworks the project uses, including Turborepo, Svelte, SvelteKit, Cloudflare Pages, Cloudflare Workers, Cloudflare R2, and MongoDB Atlas Serverless.

## Grantmakers.io NEXT Architecture

**Key architectural premise**: Leverage best-in-class abstractions to minimize upfront software engineering and ongoing maintenance.

### System Design

Diagram coming soon.

### Getting Started

Instructions coming soon.

## Legacy Architecture

**Key architectural premise**: Static site generation was viable since tax filing data only refreshes annually.

The legacy Jekyll application is located here: [https://github.com/grantmakers/grantmakers.github.io](https://github.com/grantmakers/grantmakers.github.io)

Jekyll  
Github Pages  
Algolia Instantsearch  
MongoDB on Google Compute Engine

The Grantmakers.io project was an early adopter of JAMstack. The 1-2 hour Jekyll builds for the ~100k pages and ~150k redirects were offloaded to a CI free tier on CodeShip. The original ETL pipelines were semi-automated using Google Cloud Platform. GCP was used primarily for compute and storage, with it's underrated Transfer Service powering the data sync to the public IRS AWS bucket.

> In 2021, the IRS ceased publishing the data to its public AWS S3 bucket, publishing instead directly on IRS.gov.

## Useful Links

Legacy links are open to everyone. The NEXT links may be temporarily behind a Cloudflare Access portal. These links will be opened up as ethical and legal tasks are completed.

- [Grantmakers.io Legacy](https://www.grantmakers.io/)
- [Grantmakers.io Legacy Profile](https://www.grantmakers.io/profiles/v0/562618866-bill-and-melinda-gates-foundation/)
- [Grantmakers.io NEXT](https://next.grantmakers.io)
- [Grantmakers.io NEXT Profile](https://next.grantmakers.io/profiles/v1/562618866-bill-and-melinda-gates-foundation/)
