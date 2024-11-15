<script lang="ts">
  import { page } from '$app/stores';
  import PageNotFound404 from '$lib/components/errors/PageNotFound404.svelte';
  import ServerError500 from '$lib/components/errors/ServerError500.svelte';
  import BadRequest400 from '$lib/components/errors/BadRequest400.svelte';
  console.log($page.error?.message);
</script>

{#if $page.status === 404}
  <PageNotFound404 />
{:else if $page.status === 500}
  <ServerError500 />
{:else if $page.status === 400}
  <BadRequest400 message={$page.error?.message} />
{:else}
  <h1>Error {$page.status}</h1>
  <p>{$page.error?.message}</p>
{/if}
