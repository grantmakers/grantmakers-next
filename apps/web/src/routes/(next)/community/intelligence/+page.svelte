<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import toast from 'svelte-french-toast';

  let geminiOutput = '';
  let einInput = '';
  let statusMessage = '';

  async function handleSubmit() {
    try {
      const timestamp = new Date().toISOString();
      const dataToSubmit = {
        content: geminiOutput,
        ein: einInput,
        timestamp: timestamp,
        model: 'gemini-2.0-flash-exp',
      };

      const response = await fetch('/api/ai/summary/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        const data = await response.json();
        statusMessage = `Success! Inserted ID: ${data.insertedId}`;
        toast.success(statusMessage);
        geminiOutput = '';
        einInput = '';
      } else {
        const errorData = await response.json();
        statusMessage = `Error: ${errorData.message}`;
      }
    } catch (error) {
      statusMessage = `Error: ${error.message}`;
    }
  }
</script>

<main class="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
  <div class="max-2-xl mx-auto">
    <h2 class="text-base/7 font-semibold text-indigo-600">Community Intelligence</h2>
    <h1>Submit AI Output</h1>
    <form>
      <div class="space-y-12">
        <div class="border-b border-gray-900/10 pb-12">
          <p class="mt-1 text-sm/6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-4">
              <label for="username" class="block text-sm/6 font-medium text-gray-900">EIN</label>
              <div class="mt-2">
                <div
                  class="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
                >
                  <input
                    type="text"
                    name="einInput"
                    id="einInput"
                    bind:value={einInput}
                    class="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                    placeholder="Enter 9 digit EIN"
                  />
                </div>
              </div>
            </div>

            <div class="col-span-full">
              <label for="ai" class="block text-sm/6 font-medium text-gray-900">Insert AI Output</label>
              <div class="mt-2">
                <textarea
                  name="ai"
                  id="ai"
                  bind:value={geminiOutput}
                  placeholder="Paste Gemini Output here"
                  rows="3"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                ></textarea>
              </div>
              <!-- <p class="mt-3 text-sm/6 text-gray-600">Paste in the output from your AI chat</p> -->
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" class="text-sm/6 font-semibold text-gray-900" onclick={() => invalidate($page.url)}>Cancel</button>
        <button
          type="button"
          onclick={handleSubmit}
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >Submit</button
        >
      </div>
    </form>
    {#if statusMessage}
      <p class="text-green-700">{statusMessage}</p>
    {/if}
  </div>
</main>
