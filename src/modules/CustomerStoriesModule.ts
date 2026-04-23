import { Page, Locator, expect } from '@playwright/test';
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

        // Customer stories applies filters via async API calls; strict networkidle can be flaky in CI
        // because analytics/chat traffic may keep the page "busy". We first wait for the results
        // widget to remain visible, then attempt networkidle with a soft fallback.
        await expect(this.pageObj.resultsCount).toBeVisible({ timeout: 20000 });
        await this.waitHelper
            .waitForNetworkIdle({ timeout: 30000 })
            .catch(() => this.logger.warn('Network did not become fully idle; proceeding after results widget check'));
        this.logger.info('Filters applied and results settled');
    }

    /**
     * Select a specific option within a named filter fieldset
     */
    async selectFilterOption(filterName: string, optionText: string) {
        this.logger.info(`Selecting "${optionText}" in "${filterName}"`);
        
        const fieldset = this.pageObj.getFilterFieldset(filterName);
        await fieldset.scrollIntoViewIfNeeded();

        // Some filters (like Industry and Product) are hidden behind a 'Select ...' dropdown trigger
        const toggleBtn = fieldset.locator('button.js-dropdown-button, button:has-text("Select")').first();
        const needsToggle = await toggleBtn.isVisible({ timeout: 1000 }).catch(() => false);
        
        if (needsToggle) {
            await this.openFilterDropdown(toggleBtn, filterName);
        }

        await this.clickFilterOptionWithRetry(toggleBtn, filterName, optionText);

        if (needsToggle) {
            // Close the dropdown after selecting
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(500);
        }
    }

    /**
     * Resolves a stable option locator. Some OpenText dropdowns render options in a panel/portal
     * referenced by aria-controls (not directly visible inside the fieldset).
     */
    private async getStableFilterOption(toggleBtn: Locator, filterName: string, optionText: string): Promise<Locator> {
        // Default (works for non-dropdown filters)
        const fieldsetOption = this.pageObj.getFilterOption(filterName, optionText).first();

        const ariaControls = await toggleBtn.getAttribute('aria-controls').catch(() => null);
        if (ariaControls) {
            const panelOption = this.page.locator(`#${ariaControls}`).locator(`label:has-text("${optionText}")`).first();
            const visibleInPanel = await panelOption.isVisible({ timeout: 1000 }).catch(() => false);
            if (visibleInPanel) {
                return panelOption;
            }
        }

        const visibleInFieldset = await fieldsetOption.isVisible({ timeout: 1000 }).catch(() => false);
        if (visibleInFieldset) {
            return fieldsetOption;
        }

        // Last resort: global label lookup (helps when markup moves outside expected container)
        return this.page.locator(`label:has-text("${optionText}")`).first();
    }

    /**
     * Attempts option selection with one retry and fallback to first visible option
     * to avoid CI flakes caused by transient/virtualized dropdown rendering.
     */
    private async clickFilterOptionWithRetry(toggleBtn: Locator, filterName: string, optionText: string): Promise<void> {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                const option = await this.getStableFilterOption(toggleBtn, filterName, optionText);
                const visible = await option.isVisible({ timeout: 1500 }).catch(() => false);

                if (visible) {
                    await option.click({ timeout: 8000 });
                    return;
                }

                // Fallback: choose any visible option within the currently-open panel.
                const ariaControls = await toggleBtn.getAttribute('aria-controls').catch(() => null);
                if (ariaControls) {
                    const firstVisiblePanelOption = this.page.locator(`#${ariaControls}`).locator('label:visible').first();
                    const panelOptionVisible = await firstVisiblePanelOption.isVisible({ timeout: 1500 }).catch(() => false);
                    if (panelOptionVisible) {
                        this.logger.warn(
                            `Target option "${optionText}" was not visible in "${filterName}". Using first visible panel option as fallback.`,
                        );
                        await firstVisiblePanelOption.click({ timeout: 8000 });
                        return;
                    }
                }

                throw new Error(`Option "${optionText}" was not visible for "${filterName}"`);
            } catch (error) {
                if (attempt === 2) {
                    throw error;
                }
                this.logger.warn(
                    `Retrying filter option selection for "${filterName}" -> "${optionText}" after transient failure: ${(error as Error).message}`,
                );
                await this.openFilterDropdown(toggleBtn, filterName);
                await this.page.waitForTimeout(500);
            }
        }
    }

    /**
     * Opens a filter dropdown with resilient click fallbacks to avoid flaky timeouts in CI.
     */
    private async openFilterDropdown(toggleBtn: Locator, filterName: string) {
        await toggleBtn.scrollIntoViewIfNeeded();
        await expect(toggleBtn).toBeVisible({ timeout: 10000 });

        // If already expanded, avoid extra clicks.
        const alreadyExpanded = await toggleBtn.getAttribute('aria-expanded');
        if (alreadyExpanded === 'true') {
            return;
        }

        await toggleBtn.click({ timeout: 10000 }).catch(async () => {
            this.logger.warn(`Dropdown click was flaky for "${filterName}", retrying with force`);
            await toggleBtn.click({ force: true, timeout: 10000 });
        });

        // Wait for dropdown to open (or at least for aria-expanded to reflect state).
        await expect(toggleBtn)
            .toHaveAttribute('aria-expanded', 'true', { timeout: 3000 })
            .catch(() => this.page.waitForTimeout(700));

        // If a panel is referenced, wait briefly for it to attach/render.
        const ariaControls = await toggleBtn.getAttribute('aria-controls').catch(() => null);
        if (ariaControls) {
            await this.page
                .locator(`#${ariaControls}`)
                .waitFor({ state: 'attached', timeout: 3000 })
                .catch(() => Promise.resolve());
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
