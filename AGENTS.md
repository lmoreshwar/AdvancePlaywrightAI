# Repository AI Instructions

This is the single source of truth for AI-agent behavior in this repository.
It is intentionally platform-neutral and applies to Cursor, GitHub Copilot, VS Code agents, and other coding assistants.

## Scope

Applies to these automation workflows:

- `AIC_DEBUG_REPORT`
- `AIC_MODIFY_IMPROVE`
- `AIC_NEW_AUTOMATION`

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
- Detailed CLI enforcement rules: `FRAMEWORK_HUB/02_Execution_Guides/PLAYWRIGHT_CLI_ENFORCEMENT.md`
