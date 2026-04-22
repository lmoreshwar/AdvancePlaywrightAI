# Test Execution Commands Reference

Use this guide to run your tests in different environments and configurations.

## 1. Local Testing
Runs tests on your local machine using the configurations in `playwright.config.ts`.

| Goal | Command |
| :--- | :--- |
| **Run all tests** (Headless) | `npx playwright test` |
| **Run in Headed mode** (Visible) | `npx playwright test --headed` |
| **Run a specific test file** | `npx playwright test src/tests/header.spec.ts` |
| **Run a specific project** | `npx playwright test --project=desktop-chrome` |
| **Run a specific breakpoint** | `npx playwright test --project=viewport-xs` |
| **Open Playwright Inspector** | `npx playwright test --debug` |
| **Open Last Report** | `npx playwright show-report` |

## 2. BrowserStack Cloud Testing
Runs tests on the BrowserStack grid using `browserstack.yml` for infrastructure and `playwright.config.ts` for logic.

| Goal | Command |
| :--- | :--- |
| **Run all tests on BrowserStack** | `npm run test:bstack` |
| **Run specific file on BS** | `npm run test:bstack -- src/tests/header.spec.ts` |
| **Run specific project on BS** | `npm run test:bstack -- --project=desktop-chrome` |
| **Run specific viewport on BS** | `npm run test:bstack -- --project=viewport-md` |
| **Force 1 worker on BS** | `npm run test:bstack -- --workers=1` |

## 3. Useful Shortcuts
| Goal | Command |
| :--- | :--- |
| **Install/Update Playwright** | `npx playwright install` |
| **Check Playwright version** | `npx playwright --version` |
| **Clear old reports/logs** | `rm -rf test-results/ log/ ai-debug-report/` |

---

### Tips for "Proper" Framework Usage:
- **Project Names**: Valid project names are defined in `playwright.config.ts` (e.g., `desktop-chrome`, `viewport-xl`, `mobile-chrome`).
- **Combining Flags**: You can combine filters, for example:
  `npm run test:bstack -- src/tests/header.spec.ts --project=viewport-xs`
  *(This runs only the Header test, only in the extra-small viewport, on the BrowserStack cloud).*
