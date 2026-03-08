---
name: shadcn-vue
description: >
  Expert guide for building Vue.js UIs with shadcn-vue — a copy-into-your-project component library built on Reka UI primitives and Tailwind CSS. Use this skill whenever the user mentions shadcn-vue, wants to build Vue UI components, set up a design system in Vue, add accessible components to a Vue or Nuxt project, theme a Vue app with CSS variables, or compose complex UI patterns like forms, dialogs, data tables, dashboards, or navigation menus. Also trigger for questions about the shadcn-vue CLI, components.json config, Reka UI, dark mode in Vue, or reviewing/improving existing Vue component code. If someone is building any kind of UI in Vue 3 and wants polished, accessible, customizable components — use this skill even if they don't explicitly mention "shadcn-vue".
---

# shadcn-vue Skill

## What shadcn-vue is (and why it matters)

shadcn-vue is **not a library you install as a dependency** — it's a collection of components you copy directly into your project. This distinction matters when helping users:

- Each component lands in **your** `src/components/ui/` (or `components/ui/` in Nuxt) as plain `.vue` files
- Users own the code completely — no overriding, no vendor lock-in
- Components are built on **Reka UI** headless primitives (handles accessibility) + **Tailwind CSS** (handles styling)
- As of v1 (Feb 2025): migrated from Radix Vue → **Reka UI**
- The CLI downloads component source into your project: `npx shadcn-vue@latest add button`

## Quick navigation

| Task | Reference file |
|------|---------------|
| Set up a new project (Vite or Nuxt 3) | `references/setup.md` |
| Use or generate specific components | `references/components.md` |
| Theming, CSS variables, dark mode | `references/theming.md` |
| Review or improve existing Vue/shadcn-vue code | `references/review.md` |

**Always read the relevant reference file before generating or reviewing code.**

## Core concepts to keep in mind

### The `cn()` utility
Every component uses this helper to merge Tailwind classes safely. It lives in `src/lib/utils.ts` and is added automatically by `npx shadcn-vue@latest init`:

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Always use `cn()` for conditional class logic — never manually concatenate Tailwind strings.

### `components.json`
This config file tells the CLI how your project is structured:

```json
{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "default",
  "typescript": true,
  "tailwind": {
    "css": "src/assets/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "framework": "vite",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

Key options: `style` (`"default"` or `"new-york"`), `tailwind.cssVariables` (always `true` recommended), `framework` (`"vite"` or `"nuxt"`).

### Framework detection
If the user's framework isn't stated, infer from context: `nuxt.config.ts` → Nuxt, `vite.config.ts` without Nuxt → Vite. When ambiguous, ask.

### Full component list
Accordion, Alert, AlertDialog, AspectRatio, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Combobox, Command, ContextMenu, DatePicker, Dialog, Drawer, DropdownMenu, Form, HoverCard, Input, InputOTP, Label, Menubar, NavigationMenu, NumberField, Pagination, PinInput, Popover, Progress, RadioGroup, RangeCalendar, Resizable, ScrollArea, Select, Separator, Sheet, Skeleton, Slider, Sonner, Switch, Table, Tabs, Textarea, Toast, Toggle, ToggleGroup, Tooltip

## Code generation guidelines

When writing code for users:

1. **Show the CLI command** to add required components first
2. **Write complete `.vue` files** — no placeholders like "// add your logic here"
3. **Use `<script setup lang="ts">`** unless the user specifies otherwise
4. **Import from `@/components/ui/`** (or user's configured alias)
5. **Use `cn()` for conditional classes** — never string-concatenate Tailwind
6. **Include TypeScript interfaces** for props and emits
7. For **forms**, always use `Form` + `vee-validate` + `zod` (the standard shadcn-vue pattern)
8. For **data tables**, always use TanStack Table (`@tanstack/vue-table`)
9. For **toasts**, always use Sonner (`vue-sonner`)
10. In **Nuxt**, components in `components/ui/` are auto-imported — skip manual import statements

## Code review guidelines

When reviewing or improving existing shadcn-vue code, read `references/review.md` for a structured checklist. Common issues to watch for:

- Manual Tailwind string concatenation instead of `cn()`
- Missing `v-bind="componentField"` in form fields
- Using deprecated Radix Vue imports instead of Reka UI
- `v-model` used directly on shadcn-vue inputs instead of `componentField` inside `FormField`
- Hard-coded colors instead of CSS variable tokens (`text-blue-500` → `text-primary`)
