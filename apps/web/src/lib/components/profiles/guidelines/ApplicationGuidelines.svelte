<script lang="ts">
  import Tip from '../alerts/Tip.svelte';
  import { tooltip } from '$utils/tooltip';
  import placeholderImage from '$lib/assets/images/placeholder-application-guidelines.webp';
  import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
  interface Props {
    website?: string | null;
    websiteIsEmail: GrantmakersExtractedDataObj['website_is_an_email'];
    grantsToPreselectedOnly?: GrantmakersExtractedDataObj['grants_to_preselected_only'];
    applicationInfo: GrantmakersExtractedDataObj['grants_application_info'];
    applicationDeadlines: GrantmakersExtractedDataObj['grants_application_deadlines'];
    applicationRestrictions: GrantmakersExtractedDataObj['grants_application_restrictions'];
    applicationContact: GrantmakersExtractedDataObj['grants_application_contact'];
  }

  let {
    website = null,
    websiteIsEmail,
    grantsToPreselectedOnly = null,
    applicationInfo,
    applicationDeadlines,
    applicationRestrictions,
    applicationContact,
  }: Props = $props();

  let formattedPhone = $derived(
    'phone' in applicationContact && applicationContact.phone ?
      `(${applicationContact.phone.slice(0, 3)}) ${applicationContact.phone.slice(3, 6)}-${applicationContact.phone.slice(6, 10)}`
    : 'N/A',
  );
</script>

<div class="p-6">
  {#if website && !websiteIsEmail && !grantsToPreselectedOnly}
    <div class="mb-4 border-b border-slate-200 pb-4">
      <Tip
        title="This foundation appears to have a website."
        message="Check the website for the latest grant application information."
        includeLogo
      />
    </div>
  {/if}

  {#if grantsToPreselectedOnly}
    <div class="mb-4">
      <div class="flex items-start gap-4">
        <div class="rounded-full bg-yellow-500 p-2 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
            <path
              fill-rule="evenodd"
              d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div>
          <span class="font-bold text-slate-700">Preselected Only</span>
          <p class="text-sm text-slate-700">
            The foundation checked a box on its latest tax filing indicating it "only makes contributions to preselected charitable
            organizations and doesn't accept unsolicited applications for funds".
          </p>
        </div>
      </div>
    </div>
  {/if}

  {#if applicationInfo}
    {#if grantsToPreselectedOnly}
      <hr class="my-4 border-t border-slate-200" />
    {/if}
    <div class="mt-4 space-y-4">
      <div class="flex items-start gap-4">
        <div
          class="rounded-full bg-slate-500 p-2 text-white"
          use:tooltip={{
            content: 'The form in which applications should be submitted and information and materials they should include Line 2b',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
        <div class="rounded-full bg-slate-500 p-2 text-white" use:tooltip={{ content: 'Any submission deadlines Line 2c' }}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
          class="rounded-full bg-slate-500 p-2 text-white"
          use:tooltip={{
            content:
              'Any restrictions or limitations on awards, such as by geographical areas, charitable fields, kinds of institutions, or other factors Line 2d',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="m6.72 5.66 11.62 11.62A8.25 8.25 0 0 0 6.72 5.66Zm10.56 12.68L5.66 6.72a8.25 8.25 0 0 0 11.62 11.62ZM5.105 5.106c3.807-3.808 9.98-3.808 13.788 0 3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div>
          <span class="font-bold text-slate-700">Restrictions</span>
          <p class="text-sm text-slate-700">{applicationRestrictions}</p>
        </div>
      </div>

      {#if 'name' in applicationContact && applicationContact.name}
        <hr class="my-4 border-t border-slate-200" />

        <div class="flex items-start gap-4">
          <div
            class="rounded-full bg-slate-500 p-2 text-white"
            use:tooltip={{
              content:
                'The name, address, and telephone number or e-mail address of the person to whom applications should be addressed Line 2a',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
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
                    {#if applicationContact.email.includes('@')}
                      <a href="mailto:{applicationContact.email.toLowerCase()}" class="hover:underline">
                        {applicationContact.email.toLowerCase()}
                      </a>
                    {:else}
                      {applicationContact.email.toLowerCase()}
                    {/if}
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
                Tip: General contact information can often be found elsewhere in the funders most recent Form 990-PF (see PDF links below).
              </p>
            {/if}
          </div>
        </div>
      {:else}
        foo
      {/if}
    </div>
  {/if}

  {#if !website && !grantsToPreselectedOnly && !applicationInfo}
    <p>No guidance listed in the latest available tax filing</p>
    <div class="mt-4 opacity-20 lg:p-8">
      <img src={placeholderImage} alt="No Guidelines Provided Placeholder" width={600} height={600} class="rounded-lg opacity-90" />
    </div>
  {/if}
</div>
