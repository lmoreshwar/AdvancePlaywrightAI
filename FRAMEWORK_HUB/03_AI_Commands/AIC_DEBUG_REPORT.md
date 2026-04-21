# 🔍 AIC Debug Report — Auto-Generated

**Generated**: 4/22/2026, 1:16:11 AM  
**Duration**: 87.2s  

## 📊 Run Summary

| Metric | Value |
|---|---|
| Total Tests | 1 |
| ✅ Passed | 0 |
| ❌ Failed | 2 |
| ⏭️ Skipped | 0 |

## 🗂️ Failure Breakdown by Category

| Category | Count | AI Healable |
|---|---|---|
| 📝 Script Issue | 2 | ✅ Yes |

---

## 🔴 FAILURE #1

### 1. 🚨 Failure Summary
- **Test**: `@P1 @Regression should open language switcher modal`
- **Project**: `desktop-chrome`
- **Error Location**: `HeaderPage.ts:167`
- **Error**:
```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Choose your region').first().or(locator('text=Americas').first())
Expected: visible
Error: strict mode violation: locator('text=Choose your region').first().or(locator('text=Americas').first()) resolved to 2 elements:
    1) <h4 id="language-modal-label" class="modal-title pb-2 pb-md-3 pb-lg-4 pr-2 pr-lg-0">Choose your region:</h4> aka getByRole('heading', { name: 'Choose your region:' })
    2) <h3 class="text-sm font-weight-bo
```

### 2. 🗂️ Category: **📝 Script Issue**

### 3. 🤖 Self-Healing
- **AI Healable**: ✅ Yes
- **Suggestion**: Fix the script logic (e.g., add .first() for strict mode, increase timeout, fix assertion).

### 4. 📸 Screenshot
`C:\Users\DELL\AI Workspace\OpenText\test-results\header--P0-Regression-Head-7eb69-pen-language-switcher-modal-desktop-chrome\test-failed-1.png`

### 5. 🔬 Trace
`npx playwright show-trace C:\Users\DELL\AI Workspace\OpenText\test-results\header--P0-Regression-Head-7eb69-pen-language-switcher-modal-desktop-chrome\trace.zip`

---

## 🔴 FAILURE #2

### 1. 🚨 Failure Summary
- **Test**: `@P1 @Regression should open language switcher modal`
- **Project**: `desktop-chrome`
- **Error Location**: `HeaderPage.ts:167`
- **Error**:
```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Choose your region').first().or(locator('text=Americas').first())
Expected: visible
Error: strict mode violation: locator('text=Choose your region').first().or(locator('text=Americas').first()) resolved to 2 elements:
    1) <h4 id="language-modal-label" class="modal-title pb-2 pb-md-3 pb-lg-4 pr-2 pr-lg-0">Choose your region:</h4> aka getByRole('heading', { name: 'Choose your region:' })
    2) <h3 class="text-sm font-weight-bo
```

### 2. 🗂️ Category: **📝 Script Issue**

### 3. 🤖 Self-Healing
- **AI Healable**: ✅ Yes
- **Suggestion**: Fix the script logic (e.g., add .first() for strict mode, increase timeout, fix assertion).

### 4. 📸 Screenshot
`C:\Users\DELL\AI Workspace\OpenText\test-results\header--P0-Regression-Head-7eb69-pen-language-switcher-modal-desktop-chrome-retry1\test-failed-1.png`

### 5. 🔬 Trace
`npx playwright show-trace C:\Users\DELL\AI Workspace\OpenText\test-results\header--P0-Regression-Head-7eb69-pen-language-switcher-modal-desktop-chrome-retry1\trace.zip`

---

## 📋 Failure Category Guide

| Category | What It Means | AI Action |
|---|---|---|
| 🔗 Locator Change | DOM structure or element text changed | Self-heal with SmartLocator fallback |
| 📝 Script Issue | Test code logic error (strict mode, timeout) | Auto-fix the script |
| 🐛 UI Bug | Application behavior changed unexpectedly | ⚠️ Flag as bug to development team |
| 🌐 Environment Issue | Network, server, or infrastructure problem | Retry or check infra health |
