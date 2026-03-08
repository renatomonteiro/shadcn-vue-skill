# shadcn-vue Code Review Guide

Use this reference when the user asks you to review, fix, or improve existing Vue/shadcn-vue code.

## Review checklist

Work through these categories systematically:

### 1. Imports and dependencies

- [ ] Components imported from `@/components/ui/` (not from `node_modules/shadcn-vue` — it doesn't exist as an npm package)
- [ ] Using **Reka UI** primitives, not Radix Vue (`reka-ui` not `radix-vue`) — if you see `from 'radix-vue'` it's outdated (pre-v1)
- [ ] `cn` imported from `@/lib/utils`, not redefined inline
- [ ] Icons imported from `lucide-vue-next`, not `@heroicons/vue` or bare `lucide`
- [ ] In Nuxt: no manual component imports needed for `components/ui/` files — they're auto-imported

### 2. Tailwind class handling

- [ ] Conditional classes use `cn(...)` — not template literals \`\`class-a ${condition ? 'class-b' : ''}\`\`
- [ ] No hard-coded color values like `text-blue-500`, `bg-gray-100` where semantic tokens exist (`text-primary`, `bg-muted`)
- [ ] Custom classes appended via `cn(existingClasses, props.class)` — not replacing the whole class string
- [ ] `class` (not `className`) in Vue templates

### 3. Form patterns

- [ ] `FormField` slot uses `v-slot="{ componentField }"` for Reka UI components, `v-slot="{ field }"` for native elements
- [ ] Inputs inside `FormField` use `v-bind="componentField"` — **not** a separate `v-model`
- [ ] `FormControl` wraps each input (required for proper ARIA attributes)
- [ ] `FormMessage` present to display validation errors
- [ ] Schema defined with `toTypedSchema(z.object(...))` — not raw zod schema
- [ ] `form.handleSubmit(...)` used for submission — not a manual `@submit.prevent`

### 4. Component usage

- [ ] `DialogTrigger as-child` used when wrapping a Button (avoids nested button elements)
- [ ] `v-model:open` used for programmatic dialog/sheet/popover control
- [ ] Toasts use `vue-sonner`'s `toast()` — not old `useToast()` composable (unless project uses the older Toast component)
- [ ] `<Toaster />` present in root layout exactly once
- [ ] Switch and Checkbox use `v-model:checked` (not `v-model`)
- [ ] Select uses `v-model` on `<Select>`, not on `<SelectTrigger>`

### 5. TypeScript

- [ ] Props defined with `defineProps<{ ... }>()` (not `defineProps({ ... })`)
- [ ] Emits typed with `defineEmits<{ eventName: [args] }>()`
- [ ] Generic components use `<script setup lang="ts" generic="TData">` syntax
- [ ] No `any` types where proper inference is possible

### 6. Vue 3 patterns

- [ ] `<script setup lang="ts">` used (not Options API unless legacy codebase)
- [ ] `ref()` for primitives, `reactive()` for objects (don't mix carelessly)
- [ ] `computed()` for derived values — not recalculating in templates
- [ ] `watch` with `{ immediate: true }` where needed (e.g., persisting dark mode)
- [ ] `defineExpose` used when parent needs to call child methods

### 7. Accessibility

- [ ] `Label` components use `for` prop matching input `id` (not just visually positioned)
- [ ] Destructive actions use `AlertDialog` — not a plain `Dialog` or `confirm()`
- [ ] Icon-only buttons have `aria-label` or `sr-only` text
- [ ] `Button size="icon"` used for icon buttons (not `size="sm"` with no padding)

## Common bugs to fix

**1. Wrong form field binding**
```vue
<!-- ❌ Wrong — v-model won't integrate with vee-validate properly -->
<FormField v-slot="{ componentField }" name="email">
  <Input v-model="email" />
</FormField>

<!-- ✅ Correct -->
<FormField v-slot="{ componentField }" name="email">
  <Input v-bind="componentField" />
</FormField>
```

**2. String concatenation instead of cn()**
```vue
<!-- ❌ Wrong — breaks Tailwind merging -->
<Button :class="`${props.class} bg-primary`">

<!-- ✅ Correct -->
<Button :class="cn('bg-primary', props.class)">
```

**3. Hard-coded colors instead of tokens**
```vue
<!-- ❌ Wrong — breaks dark mode -->
<p class="text-gray-500">Helper text</p>

<!-- ✅ Correct -->
<p class="text-muted-foreground">Helper text</p>
```

**4. Nested button elements**
```vue
<!-- ❌ Wrong — <button> inside <button> is invalid HTML -->
<DialogTrigger>
  <Button>Open</Button>
</DialogTrigger>

<!-- ✅ Correct -->
<DialogTrigger as-child>
  <Button>Open</Button>
</DialogTrigger>
```

**5. Radix Vue imports (outdated)**
```ts
// ❌ Wrong — pre-v1 shadcn-vue used radix-vue
import { DialogRoot } from 'radix-vue'

// ✅ Correct — use shadcn-vue's component wrappers
import { Dialog } from '@/components/ui/dialog'
```

## Improvement suggestions to offer

When reviewing code, also look for these enhancement opportunities:

- **Loading states:** Add `ref(false)` + `:disabled="loading"` + spinner to submit buttons
- **Error handling:** Wrap async form submissions in try/catch with `toast.error()`
- **Empty states:** Data tables should show a friendly empty state row
- **Responsive design:** Check if Card/Dialog widths use `sm:` breakpoints
- **Form UX:** `FormDescription` provides helpful context; suggest adding it where fields are unclear
- **Dark mode:** If not present and app has theme toggle, suggest adding `@custom-variant dark` CSS
