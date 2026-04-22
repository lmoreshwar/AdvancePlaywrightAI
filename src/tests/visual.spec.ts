import { test } from '../fixtures';

/**
 * Visual Regression POC: Standalone Visual Tests
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

    test('Customer Stories Visual @Regression', async ({ customerStoriesModule, visualModule }) => {
        await test.step('Navigate to Customer Stories', async () => {
            await customerStoriesModule.clickExploreAndScroll();
        });

        await test.step('Capture Customer Stories Snapshot', async () => {
            await visualModule.takeSnapshot('Customer Stories - Filters Section', standardWidths);
        });
        
        await test.step('Expand a Filter and Capture', async () => {
            // Visual check of the expanded dropdown state
            await customerStoriesModule.selectFilterOption('Industries', 'High Tech');
            await visualModule.takeSnapshot('Customer Stories - Filter Expanded', standardWidths);
        });
    });

});
