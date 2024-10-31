<script lang="ts">
  import Tip from '../alerts/Tip.svelte';
  import type { GrantmakersExtractedDataObj } from '@shared/typings/grantmakers/grants';
  export let website: string | null = null;
  export let websiteIsEmail: GrantmakersExtractedDataObj['website_is_an_email'];
  export let grantsToPreselectedOnly: GrantmakersExtractedDataObj['grants_to_preselected_only'] = null;
  export let applicationInfo: GrantmakersExtractedDataObj['grants_application_info'];
  export let applicationDeadlines: GrantmakersExtractedDataObj['grants_application_deadlines'];
  export let applicationRestrictions: GrantmakersExtractedDataObj['grants_application_restrictions'];
  export let applicationContact: GrantmakersExtractedDataObj['grants_application_contact'];

  $: formattedPhone =
    'phone' in applicationContact && applicationContact.phone ?
      `(${applicationContact.phone.slice(0, 3)}) ${applicationContact.phone.slice(3, 6)}-${applicationContact.phone.slice(6, 10)}`
    : 'N/A';
</script>

<div class="p-6">
  {#if website && !websiteIsEmail && !grantsToPreselectedOnly}
    <div class="mb-4 border-b pb-4">
      <Tip
        title="This foundation appears to have a website."
        message="Check the website for the latest grant application information."
        includeLogo
      />
    </div>
  {/if}

  {#if grantsToPreselectedOnly}
    <div class="mb-4">
      <div class="flex items-center gap-4">
        <div class="rounded-full bg-red-600 p-2 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <p class="text-slate-700">
          The foundation checked a box on its latest tax filing indicating it only makes contributions to preselected charitable
          organizations and does not accept unsolicited requests for funds.
        </p>
      </div>
    </div>
  {/if}

  {#if applicationInfo}
    <div class="space-y-4">
      <div class="flex items-start gap-4">
        <div
          class="tooltip-trigger rounded-full bg-slate-500 p-2 text-white"
          data-tooltip="The form in which applications should be submitted and information and materials they should include Line 2b"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <span class="font-bold text-slate-700">Instructions</span>
          <p class="text-sm text-slate-700">{applicationInfo}</p>
        </div>
      </div>

      <div class="flex items-start gap-4">
        <div class="tooltip-trigger rounded-full bg-slate-500 p-2 text-white" data-tooltip="Any submission deadlines Line 2c">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <span class="font-bold text-slate-700">Deadlines</span>
          <p class="text-sm text-slate-700">{applicationDeadlines}</p>
        </div>
      </div>

      <div class="flex items-start gap-4">
        <div
          class="tooltip-trigger rounded-full bg-slate-500 p-2 text-white"
          data-tooltip="Any restrictions or limitations on awards, such as by geographical areas, charitable fields, kinds of institutions, or other factors Line 2d"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <span class="font-bold text-slate-700">Restrictions</span>
          <p class="text-sm text-slate-700">{applicationRestrictions}</p>
        </div>
      </div>

      {#if 'name' in applicationContact && applicationContact.name}
        <hr class="my-4 border-gray-200" />

        <div class="flex items-start gap-4">
          <div
            class="tooltip-trigger rounded-full bg-slate-500 p-2 text-white"
            data-tooltip="The name, address, and telephone number or e-mail address of the person to whom applications should be addressed Line 2a"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <div>
            <span class="font-bold text-slate-700">Contact</span>
            {#if applicationContact.name}
              <div class="text-sm text-slate-700">
                <p>{applicationContact.name}</p>
                {#if applicationContact.email}
                  <p class="text-gray-600">
                    <a href="mailto:{applicationContact.email.toLowerCase()}" class="hover:underline">
                      {applicationContact.email.toLowerCase()}
                    </a>
                  </p>
                {/if}
                <p>{applicationContact.address.street}</p>
                {#if applicationContact.address.street2}
                  <p>{applicationContact.address.street2}</p>
                {/if}
                <p>
                  {applicationContact.address.city}, {applicationContact.address.state}
                  {applicationContact.address.zip}
                  {#if applicationContact.address.country}
                    {applicationContact.address.country}
                  {/if}
                </p>
                {#if applicationContact.phone}
                  <p>{formattedPhone}</p>
                {/if}
              </div>
            {:else}
              <p>No specific grant application guidance is provided in the tax filing.</p>
              <p>
                Tip: General contact information can often be found elsewhere in the funders most recent Form 990 PF (see PDF links below).
              </p>
            {/if}
          </div>
        </div>
      {:else}
        foo
      {/if}
    </div>
  {/if}
</div>
