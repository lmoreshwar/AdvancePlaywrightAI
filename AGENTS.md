# Repository AI Instructions

This is the single source of truth for AI-agent behavior in this repository.
It is intentionally platform-neutral and applies to Cursor, GitHub Copilot, VS Code agents, and other coding assistants.

## Scope

Applies to these automation workflows:

- `PROMPT_DEBUG_REPORT.md`
- `PROMPT_MODIFY_IMPROVE.md`
- `PROMPT_NEW_AUTOMATION.md`
- `PROMPT_VISUAL_AUTOMATION.md`

## Requirement Analysis & Test Coverage Standard (MANDATORY)

- **Read the Definitions FIRST**: The overarching definitions for these rules are located in `FRAMEWORK_HUB/04_Framework_Standards/AI_COVERAGE_STANDARDS.md`. The AI must refer to this file if it needs a refresher on the strict parameters of RICE-POT or Anti-Hallucination.
- **100% Test Coverage:** When provided with requirements, user stories, or test case documents, the AI must actively ensure 100% coverage before generating code. Every widget, state, and edge case in the requirement must have a planned test case.
- **RICE-POT Method:** Always adopt the RICE-POT enterprise-grade test analysis model (Role, Intent, Context, Expected Output - Parameters, Output Format, Task). Generate a structured breakdown of Positive, Negative, Boundary, and Equivalence test scenarios.
- **Anti-Hallucination Protocol:** 
  1. Extract verifiable facts ONLY.
  2. Do not invent missing features, defaults, or UI locators.
  3. Explicitly document any missing/unknown details.
  4. Output must be deterministic and directly mapped to the provided input.
- **LINE-BY-LINE Traceability (MANDATORY — this is why "section coverage" is NOT enough):**
  - NUMBER every requirement item (R1.1, R1.2, R2.1 …).
  - Build a traceability table mapping EACH numbered line to a TC-ID BEFORE writing any code.
  - A "section" being covered does NOT count — every individual line must have its own TC assignment.
  - You cannot self-declare "100% coverage" unless you can show the complete table with zero gaps.
  - Never skip a line because it seems similar, hard, or lacks CLI evidence — gather evidence first.

## Test Depth Standard — FIVE MANDATORY CHECKS (MANDATORY)

Every test case must satisfy ALL FIVE depth checks below. A test that only partly validates a requirement is a gap.

### D1. Content Completeness — "If it says description, validate the description"
- When a requirement mentions a section with heading + description + CTA, ALL THREE must be individually asserted — not just the heading.
- Checking only `toBeVisible()` on a heading while ignoring the sibling `<p>` description or CTA is a gap.
- Sub-elements listed in the requirement (eyebrow, title, description, image, CTA) are each a separate assertion.

### D2. Real Navigation — "Click it, don't just read its href"
- When a requirement says "links should open correctly" or "navigate correctly", the test MUST:
  1. Click at least ONE representative link
  2. Verify the resulting URL contains the expected path
  3. Navigate back to the original page
- Checking `getAttribute('href')` alone is NOT sufficient for navigation requirements.
- `href` validation is acceptable for SECONDARY links only (after at least one click-navigate is done).

### D3. Interaction Depth — "Trigger the interaction, verify the state change"
- Any requirement involving hover, flip, scroll, tab switch, accordion expand/collapse, carousel, or video play MUST:
  1. Perform the actual interaction (hover, click, scroll)
  2. Assert the resulting state change (CSS class toggle, aria-expanded, transform, URL change)
- Asserting that a flip card WRAPPER exists is not the same as verifying it FLIPS on hover.
- Asserting an accordion BUTTON exists is not the same as verifying it expands/collapses.

### D4. Count Accuracy — "Match the requirement's numbers exactly"
- When a requirement specifies exact counts (e.g., "1 featured card + 4 regular cards"), the test MUST assert exact or near-exact counts.
- Using loose thresholds like `≥2` when the requirement says "4" is a gap.
- If the live DOM count differs from the requirement, document the discrepancy and use the actual DOM count.

### D5. Section-Level Completeness — "Every interactive section gets full treatment"
- If a requirement says a section has an accordion (FAQ, Scenario Library), the test MUST expand/collapse at least one item.
- If a requirement says a section has tabs, the test MUST switch at least one tab and verify content change.
- Just asserting the section heading is visible does NOT satisfy the requirement.

## Tooling Standard

- Use `@playwright/cli` (`playwright-cli` or `npx playwright-cli`) for browser-driven diagnosis, locator validation, and UI troubleshooting.
- For AIC workflows, do not use MCP-based browser automation.

## Execution Standard

1. Reproduce only the failed scenario(s) first.
2. Diagnose with Playwright CLI evidence (snapshot, trace, DOM checks).
3. Apply a minimal, targeted fix.
4. Re-run only failed test case(s) first.
5. Expand run scope only after targeted reruns pass.

## Reporting Standard

- Provide exact commands used for reproduce -> diagnose -> verify.
- Keep changes scoped to files related to the reported failures.
- Do not claim self-healing unless a real code fix or validated fallback is implemented.

## Governance

- If multiple assistant-specific instruction files exist, this file takes precedence.
- Detailed CLI enforcement rules: `FRAMEWORK_HUB/02_Execution_Guides/MASTER_EXECUTION_GUIDE.md`

## Requirement Traceability Standard — ZERO GAP TOLERANCE (MANDATORY)

- **Every requirement line = at least one TC-ID.** Number all requirement items (R1.1, R1.2 …) and build a traceability table BEFORE writing code. No line can remain without a TC assignment.
- **TC-IDs are sequential within one spec file** using the module name prefix only. Never split by sub-page (e.g. TC-AV01…TC-AV10 for the full Aviator spec — NOT TC-A01, TC-L01, TC-MA01).
- **Never skip a requirement** because it looks similar to another, seems hard, or lacks CLI evidence. Gather evidence first, then implement.
- **Never merge requirements** into one TC without explicitly noting both requirement numbers in the TC comment.
- **INTERACTIVE BEHAVIORS RULE (CRITICAL):** Any requirement involving hover, flip, video play, scroll, tab switch, accordion expand/collapse, or carousel MUST have CLI DOM snapshot evidence (actual CSS class / aria attribute) BEFORE that TC is coded. If evidence is missing, mark the traceability table row "CLI-NEEDED" and gather it first.
- **Print the full traceability table in chat** before writing any code. Self-validate: *"Traceability confirmed: X requirements → Y test cases. 0 gaps. 0 CLI-NEEDED rows."* If any row still shows CLI-NEEDED → DO NOT proceed to coding.

## Test Specification Standard (MANDATORY)

All `.spec.ts` files MUST follow the standardized format defined in `FRAMEWORK_HUB/04_Framework_Standards/AI_COVERAGE_STANDARDS.md`. 

**Mandatory Requirements:**
- Each test MUST have a unique test case ID: `TC-{MODULE-CODE}{NUMBER}` (e.g., `TC-H01`, `TC-AV02`, `TC-CS03`)
- TC-IDs are sequential using the MODULE name prefix ONLY — never split by sub-page within a spec (e.g. TC-AV01…TC-AV12, NOT TC-A01, TC-L01, TC-MA01)
- Visual separators (`// ═══════`) must surround each test ID
- All tests MUST use `test.step()` with clear, action-oriented descriptions (no bare function calls)
- All tests MUST have priority tags (`@P0`, `@P1`, `@P2`) and feature tags
- Tests must map 1:1 to requirement statements or testcases.md records

**Reference:**
- Template: See `src/tests/header.spec.ts` for the model pattern
- Coverage Map: Every TC-ID should have a corresponding row in the requirement's RICEPOT coverage document
- Validation: Use `npx playwright test --grep "TC-"` to verify all tests are traceable

