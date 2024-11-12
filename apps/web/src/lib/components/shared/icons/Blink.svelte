<script lang="ts">
  interface Props {
    classes?: string;
  }

  let { classes = 'w-6 h-6' }: Props = $props();

  const fillColorClass = 'text-grantmakers-green';
</script>

<div class="relative {classes}">
  <svg viewBox="6 0 84 96" class="h-full w-full {fillColorClass}" xmlns="http://www.w3.org/2000/svg">
    <!-- Hexagon -->
    <path d="M48 0 L90 24 L90 72 L48 96 L6 72 L6 24 Z" fill="currentColor" />

    <!-- Left eye - moved further left -->
    <g transform="translate(18,32) scale(0.9)">
      <ellipse cx="15" cy="15" rx="12" ry="12" fill="white" class="eye" />
      <circle cx="15" cy="15" r="6" fill="black" />
      <circle cx="13" cy="13" r="2" fill="white" />
    </g>

    <!-- Right eye - moved further right -->
    <g transform="translate(51,32) scale(0.9)">
      <ellipse cx="15" cy="15" rx="12" ry="12" fill="white" class="eye" />
      <circle cx="15" cy="15" r="6" fill="black" />
      <circle cx="13" cy="13" r="2" fill="white" />
    </g>
  </svg>
</div>

<style>
  :global(.eye) {
    animation: blink 3s;
    animation-iteration-count: 5;
  }

  @keyframes blink {
    0%,
    90%,
    100% {
      ry: 12;
    }
    92%,
    98% {
      ry: 1;
    }
  }
</style>
