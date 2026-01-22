// @ts-nocheck
// Legacy JS ported from the previous version of Grantmakers.io.
// Added to suppress type checking errors while maintaining original functionality.

// Move Materialize Plugin instantiation outisde init function, so it can be cleaned up via the destroy function
let instances = {
  dropdown: null,
  sidenavs: [],
  scrollSpies: [],
  tooltips: [],
};
export async function initProfileJs(M, orgFinancialStats) {
  // BROWSER CHECKS
  // =======================================================
  const isMobile = window.matchMedia('only screen and (max-width: 992px)');

  // NAVBAR
  // =======================================================
  const header = document.querySelector('.header');
  const navbar = document.querySelector('.navbar-profile');
  const navbarHeight = 64;

  // Set header opacity on page load
  //setHeaderOpacity();

  // Adjust opacity after scrolling
  window.addEventListener('scroll', function () {
    //setHeaderOpacity();
  });

  function setHeaderOpacity() {
    let scrollTop = window.pageYOffset | document.body.scrollTop;
    let height = header.offsetHeight;
    let offset = height / 2;
    let calc = 1 - (scrollTop - offset + navbarHeight) / navbarHeight;
    header.style.opacity = calc;

    if (calc > 1) {
      header.style.opacity = '1';
      navbar.classList.add('affix-top');
      navbar.classList.remove('affix');
    } else if (calc < 0) {
      header.style.opacity = '0';
      navbar.classList.add('affix');
      navbar.classList.remove('affix-top');
    }
  }

  // INIT MATERIALIZE COMPONENTS
  // =======================================================

  const elemsSideNav = document.querySelectorAll('.sidenav');
  if (elemsSideNav.length > 0) {
    instances.sidenavs = M.Sidenav.init(elemsSideNav);
  } else {
    instances.sidenavs = [];
  }

  // const elemsNavScrollspy = document.querySelectorAll('.scrollspy');
  // const optionsNavScrollspy = { scrollOffset: navbarHeight };
  // instances.scrollspy = M.ScrollSpy.init(elemsNavScrollspy, optionsNavScrollspy);

  // :not ensures Vue handles relevant initiation for Vue-controlled elements
  const elemsTooltips = document.querySelectorAll('.tooltipped:not(.v-tooltipped)');
  instances.tooltips = M.Tooltip.init(elemsTooltips);

  // CHART.JS
  // =======================================================
  // Lazy load via Intersection Observer if browser allows
  // Jekyll sets a global variable orgFinancialsStats in profile.html
  const orgCurrentTaxYear = document.querySelector('h1.org-name').dataset.taxYear;
  const chartWrapperOverview = document.getElementById('financial-overview').getElementsByClassName('chart-wrapper')[0];
  const chartWrapperTrends = document.getElementById('financial-trends').getElementsByClassName('chart-wrapper')[0];

  if (!isMobile.matches && 'IntersectionObserver' in window) {
    gaChartsEvents('Charts baseline');
    createChartsObserver();
  }

  function createChartsObserver() {
    let observer;
    let anchor = document.getElementById('financial-overview');
    let config = {
      rootMargin: '0px 0px',
      threshold: 0.01,
    };
    // Initiate observer using Financial Overview section as anchor
    observer = new IntersectionObserver(enableCharts, config);
    observer.observe(anchor);
    // Initiate preloaders / spinners
    // Only need to show Trends chart if more than one tax year is available
    showLoader(chartWrapperOverview);
    if (orgFinancialStats.length > 1) {
      showLoader(chartWrapperTrends);
    }
  }

  function enableCharts(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        gaChartsEvents('Visitor reached financial divs');
        // Run the function that fetches Chart.js and loads it into the DOM
        loadCharts();
        observer.unobserve(entry.target);
      }
    });
  }

  async function loadCharts() {
    gaChartsEvents('Loading ChartJS');
    const chartJS = document.createElement('script');
    chartJS.type = 'text/javascript';
    chartJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js';
    chartJS.onerror = () => {
      hideLoader(chartWrapperOverview);
      hideLoader(chartWrapperTrends);
      gaChartsEvents('ChartJS failed to load');
    };
    // Make Chart.js script available on client
    document.body.appendChild(chartJS);
    // Now that Chart.js script is available, create the charts
    await createCharts(chartJS);
  }

  function createCharts(init) {
    const chartsColorPrimary = '#607d8b';
    const chartsColorSecondary = '#c54e00';
    const chartsColorTertiary = '#00bfa5';

    const assets = orgFinancialStats.map((value) => value.assets).reverse();
    const distributions = orgFinancialStats.map((value) => value.distributions).reverse();
    const contributions = orgFinancialStats.map((value) => value.contributions).reverse();
    // Use Set to remove duplicates, e.g. from an amended return
    const years = [...new Set(orgFinancialStats.map((value) => value.tax_year))].reverse();
    const year1 = orgFinancialStats[0];

    const ctx = document.getElementById('chart-overview').getContext('2d');
    const ctxTrends = document.getElementById('chart-trends').getContext('2d');

    init.onload = function () {
      /* global Chart */
      gaChartsEvents('ChartsJS successfully loaded');
      let hideLoaderOverviewExecuted = false;
      new Chart(ctx, {
        type: 'horizontalBar',
        responsive: true,
        data: {
          labels: ['Assets EOY', 'Distributions', 'Contributions'],
          datasets: [
            {
              data: [year1.assets, year1.distributions, year1.contributions],
              backgroundColor: [chartsColorPrimary, chartsColorSecondary, chartsColorTertiary],
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: `Latest Electronic Tax Filing (${orgCurrentTaxYear})`,
          },
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: function (value) {
                    return `$${numberHuman(value, 0)}`;
                  },
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  display: false,
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem) {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                }).format(tooltipItem.value);
              },
            },
          },
          animation: {
            onProgress: function (animation) {
              if (animation.numSteps > 0 && !hideLoaderOverviewExecuted) {
                hideLoaderOverviewExecuted = true;
                hideLoader(chartWrapperOverview);
              }
            },
            onComplete: function () {
              gaChartsEvents('Charts successfully drawn');
            },
          },
        },
      });
      // Only need to show Trends chart if more than one tax year is available
      if (orgFinancialStats.length > 1) {
        let hideLoaderTrendsExecuted = false;
        new Chart(ctxTrends, {
          type: 'bar',
          responsive: true,
          data: {
            labels: years,
            datasets: [
              {
                label: 'Assets EOY',
                borderColor: chartsColorPrimary,
                data: assets,
                type: 'line',
                fill: false,
              },
              {
                label: 'Distributions',
                backgroundColor: chartsColorSecondary,
                data: distributions,
              },
              {
                label: 'Contributions',
                backgroundColor: chartsColorTertiary,
                data: contributions,
              },
            ],
          },
          options: {
            title: {
              display: true,
              text: 'All Available Electronic Tax Returns',
            },
            legend: {
              display: true,
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    callback: function (value) {
                      return `$${numberHuman(value, 0)}`;
                    },
                  },
                },
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false,
                  },
                },
              ],
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem) {
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                  }).format(tooltipItem.value);
                },
              },
            },
            animation: {
              onProgress: function (animation) {
                if (animation.numSteps > 0 && !hideLoaderTrendsExecuted) {
                  hideLoaderTrendsExecuted = true;
                  hideLoader(chartWrapperTrends);
                }
              },
            },
          },
        });
      }
    };
  }

  function showLoader(el) {
    el.classList.remove('default');
    el.classList.add('loading');
  }

  function hideLoader(el) {
    el.classList.remove('loading');
    el.classList.add('loaded');
  }

  function numberHuman(num, decimals) {
    if (num === null) {
      return null;
    } // terminate early
    if (num === 0) {
      return '0';
    } // terminate early
    if (isNaN(num)) {
      return num;
    } // terminate early if already a string - handles edge case likely caused by caching
    const fixed = !decimals || decimals < 0 ? 0 : decimals; // number of decimal places to show
    const b = num.toPrecision(2).split('e'); // get power
    const k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3); // floor at decimals, ceiling at trillions
    const c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed); // divide by power
    const d = c < 0 ? c : Math.abs(c); // enforce -0 is 0
    const e = d + ['', 'K', 'M', 'B', 'T'][k]; // append power
    return e;
  }

  function gaChartsEvents(label) {
    if (typeof gtag === 'function') {
      // eslint-disable-next-line no-undef
      gtag('event', 'profile_events', {
        event_category: 'Profile Events',
        event_action: 'Charts Loading Sequence',
        event_label: label,
      });
    }
  }
}

export function destroyProfileJs() {
  try {
    if (instances.dropdown) {
      instances.dropdown.destroy();
    }
    if (instances.sidenavs && instances.sidenavs.length > 0) {
      instances.sidenavs.forEach((instance) => {
        if (instance) {
          try {
            instance.destroy();
          } catch (error) {
            console.debug('Sidenav cleanup:', error.message);
          }
        }
      });
    }

    if (instances.scrollSpies) {
      instances.scrollSpies.forEach((instance) => {
        if (instance) instance.destroy();
      });
    }

    if (instances.tooltips) {
      instances.tooltips.forEach((instance) => {
        if (instance) instance.destroy();
      });
    }

    // Reset instances
    instances = {
      dropdown: null,
      sidenavs: [],
      scrollSpies: [],
      tooltips: [],
    };
  } catch (error) {
    console.warn('Leaving Profile - failed to destroy profiles.js items');
  }
}
