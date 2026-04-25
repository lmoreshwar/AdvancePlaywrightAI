# 🤖 AI Test Automation — New Test Case Creation

## Goal: Automate New Test Cases from Requirements

## ✅ Quick Prompt (Simple English)

Attach this file and send a short prompt like:

```
Create functional tests for: <feature or test case>.
Reference: PROMPT_NEW_AUTOMATION.md (attached)
Show the plan first before writing code.
```

More examples: `FRAMEWORK_HUB/03_AI_Commands/PROMPT_SHORTCUTS.md`

**How to use**: Fill out the fields below, then tell the AI Agent:
> *"Process PROMPT_NEW_AUTOMATION.md"*

---

## 📋 1. Test Case Requirements

### Test Cases / User Stories / Requirements to Automate
<!-- Provide requirement, user story, or test case details. You can copy/paste or refer to testcases.md, user_stories.md, requirement.md -->
<!-- Example: "Automate TC-H09: Verify Products menu items are sorted A-Z" -->
<!-- Example: "Review requirement.md for the Aviator Page and automate all scenarios" -->

```
[PASTE YOUR REQUIREMENTS / STORIES / TEST CASES HERE]
```

### Source Reference
- **File**: `FRAMEWORK_HUB/01_Requirements/requirement.md`, `user_stories.md`, or `testcases.md`
- **Section**: [e.g. "Aviator Page", "Regression Test: Header"]

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

#### Rule 0: Anti-Hallucination & 100% Test Coverage Analysis (MANDATORY FIRST STEP)
```
Whenever requirements, user stories, or test cases are provided, BEFORE doing anything else, the AI MUST:

1. Read the framework's absolute source of truth at the project root: `AGENTS.md`.
2. Read the coverage standard: `FRAMEWORK_HUB/04_Framework_Standards/AI_COVERAGE_STANDARDS.md`.
3. Analyze the input requirements ensuring 0% hallucination:
  - Extract explicitly verified facts (UI elements, expected behavior, rules).
  - DO NOT invent features, error codes, defaults, or undocumented UI elements.
  - If information is missing, halt and list the unknown information.
4. NUMBER every requirement line (R1.1, R1.2, R2.1 …) and produce a TRACEABILITY TABLE:

   | Req #  | Requirement Statement (exact)         | TC-ID   | Status  |
   |--------|---------------------------------------|---------|---------|
   | R1.1   | Login button is visible               | TC-LGN01| Planned |
   | R1.2   | Error message shows on invalid login  | TC-LGN02| Planned |
   | ...    | ...                                   | ...     | ...     |

   ENFORCEMENT:
   - EVERY numbered requirement line MUST have at least one TC-ID.
   - If any line has no TC — STOP. Do not write code. Assign a TC first.
   - Do NOT merge two requirements into one TC silently. If merged, list BOTH req numbers.
   - Do NOT skip a requirement because it seems hard or similar to another.
   - Do NOT declare coverage based on a "section" label — each LINE must be individually mapped.

5. Gather CLI evidence for EVERY requirement involving UI interaction or DOM state:
  - Run `npx playwright-cli` snapshot / evaluate BEFORE writing any locator.
  - If evidence cannot be gathered, document it as UNKNOWN and do not invent the locator.

6. State ALOUD before writing any code:
   "Traceability confirmed: X requirements → Y test cases. 0 gaps."
   If you cannot state this truthfully — stop and fix the gaps first.
```

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
4. Update PROMPT_DEBUG_REPORT.md if any failures occur
5. Commit only after ALL tests pass
```

#### Rule 6: Register New Fixtures
```
If you create a NEW Page Object or Module:
1. Import it directly in src/fixtures/index.ts (barrel index.ts files do NOT exist — use direct paths)
   e.g. import { MyNewPage } from '../pages/MyNewPage'
2. Add its fixture to src/fixtures/index.ts
3. Add the fixture type to TestFixtures interface
```

#### Rule 8: Visual Tests
```
If the test case involves a visible UI component or state change, ALSO create a visual test.
Read FRAMEWORK_HUB/03_AI_Commands/PROMPT_VISUAL_AUTOMATION.md for the full visual test process.
All visual tests go in src/tests/visual.spec.ts ONLY — no separate visual spec files.
```

#### Rule 9: Spec File Formatting Standard (MANDATORY)
```
ALL test spec files MUST follow this exact pattern (see header.spec.ts as reference):

1. IMPORTS & DATA:
   import { test, expect } from '../fixtures';
   import { [Module] } from '../modules/[Module]';
   import data from '../testdata/data.json';

2. TEST DESCRIBE BLOCK:
   test.describe('@P0 @Regression @Feature Feature Regression', () => {
       let moduleInstance: [Module];

3. BEFOREEACH HOOK:
       test.beforeEach(async ({ page }) => {
           moduleInstance = new [Module](page);
           await moduleInstance.setupMethod();
           await page.waitForLoadState('networkidle');
       });

4. TEST STRUCTURE (for EACH test case):
   
   // ═══════════════════════════════════════
   // TC-[ID]: Test Case Description
   // ═══════════════════════════════════════
   test('@P0 @Smoke should [meaningful assertion]', async () => {
       await test.step('Step description', async () => {
           // Call module method or perform action
           const result = await moduleInstance.methodName();
           
           // Log for visibility
           console.log('Action result: ', result);
           
           // Assert using expect()
           expect(result).toBe(expectedValue);
       });
   });

MANDATORY RULES:
- ALWAYS use visual separators (═══════════════════════════════════════) between test cases
- ALWAYS map test cases to TC codes using the MODULE name prefix sequentially: TC-AV01, TC-AV02 … (never TC-A01, TC-L01, TC-MA01 — one prefix per spec file)
- ALWAYS use test.step() for each logical action/assertion group
- ALWAYS include console.log() for step tracking
- ALWAYS initialize module in beforeEach, NOT in each test
- ALWAYS use expect() for assertions
- NEVER use bare values — always log and validate
- NEVER create multiple test.describe() blocks in same file — use one parent suite per feature
- DO NOT mix responsive viewport tests — use src/tests/responsive-<feature>.spec.ts for that
```

#### Rule 10: 1-to-1 Requirement Traceability — ZERO GAP TOLERANCE (MANDATORY)
```
Every numbered item in the provided requirement, user story, or test case document
MUST be traced to AT LEAST one TC-ID before any code is written.

Mandatory Process:
1. NUMBER every requirement line/item (R1.1, R1.2, R2.1 etc.)
2. Build a FULL traceability table OUTPUT in chat BEFORE writing any code:
   | Req # | Requirement                        | TC-ID  | Status  | CLI Evidence |
   |-------|------------------------------------|--------|---------|--------------|
   | R1.10 | Login redirects to dashboard | TC-XX01| Planned | NEEDED       |
   | R1.2  | Error shown on invalid input       | TC-XX02| Planned | NEEDED       |
3. If ANY requirement line has no TC-ID → STOP. Assign a TC before proceeding.
4. DO NOT merge multiple requirements into one TC unless they are logically
   inseparable AND both are explicitly noted in that TC's description.
5. DO NOT skip a requirement because:
   - It seems hard to automate  → document it as manual-only in the table, but STILL create a TC shell
   - It is similar to another   → it still needs its own TC or an explicit written justification in the table
   - CLI evidence is missing    → STOP. Run playwright-cli snapshot/eval first. Never code from assumptions.
6. INTERACTIVE BEHAVIORS RULE (CRITICAL — most missed):
   Any requirement involving: hover, click, flip, video play, scroll, tab switch,
   accordion expand/collapse, carousel navigation → MUST have:
   a. CLI DOM snapshot evidence showing the element EXISTS on the page
   b. The actual CSS class / aria attribute / role that will be used as the locator
   c. Recorded BEFORE that TC is written
   If CLI evidence is missing for any interactive behavior → mark that row
   "CLI NEEDED" in the table and gather it before coding that TC.
7. TC-IDs MUST be sequential using the MODULE name only — no separate prefixes
   per page within the same spec:
   CORRECT:  TC-AV01, TC-AV02, TC-AV03 … TC-AV12  (all Aviator spec tests)
   WRONG:    TC-A01, TC-B01, TC-C01               (separate prefixes per page)
8. Self-Validation: After printing the full traceability table, state:
   "Traceability confirmed: X requirements → Y test cases. 0 gaps. 0 CLI-NEEDED rows."
   If ANY row still shows CLI-NEEDED → DO NOT proceed to coding.
```

#### Rule 11: Test Depth — Five Mandatory Validation Checks (MANDATORY)
```
Every test case MUST satisfy ALL FIVE of these depth checks.
A test that only partly validates a requirement is still a GAP.

D1. CONTENT COMPLETENESS
   When a requirement says a section has heading + description + CTA:
   - Assert ALL THREE individually (not just the heading).
   - Sub-elements listed in the requirement (eyebrow, title, description, image, CTA)
     are EACH a separate assertion line.
   - Checking only toBeVisible() on a heading while ignoring the sibling <p>
     description or CTA is a gap.

D2. REAL NAVIGATION
   When a requirement says "links should open correctly" / "navigate correctly":
   - MUST click at least ONE representative link.
   - MUST verify the resulting URL contains the expected path.
   - MUST navigate back to the original page.
   - getAttribute('href') alone is NOT sufficient for a navigation requirement.
   - href checks are acceptable only for SECONDARY links after click-navigate is proven.

D3. INTERACTION DEPTH
   For hover, flip, scroll, tab switch, accordion, carousel, or video play:
   - MUST perform the actual interaction (hover(), click(), scroll).
   - MUST assert the resulting state change (CSS class toggle, aria-expanded,
     transform, URL change, visible/hidden content panel).
   - Asserting a flip card WRAPPER exists ≠ verifying it FLIPS on hover.
   - Asserting an accordion BUTTON exists ≠ verifying it expands/collapses.

D4. COUNT ACCURACY
   When a requirement specifies exact counts ("1 featured + 4 regular cards"):
   - Assert exact or near-exact counts matching the requirement.
   - Using loose thresholds (≥2 when the requirement says 4) is a gap.
   - If live DOM count differs from requirement, document the discrepancy.

D5. SECTION COMPLETENESS
   Every interactive section (accordion, tabs, FAQ) MUST be fully exercised:
   - Accordion → expand + collapse at least one item.
   - Tabs → switch at least one tab and verify content change.
   - Just asserting the section heading is visible does NOT satisfy the requirement.

SELF-CHECK BEFORE DECLARING COVERAGE COMPLETE:
   For each TC, answer all five:
   [D1] Did I validate ALL sub-elements listed in the requirement?   YES / NO
   [D2] Did I click-navigate at least one link (not just href)?      YES / NO
   [D3] Did I trigger the interaction and assert state change?       YES / NO
   [D4] Are my count thresholds matching the requirement numbers?    YES / NO
   [D5] Did I exercise every interactive widget (not just see it)?   YES / NO
   If ANY answer is NO → the TC is incomplete. Fix before proceeding.
```

#### Rule 12: Viewport-Resilient Coding (MANDATORY)
```
BrowserStack, CI runners, and different Playwright projects run tests at different
viewport sizes. The effective viewport may NOT match what you see locally.
Every functional test MUST be resilient across all possible viewports.

1. VIEWPORT-AWARE LOCATORS:
   - If an element is ONLY visible above a certain breakpoint (e.g., desktop nav
     links hidden on mobile behind a hamburger toggle), the Module method MUST
     query the runtime viewport and branch:

     const vpWidth = await this.page.evaluate(() => window.innerWidth);
     if (vpWidth >= 1376) {
         // XL desktop: links are expanded and visible
         await expect(this.page.locator('.nav-link')).toBeVisible();
     } else {
         // Below XL: hamburger toggle is shown instead
         await expect(this.page.getByRole('button', { name: /Toggle/i })).toBeVisible();
     }

   - NEVER assume a specific viewport. Always detect at runtime.

2. DOM-BASED vs ROLE-BASED LOCATORS FOR HIDDEN ELEMENTS:
   - getByRole() only returns elements visible in the accessibility tree.
     Hidden elements (display:none, visibility:hidden, aria-hidden) are EXCLUDED.
   - If you need to count or interact with elements that may be hidden at some
     viewports (e.g., nav links behind a collapsed hamburger), use CSS locators:
     CORRECT: this.page.locator('nav.navbar-secondary a[href]')  — finds all links in DOM
     WRONG:   this.secondaryNav().getByRole('link')               — returns 0 if links are hidden
   - Use getByRole() for visible-only assertions.
   - Use locator() with CSS for DOM-presence or count assertions.

3. BREAKPOINT REFERENCE TABLE:
   | Breakpoint | Min Width | CSS Class Suffix | Viewport Project   |
   |------------|-----------|------------------|--------------------|  
   | XL         | ≥ 1376px  | -xl              | viewport-xl        |
   | LG         | ≥ 968px   | -lg              | viewport-lg        |
   | MD         | ≥ 720px   | -md              | viewport-md        |
   | SM         | ≥ 576px   | -sm              | viewport-sm        |
   | XS         | ≥ 440px   | -xs              | viewport-xs        |

4. BROWSERSTACK VIEWPORT CAVEAT:
   BrowserStack sessions may have a smaller effective viewport than the
   resolution in browserstack.yml (e.g., 1920x1080 resolution does NOT mean
   1920px wide viewport — OS chrome, taskbar, and DevTools reduce it).
   Always code defensively — never hardcode viewport assumptions.

5. CLI EVIDENCE AT MULTIPLE VIEWPORTS:
   When a page has responsive elements (hamburger, collapsible nav, show/hide
   sections), run playwright-cli snapshot at BOTH desktop AND a smaller viewport
   before writing locators:
     playwright-cli resize 1440 900
     playwright-cli snapshot --depth=4
     playwright-cli resize 1024 768
     playwright-cli snapshot --depth=4
   Document which elements appear/disappear at each breakpoint.

6. TOGGLE-BEFORE-INTERACT PATTERN:
   When a Module method needs to click links inside a collapsible section
   (e.g., secondary nav links), it MUST expand the section first at smaller viewports:

     const vpWidth = await this.page.evaluate(() => window.innerWidth);
     if (vpWidth < 1376) {
         const toggle = this.aviatorAiPage.secondaryToggle();
         if (await toggle.isVisible({ timeout: 2000 }).catch(() => false)) {
             await toggle.click();
             await this.page.waitForTimeout(500);
         }
     }
```

#### Rule 13: Console Error Resilience for Cloud/CI Environments (MANDATORY)
```
Cloud environments (BrowserStack, GitHub Actions, Jenkins) route traffic through
proxies and tunnels. Third-party scripts (analytics, chat widgets, marketing pixels)
frequently fail with network errors that NEVER appear locally.

Every assertNoUnexpectedConsoleErrors() method MUST include ignore patterns for:

1. NETWORK/TUNNEL ERRORS (appear in BrowserStack due to proxy):
   /ERR_TUNNEL_CONNECTION_FAILED/i
   /ERR_CONNECTION_RESET/i
   /ERR_NAME_NOT_RESOLVED/i
   /ERR_FAILED/i

2. THIRD-PARTY SERVICE FAILURES:
   /qualified\.com/i              — Qualified chat widget
   /go-mpulse\.net/i              — Akamai mPulse
   /clarity\.ms/i                 — Microsoft Clarity
   /px\.ads\.linkedin\.com/i      — LinkedIn pixel
   /wisepops/i                    — WisePops marketing
   /insitez\.blob\.core/i         — InSiteZ analytics
   /WebSocket.*failed/i           — WebSocket handshake failures
   /Unexpected response code/i    — WebSocket proxy rejects

3. CMS/FRAMEWORK NOISE:
   /Prohibited read from data layer/i  — GTM data layer conflicts
   /Failed to fetch/i                  — Generic fetch failures (CDN)
   /bp-aviator-scenario-library/i      — CMS script load failures

When creating a NEW module with console error assertions, ALWAYS copy the full
ignore list from an existing module (e.g., AviatorAiModule.ts) as the baseline.
Never start with an empty ignore list.
```

#### Rule 7: Responsive Test Case Routing
```
When analyzing test cases, decide where they belong BEFORE writing code:
- Functional/Business Logic (e.g. data validation, forms) → Add to specific feature specs (e.g. header.spec.ts). DO NOT run these on multiple viewports unless explicitly asked.
- Responsive Layout Logic (e.g. padding checking, mobile menus, breakpoints, elements shrinking/hiding across XL/LG/MD/SM/XS) → Add ONLY to src/tests/responsive-<feature>.spec.ts (e.g. responsive-homepage.spec.ts) inside the viewport loop.
```

---

## 📁 4. Existing File Map (AI: Read These First!)

> **MAINTENANCE RULE (AUTO-UPDATE — MANDATORY)**: Whenever the AI creates a NEW\n> Page, Module, Spec, Util, or TestData file, it **MUST** add a row to this table\n> in the same edit session. This map must always reflect the actual files in `src/`.\n> If you find a file in the project that is not listed here, add it before proceeding.\n> **Failure to update this table when creating a new file is a rule violation\n> equivalent to forgetting to register a fixture.**\n> The AI must ALSO update the matching table in `PROMPT_MODIFY_IMPROVE.md` Section 4.

| Layer | File | Contains |
|---|---|---|
| **Config** | `src/config/index.ts` | baseUrl, defaultTimeout, navigationTimeout, environment config |
| **Fixtures** | `src/fixtures/index.ts` | All test fixtures + global popup handlers |
| **Pages** | `src/pages/HeaderPage.ts` | Header locators (logo, nav, menus, search, language, contact) |
| **Pages** | `src/pages/HomepagePage.ts` | Homepage component locators (hero, cards, sections) |
| **Pages** | `src/pages/FooterPage.ts` | Footer locators (links, navigation, social) |
| **Pages** | `src/pages/CustomerStoriesPage.ts` | Customer Stories page locators (filters, cards, pagination) |
| **Pages** | `src/pages/AviatorAiPage.ts` | Aviator AI page locators (hero, secondary nav, bento, flip cards, FAQ, Limitless, MyAviator) |
| **Modules** | `src/modules/HeaderModule.ts` | Header workflows (navigate, verify menus, language switcher) |
| **Modules** | `src/modules/HomepageModule.ts` | Homepage workflows (hero, components) |
| **Modules** | `src/modules/CustomerStoriesModule.ts` | Customer Stories workflows (filters, pagination, cards) |
| **Modules** | `src/modules/AviatorAiModule.ts` | Aviator AI workflows (hero, bento, Scenario Library, Limitless, MyAviator) |
| **Modules** | `src/modules/VisualModule.ts` | Percy visual regression snapshot capture module |
| **Tests** | `src/tests/header.spec.ts` | 7 header tests (smoke + regression) |
| **Tests** | `src/tests/homepage.spec.ts` | Homepage component tests |
| **Tests** | `src/tests/responsive-homepage.spec.ts` | Homepage responsive tests across 5 viewports (XL/LG/MD/SM/XS) |
| **Tests** | `src/tests/customer-stories.spec.ts` | 4 Customer Stories regression tests |
| **Tests** | `src/tests/aviator-ai.spec.ts` | 10 Aviator AI regression tests (3 sub-pages: Aviator, Limitless, MyAviator) |
| **Tests** | `src/tests/responsive-aviator.spec.ts` | 55 Aviator AI responsive tests across 5 viewports (3 sub-pages) |
| **Tests** | `src/tests/visual.spec.ts` | 26 Percy visual regression snapshot tests (homepage, header, footer, customer stories, aviator) |
| **TestData** | `src/testdata/menus.json` | Menu items, headers, viewport configuration data |
| **TestData** | `src/testdata/types.ts` | TypeScript type definitions for test data |
| **Utils** | `src/utils/SmartLocator.ts` | Self-healing locator utility |
| **Utils** | `src/utils/Logger.ts` | Step-based logger |
| **Utils** | `src/utils/AiDebugReporter.ts` | Playwright reporter generating AI debug reports |
| **Utils** | `src/utils/WindowHelper.ts` | Multi-tab/window browser management |
| **Utils** | `src/utils/WaitHelper.ts` | Custom waits and retry logic |
| **Utils** | `src/utils/StringHelper.ts` | Text parsing and sanitization |
| **Utils** | `src/utils/IframeHelper.ts` | Cross-domain iframe interactions |
| **Utils** | `src/utils/FileHelper.ts` | File upload/download automation |
| **Utils** | `src/utils/DataGenerator.ts` | Random test data generation |

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

