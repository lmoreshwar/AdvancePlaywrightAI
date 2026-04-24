# 🚀 AI Test Automation: New User Onboarding Guide

Welcome to the **Enterprise Playwright AI Framework**. 

You do **not** need to know Playwright, TypeScript, or advanced framework architectures to automate tests here. The AI Agent handles the coding, architecture, and debugging based on our strict 100% test coverage rules. Your job is to provide clear requirements and supervise the execution.

Follow this exact flow to go from a manual test case to a fully automated, CI-ready script.

---

## 🟢 Step 1: Document Your Requirement
The AI needs a clear target. Choose ONE of the following methods:
### Method A: Formal Test Cases
Use this for strict, step-by-step test scenarios.
- **File**: `FRAMEWORK_HUB/01_Requirements/testcases.md`

### Method B: Agile User Stories
Use this for high-level, plain-English acceptance criteria. 
- **File**: `FRAMEWORK_HUB/01_Requirements/user_stories.md`

### Method C: Ad-Hoc Requirements
Provide a PRD or requirement document.
- **File**: `FRAMEWORK_HUB/01_Requirements/requirement.md`

---

## 🟢 Step 2: Trigger the Automation
You use "PROMPT" files to instruct the AI.

- **File**: `FRAMEWORK_HUB/03_AI_Commands/PROMPT_NEW_AUTOMATION.md`
- **Action**: Paste your test cases/requirements into this file.

Once filled out, open the chat with your AI Agent and type exactly this:
> *"Process PROMPT_NEW_AUTOMATION.md"*

---

## 🤖 What Happens Next? (The AI Magic)

Once you trigger the command, the AI Agent strictly follows this **RICE-POT & Anti-Hallucination Execution Flow**:

### 1. 🛑 RICE-POT & Anti-Hallucination Check (100% Coverage)
Before writing any code, the AI will extract verifiable facts from your requirements and generate a **100% Test Coverage Plan** (Positive, Negative, Boundary, Equivalence). It will present this to you to ensure no "hallucinated" features were added and no implicit requirements were missed.

### 2. 🔍 Research & Locating
The AI silently scans:
- Existing `src/pages/` to reuse element locators.
- Existing `src/modules/` to reuse setup workflows (like login or handling cookie banners).

### 3. 💻 Implementation (The 3-Layer Rule)
After determining the coverage, the AI will write the automation matching our strict Enterprise Architecture:
- Adds semantic element locators (`getByRole`) to the **Page Object**.
- Creates step-by-step logic and logging in the **Module Object**.
- Writes the test block and tags in the **Spec file**.

### 4. ✅ Auto-Verification & Playwright CLI
The AI will run tests using local `@playwright/cli` to verify its own work. If it fails, it will attempt to fix its code before informing you.

---

## 🔧 Step 3: Maintenance & Self-Healing

Application UIs change. If a test fails in the future:
1. **Check the bug report or logs** you received.
2. **Trigger the Fix:** Open `FRAMEWORK_HUB/03_AI_Commands/PROMPT_MODIFY_IMPROVE.md` and type:
> *"Process PROMPT_MODIFY_IMPROVE.md based on the failure for <Test Name>"*

The AI will perform an impact analysis, strictly following the Anti-Hallucination rules, surgically fix the broken locator without breaking other tests, and automatically re-verify the pipeline.

---
*Ready? Start by opening `FRAMEWORK_HUB/01_Requirements/testcases.md` and writing your first test!*
