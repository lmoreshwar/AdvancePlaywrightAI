import { expect, Page } from '@playwright/test';

/**
 * HeaderPage - Page Object for OpenText website header
 * Updated using strict Anti-Hallucination rules and CLI snapshot data.
 */
export class HeaderPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ============================================
    // LOCATORS (Strictly Semantic)
    // ============================================

    // Cookie Banner (Must be handled first)
    acceptCookiesBtn = () => this.page.getByRole('button', { name: 'Accept All' });
    privacyCloseBtn = () =>
        this.page.getByRole('button', { name: /Close|Dismiss/i }).or(this.page.locator('.ot-close-icon'));

    // Floating Pop-ups (Marketing & Chatbots)
    summitPopupClose = () =>
        this.page
            .getByRole('button', { name: /Close|-ismiss/i })
            .or(this.page.locator('.close-btn, [aria-label*="Close"]'))
            .first();
    otAgentClose = () =>
        this.page
            .getByRole('button', { name: /Close-Collapse Agent/i })
            .or(this.page.locator('.ot-agent-close, #ot-agent-close'))
            .first();

    // Logo (from snapshot) — matches aria-label set on the OpenText home page link
    logoLink = () => this.page.getByRole('link', { name: /OpenText home page/i }).first();

    // Main Navigation Menu Items
    headerNav = () => this.page.getByRole('navigation', { name: /Main Menu/i });

    // Mobile Responsive Controls
    hamburgerBtn = () => this.page.getByRole('button', { name: /Toggle navigation|Menu/i });

    // Semantic getters for dropdowns
    menuItemByText = (text: string) => this.headerNav().getByRole('button', { name: text }).first();

    // Utilities
    searchIcon = () => this.page.getByRole('link', { name: /Search/i }).first();
    languageSwitcher = () => this.page.getByRole('link', { name: /Choose your country/i }).first();
    myAccountLink = () => this.page.getByRole('button', { name: 'My Account' }).first();
    contactButton = () => this.page.getByRole('link', { name: 'Contact' }).first();

    // ============================================
    // ACTIONS
    // ============================================

    async acceptCookies(): Promise<void> {
        // Wait for the cookie banner to appear
        await this.page.waitForTimeout(2000);

        const acceptBtn = this.acceptCookiesBtn();
        const closeBtn = this.privacyCloseBtn();

        if (await acceptBtn.isVisible().catch(() => false)) {
            await acceptBtn.click().catch(() => {});
            // Wait for the cookie banner to disappear after clicking
            await acceptBtn.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        } else if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click().catch(() => {});
        }

        // Extra safety wait for overlay to fully clear
        await this.page.waitForTimeout(500);
    }

    /**
     * Attempts to dynamically close any marketing popups that interfere with UI
     */
    async closeInterferingPopups(): Promise<void> {
        // Handle Summit Popup — close via its specific X button
        try {
            const summitPopup = this.page.getByText(/OpenText Summit|Find a summit near you/i).first();
            if (await summitPopup.isVisible({ timeout: 2000 })) {
                // Try clicking the close button on the Summit popup
                const closeBtn = this.page
                    .locator('.close-btn, [aria-label*="Close"], button:has(.close-icon)')
                    .first();
                if (await closeBtn.isVisible({ timeout: 1000 })) {
                    await closeBtn.click();
                } else {
                    await this.page.keyboard.press('Escape');
                }
                await this.page.waitForTimeout(500);
            }
        } catch (e) {
            /* Ignore if it doesn't appear */
        }

        // Handle OT Agent Chatbot
        try {
            const agentChat = this.page
                .locator(
                    '.ot-agent-close, #ot-agent-close, [aria-label*="Close Agent"], [aria-label*="Collapse Agent"]',
                )
                .first();
            if (await agentChat.isVisible({ timeout: 1000 })) {
                await agentChat.click();
                await this.page.waitForTimeout(500);
            }
        } catch (e) {
            /* Ignore if it doesn't appear */
        }
    }

    async clickMainMenu(menuText: string): Promise<void> {
        await this.menuItemByText(menuText).click();
    }

    async clickLogo(): Promise<void> {
        await this.logoLink().click();
    }

    async hoverMainMenu(menuText: string): Promise<void> {
        await this.menuItemByText(menuText).hover();
    }

    async getMainMenuTexts(): Promise<string[]> {
        const items = await this.headerNav().getByRole('button').allTextContents();
        return items.map((t) => t.trim()).filter((t) => t.length > 0);
    }

    async getSubmenuItemTexts(): Promise<string[]> {
        // Placeholder for active submenu
        const items = await this.page.locator('[class*="submenu"][class*="active"] a').allTextContents();
        return items.map((t) => t.trim()).filter((t) => t.length > 0);
    }

    async clickSearch(): Promise<void> {
        await this.searchIcon().click();
    }

    async clickLanguageSwitcher(): Promise<void> {
        const localeLink = this.languageSwitcher();
        await localeLink.scrollIntoViewIfNeeded();
        await expect(localeLink).toBeVisible({ timeout: 10000 });

        try {
            await localeLink.click({ timeout: 15000 });
        } catch {
            // Fallback for transient overlay/intercept issues in CI.
            await localeLink.click({ timeout: 15000, force: true });
        }
    }

    async clickContact(): Promise<void> {
        await this.contactButton().click();
    }

    async openHamburgerMenu(): Promise<void> {
        await this.hamburgerBtn().click();
    }

    // ============================================
    // ASSERTIONS
    // ============================================

    async expectLogoVisible(): Promise<void> {
        await expect(this.logoLink()).toBeVisible();
    }

    async expectHeaderVisible(): Promise<void> {
        // On mobile, the 'Main menu' navigation might be hidden, so we check logo or hamburger
        // Added .first() to avoid strict mode violations when both logo and nav are visible
        await expect(this.logoLink().or(this.headerNav()).or(this.hamburgerBtn()).first()).toBeVisible();
    }

    async expectMenuItemVisible(menuText: string): Promise<void> {
        await expect(this.menuItemByText(menuText)).toBeVisible();
    }

    async expectSearchIconVisible(): Promise<void> {
        await expect(this.searchIcon()).toBeVisible();
    }

    async expectLanguageSwitcherVisible(): Promise<void> {
        await expect(this.languageSwitcher()).toBeVisible();
    }

    async expectLanguageModalVisible(): Promise<void> {
        // The region modal contains heading "Choose your region:" and country lists.
        // Use getByText with visible filter to find the modal heading.
        const regionHeading = this.page.getByText('Choose your region:', { exact: false });
        const americasText = this.page.getByText('Americas', { exact: true });

        await expect(regionHeading.or(americasText).first()).toBeVisible({ timeout: 10000 });
    }

    async expectContactButtonVisible(): Promise<void> {
        await expect(this.contactButton()).toBeVisible();
    }

    async expectHamburgerVisible(): Promise<void> {
        await expect(this.hamburgerBtn()).toBeVisible();
    }

    async expectHamburgerHidden(): Promise<void> {
        await expect(this.hamburgerBtn()).toBeHidden();
    }

    async expectHeaderSticky(): Promise<void> {
        // Use .first() in case multiple header elements are detected as sticky
        await expect(this.page.locator('header[class*="sticky"]').first()).toBeVisible();
    }
}
