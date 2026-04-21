# 🛠️ AI Script Modification & Improvement

## Goal: Safely Modify Existing Test Scripts

**How to use**: Fill out the fields below, then tell the AI Agent:
> *"Process AIC_MODIFY_IMPROVE.md"*

---

## 📂 1. What to Modify

### Target Component(s)
<!-- List the files or areas to modify. Be specific. -->
```
[e.g. src/modules/HeaderModule.ts — verifyLanguageSwitcher()]
[e.g. src/pages/HeaderPage.ts — add new locator for Products dropdown]
[e.g. src/tests/header.spec.ts — update test tags]
```

### Requested Changes
<!-- Describe what you want changed. Be as detailed as possible. -->
```
[DESCRIBE YOUR CHANGES HERE]
```

### Why This Change?
<!-- Optional: Explain the reason for the change -->
```
[e.g. "The Products dropdown now has a new sub-menu item 'AI Solutions'"]
[e.g. "Need to increase timeout because BrowserStack is slower"]
```

---

## 🎯 2. Scope Control

| Setting | Value |
|---|---|
| **Files to modify** | [list specific files, or "AI decides"] |
| **Run tests after** | [Yes / No] |
| **BrowserStack verify** | [Yes / No] |
| **Multiple files** | [Yes — list them / No — single file] |

---

## 🔒 3. AI Agent Safety Rules (DO NOT MODIFY)

### CRITICAL: Impact Analysis Before ANY Edit

```
BEFORE modifying ANY file, the AI Agent MUST:

1. READ the entire file to understand all existing code
2. IDENTIFY all functions/locators that depend on the code being changed
3. SEARCH for all usages: grep for the function name across src/
4. LIST all impacted tests that use the modified code
5. PRESENT the impact analysis to the user before making changes
```

### Rule 1: Locator Modification Safety

```
⚠️ HIGHEST RISK: Locator changes can break multiple tests

When MODIFYING an existing locator:
  1. Search ALL files that call this locator function
  2. List every test that will be affected
  3. DO NOT change the locator's function signature (name, return type)
  4. If the locator strategy changes (e.g., getByRole → getByText),
     add the NEW locator as an .or() fallback, don't replace the primary
  5. Test ALL affected tests after the change

When ADDING a new locator:
  1. Follow the naming convention: elementName = () => this.page.getByRole(...)
  2. Place it in the correct section (Locators, Actions, Assertions)
  3. Do NOT create duplicates — check if a similar locator exists
  4. Export from the Page barrel file if it's a new Page Object

When DELETING a locator:
  1. REFUSE unless the user explicitly asks
  2. Show all usages first
  3. Remove all references before deleting
```

### Rule 2: Module Method Safety

```
When MODIFYING a module method:
  1. Keep the method signature unchanged (name, params, return type)
  2. Preserve existing Logger.step() calls (update step numbers if adding steps)
  3. Don't remove error handling (try/catch blocks, .catch(() => {}))
  4. If adding new steps, INSERT them — don't restructure the entire method

When ADDING a new module method:
  1. Follow the pattern: async methodName(): Promise<void>
  2. Add JSDoc description
  3. Use this.logger.step() for each action
  4. Call this.headerPage (or relevant page object), never use raw page directly
```

### Rule 3: Test Spec Safety

```
When MODIFYING test specs:
  1. Do NOT change existing test titles (they're used for reporting)
  2. Do NOT change test tags unless explicitly asked
  3. Do NOT reorder tests (order may matter for CI)
  4. Keep the test.describe() → test.step() → module.method() pattern

When ADDING tests to existing spec:
  1. Add AFTER existing tests, not in between
  2. Follow the existing tag pattern in that file
  3. Use existing fixtures — don't create inline helpers
```

### Rule 4: Multi-File Modifications

```
When modifying MULTIPLE files:
  1. Edit in dependency order: Pages → Modules → Specs → Fixtures
  2. After each file edit, verify it compiles (no TypeScript errors)
  3. Run ALL affected tests after all edits are complete
  4. If any test breaks, ROLLBACK the change and report the issue
```

### Rule 5: Verification Protocol

```
After ALL modifications are complete:
  1. Run `npx playwright test --project=desktop-chrome` (existing tests)
  2. Verify ZERO regressions
  3. If BrowserStack=Yes: run `npm run test:bstack -- <affected-spec>`
  4. Show a diff summary of all changes made
  5. Update AIC_DEBUG_REPORT.md if any failures occurred
```

---

## 📁 4. Quick Reference — Existing Code Map

### Page Objects (Locators)
| File | Key Locators |
|---|---|
| `HeaderPage.ts` | `logoLink`, `headerNav`, `hamburgerBtn`, `menuItemByText()`, `searchIcon`, `languageSwitcher`, `contactButton`, `acceptCookiesBtn` |
| `HomepagePage.ts` | Homepage component locators (hero, cards, sections) |
| `FooterPage.ts` | Footer links and navigation |

### Modules (Business Logic)
| File | Key Methods |
|---|---|
| `HeaderModule.ts` | `setupHeaderPage()`, `verifyMenu()`, `verifyLanguageSwitcher()`, `verifyContactButton()`, `verifyHeaderVisibility()`, `verifyAllMenuItems()` |
| `HomepageModule.ts` | `setupHomepage()`, `verifyHero()`, `verifyComponents()` |

### Test Specs
| File | Tests | Tags |
|---|---|---|
| `header.spec.ts` | 14 tests | @P0 @Smoke, @P1 @Regression |
| `homepage.spec.ts` | Homepage tests | @P0 @Smoke, @P1 @Regression |
| `responsive.spec.ts` | Cross-viewport tests | @P1 @Regression |

---

## 📝 5. Output Template (AI Agent Must Produce)

After modification, the AI Agent will produce:

```
✅ Files Modified:
  - [file] — [what changed]

✅ Impact Analysis:
  - [N] tests affected
  - [list of affected test titles]

✅ Verification:
  - Local: PASSED / FAILED
  - BrowserStack: PASSED / FAILED / SKIPPED
  - Regressions: NONE / [list]

✅ Diff Summary:
  [show key diffs]
```
