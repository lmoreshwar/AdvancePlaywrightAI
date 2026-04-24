# 👁️ Prompt Visual Automation — Creating Visual Tests from Functional Test Cases

**Author**: Framework Architecture (15-year automation architect standard)  
**Purpose**: Step-by-step instructions for an AI agent to generate `visual.spec.ts` entries from existing functional test cases.

## ✅ Quick Prompt (Simple English)

Attach this file and send a short prompt like:

```
Create visual tests for src/tests/<YOUR_SPEC_FILE>.spec.ts.
Reference: PROMPT_VISUAL_AUTOMATION.md (attached)
Show plan first before writing code.
```

More examples: `FRAMEWORK_HUB/03_AI_Commands/PROMPT_SHORTCUTS.md`

---

## ⚠️ PREREQUISITE — Read This First

**Visual tests cannot be written before functional tests. This is a hard rule.**

The correct order is always:

```
STEP 1 → Write requirements in testcases.md
STEP 2 → Write functional spec (Pages → Modules → Spec file e.g. header.spec.ts)
STEP 3 → THEN derive visual tests from the SAME modules (visual.spec.ts)
```

**Why?**  
Visual tests borrow 100% of their navigation and state-setup logic from the functional module layer.  
If the functional spec doesn't exist yet, the modules don't exist, so there is nothing for the visual test to reuse.  
If you write visual tests without functional tests first, you end up duplicating `page.goto()`, locators, and navigation logic in two places — and when the UI changes, you fix the same thing twice.

**Checklist before starting visual test generation:**
```
□ Functional spec file exists in src/tests/ (e.g. header.spec.ts)
□ Module file exists in src/modules/ with navigation methods (e.g. headerModule.navigateAndVerifyHeader())
□ Page Object file exists in src/pages/ with locators and actions
□ Fixtures are registered in src/fixtures/index.ts
□ At least one local run of the functional tests has passed
```

Only after all boxes are checked, proceed to generate visual tests.

---

## 🗣️ How YOU (the Human) Feed Prompts to the Agent — Step by Step

This section is for **you**, not the AI agent. Follow these steps each time you want to generate visual tests.

### Phase 1 — Confirm Functional Tests Are Done

Before opening the AI agent, verify:
1. Open `src/tests/` — confirm your spec file exists (e.g. `header.spec.ts`)
2. Open `src/modules/` — confirm the module has navigate/verify methods
3. Run `npx playwright test --list` — confirm your functional tests appear in the list

### Phase 2 — Identify Which Test Cases Need Visual Coverage

Open `FRAMEWORK_HUB/01_Requirements/testcases.md`.  
Go through each functional test case and ask:  
*"Does this test case verify something a human can SEE on the screen?"*  
If yes → it needs a visual test.

Mark them mentally:
- **Default state** (page just loads, no interaction) → `@Smoke`
- **Interaction required** (click, hover, scroll, open modal, apply filter) → `@Regression`
- **Different across viewports** (hamburger menu, padding, layout shifts) → `@Responsive`

### Phase 3 — Write Your Prompt to the Agent

Use the exact template below. Copy it, fill in the gaps:

```
Process PROMPT_VISUAL_AUTOMATION.md.

I have completed the following functional spec files:
- src/tests/[your-spec-file].spec.ts

Generate visual tests in src/tests/visual.spec.ts for these test cases:

[PASTE specific test case rows from testcases.md here]

Rules you must follow:
1. Read src/tests/visual.spec.ts in full FIRST — do not create any snapshot that already exists
2. Read all files in src/modules/ — reuse existing module methods, never write raw page.goto()
3. Read src/fixtures/index.ts — use only registered fixture names
4. Follow the 3-step pattern for every test: Navigate (module) → State setup → takeSnapshot()
5. @Smoke for default page states, @Regression for interactive states, @Responsive for viewports
6. Use { skipStabilization: true } for modals, dropdowns, hover overlays
7. Do NOT write any assertions (expect()) inside visual tests
8. Snapshot names must follow: 'Area - State Description' in Title Case
9. Show me the final test count and list of snapshot names before writing any code
```

### Phase 4 — Review Before the Agent Writes Code

After giving the prompt, the agent should first reply with a **plan**: a list of snapshot names and test count.  
**Read the plan before saying "proceed".**  
Check:
- No snapshot name already exists in `visual.spec.ts`
- Every test maps to a real module method
- Tags are correct

### Phase 5 — After the Agent Writes Code

Verify:
```
□ Run: npx playwright test visual.spec.ts --project=desktop-chrome --dry-run
   → All new tests appear in the list, zero errors
□ Run: npx playwright test visual.spec.ts --project=desktop-chrome
   → Tests pass locally (Percy token not needed locally — snapshots are silently skipped)
□ If any test fails, refer to PROMPT_DEBUG_REPORT.md workflow
□ Commit and push to trigger Percy in CI
```

---

## 🎓 Full End-to-End Worked Example

This example walks through the **complete journey** from a functional spec to a visual test.

### The Functional Test That Already Exists

You wrote this in `src/tests/header.spec.ts`:

```typescript
test('@P1 @Regression should open language switcher modal', async ({ headerModule, headerPage }) => {
    await test.step('Navigate and verify header', async () => {
        await headerModule.navigateAndVerifyHeader();
    });

    await test.step('Click language switcher', async () => {
        await headerPage.clickLanguageSwitcher();
    });

    await test.step('Verify modal is visible', async () => {
        await headerPage.expectLanguageModalVisible();
    });
});
```

The methods `navigateAndVerifyHeader()`, `clickLanguageSwitcher()`, and `expectLanguageModalVisible()` already exist in `HeaderModule` and `HeaderPage`.

### The Test Case in testcases.md

```
| Click on the language switcher and verify that the Language switcher modal shows up |
| Language switcher modal should show up |
```

### Your Prompt to the Agent

```
Process PROMPT_VISUAL_AUTOMATION.md.

I have completed the functional spec: src/tests/header.spec.ts

Generate a visual test in src/tests/visual.spec.ts for this test case:
"Click on the language switcher and verify that the Language switcher modal shows up"

Rules:
1. Read visual.spec.ts in full first — do not duplicate existing snapshots
2. Reuse headerModule.navigateAndVerifyHeader() and headerPage.clickLanguageSwitcher()
3. This is an interactive state (modal overlay) — use skipStabilization: true
4. Tag: @Regression
5. Show me the snapshot name and test name BEFORE writing code
```

### The Agent's Plan (What It Should Reply First)

```
Planned addition to visual.spec.ts:

Test name    : 'Header Language Modal Visual @Regression'
Snapshot name: 'Header - Language Modal Open'
Tag          : @Regression
Module used  : headerModule.navigateAndVerifyHeader()
State setup  : headerPage.clickLanguageSwitcher() + headerPage.expectLanguageModalVisible()
skipStabilization: true (modal overlay)

No duplicate found in existing visual.spec.ts.
Proceed?
```

### The Generated Visual Test (What the Agent Writes After You Say "Proceed")

```typescript
test('Header Language Modal Visual @Regression', async ({ page, headerModule, headerPage, visualModule }) => {
    await test.step('Navigate to Homepage and Verify Header', async () => {
        await headerModule.navigateAndVerifyHeader();  // ← borrowed from functional spec
    });

    await test.step('Open Language Modal', async () => {
        await headerPage.clickLanguageSwitcher();       // ← borrowed from functional spec
        await headerPage.expectLanguageModalVisible();  // ← borrowed from functional spec
    });

    await test.step('Capture Language Modal Snapshot', async () => {
        await visualModule.takeSnapshot('Header - Language Modal Open', { skipStabilization: true });
    });

    await test.step('Close Language Modal', async () => {
        await page.keyboard.press('Escape');
    });
});
```

### What Percy Does With This

1. First run → no baseline exists → Percy **creates** the baseline snapshot
2. You review it on the Percy dashboard and **approve** it
3. Every future run → Percy **compares** pixel-by-pixel against the approved baseline
4. If the modal changes (font, color, layout, spacing) → Percy **flags it** as a visual diff
5. Your team reviews the diff → approves if intentional, rejects if regression

---

## 🧠 Core Concept: What Is a Visual Test in This Framework?

A visual test is **NOT** a functional assertion. It does not check `expect(element).toBeVisible()`.

A visual test does exactly **three things**:
1. **Navigate** to the correct URL / page state (reuse functional modules — never duplicate)
2. **Set up** the precise UI state to capture (open modal, hover menu, scroll to section, apply filter)  
3. **Call** `visualModule.takeSnapshot('Descriptive Snapshot Name')`

Percy then compares the snapshot against the approved baseline and reports any pixel differences.

**The AI agent should NEVER write new navigation or assertion logic in visual.spec.ts.**  
All navigation and state setup reuses existing Module methods from `src/modules/`.

---

## 📐 Architecture Rule: Functional vs Visual

| Type | File | What It Does |
|---|---|---|
| Functional test | `src/tests/*.spec.ts` | Asserts behavior (text, visibility, count, URL) |
| Visual test | `src/tests/visual.spec.ts` | Captures pixel snapshot of a UI state |
| Support layer | `src/modules/VisualModule.ts` | Wraps Percy, handles stabilization |
| Percy config | `configs/percy.yml` | Global viewport widths, CSS overrides |

**Single spec file rule**: ALL visual tests live in `src/tests/visual.spec.ts`. Do not create new visual spec files.

---

## 🔁 How to Derive a Visual Test from a Functional Test Case

### The Mapping Formula

For every functional test case, ask these 3 questions:

| Question | If YES |
|---|---|
| Does it verify a visible component exists? | Add visual snapshot of that component's default state |
| Does it trigger a UI state change (modal, dropdown, scroll, hover)? | Add visual snapshot of THAT specific state |
| Does it check responsive/viewport-specific behavior? | Add to `@Responsive` visual test with `testInfo.project.name` routing |

### Practical Examples from This Framework

| Functional Test Case | Derived Visual Test | Snapshot Name |
|---|---|---|
| Verify OpenText logo displays | `Header Visual @Smoke` | `'Header - Default State'` |
| Click Language Switcher → verify modal | `Header Language Modal Visual @Regression` | `'Header - Language Modal Open'` |
| Hover Products menu → verify submenu | `Products Mega-Menu Visual @Regression` | `'Header - Products Mega Menu'` |
| Homepage loads correctly | `Homepage Visual @Smoke` | `'Homepage - Full View'` |
| Scroll to footer → verify footer visible | `Homepage Footer Visual @Regression` | `'Homepage - Footer Section'` |
| Scroll to bottom → verify sticky header | `Homepage Sticky Header Visual @Regression` | `'Homepage - Sticky Header State'` |
| Apply filter Industry=Banking | `Customer Stories Filtered Results Visual` | `'Customer Stories - Filtered Results'` |
| Navigate to /contact | `Contact Us Page Visual @Smoke` | `'Page - Contact Us'` |

---

## 📋 Step-by-Step Instructions: Give the AI Agent This Command

### Step 1 — Identify Source Test Cases

Open `FRAMEWORK_HUB/01_Requirements/testcases.md` and identify which test cases:
- Verify visible UI components → map to **@Smoke** visual tests
- Verify UI state changes (modal, dropdown, expanded state) → map to **@Regression** visual tests  
- Verify responsive layout across viewports → map to **@Responsive** visual tests

### Step 2 — Check Existing visual.spec.ts

Read `src/tests/visual.spec.ts` in full.  
**DO NOT create a snapshot that already exists.**  
If a snapshot with the same name already exists, skip it.

### Step 3 — Check Existing Module Methods

Read ALL files in `src/modules/` before writing.  
For each new visual test:
- Find the existing module method that navigates to the required page state
- Use that module method — never write raw `page.goto()` or locator actions in visual.spec.ts
- If no module method exists for the required state, add it to the relevant Module first

### Step 4 — Write the Visual Test

**Template — every visual test follows this exact 3-step pattern:**

```typescript
test('<Page/Component> Visual <Description> @<Tag>', async ({ page, <module>, visualModule }) => {
    // STEP 1: Navigate + functional setup (reuse module)
    await test.step('Navigate and set up state', async () => {
        await <module>.<existingNavigationMethod>();
    });

    // STEP 2 (optional): UI state setup (open modal, hover, scroll, etc.)
    await test.step('Set up specific UI state', async () => {
        await <pageObject>.<stateAction>();
    });

    // STEP 3: Capture snapshot — ALWAYS the last step
    await test.step('Capture Visual Snapshot', async () => {
        await visualModule.takeSnapshot('<Descriptive Name>');
    });
});
```

**For interactive/overlay states** (modal open, dropdown expanded, hover active):
```typescript
await visualModule.takeSnapshot('<Name>', { skipStabilization: true });
```

**For normal page states** (no overlay, fully loaded):
```typescript
await visualModule.takeSnapshot('<Name>');
// skipStabilization defaults to false — Percy waits for page to stabilize
```

### Step 5 — Snapshot Naming Convention

Snapshot names are the Percy baseline ID. Use this format:

```
'<Area> - <State Description>'
```

| Good ✅ | Bad ❌ |
|---|---|
| `'Header - Language Modal Open'` | `'test_header_modal'` |
| `'Homepage - Sticky Header State'` | `'homepage sticky'` |
| `'Customer Stories - Filter Expanded'` | `'filter'` |
| `'Responsive - SM Hamburger State'` | `'small viewport'` |

**Rules:**
- Always use Title Case
- Area first, then state description separated by ` - `
- Never include dates, retries, or browser names in the name
- Names must be unique across the entire visual.spec.ts file

### Step 6 — Assign Tags Correctly

| Tag | When to Use |
|---|---|
| `@Smoke` | Core page renders in default state (no interaction required) |
| `@Regression` | Requires a UI interaction to reach the state (modal, filter, hover, scroll) |
| `@Responsive` | Captures viewport-specific layout behavior (must route by `testInfo.project.name`) |

### Step 7 — Responsive Visual Tests Pattern

For any test case that mentions "all viewports" or specific breakpoints:

```typescript
test('Component Responsive Visual @Responsive', async ({ page, module, visualModule }, testInfo) => {
    await test.step('Navigate', async () => {
        await module.navigateMethod();
    });

    await test.step('Capture Responsive Snapshot', async () => {
        const projectName = testInfo.project.name;

        if (projectName === 'viewport-xl') {
            await visualModule.takeSnapshot('Responsive - XL <Component>');
            return;
        }
        if (projectName === 'viewport-md') {
            await visualModule.takeSnapshot('Responsive - MD <Component>');
            return;
        }
        if (projectName === 'viewport-sm') {
            await visualModule.takeSnapshot('Responsive - SM <Component>');
            return;
        }

        test.skip(true, `Responsive visual scoped to viewport-xl, viewport-md, viewport-sm. Current: ${projectName}`);
    });
});
```

---

## 🚫 What the AI Agent Must NEVER Do in visual.spec.ts

```
❌ DO NOT write: await page.goto('/some-path')   → Use module.navigateMethod() instead
❌ DO NOT write: await expect(locator).toBeVisible()  → Visual tests have NO assertions
❌ DO NOT write: await page.getByRole(...)   → Use PageObject methods instead
❌ DO NOT write: new describe() blocks inside visual.spec.ts   → One top-level describe only
❌ DO NOT create: visual-homepage.spec.ts, visual-header.spec.ts   → One file only
❌ DO NOT duplicate: snapshots with the same name that already exist
❌ DO NOT use: hardcoded timeouts like await page.waitForTimeout(3000)   → Use module stabilization
```

---

## 🎯 Complete Example: Deriving Visual Tests from testcases.md

### Input — Functional Test Case

From `testcases.md`:
> *"Click on the language switcher and verify that the Language switcher modal shows up"*

### Output — Visual Test Entry

```typescript
test('Header Language Modal Visual @Regression', async ({ page, headerModule, headerPage, visualModule }) => {
    // Step 1: Navigate using existing module
    await test.step('Navigate to Homepage and Verify Header', async () => {
        await headerModule.navigateAndVerifyHeader();
    });

    // Step 2: Trigger the specific UI state
    await test.step('Open Language Modal', async () => {
        await headerPage.clickLanguageSwitcher();
        await headerPage.expectLanguageModalVisible();
    });

    // Step 3: Capture the state — skipStabilization because modal is an overlay
    await test.step('Capture Language Modal Snapshot', async () => {
        await visualModule.takeSnapshot('Header - Language Modal Open', { skipStabilization: true });
    });

    // Step 4: Clean up the state
    await test.step('Close Language Modal', async () => {
        await page.keyboard.press('Escape');
    });
});
```

---

## 🔧 Checklist Before Committing Visual Tests

```
□ Read src/tests/visual.spec.ts in full — check no duplicate snapshot names
□ Every visual test reuses module methods — no raw page.goto() in the spec
□ All tests follow the 3-step pattern: Navigate → State → Snapshot
□ Snapshot names follow the naming convention: 'Area - State Description'
□ Tags are correct: @Smoke / @Regression / @Responsive
□ Interactive states use { skipStabilization: true }
□ No functional assertions (expect()) inside visual tests
□ Run: npx playwright test visual.spec.ts --project=desktop-chrome --dry-run
□ Confirm test count matches expected additions
```

---

## 🗣️ Exact Command to Give the AI Agent

To generate visual tests from your functional test cases, give exactly this command:

```
Process PROMPT_VISUAL_AUTOMATION.md.

Generate visual tests in src/tests/visual.spec.ts for the following functional test cases from testcases.md:
[paste the test case rows here]

Rules:
1. Read visual.spec.ts in full first — do not duplicate any existing snapshot names
2. Read all modules in src/modules/ — only use existing methods, do not repeat navigation logic
3. Follow the 3-step pattern: Navigate (module) → State setup → takeSnapshot()
4. Use correct tags: @Smoke for default states, @Regression for interactive states
5. Add { skipStabilization: true } for modals, dropdowns, hover states
6. Do NOT write any assertions (expect()) in visual tests
```

---

## 📁 Files the AI Must Read Before Writing

> **MAINTENANCE RULE (AUTO-UPDATE — MANDATORY)**: When the AI creates a NEW
> Module, Page, or Spec file, it **MUST** add a row here in the same edit session.
> This table must always reflect the actual files in `src/`.
> The AI must ALSO update the matching tables in `PROMPT_NEW_AUTOMATION.md` Section 4
> and `PROMPT_MODIFY_IMPROVE.md` Section 4.

| File | Why |
|---|---|
| `src/tests/visual.spec.ts` | Avoid duplicate snapshot names |
| `src/modules/HeaderModule.ts` | Navigation methods for header tests |
| `src/modules/HomepageModule.ts` | Navigation methods for homepage tests |
| `src/modules/CustomerStoriesModule.ts` | Navigation + filter methods |
| `src/modules/AviatorAiModule.ts` | Navigation + verification methods for Aviator AI pages |
| `src/modules/VisualModule.ts` | Understand the `takeSnapshot()` API |
| `src/fixtures/index.ts` | Available fixture names for visual tests |
| `src/fixtures/index.ts` | Available fixture names |
| `configs/percy.yml` | Global Percy viewport configuration |

