"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const core = __importStar(require("@actions/core"));
const rest_1 = require("@octokit/rest");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '../.env') });
const GH_TOKEN = core.getInput('GH_TOKEN', { required: true });
const GIST_ID = core.getInput('GIST_ID', { required: true });
const TEST_URL = core.getInput('URL', { required: true });
const PRINT_SUMMARY = core.getBooleanInput('PRINT_SUMMARY', { required: true });
const ACTION_URL = 'https://github.com/marketplace/actions/lighthouse-box';
const updateDate = new Date().toLocaleDateString('en-us', { day: 'numeric', year: 'numeric', month: 'short' });
const summaryTable = [];
const title = 'My website metrics [update ' + updateDate + ']';
(() => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Get metrics
     */
    const chrome = yield chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { logLevel: 'info', output: 'json', port: chrome.port };
    const runnerResult = yield lighthouse(TEST_URL, options);
    yield chrome.kill();
    summaryTable.push([{ data: 'Category', header: true }, { data: 'Result', header: true }]);
    /**
     * Formatting
     */
    const gistContent = [
        ['Performance', runnerResult.lhr.categories.performance.score * 100],
        ['Accessibility', runnerResult.lhr.categories.accessibility.score * 100],
        ['Best Practices', runnerResult.lhr.categories['best-practices'].score * 100],
        ['SEO', runnerResult.lhr.categories.seo.score * 100],
        ['PWA Ready', runnerResult.lhr.categories.pwa.score * 100]
    ]
        .map((content) => {
        summaryTable.push([content[0], content[1] + '%']);
        return (content[0] + ':').padEnd(49, '.') + (content[1] + '%').padStart(4, '.');
    })
        .join('\n');
    summaryTable.push(['Gist updated', '✔']);
    /**
     * Get gist filename
     */
    const octokit = new rest_1.Octokit({ auth: GH_TOKEN });
    const gist = yield octokit.gists.get({ gist_id: GIST_ID })
        .catch(error => core.setFailed('Action failed: Gist ' + error.message));
    if (!gist)
        return;
    const filename = Object.keys(gist.data.files || {})[0];
    if (!filename) {
        core.setFailed('Action failed: Gist filename not found');
        return;
    }
    /**
     * Update gist
     */
    yield octokit.gists.update({
        gist_id: GIST_ID,
        files: {
            [filename]: {
                filename: title,
                content: gistContent
            }
        }
    }).catch(error => core.setFailed('Action failed: Gist ' + error.message));
    /**
     * Print summary
     */
    const summary = core.summary
        .addHeading('Results')
        .addTable(summaryTable)
        .addBreak()
        .addLink('lighthouse-gist', ACTION_URL);
    if (PRINT_SUMMARY) {
        yield summary.write();
    }
    else {
        console.log(summary.stringify());
    }
}))();
