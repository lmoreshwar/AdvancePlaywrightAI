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
}
