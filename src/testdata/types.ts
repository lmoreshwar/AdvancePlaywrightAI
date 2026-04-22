/**
 * Type definitions for OpenText test data (src/testdata/)
 *
 * These types define the shape of data in menus.json and
 * other test data files used across spec files.
 */

export interface ViewportConfig {
    name: string;
    width: number;
    height: number;
    type: 'desktop' | 'tablet' | 'mobile';
}
