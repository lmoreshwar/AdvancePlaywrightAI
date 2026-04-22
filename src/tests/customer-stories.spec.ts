import { test } from '../fixtures';

test.describe('@P0 @Regression @Customers Customer Stories Regression', () => {
    test.beforeEach(async ({ customerStoriesModule }) => {
        await customerStoriesModule.navigateToCustomerStories();
    });

    test('@P0 @Smoke should display hero eyebrow, title, and explore button', async ({
        customerStoriesModule,
    }) => {
        await test.step('Verify hero eyebrow, section title, and CTA button', async () => {
            await customerStoriesModule.verifyHeroSection();
        });
    });

    test('@P1 @Regression should scroll to results when clicking Explore button', async ({
        customerStoriesModule,
    }) => {
        await test.step('Click Explore customer success stories', async () => {
            await customerStoriesModule.clickExploreAndScroll();
        });
    });

    test('@P1 @Regression should filter by Banking and North America', async ({
        customerStoriesModule,
    }) => {
        await test.step('Scroll to filters section', async () => {
            await customerStoriesModule.clickExploreAndScroll();
        });

        await test.step('Apply Industry=Banking, Country=North America', async () => {
            await customerStoriesModule.applyFilters({
                Industry: 'Banking',
                Country: 'North America',
            });
        });
    });

    test('@P1 @Regression should return exactly 19 results for deep filter', async ({
        customerStoriesModule,
    }) => {
        await test.step('Scroll to filters section', async () => {
            await customerStoriesModule.clickExploreAndScroll();
        });

        await test.step('Apply High Tech + Vertica + North America + Analytics', async () => {
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
