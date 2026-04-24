import { test } from '../fixtures';
import { AviatorAiModule } from '../modules/AviatorAiModule';

/**
 * Regression Test: Aviator AI Landing Pages
 * Maps to AVIATOR_REQUIREMENT_RICEPOT_COVERAGE.md
 */
test.describe('@P0 @Regression @Aviator Aviator AI Pages', () => {
    // ═══════════════════════════════════════
    // TC-AV01: Aviator page loads with header and secondary navigation
    // ═══════════════════════════════════════
    test('@P0 @Smoke should display Aviator page with header and navigation', async ({ page }) => {
        const module = new AviatorAiModule(page);
        module.startConsoleCapture();

        await test.step('Navigate to Aviator page and verify title', async () => {
            await module.navigate('/aviator-ai', 'AI for Business & Enterprise AI Platform | OpenText');
        });

        await test.step('Verify main and secondary navigation are visible', async () => {
            await module.verifyMainHeader();
            await module.verifySecondaryAviatorNav();
        });

        await test.step('Verify scroll behavior hides main header and shows secondary nav', async () => {
            await module.verifyScrollBehaviorMainHeaderHides();
        });

        await test.step('Verify no unexpected console errors', async () => {
            await module.assertNoUnexpectedConsoleErrors();
        });
    });

    // ═══════════════════════════════════════
    // TC-AV02: Aviator bento grid and CTA links function correctly
    // ═══════════════════════════════════════
    test('@P1 @Regression should display bento cards and featured CTAs', async ({ page }) => {
        const module = new AviatorAiModule(page);
        module.startConsoleCapture();

        await test.step('Navigate to Aviator page', async () => {
            await module.navigate('/aviator-ai', 'AI for Business & Enterprise AI Platform | OpenText');
        });

        await test.step('Verify bento grid structure and featured CTA presence', async () => {
            await module.verifyAviatorBentoAndCtas();
        });

        await test.step('Verify card navigation links are configured', async () => {
            await module.verifyAviatorCardNavigationLinks();
        });

        await test.step('Verify no unexpected console errors', async () => {
            await module.assertNoUnexpectedConsoleErrors();
        });
    });

    // ═══════════════════════════════════════
    // TC-AV03: Scenario Library tabs and accordion interactions
    // ═══════════════════════════════════════
    test('@P1 @Regression should support Scenario Library tab switching and accordion', async ({ page }) => {
        const module = new AviatorAiModule(page);
        module.startConsoleCapture();

        await test.step('Navigate to Aviator page', async () => {
            await module.navigate('/aviator-ai', 'AI for Business & Enterprise AI Platform | OpenText');
        });

        await test.step('Verify Scenario Library default tab and tab switching behavior', async () => {
            await module.verifyScenarioLibraryInteractions();
        });

        await test.step('Verify no unexpected console errors', async () => {
            await module.assertNoUnexpectedConsoleErrors();
        });
    });

    // ═══════════════════════════════════════
    // TC-AV04: Limitless page loads with sections and navigation
    // ═══════════════════════════════════════
    test('@P0 @Smoke should display Limitless page with all sections', async ({ page }) => {
        const module = new AviatorAiModule(page);
        module.startConsoleCapture();

        await test.step('Navigate to Limitless page and verify title', async () => {
            await module.navigate('/limitless', 'Limitless: Enterprise AI-Powered Productivity Solutions | OpenText');
        });

        await test.step('Verify global header and secondary navigation controls', async () => {
            await module.verifyMainHeader();
            await module.verifySecondaryAviatorNav();
        });

        await test.step('Verify Limitless sections and additional content', async () => {
            await module.verifyLimitlessContentAndSections();
        });

        await test.step('Verify no unexpected console errors', async () => {
            await module.assertNoUnexpectedConsoleErrors();
        });
    });

    // ═══════════════════════════════════════
    // TC-AV05: MyAviator hero, video, and plans display correctly
    // ═══════════════════════════════════════
    test('@P0 @Smoke should display MyAviator hero, video, and plans table', async ({ page }) => {
        const module = new AviatorAiModule(page);
        module.startConsoleCapture();

        await test.step('Navigate to MyAviator page and verify title', async () => {
            await module.navigate('/aviator-ai/myaviator', 'MyAviator: Your Secure AI Assistant for a Smarter Workplace');
        });

        await test.step('Verify hero banner, CTAs, and video block', async () => {
            await module.verifyMyAviatorHeroAndActions();
        });

        await test.step('Verify five-step section and plans section', async () => {
            await module.verifyMyAviatorFiveStepsAndPlans();
        });

        await test.step('Verify primary and secondary CTA targets are configured', async () => {
            await module.verifyPrimaryAndSecondaryCtaTargets();
        });

        await test.step('Verify no unexpected console errors', async () => {
            await module.assertNoUnexpectedConsoleErrors();
        });
    });

    // ═══════════════════════════════════════
    // TC-AV06: Aviator flip cards have front and back faces (R1.10)
    // ═══════════════════════════════════════
    test('@P1 @Regression should have flip card structure with front and back faces', async ({ page }) => {
        const module = new AviatorAiModule(page);
        module.startConsoleCapture();

        await test.step('Navigate to Aviator page', async () => {
            await module.navigate('/aviator-ai', 'AI for Business & Enterprise AI Platform | OpenText');
        });

        await test.step('Verify flip card wrappers and front/back faces exist', async () => {
            await module.verifyFlipCardStructure();
        });

        await test.step('Verify no unexpected console errors', async () => {
            await module.assertNoUnexpectedConsoleErrors();
        });
    });

    // ═══════════════════════════════════════
    // TC-AV07: Aviator featured card displays eyebrow, heading, description, CTA (R1.11)
    // ═══════════════════════════════════════
    test('@P1 @Regression should display featured card with eyebrow heading description and CTA', async ({ page }) => {
        const module = new AviatorAiModule(page);
        module.startConsoleCapture();

        await test.step('Navigate to Aviator page', async () => {
            await module.navigate('/aviator-ai', 'AI for Business & Enterprise AI Platform | OpenText');
        });

        await test.step('Verify featured card content structure', async () => {
            await module.verifyFeaturedCardContent();
        });

        await test.step('Verify no unexpected console errors', async () => {
            await module.assertNoUnexpectedConsoleErrors();
        });
    });

    // ═══════════════════════════════════════
    // TC-AV08: Secondary navigation links open correctly (R1.4)
    // ═══════════════════════════════════════
    test('@P1 @Regression should have valid hrefs on all secondary navigation links', async ({ page }) => {
        const module = new AviatorAiModule(page);
        module.startConsoleCapture();

        await test.step('Navigate to Aviator page', async () => {
            await module.navigate('/aviator-ai', 'AI for Business & Enterprise AI Platform | OpenText');
        });

        await test.step('Verify all secondary nav links have valid hrefs', async () => {
            await module.verifySecondaryNavLinksHaveHrefs();
        });

        await test.step('Verify no unexpected console errors', async () => {
            await module.assertNoUnexpectedConsoleErrors();
        });
    });

    // ═══════════════════════════════════════
    // TC-AV09: MyAviator Scenario Library accordions expand and collapse (R3.8, R3.9)
    // ═══════════════════════════════════════
    test('@P1 @Regression should expand and collapse MyAviator Scenario Library accordions', async ({ page }) => {
        const module = new AviatorAiModule(page);
        module.startConsoleCapture();

        await test.step('Navigate to MyAviator page', async () => {
            await module.navigate('/aviator-ai/myaviator', 'MyAviator: Your Secure AI Assistant for a Smarter Workplace');
        });

        await test.step('Verify Scenario Library accordion expand and collapse', async () => {
            await module.verifyMyAviatorScenarioLibraryAccordions();
        });

        await test.step('Verify no unexpected console errors', async () => {
            await module.assertNoUnexpectedConsoleErrors();
        });
    });

    // ═══════════════════════════════════════
    // TC-AV10: Limitless CTA links navigate correctly (R2.4)
    // ═══════════════════════════════════════
    test('@P1 @Regression should have valid navigation hrefs on Limitless CTA buttons', async ({ page }) => {
        const module = new AviatorAiModule(page);
        module.startConsoleCapture();

        await test.step('Navigate to Limitless page', async () => {
            await module.navigate('/limitless', 'Limitless: Enterprise AI-Powered Productivity Solutions | OpenText');
        });

        await test.step('Verify all Limitless CTAs have valid hrefs', async () => {
            await module.verifyLimitlessCtaNavigationLinks();
        });

        await test.step('Verify no unexpected console errors', async () => {
            await module.assertNoUnexpectedConsoleErrors();
        });
    });
});
