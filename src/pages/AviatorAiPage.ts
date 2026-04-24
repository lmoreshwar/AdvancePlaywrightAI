import { Locator, Page } from '@playwright/test';

export class AviatorAiPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    openTextHomeLink = () => this.page.getByRole('link', { name: /OpenText home page/i }).first();
    mainMenuNav = () => this.page.getByRole('navigation', { name: /Main Menu/i });
    mainMenuButton = (name: string) => this.mainMenuNav().getByRole('button', { name }).first();

    // Secondary nav: on desktop it is always expanded (no toggle button); use the 'Aviator AI' link as the anchor element
    secondaryNav = () =>
        this.page
            .locator('nav')
            .filter({ has: this.page.getByRole('link', { name: /Aviator AI/i }) })
            .first();
    // secondaryToggle exists only on mobile breakpoints — kept for completeness but not asserted on desktop
    secondaryToggle = () => this.page.getByRole('button', { name: /Toggle navigation/i }).first();
    secondaryLink = (name: string) => this.secondaryNav().getByRole('link', { name: new RegExp(name, 'i') }).first();
    // Direct page-level text search so it works without a wrapper nav filter
    secondaryText = (name: string) => this.page.getByText(name, { exact: false }).first();

    heroHeading = (name: string) => this.page.getByRole('heading', { level: 1, name: new RegExp(name, 'i') }).first();

    // ── Hero description locators (D1: Content Completeness — validate description, not just heading) ──
    aviatorHeroDescription = () =>
        this.page.getByText(/AI that understands your business/i).first();
    limitlessHeroDescription = () =>
        this.page.getByText(/Break free from silos/i).first();
    myAviatorHeroDescription = () =>
        this.page.getByText(/Say hello to faster decisions/i).first();

    aviatorPlaygroundRegion = () => this.page.getByRole('region', { name: /OpenText Aviator Playground/i });
    limitlessRegion = () => this.page.getByRole('region', { name: /Tap into the power of AI/i });

    scenarioLibraryHeading = () => this.page.getByRole('heading', { name: /Scenario library/i }).first();
    tabs = () => this.page.getByRole('tab');
    selectedTab = () => this.page.locator('[role="tab"][aria-selected="true"]').first();
    accordionButtons = () => this.page.locator('button[aria-expanded]').filter({ hasText: /.+/ });

    featuredCtaLinks = () => this.aviatorPlaygroundRegion().getByRole('link').filter({ hasText: /Explore all|Sign up|Get started/i });
    regularCardLinks = () =>
        this.aviatorPlaygroundRegion()
            .getByRole('link')
            .filter({ hasText: /Explore/i });

    limitlessPrimarySection = () => this.page.locator('div,section').filter({ has: this.page.getByRole('heading', { level: 1, name: /Limitless with AI/i }) }).first();
    limitlessCtas = () => this.limitlessPrimarySection().getByRole('link').filter({ hasText: /Get started|Try|Sign up|Learn more|Explore/i });

    limitlessAdditionalHeadings = () =>
        this.page
            .getByRole('heading', {
                name: /There’s no limit with AI|AI Resources|Sign up for the Information Matters newsletter|Frequently asked questions/i,
            })
            .filter({ hasText: /.+/ });

    myAviatorVideoFigure = () =>
        this.page
            .getByRole('figure', {
                name: /Turn your complex business content into actionable outputs/i,
            })
            .first();
    myAviatorPrimaryCta = () => this.page.getByRole('link', { name: /Try it for 90 days/i }).first();
    myAviatorSecondaryCta = () => this.page.getByRole('link', { name: /Compare plans/i }).first();
    myAviatorGetAccess = () => this.page.getByRole('link', { name: /Get access/i }).first();

    fiveStepsHeading = () =>
        this.page.getByRole('heading', {
            name: /5 steps to improve conversational productivity with MyAviator/i,
        });
    fiveStepItems = () => this.page.getByRole('heading', { level: 3 }).filter({ hasText: /^[1-5]\s/ });

    plansHeading = () => this.page.getByRole('heading', { level: 2, name: /Plans/i });
    plansTable = () => this.page.getByRole('table').first();
    plansCta = () => this.page.getByRole('link', { name: /Try it for 90 days/i }).last();

    faqHeading = () => this.page.getByRole('heading', { name: /FAQ|Frequently asked questions/i }).first();

    // ── Limitless FAQ accordion (D5: Section Completeness — expand/collapse, not just heading) ──
    limitlessFaqSection = () =>
        this.page.locator('section, div.container').filter({ has: this.faqHeading() }).first();
    limitlessFaqAccordionButtons = () =>
        this.limitlessFaqSection().locator('button[aria-expanded]').filter({ hasText: /.+/ });

    // ── Flip card locators (CLI evidence: .card-flip-wrapper, .card-flip-front, .card-flip-back) ──
    flipCardWrappers = () => this.page.locator('.card-flip-wrapper');
    flipCardFronts = () => this.page.locator('.card-flip-front');
    flipCardBacks = () => this.page.locator('.card-flip-back');

    // ── Featured card locators (CLI evidence: .card.bg-dark.card-bg-pattern-dark, .card-eyebrow) ──
    featuredCard = () => this.page.locator('.card.bg-dark').filter({ has: this.page.locator('.card-eyebrow') }).first();
    featuredCardEyebrow = () => this.featuredCard().locator('.card-eyebrow');
    featuredCardHeading = () => this.featuredCard().locator('h2, h3').first();
    featuredCardDescription = () => this.featuredCard().locator('.card-text, p').first();
    featuredCardCtas = () => this.featuredCard().getByRole('link');

    // ── Secondary nav link set — all links within the secondary nav bar ──
    secondaryNavAllLinks = () => this.secondaryNav().getByRole('link');

    // ── MyAviator Scenario Library section (CLI evidence: heading + collapse-control buttons) ──
    myAviatorScenarioHeading = () =>
        this.page.getByRole('heading', { name: /See how your teams can use MyAviator/i }).first();
    myAviatorScenarioSection = () =>
        this.page.locator('section, div').filter({ has: this.myAviatorScenarioHeading() }).first();
    myAviatorAccordionButtons = () =>
        this.myAviatorScenarioSection().locator('button.collapse-control').filter({ hasText: /.+/ });

    // ── MyAviator Scenario Library subtitle (D1: Content Completeness) ──
    myAviatorScenarioSubtitle = () =>
        this.page.getByText(/Discover how MyAviator simplifies work/i).first();

    // ── Video heading (confirmed from CLI snapshot, video lazy-loads) ──
    myAviatorVideoHeading = () => this.page.getByRole('heading', { name: /^Video$/i }).first();

    async getHref(locator: Locator): Promise<string | null> {
        return locator.getAttribute('href');
    }
}
