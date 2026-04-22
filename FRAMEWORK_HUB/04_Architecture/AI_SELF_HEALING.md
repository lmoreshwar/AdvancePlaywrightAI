# 🤖 AI Self-Healing & Intelligent Debugging System

> **OpenText Playwright Framework — AI Architecture Documentation**

This document explains the AI-powered self-healing, auto-debugging, and intelligent reporting capabilities built into this framework.

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    TEST EXECUTION                           │
│                                                             │
│   Spec Layer          Module Layer         Page Layer        │
│  ┌──────────┐       ┌──────────────┐     ┌──────────────┐  │
│  │ header   │──────▶│ HeaderModule │────▶│ HeaderPage   │  │
│  │ .spec.ts │       │              │     │              │  │
│  └──────────┘       └──────────────┘     └───────┬──────┘  │
│                                                   │         │
│                                          ┌────────▼───────┐ │
│                               AI         │ SmartLocator   │ │
│                            Pillar 1      │ (Self-Healing) │ │
│                                          └────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    REPORTING LAYER                           │
│                                                             │
│   ┌────────────────────────────────────────────────────┐    │
│   │         Enhanced AI Debug Reporter                  │    │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │    │
│   │  │ Auto-Categorize│ │ Debug Report │  │ GitHub   │ │    │
│   │  │ Failures      │ │ Generator    │  │ Summary  │ │    │
│   │  └──────────────┘  └──────────────┘  └──────────┘ │    │
│   └────────────────────────────────────────────────────┘    │
│                         AI Pillar 2                          │
├─────────────────────────────────────────────────────────────┤
│                    CI/CD LAYER                               │
│                                                             │
│   ┌────────────────────────────────────────────────────┐    │
│   │           GitHub Actions Workflow                   │    │
│   │  ┌──────────┐  ┌──────────────┐  ┌──────────────┐ │    │
│   │  │ Run Tests │  │ Upload Debug │  │ Job Summary  │ │    │
│   │  │           │  │ Report       │  │ (PR Comment) │ │    │
│   │  └──────────┘  └──────────────┘  └──────────────┘ │    │
│   └────────────────────────────────────────────────────┘    │
│                         AI Pillar 3                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Pillar 1: SmartLocator (Runtime Self-Healing)

### What It Does
SmartLocator wraps Playwright locators with **fallback chains**. If the primary locator fails, it tries alternative strategies automatically.

### How It Works
```typescript
import { SmartLocator } from '../utils/SmartLocator';

// Define multiple strategies for the same element
const logo = await SmartLocator.resolve('Logo', [
    { name: 'role', locator: page.getByRole('link', { name: /OpenText/i }).first() },
    { name: 'testid', locator: page.getByTestId('ot-logo') },
    { name: 'css', locator: page.locator('header a[href="/"]').first() },
]);

await expect(logo).toBeVisible();
```

### What Happens at Runtime

| Scenario | Behavior |
|---|---|
| Primary locator works | ✅ Uses it directly, no warnings |
| Primary fails, fallback works | ⚠️ Uses fallback, logs a warning for the report |
| ALL strategies fail | ❌ Throws detailed error with all strategies tried |

### Self-Healing Events
SmartLocator tracks all fallback usages globally:
```typescript
// After test run
console.log(SmartLocator.getSummary());
// Output: ⚠️ 2 self-healing event(s) detected:
//   1. "Logo" — primary "role" → fallback "css"
//   2. "Search Icon" — primary "role" → fallback "testid"
```

### Key Methods

| Method | Purpose |
|---|---|
| `SmartLocator.resolve(name, strategies)` | Try strategies in order, return first working locator |
| `SmartLocator.combine(name, strategies)` | Build `.or()` chain for simple fallback (no tracking) |
| `SmartLocator.getHealingEvents()` | Get all self-healing events from the run |
| `SmartLocator.getSummary()` | Get human-readable summary string |
| `SmartLocator.reset()` | Clear events between test suites |

---

## 📊 Pillar 2: Intelligent AI Debug Reporter

### What It Does
The Enhanced AI Debug Reporter **auto-categorizes** every test failure and generates:
1. **AIC_DEBUG_REPORT.md** — Categorized RCA for every failure
2. **HTML Report** — Visual dashboard with category badges
3. **JSON Report** — Machine-readable for CI/CD pipelines
4. **GitHub Step Summary** — Inline summary in GitHub Actions

### Failure Categories

| Category | Pattern Detected | AI Healable | Example |
|---|---|---|---|
| 🔗 **Locator Change** | `element(s) not found`, `waiting for locator` | ✅ Yes | DOM element renamed/removed |
| 📝 **Script Issue** | `strict mode violation`, `resolved to N elements` | ✅ Yes | Missing `.first()`, bad selector |
| 🐛 **UI Bug** | `Expected: X, Received: Y` (assertion mismatch) | ❌ No | App behavior changed |
| 🌐 **Environment Issue** | `navigation timeout`, `net::ERR_` | ❌ No | Server down, network issue |

### How Categorization Works
The reporter pattern-matches error messages to determine the category:

```
"strict mode violation" → Script Issue
"element(s) not found" + "toBeVisible" → Locator Change
"Expected: visible, Received: hidden" → UI Bug
"Navigation timeout" → Environment Issue
```

### AIC Debug Report Output
When failures occur, `ai-debug-report/AIC_DEBUG_REPORT.md` is auto-generated:

```markdown
## 🔴 FAILURE #1

### 1. 🚨 Failure Summary
- **Test**: `should open language switcher modal`
- **Error Location**: `HeaderPage.ts:152`

### 2. 🗂️ Category: **🔗 Locator Change**

### 3. 🤖 Self-Healing
- **AI Healable**: ✅ Yes
- **Suggestion**: Use SmartLocator with fallback strategies...
```

---

## 🔄 Pillar 3: GitHub Actions CI/CD

### Workflow: `.github/workflows/playwright.yml`

```
Push/PR to main → Install → Run Tests → Upload Artifacts
                                              │
                              ┌───────────────┼───────────────┐
                              ▼               ▼               ▼
                        ai-debug-report/    playwright-report/  test-results/
                        ├── index.html  (Playwright HTML)   ├── screenshots
                        ├── AIC_DEBUG   report)              ├── videos
                        │   _REPORT.md                       └── traces
                        └── results.json
```

### Where to Find Reports After CI Failure

1. **GitHub Actions** → Your workflow run → **Artifacts** tab
2. Download `ai-debug-report` → Open `AIC_DEBUG_REPORT.md` for categorized RCA
3. Download `test-results` → View screenshots and replay traces

### Job Summary
The workflow also writes a summary directly in the GitHub Actions UI showing pass/fail counts and a failure table.

---

## 🔄 How The Full Debugging Loop Works

```
Test Run (Local or CI/CD)
    │
    ├── All Tests Pass ──→ ✅ Done
    │
    └── Some Tests Fail
            │
            ▼
    AI Debug Reporter Auto-Generates
    AIC_DEBUG_REPORT.md
            │
            ├── Category: Locator Change ──→ SmartLocator fallback tried at runtime
            │                                 If it self-healed: ⚠️ Warning logged
            │                                 If not: AI Agent fixes the locator
            │
            ├── Category: Script Issue ──→ AI Agent auto-fixes (e.g., add .first())
            │
            ├── Category: UI Bug ──→ ⚠️ Flagged to user/developer as potential app bug
            │
            └── Category: Environment ──→ Retry or investigate infrastructure
```

---

## 🗂️ File Reference

| File | Purpose |
|---|---|
| `src/utils/SmartLocator.ts` | Self-healing locator utility with fallback chains |
| `src/utils/AiDebugReporter.ts` | Enhanced reporter with auto-categorization |
| `.github/workflows/playwright.yml` | CI/CD workflow for GitHub Actions |
| `FRAMEWORK_HUB/03_AI_Commands/AIC_DEBUG_REPORT.md` | Debug report template (auto-populated on failure) |
| `ai-debug-report/AIC_DEBUG_REPORT.md` | Auto-generated debug report (per run) |

---

## 🚀 Commands Reference

| Command | Purpose |
|---|---|
| `npm test` | Run all tests (all projects) |
| `npm run test:chromium` | Run on Desktop Chrome only |
| `npm run test:bstack -- src/tests/header.spec.ts` | Run header tests on BrowserStack |
| `npx playwright show-report` | Open the Playwright HTML report |
| `npx playwright show-trace <path>` | Replay a test trace for debugging |

---

*This framework is designed for production-grade AI-assisted test automation with built-in resilience, intelligent failure analysis, and CI/CD integration.*
