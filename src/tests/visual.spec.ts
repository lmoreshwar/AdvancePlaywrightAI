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
            await visualModule.takeSnapshot('Homepage - Full View');
        });
    });

    test('Header Visual @Smoke', async ({ page, headerModule, visualModule }) => {
        await test.step('Navigate to Homepage and Verify Header', async () => {
            await headerModule.navigateAndVerifyHeader();
        });

        await test.step('Capture Header Default Snapshot', async () => {
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
            await visualModule.takeSnapshot('Header - Language Modal Open', { skipStabilization: true });
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
            await visualModule.takeSnapshot('Homepage - Sticky Header State');
        });
    });

    test('Customer Stories Hero Visual @Smoke', async ({ page, customerStoriesModule, visualModule }) => {
        await test.step('Navigate to Customer Stories', async () => {
            await customerStoriesModule.navigateToCustomerStories();
            await customerStoriesModule.verifyHeroSection();
        });

        await test.step('Capture Customer Stories Hero Snapshot', async () => {
            await visualModule.takeSnapshot('Customer Stories - Hero Section');
        });
    });

    test('Customer Stories Visual @Regression', async ({ page, customerStoriesModule, visualModule }) => {
        await test.step('Navigate to Customer Stories', async () => {
            await customerStoriesModule.navigateToCustomerStories();
        });

        await test.step('Capture Customer Stories Snapshot', async () => {
            await visualModule.takeSnapshot('Customer Stories - Filters Section');
        });

        await test.step('Expand a Filter and Capture', async () => {
            // Visual check of the expanded dropdown state
            await customerStoriesModule.selectFilterOption('By Industry', 'High Tech');
            await visualModule.takeSnapshot('Customer Stories - Filter Expanded', { skipStabilization: true });
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
                await visualModule.takeSnapshot('Responsive - XL Header+Hero');
                return;
            }

            if (projectName === 'viewport-md') {
                await visualModule.takeSnapshot('Responsive - MD Layout');
                return;
            }

            if (projectName === 'viewport-sm') {
                await headerModule.verifyMobileResponsiveLayout();
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
            await visualModule.takeSnapshot('Responsive - Mobile Header State');
        });
    });

    test('Search Overlay Visual @Regression', async ({ page, headerPage, visualModule }) => {
        await test.step('Navigate and Open Search', async () => {
            await page.goto('/');
            await headerPage.clickSearch();
        });

        await test.step('Capture Search Overlay Snapshot', async () => {
            await visualModule.takeSnapshot('Header - Search Overlay Open', { skipStabilization: true });
        });
    });

    test('Products Mega-Menu Visual @Regression', async ({ page, headerPage, visualModule }) => {
        await test.step('Navigate and Open Products Menu', async () => {
            await page.goto('/');
            await headerPage.hoverMainMenu('Products');
        });

        await test.step('Capture Products Menu Snapshot', async () => {
            await visualModule.takeSnapshot('Header - Products Mega Menu', { skipStabilization: true });
        });
    });

    test('Contact Us Page Visual @Smoke', async ({ page, visualModule }) => {
        await test.step('Navigate to Contact Us', async () => {
            await page.goto('/contact');
        });

        await test.step('Capture Contact Us Page Snapshot', async () => {
            // Wait for the form container specifically to ensure it's loaded
            await page.locator('form, .hs-form-iframe').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
            await visualModule.takeSnapshot('Page - Contact Us');
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // AVIATOR AI VISUAL TESTS
    // ═══════════════════════════════════════════════════════════════

    test('Aviator AI Page Visual @Smoke', async ({ page, aviatorAiModule, visualModule }) => {
        await test.step('Navigate to Aviator AI page', async () => {
            await aviatorAiModule.navigate('/aviator-ai', 'AI for Business & Enterprise AI Platform | OpenText');
        });

        await test.step('Capture Aviator AI Full Page Snapshot', async () => {
            await visualModule.takeSnapshot('Aviator AI - Full Page');
        });
    });

    test('Aviator AI Bento Grid Visual @Regression', async ({ page, aviatorAiModule, visualModule }) => {
        await test.step('Navigate to Aviator AI page', async () => {
            await aviatorAiModule.navigate('/aviator-ai', 'AI for Business & Enterprise AI Platform | OpenText');
        });

        await test.step('Verify bento grid is loaded', async () => {
            await aviatorAiModule.verifyAviatorBentoAndCtas();
        });

        await test.step('Capture Bento Grid Snapshot', async () => {
            await visualModule.takeSnapshot('Aviator AI - Bento Grid Section');
        });
    });

    test('Aviator AI Scenario Library Visual @Regression', async ({ page, aviatorAiModule, aviatorAiPage, visualModule }) => {
        await test.step('Navigate to Aviator AI page', async () => {
            await aviatorAiModule.navigate('/aviator-ai', 'AI for Business & Enterprise AI Platform | OpenText');
        });

        await test.step('Scroll to Scenario Library and switch tab', async () => {
            await aviatorAiPage.scenarioLibraryHeading().scrollIntoViewIfNeeded();
            await page.waitForSelector('[role="tab"]', { timeout: 10000 });
            // Click second tab to show non-default state
            const tabs = aviatorAiPage.tabs();
            if (await tabs.count() > 1) {
                await tabs.nth(1).click();
                await page.waitForTimeout(500);
            }
        });

        await test.step('Capture Scenario Library Snapshot', async () => {
            await visualModule.takeSnapshot('Aviator AI - Scenario Library Tab Switch', { skipStabilization: true });
        });
    });

    test('Aviator AI Flip Cards Visual @Regression', async ({ page, aviatorAiModule, aviatorAiPage, visualModule }) => {
        await test.step('Navigate to Aviator AI page', async () => {
            await aviatorAiModule.navigate('/aviator-ai', 'AI for Business & Enterprise AI Platform | OpenText');
        });

        await test.step('Scroll to flip cards section', async () => {
            const firstWrapper = aviatorAiPage.flipCardWrappers().first();
            await firstWrapper.scrollIntoViewIfNeeded();
            await page.waitForTimeout(500);
        });

        await test.step('Capture Flip Cards Snapshot', async () => {
            await visualModule.takeSnapshot('Aviator AI - Flip Cards Section');
        });
    });

    test('Limitless Page Visual @Smoke', async ({ page, aviatorAiModule, visualModule }) => {
        await test.step('Navigate to Limitless page', async () => {
            await aviatorAiModule.navigate('/limitless', 'Limitless: Enterprise AI-Powered Productivity Solutions | OpenText');
        });

        await test.step('Capture Limitless Full Page Snapshot', async () => {
            await visualModule.takeSnapshot('Limitless - Full Page');
        });
    });

    test('Limitless FAQ Accordion Visual @Regression', async ({ page, aviatorAiModule, aviatorAiPage, visualModule }) => {
        await test.step('Navigate to Limitless page', async () => {
            await aviatorAiModule.navigate('/limitless', 'Limitless: Enterprise AI-Powered Productivity Solutions | OpenText');
        });

        await test.step('Scroll to FAQ and expand first accordion', async () => {
            await aviatorAiPage.faqHeading().scrollIntoViewIfNeeded();
            const faqButtons = aviatorAiPage.limitlessFaqAccordionButtons();
            if (await faqButtons.count() > 0) {
                await faqButtons.first().click();
                await page.waitForTimeout(500);
            }
        });

        await test.step('Capture FAQ Accordion Expanded Snapshot', async () => {
            await visualModule.takeSnapshot('Limitless - FAQ Accordion Expanded', { skipStabilization: true });
        });
    });

    test('MyAviator Page Visual @Smoke', async ({ page, aviatorAiModule, visualModule }) => {
        await test.step('Navigate to MyAviator page', async () => {
            await aviatorAiModule.navigate('/aviator-ai/myaviator', 'MyAviator: Your Secure AI Assistant for a Smarter Workplace');
        });

        await test.step('Capture MyAviator Full Page Snapshot', async () => {
            await visualModule.takeSnapshot('MyAviator - Full Page');
        });
    });

    test('MyAviator Plans Table Visual @Regression', async ({ page, aviatorAiModule, aviatorAiPage, visualModule }) => {
        await test.step('Navigate to MyAviator page', async () => {
            await aviatorAiModule.navigate('/aviator-ai/myaviator', 'MyAviator: Your Secure AI Assistant for a Smarter Workplace');
        });

        await test.step('Scroll to Plans table', async () => {
            await aviatorAiPage.plansHeading().scrollIntoViewIfNeeded();
            await page.waitForTimeout(500);
        });

        await test.step('Capture Plans Table Snapshot', async () => {
            await visualModule.takeSnapshot('MyAviator - Plans Table Section');
        });
    });

    test('MyAviator Scenario Library Visual @Regression', async ({ page, aviatorAiModule, aviatorAiPage, visualModule }) => {
        await test.step('Navigate to MyAviator page', async () => {
            await aviatorAiModule.navigate('/aviator-ai/myaviator', 'MyAviator: Your Secure AI Assistant for a Smarter Workplace');
        });

        await test.step('Scroll to Scenario Library and expand accordion', async () => {
            await aviatorAiPage.myAviatorScenarioHeading().scrollIntoViewIfNeeded();
            await page.waitForTimeout(2000);
            const accordions = aviatorAiPage.myAviatorAccordionButtons();
            if (await accordions.count() > 0) {
                // Find a visible accordion and expand it
                const count = await accordions.count();
                for (let i = 0; i < count; i++) {
                    const visible = await accordions.nth(i).isVisible().catch(() => false);
                    if (visible) {
                        await accordions.nth(i).evaluate((el: HTMLElement) => el.click());
                        await page.waitForTimeout(1000);
                        break;
                    }
                }
            }
        });

        await test.step('Capture MyAviator Scenario Library Snapshot', async () => {
            await visualModule.takeSnapshot('MyAviator - Scenario Library Expanded', { skipStabilization: true });
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // AVIATOR AI RESPONSIVE VISUAL TESTS
    // ═══════════════════════════════════════════════════════════════

    test('Aviator AI Responsive Visual @Responsive', async ({ page, aviatorAiModule, visualModule }, testInfo) => {
        await test.step('Navigate to Aviator AI page', async () => {
            await aviatorAiModule.navigate('/aviator-ai', 'AI for Business & Enterprise AI Platform | OpenText');
        });

        await test.step('Capture Viewport-Specific Aviator Snapshot', async () => {
            const projectName = testInfo.project.name;

            if (projectName === 'viewport-xl') {
                await visualModule.takeSnapshot('Responsive - XL Aviator AI Page');
                return;
            }

            if (projectName === 'viewport-md') {
                await visualModule.takeSnapshot('Responsive - MD Aviator AI Page');
                return;
            }

            if (projectName === 'viewport-sm') {
                await visualModule.takeSnapshot('Responsive - SM Aviator AI Page');
                return;
            }

            test.skip(true, `Aviator responsive visual scoped to viewport-xl, viewport-md, viewport-sm. Current: ${projectName}`);
        });
    });

    test('Limitless Responsive Visual @Responsive', async ({ page, aviatorAiModule, visualModule }, testInfo) => {
        await test.step('Navigate to Limitless page', async () => {
            await aviatorAiModule.navigate('/limitless', 'Limitless: Enterprise AI-Powered Productivity Solutions | OpenText');
        });

        await test.step('Capture Viewport-Specific Limitless Snapshot', async () => {
            const projectName = testInfo.project.name;

            if (projectName === 'viewport-xl') {
                await visualModule.takeSnapshot('Responsive - XL Limitless Page');
                return;
            }

            if (projectName === 'viewport-md') {
                await visualModule.takeSnapshot('Responsive - MD Limitless Page');
                return;
            }

            if (projectName === 'viewport-sm') {
                await visualModule.takeSnapshot('Responsive - SM Limitless Page');
                return;
            }

            test.skip(true, `Limitless responsive visual scoped to viewport-xl, viewport-md, viewport-sm. Current: ${projectName}`);
        });
    });

    test('MyAviator Responsive Visual @Responsive', async ({ page, aviatorAiModule, visualModule }, testInfo) => {
        await test.step('Navigate to MyAviator page', async () => {
            await aviatorAiModule.navigate('/aviator-ai/myaviator', 'MyAviator: Your Secure AI Assistant for a Smarter Workplace');
        });

        await test.step('Capture Viewport-Specific MyAviator Snapshot', async () => {
            const projectName = testInfo.project.name;

            if (projectName === 'viewport-xl') {
                await visualModule.takeSnapshot('Responsive - XL MyAviator Page');
                return;
            }

            if (projectName === 'viewport-md') {
                await visualModule.takeSnapshot('Responsive - MD MyAviator Page');
                return;
            }

            if (projectName === 'viewport-sm') {
                await visualModule.takeSnapshot('Responsive - SM MyAviator Page');
                return;
            }

            test.skip(true, `MyAviator responsive visual scoped to viewport-xl, viewport-md, viewport-sm. Current: ${projectName}`);
        });
    });

});
