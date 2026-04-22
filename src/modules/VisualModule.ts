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
            // Options for Percy snapshot
            const options: any = {};
            if (widths && widths.length > 0) {
                options.widths = widths;
            }

            // Capture the snapshot
            await percySnapshot(this.page, name, options);
            
            this.logger.info(`Snapshot "${name}" successfully sent to Percy.`);
        } catch (error) {
            this.logger.error(`Failed to capture Percy snapshot "${name}": ${error.message}`);
            // We don't throw here to avoid failing functional runs if Percy is down/missing token
        }
    }
}
