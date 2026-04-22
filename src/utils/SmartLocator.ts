import { Locator, Page } from '@playwright/test';

/**
 * LocatorStrategy — Defines a single locator approach with metadata
 */
export interface LocatorStrategy {
    /** Human-readable name for this strategy (e.g. 'role', 'testid', 'css') */
    name: string;
    /** The Playwright locator to attempt */
    locator: Locator;
}

/**
 * SelfHealingEvent — Logged when a fallback locator is used
 */
export interface SelfHealingEvent {
    timestamp: string;
    elementName: string;
    primaryStrategy: string;
    usedStrategy: string;
    fallbackIndex: number;
    message: string;
}

/**
 * SmartLocator — Self-healing locator utility for Playwright
 *
 * Wraps multiple locator strategies with automatic fallback.
 * When the primary locator fails, it tries fallbacks in order
 * and logs a warning for later analysis.
 *
 * @example
 * ```ts
 * const logo = await SmartLocator.resolve('Logo', [
 *     { name: 'role', locator: page.getByRole('link', { name: /OpenText/i }).first() },
 *     { name: 'testid', locator: page.getByTestId('ot-logo') },
 *     { name: 'css', locator: page.locator('header a[href="/"]').first() },
 * ]);
 * await expect(logo).toBeVisible();
 * ```
 */
export class SmartLocator {
    /** Global registry of all self-healing events during the test run */
    private static healingEvents: SelfHealingEvent[] = [];

    /**
     * Resolve the first working locator from a list of strategies.
     * Tries each strategy in order; logs a warning if a fallback is used.
     *
     * @param elementName - Human-readable name for logging (e.g. "Logo", "Search Icon")
     * @param strategies - Ordered list of locator strategies (primary first)
     * @param options - Optional configuration
     * @returns The first locator that resolves to a visible/attached element
     */
    static async resolve(
        elementName: string,
        strategies: LocatorStrategy[],
        options: { timeout?: number; state?: 'visible' | 'attached' } = {},
    ): Promise<Locator> {
        const { timeout = 5000, state = 'visible' } = options;

        if (strategies.length === 0) {
            throw new Error(`[SmartLocator] No strategies provided for "${elementName}"`);
        }

        // Try each strategy in order
        for (let i = 0; i < strategies.length; i++) {
            const strategy = strategies[i];
            try {
                const waitState = state === 'visible' ? 'visible' : 'attached';
                await strategy.locator.waitFor({ state: waitState, timeout });

                // If this is NOT the primary (index > 0), log a self-healing event
                if (i > 0) {
                    const event: SelfHealingEvent = {
                        timestamp: new Date().toISOString(),
                        elementName,
                        primaryStrategy: strategies[0].name,
                        usedStrategy: strategy.name,
                        fallbackIndex: i,
                        message: `⚠️ Self-healed "${elementName}": primary "${strategies[0].name}" failed → used fallback "${strategy.name}" (index ${i})`,
                    };
                    SmartLocator.healingEvents.push(event);
                    console.warn(`[SmartLocator] ${event.message}`);
                }

                return strategy.locator;
            } catch {
                // This strategy failed, try next
                if (i < strategies.length - 1) {
                    console.debug(
                        `[SmartLocator] Strategy "${strategy.name}" failed for "${elementName}", trying next...`,
                    );
                }
            }
        }

        // All strategies failed — throw with detailed info
        const tried = strategies.map((s) => s.name).join(', ');
        throw new Error(
            `[SmartLocator] All ${strategies.length} strategies failed for "${elementName}". Tried: [${tried}]. This is likely a Locator Change or UI Bug.`,
        );
    }

    /**
     * Build a combined Playwright locator using .or() chains from strategies.
     * This is a simpler approach that doesn't track self-healing but provides fallback.
     *
     * @param elementName - Human-readable name for error messages
     * @param strategies - Ordered list of locator strategies
     * @returns A single combined locator with .or() chains and .first()
     */
    static combine(elementName: string, strategies: LocatorStrategy[]): Locator {
        if (strategies.length === 0) {
            throw new Error(`[SmartLocator] No strategies provided for "${elementName}"`);
        }

        let combined = strategies[0].locator;
        for (let i = 1; i < strategies.length; i++) {
            combined = combined.or(strategies[i].locator);
        }
        return combined.first();
    }

    /**
     * Get all self-healing events from the current test run
     */
    static getHealingEvents(): SelfHealingEvent[] {
        return [...SmartLocator.healingEvents];
    }

    /**
     * Check if any self-healing occurred during the run
     */
    static hasSelfHealed(): boolean {
        return SmartLocator.healingEvents.length > 0;
    }

    /**
     * Get a summary string of all self-healing events
     */
    static getSummary(): string {
        if (SmartLocator.healingEvents.length === 0) {
            return '✅ No self-healing events — all primary locators worked.';
        }

        const lines = [
            `⚠️ ${SmartLocator.healingEvents.length} self-healing event(s) detected:`,
            '',
            ...SmartLocator.healingEvents.map(
                (e, i) =>
                    `  ${i + 1}. "${e.elementName}" — primary "${e.primaryStrategy}" → fallback "${e.usedStrategy}"`,
            ),
        ];
        return lines.join('\n');
    }

    /**
     * Reset the healing events registry (call between test suites if needed)
     */
    static reset(): void {
        SmartLocator.healingEvents = [];
    }
}
