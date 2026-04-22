/**
 * Utility class for generating random test data
 */
export class DataGenerator {
    private static readonly CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
    private static readonly CHARS_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private static readonly CHARS_NUMERIC = '0123456789';

    static randomString(length: number, charset?: string): string {
        const chars = charset || DataGenerator.CHARS_LOWER + DataGenerator.CHARS_UPPER;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    static randomEmail(domain?: string): string {
        const localPart = this.randomString(10).toLowerCase();
        const emailDomain = domain || 'test.example.com';
        return `${localPart}@${emailDomain}`;
    }

    static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomElement<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    static randomUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * Generate a random date between two dates
     */
    static randomDate(start: Date, end: Date): Date {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    /**
     * Generate a past date within the last N days
     */
    static randomPastDate(days: number): Date {
        const end = new Date();
        const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
        return this.randomDate(start, end);
    }

    /**
     * Generate a future date within the next N days
     */
    static randomFutureDate(days: number): Date {
        const start = new Date();
        const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
        return this.randomDate(start, end);
    }

    /**
     * Generate a random formatted date (YYYY-MM-DD by default)
     */
    static randomFormattedDate(daysOffset: number = 30): string {
        const date = Math.random() > 0.5 ? this.randomPastDate(daysOffset) : this.randomFutureDate(daysOffset);
        return date.toISOString().split('T')[0];
    }

    /**
     * Generate a random 10-digit US phone number
     */
    static randomPhone(): string {
        const areaCode = this.randomInt(200, 999);
        const prefix = this.randomInt(200, 999);
        const line = this.randomInt(1000, 9999);
        return `(${areaCode}) ${prefix}-${line}`;
    }
}
