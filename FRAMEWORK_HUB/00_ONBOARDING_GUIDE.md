# 🚀 AI Test Automation: New User Onboarding Guide

Welcome to the **OpenText Playwright AI Framework**. 

You do **not** need to know Playwright, TypeScript, or advanced framework architectures to automate tests here. The AI Agent handles the coding, architecture, and debugging. Your job is to provide clear requirements and supervise the execution.

Follow this exact flow to go from a manual test case to a fully automated, CI-ready script.

---

## 🟢 Step 1: Document Your Requirement
The AI needs a clear target. We use a **3-Tier Input System** depending on how formal your requirements are. Choose ONE of the following methods:

### Method A: Formal Test Cases
Use this for strict, step-by-step test scenarios (e.g., exported from Jira/ALM).
- **File**: `FRAMEWORK_HUB/01_Requirements/testcases.md`

### Method B: Agile User Stories
Use this for high-level, plain-English acceptance criteria. 
- **File**: `FRAMEWORK_HUB/01_Requirements/user_stories.md`
- **Example**: *"As a user, clicking 'Support' on the homepage should open a dropdown where I can click 'Contact'."*

### Method C: Ad-Hoc Command (No File Needed)
If you just want to instruct the AI directly without saving a document, you can paste your plain English requirements directly into the AI prompt (Step 2).


---

## 🟢 Step 2: Trigger the Automation
You use "AIC (AI Command) Prompts" to instruct the AI.

- **File**: `FRAMEWORK_HUB/03_AI_Commands/AIC_NEW_AUTOMATION.md`
- **Action**: Paste your test cases into Sections 1 and 2 of this file.

Once filled out, open the chat with your AI Agent and type exactly this:
> *"Process AIC_NEW_AUTOMATION.md"*

---

## 🤖 What Happens Next? (The AI Magic)

Once you trigger the command, sit back. The AI Agent strictly follows this **Anti-Hallucination Execution Flow**:

### 1. 🛑 Validation Gatecheck
If your instructions are missing crucial data (like expected results or execution priority), **the AI will stop and ask you for clarification**. It will never guess business logic.

### 2. 🔍 Research & Locating
Before writing a single line of code, the AI silently scans:
- Existing `src/pages/` to reuse existing element locators.
- Existing `src/modules/` to reuse setup workflows (like login or handling cookie banners).

### 3. 🤔 The Hard Pause (Implementation Plan)
**CRITICAL RULE:** By default, the AI will generate an `implementation_plan.md` mapping out the new Page Objects, Modules, and Spec files. **The AI is strictly blocked from generating code** until the User explicitly reviews and approves the plan.

### 4. 🛠️ Playwright CLI (Local Dev Only)
To extract complex DOM locators without relying on high-token MCP server calls, we rely on local inspection or the local `@playwright/cli`. **The AI will NEVER use the MCP browser server for DOM extraction**, preserving token limits and stabilizing execution.

### 5. 💻 Implementation (The 3-Layer Rule)
Only *after* the Implementation Plan is approved, the AI will write the automation matching our strict Enterprise Architecture:
- Adds semantic element locators (`getByRole`) to the **Page Object**.
- Creates step-by-step logic and logging in the **Module Object**.
- Writes the test block and tags in the **Spec file**.

### 6. ✅ Auto-Verification
The AI will run it locally on your machine (`npx playwright test`). If it fails, the AI will auto-read the error console and fix its code before informing you. 

---

## 🐞 Step 3: What if a test fails in the future? (Self-Healing)

Application UIs change. If a test fails in the CI pipeline tomorrow:

1. **Check the Report:** Go to `ai-debug-report/AIC_DEBUG_REPORT.md`. The framework automatically categorizes the failure (e.g., *Locator Change* vs *Script Issue*).
2. **Trigger the Fix:** Open `FRAMEWORK_HUB/03_AI_Commands/AIC_MODIFY_IMPROVE.md` and type:
> *"Process AIC_MODIFY_IMPROVE.md based on the failure for Contact Support in AIC_DEBUG_REPORT.md"*

The AI will perform an impact analysis, surgically fix the broken locator or logic without breaking other viewports, and automatically re-verify the pipeline.

---
*Ready? Start by opening `FRAMEWORK_HUB/01_Requirements/testcases.md` and writing your first test!*
