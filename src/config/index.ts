import * as dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
    baseUrl: string;
    defaultTimeout: number;
    navigationTimeout: number;
    logLevel: string;
    retryCount: number;
    testEnv: string;
}

/**
 * Application configuration — loaded from environment variables.
 * All values can be overridden via .env file or CI environment variables.
 * 
 * NOTE: Test data (menus, viewports) lives in src/testdata/menus.json
 */
export const config: AppConfig = {
    baseUrl: process.env.BASE_URL || 'https://www.opentext.com',
    defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '60000', 10),
    logLevel: process.env.LOG_LEVEL || 'INFO',
    retryCount: parseInt(process.env.RETRY_COUNT || '2', 10),
    testEnv: process.env.TEST_ENV || 'production',
};

export default config;
