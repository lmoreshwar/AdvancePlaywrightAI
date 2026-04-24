# 🔍 AIC Debug Report — Auto-Generated

**Generated**: 24/4/2026, 5:42:10 pm  
**Duration**: 2.0s  
**Run Mode**: Complete  
**Run Note**: Completed run  
**Percy Visuals**: [👁️ View on Percy Dashboard](https://percy.io/opentext/opentext-tta/)

## 📊 Run Summary

| Metric | Value |
|---|---|
| Total Tests | 5 |
| ✅ Passed | 0 |
| ❌ Failed | 5 |
| ⚠️ Flaky (passed on retry) | 0 |
| ⏭️ Skipped | 0 |

## 🗂️ Failure Breakdown by Category

| Category | Count | AI Healable |
|---|---|---|
| ❓ Unknown | 5 | ❌ No |

## 🎯 Defect Verdict Summary

| Verdict | Count | Action |
|---|---|---|
| 🔍 INVESTIGATE | 5 | Run CLI commands below to determine |

---

## 🔴 FAILURE #1

### 1. 🚨 Failure Summary
- **Test**: `@P0 @Smoke R1: Aviator page title, header, secondary nav, and scroll behavior`
- **Project**: `desktop-chrome`
- **Error Location**: `Unknown location`
- **Error**:
```
Error: browserType.launch: Executable doesn't exist at C:\Users\MoreshwarLandge\AppData\Local\ms-playwright\chromium_headless_shell-1200\chrome-headless-shell-win64\chrome-headless-shell.exe
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║    
```

### 2. 🗂️ Category: **❓ Unknown**

### 3. 🎯 Defect Verdict: **🔍 INVESTIGATE**
> Cannot auto-determine. Run the `playwright-cli` investigation commands below to gather DOM evidence and determine root cause.

### 4. 🤖 Self-Healing
- **AI Healable**: ❌ No
- **Suggestion**: Run the investigation commands below to diagnose. Use `playwright-cli snapshot` for DOM evidence.

### 5. 🔧 Investigation Commands (playwright-cli / MCP)
```bash
playwright-cli open https://www.opentext.com
playwright-cli snapshot
# Full investigation — take deep snapshot and console logs:
playwright-cli snapshot --depth=6
playwright-cli console
playwright-cli network
npx playwright show-trace C:\Users\MoreshwarLandge\Autoamtion Workspace\Practive_AdvancePlaywrigtAI\AdvancePlaywrightAI\test-results\aviator-ai--P0-Regression--6e907-ary-nav-and-scroll-behavior-desktop-chrome\trace.zip
playwright-cli close
```

### 7. 🔬 Trace
`npx playwright show-trace C:\Users\MoreshwarLandge\Autoamtion Workspace\Practive_AdvancePlaywrigtAI\AdvancePlaywrightAI\test-results\aviator-ai--P0-Regression--6e907-ary-nav-and-scroll-behavior-desktop-chrome\trace.zip`

---

## 🔴 FAILURE #2

### 1. 🚨 Failure Summary
- **Test**: `@P1 @Regression R1: Scenario Library tabs and accordion interactions`
- **Project**: `desktop-chrome`
- **Error Location**: `Unknown location`
- **Error**:
```
Error: browserType.launch: Executable doesn't exist at C:\Users\MoreshwarLandge\AppData\Local\ms-playwright\chromium_headless_shell-1200\chrome-headless-shell-win64\chrome-headless-shell.exe
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║    
```

### 2. 🗂️ Category: **❓ Unknown**

### 3. 🎯 Defect Verdict: **🔍 INVESTIGATE**
> Cannot auto-determine. Run the `playwright-cli` investigation commands below to gather DOM evidence and determine root cause.

### 4. 🤖 Self-Healing
- **AI Healable**: ❌ No
- **Suggestion**: Run the investigation commands below to diagnose. Use `playwright-cli snapshot` for DOM evidence.

### 5. 🔧 Investigation Commands (playwright-cli / MCP)
```bash
playwright-cli open https://www.opentext.com
playwright-cli snapshot
# Full investigation — take deep snapshot and console logs:
playwright-cli snapshot --depth=6
playwright-cli console
playwright-cli network
npx playwright show-trace C:\Users\MoreshwarLandge\Autoamtion Workspace\Practive_AdvancePlaywrigtAI\AdvancePlaywrightAI\test-results\aviator-ai--P0-Regression--c8ee4--and-accordion-interactions-desktop-chrome\trace.zip
playwright-cli close
```

### 7. 🔬 Trace
`npx playwright show-trace C:\Users\MoreshwarLandge\Autoamtion Workspace\Practive_AdvancePlaywrigtAI\AdvancePlaywrightAI\test-results\aviator-ai--P0-Regression--c8ee4--and-accordion-interactions-desktop-chrome\trace.zip`

---

## 🔴 FAILURE #3

### 1. 🚨 Failure Summary
- **Test**: `@P1 @Regression R1: Aviator bento/playground cards and CTA links`
- **Project**: `desktop-chrome`
- **Error Location**: `Unknown location`
- **Error**:
```
Error: browserType.launch: Executable doesn't exist at C:\Users\MoreshwarLandge\AppData\Local\ms-playwright\chromium_headless_shell-1200\chrome-headless-shell-win64\chrome-headless-shell.exe
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║    
```

### 2. 🗂️ Category: **❓ Unknown**

### 3. 🎯 Defect Verdict: **🔍 INVESTIGATE**
> Cannot auto-determine. Run the `playwright-cli` investigation commands below to gather DOM evidence and determine root cause.

### 4. 🤖 Self-Healing
- **AI Healable**: ❌ No
- **Suggestion**: Run the investigation commands below to diagnose. Use `playwright-cli snapshot` for DOM evidence.

### 5. 🔧 Investigation Commands (playwright-cli / MCP)
```bash
playwright-cli open https://www.opentext.com
playwright-cli snapshot
# Full investigation — take deep snapshot and console logs:
playwright-cli snapshot --depth=6
playwright-cli console
playwright-cli network
npx playwright show-trace C:\Users\MoreshwarLandge\Autoamtion Workspace\Practive_AdvancePlaywrigtAI\AdvancePlaywrightAI\test-results\aviator-ai--P0-Regression--163dd-yground-cards-and-CTA-links-desktop-chrome\trace.zip
playwright-cli close
```

### 7. 🔬 Trace
`npx playwright show-trace C:\Users\MoreshwarLandge\Autoamtion Workspace\Practive_AdvancePlaywrigtAI\AdvancePlaywrightAI\test-results\aviator-ai--P0-Regression--163dd-yground-cards-and-CTA-links-desktop-chrome\trace.zip`

---

## 🔴 FAILURE #4

### 1. 🚨 Failure Summary
- **Test**: `@P0 @Smoke R2: Limitless page title, sections, and navigation controls`
- **Project**: `desktop-chrome`
- **Error Location**: `Unknown location`
- **Error**:
```
Error: browserType.launch: Executable doesn't exist at C:\Users\MoreshwarLandge\AppData\Local\ms-playwright\chromium_headless_shell-1200\chrome-headless-shell-win64\chrome-headless-shell.exe
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║    
```

### 2. 🗂️ Category: **❓ Unknown**

### 3. 🎯 Defect Verdict: **🔍 INVESTIGATE**
> Cannot auto-determine. Run the `playwright-cli` investigation commands below to gather DOM evidence and determine root cause.

### 4. 🤖 Self-Healing
- **AI Healable**: ❌ No
- **Suggestion**: Run the investigation commands below to diagnose. Use `playwright-cli snapshot` for DOM evidence.

### 5. 🔧 Investigation Commands (playwright-cli / MCP)
```bash
playwright-cli open https://www.opentext.com
playwright-cli snapshot
# Full investigation — take deep snapshot and console logs:
playwright-cli snapshot --depth=6
playwright-cli console
playwright-cli network
npx playwright show-trace C:\Users\MoreshwarLandge\Autoamtion Workspace\Practive_AdvancePlaywrigtAI\AdvancePlaywrightAI\test-results\aviator-ai--P0-Regression--6b77a-ons-and-navigation-controls-desktop-chrome\trace.zip
playwright-cli close
```

### 7. 🔬 Trace
`npx playwright show-trace C:\Users\MoreshwarLandge\Autoamtion Workspace\Practive_AdvancePlaywrigtAI\AdvancePlaywrightAI\test-results\aviator-ai--P0-Regression--6b77a-ons-and-navigation-controls-desktop-chrome\trace.zip`

---

## 🔴 FAILURE #5

### 1. 🚨 Failure Summary
- **Test**: `@P0 @Smoke R3: MyAviator title, hero, video, and plans table`
- **Project**: `desktop-chrome`
- **Error Location**: `Unknown location`
- **Error**:
```
Error: browserType.launch: Executable doesn't exist at C:\Users\MoreshwarLandge\AppData\Local\ms-playwright\chromium_headless_shell-1200\chrome-headless-shell-win64\chrome-headless-shell.exe
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║    
```

### 2. 🗂️ Category: **❓ Unknown**

### 3. 🎯 Defect Verdict: **🔍 INVESTIGATE**
> Cannot auto-determine. Run the `playwright-cli` investigation commands below to gather DOM evidence and determine root cause.

### 4. 🤖 Self-Healing
- **AI Healable**: ❌ No
- **Suggestion**: Run the investigation commands below to diagnose. Use `playwright-cli snapshot` for DOM evidence.

### 5. 🔧 Investigation Commands (playwright-cli / MCP)
```bash
playwright-cli open https://www.opentext.com
playwright-cli snapshot
# Full investigation — take deep snapshot and console logs:
playwright-cli snapshot --depth=6
playwright-cli console
playwright-cli network
npx playwright show-trace C:\Users\MoreshwarLandge\Autoamtion Workspace\Practive_AdvancePlaywrigtAI\AdvancePlaywrightAI\test-results\aviator-ai--P0-Regression--2a9b1--hero-video-and-plans-table-desktop-chrome\trace.zip
playwright-cli close
```

### 7. 🔬 Trace
`npx playwright show-trace C:\Users\MoreshwarLandge\Autoamtion Workspace\Practive_AdvancePlaywrigtAI\AdvancePlaywrightAI\test-results\aviator-ai--P0-Regression--2a9b1--hero-video-and-plans-table-desktop-chrome\trace.zip`

---

## 📋 Failure Category Guide

| Category | What It Means | AI Action |
|---|---|---|
| 🔗 Locator Change | DOM structure or element text changed | AI agent runs `playwright-cli snapshot` to find new locator |
| 📝 Script Issue | Test code logic error (strict mode, timeout) | Auto-fix the script |
| 🐛 UI Bug | Application behavior changed unexpectedly | 🚨 **DEFECT** — File bug to development team |
| 🌐 Environment Issue | Network, server, or infrastructure problem | Retry or check infra health |

## 🎯 Defect Verdict Guide

| Verdict | Meaning | What To Do |
|---|---|---|
| 🚨 DEFECT | Application has a real bug | File a bug report with the error details and evidence screenshots |
| ✅ NOT A DEFECT | Test code, locator, or infra issue | Fix the test, update locator, or retry |
| 🔍 INVESTIGATE | Cannot auto-determine | Run the `playwright-cli` commands to gather DOM evidence |
