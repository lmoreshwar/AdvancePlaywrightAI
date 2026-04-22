import { APIRequestContext, APIResponse, request } from '@playwright/test';
import { Logger } from './Logger';

/**
 * Enterprise Utility: API Testing & Data Seeding
 * Wraps @playwright/test api capabilities for test setup/teardown.
 */
export class ApiHelper {
    private context: APIRequestContext | null = null;
    private baseUrl: string;
    private defaultHeaders: { [key: string]: string };

    constructor(baseUrl: string, authData?: { token?: string }) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };

        if (authData?.token) {
            this.defaultHeaders['Authorization'] = `Bearer ${authData.token}`;
        }
    }

    /**
     * Initialize connection using Playwright Context
     */
    private async initContext(): Promise<APIRequestContext> {
        if (!this.context) {
            this.context = await request.newContext({
                baseURL: this.baseUrl,
                extraHTTPHeaders: this.defaultHeaders,
            });
        }
        return this.context;
    }

    /**
     * Perform HTTP GET request and safely unwrap JSON
     */
    async get(endpoint: string): Promise<{ status: number; body: any }> {
        const ctx = await this.initContext();
        Logger.debug(`API GET Endpoint: ${endpoint}`);
        const response = await ctx.get(endpoint);
        return this.parseResponse(response);
    }

    /**
     * Perform HTTP POST request
     */
    async post(endpoint: string, payload: any): Promise<{ status: number; body: any }> {
        const ctx = await this.initContext();
        Logger.debug(`API POST Endpoint: ${endpoint}`);
        const response = await ctx.post(endpoint, { data: payload });
        return this.parseResponse(response);
    }

    /**
     * Auto parses response text to JSON and safely catches server 5xx string errors
     */
    private async parseResponse(response: APIResponse): Promise<{ status: number; body: any }> {
        const status = response.status();
        const text = await response.text();
        let body;
        try {
            body = text ? JSON.parse(text) : {};
        } catch (e) {
            body = { rawText: text }; // Text fallback (e.g. 502 Bad Gateway HTML)
        }
        return { status, body };
    }
}
