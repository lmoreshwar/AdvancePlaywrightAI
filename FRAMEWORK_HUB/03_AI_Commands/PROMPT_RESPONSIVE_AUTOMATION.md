# 📐 Prompt Responsive Automation — Creating Responsive Tests from Functional Test Cases

**Author**: Framework Architecture (15-year automation architect standard)  
**Purpose**: Step-by-step instructions for an AI agent to generate viewport-specific responsive test cases from existing functional test cases.

## ✅ Quick Prompt (Simple English)

Attach this file and send a short prompt like:

```
Create responsive tests for src/tests/<YOUR_SPEC_FILE>.spec.ts.
Reference: PROMPT_RESPONSIVE_AUTOMATION.md (attached)
Show plan first before writing code.
```

More examples: `FRAMEWORK_HUB/03_AI_Commands/PROMPT_SHORTCUTS.md`

---

## ⚠️ PREREQUISITE — Read This First

**Responsive tests cannot be written before functional tests. This is a hard rule.**

The correct order is always:

```
STEP 1 → Write requirements in testcases.md
STEP 2 → Write functional spec (Pages → Modules → Spec file e.g. aviator-ai.spec.ts)
STEP 3 → THEN derive responsive tests from the SAME modules (responsive.spec.ts or new responsive-<feature>.spec.ts)
```

**Why?**  
Responsive tests borrow 100% of their verification logic from the functional module layer.  
If the functional spec doesn't exist yet, the modules don't exist, so there is nothing for the responsive test to reuse.  
If you write responsive tests without functional tests first, you end up duplicating `page.goto()`, locators, and navigation logic in two places — and when the UI changes, you fix the same thing twice.

**Checklist before starting responsive test generation:**
```
□ Functional spec file exists in src/tests/ (e.g. aviator-ai.spec.ts)
□ Module file exists in src/modules/ with navigation + verification methods
□ Page Object file exists in src/pages/ with locators and actions
□ Fixtures are registered in src/fixtures/index.ts
□ At least one local run of the functional tests has passed
□ Viewport data exists in src/testdata/menus.json (viewports array)
```

Only after all boxes are checked, proceed to generate responsive tests.

---

## 🧠 Core Concept: What Is a Responsive Test in This Framework?

A responsive test verifies that a page's **layout, navigation, and components** render correctly at **each viewport breakpoint**: XL, LG, MD, SM, XS.

Unlike functional tests that run at a fixed desktop viewport (1440×900), responsive tests:
1. **Set a specific viewport** using `test.use({ viewport: { width, height } })`
2. **Reuse existing module methods** for verification (never duplicate logic)
3. **Branch by viewport type** (desktop vs tablet vs mobile) to test viewport-specific behaviors
4. **Loop over all 5 viewports** to run the same checks at each breakpoint

**Key examples of viewport-specific behavior:**
- Mobile/tablet: hamburger menu replaces horizontal nav
- Secondary navigation: collapsed behind a toggle button at < 1376px
- Layout: components stack vertically on smaller viewports
- Scrollers/carousels: touch-swipe vs hover interactions

---

## 📐 Architecture Rule: Functional vs Responsive

| Type | File | What It Does |
|---|---|---|
| Functional test | `src/tests/*.spec.ts` | Tests at default desktop viewport — asserts behavior |
| Responsive test | `src/tests/responsive.spec.ts` or `src/tests/responsive-<feature>.spec.ts` | Same checks at 5 viewport breakpoints — asserts layout adapts |
| Support layer | `src/modules/*Module.ts` | Business logic reused by both functional and responsive tests |
| Viewport data | `src/testdata/menus.json` | Defines the 5 viewport breakpoints and types |

**Spec file rule**: Responsive tests can live in `src/tests/responsive.spec.ts` (for homepage) or in a new `src/tests/responsive-<feature>.spec.ts` file for other features. Keep them separate from functional specs so they can be filtered independently with `@Responsive` tag.

---

## 📐 Viewport Breakpoints Reference

These are defined in `src/testdata/menus.json` under the `viewports` array:

| Breakpoint | Width | Height | Type | Tag |
|---|---|---|---|---|
| XL | 1376px | 900px | desktop | `@XL` |
| LG | 968px | 900px | desktop | `@LG` |
| MD | 720px | 1024px | tablet | `@MD` |
| SM | 576px | 1024px | mobile | `@SM` |
| XS | 440px | 900px | mobile | `@XS` |

**Important**: Use the TypeScript type `ViewportConfig` from `src/testdata/types.ts` for type safety.

---

## 🔁 How to Derive Responsive Tests from Functional Tests

### The Mapping Formula

For every functional test case, ask these questions:

| Question | If YES → Responsive Test Needed |
|---|---|
| Does the component change layout at different viewports? | ✅ Test at all 5 viewports |
| Does navigation change (horizontal → hamburger)? | ✅ Test with mobile/tablet branch |
| Does it have a secondary nav that collapses? | ✅ Test with desktop/mobile branch |
| Does scrolling/sticky behavior differ? | ✅ Test at all 5 viewports |
| Does it have flip cards, accordions, or interactive elements? | ✅ Test interaction at all viewports |
| Is the component purely content with no layout changes? | ❌ Skip — functional test is sufficient |

### Practical Examples

| Functional Test (aviator-ai.spec.ts) | Responsive Test Needed? | Why |
|---|---|---|
| TC-AV01: Header + secondary nav | ✅ Yes | Secondary nav collapses at < 1376px |
| TC-AV02: Bento grid + CTAs | ✅ Yes | Grid layout changes at smaller viewports |
| TC-AV03: Scenario Library tabs + accordion | ✅ Yes | Tab/accordion layout may change |
| TC-AV04: Limitless page sections | ✅ Yes | Section stacking changes at viewports |
| TC-AV05: MyAviator hero + video + plans | ✅ Yes | Plans table, video may resize |
| TC-AV06: Flip cards | ✅ Yes | Flip cards may stack or resize |

---

## 📋 Step-by-Step Instructions for the AI Agent

### Step 1 — Read Existing Files

```
BEFORE writing ANY code:
1. Read src/testdata/menus.json — get the viewports array
2. Read src/testdata/types.ts — get the ViewportConfig type
3. Read src/tests/responsive.spec.ts — understand the existing pattern
4. Read ALL modules in src/modules/ that will be reused
5. Read src/fixtures/index.ts — verify fixture names
6. Read src/pages/ — understand available locators
```

### Step 2 — Determine the Spec File

**Decision Rule:**
- If the responsive tests are for the **homepage** → add to existing `src/tests/responsive.spec.ts`
- If the responsive tests are for a **different feature** (e.g., Aviator AI, Customer Stories) → create a new file: `src/tests/responsive-<feature>.spec.ts`

**Why separate files?** Each feature has different module dependencies and setup logic. Keeping them separate allows independent execution via tags and avoids monolithic spec files.

### Step 3 — Follow the Responsive Test Template

**Template — every responsive spec follows this exact structure:**

```typescript
import { test, expect } from '../fixtures';
import { <FeatureModule> } from '../modules/<FeatureModule>';
import menusData from '../testdata/menus.json';
import { ViewportConfig } from '../testdata/types';

const viewports = menusData.viewports as ViewportConfig[];

/**
 * Responsive Test: <Feature Name> Across Viewports
 * Runs the same set of checks at each viewport breakpoint:
 *   XL (>=1376), LG (>=968), MD (>=720), SM (>=576), XS (>=440)
 */
for (const vp of viewports) {
    test.describe(`@P0 @Regression @Responsive @${vp.name.toUpperCase()} <Feature> — ${vp.name.toUpperCase()} Viewport (${vp.width}x${vp.height})`, () => {
        test.slow(); // Responsive testing is resource intensive
        let featureModule: <FeatureModule>;

        test.use({ viewport: { width: vp.width, height: vp.height } });

        test.beforeEach(async ({ page }) => {
            featureModule = new <FeatureModule>(page);
            await page.goto('/<feature-path>');
            await page.waitForLoadState('domcontentloaded');
        });

        // ─── Common tests for ALL viewports ───
        test(`should load <feature> at ${vp.name.toUpperCase()} viewport`, async () => {
            await test.step(`Verify <feature> loads at ${vp.width}px`, async () => {
                await featureModule.<navigateAndVerify>();
            });
        });

        // ─── Mobile/Tablet specific tests ───
        if (vp.type === 'mobile' || vp.type === 'tablet') {
            test(`should show mobile layout at ${vp.name.toUpperCase()}`, async () => {
                await test.step(`Verify mobile behavior at ${vp.width}px`, async () => {
                    await featureModule.<verifyMobileBehavior>();
                });
            });
        }

        // ─── Desktop specific tests ───
        if (vp.type === 'desktop') {
            test(`should display full navigation at ${vp.name.toUpperCase()}`, async () => {
                await test.step(`Verify desktop navigation at ${vp.width}px`, async () => {
                    await featureModule.<verifyDesktopBehavior>();
                });
            });
        }
    });
}
```

### Step 4 — Viewport-Branching Patterns

#### Pattern A: Tests that run at ALL viewports
```typescript
test(`should verify component at ${vp.name.toUpperCase()}`, async () => {
    await test.step(`Check component at ${vp.width}px`, async () => {
        await module.verifyComponent();
    });
});
```

#### Pattern B: Tests that branch by viewport TYPE
```typescript
// Mobile/Tablet: hamburger menu, collapsed nav
if (vp.type === 'mobile' || vp.type === 'tablet') {
    test(`should show hamburger menu at ${vp.name.toUpperCase()}`, async () => {
        // ...
    });
}

// Desktop: full horizontal nav, expanded secondary nav
if (vp.type === 'desktop') {
    test(`should show expanded nav at ${vp.name.toUpperCase()}`, async () => {
        // ...
    });
}
```

#### Pattern C: Tests that branch by specific BREAKPOINT
```typescript
// Only XL has fully expanded secondary nav links
if (vp.name === 'xl') {
    test(`should show secondary nav links at XL`, async () => {
        // Secondary nav links are visible at XL (>= 1376px)
    });
}

// Non-XL has collapsed secondary nav with toggle
if (vp.name !== 'xl') {
    test(`should show secondary nav toggle below XL`, async () => {
        // Toggle/hamburger for secondary nav
    });
}
```

### Step 5 — Viewport-Resilient Module Methods

**V1: Runtime Viewport Detection** — Module methods MUST detect viewport at runtime:
```typescript
async verifySecondaryNav(): Promise<void> {
    const vpWidth = await this.page.evaluate(() => window.innerWidth);
    if (vpWidth >= 1376) {
        // XL: Secondary nav links are visible
        await expect(this.page.locator('nav.navbar-secondary a')).toBeVisible();
    } else {
        // Below XL: Toggle button is visible instead
        await expect(this.page.locator('nav.navbar-secondary button')).toBeVisible();
    }
}
```

**V2: DOM-Based vs Role-Based Locators** — Use CSS locators for elements hidden at certain viewports:
```typescript
// CORRECT: Finds links even when hidden (CSS display:none)
this.page.locator('nav.navbar-secondary a[href]');

// WRONG: Returns 0 if links are hidden from accessibility tree
this.page.getByRole('link');
```

**V3: Toggle-Before-Interact** — Expand collapsed sections before clicking:
```typescript
if (vpWidth < 1376) {
    await this.page.locator('button[aria-label="Toggle navigation"]').click();
    await this.page.waitForTimeout(500);
}
// Now interact with the expanded content
await this.page.locator('nav.navbar-secondary a').first().click();
```

### Step 6 — Assign Tags Correctly

Every responsive test MUST have these tags in the describe block:

```
@P0 @Regression @Responsive @{VIEWPORT_NAME}
```

| Tag | Purpose |
|---|---|
| `@P0` | Critical priority |
| `@Regression` | Part of regression suite |
| `@Responsive` | Enables `--grep @Responsive` filtering |
| `@XL` / `@LG` / `@MD` / `@SM` / `@XS` | Viewport-specific filtering |

Optionally add the feature tag: `@Aviator`, `@CustomerStories`, `@Header`, `@Homepage`

### Step 7 — Cookie/Popup Handling

Responsive tests must handle cookie banners and popups that may appear differently at different viewports:

```typescript
test.beforeEach(async ({ page }) => {
    featureModule = new FeatureModule(page);
    await page.goto('/<path>');
    await page.waitForLoadState('domcontentloaded');
    // Accept cookies if visible (may appear differently on mobile)
    const acceptAll = page.getByRole('button', { name: /Accept All/i });
    if (await acceptAll.isVisible({ timeout: 1500 }).catch(() => false)) {
        await acceptAll.click().catch(() => {});
        await page.waitForTimeout(300);
    }
});
```

---

## 🗣️ How YOU (the Human) Feed Prompts to the Agent — Step by Step

### Phase 1 — Confirm Functional Tests Are Done

Before opening the AI agent, verify:
1. Open `src/tests/` — confirm your functional spec file exists (e.g., `aviator-ai.spec.ts`)
2. Open `src/modules/` — confirm the module has navigate/verify methods
3. Run `npx playwright test --list` — confirm your functional tests appear

### Phase 2 — Identify Which Test Cases Need Responsive Coverage

Go through each functional test case and ask:  
*"Does this test case verify something that CHANGES across viewport sizes?"*

Mark them:
- **Layout changes** (grid → stack, horizontal → vertical) → Test at ALL viewports
- **Navigation changes** (full nav → hamburger) → Branch by mobile/tablet/desktop
- **Secondary nav collapse** (visible → toggle) → Branch by XL vs non-XL
- **No layout change** (pure content/text check) → May still be worth testing at viewports for safety

### Phase 3 — Write Your Prompt to the Agent

```
Process PROMPT_RESPONSIVE_AUTOMATION.md.

I have completed the following functional spec files:
- src/tests/[your-spec-file].spec.ts

Generate responsive tests for these functional test cases:
[PASTE specific test case descriptions here]

Rules you must follow:
1. Read src/tests/responsive.spec.ts FIRST — understand the existing pattern
2. Read src/testdata/menus.json — get viewport breakpoints
3. Read all modules in src/modules/ — reuse existing methods
4. Read src/fixtures/index.ts — use only registered fixture names
5. Loop over all 5 viewports using the for-loop pattern
6. Branch by vp.type for mobile/tablet vs desktop behaviors
7. Use @Responsive @{VIEWPORT} tags in test.describe()
8. Use test.slow() at the top of each describe block
9. Accept cookies in beforeEach
10. Show me the test list and count BEFORE writing code
```

### Phase 4 — Review Before the Agent Writes Code

The agent should first reply with a **plan**: list of tests per viewport and total count.  
**Read the plan before saying "proceed".**

### Phase 5 — After the Agent Writes Code

Verify:
```
□ Run: npx playwright test responsive-<feature>.spec.ts --list
   → All new tests appear in the list, zero errors
□ Run: npx playwright test responsive-<feature>.spec.ts --project=desktop-chrome
   → Tests pass locally
□ Verify tags: @Responsive, @XL/@LG/@MD/@SM/@XS are present on all tests
□ Commit and push
```

---

## 🎓 Full End-to-End Worked Example

### The Functional Test That Already Exists

From `src/tests/aviator-ai.spec.ts`:

```typescript
test('@P0 @Smoke should display Aviator page with header and navigation', async ({ page }) => {
    const module = new AviatorAiModule(page);
    await test.step('Navigate to Aviator page and verify title', async () => {
        await module.navigate('/aviator-ai', 'AI for Business & Enterprise AI Platform | OpenText');
    });
    await test.step('Verify main and secondary navigation are visible', async () => {
        await module.verifyMainHeader();
        await module.verifySecondaryAviatorNav();
    });
});
```

### The Derived Responsive Test

```typescript
import { test, expect } from '../fixtures';
import { AviatorAiModule } from '../modules/AviatorAiModule';
import menusData from '../testdata/menus.json';
import { ViewportConfig } from '../testdata/types';

const viewports = menusData.viewports as ViewportConfig[];

for (const vp of viewports) {
    test.describe(`@P0 @Regression @Responsive @Aviator @${vp.name.toUpperCase()} Aviator AI — ${vp.name.toUpperCase()} Viewport`, () => {
        test.slow();
        let aviatorModule: AviatorAiModule;

        test.use({ viewport: { width: vp.width, height: vp.height } });

        test.beforeEach(async ({ page }) => {
            aviatorModule = new AviatorAiModule(page);
            await page.goto('/aviator-ai');
            await page.waitForLoadState('domcontentloaded');
            // Accept cookies
            const acceptAll = page.getByRole('button', { name: /Accept All/i });
            if (await acceptAll.isVisible({ timeout: 1500 }).catch(() => false)) {
                await acceptAll.click().catch(() => {});
                await page.waitForTimeout(300);
            }
        });

        test(`should load Aviator page at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify Aviator loads at ${vp.width}px`, async () => {
                await aviatorModule.verifyMainHeader();
            });
        });

        test(`should display secondary nav correctly at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify secondary nav at ${vp.width}px`, async () => {
                await aviatorModule.verifySecondaryAviatorNav();
            });
        });

        // ─── Mobile/Tablet: hamburger menu ───
        if (vp.type === 'mobile' || vp.type === 'tablet') {
            test(`should show mobile navigation at ${vp.name.toUpperCase()}`, async ({ headerModule }) => {
                await test.step(`Verify hamburger at ${vp.width}px`, async () => {
                    await headerModule.verifyMobileResponsiveLayout();
                });
            });
        }

        // ─── Desktop: full navigation ───
        if (vp.type === 'desktop') {
            test(`should show full navigation at ${vp.name.toUpperCase()}`, async () => {
                await test.step(`Verify desktop nav at ${vp.width}px`, async () => {
                    await aviatorModule.verifyMainHeader();
                    await aviatorModule.verifyScrollBehaviorMainHeaderHides();
                });
            });
        }
    });
}
```

---

## 🚫 What the AI Agent Must NEVER Do in Responsive Tests

```
❌ DO NOT hardcode viewport sizes — always use menus.json viewports
❌ DO NOT assume viewport width — always check at runtime with page.evaluate()
❌ DO NOT use getByRole() for elements that may be hidden at some viewports — use CSS locators
❌ DO NOT skip cookie handling in beforeEach
❌ DO NOT forget test.slow() — responsive tests are resource intensive
❌ DO NOT duplicate module logic — always call existing module methods
❌ DO NOT write raw page.goto() — use module.navigate() or beforeEach setup
❌ DO NOT create responsive tests without the for-loop over viewports
❌ DO NOT forget viewport tags — @XL @LG @MD @SM @XS must be in describe block
```

---

## 🔧 Checklist Before Committing Responsive Tests

```
□ Read src/testdata/menus.json — all 5 viewports are being tested
□ Read src/tests/responsive*.spec.ts — no duplicate test names
□ Every test reuses module methods — no raw locator logic in spec
□ All tests follow the for-loop pattern over viewports
□ Tags are correct: @Responsive @{VIEWPORT} @{Feature}
□ test.slow() is present in every describe block
□ Cookie handling is in beforeEach
□ Mobile/tablet branching uses vp.type === 'mobile' || vp.type === 'tablet'
□ Desktop branching uses vp.type === 'desktop'
□ Run: npx playwright test responsive-<feature>.spec.ts --list → all tests listed
□ Confirm test count matches expected: tests_per_viewport × 5 = total
```

---

## 🗣️ Exact Command to Give the AI Agent

```
Process PROMPT_RESPONSIVE_AUTOMATION.md.

Generate responsive tests for the following functional spec:
- src/tests/[your-spec-file].spec.ts

Test cases to make responsive:
[paste the test case descriptions here]

Rules:
1. Read responsive.spec.ts for the existing pattern
2. Read menus.json for viewport breakpoints
3. Reuse module methods from src/modules/
4. Loop over all 5 viewports
5. Branch by vp.type for mobile/tablet vs desktop
6. Tag with @Responsive @{VIEWPORT}
7. Show me the full test list BEFORE writing code
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
| `src/testdata/menus.json` | Viewport breakpoints (XL/LG/MD/SM/XS) |
| `src/testdata/types.ts` | ViewportConfig type definition |
| `src/tests/responsive.spec.ts` | Existing pattern to follow |
| `src/tests/responsive-aviator.spec.ts` | Aviator responsive tests (if exists) |
| `src/modules/HeaderModule.ts` | Mobile/responsive layout verification methods |
| `src/modules/HomepageModule.ts` | Homepage verification methods |
| `src/modules/AviatorAiModule.ts` | Aviator AI verification methods |
| `src/modules/CustomerStoriesModule.ts` | Customer Stories verification methods |
| `src/modules/VisualModule.ts` | Visual snapshot capture methods |
| `src/fixtures/index.ts` | Available fixture names |
| `configs/percy.yml` | Percy viewport configuration |
