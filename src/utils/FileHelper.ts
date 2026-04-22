import { Page, Locator } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Enterprise Utility: File Uploads & Downloads
 * Automates system OS hooks and validates payloads.
 */
export class FileHelper {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Clicks a button and waits for the OS download event.
     * Saves it relative to the test output directory.
     * @returns The absolute path to the downloaded file.
     */
    async waitForDownload(triggerLocator: Locator, saveDir: string = 'test-results/downloads'): Promise<string> {
        const [download] = await Promise.all([this.page.waitForEvent('download'), triggerLocator.click()]);

        fs.mkdirSync(saveDir, { recursive: true });
        const suggestedName = download.suggestedFilename();
        const filePath = path.join(saveDir, suggestedName);

        await download.saveAs(filePath);
        return filePath;
    }

    /**
     * Uploads a local file silently via a locator (bypass OS dialog).
     */
    async uploadFile(locator: Locator, absoluteFilePath: string): Promise<void> {
        if (!fs.existsSync(absoluteFilePath)) {
            throw new Error(`Cannot upload file because it does not exist: ${absoluteFilePath}`);
        }
        await locator.setInputFiles(absoluteFilePath);
    }

    /**
     * Uploads multiple files simultaneously.
     */
    async uploadMultipleFiles(locator: Locator, filePaths: string[]): Promise<void> {
        filePaths.forEach((fp) => {
            if (!fs.existsSync(fp)) throw new Error(`Missing file: ${fp}`);
        });
        await locator.setInputFiles(filePaths);
    }
}
