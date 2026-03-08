# shadcn-vue Theming Guide

## How theming works

shadcn-vue uses **CSS custom properties (variables)** scoped under `:root` and `.dark`. Tailwind reads these via `@theme inline`. This means the entire look of an app can be changed by updating a few values in CSS — no Tailwind config recompile needed.

## CSS variable convention

Variables follow a `background` / `foreground` pairing:
- `--primary` → background color for primary elements
- `--primary-foreground` → text placed on top of primary background

Values use **OKLCH format** (v1+) or **HSL without the wrapper** (legacy). Use OKLCH for new projects.

## Default CSS variables (add to your main CSS file)

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --radius: 0.625rem;
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
  }

  .dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.556 0 0);
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
  }
}
```

## Using theme variables in Tailwind

Apply them with semantic utility classes:

```html
<div class="bg-background text-foreground">
  <button class="bg-primary text-primary-foreground">Click me</button>
  <p class="text-muted-foreground">Helper text</p>
</div>
```

**Never** hard-code colors like `bg-blue-500` when a semantic token exists. This ensures dark mode works automatically.

## Customizing the primary brand color

To use a custom brand color (e.g., a blue `#3b82f6`), convert to OKLCH and update:

```css
:root {
  --primary: oklch(0.623 0.214 259.815);  /* blue-500 equivalent */
  --primary-foreground: oklch(0.985 0 0);  /* white text */
}
```

Use an online converter like [oklch.com](https://oklch.com) or [oklch.evilmartians.io](https://oklch.evilmartians.io) to find OKLCH values.

## Border radius

```css
:root {
  --radius: 0.625rem;   /* default — slightly rounded */
  /* --radius: 0rem;    → sharp corners */
  /* --radius: 1rem;    → very rounded */
}
```

Components use `--radius` with calc offsets: `rounded-[calc(var(--radius)-2px)]`, `rounded-[calc(var(--radius)+2px)]`, etc.

## Dark mode

### Option 1: Class-based toggle (Vite — recommended)

```ts
// src/composables/useTheme.ts
import { ref, watch } from 'vue'

const isDark = ref(localStorage.getItem('theme') === 'dark')

watch(isDark, (val) => {
  document.documentElement.classList.toggle('dark', val)
  localStorage.setItem('theme', val ? 'dark' : 'light')
}, { immediate: true })

export function useTheme() {
  return { isDark, toggle: () => { isDark.value = !isDark.value } }
}
```

For Tailwind v4, add to your CSS:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Dark mode toggle button:

```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-vue-next'

const { isDark, toggle } = useTheme()
</script>

<template>
  <Button variant="ghost" size="icon" @click="toggle">
    <Sun v-if="isDark" class="h-5 w-5" />
    <Moon v-else class="h-5 w-5" />
  </Button>
</template>
```

### Option 2: System preference (Vite)

```ts
// src/main.ts (or App.vue setup)
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
document.documentElement.classList.toggle('dark', prefersDark)
```

### Option 3: @nuxtjs/color-mode (Nuxt — recommended)

```bash
npx nuxi@latest module add color-mode
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  colorMode: { classSuffix: '' }
})
```

```vue
<script setup lang="ts">
const colorMode = useColorMode()
const toggle = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
```

## Adding custom CSS variables

To add a new semantic token (e.g., for a branded sidebar):

```css
/* In your main CSS file */
:root {
  --sidebar: oklch(0.21 0.006 285.885);
  --sidebar-foreground: oklch(0.985 0 0);
}
.dark {
  --sidebar: oklch(0.21 0.006 285.885);
  --sidebar-foreground: oklch(0.985 0 0);
}

/* Register with Tailwind v4 */
@theme inline {
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
}
```

Now use: `bg-sidebar text-sidebar-foreground`

## Variable reference

| Variable | Used for |
|----------|---------|
| `--background` | Page background |
| `--foreground` | Default text |
| `--primary` | Primary buttons, active/selected states |
| `--primary-foreground` | Text on primary backgrounds |
| `--secondary` | Secondary buttons, subtle backgrounds |
| `--secondary-foreground` | Text on secondary |
| `--muted` | Muted/disabled backgrounds |
| `--muted-foreground` | Placeholder text, captions, secondary labels |
| `--accent` | Hover states, focus highlights |
| `--destructive` | Delete, danger, error states |
| `--border` | Borders and dividers |
| `--input` | Input field border color |
| `--ring` | Focus rings (accessibility) |
| `--radius` | Global border radius |
| `--chart-1` through `--chart-5` | Chart / data viz colors |

## Theme generator tools

- [shadcn-theme.com](https://shadcn-theme.com) — visual theme builder with live preview
- [ui.jln.dev](https://ui.jln.dev) — 10,000+ themes with live preview
- [oklch.com](https://oklch.com) — OKLCH color picker and converter
