<script lang="ts">
  import { meta } from '@repo/shared/constants/trustedConstants';
  const linkToHome = '/';
  const linkToSupport = meta.emails.support;
</script>

<div class="container white z-depth-1">
  <div class="row">
    <div class="col-md-12">
      <div class="error-template">
        <h1>Oops!</h1>
        <h2>404 Not Found</h2>
        <div class="error-details">Sorry, an error has occured, Requested page not found!</div>
        <div class="error-actions">
          <a href={linkToHome} class="btn btn-grantmakers btn-lg"
            ><span class="material-icons">home</span>
            Take Me Home
          </a>
          <a href={`mailto:${linkToSupport}`} class="btn-flat btn-lg valign-wrapper">Contact Support </a>
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
  }
  .material-icons {
    vertical-align: middle;
  }
  .btn-grantmakers {
    background-color: #607d8b !important;
  }
</style>
