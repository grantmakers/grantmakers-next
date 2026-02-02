<script lang="ts">
  import { formatCompensation } from '$src/lib/utils/peopleComp';
  import type { Person } from '@repo/shared/typings/grantmakers/all';

  let { person }: { person: Person } = $props();
</script>

<tr>
  <td class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
    {person.name}
  </td>
  <td class="px-3 py-4 text-sm text-gray-500">{person.title}</td>
  <td class="px-3 py-4 text-right text-sm text-gray-500">{person.hours}</td>
  <td class="px-3 py-4 text-right text-sm text-gray-500">{formatCompensation(person.compensation)}</td>
</tr>
