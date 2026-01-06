import lighthouse from 'lighthouse';
import lighthousePwa from 'lighthouse-pwa';
import * as chromeLauncher from 'chrome-launcher';
import type { LighthouseResult, LighthouseMetrics } from './types.js';

interface CategoryScore {
  score: number | null;
}

interface LighthouseCategories {
  performance?: CategoryScore;
  accessibility?: CategoryScore;
  'best-practices'?: CategoryScore;
  seo?: CategoryScore;
  pwa?: CategoryScore;
}

interface LighthouseRunnerResult {
  lhr: {
    categories: LighthouseCategories;
    finalDisplayedUrl: string;
  };
}

function scoreToPercent(category: CategoryScore | undefined): number {
  if (!category || category.score === null) {
    return 0;
  }
  return Math.round(category.score * 100);
}

/**
 * Run Lighthouse v12 audit for Performance, Accessibility, Best Practices, SEO
 */
async function runMainAudit(
  url: string,
  port: number
): Promise<{ categories: LighthouseCategories; finalUrl: string }> {
  const result = await lighthouse(url, {
    port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  }) as LighthouseRunnerResult | undefined;

  if (!result) {
    throw new Error(`Lighthouse v12 returned no results for ${url}`);
  }

  return {
    categories: result.lhr.categories,
    finalUrl: result.lhr.finalDisplayedUrl,
  };
}

/**
 * Run Lighthouse v10 audit for PWA category only
 */
async function runPwaAudit(
  url: string,
  port: number
): Promise<number> {
  const result = await lighthousePwa(url, {
    port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['pwa'],
  }) as LighthouseRunnerResult | undefined;

  if (!result) {
    console.warn('Lighthouse v10 (PWA) returned no results, defaulting to 0');
    return 0;
  }

  return scoreToPercent(result.lhr.categories.pwa);
}

export async function runLighthouseAudit(url: string): Promise<LighthouseResult> {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  try {
    console.log('Running Lighthouse v12 audit (performance, accessibility, best-practices, seo)...');
    const mainResult = await runMainAudit(url, chrome.port);

    console.log('Running Lighthouse v10 audit (pwa)...');
    const pwaScore = await runPwaAudit(url, chrome.port);

    const metrics: LighthouseMetrics = {
      performance: scoreToPercent(mainResult.categories.performance),
      accessibility: scoreToPercent(mainResult.categories.accessibility),
      bestPractices: scoreToPercent(mainResult.categories['best-practices']),
      seo: scoreToPercent(mainResult.categories.seo),
      pwa: pwaScore,
    };

    return {
      url: mainResult.finalUrl,
      metrics,
    };
  } finally {
    await chrome.kill();
  }
}
