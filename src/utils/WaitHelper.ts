import { Page, Locator } from '@playwright/test';

export interface WaitOptions {
    timeout?: number;
    interval?: number;
    message?: string;
}

export interface RetryOptions {
    retries?: number;
    delay?: number;
}

export class WaitHelper {
    private page: Page;
    private defaultTimeout: number = 30000;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForCondition(
        condition: () => Promise<boolean>,
        options?: WaitOptions,
    ): Promise<void> {
        const timeout = options?.timeout || this.defaultTimeout;
        const interval = options?.interval || 500;
        const message = options?.message || 'Condition not met';

        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (await condition()) {
                return;
            }
            await this.page.waitForTimeout(interval);
        }
        throw new Error(`Timeout: ${message} after ${timeout}ms`);
    }

    async waitForTextContains(locator: Locator, text: string, options?: WaitOptions): Promise<void> {
        await this.waitForCondition(
            async () => {
                const content = await locator.textContent();
                return content?.includes(text) || false;
            },
            { ...options, message: options?.message || `Text to contain "${text}"` },
        );
    }

    async waitForTextEquals(locator: Locator, text: string, options?: WaitOptions): Promise<void> {
        await this.waitForCondition(
            async () => {
                const content = await locator.textContent();
                return content?.trim() === text;
            },
            { ...options, message: options?.message || `Text to equal "${text}"` },
        );
    }

    async waitForElementCount(locator: Locator, count: number, options?: WaitOptions): Promise<void> {
        await this.waitForCondition(
            async () => {
                const actualCount = await locator.count();
                return actualCount === count;
            },
            { ...options, message: options?.message || `Element count to be ${count}` },
        );
    }

    async waitForUrlContains(urlPart: string, options?: WaitOptions): Promise<void> {
        await this.waitForCondition(
            async () => {
                return this.page.url().includes(urlPart);
            },
            { ...options, message: options?.message || `URL to contain "${urlPart}"` },
        );
    }

    async waitForNetworkIdle(options?: { timeout?: number }): Promise<void> {
        await this.page.waitForLoadState('networkidle', { timeout: options?.timeout || this.defaultTimeout });
    }

    async retry<T>(action: () => Promise<T>, options?: RetryOptions): Promise<T> {
        const retries = options?.retries || 3;
        const delay = options?.delay || 1000;

        let lastError: Error | undefined;
        for (let i = 0; i < retries; i++) {
            try {
                return await action();
            } catch (error) {
                lastError = error as Error;
                if (i < retries - 1) {
                    await this.page.waitForTimeout(delay);
                }
            }
        }
        throw lastError;
    }

    async waitForElementStable(locator: Locator, options?: WaitOptions): Promise<void> {
        const timeout = options?.timeout || this.defaultTimeout;
        const interval = options?.interval || 100;

        let lastBox = await locator.boundingBox();
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            await this.page.waitForTimeout(interval);
            const currentBox = await locator.boundingBox();

            if (lastBox && currentBox &&
                lastBox.x === currentBox.x &&
                lastBox.y === currentBox.y &&
                lastBox.width === currentBox.width &&
                lastBox.height === currentBox.height) {
                return;
            }
            lastBox = currentBox;
        }
        throw new Error(`Timeout: Element not stable after ${timeout}ms`);
    }
}
