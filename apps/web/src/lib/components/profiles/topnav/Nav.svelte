<script lang="ts">
  import Autocomplete from './Autocomplete.svelte';
  import type { AutocompleteInstance } from '@repo/shared/typings/algolia/autocomplete';

  interface Props {
    handleAutocompleteInit: (instance: AutocompleteInstance) => void;
  }

  let { handleAutocompleteInit }: Props = $props();
</script>

<div class="relative">
  <!-- Future Nav items go here -->
  <!-- Algolia Component -->
  <Autocomplete onAutocompleteInit={handleAutocompleteInit} />
</div>
