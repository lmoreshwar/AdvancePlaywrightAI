# 🛠️ AI Script Modification & Improvement

## Goal: Safely Modify Existing Test Scripts

## ✅ Quick Prompt (Simple English)

Attach this file and send a short prompt like:

```
Update these existing tests:
- <file + what to change>

Reference: PROMPT_MODIFY_IMPROVE.md (attached)
Show the impact analysis + plan first before writing code.
```

More examples: `FRAMEWORK_HUB/03_AI_Commands/PROMPT_SHORTCUTS.md`

**How to use**: Fill out the fields below, then tell the AI Agent:
> *"Process PROMPT_MODIFY_IMPROVE.md"*

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

### CRITICAL: Anti-Hallucination & Coverage Analysis

```
BEFORE modifying ANY file based on requirements, test cases, or bug reports, the AI Agent MUST:

1. Read `AGENTS.md`.
2. Read `FRAMEWORK_HUB/04_Framework_Standards/AI_COVERAGE_STANDARDS.md`.
3. Base every change only on explicitly provided facts.
4. Do not invent missing UI behavior, locators, defaults, or expected outcomes.
5. Validate that the requested change preserves or improves test coverage for the affected scenario.
```

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
  5. Update PROMPT_DEBUG_REPORT.md if any failures occurred
```

### Rule 6: Responsive Modification Safety

```
When MODIFYING responsive or viewport-specific tests:
  1. Make layout/viewport changes ONLY inside src/tests/responsive.spec.ts
  2. Protect viewport-specific changes with conditions (e.g. `if (vp.type === 'mobile')`)
  3. Verify the change across ALL viewports (XL, LG, MD, SM, XS) so fixing a mobile bug doesn't break the desktop test.
```

### Rule 7: Viewport-Resilient Coding (MANDATORY)

```
BrowserStack, CI runners, and different Playwright projects run tests at different
viewport sizes. The effective viewport may NOT match what you see locally.

When MODIFYING locators or Module methods that target elements affected by
responsive breakpoints (nav links, hamburger menus, collapsible sections):

1. ALWAYS query the runtime viewport width before asserting visibility:
   const vpWidth = await this.page.evaluate(() => window.innerWidth);

2. For elements hidden below certain breakpoints, use CSS locators for
   DOM-presence checks instead of getByRole() (which excludes hidden elements):
   CORRECT: this.page.locator('nav.navbar-secondary a[href]')
   WRONG:   this.secondaryNav().getByRole('link')  — returns 0 if links are hidden

3. When modifying a method that clicks links inside a collapsible section,
   add toggle-expand logic for smaller viewports BEFORE clicking:
   if (vpWidth < 1376) { await toggle.click(); }

4. BREAKPOINT REFERENCE:
   XL ≥ 1376px | LG ≥ 968px | MD ≥ 720px | SM ≥ 576px | XS ≥ 440px

5. After modifying any locator used across viewports, verify it works at BOTH
   desktop (1440x900) and a smaller viewport (1024x768 or 768x1024).
```

### Rule 8: Console Error Resilience for Cloud/CI Environments

```
When MODIFYING or ADDING assertNoUnexpectedConsoleErrors() methods:

1. ALWAYS copy the full ignore pattern list from an existing module
   (e.g., AviatorAiModule.ts) as the baseline. Never start with an empty list.

2. Cloud environments produce network errors that never appear locally:
   - ERR_TUNNEL_CONNECTION_FAILED (BrowserStack proxy)
   - ERR_FAILED (CDN/third-party blocked by proxy)
   - WebSocket handshake failures (qualified.com, analytics)
   - CORS errors (wisepops.net, marketing tools)

3. When a debug report shows "Environment Issue" failures with console errors,
   ADD the new error pattern to the ignore list — do NOT mark these as defects.
```


---

## 📁 4. Quick Reference — Existing Code Map

> **MAINTENANCE RULE (AUTO-UPDATE — MANDATORY)**: Whenever the AI creates a NEW
> Page, Module, Spec, Util, or TestData file, it **MUST** add a row to the
> appropriate table below in the same edit. This map must always reflect the
> actual files in `src/`. Failure to update this table is a rule violation.

### Page Objects (Locators)
| File | Key Locators |
|---|---|
| `HeaderPage.ts` | `logoLink`, `headerNav`, `hamburgerBtn`, `menuItemByText()`, `searchIcon`, `languageSwitcher`, `contactButton`, `acceptCookiesBtn` |
| `HomepagePage.ts` | Homepage component locators (hero, cards, sections) |
| `FooterPage.ts` | Footer links and navigation |
| `CustomerStoriesPage.ts` | Customer Stories locators (filters, cards, pagination, hero) |
| `AviatorAiPage.ts` | Aviator AI locators (hero, secondary nav, bento, flip cards, featured card, FAQ, Limitless, MyAviator) |

### Modules (Business Logic)
| File | Key Methods |
|---|---|
| `HeaderModule.ts` | `setupHeaderPage()`, `verifyMenu()`, `verifyLanguageSwitcher()`, `verifyContactButton()`, `verifyHeaderVisibility()`, `verifyAllMenuItems()` |
| `HomepageModule.ts` | `setupHomepage()`, `verifyHero()`, `verifyComponents()` |
| `CustomerStoriesModule.ts` | Customer Stories workflows (filters, pagination, card verification) |
| `AviatorAiModule.ts` | Aviator AI workflows (hero, bento, Scenario Library, flip cards, Limitless, MyAviator) |
| `VisualModule.ts` | Percy visual regression snapshot capture |

### Test Specs
| File | Tests | Tags |
|---|---|---|
| `header.spec.ts` | 7 header tests | @P0 @Smoke, @P1 @Regression |
| `homepage.spec.ts` | Homepage tests | @P0 @Smoke, @P1 @Regression |
| `responsive.spec.ts` | Cross-viewport tests | @P1 @Regression |
| `customer-stories.spec.ts` | 4 Customer Stories tests | @P0 @Smoke, @P1 @Regression |
| `aviator-ai.spec.ts` | 10 Aviator AI tests | @P0 @Smoke, @P1 @Regression |
| `visual.spec.ts` | 15 Percy visual tests | @Visual @Smoke, @Regression, @Responsive |

### Test Data & Utils
| File | Contains |
|---|---|
| `src/testdata/menus.json` | Menu items, headers, viewport configuration |
| `src/testdata/types.ts` | TypeScript type definitions for test data |
| `src/utils/SmartLocator.ts` | Self-healing locator utility |
| `src/utils/Logger.ts` | Step-based logger |
| `src/utils/AiDebugReporter.ts` | Playwright reporter generating AI debug reports |
| `src/utils/WindowHelper.ts` | Multi-tab/window browser management |
| `src/utils/WaitHelper.ts` | Custom waits and retry logic |
| `src/utils/StringHelper.ts` | Text parsing and sanitization |
| `src/utils/IframeHelper.ts` | Cross-domain iframe interactions |
| `src/utils/FileHelper.ts` | File upload/download automation |
| `src/utils/DataGenerator.ts` | Random test data generation |

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

