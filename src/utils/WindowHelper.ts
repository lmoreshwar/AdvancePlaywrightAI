import { BrowserContext, Page, Locator } from '@playwright/test';
import { WaitHelper } from './WaitHelper';

/**
 * Enterprise Utility: Window / Tab Management
 * Handles multi-tab browser contexts seamlessly.
 */
export class WindowHelper {
    private page: Page;
    private context: BrowserContext;
    private waitHelper: WaitHelper;

    constructor(page: Page) {
        this.page = page;
        this.context = page.context();
        this.waitHelper = new WaitHelper(page);
    }

    /**
     * Clicks a locator that forces a new tab (target="_blank"),
     * and waits for the new page to load.
     * @returns The newly opened Page object
     */
    async clickAndCatchNewTab(triggerLocator: Locator): Promise<Page> {
        const [newPage] = await Promise.all([this.context.waitForEvent('page'), triggerLocator.click()]);
        await newPage.waitForLoadState('domcontentloaded');
        return newPage;
    }

    /**
     * Returns a page currently loaded in the context by matching its title.
     * Throws an error if not found.
     */
    async switchToTabByTitle(title: string): Promise<Page> {
        const pages = this.context.pages();
        for (const p of pages) {
            const pageTitle = await p.title();
            if (pageTitle.includes(title)) {
                await p.bringToFront();
                return p;
            }
        }
        throw new Error(`Tab with title containing "${title}" was not found.`);
    }

    /**
     * Returns a page currently loaded in the context by matching its URL.
     */
    async switchToTabByUrl(urlPart: string): Promise<Page> {
        const pages = this.context.pages();
        for (const p of pages) {
            if (p.url().includes(urlPart)) {
                await p.bringToFront();
                return p;
            }
        }
        throw new Error(`Tab with URL containing "${urlPart}" was not found.`);
    }

    /**
     * Closes all tabs except the main application page.
     * Useful for post-test teardown sequences.
     */
    async closeAllExceptMain(mainPageTitlePart: string): Promise<void> {
        const pages = this.context.pages();
        for (const p of pages) {
            const title = await p.title();
            if (!title.includes(mainPageTitlePart)) {
                await p.close();
            }
        }
    }
}
