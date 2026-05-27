Use `bun` instead of `node` and `npm` in the terminal. Use `bunx` instead of
`npx`.

---

When writing code, use single-line comments as lightweight section dividers to
group related logic by responsibility. Keep them short and descriptive — no full
sentences, no punctuation.

Example:

```typescript
// Types
type FormValues = {
  name: string
  description: string
}

// Router
const router = useRouter()

// Form
const { control, handleSubmit } = useForm<FormValues>({
  defaultValues: {
    name: "",
    description: "",
  },
})

const onSubmit = handleSubmit((data) => {
  console.log(data)
})
```

Follow this pattern consistently across components, hooks, and utility files.

---

Avoid inline types and interfaces. Instead, define them at the top of the file
under a `// Types` comment. If a type already exists in
`shared/typescript/src/api/client`, import and use it instead of redefining it.

---

## Anti-Patterns (Do NOT Use)

- ❌ Generic design
- ❌ Hidden services

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Tabler icons via React Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have
  cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Tabler icons via React Icons)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
