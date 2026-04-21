import { test as base } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';
import { HomepagePage } from '../pages/HomepagePage';
import { FooterPage } from '../pages/FooterPage';
import { HeaderModule } from '../modules/HeaderModule';
import { HomepageModule } from '../modules/HomepageModule';

export type TestFixtures = {
    // Page Objects
    headerPage: HeaderPage;
    homepagePage: HomepagePage;
    footerPage: FooterPage;
    // Modules
    headerModule: HeaderModule;
    homepageModule: HomepageModule;
};

export const test = base.extend<TestFixtures>({
    /**
     * Header Page fixture
     */
    headerPage: async ({ page }, use) => {
        await use(new HeaderPage(page));
    },

    /**
     * Homepage Page fixture
     */
    homepagePage: async ({ page }, use) => {
        await use(new HomepagePage(page));
    },

    /**
     * Footer Page fixture
     */
    footerPage: async ({ page }, use) => {
        await use(new FooterPage(page));
    },

    /**
     * Header Module fixture
     */
    headerModule: async ({ page }, use) => {
        await use(new HeaderModule(page));
    },

    /**
     * Homepage Module fixture
     */
    homepageModule: async ({ page }, use) => {
        await use(new HomepageModule(page));
    },

    /**
     * 🛡️ AUTO-DISMISS OVERLAYS — Global popup/overlay handlers
     * 
     * Uses Playwright's addLocatorHandler() to automatically dismiss
     * any blocking overlay (cookie banner, Summit popup, OT Agent chatbot)
     * whenever they interfere with a test action.
     * 
     * This runs for EVERY test automatically via the 'page' fixture.
     */
    page: async ({ page }, use) => {
        // ─── Handler 1: Cookie Consent Banner ───
        // Triggered when "Accept All" button appears and blocks an action
        await page.addLocatorHandler(
            page.getByRole('button', { name: 'Accept All' }),
            async () => {
                await page.getByRole('button', { name: 'Accept All' }).click();
                console.log('[AutoDismiss] 🍪 Cookie banner dismissed');
            },
            { noWaitAfter: true }
        );

        // ─── Handler 2: OpenText Summit Floating Popup ───
        // Triggered when the Summit promo popup appears
        await page.addLocatorHandler(
            page.getByText('OpenText Summits 2026').first(),
            async () => {
                // Try the close button on the Summit popup
                const closeBtn = page.locator('button:near(:text("OpenText Summits"))').first();
                if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                    await closeBtn.click();
                } else {
                    await page.keyboard.press('Escape');
                }
                console.log('[AutoDismiss] 🎪 Summit popup dismissed');
            },
            { noWaitAfter: true }
        );

        // ─── Handler 3: OT Agent Chatbot ───
        // Triggered when the OpenText Agent chatbot widget appears
        await page.addLocatorHandler(
            page.getByText('OT Agent').first(),
            async () => {
                const agentClose = page.locator('[aria-label*="Close"], [aria-label*="Collapse"], .ot-agent-close').first();
                if (await agentClose.isVisible({ timeout: 1000 }).catch(() => false)) {
                    await agentClose.click();
                } else {
                    await page.keyboard.press('Escape');
                }
                console.log('[AutoDismiss] 🤖 OT Agent chatbot dismissed');
            },
            { noWaitAfter: true }
        );

        // ─── Handler 4: Privacy/GDPR Close Button ───
        await page.addLocatorHandler(
            page.locator('#onetrust-banner-sdk').first(),
            async () => {
                const acceptBtn = page.getByRole('button', { name: 'Accept All' });
                if (await acceptBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                    await acceptBtn.click();
                }
                console.log('[AutoDismiss] 🔒 Privacy banner dismissed');
            },
            { noWaitAfter: true }
        );

        await use(page);
    },
});

export { expect } from '@playwright/test';
