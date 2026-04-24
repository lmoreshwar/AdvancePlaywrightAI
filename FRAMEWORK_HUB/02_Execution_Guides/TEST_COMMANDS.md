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
| **Run tagged tests on BS** | `npm run test:bstack -- --grep @Smoke` |
| **Force 1 worker on BS** | `npm run test:bstack -- --workers=1` |

## 3. Useful Shortcuts
| Goal | Command |
| :--- | :--- |
| **Install/Update Playwright** | `npx playwright install` |
| **Check Playwright version** | `npx playwright --version` |
| **Clear old reports/logs** | `rm -rf test-results/ log/ ai-debug-report/` |

---

### Tips for "Proper" Framework Usage:
- **Project Names**: Valid project names are defined in `playwright.config.ts` and apply to local runs.
- **BrowserStack Targets**: Use `configs/browserstack.yml` or workflow inputs to control browser/device targets.
- **Combining Flags**: You can combine filters, for example:
  `npm run test:bstack -- src/tests/header.spec.ts --grep @Responsive`
  *(This runs only the Header test on the BrowserStack cloud, filtered by the Responsive tag).* 

## 4. AI Prompts & Shortcuts (Platform Agnostic)
Attach the relevant prompt guide and source document into your AI chat, and copy-paste these shortcuts. More details are in `FRAMEWORK_HUB/03_AI_Commands/PROMPT_SHORTCUTS.md`.

| Source Document | Prompt Example |
| :--- | :--- |
| **Requirements** | `Review requirement.md for [Feature]. Generate 100% coverage plan, then automate. Ref: PROMPT_NEW_AUTOMATION.md. Show plan first.` |
| **User Stories** | `Review user_stories.md for [Story]. Automate tests based on acceptance criteria. Ref: PROMPT_NEW_AUTOMATION.md. Show plan first.` |
| **Test Cases**   | `Create functional tests for the following from testcases.md: [TC data]. Ref: PROMPT_NEW_AUTOMATION.md. Show plan first.` |
