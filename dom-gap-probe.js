const { chromium } = require('@playwright/test');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // ========== AVIATOR PAGE ==========
    await page.goto('https://www.opentext.com/aviator-ai', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // R1.9: Bento grid counts inside regions
    const bentoInfo = await page.evaluate(() => {
        const regions = document.querySelectorAll('[role="region"]');
        const regInfo = Array.from(regions).map(r => ({
            label: r.getAttribute('aria-label'),
            cards: r.querySelectorAll('.card').length,
            flip: r.querySelectorAll('.card-flip-wrapper').length,
            featured: r.querySelectorAll('.card.bg-dark').length,
        }));
        // also check page-wide
        return {
            regions: regInfo,
            pageFlipWrappers: document.querySelectorAll('.card-flip-wrapper').length,
            pageFeatured: document.querySelectorAll('.card.bg-dark').length,
        };
    });
    console.log('=== BENTO GRID COUNTS ===');
    console.log(JSON.stringify(bentoInfo, null, 2));

    // R1.10: Flip card hover - check CSS transition/transform classes
    const flipInfo = await page.evaluate(() => {
        const wrapper = document.querySelector('.card-flip-wrapper');
        if (!wrapper) return 'NO WRAPPER';
        const inner = wrapper.querySelector('.card-flip-inner,[class*=flip-inner]');
        return {
            wrapperClass: wrapper.className,
            innerClass: inner ? inner.className : 'NO_INNER',
            wrapperStyle: wrapper.getAttribute('style') || 'none',
            innerStyle: inner ? (inner.getAttribute('style') || 'none') : 'none',
            hasTransform: inner ? window.getComputedStyle(inner).transform : 'no inner',
        };
    });
    console.log('=== FLIP CARD HOVER EVIDENCE ===');
    console.log(JSON.stringify(flipInfo, null, 2));

    // R1.14/R1.17: Scenario Library tab panels structure
    const scenarioInfo = await page.evaluate(() => {
        const tabpanels = document.querySelectorAll('[role="tabpanel"]');
        const info = Array.from(tabpanels).map((panel, i) => {
            const eyebrow = panel.querySelector('[class*="eyebrow"]');
            const title = panel.querySelector('h2, h3, h4');
            const tags = panel.querySelectorAll('.badge, .tag, [class*="tag"]');
            const ctas = panel.querySelectorAll('a.btn, a[class*="cta"]');
            const sideCard = panel.querySelector('.card');
            const accordions = panel.querySelectorAll('button[aria-expanded]');
            return {
                panelIndex: i,
                hasEyebrow: !!eyebrow,
                eyebrowText: eyebrow ? eyebrow.textContent.trim().substring(0, 50) : null,
                title: title ? title.textContent.trim().substring(0, 60) : null,
                tagCount: tags.length,
                ctaCount: ctas.length,
                hasSideCard: !!sideCard,
                accordionCount: accordions.length,
            };
        });
        return { tabCount: document.querySelectorAll('[role="tab"]').length, panels: info };
    });
    console.log('=== SCENARIO LIBRARY TAB CONTENT ===');
    console.log(JSON.stringify(scenarioInfo, null, 2));

    // ========== LIMITLESS PAGE ==========
    await page.goto('https://www.opentext.com/limitless', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // R2.3: Limitless description
    const limitlessDesc = await page.evaluate(() => {
        const h = [...document.querySelectorAll('h1')].find(el => /limitless/i.test(el.textContent));
        if (!h) return 'NO H1';
        const parent = h.closest('section, div.container, div.row') || h.parentElement;
        const ps = parent.querySelectorAll('p');
        return {
            heading: h.textContent.trim().substring(0, 60),
            descriptions: Array.from(ps).slice(0, 3).map(p => p.textContent.trim().substring(0, 120)),
        };
    });
    console.log('=== LIMITLESS HERO DESC ===');
    console.log(JSON.stringify(limitlessDesc, null, 2));

    // R2.5: FAQ accordion on Limitless page
    const faqInfo = await page.evaluate(() => {
        const headings = document.querySelectorAll('h2, h3');
        const faqH = [...headings].find(h => /faq|frequently/i.test(h.textContent));
        if (!faqH) return 'NO FAQ HEADING';
        const parent = faqH.closest('section') || faqH.closest('div.container') || faqH.parentElement;
        const accordions = parent.querySelectorAll('button[aria-expanded]');
        return {
            heading: faqH.textContent.trim(),
            accordionCount: accordions.length,
            firstText: accordions.length > 0 ? accordions[0].textContent.trim().substring(0, 80) : null,
            firstExpanded: accordions.length > 0 ? accordions[0].getAttribute('aria-expanded') : null,
        };
    });
    console.log('=== LIMITLESS FAQ ACCORDION ===');
    console.log(JSON.stringify(faqInfo, null, 2));

    // Limitless flip cards?
    const limitlessFlip = await page.evaluate(() => ({
        flipWrappers: document.querySelectorAll('.card-flip-wrapper').length,
        featured: document.querySelectorAll('.card.bg-dark').length,
    }));
    console.log('=== LIMITLESS FLIP CARDS ===');
    console.log(JSON.stringify(limitlessFlip, null, 2));

    // ========== MYAVIATOR PAGE ==========
    await page.goto('https://www.opentext.com/aviator-ai/myaviator', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // R3.4: MyAviator hero description
    const myAvDesc = await page.evaluate(() => {
        const h = [...document.querySelectorAll('h1')].find(el => /myaviator|aviator/i.test(el.textContent));
        if (!h) return 'NO H1';
        const parent = h.closest('section') || h.closest('div.container') || h.parentElement;
        const ps = parent.querySelectorAll('p');
        return {
            heading: h.textContent.trim().substring(0, 60),
            descriptions: Array.from(ps).slice(0, 3).map(p => p.textContent.trim().substring(0, 120)),
        };
    });
    console.log('=== MYAVIATOR HERO DESC ===');
    console.log(JSON.stringify(myAvDesc, null, 2));

    // R3.6: Video / play button
    const videoInfo = await page.evaluate(() => {
        const videos = document.querySelectorAll('video');
        const iframes = document.querySelectorAll('iframe');
        const figures = document.querySelectorAll('figure');
        const allButtons = document.querySelectorAll('button');
        const playBtns = [...allButtons].filter(b => {
            const label = (b.getAttribute('aria-label') || '') + ' ' + b.className + ' ' + b.textContent;
            return /play/i.test(label);
        });
        // Also look for anchor-based play triggers
        const playLinks = [...document.querySelectorAll('a')].filter(a => {
            const label = (a.getAttribute('aria-label') || '') + ' ' + a.className;
            return /play/i.test(label);
        });
        return {
            videoCount: videos.length,
            iframeCount: iframes.length,
            figureCount: figures.length,
            playBtnCount: playBtns.length,
            playBtnDetails: playBtns.map(b => ({
                tag: b.tagName,
                class: b.className.substring(0, 80),
                ariaLabel: b.getAttribute('aria-label'),
            })),
            playLinkCount: playLinks.length,
            playLinkDetails: playLinks.map(a => ({
                class: a.className.substring(0, 80),
                ariaLabel: a.getAttribute('aria-label'),
                href: a.getAttribute('href'),
            })),
        };
    });
    console.log('=== MYAVIATOR VIDEO INFO ===');
    console.log(JSON.stringify(videoInfo, null, 2));

    // R3.8: MyAviator Scenario Library subtitle/prompt
    const myScenario = await page.evaluate(() => {
        const heading = [...document.querySelectorAll('h2, h3')].find(h => /see how your teams/i.test(h.textContent));
        if (!heading) return 'NO HEADING';
        const section = heading.closest('section') || heading.closest('div.container') || heading.parentElement;
        const subtitle = section.querySelector('p');
        const accordions = section.querySelectorAll('button.collapse-control');
        // expand first and check content
        const panels = section.querySelectorAll('.collapse, [class*="collapse"]');
        const panelTexts = Array.from(panels).slice(0, 2).map(p => p.textContent.trim().substring(0, 80));
        return {
            subtitle: subtitle ? subtitle.textContent.trim().substring(0, 120) : null,
            accordionCount: accordions.length,
            panelCount: panels.length,
            panelTexts,
        };
    });
    console.log('=== MYAVIATOR SCENARIO DETAILS ===');
    console.log(JSON.stringify(myScenario, null, 2));

    // R3.11: Plans section eyebrow
    const plansInfo = await page.evaluate(() => {
        const h = [...document.querySelectorAll('h2')].find(h => /plans/i.test(h.textContent));
        if (!h) return 'NO PLANS HEADING';
        const parent = h.closest('section') || h.closest('div.container') || h.parentElement;
        const eyebrow = parent.querySelector('[class*="eyebrow"]');
        const table = parent.querySelector('table');
        return {
            heading: h.textContent.trim(),
            hasEyebrow: !!eyebrow,
            eyebrowText: eyebrow ? eyebrow.textContent.trim() : null,
            hasTable: !!table,
            tableRows: table ? table.querySelectorAll('tr').length : 0,
        };
    });
    console.log('=== MYAVIATOR PLANS SECTION ===');
    console.log(JSON.stringify(plansInfo, null, 2));

    await browser.close();
})().catch(e => console.error(e));
