# 🔍 AIC Debug Report — Auto-Generated

**Generated**: 4/23/2026, 1:56:00 AM  
**Duration**: 299.7s  

## 📊 Run Summary

| Metric | Value |
|---|---|
| Total Tests | 2 |
| ✅ Passed | 1 |
| ❌ Failed | 2 |
| ⏭️ Skipped | 0 |

## 🗂️ Failure Breakdown by Category

| Category | Count | AI Healable |
|---|---|---|
| ❓ Unknown | 2 | ❌ No |

---

## 🔴 FAILURE #1

### 1. 🚨 Failure Summary
- **Test**: `Header Language Modal Visual @Regression`
- **Project**: `desktop-chrome`
- **Error Location**: `visual.spec.ts:47`
- **Error**:
```
TimeoutError: page.waitForLoadState: Timeout 90000ms exceeded.
```

### 2. 🗂️ Category: **❓ Unknown**

### 3. 🤖 Self-Healing
- **AI Healable**: ❌ No
- **Suggestion**: Manual investigation required. Check the error details and screenshot.

### 4. 📸 Screenshot
`C:\Users\DELL\AI Workspace\OpenText\test-results\visual--Visual-Visual-Regr-ae482-age-Modal-Visual-Regression-desktop-chrome\test-failed-1.png`

### 5. 🔬 Trace
`npx playwright show-trace C:\Users\DELL\AI Workspace\OpenText\test-results\visual--Visual-Visual-Regr-ae482-age-Modal-Visual-Regression-desktop-chrome\trace.zip`

---

## 🔴 FAILURE #2

### 1. 🚨 Failure Summary
- **Test**: `Header Language Modal Visual @Regression`
- **Project**: `desktop-chrome`
- **Error Location**: `visual.spec.ts:47`
- **Error**:
```
TimeoutError: page.waitForLoadState: Timeout 90000ms exceeded.
```

### 2. 🗂️ Category: **❓ Unknown**

### 3. 🤖 Self-Healing
- **AI Healable**: ❌ No
- **Suggestion**: Manual investigation required. Check the error details and screenshot.

### 4. 📸 Screenshot
`C:\Users\DELL\AI Workspace\OpenText\test-results\visual--Visual-Visual-Regr-ae482-age-Modal-Visual-Regression-desktop-chrome-retry1\test-failed-1.png`

### 5. 🔬 Trace
`npx playwright show-trace C:\Users\DELL\AI Workspace\OpenText\test-results\visual--Visual-Visual-Regr-ae482-age-Modal-Visual-Regression-desktop-chrome-retry1\trace.zip`

---

## 📋 Failure Category Guide

| Category | What It Means | AI Action |
|---|---|---|
| 🔗 Locator Change | DOM structure or element text changed | Self-heal with SmartLocator fallback |
| 📝 Script Issue | Test code logic error (strict mode, timeout) | Auto-fix the script |
| 🐛 UI Bug | Application behavior changed unexpectedly | ⚠️ Flag as bug to development team |
| 🌐 Environment Issue | Network, server, or infrastructure problem | Retry or check infra health |
