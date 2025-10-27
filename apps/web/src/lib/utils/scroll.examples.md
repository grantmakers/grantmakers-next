# Scroll Utilities - Usage Examples

Simple scroll utility functions for smooth scrolling behavior.

## Basic Usage

### Scroll to Top

Smoothly scrolls the window to the top of the page:

```svelte
<script>
  import { backToTop } from '$lib/utils/scroll';
</script>

<button onclick={() => backToTop()}>Back to Top</button>
```

### Scroll to Element (CSS Selector)

Scroll to an element using a CSS selector:

```svelte
<script>
  import { scrollToElement } from '$lib/utils/scroll';
</script>

<button onclick={() => scrollToElement('#my-section')}>
  Go to Section
</button>

<section id="my-section">
  <!-- Section content -->
</section>
```

### Scroll to Element (Element Reference)

Scroll to an element using a direct reference:

```svelte
<script>
  import { scrollToElement } from '$lib/utils/scroll';

  let sectionRef;
</script>

<button onclick={() => scrollToElement(sectionRef)}>
  Go to Section
</button>

<div bind:this={sectionRef}>
  <!-- Section content -->
</div>
```

## Advanced Examples

### Back to Top with Visibility Control

Show the button only when scrolled down:

```svelte
<script>
  import { backToTop } from '$lib/utils/scroll';
  import { onMount } from 'svelte';

  let showButton = false;

  onMount(() => {
    const handleScroll = () => {
      showButton = window.scrollY > 300;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

{#if showButton}
  <button class="back-to-top" onclick={() => backToTop()}>
    ↑ Top
  </button>
{/if}

<style>
  .back-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
  }
</style>
```

### Navigation Menu with Scroll

Create a navigation menu that scrolls to different sections:

```svelte
<script>
  import { scrollToElement } from '$lib/utils/scroll';

  const sections = [
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' }
  ];
</script>

<nav>
  {#each sections as section}
    <a href="#{section.id}" onclick={(e) => {
      e.preventDefault();
      scrollToElement(`#${section.id}`);
    }}>
      {section.label}
    </a>
  {/each}
</nav>

<section id="about">About content</section>
<section id="services">Services content</section>
<section id="contact">Contact content</section>
```

### Error Handling

The `scrollToElement` function will log a warning if the element is not found:

```svelte
<script>
  import { scrollToElement } from '$lib/utils/scroll';

  function handleNavigation(targetId) {
    // If #invalid-id doesn't exist, a warning will be logged
    // and the page won't scroll
    scrollToElement(`#${targetId}`);
  }
</script>

<button onclick={() => handleNavigation('invalid-id')}>
  Try Invalid Scroll
</button>
```

### Dynamic Target Selection

Scroll to elements based on user interaction:

```svelte
<script>
  import { scrollToElement } from '$lib/utils/scroll';

  let selectedSection = 'section1';
  const sections = ['section1', 'section2', 'section3'];
</script>

<div>
  <select bind:value={selectedSection}>
    {#each sections as section}
      <option value={section}>{section}</option>
    {/each}
  </select>

  <button onclick={() => scrollToElement(`#${selectedSection}`)}>
    Go to Selected Section
  </button>
</div>

{#each sections as section}
  <section id={section}>
    <h2>{section}</h2>
    <p>Content for {section}</p>
  </section>
{/each}
```

### Combining with Sticky Navigation

Use with the sticky action for a complete navigation experience:

```svelte
<script>
  import { scrollToElement, backToTop } from '$lib/utils/scroll';
  import { sticky } from '$lib/utils/sticky';
</script>

<nav use:sticky={{ minWidth: 768, placeholder: true }}>
  <button onclick={() => backToTop()}>Home</button>
  <button onclick={() => scrollToElement('#features')}>Features</button>
  <button onclick={() => scrollToElement('#pricing')}>Pricing</button>
</nav>

<section id="features">Features content</section>
<section id="pricing">Pricing content</section>
```

## Common Patterns

### Back to Top Button (Current Implementation)

```svelte
<script>
  import { backToTop } from '$lib/utils/scroll';
</script>

<button
  class="btn-floating btn-large waves-effect waves-light"
  onclick={() => backToTop()}
  aria-label="Back to top"
>
  <i class="material-icons">keyboard_arrow_up</i>
</button>
```

### Skip to Content Link

For accessibility, allow users to skip navigation:

```svelte
<script>
  import { scrollToElement } from '$lib/utils/scroll';
</script>

<a
  href="#main-content"
  class="skip-link"
  onclick={(e) => {
    e.preventDefault();
    scrollToElement('#main-content');
  }}
>
  Skip to main content
</a>

<nav>
  <!-- Navigation -->
</nav>

<main id="main-content">
  <!-- Main content -->
</main>

<style>
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px;
    z-index: 1000;
  }

  .skip-link:focus {
    top: 0;
  }
</style>
```

### Single-Page Application Navigation

Handle routing with scroll behavior:

```svelte
<script>
  import { scrollToElement } from '$lib/utils/scroll';
  import { afterNavigate } from '$app/navigation';

  afterNavigate((navigation) => {
    const hash = navigation.to?.url.hash;
    if (hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        scrollToElement(hash);
      }, 100);
    }
  });
</script>
```

## Function Reference

### `backToTop()`

Smoothly scrolls the window to the top of the page.

**Parameters:** None

**Returns:** `void`

**Scroll Behavior:**
- Smooth animated scroll
- Scrolls to `y = 0` position

### `scrollToElement(target)`

Smoothly scrolls to an element on the page.

**Parameters:**
- `target: HTMLElement | string` - Either an HTMLElement or a CSS selector string

**Returns:** `void`

**Scroll Behavior:**
- Smooth animated scroll
- Aligns element to the start (top) of the viewport
- Logs warning to console if element is not found

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses `ScrollToOptions` with `behavior: 'smooth'`
- Browsers without smooth scroll support will scroll instantly
- SSR-compatible (safe to use in Svelte components)

## Performance Notes

- Native browser smooth scrolling (`scrollTo`, `scrollIntoView`)
- No JavaScript animation loops required
- Minimal performance impact
- Works with browser's built-in scroll optimization
