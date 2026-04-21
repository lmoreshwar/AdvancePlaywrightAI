// Type definitions for OpenText test data

export interface ViewportConfig {
    name: string;
    width: number;
    height: number;
    type: 'desktop' | 'tablet' | 'mobile';
}

export interface MenuItemData {
    name: string;
    hasSubmenu: boolean;
    expectedSubmenuCount?: number;
}

export interface TestCaseData {
    id: string;
    name: string;
    category: 'Header' | 'Homepage' | 'Responsive' | 'Footer';
    priority: 'P0' | 'P1' | 'P2';
    tags: string[];
    viewport?: string;
    steps: string[];
    expectedResults: string[];
}
