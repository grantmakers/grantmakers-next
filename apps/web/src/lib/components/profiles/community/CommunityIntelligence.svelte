<script lang="ts">
  import Blink from '$lib/components/shared/icons/Blink.svelte';
  import ContentBoxHeader from '../ContentBoxHeader.svelte';
  import BellAlert from 'svelte-heros-v2/BellAlert.svelte';
  import Sparkles from 'svelte-heros-v2/Sparkles.svelte';
  import logo from '$lib/assets/images/logo.svg';
  import Divider from '$lib/components/shared/Divider.svelte';

  interface Props {
    ein: string;
  }

  let { ein }: Props = $props();

  const aiSummaries: { [key: string]: string } = {
    // The Plant Memorial uses the Claude prompt but in Google AI Studio with Gemini Pro 002
    '010131950':
      'The Plant Memorial Home functions as a private operating foundation, primarily serving as a direct provider of elder care services rather than a traditional grantmaker. Their consistent, hyperlocal giving demonstrates a deep commitment to their immediate community in Maine, specifically focused on subsidized assisted living. They champion practical solutions to the challenges faced by their residents and are unlikely to fund untested programs. Given their operating nature and limited staff, their engagement style is likely transactional rather than relationship-driven. Building a connection with key decision-makers will be essential for any external organization seeking collaboration, though funding opportunities are extremely limited given their focused mission. Their primary value is ensuring the well-being of the elderly they serve directly, viewing their role as a direct service provider.',
    // This suggest the Claude prompt needs to adjusting...they don't donate to nonprofits directly, which is cool, time to move on
    '611913297':
      "Every Org is a supplementary funder, acting as a facilitator rather than a primary grantmaker. Their giving supports a wide range of organizations, suggesting an openness to diverse approaches and a willingness to fund newer, less established ventures. Their online platform indicates a preference for streamlined, tech-forward interactions. While relationship-building might not be their primary focus, their emphasis on accessibility suggests a commitment to empowering both nonprofits and donors. Every Org's mission centers on democratizing philanthropy, indicating a belief in the power of collective giving to solve global problems. They envision their role as a catalyst for change, providing the infrastructure for a more generous world. The best approach is likely through their online platform, highlighting a project's alignment with their values of accessibility and broad impact.",
    '832856275':
      'Expa Org appears to be a supplementary funder, providing substantial but infrequent grants. Their giving pattern suggests a preference for established organizations and initiatives, demonstrated by grants marked as “general support” or “operating support,” rather than early-stage, high-risk ventures. While their grant amounts are significant, their limited staff suggests a streamlined, potentially transaction-focused approach. This likely means cultivating a relationship with key decision-makers is crucial. Geographically focused on their local community and select national partners, Expa Org prioritizes organizations within their network. Their funding choices indicate a commitment to strengthening core organizational capacity and enabling existing programs to scale, playing a supportive role in fostering growth within specific organizations. Direct and concise communication about a project’s alignment with their chosen grantees’ missions and demonstrable impact will likely be most effective.',
    '810718077':
      "The Thierer Family Foundation, based in Chicago, IL, primarily supports organizations located in the Chicago metropolitan area, though some grants extend to other US locations. The foundation has a website, http://thiererfamilyfoundation.org, and appears to have paid staff. While tax filings indicate the foundation only funds pre-selected organizations, further research may be warranted. Giving appears to focus on basic needs, arts & culture, healthcare, and education. Grants range from $1,000 to $165,500, with many grants clustering in the $5,000-$50,000 range and a small number exceeding $50,000. Nonprofits in the Chicago area working in the aforementioned program areas could be a good fit, but should be prepared for additional cultivation given the foundation's history of primarily supporting a smaller, set group of organizations.",
    '510381959':
      'The Harnisch Family Foundation, Inc. is a private foundation supporting primarily charitable purposes. In 2022, they awarded 69 grants ranging from $1,000 to $275,000, with most grants clustered between $1,000 and $49,999. Grantmaking appears to focus on organizations serving women and girls, media/film, and racial equity. The foundation has a history of grantmaking with over 700 grants distributed over multiple years. Geographic giving appears to be national, though New York and California receive a higher volume of funding. With assets of roughly $8.7 million, the foundation appears to be staffed, and lists contact information for grant applications on their website, http://www.thehf.org. Nonprofits focused on issues impacting women and girls, particularly those engaged in media and/or racial equity work, may find pursuing funding to be worthwhile.',
    '131684331':
      'The Ford Foundation is a large, staffed private foundation with assets exceeding $16 billion (2022). Their website, http://www.fordfoundation.org, offers additional information. The foundation supports a variety of causes, but a significant portion of grants appears to be dedicated to social justice initiatives, arts, and international development. Grants range from $75 to over $16 million, with a median grant amount of $100,000. While many grants fall within the $100,000 - $999,999 range, a considerable number are designated as "Matching Gift," suggesting an employee matching program. Excluding these, general operating support is frequently provided. The foundation\'s programs, including the BUILD program, Global Fellowship program, and Art for Justice, constitute a major part of their grantmaking. Geographically, while the foundation supports organizations across the U.S. and internationally, higher concentrations of funding are directed to organizations in New York and the greater Washington D.C. area. Nonprofits working in social justice, particularly those focused on combating inequality, along with arts organizations and international development groups, appear to be the best fit for pursuing further research. The provided application instructions on the tax form indicate an open application process.',
  };
</script>

<div class="mb-0 rounded-t-2xl border-b-0 bg-slate-200 p-4">
  <ContentBoxHeader title={'Community Intelligence'}>
    <div class="flex items-center justify-center gap-2">
      <Blink />
    </div>
  </ContentBoxHeader>
</div>
<div class="flex-auto items-start justify-center space-x-2 p-4">
  {#if aiSummaries[ein]}
    <p class="text-sm">{aiSummaries[ein]}</p>
  {:else}
    <div class="flex flex-col gap-4">
      <div class="rounded-lg border-2 border-dashed border-gray-300 p-6">
        <div class="flex flex-row items-center justify-evenly gap-8 text-sm text-slate-700">
          <div class="flex flex-col items-center">
            <Sparkles variation="solid" class="text-grantmakers-blue" />
            <h2 class="mb-2 mt-2 text-base font-semibold leading-6 tracking-tighter text-slate-700">AI Summaries</h2>
          </div>
          <div class="mt-1 flex flex-col items-start gap-4 lg:min-w-[300px]">
            🌐 Public data, is combined with

            <div class="flex items-center gap-1">
              <img src={logo} alt="Grantmakers.io Logo" class="wr-0 h-4 w-4" /> Grantmakers.io open source prompts, to
            </div>

            <div class="flex items-center gap-1">
              <Sparkles variation="solid" /> Generate AI summaries, that are
            </div>

            <div class="flex items-center gap-1">
              <Blink classes={'h-4 w-4'} /> Selected and curated by the community
            </div>
            <Divider />
            <div class="font-bold">Community Intelligence, powered by YOU</div>
          </div>
        </div>
      </div>
      <div class="rounded-lg border-2 border-dashed border-gray-300 p-6">
        <div class="flex flex-row items-center justify-evenly gap-8 text-sm text-slate-700">
          <div class="flex flex-col items-center">
            <BellAlert variation="solid" class="text-grantmakers-blue" />
            <h2 class="mb-2 mt-2 flex flex-col items-center text-base font-semibold leading-6 tracking-tighter text-slate-700">
              <span>Crowdsourced</span><span>Updates</span>
            </h2>
          </div>
          <div class="mt-1 flex flex-col items-start gap-4 lg:min-w-[300px]">🌐 Public tax returns can be stale</div>
        </div>
      </div>
    </div>
  {/if}
</div>
