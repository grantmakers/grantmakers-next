<script lang="ts">
  import { invalidate } from '$app/navigation';

  async function refreshPage() {
    // invalidate() refreshes all data for the current page
    await invalidate('app:data');
    // As a fallback, also do a hard refresh if needed
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
</script>

<div class="container white z-depth-1">
  <div class="row">
    <div class="col-md-12">
      <div class="error-template">
        <h1>Oops!</h1>
        <h2>500 Server Error</h2>
        <div class="error-details">Oof. We've been notified and are working on a fix.</div>
        <div class="error-actions">
          <button onclick={refreshPage} class="btn btn-grantmakers btn-lg">Refresh the Page</button>
          Or, simply wait a few minutes
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .error-template {
    background: white;
    padding: 4rem;
    text-align: center;
  }
  .error-actions {
    padding-top: 1rem;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px; /* Adds space between icon and text */
    margin-right: 5px;
  }
  .btn-grantmakers {
    background-color: #607d8b !important;
  }
</style>
