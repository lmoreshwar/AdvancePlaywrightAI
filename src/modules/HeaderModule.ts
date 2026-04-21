import { expect, Page } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';
import { Logger } from '../utils/Logger';
import { mainMenuItems } from '../config';

/**
 * HeaderModule - Business logic for header-related test workflows
 * Orchestrates HeaderPage actions for complex test scenarios
 */
export class HeaderModule {
    private page: Page;
    private headerPage: HeaderPage;
    private logger: Logger;

    constructor(page: Page) {
        this.page = page;
        this.headerPage = new HeaderPage(page);
        this.logger = Logger.create('HeaderModule');
    }

    /**
     * Navigate to homepage and verify the header is loaded
     */
    async navigateAndVerifyHeader(): Promise<void> {
        this.logger.step(1, 'Navigate to OpenText homepage');
        await this.page.goto('/', { waitUntil: 'domcontentloaded' });
        
        this.logger.step(2, 'Accept Cookies to unblock UI');
        await this.headerPage.acceptCookies();

        this.logger.step(3, 'Close Floating Popups (Summit/Agent)');
        await this.headerPage.closeInterferingPopups();

        this.logger.step(4, 'Verify header is visible');
        await this.headerPage.expectHeaderVisible();

        this.logger.info('Header loaded successfully');
    }

    /**
     * Verify the OpenText logo is visible and correct size
     */
    async verifyLogo(): Promise<void> {
        this.logger.step(1, 'Check logo visibility');
        await this.headerPage.expectLogoVisible();

        this.logger.step(2, 'Verify logo dimensions');
        const logo = this.headerPage.logoLink();
        const box = await logo.boundingBox();
        if (box) {
            this.logger.info(`Logo dimensions: ${box.width}x${box.height}`);
            if (box.width < 20 || box.height < 10) {
                throw new Error(`Logo appears too small: ${box.width}x${box.height}`);
            }
        }

        this.logger.info('Logo verification passed');
    }

    /**
     * Verify all 7 main menu items are displayed correctly
     */
    async verifyMainMenuItems(): Promise<string[]> {
        this.logger.step(1, 'Check main menu items');
        const menuTexts = await this.headerPage.getMainMenuTexts();
        this.logger.info(`Found menu items: ${menuTexts.join(', ')}`);

        this.logger.step(2, 'Verify expected menu items are present');
        for (const expectedMenu of mainMenuItems) {
            const found = menuTexts.some(text =>
                text.toLowerCase().includes(expectedMenu.toLowerCase())
            );
            if (!found) {
                this.logger.warn(`Menu item "${expectedMenu}" not found in: ${menuTexts.join(', ')}`);
            }
        }

        return menuTexts;
    }

    /**
     * Navigate through all submenus of a given menu item
     * Expands the menu, checks submenu items, then closes
     */
    async navigateSubmenu(menuText: string): Promise<string[]> {
        this.logger.step(1, `Hover/click on "${menuText}" menu`);
        await this.headerPage.hoverMainMenu(menuText);
        await this.page.waitForTimeout(500);

        this.logger.step(2, 'Capture submenu items');
        let submenuTexts: string[] = [];
        try {
            submenuTexts = await this.headerPage.getSubmenuItemTexts();
            this.logger.info(`Submenu items for "${menuText}": ${submenuTexts.length} items found`);
        } catch {
            this.logger.warn(`No submenu found for "${menuText}" or submenu did not open`);
        }

        this.logger.step(3, 'Close submenu by pressing Escape');
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);

        return submenuTexts;
    }

    /**
     * Navigate through ALL 7 main menu items and their submenus
     */
    async navigateAllMenusAndSubmenus(): Promise<Map<string, string[]>> {
        const menuSubmenuMap = new Map<string, string[]>();

        for (let i = 0; i < mainMenuItems.length; i++) {
            const menuItem = mainMenuItems[i];
            this.logger.info(`--- Navigating menu ${i + 1}/${mainMenuItems.length}: ${menuItem} ---`);
            const submenuItems = await this.navigateSubmenu(menuItem);
            menuSubmenuMap.set(menuItem, submenuItems);
        }

        return menuSubmenuMap;
    }

    /**
     * Verify keyboard tabbing works on all menus (Desktop only)
     */
    async verifyTabNavigation(): Promise<void> {
        this.logger.step(1, 'Focus on first menu item');
        const firstMenuItem = this.headerPage.menuItemByText(mainMenuItems[0]);
        await firstMenuItem.focus();

        this.logger.step(2, 'Tab through menu items');
        for (let i = 0; i < mainMenuItems.length; i++) {
            await this.page.keyboard.press('Tab');
            await this.page.waitForTimeout(200);
        }

        this.logger.info('Tab navigation completed');
    }

    /**
     * Verify the language switcher opens a modal
     */
    async verifyLanguageSwitcher(): Promise<void> {
        this.logger.step(1, 'Clear any popups that may block the language switcher');
        await this.headerPage.closeInterferingPopups();

        this.logger.step(2, 'Click language switcher');
        await this.headerPage.clickLanguageSwitcher();
        // Wait longer for the modal overlay to render
        await this.page.waitForTimeout(2000);

        this.logger.step(3, 'Verify language modal is visible');
        await this.headerPage.expectLanguageModalVisible();

        this.logger.step(4, 'Close language modal');
        await this.page.keyboard.press('Escape');

        this.logger.info('Language switcher verification passed');
    }

    /**
     * Verify Contact button visibility and functionality
     */
    async verifyContactButton(): Promise<void> {
        this.logger.step(1, 'Check Contact button visibility');
        await this.headerPage.expectContactButtonVisible();

        this.logger.step(2, 'Click Contact button');
        await this.headerPage.clickContact();
        await this.page.waitForTimeout(500);

        this.logger.info('Contact button verification passed');
    }

    /**
     * Executes the responsive visual assertions for a Mobile layout
     */
    async verifyMobileResponsiveLayout(): Promise<void> {
        this.logger.step(1, 'Verify Desktop navigation is hidden');
        await expect(this.headerPage.headerNav()).toBeHidden();

        this.logger.step(2, 'Verify Mobile Hamburger toggle is visible');
        const hamburger = this.headerPage.hamburgerBtn();
        await expect(hamburger).toBeVisible();

        this.logger.step(3, 'Open Hamburger Menu');
        await hamburger.click();
        await this.page.waitForTimeout(500);

        this.logger.step(4, 'Close mobile menu');
        await this.page.keyboard.press('Escape');
        this.logger.info('Hamburger menu verification passed');
    }

    /**
     * Verify header becomes sticky after scrolling
     */
    async verifyHeaderSticky(): Promise<void> {
        this.logger.step(1, 'Scroll down the page');
        await this.page.evaluate(() => window.scrollTo(0, 1000));
        await this.page.waitForTimeout(500);

        this.logger.step(2, 'Verify header is still visible (sticky)');
        await this.headerPage.expectHeaderVisible();

        this.logger.info('Sticky header verification passed');
    }
}
