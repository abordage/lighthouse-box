import * as core from '@actions/core';
import {Octokit} from '@octokit/rest';
import {config} from 'dotenv';
import {resolve} from 'path';
import * as chromeLauncher from 'chrome-launcher';
import * as lighthouse from 'lighthouse';
import {Flags} from 'lighthouse/types/externs';

config({path: resolve(__dirname, '../.env')});

const GH_TOKEN = core.getInput('GH_TOKEN', {required: true});
const GIST_ID = core.getInput('GIST_ID', {required: true});
const TEST_URL = core.getInput('TEST_URL', {required: true});
const PRINT_SUMMARY = core.getBooleanInput('PRINT_SUMMARY', {required: true});
const RESULT_BADGE = core.getBooleanInput('RESULT_BADGE', {required: true});

const ACTION_URL = 'https://github.com/marketplace/actions/lighthouse-box';

const updateDate = new Date().toLocaleDateString('en-us', {day: 'numeric', year: 'numeric', month: 'short'});
const summaryTable = [];
const title = 'My website [update ' + updateDate + ']';

(async () => {
  /** Get metrics */
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options: Flags = {logLevel: 'info', output: 'json', port: chrome.port};
  const runnerResult = await lighthouse(TEST_URL, options);
  await chrome.kill();

  summaryTable.push([{data: 'Category', header: true}, {data: 'Result', header: true}]);

  /** Formatting */
  const gistContent =
        [
          ['Performance', runnerResult.lhr.categories.performance.score * 100],
          ['Accessibility', runnerResult.lhr.categories.accessibility.score * 100],
          ['Best Practices', runnerResult.lhr.categories['best-practices'].score * 100],
          ['SEO', runnerResult.lhr.categories.seo.score * 100],
          ['PWA Ready', runnerResult.lhr.categories.pwa.score * 100]
        ]
          .map((content) => {
            summaryTable.push([content[0], content[1] + '%']);

            let badge = '🙉';
            if (content[1] > 80) badge = '🥈';
            if (content[1] > 90) badge = '🥇';
            if (content[1] === 100) badge = '🏆';

            const title = (content[0] + ':').padEnd(RESULT_BADGE ? 41 : 53, '.');
            const percent = (content[1] + '%').padStart(4, '.');
            const result = RESULT_BADGE ? ' ' + (' ' + badge).padStart(11, '.') : '';

            return title + percent + result;
          })
          .join('\n');

  /** Get gist filename */
  const octokit = new Octokit({auth: GH_TOKEN});
  const gist = await octokit.gists.get({gist_id: GIST_ID})
    .catch(error => core.setFailed('Action failed: Gist ' + error.message));
  if (!gist) return;

  const filename = Object.keys(gist.data.files || {})[0];
  if (!filename) {
    core.setFailed('Action failed: Gist filename not found');
    return;
  }

  /** Update gist */
  await octokit.gists.update({
    gist_id: GIST_ID,
    files: {
      [filename]: {
        filename: title,
        content: gistContent
      }
    }
  }).catch(error => core.setFailed('Action failed: Gist ' + error.message));

  /** Print summary */
  const summary = core.summary
    .addHeading('Results')
    .addTable(summaryTable)
    .addBreak()
    .addRaw('Lighthouse metrics for ')
    .addLink(runnerResult.lhr.mainDocumentUrl, runnerResult.lhr.mainDocumentUrl)
    .addRaw(' generated by ')
    .addLink('lighthouse-box/1.1', ACTION_URL);

  if (PRINT_SUMMARY) {
    await summary.write();
  } else {
    console.log(summary.stringify());
  }
})();
