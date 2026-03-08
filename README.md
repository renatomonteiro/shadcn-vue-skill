# shadcn-vue Claude Skill

A skill for [Claude Cowork](https://claude.ai) that makes Claude an expert at building Vue.js UIs with [shadcn-vue](https://www.shadcn-vue.com/).

## What this skill does

- **Generate components** — Buttons, Forms, Dialogs, Data Tables, Cards, and more, all following shadcn-vue conventions
- **Scaffold projects** — Step-by-step setup for Vite + Vue 3 and Nuxt 3
- **Theming & dark mode** — CSS variables, OKLCH color tokens, dark mode toggle patterns
- **Review & improve code** — Detects anti-patterns like hard-coded colors, missing `cn()`, wrong `v-model` inside `FormField`

## Contents

```
SKILL.md                    ← Main skill entry point
references/
  setup.md                  ← Vite + Nuxt 3 installation
  components.md             ← Component examples + UI patterns
  theming.md                ← CSS variables, dark mode, custom tokens
  review.md                 ← Code review checklist
```

## Install

Download `shadcn-vue.skill` and click **"Copy to your skills"** in Claude Cowork.

## Benchmark

Tested against 3 real-world tasks:

| Task | With Skill | Without Skill |
|------|-----------|---------------|
| Nuxt 3 project setup | 100% | 100% |
| Registration form (Form + Zod + Card + Spinner) | 100% | 14% |
| Code review (cn(), tokens, componentField) | 100% | 40% |
| **Overall** | **100%** | **51%** |

## Built with

- [shadcn-vue](https://www.shadcn-vue.com/)
- [Claude Cowork](https://claude.ai) skill-creator
