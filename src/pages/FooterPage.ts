import { expect, Page } from '@playwright/test';

/**
 * FooterPage - Page Object for OpenText website footer
 *
 * NOTE: Locators below are initial placeholders. Use @playwright/cli to
 * discover actual locators:
 *   playwright-cli open https://www.opentext.com --headed
 *   playwright-cli snapshot
 */
export class FooterPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ============================================
    // LOCATORS (as arrow functions)
    // ============================================

    // Use specific role to avoid blockquote footers (testimonials)
    footer = () => this.page.getByRole('contentinfo');
    footerLinks = () => this.footer().locator('a');
    footerLogo = () => this.footer().locator('img, svg').first();
    footerColumns = () => this.footer().locator('ul, [class*="column"], [class*="col"]');
    copyrightText = () => this.footer().locator('[class*="copyright"], [class*="legal"]').first();
    socialLinks = () =>
        this.footer().locator('a[href*="linkedin"], a[href*="twitter"], a[href*="facebook"], a[href*="youtube"]');

    // ============================================
    // ACTIONS
    // ============================================

    /**
     * Scroll to footer
     */
    async scrollToFooter(): Promise<void> {
        await this.footer().scrollIntoViewIfNeeded();
    }

    /**
     * Get all footer link texts
     */
    async getFooterLinkTexts(): Promise<string[]> {
        const texts = await this.footerLinks().allTextContents();
        return texts.map((t) => t.trim()).filter((t) => t.length > 0);
    }

    /**
     * Get footer link count
     */
    async getFooterLinkCount(): Promise<number> {
        return await this.footerLinks().count();
    }

    // ============================================
    // ASSERTIONS
    // ============================================

    async expectFooterVisible(): Promise<void> {
        await expect(this.footer()).toBeVisible();
    }

    async expectFooterLinksPresent(): Promise<void> {
        // Wait for first link to be present to handle lazy-loaded footers
        await this.footerLinks().first().waitFor({ state: 'visible' });
        const count = await this.getFooterLinkCount();
        expect(count).toBeGreaterThan(0);
    }

    async expectCopyrightVisible(): Promise<void> {
        await expect(this.copyrightText()).toBeVisible();
    }
}
