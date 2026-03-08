# shadcn-vue Component Reference

## Table of Contents
1. [Button](#button)
2. [Input, Label, Textarea](#input-label-textarea)
3. [Form with vee-validate + Zod](#form-with-vee-validate--zod)
4. [Dialog](#dialog)
5. [AlertDialog (confirmation)](#alertdialog)
6. [Card](#card)
7. [Select](#select)
8. [Checkbox & Switch](#checkbox--switch)
9. [Tabs](#tabs)
10. [Toast / Sonner](#toast--sonner)
11. [Data Table (TanStack)](#data-table)
12. [UI Patterns](#ui-patterns)

---

## Button

```bash
npx shadcn-vue@latest add button
```

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'
import { ref } from 'vue'
const loading = ref(false)
</script>
<template>
  <div class="flex flex-wrap gap-2">
    <Button>Default</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="destructive">Delete</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
    <Button size="sm">Small</Button>
    <Button size="lg">Large</Button>
    <Button size="icon"><Loader2 class="h-4 w-4" /></Button>
    <Button :disabled="loading" @click="loading = true">
      <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
      {{ loading ? 'Loading...' : 'Submit' }}
    </Button>
  </div>
</template>
```

**Variants:** `default` | `secondary` | `destructive` | `outline` | `ghost` | `link`
**Sizes:** `default` | `sm` | `lg` | `icon`

---

## Input, Label, Textarea

```bash
npx shadcn-vue@latest add input label textarea
```

```vue
<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ref } from 'vue'
const email = ref('')
const bio = ref('')
</script>
<template>
  <div class="grid gap-4 max-w-sm">
    <div class="grid gap-1.5">
      <Label for="email">Email</Label>
      <Input id="email" v-model="email" type="email" placeholder="you@example.com" />
    </div>
    <div class="grid gap-1.5">
      <Label for="bio">Bio</Label>
      <Textarea id="bio" v-model="bio" placeholder="Tell us about yourself" rows="4" />
    </div>
  </div>
</template>
```

---

## Form with vee-validate + Zod

shadcn-vue's Form integrates with **vee-validate** and **zod** for type-safe, accessible validation.

```bash
npx shadcn-vue@latest add form input label button
npm install vee-validate zod @vee-validate/zod
```

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'

const formSchema = toTypedSchema(z.object({
  username: z.string().min(2, 'Username must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
}))

const form = useForm({ validationSchema: formSchema })
const onSubmit = form.handleSubmit(async (values) => {
  console.log(values)
  toast.success('Account created!')
})
</script>
<template>
  <form @submit="onSubmit" class="space-y-6 max-w-sm">
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl><Input placeholder="johndoe" v-bind="componentField" /></FormControl>
        <FormDescription>Your public display name.</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl><Input type="email" placeholder="you@example.com" v-bind="componentField" /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl><Input type="password" v-bind="componentField" /></FormControl>
        <FormDescription>At least 8 characters.</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit" class="w-full">Create account</Button>
  </form>
</template>
```

**Key pattern:** `v-bind="componentField"` inside `FormField`'s slot connects the input to vee-validate. Don't use `v-model` directly.

---

## Dialog

```bash
npx shadcn-vue@latest add dialog button input label
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
const open = ref(false)
</script>
<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">Edit Profile</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>Make changes to your profile. Click save when done.</DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" placeholder="Your name" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="open = false">Cancel</Button>
        <Button @click="open = false">Save changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

Use `v-model:open` for programmatic control. Use `as-child` on `DialogTrigger` to avoid extra DOM wrapper.

---

## AlertDialog

For destructive confirmation dialogs:

```bash
npx shadcn-vue@latest add alert-dialog button
```

```vue
<script setup lang="ts">
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
const emit = defineEmits<{ confirm: [] }>()
</script>
<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button variant="destructive">Delete account</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction @click="emit('confirm')">Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
```

---

## Card

```bash
npx shadcn-vue@latest add card
```

```vue
<script setup lang="ts">
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
</script>
<template>
  <Card class="w-[350px]">
    <CardHeader>
      <CardTitle>Create project</CardTitle>
      <CardDescription>Deploy your new project in one click.</CardDescription>
    </CardHeader>
    <CardContent><!-- form or content here --></CardContent>
    <CardFooter class="flex justify-between">
      <Button variant="outline">Cancel</Button>
      <Button>Deploy</Button>
    </CardFooter>
  </Card>
</template>
```

---

## Select

```bash
npx shadcn-vue@latest add select
```

```vue
<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ref } from 'vue'
const selected = ref('')
</script>
<template>
  <Select v-model="selected">
    <SelectTrigger class="w-[200px]">
      <SelectValue placeholder="Select a framework" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Frameworks</SelectLabel>
        <SelectItem value="nuxt">Nuxt 3</SelectItem>
        <SelectItem value="vite">Vite + Vue</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
```

---

## Checkbox & Switch

```bash
npx shadcn-vue@latest add checkbox switch label
```

```vue
<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ref } from 'vue'
const agreedToTerms = ref(false)
const notifications = ref(true)
</script>
<template>
  <div class="space-y-4">
    <div class="flex items-center space-x-2">
      <Checkbox id="terms" v-model:checked="agreedToTerms" />
      <Label for="terms">Accept terms and conditions</Label>
    </div>
    <div class="flex items-center space-x-2">
      <Switch id="notifications" v-model:checked="notifications" />
      <Label for="notifications">Enable email notifications</Label>
    </div>
  </div>
</template>
```

---

## Tabs

```bash
npx shadcn-vue@latest add tabs
```

```vue
<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
</script>
<template>
  <Tabs default-value="account" class="w-full max-w-md">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account" class="mt-4">
      <p class="text-sm text-muted-foreground">Manage your account settings here.</p>
    </TabsContent>
    <TabsContent value="password" class="mt-4">
      <p class="text-sm text-muted-foreground">Change your password here.</p>
    </TabsContent>
  </Tabs>
</template>
```

---

## Toast / Sonner

shadcn-vue uses **Sonner** for toasts.

```bash
npx shadcn-vue@latest add sonner
```

Add `<Toaster />` once to your root layout (`App.vue` or Nuxt's `app.vue`):

```vue
<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
</script>
<template>
  <RouterView />
  <Toaster />
</template>
```

Use anywhere:

```vue
<script setup lang="ts">
import { toast } from 'vue-sonner'
const handleSave = async () => {
  try {
    toast.success('Saved successfully!')
  } catch {
    toast.error('Something went wrong.')
  }
}
</script>
```

**Toast variants:** `toast()`, `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`, `toast.promise()`

---

## Data Table

Data tables use **TanStack Table** (`@tanstack/vue-table`).

```bash
npx shadcn-vue@latest add table
npm install @tanstack/vue-table
```

```ts
// columns.ts
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-vue-next'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) =>
      h(Button, { variant: 'ghost', onClick: () => column.toggleSorting(column.getIsSorted() === 'asc') },
        () => ['Name', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]),
  },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role', cell: ({ row }) => h('span', { class: 'capitalize' }, row.getValue('role')) },
]
```

```vue
<!-- DataTable.vue -->
<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, useVueTable, type SortingState } from '@tanstack/vue-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ref } from 'vue'

const props = defineProps<{ columns: ColumnDef<TData, TValue>[]; data: TData[] }>()
const sorting = ref<SortingState>([])
const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: u => { sorting.value = typeof u === 'function' ? u(sorting.value) : u },
  state: { get sorting() { return sorting.value } },
})
</script>
<template>
  <div class="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow v-for="hg in table.getHeaderGroups()" :key="hg.id">
          <TableHead v-for="h in hg.headers" :key="h.id">
            <FlexRender v-if="!h.isPlaceholder" :render="h.column.columnDef.header" :props="h.getContext()" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <TableRow v-else>
          <TableCell :colspan="columns.length" class="h-24 text-center text-muted-foreground">No results found.</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
```

---

## UI Patterns

### Login / Sign-in card

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { ref } from 'vue'

const schema = toTypedSchema(z.object({ email: z.string().email(), password: z.string().min(8) }))
const form = useForm({ validationSchema: schema })
const loading = ref(false)
const onSubmit = form.handleSubmit(async () => {
  loading.value = true
  try { toast.success('Welcome back!') }
  catch { toast.error('Invalid email or password.') }
  finally { loading.value = false }
})
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <Card class="w-full max-w-sm">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl">Sign in</CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="you@example.com" v-bind="componentField" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input type="password" placeholder="••••••••" v-bind="componentField" /></FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" class="w-full" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
```

### Stats cards (dashboard overview)

```vue
<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-vue-next'

const stats = [
  { title: 'Total Revenue', value: '$45,231', change: '+20.1%', icon: DollarSign },
  { title: 'Active Users', value: '2,350', change: '+15.3%', icon: Users },
  { title: 'Orders', value: '1,247', change: '+8.2%', icon: ShoppingCart },
  { title: 'Growth', value: '+12.5%', change: '+4.6%', icon: TrendingUp },
]
</script>
<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <Card v-for="stat in stats" :key="stat.title">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">{{ stat.title }}</CardTitle>
        <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stat.value }}</div>
        <p class="text-xs text-muted-foreground">{{ stat.change }} from last month</p>
      </CardContent>
    </Card>
  </div>
</template>
```
