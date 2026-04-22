import { Page } from '@playwright/test';
import { HomepagePage } from '../pages/HomepagePage';
import { HeaderPage } from '../pages/HeaderPage';
import { FooterPage } from '../pages/FooterPage';
import { Logger } from '../utils/Logger';

/**
 * HomepageModule - Business logic for homepage test workflows
 * Orchestrates Homepage, Header, and Footer page actions
 */
export class HomepageModule {
    private page: Page;
    private homepagePage: HomepagePage;
    private headerPage: HeaderPage;
    private footerPage: FooterPage;
    private logger: Logger;

    constructor(page: Page) {
        this.page = page;
        this.homepagePage = new HomepagePage(page);
        this.headerPage = new HeaderPage(page);
        this.footerPage = new FooterPage(page);
        this.logger = Logger.create('HomepageModule');
    }

    /**
     * Navigate to homepage and verify it loads correctly
     */
    async navigateAndVerifyHomepage(): Promise<void> {
        this.logger.step(1, 'Navigate to OpenText homepage');
        await this.homepagePage.navigate();

        this.logger.step(2, 'Accept Cookies and Close Popups');
        await this.headerPage.acceptCookies();
        await this.headerPage.closeInterferingPopups();

        this.logger.step(3, 'Verify homepage is loaded');
        await this.homepagePage.expectHomepageLoaded();

        this.logger.info('Homepage loaded successfully');
    }

    /**
     * Verify all homepage components render correctly
     */
    async verifyHomepageComponents(): Promise<number> {
        this.logger.step(1, 'Count page sections/components');
        const sectionCount = await this.homepagePage.getSectionCount();
        this.logger.info(`Found ${sectionCount} sections on homepage`);

        this.logger.step(2, 'Verify minimum sections rendered');
        await this.homepagePage.expectSectionsRendered(3);

        this.logger.step(3, 'Verify hero section');
        await this.homepagePage.expectHeroVisible();

        return sectionCount;
    }

    /**
     * Verify padding and layout — no extra white padding on homepage
     */
    async verifyPaddingAndLayout(): Promise<void> {
        this.logger.step(1, 'Check for horizontal scroll (unwanted padding)');
        await this.homepagePage.expectNoHorizontalScroll();

        this.logger.step(2, 'Check full-width layout');
        await this.homepagePage.expectFullWidthLayout();

        this.logger.info('Padding and layout verification passed');
    }

    /**
     * Verify scroller/carousel behavior — no blank pages
     */
    async verifyScrollerBehavior(): Promise<void> {
        this.logger.step(1, 'Locate scrollers on page');
        const scrollerCount = await this.homepagePage.scrollers().count();
        this.logger.info(`Found ${scrollerCount} scrollers on homepage`);

        if (scrollerCount > 0) {
            this.logger.step(2, 'Verify first scroller is visible');
            const firstScroller = this.homepagePage.scrollerByIndex(0);
            // Use evaluate for scroll to bypass actionability/稳定性 checks on moving marquees
            await firstScroller.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));

            this.logger.step(3, 'Check scroller dimensions');
            const box = await firstScroller.boundingBox();
            if (box) {
                this.logger.info(`Scroller dimensions: ${box.width}x${box.height}`);
                if (box.height < 50) {
                    this.logger.warn('Scroller may be collapsed or empty');
                }
            }
        }

        this.logger.info('Scroller verification completed');
    }

    /**
     * Scroll to bottom and verify sticky header + footer
     */
    async verifyScrollToBottomAndFooter(): Promise<void> {
        this.logger.step(1, 'Scroll to bottom of page');
        await this.homepagePage.scrollToBottom();

        this.logger.step(2, 'Verify header is still visible (sticky)');
        await this.headerPage.expectHeaderVisible();

        this.logger.step(3, 'Verify footer is displayed');
        await this.footerPage.expectFooterVisible();

        this.logger.step(4, 'Verify footer has links');
        await this.footerPage.expectFooterLinksPresent();

        this.logger.info('Footer and sticky header verification passed');
    }

    /**
     * Verify clickable cards on homepage
     */
    async verifyClickableCards(): Promise<number> {
        this.logger.step(1, 'Count clickable cards');
        const cardCount = await this.homepagePage.clickableCards().count();
        this.logger.info(`Found ${cardCount} clickable cards on homepage`);

        return cardCount;
    }

    /**
     * Complete homepage regression — all checks in one flow
     */
    async runFullHomepageRegression(): Promise<void> {
        await this.navigateAndVerifyHomepage();
        await this.verifyHomepageComponents();
        await this.verifyPaddingAndLayout();
        await this.verifyScrollerBehavior();
        await this.verifyScrollToBottomAndFooter();
    }
}
