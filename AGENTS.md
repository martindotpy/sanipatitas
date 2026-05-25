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
