# 🔍 AIC Debug Report — Auto-Generated

**Generated**: 4/22/2026, 5:13:02 PM  
**Duration**: 1210.7s  

## 📊 Run Summary

| Metric | Value |
|---|---|
| Total Tests | 62 |
| ✅ Passed | 57 |
| ❌ Failed | 5 |
| ⏭️ Skipped | 4 |

## 🗂️ Failure Breakdown by Category

| Category | Count | AI Healable |
|---|---|---|
| ❓ Unknown | 1 | ❌ No |
| 🔗 Locator Change | 4 | ✅ Yes |

---

## 🔴 FAILURE #1

### 1. 🚨 Failure Summary
- **Test**: `@P1 @Regression should return exactly 19 results for deep filter`
- **Project**: `-latest:Windows 10-browserstack`
- **Error Location**: `CustomerStoriesModule.ts:90`
- **Error**:
```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

### 2. 🗂️ Category: **❓ Unknown**

### 3. 🤖 Self-Healing
- **AI Healable**: ❌ No
- **Suggestion**: Manual investigation required. Check the error details and screenshot.

### 5. 🔬 Trace
`npx playwright show-trace C:\Users\DELL\AI Workspace\OpenText\test-results\customer-stories--P0-Regre-9e93a--19-results-for-deep-filter--latest-Windows-10-browserstack-retry1\trace.zip`

---

## 🔴 FAILURE #2

### 1. 🚨 Failure Summary
- **Test**: `should have sticky header at SM`
- **Project**: `-latest:Windows 10-browserstack`
- **Error Location**: `FooterPage.ts:67`
- **Error**:
```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('contentinfo').locator('a').first() to be visible
    58 × locator resolved to hidden <a target="_blank" href="https://careers.opentext.com/">Careers</a>
```

### 2. 🗂️ Category: **🔗 Locator Change**

### 3. 🤖 Self-Healing
- **AI Healable**: ✅ Yes
- **Suggestion**: Use SmartLocator with fallback strategies or update the locator to match the current DOM.

### 4. 📸 Screenshot
`C:\Users\DELL\AI Workspace\OpenText\test-results\responsive--P0-Regression--ca326-ld-have-sticky-header-at-SM--latest-Windows-10-browserstack4\test-failed-1.png`

### 5. 🔬 Trace
`npx playwright show-trace C:\Users\DELL\AI Workspace\OpenText\test-results\responsive--P0-Regression--ca326-ld-have-sticky-header-at-SM--latest-Windows-10-browserstack4\trace.zip`

---

## 🔴 FAILURE #3

### 1. 🚨 Failure Summary
- **Test**: `should have sticky header at SM`
- **Project**: `-latest:Windows 10-browserstack`
- **Error Location**: `FooterPage.ts:67`
- **Error**:
```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('contentinfo').locator('a').first() to be visible
    58 × locator resolved to hidden <a target="_blank" href="https://careers.opentext.com/">Careers</a>
```

### 2. 🗂️ Category: **🔗 Locator Change**

### 3. 🤖 Self-Healing
- **AI Healable**: ✅ Yes
- **Suggestion**: Use SmartLocator with fallback strategies or update the locator to match the current DOM.

### 4. 📸 Screenshot
`C:\Users\DELL\AI Workspace\OpenText\test-results\responsive--P0-Regression--ca326-ld-have-sticky-header-at-SM--latest-Windows-10-browserstack4-retry1\test-failed-1.png`

### 5. 🔬 Trace
`npx playwright show-trace C:\Users\DELL\AI Workspace\OpenText\test-results\responsive--P0-Regression--ca326-ld-have-sticky-header-at-SM--latest-Windows-10-browserstack4-retry1\trace.zip`

---

## 🔴 FAILURE #4

### 1. 🚨 Failure Summary
- **Test**: `should have sticky header at XS`
- **Project**: `-latest:Windows 10-browserstack`
- **Error Location**: `FooterPage.ts:67`
- **Error**:
```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('contentinfo').locator('a').first() to be visible
    57 × locator resolved to hidden <a target="_blank" href="https://careers.opentext.com/">Careers</a>
```

### 2. 🗂️ Category: **🔗 Locator Change**

### 3. 🤖 Self-Healing
- **AI Healable**: ✅ Yes
- **Suggestion**: Use SmartLocator with fallback strategies or update the locator to match the current DOM.

### 4. 📸 Screenshot
`C:\Users\DELL\AI Workspace\OpenText\test-results\responsive--P0-Regression--71568-ld-have-sticky-header-at-XS--latest-Windows-10-browserstack4\test-failed-1.png`

### 5. 🔬 Trace
`npx playwright show-trace C:\Users\DELL\AI Workspace\OpenText\test-results\responsive--P0-Regression--71568-ld-have-sticky-header-at-XS--latest-Windows-10-browserstack4\trace.zip`

---

## 🔴 FAILURE #5

### 1. 🚨 Failure Summary
- **Test**: `should have sticky header at XS`
- **Project**: `-latest:Windows 10-browserstack`
- **Error Location**: `FooterPage.ts:67`
- **Error**:
```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('contentinfo').locator('a').first() to be visible
    56 × locator resolved to hidden <a target="_blank" href="https://careers.opentext.com/">Careers</a>
```

### 2. 🗂️ Category: **🔗 Locator Change**

### 3. 🤖 Self-Healing
- **AI Healable**: ✅ Yes
- **Suggestion**: Use SmartLocator with fallback strategies or update the locator to match the current DOM.

### 4. 📸 Screenshot
`C:\Users\DELL\AI Workspace\OpenText\test-results\responsive--P0-Regression--71568-ld-have-sticky-header-at-XS--latest-Windows-10-browserstack4-retry1\test-failed-1.png`

### 5. 🔬 Trace
`npx playwright show-trace C:\Users\DELL\AI Workspace\OpenText\test-results\responsive--P0-Regression--71568-ld-have-sticky-header-at-XS--latest-Windows-10-browserstack4-retry1\trace.zip`

---

## 📋 Failure Category Guide

| Category | What It Means | AI Action |
|---|---|---|
| 🔗 Locator Change | DOM structure or element text changed | Self-heal with SmartLocator fallback |
| 📝 Script Issue | Test code logic error (strict mode, timeout) | Auto-fix the script |
| 🐛 UI Bug | Application behavior changed unexpectedly | ⚠️ Flag as bug to development team |
| 🌐 Environment Issue | Network, server, or infrastructure problem | Retry or check infra health |
