const { chromium } = require('@playwright/test');

(async () => {
    const browser = await chromium.launch();

    // ── Aviator AI ──────────────────────────────────────────────────────────
    let page = await browser.newPage();
    await page.goto('https://www.opentext.com/aviator-ai', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    const aviatorData = await page.evaluate(() => {
        // Flip/card classes
        const flipSels = ['[class*="flip"]', '[class*="card-back"]', '[class*="card-front"]', '[class*="bento"]'];
        const flipResults = {};
        for (const sel of flipSels) {
            const els = document.querySelectorAll(sel);
            if (els.length) flipResults[sel] = { count: els.length, sample: els[0].className.slice(0, 150) };
        }

        // Featured card
        const featuredCard = document.querySelector('[class*="featured"]');
        const featuredInfo = featuredCard ? {
            cls: featuredCard.className.slice(0, 150),
            text: featuredCard.textContent.slice(0, 200)
        } : null;

        // Secondary nav links
        const allNavs = Array.from(document.querySelectorAll('nav'));
        const secondaryNav = allNavs.find(n => n.textContent.includes('Aviator AI'));
        const secondaryLinks = secondaryNav
            ? Array.from(secondaryNav.querySelectorAll('a[href]')).map(a => ({ text: a.textContent.trim().slice(0, 60), href: a.getAttribute('href') }))
            : [];

        return { flipResults, featuredInfo, secondaryLinks };
    });

    console.log('=== AVIATOR DOM ===');
    console.log(JSON.stringify(aviatorData, null, 2));
    await page.close();

    // ── MyAviator ────────────────────────────────────────────────────────────
    page = await browser.newPage();
    await page.goto('https://www.opentext.com/aviator-ai/myaviator', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    const myAviatorData = await page.evaluate(() => {
        // Scenario library / accordion
        const accordions = Array.from(document.querySelectorAll('button[aria-expanded]'))
            .map(b => ({ text: b.textContent.trim().slice(0, 80), expanded: b.getAttribute('aria-expanded') }))
            .filter(b => b.text);

        // Video
        const videos = Array.from(document.querySelectorAll('video,iframe[src*="youtube"],iframe[src*="vimeo"]'))
            .map(v => ({ tag: v.tagName, src: (v.getAttribute('src') || v.getAttribute('data-src') || '').slice(0, 100) }));

        // 5 steps section
        const steps = Array.from(document.querySelectorAll('h3,h4'))
            .filter(h => /^\d/.test(h.textContent.trim()))
            .map(h => h.textContent.trim().slice(0, 80));

        // Secondary nav links
        const allNavs = Array.from(document.querySelectorAll('nav'));
        const secondaryNav = allNavs.find(n => n.textContent.includes('Aviator'));
        const navLinks = secondaryNav
            ? Array.from(secondaryNav.querySelectorAll('a')).map(a => a.textContent.trim().slice(0, 60))
            : [];

        return { accordions, videos, steps, navLinks };
    });

    console.log('=== MYAVIATOR DOM ===');
    console.log(JSON.stringify(myAviatorData, null, 2));
    await page.close();

    await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
