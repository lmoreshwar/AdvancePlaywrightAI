# 🧪 OpenText Test Cases (Complete)

---

## 🔹 Regression Test: Header

**Objective:** Verify Header functionality

| Name                    | Step                                                                                                                                                                                                                                                                                                                                                                        | Test Data                                                                                                                                                                                                                                                                                                                                                                                                              | Expected Result                                                                                                                                                                                                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Regression Test: Header | Navigate to Homepage                                                                                                                                                                                                                                                                                                                                                        | Func Spec: Func Specs - C03.4 Header Mega Menu - OpenText Web Programs - Confluence https://opentexthq.atlassian.net/wiki/spaces/OTWP/pages/3859087361/Func+Specs+-+C03.4+Header+Mega+Menu Figma for C01.6: OT BPv1 → Components – Figma https://www.figma.com/design/1IYu4YxNN2ow0n76LlA4Xc/OT-BPv1-%E2%86%92-Components?node-id=4217-11834&p=f&t=6BLleM3Pi43e84ME-0 https://lsds.uat.corpcloud.opentext.com/homepage | Header should be shown                                                                                                                                                                                                                                                                   |
|                         | Verify opentext logo in all viewports                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                                                                                                                                                                                                                                        | Logo should be shown in correct size and should not shrink in smaller viewports                                                                                                                                                                                                          |
|                         | Verify Header Menus in all view ports (Desktop/Tablet/Mobile) Why OpenText Products Solutions Services Partners Support Resources Search Icon Language switcher My Account Contact button Refer to Functional specs for understanding how menus shrink at different breakpoints                                                                                             |                                                                                                                                                                                                                                                                                                                                                                                                                        | All menus should show up correctly in all viewports and different breakpoints                                                                                                                                                                                                            |
|                         | Navigate through all the submenus of all 7 main menu items: Why OpenText, Products, Solutions, Services, Partners, Support, Resources. Open each menu till all submenu items are visible and close them. In mobile & tablet view ensure Overview link is displayed if there are submenus below. Click through links under 7 main menu items to confirm they open correctly. |                                                                                                                                                                                                                                                                                                                                                                                                                        | User is able to navigate through submenu by expanding and collapsing. User is able to open the page associated with submenu items by clicking on them. Verify if the submenu under each menu is in same horizontal line. Links like 'About OpenText' should be visible in all viewports. |
|                         | Verify Tabbing works on all menus. Note: Applicable for Desktop viewport only.                                                                                                                                                                                                                                                                                              |                                                                                                                                                                                                                                                                                                                                                                                                                        | Tab functionality should work                                                                                                                                                                                                                                                            |
|                         | Click on the language switcher and verify that the Language switcher modal shows up                                                                                                                                                                                                                                                                                         |                                                                                                                                                                                                                                                                                                                                                                                                                        | Language switcher modal should show up                                                                                                                                                                                                                                                   |
|                         | Verify Contact button in mobile viewport                                                                                                                                                                                                                                                                                                                                    |                                                                                                                                                                                                                                                                                                                                                                                                                        | Contact button should show at the bottom of the header menus in mobile viewport. Click on the Contact button in each viewport to confirm it works.                                                                                                                                       |

---

## 🔹 Regression Test: HomePage

**Objective:** Verify that Homepage is not broken and renders correctly

| Name                      | Step                                                                                                                                                             | Test Data | Expected Result                                                                                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Regression Test: HomePage | Navigate to new Homepage of OpenText https://www.opentext.com/                                                                                                   |           | Verify that opentext.com homepage is displayed                                                                                                                                       |
|                           | Validate the header menus in all view ports Why OpenText Products Solutions Services Partners Support Resources                                                  |           | Header menus should be displayed correctly. Note: As per existing design, all 5 main menus are displayed in 'xl' viewport only and hamburger is displayed for rest of the viewports. |
|                           | Validate My Account, Language Switcher, Search and Contact menus on the Homepage in all viewports                                                                |           | Verify that the header links are shown correctly in all viewports (Refer: figma). Note: Contact button behavior differs by viewport                                                  |
|                           | For each component from Header to Footer, verify padding (between components, borders, spacing between UI elements) on the homepage. Ensure browser zoom is 100% |           | There should not be any extra/unwanted padding added in the homepage. Page should occupy full screen without white padding                                                           |
|                           | Verify that all homepage components render correctly                                                                                                             |           | Match the homepage components with the figma & functional specs                                                                                                                      |
|                           | Verify homepage in BrowserStack (Tablet & Mobile). Validate full-width scroller behavior, hover, clickable cards, height consistency                             |           | Components should work as specified in Figma. Scroller should not leave blank pages                                                                                                  |
|                           | Scroll to the bottom of the page                                                                                                                                 |           | Verify that the Header menu is sticky                                                                                                                                                |
|                           | Verify that the Footer menu is displayed correctly in all viewports                                                                                              |           | Footer should display correctly                                                                                                                                                      |

---

## 🔹 Regression Test: Homepage Across Viewports

**Objective:** Verify Homepage across all Viewports

---

### 📋 XL Viewport (>=1376)

| Step                                                       | Test Data                                                           | Expected Result                             |
| ---------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------- |
| Verify Products menu in 'xl' viewport                      | Figma: P01 - Home page / R3                                         | Products menu should be correctly displayed |
| Navigate to Homepage https://www.opentext.com/             | Figma + Functional Specs                                            | Verify homepage loads                       |
| Validate header menus                                      | Why OpenText Products Solutions Services Partners Support Resources | Header menus should display correctly       |
| Validate My Account, Language Switcher, Search and Contact |                                                                     | Links display correctly                     |
| Verify padding/layout                                      |                                                                     | No unwanted spacing                         |
| Verify components                                          |                                                                     | Match Figma                                 |
| Verify scroller behavior                                   |                                                                     | Works correctly without blank pages         |
| Scroll to bottom                                           |                                                                     | Header is sticky                            |
| Verify footer                                              |                                                                     | Footer displays correctly                   |

---

### 📋 LG Viewport (>=968)

| Step                 | Expected Result                             |
| -------------------- | ------------------------------------------- |
| Verify Products menu | Products menu should be correctly displayed |
| Navigate homepage    | Homepage loads                              |
| Validate menus       | Correct display                             |
| Validate UI          | Responsive behavior correct                 |
| Scroll to bottom     | Header sticky                               |
| Verify footer        | Footer correct                              |

---

### 📋 MD Viewport (>=720)

| Step                 | Expected Result                             |
| -------------------- | ------------------------------------------- |
| Verify Products menu | Products menu should be correctly displayed |
| Validate UI          | Responsive behavior correct                 |

---

### 📋 SM Viewport (>=576)

| Step                 | Expected Result                             |
| -------------------- | ------------------------------------------- |
| Verify Products menu | Products menu should be correctly displayed |
| Validate UI          | Responsive behavior correct                 |

---

### 📋 XS Viewport (>=440)

| Step                 | Expected Result                             |
| -------------------- | ------------------------------------------- |
| Verify Products menu | Products menu should be correctly displayed |
| Validate UI          | Responsive behavior correct                 |

---

## 🧠 Notes

* Refer Figma and Functional Specs for validation
* BrowserStack required for cross-device testing
* Focus on UI consistency, responsiveness, and navigation
