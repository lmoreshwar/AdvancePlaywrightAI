import { test } from '../fixtures';

/**
 * Regression Test: Customer Stories
 * Maps to testcases.md — Customer Stories section
 */
test.describe('@P0 @Regression @CustomerStories Customer Stories Regression', () => {
    test.beforeEach(async ({ customerStoriesModule }) => {
        await customerStoriesModule.navigateToCustomerStories();
    });

    // ═══════════════════════════════════════
    // TC-CS01: Hero section displays correctly
    // ═══════════════════════════════════════
    test('@P0 @Smoke should display hero eyebrow, title, and explore button', async ({
        customerStoriesModule,
    }) => {
        await test.step('Verify hero eyebrow, section title, and CTA button', async () => {
            await customerStoriesModule.verifyHeroSection();
        });
    });

    // ═══════════════════════════════════════
    // TC-CS02: Explore button scrolls to results
    // ═══════════════════════════════════════
    test('@P1 @Regression should scroll to results when clicking Explore button', async ({
        customerStoriesModule,
    }) => {
        await test.step('Click Explore customer success stories button', async () => {
            await customerStoriesModule.clickExploreAndScroll();
        });

        await test.step('Verify page scrolls to results section', async () => {
            // Scroll behavior verified in module method
        });
    });

    // ═══════════════════════════════════════
    // TC-CS03: Filter by Banking and North America returns results
    // ═══════════════════════════════════════
    test('@P1 @Regression should filter by Banking and North America', async ({
        customerStoriesModule,
    }) => {
        await test.step('Scroll to filters section', async () => {
            await customerStoriesModule.clickExploreAndScroll();
        });

        await test.step('Apply Industry=Banking and Country=North America filters', async () => {
            await customerStoriesModule.applyFilters({
                Industry: 'Banking',
                Country: 'North America',
            });
        });
    });

    // ═══════════════════════════════════════
    // TC-CS04: Deep filter returns exactly 19 results
    // ═══════════════════════════════════════
    test('@P1 @Regression should return exactly 19 results for deep filter combination', async ({
        customerStoriesModule,
    }) => {
        await test.step('Scroll to filters section', async () => {
            await customerStoriesModule.clickExploreAndScroll();
        });

        await test.step('Apply High Tech + Vertica + North America + Analytics filters', async () => {
            await customerStoriesModule.applyFilters({
                Industry: 'High Tech',
                Product: 'OpenText Analytics Database (Vertica)',
                Country: 'North America',
                Cloud: 'Analytics',
            });
        });

        await test.step('Verify results count equals 19', async () => {
            await customerStoriesModule.verifyResultsCount(19);
        });
    });
});
