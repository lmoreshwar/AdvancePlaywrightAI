import { Page, Locator } from '@playwright/test';

export class CustomerStoriesPage {
    readonly page: Page;

    // ═══════════════════════════════════════
    // Hero Section (verified via CLI Phase 2)
    // ═══════════════════════════════════════
    readonly heroEyebrow: Locator;
    readonly sectionTitle: Locator;
    readonly exploreButton: Locator;

    // ═══════════════════════════════════════
    // Results Section (verified via CLI Phase 2)
    // ═══════════════════════════════════════
    readonly resultsCount: Locator;
    readonly filterForm: Locator;

    constructor(page: Page) {
        this.page = page;

        // Hero — eyebrow is a div with class "section-header-eyebrow"
        this.heroEyebrow = page.locator('div.section-header-eyebrow');

        // Hero — h1 heading with class "section-header-title"
        this.sectionTitle = page.locator('h1.section-header-title');

        // Hero — primary CTA button linking to #customer-search
        this.exploreButton = page.locator('a.btn.btn-primary[href="#customer-search"]');

        // Results — count is inside span#search-count within div.filtered-search-count
        this.resultsCount = page.locator('span#search-count');

        // Filter form container
        this.filterForm = page.locator('form.filtered-search-filter');
    }

    /**
     * Locates a specific filter fieldset by its legend text (e.g., "By Industry")
     */
    getFilterFieldset(filterName: string): Locator {
        return this.filterForm.locator(`fieldset:has(legend:has-text("${filterName}"))`);
    }

    /**
     * Locates a checkbox option inside a specific filter fieldset
     */
    getFilterOption(filterName: string, optionText: string): Locator {
        return this.getFilterFieldset(filterName).locator(`label:has-text("${optionText}")`);
    }
}
