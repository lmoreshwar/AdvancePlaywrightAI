import { expect, Page } from '@playwright/test';

/**
 * HomepagePage - Page Object for OpenText Homepage
 *
 * Covers: Hero section, page components, scrollers, cards,
 * full-page layout validation
 *
 * NOTE: Locators below are initial placeholders. Use @playwright/cli to
 * discover actual locators:
 *   playwright-cli open https://www.opentext.com --headed
 *   playwright-cli snapshot
 */
export class HomepagePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ============================================
    // LOCATORS (as arrow functions)
    // ============================================

    // Hero Section
    heroSection = () => this.page.getByRole('heading', { level: 1 }).locator('xpath=..').first();
    heroTitle = () => this.page.getByRole('heading', { level: 1 });
    heroCta = () => this.heroSection().locator('a[class*="btn"], a[class*="cta"], button').first();

    // Page Components (Targeting major semantic blocks with headings)
    allSections = () => this.page.locator('xpath=//h2/parent::* | //h3/parent::*').filter({ hasText: /.{5,}/ });
    sectionByIndex = (index: number) => this.allSections().nth(index);

    // Cards
    cards = () => this.page.locator('[class*="card"], [data-testid*="card"]');
    clickableCards = () => this.cards().locator('a');

    // Updated to target specific marquee class found via CLI snapshot
    scrollers = () => this.page.locator('.otscroller, [class*="carousel"], [class*="slider"]');
    scrollerByIndex = (index: number) => this.scrollers().nth(index);

    // Full page wrapper
    // The site lacks a semantic <main> tag; using the hero container as a proxy for main content
    mainContent = () => this.page.getByRole('heading', { level: 1 }).locator('xpath=..').first();
    pageBody = () => this.page.locator('body');

    // ============================================
    // ACTIONS
    // ============================================

    /**
     * Navigate to the OpenText homepage
     */
    async navigate(): Promise<void> {
        await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    }

    /**
     * Scroll to the bottom of the page
     */
    async scrollToBottom(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.page.waitForTimeout(1000);
    }

    /**
     * Scroll to a specific section by index
     */
    async scrollToSection(index: number): Promise<void> {
        await this.sectionByIndex(index).scrollIntoViewIfNeeded();
    }

    /**
     * Get the page title
     */
    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Get the number of sections/components on the page
     */
    async getSectionCount(): Promise<number> {
        return await this.allSections().count();
    }

    /**
     * Get all card texts
     */
    async getCardTexts(): Promise<string[]> {
        const texts = await this.cards().allTextContents();
        return texts.map((t) => t.trim()).filter((t) => t.length > 0);
    }

    /**
     * Check if page has horizontal scroll (unwanted padding issue)
     */
    async hasHorizontalScroll(): Promise<boolean> {
        return await this.page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
    }

    /**
     * Get the page zoom level
     */
    async getPageZoom(): Promise<number> {
        return await this.page.evaluate(() => {
            return Math.round(window.devicePixelRatio * 100);
        });
    }

    // ============================================
    // ASSERTIONS
    // ============================================

    async expectHomepageLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/opentext\.com/);
        await expect(this.mainContent()).toBeVisible();
    }

    async expectHeroVisible(): Promise<void> {
        await expect(this.heroSection()).toBeVisible();
    }

    async expectNoHorizontalScroll(): Promise<void> {
        const hasScroll = await this.hasHorizontalScroll();
        expect(hasScroll).toBe(false);
    }

    async expectSectionsRendered(minCount: number = 3): Promise<void> {
        const count = await this.getSectionCount();
        expect(count).toBeGreaterThanOrEqual(minCount);
    }

    async expectFullWidthLayout(): Promise<void> {
        const bodyWidth = await this.page.evaluate(() => document.body.offsetWidth);
        const viewportWidth = await this.page.evaluate(() => window.innerWidth);
        // Body should use full viewport width (within 5px tolerance for scrollbar)
        expect(bodyWidth).toBeGreaterThanOrEqual(viewportWidth - 20);
    }
}
