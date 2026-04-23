import { test } from '../fixtures';

/**
 * Visual Regression Suite: Standalone Visual Tests
 *
 * These tests focus purely on capturing visual snapshots for Percy.
 * They are kept separate from functional tests for easy maintenance.
 */
test.describe('@Visual Visual Regression Testing POC', () => {

    // Note: Viewport widths are now managed globally in .percy.yml


    test('Homepage Visual @Smoke', async ({ page, homepageModule, visualModule }) => {
        await test.step('Navigate to Homepage', async () => {
            await homepageModule.navigateAndVerifyHomepage();
        });

        await test.step('Capture Homepage Snapshot', async () => {
            await page.waitForLoadState('load');
            await visualModule.takeSnapshot('Homepage - Full View');
        });
    });

    test('Header Visual @Smoke', async ({ page, headerModule, visualModule }) => {
        await test.step('Navigate to Homepage and Verify Header', async () => {
            await headerModule.navigateAndVerifyHeader();
        });

        await test.step('Capture Header Default Snapshot', async () => {
            await page.waitForLoadState('load');
            await visualModule.takeSnapshot('Header - Default State');
        });
    });

    test('Header Language Modal Visual @Regression', async ({ page, headerModule, headerPage, visualModule }) => {
        await test.step('Navigate to Homepage and Verify Header', async () => {
            await headerModule.navigateAndVerifyHeader();
        });

        await test.step('Open Language Modal', async () => {
            await headerPage.clickLanguageSwitcher();
            await headerPage.expectLanguageModalVisible();
        });

        await test.step('Capture Language Modal Snapshot', async () => {
            await page.waitForLoadState('load');
            await visualModule.takeSnapshot('Header - Language Modal Open');
        });

        await test.step('Close Language Modal', async () => {
            await page.keyboard.press('Escape');
        });
    });

    test('Homepage Hero Visual @Smoke', async ({ page, homepageModule, visualModule }) => {
        await test.step('Navigate to Homepage', async () => {
            await homepageModule.navigateAndVerifyHomepage();
        });

        await test.step('Capture Homepage Hero Snapshot', async () => {
            await page.waitForLoadState('load');
            await visualModule.takeSnapshot('Homepage - Hero Section');
        });
    });

    test('Homepage Footer Visual @Regression', async ({ page, homepageModule, footerPage, visualModule }) => {
        await test.step('Navigate to Homepage', async () => {
            await homepageModule.navigateAndVerifyHomepage();
        });

        await test.step('Scroll to Footer and Verify', async () => {
            await footerPage.scrollToFooter();
            await footerPage.expectFooterVisible();
        });

        await test.step('Capture Homepage Footer Snapshot', async () => {
            await page.waitForLoadState('load');
            await visualModule.takeSnapshot('Homepage - Footer Section');
        });
    });

    test('Homepage Sticky Header Visual @Regression', async ({ page, homepageModule, homepagePage, visualModule }) => {
        await test.step('Navigate to Homepage', async () => {
            await homepageModule.navigateAndVerifyHomepage();
        });

        await test.step('Scroll to Bottom for Sticky Header State', async () => {
            await homepagePage.scrollToBottom();
        });

        await test.step('Capture Sticky Header Snapshot', async () => {
            await page.waitForLoadState('load');
            await visualModule.takeSnapshot('Homepage - Sticky Header State');
        });
    });

    test('Customer Stories Hero Visual @Smoke', async ({ page, customerStoriesModule, visualModule }) => {
        await test.step('Navigate to Customer Stories', async () => {
            await customerStoriesModule.navigateToCustomerStories();
            await customerStoriesModule.verifyHeroSection();
        });

        await test.step('Capture Customer Stories Hero Snapshot', async () => {
            await page.waitForLoadState('load');
            await visualModule.takeSnapshot('Customer Stories - Hero Section');
        });
    });

    test('Customer Stories Visual @Regression', async ({ page, customerStoriesModule, visualModule }) => {
        await test.step('Navigate to Customer Stories', async () => {
            await customerStoriesModule.navigateToCustomerStories();
        });

        await test.step('Capture Customer Stories Snapshot', async () => {
            await page.waitForLoadState('load');
            await visualModule.takeSnapshot('Customer Stories - Filters Section');
        });

        await test.step('Expand a Filter and Capture', async () => {
            // Visual check of the expanded dropdown state
            await customerStoriesModule.selectFilterOption('By Industry', 'High Tech');
            await page.waitForLoadState('load');
            await visualModule.takeSnapshot('Customer Stories - Filter Expanded');
        });
    });

    test('Customer Stories Filtered Results Visual @Regression', async ({ page, customerStoriesModule, visualModule }) => {
        await test.step('Navigate to Customer Stories', async () => {
            await customerStoriesModule.navigateToCustomerStories();
        });

        await test.step('Open Results and Apply Stable Filters', async () => {
            await customerStoriesModule.clickExploreAndScroll();
            await customerStoriesModule.applyFilters({
                Industry: 'Banking',
                Country: 'North America',
            });
        });

        await test.step('Capture Filtered Results Snapshot', async () => {
            await page.waitForLoadState('load');
            await visualModule.takeSnapshot('Customer Stories - Filtered Results');
        });
    });

    test('Responsive Visual Pack @Responsive', async ({ page, homepageModule, headerModule, visualModule }, testInfo) => {
        await test.step('Navigate to Homepage', async () => {
            await homepageModule.navigateAndVerifyHomepage();
        });

        await test.step('Capture Viewport-Specific Snapshot', async () => {
            const projectName = testInfo.project.name;

            if (projectName === 'viewport-xl') {
                await page.waitForLoadState('load');
                await visualModule.takeSnapshot('Responsive - XL Header+Hero');
                return;
            }

            if (projectName === 'viewport-md') {
                await page.waitForLoadState('load');
                await visualModule.takeSnapshot('Responsive - MD Layout');
                return;
            }

            if (projectName === 'viewport-sm') {
                await headerModule.verifyMobileResponsiveLayout();
                await page.waitForLoadState('load');
                await visualModule.takeSnapshot('Responsive - SM Hamburger State');
                return;
            }

            test.skip(true, `Responsive visual pack is scoped to viewport-xl, viewport-md, viewport-sm. Current: ${projectName}`);
        });
    });

    test('Responsive Mobile Header Visual @Responsive', async ({ page, headerModule, visualModule, isMobile }) => {
        test.skip(!isMobile, 'This visual snapshot is for mobile projects only.');

        await test.step('Navigate and Open Mobile Menu', async () => {
            await headerModule.navigateAndVerifyHeader();
            await headerModule.verifyMobileResponsiveLayout();
        });

        await test.step('Capture Mobile Header Snapshot', async () => {
            await page.waitForLoadState('load');
            await visualModule.takeSnapshot('Responsive - Mobile Header State');
        });
    });
});
