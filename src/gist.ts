import { Octokit } from '@octokit/rest';
import { METRIC_LABELS, type LighthouseMetrics } from './types.js';

const BADGE_THRESHOLD_GOLD = 90;
const BADGE_THRESHOLD_SILVER = 80;
const BADGE_PERFECT_SCORE = 100;

const BADGES = {
  perfect: '\u{1F3C6}',
  gold: '\u{1F947}',
  silver: '\u{1F948}',
  default: '\u{1F649}',
} as const;

function getBadge(score: number): string {
  if (score === BADGE_PERFECT_SCORE) {
    return BADGES.perfect;
  }
  if (score > BADGE_THRESHOLD_GOLD) {
    return BADGES.gold;
  }
  if (score > BADGE_THRESHOLD_SILVER) {
    return BADGES.silver;
  }
  return BADGES.default;
}

function formatMetricLine(label: string, score: number, showBadge: boolean): string {
  const paddingLength = showBadge ? 37 : 49;
  const title = `${label}:`.padEnd(paddingLength, '.');
  const percent = `${score}%`.padStart(4, '.');

  if (!showBadge) {
    return `${title}${percent}`;
  }

  const badge = ` ${getBadge(score)}`.padStart(11, '.');
  return `${title}${percent}${badge}`;
}

export function generateGistContent(metrics: LighthouseMetrics, showBadge: boolean): string {
  return Object.entries(metrics)
    .map(([key, score]) => {
      const label = METRIC_LABELS[key as keyof LighthouseMetrics];
      return formatMetricLine(label, score, showBadge);
    })
    .join('\n');
}

export function generateGistTitle(title: string): string {
  const date = new Date().toLocaleDateString('en-us', {
    day: 'numeric',
    year: 'numeric',
    month: 'short',
  });
  return `${title} [update ${date}]`;
}

export async function updateGist(
  token: string,
  gistId: string,
  title: string,
  content: string
): Promise<void> {
  const octokit = new Octokit({ auth: token });

  const gist = await octokit.gists.get({ gist_id: gistId });
  const files = gist.data.files;

  if (!files) {
    throw new Error('Gist has no files');
  }

  const filename = Object.keys(files)[0];
  if (!filename) {
    throw new Error('Gist filename not found');
  }

  await octokit.gists.update({
    gist_id: gistId,
    files: {
      [filename]: {
        filename: title,
        content,
      },
    },
  });
}
