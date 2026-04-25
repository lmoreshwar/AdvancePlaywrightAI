# OpenText Playwright Automation Framework

AI-powered test automation for **[opentext.com](https://www.opentext.com)** — functional, responsive, and visual testing via BrowserStack and GitHub Actions.

---

## Quick Start

```bash
git clone https://github.com/lmoreshwar/AdvancePlaywrightAI.git
cd AdvancePlaywrightAI
npm install
npx playwright install --with-deps
npm run test:smoke                    # Smoke tests on Chrome
npm run test:ui                       # Interactive Playwright UI
```

**Optional**: Install `@playwright/cli` for AI-assisted locator discovery:
```bash
npm install -g @playwright/cli@latest
```

---

## Test Commands

### By Suite
```bash
npm run test:smoke           # @Smoke tests
npm run test:regression      # @Regression tests
npm run test:p0              # @P0 critical tests
npm run test:header          # Header tests
npm run test:homepage        # Homepage tests
npm run test:responsive      # All responsive viewport tests
```

### By Browser / Device
```bash
npm run test:chromium        # Chrome
npm run test:firefox         # Firefox
npm run test:webkit          # Safari
npm run test:edge            # Edge
npm run test:mobile          # Pixel 5 + iPhone 13
npm run test:tablet          # Galaxy Tab S4
```

### BrowserStack
```bash
npm run test:bstack          # Default BrowserStack run
npm run test:bstack:fast     # 4 workers
npm run test:bstack:max      # 5 workers
```

### Visual (Percy)
```bash
npm run test:visual          # Full Percy visual suite
npm run test:visual:fast     # Chrome only
npm run test:visual:full     # Chrome + viewports
```

### By Environment
```bash
npm run test:qa              # QA environment
npm run test:staging         # Staging environment
npm run test:dev             # Dev environment
```

### Debug & Interactive
```bash
npm run test:debug           # Step-through debugger
npm run test:ui              # Interactive UI
npm run test:headed          # Visible browser
npm run test:report          # Open last HTML report
```

### Custom Grep
```bash
npx playwright test --grep "@Aviator"
npx playwright test --grep "@P0|@Smoke"
npx playwright test --grep "@Responsive" --project=desktop-chrome
```

---

## Spec File Naming Strategy

| Test Type | Pattern | Example | Strategy |
|---|---|---|---|
| **Functional** | `<feature>.spec.ts` | `header.spec.ts`, `aviator-ai.spec.ts` | One file per feature |
| **Responsive** | `responsive-<feature>.spec.ts` | `responsive-homepage.spec.ts`, `responsive-aviator.spec.ts` | Separate file per feature (different URLs, modules, setup) |
| **Visual** | `visual.spec.ts` | `visual.spec.ts` | Single file for ALL features (organized by `// ═══════ SECTION` separators) |

**Rules:**
- Never name a responsive file without the feature suffix (never `responsive.spec.ts`)
- Never create feature-specific visual files (never `visual-aviator.spec.ts`)
- When adding a new feature: create `<feature>.spec.ts` + `responsive-<feature>.spec.ts` + add visual tests to `visual.spec.ts`

---

## Test Coverage

| Spec File | Tests | Tags | Pages |
|---|---|---|---|
| `header.spec.ts` | 8 | `@Header @Smoke @Regression` | Homepage header |
| `homepage.spec.ts` | 8 | `@Homepage @Smoke @Regression` | Homepage |
| `aviator-ai.spec.ts` | 10 | `@Aviator @Smoke @Regression` | /aviator-ai, /limitless, /aviator-ai/myaviator |
| `customer-stories.spec.ts` | 4 | `@CustomerStories @Smoke @Regression` | /customers |
| `responsive-homepage.spec.ts` | 40 (8×5) | `@Responsive @Homepage` | Homepage at XL/LG/MD/SM/XS |
| `responsive-aviator.spec.ts` | 55 (11×5) | `@Responsive @Aviator` | Aviator pages at XL/LG/MD/SM/XS |
| `visual.spec.ts` | 26 | `@Visual` | Percy snapshots for all features |
| **Total** | **~151** | | |

---

## Tags

| Tag | Purpose |
|---|---|
| `@P0` / `@P1` / `@P2` | Priority: Critical / High / Medium |
| `@Smoke` | Quick health check |
| `@Regression` | Full feature regression |
| `@Responsive` | Viewport-specific tests |
| `@Visual` | Percy snapshots (excluded from functional runs) |
| `@Header` / `@Homepage` / `@Aviator` / `@CustomerStories` | Feature filter |
| `@XL` / `@LG` / `@MD` / `@SM` / `@XS` | Viewport filter |

---

## Viewport Breakpoints

| Breakpoint | Width | Type |
|---|---|---|
| XL | 1376px | Desktop |
| LG | 968px | Desktop |
| MD | 720px | Tablet |
| SM | 576px | Mobile |
| XS | 440px | Mobile |

Defined in `src/testdata/menus.json` and `playwright.config.ts`.

---

## 3-Layer Architecture

```
Test (.spec.ts) → Module (*Module.ts) → Page (*Page.ts) → Browser
```

- **Pages**: Locators only (`src/pages/`)
- **Modules**: Business logic, workflows (`src/modules/`)
- **Tests**: Test definitions with tags and `test.step()` blocks (`src/tests/`)

Tests never touch locators. Modules never define locators. Pages never contain test logic.

---

## Environment Configuration

| Environment | URL | Variable |
|---|---|---|
| Production | `https://www.opentext.com` | Default |
| Staging | `https://staging.opentext.com` | `TEST_ENV=staging` |
| QA | `https://qa.opentext.com` | `TEST_ENV=qa` |
| Dev | `https://dev.opentext.com` | `TEST_ENV=dev` |

Config loader: `src/config/index.ts` — reads `.env` / `.env.{TEST_ENV}` files.

---

## BrowserStack

- Config: `configs/browserstack.yml`
- `parallelsPerPlatform: 1` (keep at 1 for free trial)
- SDK rewrites Playwright project names — do NOT pass `--project=` flags with BrowserStack
- Total sessions ≈ `workers × parallelsPerPlatform × platforms`

**Queue errors?** Use `execution_profile=fast` (3 workers) or `project_target=desktop-chrome` (1 platform).

---

## GitHub Actions Workflows

### Functional Tests (`playwright.yml`)

Trigger: Manual or Nightly (02:00 UTC)

| Input | Default | Description |
|---|---|---|
| `environment` | production | Target env |
| `execution_profile` | medium | Workers: fast=3, medium=4, full=4+all |
| `test_scope` | smoke | smoke / regression / responsive / all |
| `project_target` | desktop-chrome | BrowserStack platform |
| `custom_grep` | *(empty)* | **Overrides test_scope** when set |
| `max_minutes` | 45 | Timeout |

### Visual Tests (`percy_visual_tests.yml`)

Trigger: Manual or Weekly (Monday 02:00 UTC)

### Key Rules
- `custom_grep` overrides `test_scope`
- `@Visual` tests always excluded from functional runs
- `project_target` controls BrowserStack platform, not Playwright viewport

---

## Jenkins Pipeline

Parameters: `BROWSER`, `ENVIRONMENT`, `TEST_SUITE`, `EXECUTION_PLATFORM`, `CUSTOM_GREP`

Requires: Node.js 22+, `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY` credentials.

---

## Percy Visual Regression

- Config: `configs/percy.yml`
- All visual tests in single file: `src/tests/visual.spec.ts`
- Percy dashboard: `https://percy.io/opentext/opentext-tta/`
- 3-step pattern: Navigate (module) → State setup → `visualModule.takeSnapshot()`

---

## AI Prompt Files

Drag-and-drop these into your AI agent chat to generate tests:

| Prompt File | Purpose |
|---|---|
| `PROMPT_NEW_AUTOMATION.md` | Create new functional tests from requirements |
| `PROMPT_MODIFY_IMPROVE.md` | Update/fix existing tests |
| `PROMPT_VISUAL_AUTOMATION.md` | Create visual regression tests (Percy) |
| `PROMPT_RESPONSIVE_AUTOMATION.md` | Create responsive viewport tests |
| `PROMPT_DEBUG_REPORT.md` | Debug failures from AI debug report |
| `PROMPT_SHORTCUTS.md` | Quick reference for all prompt patterns |

All prompts follow rules defined in `AGENTS.md` (root of repo).

---

## AI Debug Reporter

Every run generates `ai-debug-report/AIC_DEBUG_REPORT.md` with:
- Run configuration, BrowserStack platforms, Playwright projects
- Pass/fail/flaky/skipped counts
- Failures auto-categorized: Locator Change / Script Issue / UI Bug / Environment Issue
- CLI investigation commands per failure
- Trace file links

---

## Troubleshooting

| Error | Fix |
|---|---|
| `BROWSERSTACK_QUEUE_SIZE_EXCEEDED` | Reduce `parallelsPerPlatform` to 1, use `execution_profile=fast` |
| `Project(s) "desktop-chrome" not found` | Don't pass `--project` with BrowserStack — SDK handles it |
| `custom_grep` overrides scope | By design — leave `custom_grep` empty for scope filtering |
| Tests pass locally, fail on BrowserStack | Check AI Debug Report — usually Environment Issue → retry |
| `pre-push hook failed` | Use `git push --no-verify` |

---

*Playwright • TypeScript • BrowserStack • Percy • @playwright/cli*

