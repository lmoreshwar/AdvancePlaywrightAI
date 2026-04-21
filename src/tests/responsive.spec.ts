import { test, expect } from '../fixtures';
import { HomepageModule } from '../modules/HomepageModule';
import { HeaderModule } from '../modules/HeaderModule';
import menusData from '../testdata/menus.json';
import { ViewportConfig } from '../testdata/types';

const viewports = menusData.viewports as ViewportConfig[];

/**
 * Regression Test: Homepage Across Viewports
 * Maps to test cases from testcases.md — Responsive section
 * 
 * Runs the same set of checks at each viewport breakpoint:
 *   XL (>=1376), LG (>=968), MD (>=720), SM (>=576), XS (>=440)
 */
for (const vp of viewports) {
    test.describe(`@P0 @Regression @Responsive @${vp.name.toUpperCase()} Homepage — ${vp.name.toUpperCase()} Viewport (${vp.width}x${vp.height})`, () => {
        test.slow(); // Responsive testing is resource intensive
        let homepageModule: HomepageModule;
        let headerModule: HeaderModule;

        test.use({ viewport: { width: vp.width, height: vp.height } });

        test.beforeEach(async ({ page }) => {
            homepageModule = new HomepageModule(page);
            headerModule = new HeaderModule(page);
            await page.goto('/');
            await page.waitForLoadState('domcontentloaded');
        });

        // ─── Common test for all viewports ───
        test(`should load homepage at ${vp.name.toUpperCase()} viewport`, async () => {
            await test.step(`Verify homepage loads at ${vp.width}px`, async () => {
                await homepageModule.navigateAndVerifyHomepage();
            });
        });

        test(`should display header menus correctly at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify header menus at ${vp.width}px`, async () => {
                await headerModule.verifyMainMenuItems();
            });
        });

        test(`should have no extra padding at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify layout at ${vp.width}px`, async () => {
                await homepageModule.verifyPaddingAndLayout();
            });
        });

        test(`should render all components at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify sections render at ${vp.width}px`, async () => {
                await homepageModule.verifyHomepageComponents();
            });
        });

        test(`should have sticky header at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Scroll and verify sticky header at ${vp.width}px`, async () => {
                await homepageModule.verifyScrollToBottomAndFooter();
            });
        });

        test(`should display footer correctly at ${vp.name.toUpperCase()}`, async ({ footerPage }) => {
            await test.step(`Verify footer at ${vp.width}px`, async () => {
                await footerPage.scrollToFooter();
                await footerPage.expectFooterVisible();
            });
        });

        // ─── Mobile/Tablet specific tests ───
        if (vp.type === 'mobile' || vp.type === 'tablet') {
            test(`should show hamburger menu at ${vp.name.toUpperCase()}`, async () => {
                await test.step(`Verify hamburger at ${vp.width}px`, async () => {
                    await headerModule.verifyMobileResponsiveLayout();
                });
            });
        }

        // ─── Desktop specific tests ───
        if (vp.type === 'desktop') {
            test(`should display Products menu correctly at ${vp.name.toUpperCase()}`, async ({ headerPage }) => {
                await test.step(`Verify Products menu at ${vp.width}px`, async () => {
                    await headerPage.expectMenuItemVisible('Products');
                });
            });
        }
    });
}
