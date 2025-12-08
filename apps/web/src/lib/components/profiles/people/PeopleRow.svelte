<script lang="ts">
  import { formatCompensation } from '$src/lib/utils/peopleComp';
  import type { Person } from '@repo/shared/typings/grantmakers/all';

  let { person }: { person: Person } = $props();
</script>

<tr>
  <td class="w-full py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
    {person.name}
    <dl class="font-normal sm:hidden">
      <dt class="sr-only">Title</dt>
      <dd class="mt-1 truncate text-xs text-gray-700">{person.title}</dd>
      <dt class="sr-only">Hours per Week</dt>
      <dd class="mt-1 truncate text-sm text-gray-500">{person.hours}</dd>
    </dl>
  </td>
  <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{person.title}</td>
  <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{person.hours}</td>
  <td class="px-3 py-4 text-sm text-gray-500">{formatCompensation(person.compensation)}</td>
</tr>
