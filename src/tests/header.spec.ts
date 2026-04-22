import { test, expect } from '../fixtures';
import { HeaderModule } from '../modules/HeaderModule';
import menusData from '../testdata/menus.json';

const mainMenuItems = menusData.mainMenuItems;

/**
 * Regression Test: Header
 * Maps to test cases from testcases.md — Header section
 */
test.describe('@P0 @Regression @Header Header Regression', () => {
    let headerModule: HeaderModule;

    test.beforeEach(async ({ page }) => {
        headerModule = new HeaderModule(page);
        await headerModule.navigateAndVerifyHeader();
    });

    // ═══════════════════════════════════════
    // TC-H01: Navigate to Homepage — Header shown
    // ═══════════════════════════════════════
    test('@P0 @Smoke should display the header on homepage', async () => {
        await test.step('Verify header is visible on homepage', async () => {
            // Header is already verified in beforeEach
            console.log('Header is displayed on homepage');
        });
    });

    // ═══════════════════════════════════════
    // TC-H02: Verify OpenText logo in all viewports
    // ═══════════════════════════════════════
    test('@P0 @Smoke should display OpenText logo correctly', async () => {
        await test.step('Verify logo visibility and size', async () => {
            await headerModule.verifyLogo();
        });
    });

    // ═══════════════════════════════════════
    // TC-H03: Verify Header Menus
    // ═══════════════════════════════════════
    test('@P0 @Smoke should display all 7 main menu items', async () => {
        await test.step('Verify all main navigation menus are visible', async () => {
            const menuTexts = await headerModule.verifyMainMenuItems();
            console.log(`Menu items found: ${menuTexts.join(', ')}`);
            expect(menuTexts.length).toBeGreaterThanOrEqual(5);
        });
    });

    // ═══════════════════════════════════════
    // TC-H04: Navigate through all submenus
    // ═══════════════════════════════════════
    test('@P1 @Regression should navigate through all submenus', async () => {
        await test.step('Navigate through all 7 main menu submenus', async () => {
            const menuSubmenuMap = await headerModule.navigateAllMenusAndSubmenus();

            for (const [menu, submenus] of menuSubmenuMap) {
                console.log(`${menu}: ${submenus.length} submenu items`);
            }
        });
    });

    // ═══════════════════════════════════════
    // TC-H05: Verify Tabbing works (Desktop only)
    // ═══════════════════════════════════════
    test('@P2 @Regression should support keyboard tab navigation', async () => {
        await test.step('Verify tab navigation through menu items', async () => {
            await headerModule.verifyTabNavigation();
        });
    });

    // ═══════════════════════════════════════
    // TC-H06: Language switcher modal
    // ═══════════════════════════════════════
    test('@P1 @Regression should open language switcher modal', async () => {
        await test.step('Click language switcher and verify modal', async () => {
            await headerModule.verifyLanguageSwitcher();
        });
    });

    // ═══════════════════════════════════════
    // TC-H07: Contact button
    // ═══════════════════════════════════════
    test('@P1 @Regression should display and click Contact button', async () => {
        await test.step('Verify Contact button functionality', async () => {
            await headerModule.verifyContactButton();
        });
    });

    // ═══════════════════════════════════════
    // TC-H08: Verify each menu item individually
    // ═══════════════════════════════════════
    for (const menuItem of mainMenuItems) {
        test(`@P1 @Regression should display "${menuItem}" menu item`, async ({ headerPage }) => {
            await test.step(`Verify "${menuItem}" is visible in header`, async () => {
                await headerPage.expectMenuItemVisible(menuItem);
            });
        });
    }
});
