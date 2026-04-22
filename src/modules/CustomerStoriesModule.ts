import { Page, expect } from '@playwright/test';
import { CustomerStoriesPage } from '../pages/CustomerStoriesPage';
import { Logger, WaitHelper, StringHelper } from '../utils';

export class CustomerStoriesModule {
    readonly page: Page;
    readonly pageObj: CustomerStoriesPage;
    readonly waitHelper: WaitHelper;
    readonly logger: Logger;

    constructor(page: Page) {
        this.page = page;
        this.pageObj = new CustomerStoriesPage(page);
        this.waitHelper = new WaitHelper(page);
        this.logger = Logger.create('CustomerStoriesModule');
    }

    /**
     * Navigate directly to /customers page
     */
    async navigateToCustomerStories() {
        this.logger.step(1, 'Navigate to /customers');
        await this.page.goto('/customers', { waitUntil: 'domcontentloaded' });
    }

    /**
     * Verify the hero section: eyebrow, title, and explore button
     */
    async verifyHeroSection() {
        this.logger.step(2, 'Verify Hero Section');

        // Eyebrow text
        await expect(this.pageObj.heroEyebrow).toBeVisible();
        await expect(this.pageObj.heroEyebrow).toContainText('Customer stories');

        // Section title
        await expect(this.pageObj.sectionTitle).toBeVisible();
        await expect(this.pageObj.sectionTitle).toContainText('Read customer success stories');

        // Explore CTA button
        await expect(this.pageObj.exploreButton).toBeVisible();
        await expect(this.pageObj.exploreButton).toContainText('Explore customer success stories');

        this.logger.info('Hero section verified successfully');
    }

    /**
     * Click the Explore button and verify scroll to the results section
     */
    async clickExploreAndScroll() {
        this.logger.step(3, 'Click Explore and scroll to results');
        await this.pageObj.exploreButton.click();
        await this.page.waitForTimeout(1500);

        await expect(this.pageObj.filterForm).toBeVisible();
        this.logger.info('Scrolled to results section successfully');
    }

    /**
     * Apply filter selections by clicking checkbox labels inside fieldsets
     */
    async applyFilters(filters: { Industry?: string; Product?: string; Country?: string; Cloud?: string }) {
        this.logger.step(4, `Applying filters - ${JSON.stringify(filters)}`);

        if (filters.Industry) await this.selectFilterOption('By Industry', filters.Industry);
        if (filters.Product) await this.selectFilterOption('By Product', filters.Product);
        if (filters.Country) await this.selectFilterOption('By Region', filters.Country);
        if (filters.Cloud) await this.selectFilterOption('By Cloud', filters.Cloud);

        await this.page.waitForTimeout(2000);
        await this.waitHelper.waitForNetworkIdle({ timeout: 15000 });
        this.logger.info('Filters applied and results settled');
    }

    /**
     * Select a specific option within a named filter fieldset
     */
    private async selectFilterOption(filterName: string, optionText: string) {
        this.logger.info(`Selecting "${optionText}" in "${filterName}"`);
        
        const fieldset = this.pageObj.getFilterFieldset(filterName);
        await fieldset.scrollIntoViewIfNeeded();

        // Some filters (like Industry and Product) are hidden behind a 'Select ...' dropdown trigger
        const toggleBtn = fieldset.locator('button:has-text("Select")').first();
        const needsToggle = await toggleBtn.isVisible({ timeout: 1000 }).catch(() => false);
        
        if (needsToggle) {
            await toggleBtn.click();
            await this.page.waitForTimeout(1000); // 1s animation wait
        }

        const option = this.pageObj.getFilterOption(filterName, optionText);
        await option.scrollIntoViewIfNeeded();
        await option.click();

        if (needsToggle) {
            // Close the dropdown after selecting
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Verify the total results count displayed on screen
     */
    async verifyResultsCount(expectedCount: number) {
        this.logger.step(5, `Verifying results count = ${expectedCount}`);

        await expect(this.pageObj.resultsCount).toBeVisible({ timeout: 10000 });
        const rawText = await this.pageObj.resultsCount.textContent();
        const extractedNum = StringHelper.extractNumber(rawText || '0');

        this.logger.info(`Extracted count: ${extractedNum} (expected: ${expectedCount})`);
        expect(extractedNum).toEqual(expectedCount);
    }
}
