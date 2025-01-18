<!-- 
  Keeping this legacy code around should the /profiles/ full index route need to be recreated
  Currently using a server-side redirect via hooks.Server.ts
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$src/lib/components/Header.svelte';
  import logo from '$src/lib/assets/legacy/images/logo.png';
  import '$lib/assets/legacy/css/main-materialize.css';
  import { Server } from '@sveltejs/kit';

  onMount(async () => {
    let M = await import('materialize-css');
    const { initJs } = await import('$lib/assets/legacy/js/pages-materialize');
    try {
      initJs(M);
    } catch (error) {
      console.log(error);
    }
  });
</script>

<Header />

<div class="simple-page">
  <main>
    <div class="header header-filter" style="background-image: url('/assets/img/files.jpg')"></div>

    <div class="main main-raised">
      <div class="profile-content">
        <div class="row row-alert-fixed-to-top">
          <div class="col s12">
            <div class="alert-fixed-to-top">
              <div class="left">Updated: Jan 17, 2025</div>
              <div class="right">153,236 Profiles</div>
            </div>
          </div>
        </div>
        <div class="container-custom">
          <div class="row">
            <div class="col s12">
              <div id="profile" class="profile center-align">
                <div class="avatar">
                  <img src={logo} alt="Grantmakers.io Logo" class="img-circle img-responsive" />
                </div>
                <div class="name">
                  <h1 class="title">Foundation Profiles</h1>
                  <h6 class="sub-title">Complete Index</h6>
                  <p>Psst. Use the <a href="/search/profiles/">main search feature</a> to find profiles.</p>

                  <div class="row">
                    <div class="col s12 l8 offset-l2">
                      <!-- <ul class="list-unstyled">
                        {#each data as item}
                          <li class="each-index-item">
                            <h6>
                              <span class="hide-on-med-and-down"><small>{item.ein}</small></span>
                              <a href="/profiles/v0/{item.organization_name_slug}/">{item.organization_name_slug}</a>
                            </h6>
                          </li>
                        {/each}
                      </ul> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  .profile-content #profile {
    margin-bottom: 75px;
  }
  .simple-page .profile img {
    width: 100%;
    height: 100%;
    max-width: 160px;
    max-height: 160px;
    margin: -80px auto 0;
  }
</style>
