<script lang="ts">
  import { humanizeNumber } from '@repo/shared/functions/formatters/numbers';
  import { datasetStats } from '@repo/shared/constants/trustedConstants';
</script>

<div class="relative z-20 bg-black p-2 text-center text-sm font-light text-white">
  🎉 <span class="font-bold">2025 updates are live!</span> Millions of grants to search from {humanizeNumber(datasetStats?.profiles)} private
  foundations.
</div>

<style>
  .p-2 {
    padding: 8px;
  }
  .bg-black {
    background-color: black;
  }
  .text-white {
    color: white;
  }
  .text-center {
    text-align: center;
  }
  .font-light {
    font-weight: 300;
  }
  .font-bold {
    font-weight: 700;
  }
  .text-sm {
    font-size: 14px;
    line-height: 20px;
  }
</style>
