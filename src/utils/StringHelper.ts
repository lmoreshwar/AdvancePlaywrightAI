/**
 * Enterprise Utility: String Operations
 * Helpful for parsing and cleaning extracted UI text.
 */
export class StringHelper {
    /**
     * Extracts all numbers from a string (including decimals).
     * Ideal for converting formatted currency ("$1,245.50") into math-ready Numbers.
     */
    static extractNumber(text: string): number | null {
        if (!text) return null;
        // Removes anything that isn't a digit or a period
        const parsed = text.replace(/[^\d.]/g, '');
        if (!parsed) return null;
        return parseFloat(parsed);
    }

    /**
     * Advanced string sanitizer.
     * Strips newlines, tabs, and hidden HTML non-breaking spaces (&nbsp;).
     */
    static sanitizeHtmlSpace(text: string): string {
        if (!text) return '';
        return text
            .replace(/&nbsp;/g, ' ')
            .replace(/\u00A0/g, ' ') // raw non-breaking space
            .replace(/\s+/g, ' ') // collapse multiple spaces into one
            .trim();
    }

    /**
     * Capitalizes the first letter of each word in a string.
     */
    static toTitleCase(str: string): string {
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
    }
}
