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
});

export { expect } from '@playwright/test';
