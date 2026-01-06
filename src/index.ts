import * as core from '@actions/core';
import { getInputs, isRunningInGitHubActions } from './config.js';
import { runLighthouseAudit } from './lighthouse.js';
import { generateGistContent, generateGistTitle, updateGist } from './gist.js';
import { printSummary } from './summary.js';

async function loadEnvForLocalDev(): Promise<void> {
  if (isRunningInGitHubActions()) {
    return;
  }

  try {
    const { config } = await import('dotenv');
    config();
  } catch {
    // dotenv is dev dependency, may not be available
  }
}

async function run(): Promise<void> {
  await loadEnvForLocalDev();

  const inputs = getInputs();

  console.log(`Running Lighthouse audit for: ${inputs.testUrl} (${inputs.formFactor})`);

  const result = await runLighthouseAudit(inputs.testUrl, inputs.formFactor);
  const gistContent = generateGistContent(result.metrics, inputs.resultBadge);
  const gistTitle = generateGistTitle(inputs.gistTitle);

  await updateGist(inputs.ghToken, inputs.gistId, gistTitle, gistContent);

  console.log('Gist updated successfully!');

  await printSummary(result.metrics, result.url, inputs.printSummary);
}

run().catch((error: Error) => {
  if (isRunningInGitHubActions()) {
    core.setFailed(`Action failed: ${error.message}`);
  } else {
    console.error('Error:', error.message);
    process.exit(1);
  }
});
