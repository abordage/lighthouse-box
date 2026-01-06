export type FormFactor = 'mobile' | 'desktop';

export interface ActionInputs {
  ghToken: string;
  gistId: string;
  testUrl: string;
  printSummary: boolean;
  resultBadge: boolean;
  gistTitle: string;
  formFactor: FormFactor;
}

export interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
}

export interface LighthouseResult {
  url: string;
  metrics: LighthouseMetrics;
}

export const METRIC_LABELS: Record<keyof LighthouseMetrics, string> = {
  performance: 'performance',
  accessibility: 'accessibility',
  bestPractices: 'best-practices',
  seo: 'seo',
  pwa: 'pwa',
};
