import { test } from '../fixtures';

/**
 * Visual Regression Suite: Standalone Visual Tests
 *
 * These tests focus purely on capturing visual snapshots for Percy.
 * They are kept separate from functional tests for easy maintenance.
 */
test.describe('@Visual Visual Regression Testing POC', () => {

    // We can define target widths at the test level or use Percy global config
    const standardWidths = [375, 768, 1280, 1920];

    test('Homepage Visual @Smoke', async ({ homepageModule, visualModule }) => {
        await test.step('Navigate to Homepage', async () => {
            await homepageModule.navigateAndVerifyHomepage();
        });

        await test.step('Capture Homepage Snapshot', async () => {
            // This sends the DOM to Percy for multi-resolution rendering
            await visualModule.takeSnapshot('Homepage - Full View', standardWidths);
        });
    });

    test('Header Visual @Smoke', async ({ headerModule, visualModule }) => {
        await test.step('Navigate to Homepage and Verify Header', async () => {
            await headerModule.navigateAndVerifyHeader();
        });

        await test.step('Capture Header Default Snapshot', async () => {
            await visualModule.takeSnapshot('Header - Default State', standardWidths);
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
            await visualModule.takeSnapshot('Header - Language Modal Open', standardWidths);
        });

        await test.step('Close Language Modal', async () => {
            await page.keyboard.press('Escape');
        });
    });

    test('Homepage Hero Visual @Smoke', async ({ homepageModule, visualModule }) => {
        await test.step('Navigate to Homepage', async () => {
            await homepageModule.navigateAndVerifyHomepage();
        });

        await test.step('Capture Homepage Hero Snapshot', async () => {
            await visualModule.takeSnapshot('Homepage - Hero Section', standardWidths);
        });
    });

    test('Homepage Footer Visual @Regression', async ({ homepageModule, footerPage, visualModule }) => {
        await test.step('Navigate to Homepage', async () => {
            await homepageModule.navigateAndVerifyHomepage();
        });

        await test.step('Scroll to Footer and Verify', async () => {
            await footerPage.scrollToFooter();
            await footerPage.expectFooterVisible();
        });

        await test.step('Capture Homepage Footer Snapshot', async () => {
            await visualModule.takeSnapshot('Homepage - Footer Section', standardWidths);
        });
    });

    test('Homepage Sticky Header Visual @Regression', async ({ homepageModule, homepagePage, visualModule }) => {
        await test.step('Navigate to Homepage', async () => {
            await homepageModule.navigateAndVerifyHomepage();
        });

        await test.step('Scroll to Bottom for Sticky Header State', async () => {
            await homepagePage.scrollToBottom();
        });

        await test.step('Capture Sticky Header Snapshot', async () => {
            await visualModule.takeSnapshot('Homepage - Sticky Header State', standardWidths);
        });
    });

    test('Customer Stories Hero Visual @Smoke', async ({ customerStoriesModule, visualModule }) => {
        await test.step('Navigate to Customer Stories', async () => {
            await customerStoriesModule.navigateToCustomerStories();
            await customerStoriesModule.verifyHeroSection();
        });

        await test.step('Capture Customer Stories Hero Snapshot', async () => {
            await visualModule.takeSnapshot('Customer Stories - Hero Section', standardWidths);
        });
    });

    test('Customer Stories Visual @Regression', async ({ customerStoriesModule, visualModule }) => {
        await test.step('Navigate to Customer Stories', async () => {
            await customerStoriesModule.navigateToCustomerStories();
        });

        await test.step('Capture Customer Stories Snapshot', async () => {
            await visualModule.takeSnapshot('Customer Stories - Filters Section', standardWidths);
        });
        
        await test.step('Expand a Filter and Capture', async () => {
            // Visual check of the expanded dropdown state
            await customerStoriesModule.selectFilterOption('By Industry', 'High Tech');
            await visualModule.takeSnapshot('Customer Stories - Filter Expanded', standardWidths);
        });
    });

    test('Customer Stories Filtered Results Visual @Regression', async ({ customerStoriesModule, visualModule }) => {
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
            await visualModule.takeSnapshot('Customer Stories - Filtered Results', standardWidths);
        });
    });

    test('Responsive Visual Pack @Responsive', async ({ page, homepageModule, headerModule, visualModule }, testInfo) => {
        await test.step('Navigate to Homepage', async () => {
            await homepageModule.navigateAndVerifyHomepage();
        });

        await test.step('Capture Viewport-Specific Snapshot', async () => {
            const projectName = testInfo.project.name;

            if (projectName === 'viewport-xl') {
                await visualModule.takeSnapshot('Responsive - XL Header+Hero', standardWidths);
                return;
            }

            if (projectName === 'viewport-md') {
                await visualModule.takeSnapshot('Responsive - MD Layout', standardWidths);
                return;
            }

            if (projectName === 'viewport-sm') {
                await headerModule.verifyMobileResponsiveLayout();
                await visualModule.takeSnapshot('Responsive - SM Hamburger State', standardWidths);
                return;
            }

            test.skip(true, `Responsive visual pack is scoped to viewport-xl, viewport-md, viewport-sm. Current: ${projectName}`);
        });
    });

    test('Responsive Mobile Header Visual @Responsive', async ({ headerModule, visualModule, isMobile }) => {
        test.skip(!isMobile, 'This visual snapshot is for mobile projects only.');

        await test.step('Navigate and Open Mobile Menu', async () => {
            await headerModule.navigateAndVerifyHeader();
            await headerModule.verifyMobileResponsiveLayout();
        });

        await test.step('Capture Mobile Header Snapshot', async () => {
            await visualModule.takeSnapshot('Responsive - Mobile Header State', standardWidths);
        });
    });
});
