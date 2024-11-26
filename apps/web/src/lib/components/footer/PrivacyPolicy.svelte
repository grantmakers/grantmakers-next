<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  function loadIubendaScript() {
    const script = document.createElement('script');
    script.src = 'https://cdn.iubenda.com/iubenda.js';
    document.head.appendChild(script);
  }

  onMount(() => {
    if (browser) {
      loadIubendaScript();
    }
  });
</script>

<a
  href="https://www.iubenda.com/privacy-policy/7996402"
  class="iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iub-legal-only iubenda-noiframe leading-6 text-gray-300 hover:text-white"
  title="Privacy Policy"
  >Privacy Policy
</a>
