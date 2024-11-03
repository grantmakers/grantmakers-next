<script lang="ts">
  import { formatToCurrency } from '@shared/functions/formatters/numbers';
  export let grant;
</script>

<tr class="relative even:bg-gray-50">
  <td class="px-3 py-4 text-sm">{formatToCurrency(grant.amount)}</td>
  <td class="py-4 pl-4 pr-3 text-sm sm:pl-0">
    <div class="text-md font-bold text-gray-900">{grant.name}</div>
  </td>
  <!-- Source: IRS core dataset via Grantmakers ETL -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  <td class="px-3 py-4 text-sm">{@html grant.purpose}</td>
  <td class="px-3 py-4 text-sm">
    {grant.city},
    {grant.is_foreign && grant.state === 'Foreign' ? grant.country : grant.state}
  </td>
  <td class="px-3 py-4 text-sm">{grant.tax_year}</td>
</tr>
