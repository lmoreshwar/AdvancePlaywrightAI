import { test, expect } from '@playwright/test';
import { HeaderModule } from '../../modules/HeaderModule';

// @Tags match the RICE-POT prompt pattern map
test.describe('@P2 @Responsive @Header - Mobile Layout Regression', () => {
    test('@P2 @Mobile Should display hamburger toggle and hide desktop nav on small viewports', async ({
        page,
        isMobile,
    }) => {
        // Skip this test if it's running on a Desktop viewport project
        test.skip(!isMobile, 'This test is strictly designed for responsive/mobile viewports.');

        const headerModule = new HeaderModule(page);

        // Standard setup (navigate to OpenText, clear cookies)
        await headerModule.navigateAndVerifyHeader();

        // Responsive validation check
        await headerModule.verifyMobileResponsiveLayout();
    });
});
