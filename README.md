# 🚀 OpenText Playwright Automation Framework

AI-powered Playwright test automation framework for **https://www.opentext.com** using `@playwright/cli` with SKILLS.

## 📁 Framework Architecture

```
OpenText/
├── .playwright/cli.config.json     ← @playwright/cli configuration
├── playwright.config.ts             ← Playwright project configuration
├── package.json                     ← Dependencies & scripts
├── tsconfig.json                    ← TypeScript configuration
├── .env                             ← Environment variables
├── src/
│   ├── config/index.ts              ← App config, URLs, menu constants
│   ├── fixtures/index.ts            ← Playwright test fixtures (Page & Module DI)
│   ├── pages/                       ← 🔵 Layer 1: Page Objects
│   │   ├── HeaderPage.ts            ← Header locators & actions
│   │   ├── HomepagePage.ts          ← Homepage locators & actions
│   │   └── FooterPage.ts            ← Footer locators & actions
│   ├── modules/                     ← 🟡 Layer 2: Business Logic
│   │   ├── HeaderModule.ts          ← Header test workflows
│   │   └── HomepageModule.ts        ← Homepage test workflows
│   ├── tests/                       ← 🟢 Layer 3: Test Specs
│   │   ├── header.spec.ts           ← Header regression tests
│   │   ├── homepage.spec.ts         ← Homepage regression tests
│   │   └── responsive.spec.ts       ← Cross-viewport tests (XL/LG/MD/SM/XS)
│   ├── testdata/                    ← Test data (JSON + types)
│   │   ├── menus.json               ← Menu items & viewport data
│   │   └── types.ts                 ← TypeScript type definitions
│   └── utils/                       ← Utilities
│       ├── Logger.ts                ← Structured logging
│       ├── WaitHelper.ts            ← Custom wait conditions
│       ├── DataGenerator.ts         ← Random data generation
│       └── AiDebugReporter.ts       ← HTML/JSON test reporter
├── testcases.md                     ← Original test cases
└── requirement.md                   ← Requirements document
```

## 🏗️ 3-Layer Architecture

```
┌─────────────────────────────────────────────┐
│  Layer 3: TESTS  (*.spec.ts)                │
│  test('should display header', async () {}) │
│  ↓ uses                                     │
├─────────────────────────────────────────────┤
│  Layer 2: MODULES  (*Module.ts)             │
│  headerModule.verifyLogo()                  │
│  ↓ orchestrates                             │
├─────────────────────────────────────────────┤
│  Layer 1: PAGES  (*Page.ts)                 │
│  logo = () => this.page.locator(...)        │
└─────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Install @playwright/cli globally
npm install -g @playwright/cli@latest

# 4. Install CLI skills (optional, for AI agents)
playwright-cli install --skills

# 5. Run all tests
npm test

# 6. Run specific test suites
npm run test:header
npm run test:homepage
npm run test:responsive
```

---

## 🤖 Using @playwright/cli (AI-Powered Test Development)

### What is `@playwright/cli`?
It's a CLI tool by Microsoft that lets AI coding agents (and you manually) interact with web pages to **discover locators, test flows, and generate Playwright test code**.

> **This is NOT the same as `npx playwright codegen`**. The CLI is optimized for coding agents, uses accessibility snapshots instead of screenshots, and is far more token-efficient.

### Installation
```bash
npm install -g @playwright/cli@latest
```

### How to Automate a Test Case Using @playwright/cli

Here's a **complete walkthrough** using Test Case TC-H02 (Verify OpenText Logo):

#### Step 1: Open the website
```bash
playwright-cli open https://www.opentext.com --headed
```

#### Step 2: Take a snapshot (discover page structure)
```bash
playwright-cli snapshot
```
This outputs the accessibility tree with element references (e.g., `e15`, `e22`).

#### Step 3: Interact with elements
```bash
# Click on a menu
playwright-cli click e15

# Hover on a menu item
playwright-cli hover e22

# Type in a search box
playwright-cli type "search term"

# Press keyboard keys
playwright-cli press Enter
playwright-cli press Tab
```

#### Step 4: Take a screenshot
```bash
playwright-cli screenshot
playwright-cli screenshot e15   # Screenshot specific element
```

#### Step 5: Get specific element details
```bash
playwright-cli snapshot e15     # Snapshot of just the logo element
```

#### Step 6: Close the browser
```bash
playwright-cli close
```

### 🎯 Sample: Automating TC-H02 (Verify Logo) Step by Step

```bash
# 1. Open the site
playwright-cli open https://www.opentext.com --headed

# 2. Snapshot to find the logo
playwright-cli snapshot --depth=3
# Output: ...e5[img, alt="OpenText"]...

# 3. Screenshot the logo
playwright-cli screenshot e5

# 4. Now translate to Page Object code:
```

**Generated code for HeaderPage.ts:**
```typescript
// Based on snapshot ref e5
logo = () => this.page.getByRole('img', { name: 'OpenText' });
```

**Generated test code for header.spec.ts:**
```typescript
test('should display OpenText logo', async ({ headerPage }) => {
  await headerPage.expectLogoVisible();
  // Verify dimensions
  const box = await headerPage.logo().boundingBox();
  expect(box?.width).toBeGreaterThan(20);
});
```

### 🔄 Workflow: From CLI → Page Object → Module → Test

```
                ┌──────────────────────┐
                │  playwright-cli      │
                │  snapshot / click    │
                │  hover / screenshot  │
                └──────────┬───────────┘
                           │ discover locators
                           ▼
                ┌──────────────────────┐
                │  Page Object         │
                │  HeaderPage.ts       │
                │  logo = () => ...    │
                └──────────┬───────────┘
                           │ compose actions
                           ▼
                ┌──────────────────────┐
                │  Module              │
                │  HeaderModule.ts     │
                │  verifyLogo()        │
                └──────────┬───────────┘
                           │ used by
                           ▼
                ┌──────────────────────┐
                │  Test                │
                │  header.spec.ts      │
                │  test('logo'...)     │
                └──────────────────────┘
```

### 🧠 Using CLI with AI Coding Agents

When using with Cursor, VS Code Copilot, or Claude Code:

```
Prompt: "Use playwright-cli to test the OpenText header navigation. 
Open https://www.opentext.com, snapshot the page, identify all 7 main 
menu items, hover over each to open submenus, and generate Playwright 
test code in TypeScript."
```

The AI agent will execute:
```bash
playwright-cli open https://www.opentext.com --headed
playwright-cli snapshot
playwright-cli hover e15   # "Why OpenText"
playwright-cli snapshot    # capture submenu
playwright-cli press Escape
# ... repeat for all menus
playwright-cli close
```

### 📊 Session Management
```bash
# Use named sessions for different test areas
playwright-cli -s=header open https://www.opentext.com --headed
playwright-cli -s=footer open https://www.opentext.com --headed

# List active sessions
playwright-cli list

# Close all sessions
playwright-cli close-all
```

---

## 🧪 Running Tests

### By Test Suite
```bash
npm run test:header      # Header tests only
npm run test:homepage    # Homepage tests only
npm run test:responsive  # All viewport tests
```

### By Tag
```bash
npm run test:smoke       # @Smoke tests
npm run test:regression  # @Regression tests
npm run test:p0          # @P0 critical tests
```

### By Browser
```bash
npm run test:chromium    # Chrome
npm run test:firefox     # Firefox
npm run test:webkit      # Safari
npm run test:edge        # Edge
```

### By Device
```bash
npm run test:mobile      # Mobile Chrome + Safari
npm run test:tablet      # Tablet Chrome
```

### Debug Mode
```bash
npm run test:debug       # Step-by-step debugger
npm run test:ui          # Interactive UI mode
npm run test:headed      # See the browser
```

---

## 📐 Viewport Breakpoints

| Name | Width   | Type    | Project             |
|------|---------|---------|---------------------|
| XL   | ≥1376px | Desktop | `viewport-xl`       |
| LG   | ≥968px  | Desktop | `viewport-lg`       |
| MD   | ≥720px  | Tablet  | `viewport-md`       |
| SM   | ≥576px  | Mobile  | `viewport-sm`       |
| XS   | ≥440px  | Mobile  | `viewport-xs`       |

---

## 📊 Reports

After running tests:
- **AI Debug Report**: `ai-debug-report/index.html` (custom dark-theme HTML report)
- **Playwright Report**: `npx playwright show-report`
- **JSON Results**: `test-results/results.json`

---

## 🔮 Future Scope (from requirements)

- [ ] BrowserStack integration for cross-device testing
- [ ] Visual regression testing (pixel-level comparison)
- [ ] Jenkins CI/CD pipeline
- [ ] Daily execution with email reports
- [ ] Multi-language testing (German, French, Japanese)
- [ ] Regional page testing

---

## 📝 Test Case Coverage

| Category              | Test Cases | Tags               |
|-----------------------|------------|---------------------|
| Header Regression     | 7+         | @Header @Regression |
| Homepage Regression   | 8          | @Homepage @Smoke    |
| Responsive (per VP)   | 6x5 = 30  | @Responsive @VP     |
| **Total**             | **45+**    |                     |
