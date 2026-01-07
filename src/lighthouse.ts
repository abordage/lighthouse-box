import { exec } from 'child_process';
import { promisify } from 'util';
import type { LighthouseResult, LighthouseMetrics, FormFactor } from './types.js';

const execAsync = promisify(exec);

const LIGHTHOUSE_V13 = '13';
const LIGHTHOUSE_V11 = '11';
const CHROME_FLAGS = '--headless --no-sandbox --disable-gpu';
const MAX_BUFFER = 50 * 1024 * 1024; // 50MB for large JSON output

interface LighthouseReport {
  finalDisplayedUrl: string;
  categories: {
    performance?: { score: number | null };
    accessibility?: { score: number | null };
    'best-practices'?: { score: number | null };
    seo?: { score: number | null };
    pwa?: { score: number | null };
  };
}

function scoreToPercent(score: number | null | undefined): number {
  if (score === null || score === undefined) {
    return 0;
  }
  return Math.round(score * 100);
}

function buildCommand(
  url: string,
  formFactor: FormFactor,
  version: string,
  categories: string[]
): string {
  const args = [
    `npx lighthouse@${version}`,
    `"${url}"`,
    '--output=json',
    '--output-path=stdout',
    `--chrome-flags="${CHROME_FLAGS}"`,
    `--only-categories=${categories.join(',')}`,
    `--form-factor=${formFactor}`,
  ];

  if (formFactor === 'desktop') {
    args.push('--preset=desktop');
  }

  return args.join(' ');
}

function parseReport(stdout: string): LighthouseReport {
  try {
    return JSON.parse(stdout) as LighthouseReport;
  } catch {
    throw new Error('Failed to parse Lighthouse JSON output');
  }
}

/**
 * Run Lighthouse v13 audit for Performance, Accessibility, Best Practices, SEO
 */
async function runMainAudit(
  url: string,
  formFactor: FormFactor
): Promise<{ report: LighthouseReport }> {
  const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
  const command = buildCommand(url, formFactor, LIGHTHOUSE_V13, categories);

  console.log(`[1/2] Running Lighthouse v${LIGHTHOUSE_V13} (${categories.join(', ')})...`);

  const { stdout } = await execAsync(command, { maxBuffer: MAX_BUFFER });

  return { report: parseReport(stdout) };
}

/**
 * Run Lighthouse v11 audit for PWA category only
 * PWA was removed from Lighthouse v12+, so we use v11 for this category
 */
async function runPwaAudit(
  url: string,
  formFactor: FormFactor
): Promise<number> {
  const command = buildCommand(url, formFactor, LIGHTHOUSE_V11, ['pwa']);

  console.log(`[2/2] Running Lighthouse v${LIGHTHOUSE_V11} (pwa)...`);

  try {
    const { stdout } = await execAsync(command, { maxBuffer: MAX_BUFFER });
    const report = parseReport(stdout);
    return scoreToPercent(report.categories.pwa?.score);
  } catch (error) {
    console.warn('Lighthouse v11 (PWA) audit failed, defaulting to 0');
    console.warn(error instanceof Error ? error.message : String(error));
    return 0;
  }
}

export async function runLighthouseAudit(
  url: string,
  formFactor: FormFactor
): Promise<LighthouseResult> {
  const { report: mainReport } = await runMainAudit(url, formFactor);
  const pwaScore = await runPwaAudit(url, formFactor);

  const metrics: LighthouseMetrics = {
    performance: scoreToPercent(mainReport.categories.performance?.score),
    accessibility: scoreToPercent(mainReport.categories.accessibility?.score),
    bestPractices: scoreToPercent(mainReport.categories['best-practices']?.score),
    seo: scoreToPercent(mainReport.categories.seo?.score),
    pwa: pwaScore,
  };

  return {
    url: mainReport.finalDisplayedUrl,
    metrics,
  };
}
