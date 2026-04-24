# 🤖 AI Test Automation Playbook

**Project:** OpenText Playwright Framework  
**Toolset:** Playwright, `@playwright/cli`, AI Coding Agents (Cursor, Claude Code, Gemini, etc.)

This document is the official, tracked procedure for converting manual test cases (from `01_Requirements/testcases.md` or Excel spreadsheets) into robust Playwright automation scripts using the `@playwright/cli` AI skills.

## ✅ Quick Prompt (Simple English)

Attach the relevant workflow file (recommended):
- `FRAMEWORK_HUB/03_AI_Commands/AIC_NEW_AUTOMATION.md` for new tests
- `FRAMEWORK_HUB/03_AI_Commands/AIC_MODIFY_IMPROVE.md` for updates
- `FRAMEWORK_HUB/03_AI_Commands/AIC_VISUAL_AUTOMATION.md` for visual tests

Then send a short prompt like:

```
Automate this test case from testcases.md: <paste the row or plain English>.
Use playwright-cli for DOM evidence.
Show the plan first before writing code.
```

More examples: `FRAMEWORK_HUB/03_AI_Commands/AIC_PROMPT_SHORTCUTS.md`

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
2. **Necessity-Based Responsive Layering**: Do NOT add tests to `responsive.spec.ts` or create responsive suites unless:
   - The UI undergoes a **major structural change** (e.g., desktop sidebar becomes a mobile hamburger/modal).
   - The feature is **inherently mobile-first** or has specific responsive requirements in the user story.
   - A **breakpoint-specific bug** was discovered during research that functional tests cannot catch.
3. **Avoid Pure Layout Checks**: Do not automate "pixel-perfect" padding checks across all 5 viewports unless explicitly requested, as these are brittle and high-maintenance.

---

## 📝 Example Prompt to give to the AI Agent (Cursor/Claude Code)

To start automating a specific test case, you can paste this exact prompt to your AI assistant:

> "I want to automate test case **[TC-ID]** from `FRAMEWORK_HUB/01_Requirements/testcases.md`. 
> 
> Please strictly follow the process in `FRAMEWORK_HUB/02_Execution_Guides/AI_AUTOMATION_PLAYBOOK.md`:
> 1. Start by using `npx playwright-cli open https://www.opentext.com`
> 2. Use `snapshot` to find the exact accessibility locators. DO NOT guess HTML classes.
> 3. Perform the test flow using `click`, `hover`, etc. in the CLI.
> 4. Once verified, update the Page Object, Module, and Spec files.
> 5. Run the new test and confirm it passes."
