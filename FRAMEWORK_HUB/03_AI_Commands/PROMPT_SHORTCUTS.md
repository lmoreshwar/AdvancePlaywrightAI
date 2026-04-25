# 🧾 Prompt Shortcuts (Simple English)

This file is for **humans**.

Goal: you can **drag & drop this file** to the AI agent and then type a **1–3 line instruction**.

---

## 📚 Quick Reference — All Documents

### AI Prompt Files (Drag & Drop into AI Chat)

| Prompt File | Use When | Location |
|---|---|---|
| **PROMPT_NEW_AUTOMATION.md** | Creating new functional tests | `FRAMEWORK_HUB/03_AI_Commands/PROMPT_NEW_AUTOMATION.md` |
| **PROMPT_MODIFY_IMPROVE.md** | Updating/modifying existing tests | `FRAMEWORK_HUB/03_AI_Commands/PROMPT_MODIFY_IMPROVE.md` |
| **PROMPT_VISUAL_AUTOMATION.md** | Creating Percy visual snapshot tests | `FRAMEWORK_HUB/03_AI_Commands/PROMPT_VISUAL_AUTOMATION.md` |
| **PROMPT_RESPONSIVE_AUTOMATION.md** | Creating responsive viewport tests | `FRAMEWORK_HUB/03_AI_Commands/PROMPT_RESPONSIVE_AUTOMATION.md` |
| **PROMPT_DEBUG_REPORT.md** | Debugging/fixing test failures | `ai-debug-report/PROMPT_DEBUG_REPORT.md` |

### Execution Guides (Background Knowledge)

| Guide | Purpose | Location |
|---|---|---|
| **AI Automation Playbook** | Full end-to-end automation workflow (Phase 1–4) | `FRAMEWORK_HUB/02_Execution_Guides/AI_AUTOMATION_PLAYBOOK.md` |
| **Percy Approval Playbook** | Visual diff review — approve/reject rules | `FRAMEWORK_HUB/02_Execution_Guides/PERCY_APPROVAL_REVIEW_PLAYBOOK.md` |
| **Playwright CLI Enforcement** | CLI-first rules for DOM evidence | `FRAMEWORK_HUB/02_Execution_Guides/PLAYWRIGHT_CLI_ENFORCEMENT.md` |
| **Test Commands** | All local + BrowserStack execution commands | `FRAMEWORK_HUB/02_Execution_Guides/TEST_COMMANDS.md` |

### Framework Standards (Auto-Read by AI)

| Standard | Purpose | Location |
|---|---|---|
| **AGENTS.md** | Single source of truth for all AI behavior | `AGENTS.md` (project root) |
| **AI Coverage Standards** | RICE-POT, anti-hallucination, traceability rules | `FRAMEWORK_HUB/04_Framework_Standards/AI_COVERAGE_STANDARDS.md` |

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
- `FRAMEWORK_HUB/03_AI_Commands/PROMPT_RESPONSIVE_AUTOMATION.md` (create responsive viewport tests)
- The latest generated debug report: `ai-debug-report/PROMPT_DEBUG_REPORT.md`

Optionally attach execution guides for deeper context:
- `FRAMEWORK_HUB/02_Execution_Guides/AI_AUTOMATION_PLAYBOOK.md` (full automation workflow)
- `FRAMEWORK_HUB/02_Execution_Guides/PERCY_APPROVAL_REVIEW_PLAYBOOK.md` (visual diff review rules)
- `FRAMEWORK_HUB/02_Execution_Guides/PLAYWRIGHT_CLI_ENFORCEMENT.md` (CLI-first enforcement)
- `FRAMEWORK_HUB/02_Execution_Guides/TEST_COMMANDS.md` (run commands reference)

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

**Prompt file:** `PROMPT_NEW_AUTOMATION.md`  
**Execution guide:** `AI_AUTOMATION_PLAYBOOK.md` (Phase 1–4: Planning → CLI Exploration → Code Generation → Verification)  
**CLI rules:** `PLAYWRIGHT_CLI_ENFORCEMENT.md` (use `playwright-cli` for DOM evidence before writing locators)

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

**Prompt file:** `PROMPT_MODIFY_IMPROVE.md`  
**Execution guide:** `AI_AUTOMATION_PLAYBOOK.md` (follow same Phase 2–4 for validation)  
**CLI rules:** `PLAYWRIGHT_CLI_ENFORCEMENT.md` (use `playwright-cli` to validate locator changes)

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

**Prompt file:** `PROMPT_VISUAL_AUTOMATION.md`  
**Percy review:** `PERCY_APPROVAL_REVIEW_PLAYBOOK.md` (approve/reject rules for visual diffs)  
**CLI rules:** `PLAYWRIGHT_CLI_ENFORCEMENT.md` (use `playwright-cli` for DOM evidence before writing snapshot state setup)

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

## 3.5) 📐 Create Responsive Tests (Viewport Testing)

**Prompt file:** `PROMPT_RESPONSIVE_AUTOMATION.md`  
**Execution guide:** `AI_AUTOMATION_PLAYBOOK.md` (Responsive Testing Guardrail section)  
**CLI rules:** `PLAYWRIGHT_CLI_ENFORCEMENT.md` (use `playwright-cli snapshot` at multiple viewport sizes)

### Minimal prompt

```
Create responsive tests for src/tests/<YOUR_SPEC_FILE>.spec.ts.
Reference: PROMPT_RESPONSIVE_AUTOMATION.md (attached)
Show plan first before writing code.
```

### Better prompt

```
I finished functional spec: src/tests/<YOUR_SPEC_FILE>.spec.ts.
Derive responsive viewport tests that run across XL/LG/MD/SM/XS breakpoints.

Reference: PROMPT_RESPONSIVE_AUTOMATION.md (attached)
Show plan first (test list per viewport + total count) before writing code.
```

### Important rules (simple English)
- Responsive tests loop over all 5 viewports from menus.json
- Reuse module methods; do not duplicate navigation
- Branch by vp.type for mobile/tablet vs desktop behaviors
- Tag with @Responsive @{VIEWPORT} (e.g., @XL, @SM)
- Use test.slow() in every responsive describe block

---

## 4) 🔍 Debug Report → Root Cause → Fix

**Prompt file:** `PROMPT_DEBUG_REPORT.md` (auto-generated in `ai-debug-report/`)  
**Execution guide:** `AI_AUTOMATION_PLAYBOOK.md` (Phase 4: Local Verification)  
**CLI rules:** `PLAYWRIGHT_CLI_ENFORCEMENT.md` (reproduce → diagnose → fix → verify with `playwright-cli`)  
**Percy issues:** `PERCY_APPROVAL_REVIEW_PLAYBOOK.md` (if failures are visual diff related)

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
Use PROMPT_NEW_AUTOMATION.md + AI_AUTOMATION_PLAYBOOK.md.
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
Use PROMPT_VISUAL_AUTOMATION.md + PERCY_APPROVAL_REVIEW_PLAYBOOK.md.
Plan first.
```

### Responsive tests
```
Create responsive tests for src/tests/<spec>.spec.ts.
Use PROMPT_RESPONSIVE_AUTOMATION.md.
Plan first.
```

### Debug report
```
Fix failures from attached PROMPT_DEBUG_REPORT.md.
Use PLAYWRIGHT_CLI_ENFORCEMENT.md for CLI evidence.
Plan first.
```

### Percy review
```
Review the Percy build diffs.
Use PERCY_APPROVAL_REVIEW_PLAYBOOK.md for approve/reject rules.
```

---

## 🗺️ Decision Flowchart — Which Prompt + Guide Do I Use?

```
START → What do I want to do?
│
├── Create NEW tests from requirements/stories/test cases?
│   └── Attach: PROMPT_NEW_AUTOMATION.md
│       Also read: AI_AUTOMATION_PLAYBOOK.md, PLAYWRIGHT_CLI_ENFORCEMENT.md
│
├── UPDATE or MODIFY existing tests?
│   └── Attach: PROMPT_MODIFY_IMPROVE.md
│       Also read: PLAYWRIGHT_CLI_ENFORCEMENT.md
│
├── Create VISUAL (Percy snapshot) tests?
│   └── Attach: PROMPT_VISUAL_AUTOMATION.md
│       Also read: PERCY_APPROVAL_REVIEW_PLAYBOOK.md
│
├── Create RESPONSIVE (viewport) tests?
│   └── Attach: PROMPT_RESPONSIVE_AUTOMATION.md
│       Also read: AI_AUTOMATION_PLAYBOOK.md (Responsive Guardrail)
│
├── FIX test failures from debug report?
│   └── Attach: PROMPT_DEBUG_REPORT.md (from ai-debug-report/)
│       Also read: PLAYWRIGHT_CLI_ENFORCEMENT.md
│
├── REVIEW Percy visual diffs?
│   └── Read: PERCY_APPROVAL_REVIEW_PLAYBOOK.md
│
└── LOOK UP run commands (local / BrowserStack)?
    └── Read: TEST_COMMANDS.md
```

