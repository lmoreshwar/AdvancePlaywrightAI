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
     * @param options Configuration for the snapshot (widths, skipStabilization)
     */
    async takeSnapshot(name: string, options: { widths?: number[], skipStabilization?: boolean } = {}): Promise<void> {
        this.logger.info(`Capturing visual snapshot: ${name}`);
        
        try {
            if (!options.skipStabilization) {
                // 1. Ensure page is fully rendered and stabilized
                await this.ensurePageFullyLoaded();
            } else {
                this.logger.info('Skipping stabilization for interactive state.');
            }
            
            // 2. Hide dynamic/noisy elements
            await this.stabilizeDynamicUi();

            // Percy options
            const percyOptions: any = {};
            if (options.widths && options.widths.length > 0) {
                percyOptions.widths = options.widths;
            }

            // Capture the snapshot
            await percySnapshot(this.page, name, percyOptions);
            
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
        
        try {
            // 1. Wait for standard load states (briefly)
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
            
            // 2. Force lazy-loading with a FAST scroll (capped at 5000px or total height)
            await this.page.evaluate(async () => {
                const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
                const scrollStep = 1200;
                const scrollDelay = 100;
                const maxScroll = Math.min(document.body.scrollHeight, 6000);
                
                for (let i = 0; i < maxScroll; i += scrollStep) {
                    window.scrollTo(0, i);
                    await delay(scrollDelay);
                }
                window.scrollTo(0, 0);
            }).catch(() => {});

            // 3. Wait for all visible images to be decoded (with 5s timeout)
            await this.page.evaluate(async () => {
                const images = Array.from(document.querySelectorAll('img'));
                const imagePromises = images.map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => {
                        img.addEventListener('load', resolve);
                        img.addEventListener('error', resolve);
                        setTimeout(resolve, 5000); // Internal timeout per image
                    });
                });
                await Promise.race([
                    Promise.all(imagePromises),
                    new Promise(resolve => setTimeout(resolve, 5000)) // Global timeout for this step
                ]);
            }).catch(() => {});

            // 4. Wait for web fonts to be ready (with 3s timeout)
            await Promise.race([
                this.page.evaluate(() => (document as any).fonts?.ready),
                this.page.waitForTimeout(3000)
            ]).catch(() => {});

            // 5. Wait for all iframes (briefly)
            const frames = this.page.frames();
            await Promise.all(frames.slice(0, 5).map(frame => frame.waitForLoadState('load', { timeout: 3000 }).catch(() => {}))).catch(() => {});

            // 6. Smart Wait: Look for loaders (briefly)
            await this.page.waitForFunction(() => {
                const loaders = document.querySelectorAll('[class*="loader"], [class*="spinner"], [id*="loader"], [id*="spinner"]');
                return Array.from(loaders).every(el => {
                    const style = window.getComputedStyle(el);
                    return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
                });
            }, { timeout: 3000 }).catch(() => {});

            // 7. Final brief settle time
            await this.page.waitForTimeout(1000);
        } catch (error: any) {
            this.logger.warn(`Stabilization incomplete: ${error.message}. Proceeding with snapshot.`);
        }
    }
}
