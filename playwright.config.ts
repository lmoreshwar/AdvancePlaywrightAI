import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * OpenText Website - Playwright Configuration
 * 
 * Viewport breakpoints from test cases:
 *   XL >= 1376, LG >= 968, MD >= 720, SM >= 576, XS >= 440
 */
export default defineConfig({
    testDir: './src/tests',
    timeout: 180000,
    expect: { timeout: 30000 },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 8 : 4,

    reporter: [
        ['./src/utils/AiDebugReporter.ts'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['list'],
    ],

    use: {
        baseURL: process.env.BASE_URL || 'https://www.opentext.com',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        navigationTimeout: 90000,
        actionTimeout: 30000,
    },

    projects: [
        // ═══════════════════════════════════════
        // Desktop Browsers
        // ═══════════════════════════════════════
        {
            name: 'desktop-chrome',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1440, height: 900 },
            },
        },
        {
            name: 'desktop-firefox',
            use: {
                ...devices['Desktop Firefox'],
                viewport: { width: 1440, height: 900 },
            },
        },
        {
            name: 'desktop-safari',
            use: {
                ...devices['Desktop Safari'],
                viewport: { width: 1440, height: 900 },
            },
        },
        {
            name: 'desktop-edge',
            use: {
                ...devices['Desktop Edge'],
                viewport: { width: 1440, height: 900 },
            },
        },

        // ═══════════════════════════════════════
        // Viewport Breakpoints (from test cases)
        // ═══════════════════════════════════════
        {
            name: 'viewport-xl',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1376, height: 900 },
            },
        },
        {
            name: 'viewport-lg',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 968, height: 900 },
            },
        },
        {
            name: 'viewport-md',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 720, height: 1024 },
            },
        },
        {
            name: 'viewport-sm',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 576, height: 1024 },
            },
        },
        {
            name: 'viewport-xs',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 440, height: 900 },
            },
        },

        // ═══════════════════════════════════════
        // Mobile Devices
        // ═══════════════════════════════════════
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'mobile-safari',
            use: { ...devices['iPhone 13'] },
        },

        // ═══════════════════════════════════════
        // Tablet Devices
        // ═══════════════════════════════════════
        {
            name: 'tablet-chrome',
            use: { ...devices['Galaxy Tab S4'] },
        },
        {
            name: 'tablet-safari',
            use: { ...devices['iPad (gen 7)'] },
        },
    ],
});
