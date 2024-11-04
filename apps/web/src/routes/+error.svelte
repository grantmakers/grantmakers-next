<script lang="ts">
  import { page } from '$app/stores';
  import PageNotFound404 from '$lib/components/errors/PageNotFound404.svelte';
  import ServerError500 from '$lib/components/errors/ServerError500.svelte';
</script>

{#if $page.status === 404}
  <PageNotFound404 />
{:else if $page.status === 500}
  <ServerError500 />
{:else}
  <h1>Error {$page.status}</h1>
  <p>{$page.error?.message}</p>
{/if}
