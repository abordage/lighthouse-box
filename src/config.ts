import * as core from '@actions/core';
import { createRequire } from 'module';
import type { ActionInputs } from './types.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json') as { version: string };

const ACTION_URL = 'https://github.com/marketplace/actions/lighthouse-box';
const ACTION_VERSION = packageJson.version;

const DEFAULT_GIST_TITLE = 'My website';

function isRunningInGitHubActions(): boolean {
  return process.env.GITHUB_ACTIONS === 'true';
}

function getInput(key: string, required = false): string {
  if (isRunningInGitHubActions()) {
    return core.getInput(key, { required });
  }
  return process.env[key] ?? '';
}

function getInputWithDefault(key: string, defaultValue: string): string {
  const value = getInput(key, false);
  return value === '' ? defaultValue : value;
}

function getBooleanInput(key: string, defaultValue: boolean): boolean {
  if (isRunningInGitHubActions()) {
    const value = core.getInput(key);
    if (value === '') {
      return defaultValue;
    }
    return core.getBooleanInput(key);
  }

  const envValue = process.env[key];
  if (envValue === undefined || envValue === '') {
    return defaultValue;
  }
  return envValue.toLowerCase() === 'true';
}

export function getInputs(): ActionInputs {
  return {
    ghToken: getInput('GH_TOKEN', true),
    gistId: getInput('GIST_ID', true),
    testUrl: getInput('TEST_URL', true),
    printSummary: getBooleanInput('PRINT_SUMMARY', true),
    resultBadge: getBooleanInput('RESULT_BADGE', false),
    gistTitle: getInputWithDefault('GIST_TITLE', DEFAULT_GIST_TITLE),
  };
}

export { ACTION_URL, ACTION_VERSION, isRunningInGitHubActions };
