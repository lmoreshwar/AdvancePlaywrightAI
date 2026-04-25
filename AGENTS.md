# Repository AI Instructions

This is the single source of truth for AI-agent behavior in this repository.
It is intentionally platform-neutral and applies to Cursor, GitHub Copilot, VS Code agents, and other coding assistants.

## Scope

Applies to these automation workflows:

- `PROMPT_DEBUG_REPORT.md`
- `PROMPT_MODIFY_IMPROVE.md`
- `PROMPT_NEW_AUTOMATION.md`
- `PROMPT_VISUAL_AUTOMATION.md`
- `PROMPT_RESPONSIVE_AUTOMATION.md`

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

## Viewport-Resilient Coding Standard (MANDATORY)

Tests run across local machines, BrowserStack, and CI — each with different effective viewport sizes. Every functional test MUST be resilient across all possible viewports.

### V1. Runtime Viewport Detection — "Never assume, always detect"
- If an element's visibility depends on a CSS breakpoint (e.g., nav links hidden below XL, hamburger shown on mobile), the Module method MUST query the runtime viewport before asserting:
  ```typescript
  const vpWidth = await this.page.evaluate(() => window.innerWidth);
  if (vpWidth >= 1376) { /* XL: links visible */ } else { /* toggle visible */ }
  ```
- NEVER hardcode viewport assumptions. BrowserStack sessions may render at a smaller effective viewport than the configured resolution.

### V2. DOM-Based vs Role-Based Locators — "Hidden elements need CSS locators"
- `getByRole()` excludes elements hidden from the accessibility tree (display:none, aria-hidden). If you need to count or find elements that may be hidden at some viewports, use CSS locators instead:
  - CORRECT: `this.page.locator('nav.navbar-secondary a[href]')` — finds all links in DOM
  - WRONG: `this.secondaryNav().getByRole('link')` — returns 0 if links are hidden
- Use `getByRole()` for visible-element assertions; use `locator()` with CSS for DOM-presence or count checks.

### V3. Toggle-Before-Interact — "Expand collapsed sections before clicking"
- When a Module method clicks links inside a collapsible section (hamburger nav, accordion), it MUST expand the section first at smaller viewports before interacting with the child elements.

### V4. Breakpoint Reference
| Breakpoint | Min Width | Viewport Project |
|------------|-----------|-----------------|
| XL         | ≥ 1376px  | viewport-xl     |
| LG         | ≥ 968px   | viewport-lg     |
| MD         | ≥ 720px   | viewport-md     |
| SM         | ≥ 576px   | viewport-sm     |
| XS         | ≥ 440px   | viewport-xs     |

### V5. CLI Evidence at Multiple Viewports
- When a page has responsive elements, run `playwright-cli snapshot` at BOTH desktop (1440x900) and a smaller size (1024x768) before writing locators. Document which elements appear/disappear at each breakpoint.

## Console Error Resilience Standard (MANDATORY)

Cloud environments (BrowserStack, GitHub Actions, Jenkins) route traffic through proxies. Third-party scripts frequently fail with network errors that NEVER appear locally.

- Every `assertNoUnexpectedConsoleErrors()` method MUST include ignore patterns for known infrastructure noise: `ERR_TUNNEL_CONNECTION_FAILED`, `ERR_FAILED`, `qualified.com`, `WebSocket.*failed`, `wisepops`, `go-mpulse.net`, `Prohibited read from data layer`, etc.
- When creating a NEW module with console error assertions, ALWAYS copy the full ignore list from an existing module (e.g., `AviatorAiModule.ts`) as the baseline. Never start with an empty ignore list.
- When a debug report shows "Environment Issue" failures caused by console errors, ADD the new error pattern to the ignore list — do NOT mark these as application defects.

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

## File Map Auto-Update Standard (MANDATORY)

Whenever the AI creates a **NEW** file in `src/` (Page, Module, Spec, Util, TestData, or Config), it **MUST** update the Existing File Map table in ALL prompt files that contain one:
- `FRAMEWORK_HUB/03_AI_Commands/PROMPT_NEW_AUTOMATION.md` → Section 4 "Existing File Map"
- `FRAMEWORK_HUB/03_AI_Commands/PROMPT_MODIFY_IMPROVE.md` → Section 4 "Quick Reference — Existing Code Map"
- `FRAMEWORK_HUB/03_AI_Commands/PROMPT_VISUAL_AUTOMATION.md` → "Files the AI Must Read"
- `FRAMEWORK_HUB/03_AI_Commands/PROMPT_RESPONSIVE_AUTOMATION.md` → "Files the AI Must Read"

**Rules:**
1. Add the new file's row to the correct layer group (Pages, Modules, Tests, Utils, TestData) in ALL applicable files.
2. Include an accurate description of what the file contains.
3. This update MUST happen in the same edit session that creates the file — not as a follow-up.
4. If the AI discovers a file in `src/` that is NOT listed in the map, it must add it before proceeding with any other work.
5. Failure to update the file map is a rule violation equivalent to forgetting to register a fixture.
6. The AI must NOT leave stale file maps that omit recently created files — stale maps cause the AI to miss existing code and duplicate it.

## Requirement Traceability Standard — ZERO GAP TOLERANCE (MANDATORY)

- **Every requirement line = at least one TC-ID.** Number all requirement items (R1.1, R1.2 …) and build a traceability table BEFORE writing code. No line can remain without a TC assignment.
- **TC-IDs are sequential within one spec file** using the module name prefix only. Never split by sub-page (e.g. TC-AV01…TC-AV10 for the full Aviator spec — NOT TC-A01, TC-L01, TC-MA01).
- **Never skip a requirement** because it looks similar to another, seems hard, or lacks CLI evidence. Gather evidence first, then implement.
- **Never merge requirements** into one TC without explicitly noting both requirement numbers in the TC comment.
- **INTERACTIVE BEHAVIORS RULE (CRITICAL):** Any requirement involving hover, flip, video play, scroll, tab switch, accordion expand/collapse, or carousel MUST have CLI DOM snapshot evidence (actual CSS class / aria attribute) BEFORE that TC is coded. If evidence is missing, mark the traceability table row "CLI-NEEDED" and gather it first.
- **Print the full traceability table in chat** before writing any code. Self-validate: *"Traceability confirmed: X requirements → Y test cases. 0 gaps. 0 CLI-NEEDED rows."* If any row still shows CLI-NEEDED → DO NOT proceed to coding.

## Test Specification Standard (MANDATORY)

All `.spec.ts` files MUST follow the standardized format defined in `FRAMEWORK_HUB/04_Framework_Standards/AI_COVERAGE_STANDARDS.md`. 

### Spec File Naming & Organization Standard

The framework uses a clear file-per-concern naming convention. Each test type has its own spec file:

| Test Type | Naming Pattern | Example | Scope |
|---|---|---|---|
| **Functional** | `<feature>.spec.ts` | `header.spec.ts`, `aviator-ai.spec.ts` | One file per feature — behavior assertions at default desktop viewport |
| **Responsive** | `responsive-<feature>.spec.ts` | `responsive-homepage.spec.ts`, `responsive-aviator.spec.ts` | One file per feature — loops over 5 viewports (XL/LG/MD/SM/XS) |
| **Visual** | `visual.spec.ts` | `visual.spec.ts` | **Single file** — ALL Percy snapshot tests, organized by `// ═══════ SECTION` separators |

**Rules:**
1. **Responsive tests** get a SEPARATE file per feature because each feature has different page URLs, module dependencies, and `beforeEach` setup. Pattern: `responsive-<feature>.spec.ts`
2. **Visual tests** stay in ONE file (`visual.spec.ts`) because they are lightweight 3-step patterns (navigate → state → snapshot) and Percy baseline management benefits from a single coherent suite. Use section comments (`// ═══════ HOMEPAGE`, `// ═══════ AVIATOR AI`) to organize.
3. **Never** name a responsive file without the feature suffix (e.g., never `responsive.spec.ts` — always `responsive-homepage.spec.ts`).
4. **Never** create feature-specific visual files (e.g., never `visual-aviator.spec.ts` — always add to `visual.spec.ts`).
5. When creating a new responsive or visual test, update the file map in ALL prompt files and the `README.md`.

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

