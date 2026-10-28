# Translation Guide (English → Simplified Chinese)

This project is bilingual. All user-facing text lives in dictionary files under
`src/i18n/dictionaries/`. No application code needs to change when translating.

## 1. Which file to translate

Translate **only** this file:

```
src/i18n/dictionaries/zh-CN.ts
```

`src/i18n/dictionaries/en.ts` is the English source of truth — do not edit it
as part of the translation. If a string is missing or wrong in English, tell the
developer instead of fixing it yourself.

## 2. What you may edit

- Only the **quoted text on the right side of each `:`** (the values).
- Values currently contain the English text as a placeholder. Replace each one
  with Simplified Chinese.

Example — before:

```ts
moEntry: {
  title: "MO Entry",
  submitMo: "Submit MO",
},
```

After:

```ts
moEntry: {
  title: "MO 录入",
  submitMo: "提交 MO",
},
```

## 3. What must remain unchanged

- **All keys** (the names on the left side of each `:`), e.g. `title`, `submitMo`.
- **The structure** — keep the same nesting, the same order, and all commas.
- **Placeholder tokens** inside values, e.g. `{count}`, `{code}`, `{date}`.
  See section 4.
- The comment block at the top of the file and the line
  `import type { Dictionary } from "../types";` and `export const zhCN: Dictionary = {`.
- Product names and codes that must not be translated: MO, WO, IQC, Exim, UPN,
  material codes, model codes, employee IDs.

## 4. Placeholders (interpolation)

Some values contain tokens like `{count}` or `{code}`. The app replaces them
with real values at runtime. Keep the token exactly as-is (including the curly
braces) and place it where it belongs in the Chinese sentence:

```ts
materialsComplete: "{filled} of {total} materials complete",
// becomes e.g.:
materialsComplete: "已完成 {filled}/{total} 项物料",
```

Never translate the word inside the braces. A value may contain several tokens.

## 5. How to validate your work

1. Make sure every key in `zh-CN.ts` also exists in `en.ts` — the file is
   type-checked against the English dictionary, so missing or extra keys cause
   a build error (`npm run build` or `npx tsc --noEmit`).
2. Search your file for leftover English placeholder text if you want a final
   review pass.
3. If you cannot run the build, just send the file back — the developer will
   validate it.

## 6. Returning the completed file

Send the edited `zh-CN.ts` file back to the developer (e.g. by committing it or
sharing the file). Do not rename the file and do not convert it to another
format (JSON, Excel, etc.).
