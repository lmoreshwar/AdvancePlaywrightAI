# 🔍 AIC Debug Report — Auto-Generated

**Generated**: 4/22/2026, 10:48:39 PM  
**Duration**: 309.5s  

## 📊 Run Summary

| Metric | Value |
|---|---|
| Total Tests | 11 |
| ✅ Passed | 8 |
| ❌ Failed | 3 |
| ⏭️ Skipped | 2 |

## 🗂️ Failure Breakdown by Category

| Category | Count | AI Healable |
|---|---|---|
| 🔗 Locator Change | 1 | ✅ Yes |
| ❓ Unknown | 2 | ❌ No |

---

## 🔴 FAILURE #1

### 1. 🚨 Failure Summary
- **Test**: `Header Language Modal Visual @Regression`
- **Project**: `desktop-chrome`
- **Error Location**: `HeaderPage.ts:143`
- **Error**:
```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: /Choose your country/i }).first()
    - found getByRole('button', { name: 'Accept All' }), intercepting action to run the handler
    - locator handler has finished
    - interception handler has finished, continuing
    - locator resolved to <a href="#" id="footer-locale" data-toggle="modal" data-target="#language-modal" class="nav-link d-flex text-body">…</a>
  - attempting click action
 
```

### 2. 🗂️ Category: **🔗 Locator Change**

### 3. 🤖 Self-Healing
- **AI Healable**: ✅ Yes
- **Suggestion**: Use SmartLocator with fallback strategies or update the locator to match the current DOM.

### 4. 📸 Screenshot
`C:\Users\DELL\AI Workspace\OpenText\test-results\visual--Visual-Visual-Regr-ae482-age-Modal-Visual-Regression-desktop-chrome\test-failed-1.png`

### 5. 🔬 Trace
`npx playwright show-trace C:\Users\DELL\AI Workspace\OpenText\test-results\visual--Visual-Visual-Regr-ae482-age-Modal-Visual-Regression-desktop-chrome\trace.zip`

---

## 🔴 FAILURE #2

### 1. 🚨 Failure Summary
- **Test**: `Customer Stories Filtered Results Visual @Regression`
- **Project**: `desktop-chrome`
- **Error Location**: `WaitHelper.ts:77`
- **Error**:
```
TimeoutError: page.waitForLoadState: Timeout 15000ms exceeded.
```

### 2. 🗂️ Category: **❓ Unknown**

### 3. 🤖 Self-Healing
- **AI Healable**: ❌ No
- **Suggestion**: Manual investigation required. Check the error details and screenshot.

### 4. 📸 Screenshot
`C:\Users\DELL\AI Workspace\OpenText\test-results\visual--Visual-Visual-Regr-8f2c1-d-Results-Visual-Regression-desktop-chrome\test-failed-1.png`

### 5. 🔬 Trace
`npx playwright show-trace C:\Users\DELL\AI Workspace\OpenText\test-results\visual--Visual-Visual-Regr-8f2c1-d-Results-Visual-Regression-desktop-chrome\trace.zip`

---

## 🔴 FAILURE #3

### 1. 🚨 Failure Summary
- **Test**: `Customer Stories Filtered Results Visual @Regression`
- **Project**: `desktop-chrome`
- **Error Location**: `WaitHelper.ts:77`
- **Error**:
```
TimeoutError: page.waitForLoadState: Timeout 15000ms exceeded.
```

### 2. 🗂️ Category: **❓ Unknown**

### 3. 🤖 Self-Healing
- **AI Healable**: ❌ No
- **Suggestion**: Manual investigation required. Check the error details and screenshot.

### 4. 📸 Screenshot
`C:\Users\DELL\AI Workspace\OpenText\test-results\visual--Visual-Visual-Regr-8f2c1-d-Results-Visual-Regression-desktop-chrome-retry1\test-failed-1.png`

### 5. 🔬 Trace
`npx playwright show-trace C:\Users\DELL\AI Workspace\OpenText\test-results\visual--Visual-Visual-Regr-8f2c1-d-Results-Visual-Regression-desktop-chrome-retry1\trace.zip`

---

## 📋 Failure Category Guide

| Category | What It Means | AI Action |
|---|---|---|
| 🔗 Locator Change | DOM structure or element text changed | Self-heal with SmartLocator fallback |
| 📝 Script Issue | Test code logic error (strict mode, timeout) | Auto-fix the script |
| 🐛 UI Bug | Application behavior changed unexpectedly | ⚠️ Flag as bug to development team |
| 🌐 Environment Issue | Network, server, or infrastructure problem | Retry or check infra health |
