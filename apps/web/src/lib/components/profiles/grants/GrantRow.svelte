<script lang="ts">
  import DOMPurify from 'isomorphic-dompurify';
  import { formatToCurrency } from '@shared/functions/formatters/numbers';
  export let grant;

  const sanitize = DOMPurify.sanitize;
</script>

<tr class="even:bg-gray-50 relative">
  <td class="px-3 py-4 text-sm">{formatToCurrency(grant.amount)}</td>
  <td class="py-4 pl-4 pr-3 text-sm sm:pl-0">
    <div class="font-bold text-gray-900 text-md">{grant.name}</div>
  </td>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  <td class="px-3 py-4 text-sm">{@html sanitize(grant.purpose)}</td>
  <td class="px-3 py-4 text-sm">
    {grant.city},
    {grant.is_foreign && grant.state === 'Foreign' ? grant.country : grant.state}
  </td>
  <td class="px-3 py-4 text-sm">{grant.tax_year}</td>
</tr>
