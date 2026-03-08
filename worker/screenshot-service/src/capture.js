import { chromium } from "playwright";

export async function capture(url) {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 1,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      extraHTTPHeaders: { "Accept-Language": "ja,en;q=0.9" },
    });

    const page = await context.newPage();

    // Block analytics and ad domains before navigating — reduces noise and
    // prevents them from keeping the network busy indefinitely
    await page.route(
      /googletag|googleanalytics|gtag|doubleclick|facebook\.net|hotjar|clarity\.ms|amazon-adsystem/,
      route => route.abort()
    );

    // domcontentloaded fires once HTML is parsed and initial scripts run,
    // before ads/trackers load — much more reliable than networkidle on real sites
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    // Wait for JS frameworks to finish rendering
    await page.waitForTimeout(3000);

    // Scroll to bottom to trigger lazy-loaded sections, then back to top
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      type: "jpeg",
      quality: 75,
      animations: "disabled",
    });

    const screenshot = screenshotBuffer.toString("base64");
    const html = await page.content();
    const title = await page.title();
    const finalUrl = page.url();

    await context.close();
    return { screenshot, html, title, finalUrl };

  } finally {
    await browser.close();
  }
}
