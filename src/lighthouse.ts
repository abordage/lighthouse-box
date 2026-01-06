import lighthouse from 'lighthouse';
import lighthousePwa from 'lighthouse-pwa';
import * as chromeLauncher from 'chrome-launcher';
import type { LighthouseResult, LighthouseMetrics, FormFactor } from './types.js';

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

interface LighthouseOptions {
  port: number;
  output: 'json';
  logLevel: 'error';
  onlyCategories: string[];
  formFactor: FormFactor;
  screenEmulation?: { disabled: boolean };
}

function buildLighthouseOptions(
  port: number,
  formFactor: FormFactor,
  categories: string[]
): LighthouseOptions {
  const options: LighthouseOptions = {
    port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: categories,
    formFactor,
  };

  if (formFactor === 'desktop') {
    options.screenEmulation = { disabled: true };
  }

  return options;
}

/**
 * Run Lighthouse v12 audit for Performance, Accessibility, Best Practices, SEO
 */
async function runMainAudit(
  url: string,
  port: number,
  formFactor: FormFactor
): Promise<{ categories: LighthouseCategories; finalUrl: string }> {
  const options = buildLighthouseOptions(
    port,
    formFactor,
    ['performance', 'accessibility', 'best-practices', 'seo']
  );

  const result = await lighthouse(url, options) as LighthouseRunnerResult | undefined;

  if (!result) {
    throw new Error(`Lighthouse v12 returned no results for ${url}`);
  }

  return {
    categories: result.lhr.categories,
    finalUrl: result.lhr.finalDisplayedUrl,
  };
}

/**
 * Run Lighthouse v11 audit for PWA category only
 */
async function runPwaAudit(
  url: string,
  port: number,
  formFactor: FormFactor
): Promise<number> {
  const options = buildLighthouseOptions(port, formFactor, ['pwa']);

  const result = await lighthousePwa(url, options) as LighthouseRunnerResult | undefined;

  if (!result) {
    console.warn('Lighthouse v11 (PWA) returned no results, defaulting to 0');
    return 0;
  }

  return scoreToPercent(result.lhr.categories.pwa);
}

export async function runLighthouseAudit(
  url: string,
  formFactor: FormFactor
): Promise<LighthouseResult> {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  try {
    console.log(`Running Lighthouse v12 audit (${formFactor}, performance, accessibility, best-practices, seo)...`);
    const mainResult = await runMainAudit(url, chrome.port, formFactor);

    console.log(`Running Lighthouse v11 audit (${formFactor}, pwa)...`);
    const pwaScore = await runPwaAudit(url, chrome.port, formFactor);

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
