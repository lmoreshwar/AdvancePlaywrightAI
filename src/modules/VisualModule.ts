import { Page } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { Logger } from '../utils/Logger';

/**
 * VisualModule - Handles visual regression snapshots using Percy.
 * This module is kept dedicated to ensure visual testing can be 
 * easily removed or maintained separately from functional logic.
 */
export class VisualModule {
    private page: Page;
    private logger: Logger;

    constructor(page: Page) {
        this.page = page;
        this.logger = Logger.create('VisualModule');
    }

    /**
     * Captures a visual snapshot of the current page and sends it to Percy.
     * @param name Unique name for the snapshot
     * @param widths Optional array of widths to capture (e.g. [375, 768, 1280])
     */
    async takeSnapshot(name: string, widths?: number[]): Promise<void> {
        this.logger.info(`Capturing visual snapshot: ${name}`);
        
        try {
            // 1. Ensure page is fully rendered and stabilized
            await this.ensurePageFullyLoaded();
            
            // 2. Hide dynamic/noisy elements
            await this.stabilizeDynamicUi();

            // Options for Percy snapshot
            const options: any = {};
            if (widths && widths.length > 0) {
                options.widths = widths;
            }

            // Capture the snapshot
            await percySnapshot(this.page, name, options);
            
            this.logger.info(`Snapshot "${name}" successfully sent to Percy.`);
        } catch (error: any) {
            this.logger.error(`Failed to capture Percy snapshot "${name}": ${error.message}`);
            // We don't throw here to avoid failing functional runs if Percy is down/missing token
        }
    }

    /**
     * Reduces flaky visual diffs by hiding known dynamic overlays/widgets
     * before taking a Percy snapshot.
     */
    private async stabilizeDynamicUi(): Promise<void> {
        await this.page.addStyleTag({
            content: `
                #onetrust-banner-sdk, 
                #onetrust-pc-sdk,
                .onetrust-pc-dark-filter,
                .cookie-banner, 
                [id*='cookie'],
                [id*='ot-agent'], 
                [class*='ot-agent'], 
                [data-testid*='agent'],
                #q-messenger-frame, 
                .qlfd-messenger-frame, 
                #qualified-messenger-container,
                iframe[src*="qualified.com"],
                [id*='chat-widget'], 
                [class*='chat-widget'], 
                [aria-label*='chat' i], 
                [aria-label*='assistant' i],
                [id*='summit'], 
                [class*='summit'], 
                [id*='region-selector'], 
                [class*='region-selector'] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                }
            `,
        });

        // Give the DOM a brief moment to settle after hiding dynamic elements.
        await this.page.waitForTimeout(500);
    }

    /**
     * Ensures the page is fully loaded, including lazy-loaded images, 
     * web fonts, and dynamic content.
     */
    private async ensurePageFullyLoaded(): Promise<void> {
        this.logger.info('Ensuring page is fully loaded and stabilized...');
        
        // 1. Wait for standard load states
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('domcontentloaded');
        
        // 2. Force lazy-loading by scrolling to the bottom and back
        await this.page.evaluate(async () => {
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
            const scrollStep = 800;
            const scrollDelay = 150;
            
            for (let i = 0; i < document.body.scrollHeight; i += scrollStep) {
                window.scrollTo(0, i);
                await delay(scrollDelay);
            }
            window.scrollTo(0, 0);
            await delay(200);
        });

        // 3. Wait for all images to be decoded and loaded
        await this.page.evaluate(async () => {
            const images = Array.from(document.querySelectorAll('img'));
            await Promise.all(images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                });
            }));
        });

        // 4. Wait for web fonts to be ready
        await this.page.evaluate(async () => {
            if ('fonts' in document) {
                await (document as any).fonts.ready;
            }
        });

        // 5. Wait for all iframes to finish loading (crucial for HubSpot forms, etc.)
        const frames = this.page.frames();
        await Promise.all(frames.map(frame => frame.waitForLoadState('load').catch(() => {})));

        // 6. Smart Wait: Wait for common loading spinners to disappear
        await this.page.waitForFunction(() => {
            const loaders = document.querySelectorAll('[class*="loader"], [class*="spinner"], [id*="loader"], [id*="spinner"]');
            return Array.from(loaders).every(el => {
                const style = window.getComputedStyle(el);
                return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
            });
        }, { timeout: 5000 }).catch(() => this.logger.warn('Some loading spinners are still present, proceeding with snapshot...'));

        // 7. Final settle time for animations or JS-driven layout shifts
        await this.page.waitForTimeout(2000);
    }
}
