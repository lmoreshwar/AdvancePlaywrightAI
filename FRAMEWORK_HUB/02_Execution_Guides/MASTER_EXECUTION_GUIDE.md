# 🤖 AI Test Automation Playbook

**Project:** OpenText Playwright Framework  
**Toolset:** Playwright, `@playwright/cli`, AI Coding Agents (Cursor, Claude Code, Gemini, etc.)

This document is the official, tracked procedure for converting manual test cases (from `01_Requirements/testcases.md` or Excel spreadsheets) into robust Playwright automation scripts using the `@playwright/cli` AI skills.

## ✅ Quick Prompt (Simple English)

Attach the relevant workflow file (recommended):
- `FRAMEWORK_HUB/03_AI_Commands/PROMPT_NEW_AUTOMATION.md` for new tests
- `FRAMEWORK_HUB/03_AI_Commands/PROMPT_MODIFY_IMPROVE.md` for updates
- `FRAMEWORK_HUB/03_AI_Commands/PROMPT_VISUAL_AUTOMATION.md` for visual tests

Then send a short prompt like:

```
Automate this test case from testcases.md: <paste the row or plain English>.
Use playwright-cli for DOM evidence.
Show the plan first before writing code.
```

More examples: `FRAMEWORK_HUB/03_AI_Commands/PROMPT_SHORTCUTS.md`

---

## 📋 The Goal
To create a predictable, standard, and highly tracked pipeline where an AI agent can read a manual test case and autonomously (or semi-autonomously) generate production-ready code in our 3-layer architecture (Pages → Modules → Tests).

---

## 🚦 Phase 1: Preparation & Planning

Before executing any commands, the AI or Engineer must define the scope of the test.

1. **Read the Source:** Pick the target test case from `FRAMEWORK_HUB/01_Requirements/testcases.md` or the provided Excel file.
2. **Breakdown Steps:** Identify the UI actions (e.g., Navigate, Hover, Click, Verify text).
3. **Trace the Architecture:** 
   - Which Page Object needs updating? (e.g., `HeaderPage.ts`)
   - Which Module handles this business logic? (e.g., `HeaderModule.ts`)
   - Which Spec file represents the test suite? (e.g., `header.spec.ts`)

---

## 🔍 Phase 2: AI Exploration via `@playwright/cli`

The AI agent will use the Playwright CLI to understand the live DOM and test the flow without writing brittle code blindly.

**1. Launch the Context**
The agent opens the browser to the exact page needed.
```bash
npx playwright-cli open https://www.opentext.com --headed
```

**2. Snapshot the Accessibility Tree**
Instead of inspecting HTML manually, the agent captures the accessibility DOM which identifies elements exactly as the user (and Playwright) sees them:
```bash
npx playwright-cli snapshot
```
*Output Example: `e12 [link, name="Products"]`*

**3. Execute the Manual Steps (Iterative)**
The AI mimics the test steps using the CLI to ensure the flow is correct.
```bash
npx playwright-cli hover e12
npx playwright-cli snapshot     # Snapshot again to see the newly opened dropdown
npx playwright-cli click e15    # Click a submenu item
```

**4. Capture Assertions**
The AI verifies that the correct elements are visible after an action.
```bash
npx playwright-cli snapshot e20 # Look at the specific results component
```

**5. Clean up**
```bash
npx playwright-cli close
```

> **Why this matters:** By interacting through the CLI first, the AI validates that the target elements are visible and interactive *before* generating the actual code, preventing flaky and failing tests.

---

## ⚙️ Phase 3: Code Generation & Integration

Once the flow is proven via the CLI, the AI translates those steps into the framework.

### 1. Update the Page Object (Layer 1)
Translate the CLI locators into Playwright `getBy` queries in the respective `Page.ts` file. 
*Always use semantic locators.*
```typescript
// src/pages/HeaderPage.ts
productsMenu = () => this.page.getByRole('link', { name: 'Products' });
```

### 2. Update the Business Module (Layer 2)
Combine the Page Object actions into a logical, logged workflow. Incorporate the `WaitHelper` if dynamic loading is involved.
```typescript
// src/modules/HeaderModule.ts
async navigateToProducts(): Promise<void> {
    this.logger.step(1, 'Hover over Products Menu');
    await this.headerPage.productsMenu().hover();
    
    this.logger.step(2, 'Verify products dropdown is visible');
    await expect(this.headerPage.productsDropdown()).toBeVisible();
}
```

### 3. Write the Test Spec (Layer 3)
Map the test directly back to the original test case ID from the Excel/Markdown document. Tag it properly for CI execution.

**IMPORTANT:** All spec files MUST follow the formatting standard in `PROMPT_NEW_AUTOMATION.md` → **Rule 9: Spec File Formatting Standard**. Reference `src/tests/header.spec.ts` as the canonical example.

```typescript
// src/tests/header.spec.ts
test('@P1 @Regression TC-H09: User can navigate to Products menu', async ({ headerModule }) => {
    await test.step('Navigate to products', async () => {
        await headerModule.navigateToProducts();
    });
});
```

---

## 🧪 Phase 4: Local Verification

The AI must verify that the script executes correctly headlessly before concluding the task.

1. **Run the specific test:**
   ```bash
   npx playwright test src/tests/header.spec.ts -g "TC-H09"
   ```
2. **Verify the AI HTML Report:** Ensure the custom reporter logged all the steps correctly.
3. **Commit Code:** Once passed, the code should be committed referencing the original test case ID.

---

## 🛡️ Responsive Testing Guardrail

To prevent test suite bloat and redundant execution, follow these strict rules for responsive testing:

1. **Functional-First**: All new features must first be automated as functional tests on `desktop-chrome`.
2. **Necessity-Based Responsive Layering**: Do NOT add tests to `responsive-<feature>.spec.ts` or create responsive suites unless:
   - The UI undergoes a **major structural change** (e.g., desktop sidebar becomes a mobile hamburger/modal).
   - The feature is **inherently mobile-first** or has specific responsive requirements in the user story.
   - A **breakpoint-specific bug** was discovered during research that functional tests cannot catch.
3. **Avoid Pure Layout Checks**: Do not automate "pixel-perfect" padding checks across all 5 viewports unless explicitly requested, as these are brittle and high-maintenance.

---

## 📝 Example Prompt to give to the AI Agent (Cursor/Claude Code)

To start automating a specific test case, you can paste this exact prompt to your AI assistant:

> "I want to automate test case **[TC-ID]** from `FRAMEWORK_HUB/01_Requirements/testcases.md`. 
> 
> Please strictly follow the process in `FRAMEWORK_HUB/02_Execution_Guides/MASTER_EXECUTION_GUIDE.md`:
> 1. Start by using `npx playwright-cli open https://www.opentext.com`
> 2. Use `snapshot` to find the exact accessibility locators. DO NOT guess HTML classes.
> 3. Perform the test flow using `click`, `hover`, etc. in the CLI.
> 4. Once verified, update the Page Object, Module, and Spec files.
> 5. Run the new test and confirm it passes."


---


# Percy Approval/Reject Playbook

Use this playbook for every Percy build so approvals are consistent and fast.

## 1) Source of Truth

- Primary: Percy build UI (snapshot-level visual diff review).
- Secondary: GitHub Actions logs + `visual-ai-report` artifact (run/debug details only).

If Percy and logs look different, trust Percy for visual decisions.

## 2) Quick Diff Percentage Guide

There is no universal hard cutoff, but use these practical ranges:

- `0%`: perfect match.
- `0.01% - 0.10%`: usually tiny rendering noise, still inspect quickly.
- `0.10% - 0.50%`: careful review needed.
- `>0.50%`: likely meaningful change.
- `~1.00%+`: usually significant unless limited to known dynamic overlays.

Important: location of the diff matters more than percentage alone.

## 3) Approve vs Reject Rules

Approve when all changed snapshots are one of these:
- Expected feature/UI update (intended change in story/requirement).
- Known dynamic noise only (chat widget, cookie banner, summit promo, region popup, floating ad/media widget).
- Minor anti-aliasing/font/rendering change with no layout/content shift.

Reject when any changed snapshot includes:
- Unintended movement in core UI (header/nav/hero/main content/footer/cards/forms).
- Missing or broken content (text, image, CTA, alignment, spacing, clipping).
- New unexpected modal/overlay covering content.
- Change not explained by requirement/release intent.

## 4) 60-Second Review Checklist

For each `Changed` or `New` snapshot:

1. Open overlay mode and locate where pixels changed.
2. Classify diff area:
   - Core UI area -> strict check.
   - Dynamic widget/popup area -> likely ignore/noise.
3. Ask: "Is this expected by current change?"
4. Decide:
   - Expected/noise only -> keep for approval.
   - Unexpected core UI impact -> reject and fix.

Build-level decision:
- All changed snapshots expected/noise -> Approve build.
- Any unexpected core UI regression -> Reject/fix/rerun.

## 5) Known OpenText Noise Areas (Current Project)

Treat these as noise if isolated to their containers:
- Cookie consent banner (`onetrust`/cookie selectors).
- OT Agent/chat assistant widget.
- OpenText Summit promo/floating campaign widgets.
- Region selection popup and related floating UI.
- Bottom floating media/images/widgets that appear intermittently.

If these repeatedly create diffs, hide them in Percy CSS and pre-snapshot stabilization.

## 6) Standard Team Policy (Recommended)

- Smoke pages (critical landing/header/footer/contact): reject on any unexpected core UI diff.
- Non-critical/regression pages: allow tiny noise if isolated to known dynamic zones.
- Require one reviewer to confirm "expected vs unexpected" before approval.
- Re-run once after approval when large baseline updates were introduced.

## 7) What to Share for Fast Triage

When asking for script updates, share:
- Percy build URL.
- Snapshot names with highest diffs.
- One screenshot per problematic snapshot (side-by-side or overlay).
- GitHub Actions run URL if execution issue is suspected.

This is enough to quickly add stable selectors and reduce false positives.


---


# Playwright CLI Enforcement

> **Platform-neutral rule** — applies to all AI coding agents (GitHub Copilot, Cursor, Claude Code, Gemini, etc.)

Use `@playwright/cli` as the primary execution and remediation tool for all prompt-driven workflows in this repository.

## Applies to

- `PROMPT_DEBUG_REPORT`
- `PROMPT_MODIFY_IMPROVE`
- `PROMPT_NEW_AUTOMATION`

## Required behavior

- Use `playwright-cli` / `npx playwright-cli` commands for browser inspection, locator validation, and UI-driven troubleshooting.
- Prefer targeted test execution and validation via Playwright CLI-compatible flows.
- When generating or applying fixes from prompt-generated debug reports, keep actions grounded in Playwright CLI evidence (snapshot, trace, DOM verification).

## Prohibited behavior

- Do not use MCP-based browser automation flows when handling debug report analysis or fixes.
- Do not claim runtime self-healing unless a concrete code fix or validated fallback has been applied.

## Output expectation

- Provide clear Playwright CLI commands used (or to run) for reproduce -> diagnose -> fix -> verify.
- Scope reruns to failed test cases first before any broader run.


---


# Test Execution Commands Reference

Use this guide to run your tests in different environments and configurations.

## 1. Local Testing
Runs tests on your local machine using the configurations in `playwright.config.ts`.

| Goal | Command |
| :--- | :--- |
| **Run all tests** (Headless) | `npx playwright test` |
| **Run in Headed mode** (Visible) | `npx playwright test --headed` |
| **Run a specific test file** | `npx playwright test src/tests/header.spec.ts` |
| **Run a specific project** | `npx playwright test --project=desktop-chrome` |
| **Run a specific breakpoint** | `npx playwright test --project=viewport-xs` |
| **Open Playwright Inspector** | `npx playwright test --debug` |
| **Open Last Report** | `npx playwright show-report` |

## 2. BrowserStack Cloud Testing
Runs tests on the BrowserStack grid using `browserstack.yml` for infrastructure and `playwright.config.ts` for logic.

| Goal | Command |
| :--- | :--- |
| **Run all tests on BrowserStack** | `npm run test:bstack` |
| **Run specific file on BS** | `npm run test:bstack -- src/tests/header.spec.ts` |
| **Run tagged tests on BS** | `npm run test:bstack -- --grep @Smoke` |
| **Force 1 worker on BS** | `npm run test:bstack -- --workers=1` |

## 3. Useful Shortcuts
| Goal | Command |
| :--- | :--- |
| **Install/Update Playwright** | `npx playwright install` |
| **Check Playwright version** | `npx playwright --version` |
| **Clear old reports/logs** | `rm -rf test-results/ log/ ai-debug-report/` |

---

### Tips for "Proper" Framework Usage:
- **Project Names**: Valid project names are defined in `playwright.config.ts` and apply to local runs.
- **BrowserStack Targets**: Use `configs/browserstack.yml` or workflow inputs to control browser/device targets.
- **Combining Flags**: You can combine filters, for example:
   `npm run test:bstack -- src/tests/header.spec.ts --grep @Responsive`
   *(This runs only the Header test on the BrowserStack cloud, filtered by the Responsive tag).* 

