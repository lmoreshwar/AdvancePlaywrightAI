// Temporary DOM probe script - run with: node scripts/dom-probe.js
const { chromium } = require('@playwright/test');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });

    // ── AVIATOR PAGE ─────────────────────────────────────────────────────────
    await page.goto('https://www.opentext.com/aviator-ai', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    const aviatorData = await page.evaluate(() => {
        // Flip card selectors
        const flipSelectors = ['[class*="flip"]', '[class*="card-back"]', '[class*="card-front"]', '[class*="bento"]', '[class*="card"]'];
        const flipMatches = [];
        for (const sel of flipSelectors) {
            const els = document.querySelectorAll(sel);
            if (els.length) flipMatches.push({ sel, count: els.length, sample: els[0].className.slice(0, 120) });
        }

        // Find playground region / bento section
        const bentoSection = document.querySelector('[aria-label*="Playground"], [data-component*="bento"], section[class*="bento"]');
        const bentoInfo = bentoSection ? { tag: bentoSection.tagName, ariaLabel: bentoSection.getAttribute('aria-label'), cls: bentoSection.className.slice(0, 120) } : null;

        // Featured card - look for article/div with eyebrow + heading + cta
        const articles = Array.from(document.querySelectorAll('article, [class*="card"]')).slice(0, 10);
        const articleInfo = articles.map(a => ({ tag: a.tagName, cls: a.className.slice(0, 100), text: a.textContent.trim().slice(0, 80) }));

        // Secondary nav links
        const secNavLinks = Array.from(document.querySelectorAll('nav a')).map(a => ({ text: a.textContent.trim().slice(0, 60), href: a.getAttribute('href') })).filter(a => a.text).slice(0, 20);

        // Accordion buttons (aria-expanded)
        const accordions = Array.from(document.querySelectorAll('button[aria-expanded]')).map(b => ({ text: b.textContent.trim().slice(0, 80), expanded: b.getAttribute('aria-expanded') })).slice(0, 10);

        return { flipMatches, bentoInfo, articleInfo, secNavLinks, accordions };
    });

    console.log('=== AVIATOR FLIP MATCHES ===');
    console.log(JSON.stringify(aviatorData.flipMatches, null, 2));
    console.log('=== AVIATOR BENTO INFO ===');
    console.log(JSON.stringify(aviatorData.bentoInfo, null, 2));
    console.log('=== AVIATOR ARTICLES (first 10) ===');
    console.log(JSON.stringify(aviatorData.articleInfo, null, 2));
    console.log('=== SECONDARY NAV LINKS ===');
    console.log(JSON.stringify(aviatorData.secNavLinks, null, 2));
    console.log('=== ACCORDION BUTTONS ===');
    console.log(JSON.stringify(aviatorData.accordions, null, 2));

    // ── MYAVIATOR PAGE ───────────────────────────────────────────────────────
    await page.goto('https://www.opentext.com/aviator-ai/myaviator', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    const myAviatorData = await page.evaluate(() => {
        // Accordion buttons
        const accordions = Array.from(document.querySelectorAll('button[aria-expanded]')).map(b => ({
            text: b.textContent.trim().slice(0, 80),
            expanded: b.getAttribute('aria-expanded'),
            cls: b.className.slice(0, 80)
        }));

        // Video elements
        const videos = Array.from(document.querySelectorAll('video, [class*="video"], [class*="Video"], iframe[src*="video"]')).map(v => ({
            tag: v.tagName, src: v.getAttribute('src') || '', cls: v.className.slice(0, 80)
        }));

        // Scenario Library heading
        const headings = Array.from(document.querySelectorAll('h1,h2,h3')).map(h => h.textContent.trim().slice(0, 80)).filter(Boolean);

        return { accordions, videos, headings };
    });

    console.log('\n=== MYAVIATOR ACCORDIONS ===');
    console.log(JSON.stringify(myAviatorData.accordions, null, 2));
    console.log('=== MYAVIATOR VIDEOS ===');
    console.log(JSON.stringify(myAviatorData.videos.slice(0, 5), null, 2));
    console.log('=== MYAVIATOR PAGE HEADINGS ===');
    console.log(JSON.stringify(myAviatorData.headings, null, 2));

    await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
