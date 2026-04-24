# 🧾 Prompt Shortcuts (Simple English)

This file is for **humans**.

Goal: you can **drag & drop this file** to the AI agent and then type a **1–3 line instruction**.

---

## ✅ One Rule That Applies to Everything

Always add this line to your prompt:

- **"Show the plan first before writing code."**

Why: it forces the agent to list what it will change before it changes anything.

---

## 🧠 How to Use (Every Time)

### Step 1 — Attach the right reference file(s)

Attach ONE or more of these (drag & drop into chat):
- `FRAMEWORK_HUB/03_AI_Commands/PROMPT_NEW_AUTOMATION.md` (create new tests)
- `FRAMEWORK_HUB/03_AI_Commands/PROMPT_MODIFY_IMPROVE.md` (update/modify existing tests)
- `FRAMEWORK_HUB/03_AI_Commands/PROMPT_VISUAL_AUTOMATION.md` (create/extend visual tests)
- The latest generated debug report: `ai-debug-report/PROMPT_DEBUG_REPORT.md`

### Step 2 — Send a short instruction (simple English)

Use one of the templates below.

### Step 3 — Approve the plan

The agent must respond with:
- What files it will change
- What tests are affected
- The exact commands it will run to verify

You reply: **"Proceed"**.

---

## 1) 🆕 Create Functional Tests (New Automation)

### From Requirements (requirement.md)

```text
Review the attached requirement.md for: <Feature Name>.
Generate test cases ensuring 100% RICE-POT coverage, then automate them.
Reference: PROMPT_NEW_AUTOMATION.md (attached).
Show the plan first before writing code.
```

### From User Stories (user_stories.md)

```text
Review the attached user_stories.md for: <Feature Name>.
Generate test cases based on the acceptance criteria, then automate them.
Reference: PROMPT_NEW_AUTOMATION.md (attached).
Show the plan first before writing code.
```

### From Test Cases (testcases.md)

#### Minimal prompt

```text
Create functional tests for: <Test Case ID or Description>.
Reference: PROMPT_NEW_AUTOMATION.md (attached).
Show the plan first before writing code.
```

#### Better prompt (recommended)

```text
Create functional tests for the following test cases from testcases.md:
- <paste test case rows or plain English>

Reference: PROMPT_NEW_AUTOMATION.md (attached)
Project: desktop-chrome
BrowserStack: Yes
Tags: @P0 @Smoke

Show the plan first before writing code.
```

### What the agent should do
- Read existing Pages/Modules/Specs first
- Reuse locators + module methods
- Add only the missing pieces
- Run the new/affected tests

---

## 2) 🛠️ Update / Modify Existing Tests

### Minimal prompt

```
Update these existing tests:
- <file + what to change>

Reference: PROMPT_MODIFY_IMPROVE.md (attached)
Show the impact analysis + plan first before writing code.
```

### Example

```
Update src/pages/HeaderPage.ts locators for the header logo.
Update any broken tests that depend on that locator.

Reference: PROMPT_MODIFY_IMPROVE.md (attached)
Show the impact analysis + plan first before writing code.
```

---

## 3) 👁️ Create / Update Visual Tests (Percy)

### Minimal prompt (your preferred style)

```
Create visual tests for src/tests/<YOUR_SPEC_FILE>.spec.ts.
Reference: PROMPT_VISUAL_AUTOMATION.md (attached)
Show plan first before writing code.
```

### Better prompt

```
I finished functional spec: src/tests/<YOUR_SPEC_FILE>.spec.ts.
Derive visual tests into src/tests/visual.spec.ts based on those scenarios.

Reference: PROMPT_VISUAL_AUTOMATION.md (attached)
Show plan first (test names + snapshot names) before writing code.
```

### Important rules (simple English)
- Visual tests go ONLY in `src/tests/visual.spec.ts`
- No functional assertions inside visual tests
- Reuse module methods; do not duplicate navigation
- Interactive overlays should use `{ skipStabilization: true }`

---

## 4) 🔍 Debug Report → Root Cause → Fix

### Minimal prompt

```
Fix the failures in the attached PROMPT_DEBUG_REPORT.md.
Use playwright-cli for DOM evidence where needed.
Show the plan first before writing code.
```

### Better prompt (recommended)

```
Here is the latest ai-debug-report/PROMPT_DEBUG_REPORT.md (attached).

Do this:
1) Identify the top 1–2 root causes
2) Fix them with minimal changes
3) Re-run only the failed tests first
4) Update the debug report verdicts/suggestions if needed

Show the plan first before writing code.
```

### Notes
- If failures are **Environment Issue** (BrowserStack timeouts), don’t change product code.
- If failures are **Locator Change**, update the Page Object locators (Pages → Modules → Specs).
- If failures are **UI Bug**, label as DEFECT and provide clear evidence steps.

---

## 5) 🧩 Add a New Locator (Page Object change)

### Prompt

```
Add a new semantic locator in <PageObject>.ts for <element>.
Then update the module + spec to use it.

Show the plan first before writing code.
```

---

## 6) 🧯 Reduce Flakiness (Timeouts / Popups / CI)

### Prompt

```
These tests are flaky in CI:
- <test title(s)>

Goal: reduce flakiness without adding random waits.
Show plan first before writing code.
```

---

## ✅ What “Good Agent Output” Looks Like (You should demand this)

Before code changes:
- List impacted files + tests
- Show intended snapshot names (for visual)
- Show reproduce commands and verify commands

After code changes:
- Summary of what changed
- Exact commands run (repro → fix → verify)

---

## 🧾 Copy/Paste: Ultra-Short Prompts

### New tests
```
Create new tests for <requirement>.
Use PROMPT_NEW_AUTOMATION.md.
Plan first.
```

### Modify tests
```
Update <file> to <change>.
Use PROMPT_MODIFY_IMPROVE.md.
Plan + impact analysis first.
```

### Visual tests
```
Create visual tests for src/tests/<spec>.spec.ts.
Use PROMPT_VISUAL_AUTOMATION.md.
Plan first.
```

### Debug report
```
Fix failures from attached PROMPT_DEBUG_REPORT.md.
Use playwright-cli.
Plan first.
```

