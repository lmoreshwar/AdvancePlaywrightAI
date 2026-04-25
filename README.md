# 🚀 OpenText AI-Powered Playwright Automation Framework

Enterprise-grade, AI-assisted Playwright test automation for **[opentext.com](https://www.opentext.com)** — functional, visual, and responsive testing across browsers and devices via BrowserStack and GitHub Actions.

---

## Table of Contents

1. [Framework Architecture](#-framework-architecture)
2. [3-Layer Design Pattern](#-3-layer-design-pattern)
3. [Quick Start (Local Setup)](#-quick-start-local-setup)
4. [Project Structure](#-project-structure)
5. [File Map — Every File Explained](#-file-map--every-file-explained)
6. [Running Tests Locally](#-running-tests-locally)
7. [BrowserStack Cloud Execution](#-browserstack-cloud-execution)
8. [GitHub Actions CI/CD Workflows](#-github-actions-cicd-workflows)
9. [Workflow Combinations Guide](#-workflow-combinations-guide)
10. [Understanding Workers & Parallelism](#-understanding-workers--parallelism)
11. [Percy Visual Regression](#-percy-visual-regression)
12. [Jenkins Pipeline](#-jenkins-pipeline)
13. [Tags & Filtering System](#-tags--filtering-system)
14. [Viewport Breakpoints](#-viewport-breakpoints)
15. [Environment Configuration](#-environment-configuration)
16. [AI Debug Reporter](#-ai-debug-reporter)
17. [Automating a New Test Case](#-automating-a-new-test-case)
18. [Debugging Failures](#-debugging-failures)
19. [Using playwright-cli (AI Agent Tool)](#-using-playwright-cli-ai-agent-tool)
20. [Fixtures & Dependency Injection](#-fixtures--dependency-injection)
21. [Utility Classes](#-utility-classes)
22. [npm Scripts Reference](#-npm-scripts-reference)
23. [Troubleshooting](#-troubleshooting)

---

## 🏗️ Framework Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    GitHub Actions / Jenkins                   │
│         (Triggers tests on BrowserStack or locally)          │
├──────────────────────────────────────────────────────────────┤
│                    playwright.config.ts                       │
│  (14 projects: 4 desktop + 5 viewport + 2 mobile + 2 tablet)│
├──────────────────────────────────────────────────────────────┤
│  Layer 3: TESTS        *.spec.ts                             │
│  ├── header.spec.ts       (8 tests)                          │
│  ├── homepage.spec.ts     (8 tests)                          │
│  ├── aviator-ai.spec.ts   (10 tests)                         │
│  ├── customer-stories.spec.ts (4 tests)                      │
│  ├── responsive.spec.ts   (8 tests × 5 viewports = 40)      │
│  └── visual.spec.ts       (14 Percy snapshot tests)          │
├──────────────────────────────────────────────────────────────┤
│  Layer 2: MODULES      *Module.ts (Business Logic)           │
│  ├── HeaderModule.ts                                         │
│  ├── HomepageModule.ts                                       │
│  ├── AviatorAiModule.ts                                      │
│  ├── CustomerStoriesModule.ts                                │
│  └── VisualModule.ts                                         │
├──────────────────────────────────────────────────────────────┤
│  Layer 1: PAGES        *Page.ts (Locators & Actions)         │
│  ├── HeaderPage.ts                                           │
│  ├── HomepagePage.ts                                         │
│  ├── FooterPage.ts                                           │
│  ├── CustomerStoriesPage.ts                                  │
│  └── AviatorAiPage.ts                                        │
├──────────────────────────────────────────────────────────────┤
│  SUPPORT: fixtures/ config/ testdata/ utils/                 │
│           AiDebugReporter.ts  Logger.ts  WaitHelper.ts       │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧱 3-Layer Design Pattern

Every test follows a strict separation of concerns:

| Layer | Files | Responsibility |
|---|---|---|
| **Layer 1: Pages** | `src/pages/*Page.ts` | Element locators (`getByRole`, `locator`) and low-level actions (click, fill, expect) |
| **Layer 2: Modules** | `src/modules/*Module.ts` | Business logic, multi-step workflows, logging. Calls Page methods. |
| **Layer 3: Tests** | `src/tests/*.spec.ts` | Test definitions with tags (`@P0 @Smoke`), uses `test.step()` blocks. Calls Module methods. |

**Rule**: Tests never touch locators directly. Modules never define locators. Pages never contain test logic.

```
Test → Module → Page → Browser
```

---

## ⚡ Quick Start (Local Setup)

### Prerequisites
- **Node.js 22+** (LTS recommended)
- **Git**
- npm (comes with Node.js)

### Setup
```bash
# Clone the repository
git clone https://github.com/lmoreshwar/AdvancePlaywrightAI.git
cd AdvancePlaywrightAI

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# (Optional) Install playwright-cli for AI-assisted development
npm install -g @playwright/cli@latest

# Run smoke tests locally on Chrome
npm run test:smoke

# Open interactive UI mode
npm run test:ui
```

### Verify Setup
```bash
# List all tests without running
npx playwright test --list

# Run one specific test
npx playwright test header.spec.ts --project=desktop-chrome
```

---

## 📁 Project Structure

```
AdvancePlaywrightAI/
├── .github/workflows/
│   ├── playwright.yml             ← Functional tests on BrowserStack
│   └── percy_visual_tests.yml     ← Visual regression via Percy
├── configs/
│   ├── browserstack.yml           ← BrowserStack static config
│   └── percy.yml                  ← Percy snapshot settings
├── src/
│   ├── config/index.ts            ← Environment config loader
│   ├── fixtures/index.ts          ← Playwright fixture definitions (DI)
│   ├── pages/                     ← Page Objects (locators)
│   ├── modules/                   ← Modules (business logic)
│   ├── tests/                     ← Test specs
│   ├── testdata/                  ← Test data (JSON + types)
│   └── utils/                     ← Utilities (Logger, Reporter, etc.)
├── FRAMEWORK_HUB/                 ← AI agent instructions & requirements
├── ai-debug-report/               ← Generated after each run
├── playwright-report/             ← Playwright HTML report
├── test-results/                  ← JSON results + traces
├── playwright.config.ts           ← Main Playwright configuration
├── Jenkinsfile                    ← Jenkins CI pipeline
├── package.json                   ← Dependencies & scripts
└── tsconfig.json                  ← TypeScript configuration
```

---

## 📋 File Map — Every File Explained

### Pages (`src/pages/`)
| File | What It Contains |
|---|---|
| `HeaderPage.ts` | Locators for header nav, logo, search, language switcher, cookie/popup handlers |
| `HomepagePage.ts` | Locators for homepage hero, sections, scrollers |
| `FooterPage.ts` | Locators for footer links, social icons, copyright |
| `CustomerStoriesPage.ts` | Locators for customer stories hero, filters, results grid |
| `AviatorAiPage.ts` | Locators for Aviator, Limitless, MyAviator pages (bento grid, flip cards, accordions) |

### Modules (`src/modules/`)
| File | What It Contains |
|---|---|
| `HeaderModule.ts` | Header workflows: navigate, verify menus, verify logo, language switcher, tab navigation |
| `HomepageModule.ts` | Homepage workflows: verify components, scrollers, padding, sticky header |
| `AviatorAiModule.ts` | Aviator workflows: bento cards, scenario library tabs, flip cards, secondary nav, CTAs |
| `CustomerStoriesModule.ts` | Customer stories workflows: hero, filters, result count verification |
| `VisualModule.ts` | Percy snapshot capture helper |

### Tests (`src/tests/`)
| File | Tests | Tags | What It Tests |
|---|---|---|---|
| `header.spec.ts` | 8 | `@Header @Smoke @Regression` | Header, logo, menus, submenus, language switcher, contact, keyboard nav |
| `homepage.spec.ts` | 8 | `@Homepage @Smoke @Regression` | Homepage load, components, scrollers, sticky header, footer |
| `aviator-ai.spec.ts` | 10 | `@Aviator @Smoke @Regression` | Aviator AI, Limitless, MyAviator pages — full feature coverage |
| `customer-stories.spec.ts` | 4 | `@CustomerStories @Smoke @Regression` | Hero, explore scroll, filter combos, result counts |
| `responsive.spec.ts` | 8 per viewport × 5 = 40 | `@Responsive @XL @LG @MD @SM @XS` | Homepage at each viewport breakpoint |
| `visual.spec.ts` | 14 | `@Visual` | Percy visual snapshots (excluded from functional runs) |

### Config & Data
| File | Purpose |
|---|---|
| `src/config/index.ts` | Loads environment variables (`.env`, `.env.qa`, etc.) |
| `src/fixtures/index.ts` | Registers all Page + Module objects as Playwright fixtures |
| `src/testdata/menus.json` | Menu items, utility items, viewport breakpoint data |
| `src/testdata/types.ts` | TypeScript interfaces for test data |

### Utilities (`src/utils/`)
| File | Purpose |
|---|---|
| `AiDebugReporter.ts` | Custom reporter: generates `AIC_DEBUG_REPORT.md`, HTML report, JSON results, GitHub Actions summary |
| `Logger.ts` | Structured logging with step numbers |
| `WaitHelper.ts` | Custom wait conditions |
| `DataGenerator.ts` | Random data generation for tests |
| `SmartLocator.ts` | Fallback locator strategies |
| `FileHelper.ts` | File read/write helpers |
| `IframeHelper.ts` | Iframe interaction helpers |
| `StringHelper.ts` | String manipulation utilities |
| `WindowHelper.ts` | Window/tab management helpers |

### CI/CD
| File | Purpose |
|---|---|
| `.github/workflows/playwright.yml` | Functional tests on BrowserStack (workflow_dispatch + nightly schedule) |
| `.github/workflows/percy_visual_tests.yml` | Visual regression via Percy (workflow_dispatch + weekly schedule) |
| `Jenkinsfile` | Jenkins pipeline for BrowserStack/local execution |
| `configs/browserstack.yml` | BrowserStack platform config (static) |
| `configs/percy.yml` | Percy widths and CSS overrides |

---

## 🧪 Running Tests Locally

### By Test Suite
```bash
npm run test:header          # Header tests only
npm run test:homepage        # Homepage tests only
npm run test:responsive      # Responsive viewport tests
npm run test:smoke           # All @Smoke tests
npm run test:regression      # All @Regression tests
npm run test:p0              # All @P0 (critical) tests
```

### By Browser
```bash
npm run test:chromium        # Chrome
npm run test:firefox         # Firefox
npm run test:webkit          # Safari
npm run test:edge            # Edge
```

### By Device
```bash
npm run test:mobile          # Pixel 5 + iPhone 13
npm run test:tablet          # Galaxy Tab S4
```

### Custom grep
```bash
npx playwright test --grep "@Aviator"
npx playwright test --grep "@P0|@Smoke"
npx playwright test --grep "@Header" --project=desktop-chrome
```

### Debug & Interactive
```bash
npm run test:debug           # Playwright debugger (step through)
npm run test:ui              # Interactive browser UI
npm run test:headed          # Run with visible browser
npm run test:report          # Open last HTML report
```

---

## ☁️ BrowserStack Cloud Execution

### Local BrowserStack Run
```bash
# Run all tests on BrowserStack
npm run test:bstack

# Faster with 4 workers
npm run test:bstack:fast

# Maximum workers
npm run test:bstack:max
```

### How BrowserStack Works
1. BrowserStack SDK reads `configs/browserstack.yml` (or dynamic config generated in CI)
2. SDK **rewrites** Playwright project names to BrowserStack session names (e.g., `desktop-chrome` → `-latest:Windows 10-browserstack`)
3. Tests execute on real Windows/macOS machines in BrowserStack cloud
4. Results are visible on the BrowserStack Automate dashboard

### BrowserStack Config (`configs/browserstack.yml`)
```yaml
platforms:
  - os: Windows
    osVersion: 10
    browserName: chrome
    browserVersion: latest
    resolution: 1920x1080
parallelsPerPlatform: 1    # Keep at 1 for free trial
```

### Important Notes
- **Free trial**: Usually allows 1 parallel session. Keep `parallelsPerPlatform: 1`
- **Paid plan**: Increase `parallelsPerPlatform` to match your plan's limit
- `--project=` flags **cannot** be passed when using BrowserStack SDK (SDK rewrites project names)
- Playwright `workers` setting controls how many tests run in parallel

---

## ⚙️ GitHub Actions CI/CD Workflows

### Functional Tests (`playwright.yml`)

Trigger: **Manual** (workflow_dispatch) or **Nightly** (02:00 UTC daily)

| Input | Options | Default | Description |
|---|---|---|---|
| `environment` | production, staging, qa, dev | production | Target environment URL |
| `execution_profile` | fast, medium, full | medium | Controls worker count |
| `test_scope` | smoke, regression, responsive, all | smoke | Which tests to run |
| `project_target` | desktop-chrome, desktop-edge, desktop-firefox, desktop-safari, mobile-chrome, mobile-safari, tablet-chrome, tablet-safari, responsive-matrix, cross-browser, real-devices, all | desktop-chrome | BrowserStack platform config |
| `custom_grep` | Free text (e.g., `@Aviator`) | *(empty)* | **Overrides test_scope** when set |
| `max_minutes` | 30, 45, 60, 90 | 45 | Workflow timeout |

#### Execution Profile → Worker Mapping
| Profile | Workers |
|---|---|
| fast | 3 |
| medium | 4 |
| full | 4 + forces scope=all, target=all |

#### project_target → BrowserStack Platforms Generated
| Target | Platforms |
|---|---|
| `desktop-chrome` | Windows 10 / Chrome |
| `desktop-edge` | Windows 10 / Edge |
| `desktop-firefox` | Windows 10 / Firefox |
| `desktop-safari` | macOS Sonoma / WebKit |
| `cross-browser` / `all` | All 4 above |
| Everything else | Windows 10 / Chrome (viewport/device behavior is Playwright-side) |

### Visual Tests (`percy_visual_tests.yml`)

Trigger: **Manual** or **Weekly** (Monday 02:00 UTC)

Runs Percy snapshot tests and uploads to Percy dashboard for visual diff review.

---

## 📊 Workflow Combinations Guide

### Common Scenarios

| What you want | `test_scope` | `project_target` | `custom_grep` | Expected runs |
|---|---|---|---|---|
| **Smoke on Chrome** | smoke | desktop-chrome | *(empty)* | ~10 |
| **All Aviator tests** | all | desktop-chrome | `@Aviator` | 10 |
| **All regression tests** | regression | desktop-chrome | *(empty)* | ~30 |
| **Responsive tests** | responsive | responsive-matrix | *(empty)* | ~14 |
| **Smoke on all browsers** | smoke | cross-browser | *(empty)* | ~10 × 4 = 40 |
| **Everything everywhere** | all | all | *(empty)* | ~70 × 4 = 280 |
| **Aviator on all browsers** | all | all | `@Aviator` | 10 × 4 = 40 |

### Rules to Remember
1. **`custom_grep` overrides `test_scope`** — if you fill in `@Aviator`, the scope dropdown is ignored
2. **`project_target` controls BrowserStack platforms** (OS/browser), not Playwright viewport projects
3. **`@Visual` tests are always excluded** from functional runs (via `--grep-invert @Visual`)
4. Responsive tests control their own viewport via `test.use({ viewport: ... })` inside the spec

---

## ⚡ Understanding Workers & Parallelism

Two settings control parallelism in BrowserStack runs:

| Setting | Where | What It Controls |
|---|---|---|
| `workers` | workflow (from `execution_profile`) | How many Playwright worker processes run in parallel |
| `parallelsPerPlatform` | `configs/browserstack.yml` / dynamic config | How many BrowserStack sessions per platform |

**Total concurrent BrowserStack sessions** ≈ `workers × parallelsPerPlatform × number_of_platforms`

### Safe Defaults for Free Trial
```
workers = 4  (from medium profile)
parallelsPerPlatform = 1
1 platform (desktop-chrome)
→ Up to 4 concurrent sessions
```

### If You Hit Queue Errors (`BROWSERSTACK_QUEUE_SIZE_EXCEEDED`)
- Reduce workers by using `execution_profile=fast` (3 workers)
- Or keep 1 platform only (`project_target=desktop-chrome`)
- Or reduce `parallelsPerPlatform` (already at 1 by default)

---

## 👁️ Percy Visual Regression

Visual tests capture screenshots and send them to Percy for pixel-level comparison.

### Local Run
```bash
# Full visual suite
npm run test:visual

# Fast visual run (Chrome only, no responsive)
npm run test:visual:fast

# Full visual matrix (Chrome + viewports)
npm run test:visual:full
```

### Percy Config (`configs/percy.yml`)
```yaml
version: 2
snapshot:
  widths: [1920]
  minHeight: 1024
  percy-css: |
    iframe { display: none !important; }
    #onetrust-banner-sdk { display: none !important; }
```

### Percy Dashboard
After a run, review visual diffs at: `https://percy.io/opentext/opentext-tta/`

---

## 🏭 Jenkins Pipeline

The `Jenkinsfile` supports both local and BrowserStack execution.

### Jenkins Parameters
| Parameter | Options | Description |
|---|---|---|
| `BROWSER` | desktop-chrome, desktop-firefox, desktop-safari, desktop-edge, all | Browser project |
| `ENVIRONMENT` | production, staging, qa, dev | Target environment |
| `TEST_SUITE` | all, smoke, regression, header, homepage, responsive | Test scope |
| `EXECUTION_PLATFORM` | browserstack, local | Where to run |
| `CUSTOM_GREP` | Free text | Custom filter |

### Jenkins Prerequisites
- Node.js 22+ (Global Tool: `NodeJS-22`)
- Credentials: `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`
- Plugins: HTML Publisher, AnsiColor, NodeJS, Timestamps

---

## 🏷️ Tags & Filtering System

### Priority Tags
| Tag | Meaning | When to Use |
|---|---|---|
| `@P0` | Critical — must never fail | Core flows, smoke |
| `@P1` | High — regression essentials | Feature coverage |
| `@P2` | Medium — nice to have | Edge cases, accessibility |

### Scope Tags
| Tag | Meaning |
|---|---|
| `@Smoke` | Quick health check |
| `@Regression` | Full feature regression |
| `@Responsive` | Viewport-specific tests |
| `@Visual` | Percy visual snapshots (excluded from functional) |

### Feature Tags
| Tag | Spec File |
|---|---|
| `@Header` | header.spec.ts |
| `@Homepage` | homepage.spec.ts |
| `@Aviator` | aviator-ai.spec.ts |
| `@CustomerStories` | customer-stories.spec.ts |
| `@XL @LG @MD @SM @XS` | responsive.spec.ts (viewport-specific) |

### Combining Tags
```bash
# Run only @P0 smoke tests
npx playwright test --grep "@P0.*@Smoke"

# Run Header OR Homepage
npx playwright test --grep "@Header|@Homepage"

# Run everything except visual
npx playwright test --grep-invert "@Visual"
```

---

## 📐 Viewport Breakpoints

| Breakpoint | Min Width | Type | Playwright Project | Test Data |
|---|---|---|---|---|
| XL | ≥ 1376px | Desktop | `viewport-xl` | `menus.json` |
| LG | ≥ 968px | Desktop | `viewport-lg` | `menus.json` |
| MD | ≥ 720px | Tablet | `viewport-md` | `menus.json` |
| SM | ≥ 576px | Mobile | `viewport-sm` | `menus.json` |
| XS | ≥ 440px | Mobile | `viewport-xs` | `menus.json` |

Desktop browsers use 1440×900 by default. Viewports are defined in both `playwright.config.ts` and `src/testdata/menus.json`.

---

## 🌐 Environment Configuration

### Supported Environments
| Environment | URL | How to Use |
|---|---|---|
| Production | `https://www.opentext.com` | Default |
| Staging | `https://staging.opentext.com` | `TEST_ENV=staging` |
| QA | `https://qa.opentext.com` | `TEST_ENV=qa` |
| Dev | `https://dev.opentext.com` | `TEST_ENV=dev` |

### Local Environment Switch
```bash
npm run test:qa          # Run against QA
npm run test:staging     # Run against Staging
npm run test:dev         # Run against Dev
```

### Config Loading Priority
1. Environment variables (CI sets these)
2. `.env.{TEST_ENV}` file (e.g., `.env.qa`)
3. `.env` file (fallback)

### Config Values (`src/config/index.ts`)
| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `https://www.opentext.com` | Target website URL |
| `DEFAULT_TIMEOUT` | 30000 | Default assertion timeout (ms) |
| `NAVIGATION_TIMEOUT` | 60000 | Page navigation timeout (ms) |
| `LOG_LEVEL` | INFO | Logger verbosity |
| `RETRY_COUNT` | 2 | Test retry count |

---

## 📊 AI Debug Reporter

Every test run generates an `AIC_DEBUG_REPORT.md` in the `ai-debug-report/` folder.

### What It Includes
- **Run Configuration**: Workflow inputs, BrowserStack platforms, Playwright projects, base URL
- **Run Summary**: Total/passed/failed/flaky/skipped counts
- **Failure Breakdown**: Auto-categorized into 4 types:
  - 🔗 **Locator Change** — DOM changed, locator stale → AI can auto-fix
  - 📝 **Script Issue** — Test code bug → AI can auto-fix
  - 🐛 **UI Bug** — Real application defect → File a bug
  - 🌐 **Environment Issue** — BrowserStack/network timeout → Retry
- **Defect Verdict**: Each failure marked as DEFECT, NOT A DEFECT, or INVESTIGATE
- **CLI Investigation Commands**: Ready-to-run `playwright-cli` commands per failure
- **Trace Links**: Direct links to Playwright trace files

### Reports Generated
| Report | Location | Format |
|---|---|---|
| AI Debug Report | `ai-debug-report/AIC_DEBUG_REPORT.md` | Markdown |
| HTML Report | `ai-debug-report/index.html` | Dark-theme HTML |
| JSON Results | `ai-debug-report/results.json` + `test-results/results.json` | JSON |
| Playwright Report | `playwright-report/index.html` | Standard Playwright HTML |

---

## 🆕 Automating a New Test Case

### Step 1: Add Locators to a Page Object

Create or update a file in `src/pages/`:

```typescript
// src/pages/MyNewPage.ts
import { expect, Page } from '@playwright/test';

export class MyNewPage {
    private page: Page;
    constructor(page: Page) { this.page = page; }

    // Locators (use getByRole for accessibility)
    heroTitle = () => this.page.getByRole('heading', { name: /My Hero Title/i });
    ctaButton = () => this.page.getByRole('link', { name: 'Learn More' });

    // Actions
    async expectHeroVisible(): Promise<void> {
        await expect(this.heroTitle()).toBeVisible();
    }
}
```

### Step 2: Add Business Logic to a Module

Create or update a file in `src/modules/`:

```typescript
// src/modules/MyNewModule.ts
import { Page } from '@playwright/test';
import { MyNewPage } from '../pages/MyNewPage';
import { Logger } from '../utils/Logger';

export class MyNewModule {
    private page: Page;
    private myPage: MyNewPage;
    private logger: Logger;

    constructor(page: Page) {
        this.page = page;
        this.myPage = new MyNewPage(page);
        this.logger = Logger.create('MyNewModule');
    }

    async navigateAndVerify(): Promise<void> {
        this.logger.step(1, 'Navigate to page');
        await this.page.goto('/my-page', { waitUntil: 'domcontentloaded' });

        this.logger.step(2, 'Verify hero section');
        await this.myPage.expectHeroVisible();
    }
}
```

### Step 3: Register Fixtures

Add to `src/fixtures/index.ts`:

```typescript
import { MyNewPage } from '../pages/MyNewPage';
import { MyNewModule } from '../modules/MyNewModule';

// Add to TestFixtures type:
myNewPage: MyNewPage;
myNewModule: MyNewModule;

// Add to test.extend:
myNewPage: async ({ page }, use) => { await use(new MyNewPage(page)); },
myNewModule: async ({ page }, use) => { await use(new MyNewModule(page)); },
```

### Step 4: Write the Test Spec

Create `src/tests/my-new.spec.ts`:

```typescript
import { test } from '../fixtures';

test.describe('@P0 @Regression @MyFeature My Feature Tests', () => {
    // ═══════════════════════════════════════
    // TC-MF01: Verify page loads
    // ═══════════════════════════════════════
    test('@P0 @Smoke should display my page correctly', async ({ myNewModule }) => {
        await test.step('Navigate and verify page loads', async () => {
            await myNewModule.navigateAndVerify();
        });
    });
});
```

### Step 5: Run & Verify
```bash
npx playwright test my-new.spec.ts --project=desktop-chrome --headed
```

---

## 🔍 Debugging Failures

### Using the AI Debug Report
1. Download the `functional-ai-report` artifact from GitHub Actions
2. Open `AIC_DEBUG_REPORT.md`
3. Each failure has a **category**, **verdict**, and **CLI investigation commands**
4. Run the commands to diagnose

### Using Playwright Traces
```bash
# Open trace viewer for a failed test
npx playwright show-trace test-results/path-to/trace.zip
```

### Using Playwright UI
```bash
# Re-run failed tests interactively
npm run test:ui
```

### Using playwright-cli (Live DOM Investigation)
```bash
playwright-cli open https://www.opentext.com
playwright-cli snapshot           # See full DOM tree
playwright-cli snapshot "#header" # Scope to element
playwright-cli click e15          # Click element ref
playwright-cli console            # See console errors
playwright-cli close
```

---

## 🤖 Using playwright-cli (AI Agent Tool)

`playwright-cli` is a CLI tool by Microsoft that lets AI coding agents interact with web pages to discover locators and debug tests.

### Install
```bash
npm install -g @playwright/cli@latest
```

### Key Commands
```bash
playwright-cli open https://www.opentext.com   # Open browser
playwright-cli snapshot                         # Accessibility tree
playwright-cli snapshot --depth=4               # Shallow snapshot
playwright-cli click e15                        # Click element
playwright-cli hover e22                        # Hover element
playwright-cli type "search text"               # Type text
playwright-cli screenshot                       # Take screenshot
playwright-cli eval "document.title"            # Evaluate JS
playwright-cli console                          # Console logs
playwright-cli network                          # Network requests
playwright-cli close                            # Close browser
```

### Workflow: From CLI Discovery → Test Code
```
playwright-cli snapshot → Find locator → Add to Page → Add logic to Module → Write test in Spec
```

---

## 🔌 Fixtures & Dependency Injection

All Page Objects and Modules are registered as Playwright fixtures in `src/fixtures/index.ts`.

### Available Fixtures
| Fixture | Type | Source |
|---|---|---|
| `headerPage` | HeaderPage | `src/pages/HeaderPage.ts` |
| `homepagePage` | HomepagePage | `src/pages/HomepagePage.ts` |
| `footerPage` | FooterPage | `src/pages/FooterPage.ts` |
| `customerStoriesPage` | CustomerStoriesPage | `src/pages/CustomerStoriesPage.ts` |
| `aviatorAiPage` | AviatorAiPage | `src/pages/AviatorAiPage.ts` |
| `headerModule` | HeaderModule | `src/modules/HeaderModule.ts` |
| `homepageModule` | HomepageModule | `src/modules/HomepageModule.ts` |
| `customerStoriesModule` | CustomerStoriesModule | `src/modules/CustomerStoriesModule.ts` |
| `visualModule` | VisualModule | `src/modules/VisualModule.ts` |
| `aviatorAiModule` | AviatorAiModule | `src/modules/AviatorAiModule.ts` |

### Usage in Tests
```typescript
import { test } from '../fixtures';

test('my test', async ({ headerModule, homepageModule }) => {
    // Fixtures are auto-injected
    await headerModule.navigateAndVerifyHeader();
});
```

---

## 🛠️ Utility Classes

| Class | File | Key Methods |
|---|---|---|
| `Logger` | `Logger.ts` | `Logger.create(name)`, `.step()`, `.info()`, `.warn()`, `.error()` |
| `WaitHelper` | `WaitHelper.ts` | Custom wait conditions beyond Playwright built-ins |
| `DataGenerator` | `DataGenerator.ts` | Random strings, emails, dates for parameterized tests |
| `SmartLocator` | `SmartLocator.ts` | Fallback locator strategies when primary fails |
| `FileHelper` | `FileHelper.ts` | Read/write files for data-driven testing |
| `IframeHelper` | `IframeHelper.ts` | Switch into iframes, find elements inside |
| `StringHelper` | `StringHelper.ts` | Text normalization, sanitization |
| `WindowHelper` | `WindowHelper.ts` | Multi-tab/window management |

---

## 📜 npm Scripts Reference

### Test Execution
| Script | Command |
|---|---|
| `npm test` | Run all tests |
| `npm run test:headed` | Run with visible browser |
| `npm run test:ui` | Interactive Playwright UI |
| `npm run test:debug` | Step-through debugger |

### By Suite
| Script | What Runs |
|---|---|
| `npm run test:header` | `@Header` tests |
| `npm run test:homepage` | `@Homepage` tests |
| `npm run test:responsive` | `@Responsive` tests |
| `npm run test:smoke` | `@Smoke` tests |
| `npm run test:regression` | `@Regression` tests |
| `npm run test:p0` | `@P0` tests |

### By Browser
| Script | Browser |
|---|---|
| `npm run test:chromium` | Chrome |
| `npm run test:firefox` | Firefox |
| `npm run test:webkit` | Safari |
| `npm run test:edge` | Edge |
| `npm run test:mobile` | Pixel 5 + iPhone 13 |
| `npm run test:tablet` | Galaxy Tab S4 |

### BrowserStack
| Script | Description |
|---|---|
| `npm run test:bstack` | Default BrowserStack run |
| `npm run test:bstack:fast` | BrowserStack with 4 workers |
| `npm run test:bstack:max` | BrowserStack with 5 workers |

### Visual
| Script | Description |
|---|---|
| `npm run test:visual` | Full Percy visual suite |
| `npm run test:visual:fast` | Chrome only, no responsive |
| `npm run test:visual:full` | Chrome + viewports |

### By Environment
| Script | Target |
|---|---|
| `npm run test:qa` | QA environment |
| `npm run test:staging` | Staging environment |
| `npm run test:dev` | Dev environment |

### Other
| Script | Description |
|---|---|
| `npm run test:report` | Open last HTML report |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier format |
| `npm run build` | TypeScript compile |
| `npm run clean` | Remove all output dirs |

---

## ❓ Troubleshooting

### `BROWSERSTACK_QUEUE_SIZE_EXCEEDED`
**Cause**: More parallel sessions requested than your BrowserStack plan allows.
**Fix**: Reduce `parallelsPerPlatform` in `configs/browserstack.yml` to 1. Use `execution_profile=fast` (3 workers).

### `Project(s) "desktop-chrome" not found`
**Cause**: BrowserStack SDK rewrites project names. You cannot pass `--project=` flags with BrowserStack.
**Fix**: This is already fixed in the workflow. The `project_target` input controls the BrowserStack platform config, not `--project` flags.

### Tests show blank platform info in BrowserStack dashboard
**Cause**: BrowserStack SDK assigns platform based on its config, not Playwright project names. Viewport projects (viewport-xl, etc.) don't map to BrowserStack sessions — they control browser window size only.
**Fix**: Expected behavior. Check the Playwright HTML report for project/viewport details.

### `custom_grep` overrides my scope
**Cause**: By design — `custom_grep` takes priority over `test_scope`.
**Fix**: Leave `custom_grep` empty if you want scope-based filtering.

### Tests pass locally but fail on BrowserStack
**Cause**: Different viewport sizes, network latency, or cookie/popup timing.
**Fix**: Check the AI Debug Report for categorization. Usually it's `Environment Issue` → retry, or `Locator Change` → update locator.

### `pre-push hook failed`
**Cause**: Broken git hook at `~/.git-hooks/pre-push`.
**Fix**: Use `git push --no-verify` to skip hooks, or fix the hook file.

---

## 📄 Test Case Coverage Summary

| Spec File | Unique Tests | Tags | Pages Tested |
|---|---|---|---|
| header.spec.ts | 8 | `@Header` | opentext.com homepage header |
| homepage.spec.ts | 8 | `@Homepage` | opentext.com homepage |
| aviator-ai.spec.ts | 10 | `@Aviator` | /aviator-ai, /limitless, /aviator-ai/myaviator |
| customer-stories.spec.ts | 4 | `@CustomerStories` | /customers |
| responsive.spec.ts | 40 (8×5) | `@Responsive` | Homepage at XL/LG/MD/SM/XS |
| visual.spec.ts | 14 | `@Visual` | Percy snapshots (homepage, header, footer, customer stories) |
| **Total** | **~84** | | |

---

*Built with Playwright, TypeScript, BrowserStack, Percy, and AI-assisted development via `@playwright/cli`.*

