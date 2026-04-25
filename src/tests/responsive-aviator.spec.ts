import { test, expect } from '../fixtures';
import { AviatorAiModule } from '../modules/AviatorAiModule';
import { HeaderModule } from '../modules/HeaderModule';
import menusData from '../testdata/menus.json';
import { ViewportConfig } from '../testdata/types';

const viewports = menusData.viewports as ViewportConfig[];

/**
 * Responsive Test: Aviator AI Pages Across Viewports
 * Maps to functional test cases from aviator-ai.spec.ts
 *
 * Runs viewport-specific checks at each viewport breakpoint:
 *   XL (>=1376), LG (>=968), MD (>=720), SM (>=576), XS (>=440)
 *
 * Covers three sub-pages:
 *   - /aviator-ai (Aviator main)
 *   - /limitless (Limitless)
 *   - /aviator-ai/myaviator (MyAviator)
 */

// ═══════════════════════════════════════════════════════════════
// SECTION 1: Aviator AI Main Page (/aviator-ai)
// ═══════════════════════════════════════════════════════════════
for (const vp of viewports) {
    test.describe(`@P0 @Regression @Responsive @Aviator @${vp.name.toUpperCase()} Aviator AI — ${vp.name.toUpperCase()} Viewport (${vp.width}x${vp.height})`, () => {
        test.slow();
        let aviatorModule: AviatorAiModule;
        let headerModule: HeaderModule;

        test.use({ viewport: { width: vp.width, height: vp.height } });

        test.beforeEach(async ({ page }) => {
            aviatorModule = new AviatorAiModule(page);
            headerModule = new HeaderModule(page);
            aviatorModule.startConsoleCapture();
            await page.goto('/aviator-ai');
            await page.waitForLoadState('domcontentloaded');
            // Accept cookies if visible
            const acceptAll = page.getByRole('button', { name: /Accept All/i });
            if (await acceptAll.isVisible({ timeout: 1500 }).catch(() => false)) {
                await acceptAll.click().catch(() => {});
                await page.waitForTimeout(300);
            }
        });

        // ─── Common test: page loads with header ───
        test(`should load Aviator page with header at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify Aviator page loads at ${vp.width}px`, async () => {
                await aviatorModule.verifyMainHeader();
            });
        });

        // ─── Common test: secondary nav adapts to viewport ───
        test(`should display secondary nav correctly at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify secondary nav at ${vp.width}px`, async () => {
                await aviatorModule.verifySecondaryAviatorNav();
            });
        });

        // ─── Common test: bento grid renders at viewport ───
        test(`should display bento grid at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify bento grid at ${vp.width}px`, async () => {
                await aviatorModule.verifyAviatorBentoAndCtas();
            });
        });

        // ─── Common test: flip cards exist at viewport ───
        test(`should display flip cards at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify flip card structure at ${vp.width}px`, async () => {
                await aviatorModule.verifyFlipCardStructure();
            });
        });

        // ─── Common test: scenario library tabs work at viewport ───
        test(`should support Scenario Library at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify Scenario Library interactions at ${vp.width}px`, async () => {
                await aviatorModule.verifyScenarioLibraryInteractions();
            });
        });

        // ─── Mobile/Tablet: hamburger menu ───
        if (vp.type === 'mobile' || vp.type === 'tablet') {
            test(`should show hamburger menu at ${vp.name.toUpperCase()}`, async () => {
                await test.step(`Verify hamburger menu at ${vp.width}px`, async () => {
                    await headerModule.verifyMobileResponsiveLayout();
                });
            });
        }

        // ─── Desktop: scroll behavior hides main header ───
        if (vp.type === 'desktop') {
            test(`should hide main header on scroll at ${vp.name.toUpperCase()}`, async () => {
                await test.step(`Verify scroll behavior at ${vp.width}px`, async () => {
                    await aviatorModule.verifyScrollBehaviorMainHeaderHides();
                });
            });
        }
    });
}

// ═══════════════════════════════════════════════════════════════
// SECTION 2: Limitless Page (/limitless)
// ═══════════════════════════════════════════════════════════════
for (const vp of viewports) {
    test.describe(`@P0 @Regression @Responsive @Aviator @${vp.name.toUpperCase()} Limitless — ${vp.name.toUpperCase()} Viewport (${vp.width}x${vp.height})`, () => {
        test.slow();
        let aviatorModule: AviatorAiModule;

        test.use({ viewport: { width: vp.width, height: vp.height } });

        test.beforeEach(async ({ page }) => {
            aviatorModule = new AviatorAiModule(page);
            aviatorModule.startConsoleCapture();
            await page.goto('/limitless');
            await page.waitForLoadState('domcontentloaded');
            // Accept cookies if visible
            const acceptAll = page.getByRole('button', { name: /Accept All/i });
            if (await acceptAll.isVisible({ timeout: 1500 }).catch(() => false)) {
                await acceptAll.click().catch(() => {});
                await page.waitForTimeout(300);
            }
        });

        // ─── Common test: Limitless page loads ───
        test(`should load Limitless page at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify Limitless page at ${vp.width}px`, async () => {
                await aviatorModule.verifyMainHeader();
                await aviatorModule.verifySecondaryAviatorNav();
            });
        });

        // ─── Common test: Limitless content sections ───
        test(`should display Limitless sections at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify Limitless content at ${vp.width}px`, async () => {
                await aviatorModule.verifyLimitlessContentAndSections();
            });
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// SECTION 3: MyAviator Page (/aviator-ai/myaviator)
// ═══════════════════════════════════════════════════════════════
for (const vp of viewports) {
    test.describe(`@P0 @Regression @Responsive @Aviator @${vp.name.toUpperCase()} MyAviator — ${vp.name.toUpperCase()} Viewport (${vp.width}x${vp.height})`, () => {
        test.slow();
        let aviatorModule: AviatorAiModule;

        test.use({ viewport: { width: vp.width, height: vp.height } });

        test.beforeEach(async ({ page }) => {
            aviatorModule = new AviatorAiModule(page);
            aviatorModule.startConsoleCapture();
            await page.goto('/aviator-ai/myaviator');
            await page.waitForLoadState('domcontentloaded');
            // Accept cookies if visible
            const acceptAll = page.getByRole('button', { name: /Accept All/i });
            if (await acceptAll.isVisible({ timeout: 1500 }).catch(() => false)) {
                await acceptAll.click().catch(() => {});
                await page.waitForTimeout(300);
            }
        });

        // ─── Common test: MyAviator hero and video ───
        test(`should display MyAviator hero at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify MyAviator hero at ${vp.width}px`, async () => {
                await aviatorModule.verifyMyAviatorHeroAndActions();
            });
        });

        // ─── Common test: MyAviator five steps and plans ───
        test(`should display MyAviator plans at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify five steps and plans at ${vp.width}px`, async () => {
                await aviatorModule.verifyMyAviatorFiveStepsAndPlans();
            });
        });

        // ─── Common test: MyAviator Scenario Library accordions ───
        test(`should support MyAviator accordions at ${vp.name.toUpperCase()}`, async () => {
            await test.step(`Verify accordion interactions at ${vp.width}px`, async () => {
                await aviatorModule.verifyMyAviatorScenarioLibraryAccordions();
            });
        });
    });
}
