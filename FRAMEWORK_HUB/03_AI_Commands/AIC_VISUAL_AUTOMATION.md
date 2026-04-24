# 👁️ AIC Visual Automation — Creating Visual Tests from Functional Test Cases

**Author**: Framework Architecture (15-year automation architect standard)  
**Purpose**: Step-by-step instructions for an AI agent to generate `visual.spec.ts` entries from existing functional test cases.

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
Process AIC_VISUAL_AUTOMATION.md.

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

| File | Why |
|---|---|
| `src/tests/visual.spec.ts` | Avoid duplicate snapshot names |
| `src/modules/HeaderModule.ts` | Navigation methods for header tests |
| `src/modules/HomepageModule.ts` | Navigation methods for homepage tests |
| `src/modules/CustomerStoriesModule.ts` | Navigation + filter methods |
| `src/modules/VisualModule.ts` | Understand the `takeSnapshot()` API |
| `src/fixtures/index.ts` | Available fixture names |
| `configs/percy.yml` | Global Percy viewport configuration |
