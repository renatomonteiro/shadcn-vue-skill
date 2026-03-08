# shadcn-vue Setup Guide

## Vite + Vue 3

### 1. Create project

```bash
npm create vite@latest my-app --template vue-ts
cd my-app
npm install
```

### 2. Install Tailwind CSS v4

```bash
npm install -D tailwindcss @tailwindcss/vite @types/node
```

Update `vite.config.ts`:

```ts
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Create/replace `src/assets/index.css`:

```css
@import "tailwindcss";
```

Import it in `src/main.ts`:

```ts
import './assets/index.css'
```

### 3. Configure TypeScript paths

`tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Also add `compilerOptions` to `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 4. Initialize shadcn-vue

```bash
npx shadcn-vue@latest init
```

When prompted: framework → vite, style → default or new-york, base color → your choice, CSS variables → yes.

This creates `components.json` and `src/lib/utils.ts`, and updates your CSS file.

### 5. Add your first component

```bash
npx shadcn-vue@latest add button
```

Verify in any page:

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>
<template>
  <Button>Hello shadcn-vue!</Button>
</template>
```

---

## Nuxt 3

### 1. Create project

```bash
npx nuxi@latest init my-nuxt-app
cd my-nuxt-app
npm install
npm install -D typescript  # if TypeScript errors appear
```

### 2. Install Tailwind CSS

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Create `app/assets/css/tailwind.css`:

```css
@import "tailwindcss";
```

Update `nuxt.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

### 3. Add shadcn-nuxt module

```bash
npx nuxi@latest module add shadcn-nuxt
```

Or manually: `npm install -D shadcn-nuxt` and add to modules in config.

### 4. Configure nuxt.config.ts

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['shadcn-nuxt'],
  shadcn: {
    prefix: '',                      // Optional: 'Ui' → UiButton, UiCard, etc.
    componentDir: './components/ui'
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

### 5. Prepare and initialize

```bash
npx nuxi prepare
npx shadcn-vue@latest init
```

When prompted: framework → nuxt.

### 6. Add components

```bash
npx shadcn-vue@latest add button card dialog
```

> **Important:** In Nuxt, components in `components/ui/` are auto-imported by the Nuxt module. You do NOT need `import { Button } from '@/components/ui/button'` — just use `<Button>` directly in templates.

### Dark mode in Nuxt (recommended approach)

```bash
npx nuxi@latest module add color-mode
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  colorMode: {
    classSuffix: ''  // ensures class="dark" not class="dark-mode"
  }
})
```

```vue
<script setup lang="ts">
const colorMode = useColorMode()
</script>
<template>
  <Button @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'">
    Toggle dark mode
  </Button>
</template>
```

---

## Post-setup: useful CLI commands

```bash
# Add multiple components at once
npx shadcn-vue@latest add button input label form card dialog select tabs

# Add all available components
npx shadcn-vue@latest add --all

# Check for component updates
npx shadcn-vue@latest diff

# See CLI help
npx shadcn-vue@latest --help
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Cannot find module '@/...'` | Verify `tsconfig.json` paths + `vite.config.ts` alias both set to `@/*` → `./src/*` |
| Components look unstyled | Confirm Tailwind CSS is imported in `src/main.ts` / `nuxt.config.ts` `css` array |
| CLI `init` fails | Delete existing `components.json` and retry |
| Nuxt: component not found | Check `shadcn.componentDir` in `nuxt.config.ts` matches where components were added |
| TypeScript path errors | Make sure BOTH `tsconfig.json` and `tsconfig.app.json` have the `paths` config |
| Tailwind v4 dark mode not working | Add `@custom-variant dark (&:where(.dark, .dark *));` to your CSS file |
