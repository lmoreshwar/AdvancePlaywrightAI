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
- When generating or applying fixes from debug reports, keep actions grounded in Playwright CLI evidence (snapshot, trace, DOM verification).

## Prohibited behavior

- Do not use MCP-based browser automation flows when handling debug report analysis or fixes.
- Do not claim runtime self-healing unless a concrete code fix or validated fallback has been applied.

## Output expectation

- Provide clear Playwright CLI commands used (or to run) for reproduce -> diagnose -> fix -> verify.
- Scope reruns to failed test cases first before any broader run.

