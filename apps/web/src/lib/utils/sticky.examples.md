# Sticky Action - Usage Examples

The `sticky` action makes elements stick to the top of the viewport when scrolled past their original position.

## Basic Usage

### Full-Width Sticky Nav (Default)

Perfect for top-level search bars and primary navigation:

```svelte
<script>
  import { sticky } from '$lib/utils/sticky';
</script>

<nav use:sticky={{ minWidth: 992, placeholder: true }}>
  <!-- Your navigation content -->
</nav>
```

### Constrained-Width Sticky Element

Perfect for secondary navigation within a content area:

```svelte
<script>
  import { sticky } from '$lib/utils/sticky';
</script>

<div class="container">
  <nav
    use:sticky={{
      fullWidth: false,  // Preserves original width
      placeholder: true,
      minWidth: 768
    }}
  >
    <!-- Secondary nav content -->
  </nav>
</div>
```

## Advanced Examples

### Sticky with Offset (Below Fixed Header)

When you have a fixed header and want the sticky element to appear below it:

```svelte
<script>
  import { sticky } from '$lib/utils/sticky';
</script>

<!-- Fixed header at 64px height -->
<header style="position: fixed; top: 0; height: 64px; z-index: 200;">
  <!-- Header content -->
</header>

<!-- Sticky nav that sticks below the header -->
<nav
  use:sticky={{
    offset: 64,  // Sticks 64px from top
    zIndex: 100,
    placeholder: true
  }}
>
  <!-- Navigation content -->
</nav>
```

### Delayed Activation with Threshold

Delay sticky activation for headers that change layout when sticky:

```svelte
<script>
  import { sticky } from '$lib/utils/sticky';
</script>

<header
  use:sticky={{
    threshold: 50,  // Delay activation by 50px
    placeholder: true,
    minWidth: 768
  }}
  class="group"
>
  <!-- Row 1: Hidden when sticky -->
  <div class="py-6 group-data-[sticky=true]:hidden">
    <!-- Primary navigation -->
  </div>

  <!-- Row 2: Condensed when sticky -->
  <div class="py-6 group-data-[sticky=true]:py-4">
    <!-- Secondary navigation -->
  </div>
</header>
```

### Sticky with Callbacks

Track when elements become sticky/unsticky:

```svelte
<script>
  import { sticky } from '$lib/utils/sticky';

  let isNavSticky = false;

  function handleStick() {
    isNavSticky = true;
    console.log('Nav is now sticky');
  }

  function handleUnstick() {
    isNavSticky = false;
    console.log('Nav is no longer sticky');
  }
</script>

<nav
  class:sticky={isNavSticky}
  use:sticky={{
    placeholder: true,
    onStick: handleStick,
    onUnstick: handleUnstick
  }}
>
  <!-- Navigation content -->
</nav>

<style>
  nav.sticky {
    /* Apply special styles when sticky */
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
</style>
```

### Disable on Mobile

Only enable sticky behavior on larger screens:

```svelte
<script>
  import { sticky } from '$lib/utils/sticky';
</script>

<nav use:sticky={{ minWidth: 992 }}>
  <!-- On screens < 992px, behaves normally -->
  <!-- On screens >= 992px, becomes sticky -->
</nav>
```

### Dynamic Configuration

Update sticky options reactively:

```svelte
<script>
  import { sticky } from '$lib/utils/sticky';

  let stickyEnabled = true;
  let headerHeight = 64;
</script>

<button on:click={() => stickyEnabled = !stickyEnabled}>
  Toggle Sticky
</button>

<nav
  use:sticky={{
    enabled: stickyEnabled,
    offset: headerHeight,
    placeholder: true
  }}
>
  <!-- Navigation content -->
</nav>
```

### Performance Optimization

Adjust debounce delay for resize events:

```svelte
<script>
  import { sticky } from '$lib/utils/sticky';
</script>

<nav
  use:sticky={{
    placeholder: true,
    resizeDebounce: 150  // Wait 150ms after resize stops
  }}
>
  <!-- Navigation content -->
</nav>
```

## Configuration Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable sticky behavior |
| `minWidth` | `number` | `0` | Minimum viewport width (px) for sticky to activate |
| `offset` | `number` | `0` | Distance from top of viewport (px) where element sticks |
| `threshold` | `number` | `0` | Additional scroll distance (px) before sticky activates |
| `placeholder` | `boolean` | `true` | Insert placeholder to prevent layout shift |
| `zIndex` | `number` | `100` | CSS z-index for sticky element |
| `fullWidth` | `boolean` | `true` | Expand to full viewport width when sticky |
| `resizeDebounce` | `number` | `100` | Debounce delay (ms) for resize events |
| `onStick` | `() => void` | `() => {}` | Callback when element becomes sticky |
| `onUnstick` | `() => void` | `() => {}` | Callback when element is no longer sticky |

## Common Patterns

### Search Page Pattern (Current Implementation)

```svelte
<nav
  class="nav-center grey lighten-3 z-depth-1"
  use:sticky={{
    minWidth: 992,
    placeholder: true,
  }}
>
  <!-- Search bar content -->
</nav>
```

### Secondary Navigation Pattern

```svelte
<div class="content-container">
  <nav
    class="secondary-nav"
    use:sticky={{
      fullWidth: false,      // Key difference!
      placeholder: true,
      minWidth: 768,
      offset: 64,            // Below primary nav
      zIndex: 90             // Lower than primary nav
    }}
  >
    <!-- Section navigation -->
  </nav>

  <div class="content">
    <!-- Page content -->
  </div>
</div>
```

### Sidebar Pattern

```svelte
<div class="layout">
  <aside
    use:sticky={{
      fullWidth: false,
      placeholder: true,
      offset: 16,
      minWidth: 1024
    }}
  >
    <!-- Sticky sidebar content -->
  </aside>

  <main>
    <!-- Main content -->
  </main>
</div>
```

## Migration from Materialize Pushpin

If you're migrating from MaterializeCSS Pushpin:

```svelte
<!-- Old Materialize way -->
<div class="pushpin" data-target="...">
  <!-- content -->
</div>

<!-- New Svelte way -->
<script>
  import { sticky } from '$lib/utils/sticky';
</script>

<div use:sticky={{ placeholder: true }}>
  <!-- content -->
</div>
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Gracefully degrades in older browsers (element simply won't stick)
- SSR-compatible (no server-side execution)

## Performance Notes

- Uses passive event listeners for optimal scroll performance
- Debounced resize handler prevents excessive recalculation
- Minimal DOM manipulation (only when sticky state changes)
- No polling or RAF loops
