# 🤖 AI Test Automation — New Test Case Creation

## Goal: Automate New Test Cases from Requirements

**How to use**: Fill out the fields below, then tell the AI Agent:
> *"Process AIC_NEW_AUTOMATION.md"*

---

## 📋 1. Test Case Requirements

### Test Cases to Automate
<!-- Provide test case details. You can reference testcases.md or describe in plain English. -->
<!-- Example: "Automate TC-H09: Verify Products menu items are sorted A-Z" -->

```
[PASTE YOUR REQUIREMENTS HERE]
```

### Source Reference
- **File**: `FRAMEWORK_HUB/01_Requirements/testcases.md`
- **Section**: [e.g. "Regression Test: Header", "Regression Test: HomePage"]

---

## 🎯 2. Execution Configuration

| Setting | Value |
|---|---|
| **Project** | [desktop-chrome / tablet-safari / mobile-iphone] |
| **BrowserStack** | [Yes / No] |
| **Priority Tags** | [@P0 @Smoke / @P1 @Regression / @P2 @E2E] |

---

## 🔒 3. AI Agent Execution Rules (DO NOT MODIFY)

### STRICT RULES — The AI Agent MUST Follow These:

#### Rule 1: Research Before Writing
```
BEFORE writing ANY code:
1. Read ALL existing Page Objects in src/pages/ to find existing locators
2. Read ALL existing Modules in src/modules/ to find existing business logic
3. Read ALL existing Spec files in src/tests/ to find existing test patterns
4. Read src/fixtures/index.ts to understand available fixtures
5. Read src/config/index.ts for configuration constants
6. Run `npx playwright test --list` to see all existing test names
```

#### Rule 2: NEVER Duplicate or Override Existing Locators
```
- If a locator already exists in a Page Object, REUSE it
- If a module method already exists, CALL it — do not rewrite it
- NEVER modify existing locator functions unless explicitly asked
- If you need a NEW locator, ADD it — do not replace existing ones
- Check for naming conflicts before creating new locators
```

#### Rule 3: Follow the 3-Layer Architecture
```
Layer 1 — Page Object (src/pages/):
  - Contains ONLY locators and low-level actions (click, fill, expect)
  - Each locator is a function: `elementName = () => this.page.getByRole(...)`
  - Each action is async: `async clickElement(): Promise<void>`
  - Each assertion is async: `async expectElementVisible(): Promise<void>`
  
Layer 2 — Module (src/modules/):
  - Contains business logic workflows (sequences of Page Object calls)
  - Uses Logger for step-by-step logging
  - Handles page setup (navigate, accept cookies, close popups)
  - One public method per test scenario
  
Layer 3 — Spec (src/tests/):
  - Contains test.describe() groups with tags
  - Each test calls ONE module method per test.step()
  - Uses fixtures from src/fixtures/index.ts
  - Tags: @P0 @Smoke, @P1 @Regression, @P2 @E2E
```

#### Rule 4: Use Semantic Locators Only
```
Priority order for locators:
1. getByRole() — ALWAYS prefer this first
2. getByText() — for text-based elements
3. getByTestId() — for data-testid attributes
4. getByLabel() — for form elements
5. locator() with CSS — LAST RESORT only

NEVER use:
- XPath
- Fragile CSS selectors (div > div > span:nth-child(3))
- IDs that look auto-generated
```

#### Rule 5: Verification Checklist
```
After creating new test code, the AI Agent MUST:
1. Run `npx playwright test <new-spec-file> --project=desktop-chrome` locally
2. Verify ALL existing tests still pass (no regressions)
3. If BrowserStack=Yes, run `npm run test:bstack -- <spec-file>`
4. Update AIC_DEBUG_REPORT.md if any failures occur
5. Commit only after ALL tests pass
```

#### Rule 6: Register New Fixtures
```
If you create a NEW Page Object or Module:
1. Export it from src/pages/index.ts or src/modules/index.ts
2. Add its fixture to src/fixtures/index.ts
3. Add the fixture type to TestFixtures interface
```

#### Rule 7: Responsive Test Case Routing
```
When analyzing test cases, decide where they belong BEFORE writing code:
- Functional/Business Logic (e.g. data validation, forms) → Add to specific feature specs (e.g. header.spec.ts). DO NOT run these on multiple viewports unless explicitly asked.
- Responsive Layout Logic (e.g. padding checking, mobile menus, breakpoints, elements shrinking/hiding across XL/LG/MD/SM/XS) → Add ONLY to src/tests/responsive.spec.ts inside the viewport loop.
```

---

## 📁 4. Existing File Map (AI: Read These First!)

| Layer | File | Contains |
|---|---|---|
| **Config** | `src/config/index.ts` | baseUrl, viewportBreakpoints, mainMenuItems |
| **Fixtures** | `src/fixtures/index.ts` | All test fixtures + global popup handlers |
| **Pages** | `src/pages/HeaderPage.ts` | Header locators (logo, nav, menus, search, language, contact) |
| **Pages** | `src/pages/HomepagePage.ts` | Homepage component locators |
| **Pages** | `src/pages/FooterPage.ts` | Footer locators |
| **Modules** | `src/modules/HeaderModule.ts` | Header workflows (navigate, verify menus, language switcher) |
| **Modules** | `src/modules/HomepageModule.ts` | Homepage workflows |
| **Tests** | `src/tests/header.spec.ts` | 14 header tests (smoke + regression) |
| **Tests** | `src/tests/homepage.spec.ts` | Homepage component tests |
| **Tests** | `src/tests/responsive.spec.ts` | Cross-viewport responsive tests |
| **Utils** | `src/utils/SmartLocator.ts` | Self-healing locator utility |
| **Utils** | `src/utils/Logger.ts` | Step-based logger |

---

## 📝 5. Output Template (AI Agent Must Produce)

After automation, the AI Agent will produce:

```
✅ Files Created/Modified:
  - src/pages/[NewPage].ts (if new page)
  - src/modules/[NewModule].ts (if new module)
  - src/tests/[new-spec].spec.ts
  - src/fixtures/index.ts (if new fixture added)

✅ Tests Added: [count]
✅ Local Run: PASSED / FAILED
✅ BrowserStack Run: PASSED / FAILED / SKIPPED
```
