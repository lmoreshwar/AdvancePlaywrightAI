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
 * Application configuration loaded from environment variables
 */
export const config: AppConfig = {
    baseUrl: process.env.BASE_URL || 'https://www.opentext.com',
    defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
    navigationTimeout: parseInt(process.env.NAVIGATION_TIMEOUT || '60000', 10),
    logLevel: process.env.LOG_LEVEL || 'INFO',
    retryCount: parseInt(process.env.RETRY_COUNT || '2', 10),
    testEnv: process.env.TEST_ENV || 'production',
};

/**
 * OpenText viewport breakpoints from test cases
 */
export const viewportBreakpoints = {
    xl: { width: 1376, height: 900 },
    lg: { width: 968, height: 900 },
    md: { width: 720, height: 1024 },
    sm: { width: 576, height: 1024 },
    xs: { width: 440, height: 900 },
} as const;

/**
 * OpenText main navigation menu items
 */
export const mainMenuItems = [
    'Why OpenText',
    'Products',
    'Solutions',
    'Services',
    'Partners',
    'Support',
    'Resources',
] as const;

/**
 * OpenText header utility items
 */
export const headerUtilityItems = [
    'Search',
    'Language switcher',
    'My Account',
    'Contact',
] as const;

export default config;
