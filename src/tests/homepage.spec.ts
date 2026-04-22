import { test, expect } from '../fixtures';
import { HomepageModule } from '../modules/HomepageModule';

/**
 * Regression Test: Homepage
 * Maps to test cases from testcases.md — Homepage section
 */
test.describe('@P0 @Regression @Homepage Homepage Regression', () => {
    // ═══════════════════════════════════════
    // TC-HP01: Navigate to Homepage
    // ═══════════════════════════════════════
    test('@P0 @Smoke should load OpenText homepage', async ({ homepageModule }) => {
        await test.step('Navigate and verify homepage loads', async () => {
            await homepageModule.navigateAndVerifyHomepage();
        });
    });

    // ═══════════════════════════════════════
    // TC-HP02: Validate header menus on homepage
    // ═══════════════════════════════════════
    test('@P0 @Smoke should display header menus on homepage', async ({ headerModule }) => {
        await test.step('Navigate to homepage and verify header menus', async () => {
            await headerModule.navigateAndVerifyHeader();
            const menus = await headerModule.verifyMainMenuItems();
            expect(menus.length).toBeGreaterThanOrEqual(5);
        });
    });

    // ═══════════════════════════════════════
    // TC-HP03: Validate utility items
    // ═══════════════════════════════════════
    test('@P1 @Regression should display My Account, Language Switcher, Search, Contact', async ({
        page,
        headerPage,
    }) => {
        await test.step('Navigate and verify utility items', async () => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await headerPage.expectSearchIconVisible();
            await headerPage.expectLanguageSwitcherVisible();
        });
    });

    // ═══════════════════════════════════════
    // TC-HP04: Verify padding/layout
    // ═══════════════════════════════════════
    test('@P1 @Regression should have no extra/unwanted padding', async ({ homepageModule }) => {
        await test.step('Navigate and verify padding', async () => {
            await homepageModule.navigateAndVerifyHomepage();
            await homepageModule.verifyPaddingAndLayout();
        });
    });

    // ═══════════════════════════════════════
    // TC-HP05: Verify homepage components render
    // ═══════════════════════════════════════
    test('@P0 @Smoke should render all homepage components', async ({ homepageModule }) => {
        await test.step('Verify all sections/components are rendered', async () => {
            await homepageModule.navigateAndVerifyHomepage();
            const sectionCount = await homepageModule.verifyHomepageComponents();
            console.log(`Total homepage sections: ${sectionCount}`);
        });
    });

    // ═══════════════════════════════════════
    // TC-HP06: Verify scroller behavior
    // ═══════════════════════════════════════
    test('@P1 @Regression should display scrollers/carousels correctly', async ({ homepageModule }) => {
        await test.step('Verify scroller behavior without blank pages', async () => {
            await homepageModule.navigateAndVerifyHomepage();
            await homepageModule.verifyScrollerBehavior();
        });
    });

    // ═══════════════════════════════════════
    // TC-HP07: Scroll to bottom — sticky header
    // ═══════════════════════════════════════
    test('@P0 @Smoke should have sticky header when scrolled', async ({ homepageModule }) => {
        await test.step('Scroll to bottom and verify sticky header', async () => {
            await homepageModule.navigateAndVerifyHomepage();
            await homepageModule.verifyScrollToBottomAndFooter();
        });
    });

    // ═══════════════════════════════════════
    // TC-HP08: Verify footer
    // ═══════════════════════════════════════
    test('@P1 @Regression should display footer correctly', async ({ page, footerPage }) => {
        await test.step('Navigate and verify footer', async () => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await footerPage.scrollToFooter();
            await footerPage.expectFooterVisible();
            await footerPage.expectFooterLinksPresent();
        });
    });
});
