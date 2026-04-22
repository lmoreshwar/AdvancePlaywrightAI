import { Page, Locator, FrameLocator } from '@playwright/test';

/**
 * Enterprise Utility: Iframe Handling
 * Locates and interacts across cross-domain iframes.
 */
export class IframeHelper {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Locates an iframe reliably by a partial URL.
     * Prevents false-positives with generic tags.
     */
    getIframeByUrl(urlFilter: string | RegExp): FrameLocator {
        return this.page.frameLocator(`iframe[src*="${urlFilter}"]`);
    }

    /**
     * Helper to click an element deep inside a cross-domain iframe.
     */
    async clickInIframe(urlFilter: string, selector: string): Promise<void> {
        const frame = this.getIframeByUrl(urlFilter);
        await frame.locator(selector).click();
    }

    /**
     * Helper to fill text inside a cross-domain iframe.
     */
    async fillInIframe(urlFilter: string, selector: string, value: string): Promise<void> {
        const frame = this.getIframeByUrl(urlFilter);
        await frame.locator(selector).fill(value);
    }
}
