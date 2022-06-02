"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core = require("@actions/core");
var rest_1 = require("@octokit/rest");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var chromeLauncher = require('chrome-launcher');
var lighthouse = require('lighthouse');
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '../.env') });
var GH_TOKEN = core.getInput('GH_TOKEN', { required: true });
var GIST_ID = core.getInput('GIST_ID', { required: true });
var TEST_URL = core.getInput('URL', { required: true });
var PRINT_SUMMARY = core.getBooleanInput('PRINT_SUMMARY', { required: true });
var ACTION_URL = 'https://github.com/marketplace/actions/lighthouse-box';
var updateDate = new Date().toLocaleDateString('en-us', { day: 'numeric', year: 'numeric', month: 'short' });
var summaryTable = [];
var title = 'My website metrics [update ' + updateDate + ']';
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var chrome, options, runnerResult, gistContent, octokit, gist, filename, summary;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, chromeLauncher.launch({ chromeFlags: ['--headless'] })];
            case 1:
                chrome = _b.sent();
                options = { logLevel: 'info', output: 'json', port: chrome.port };
                return [4 /*yield*/, lighthouse(TEST_URL, options)];
            case 2:
                runnerResult = _b.sent();
                return [4 /*yield*/, chrome.kill()];
            case 3:
                _b.sent();
                summaryTable.push([{ data: 'Category', header: true }, { data: 'Result', header: true }]);
                gistContent = [
                    ['Performance', runnerResult.lhr.categories.performance.score * 100],
                    ['Accessibility', runnerResult.lhr.categories.accessibility.score * 100],
                    ['Best Practices', runnerResult.lhr.categories['best-practices'].score * 100],
                    ['SEO', runnerResult.lhr.categories.seo.score * 100],
                    ['PWA Ready', runnerResult.lhr.categories.pwa.score * 100]
                ]
                    .map(function (content) {
                    summaryTable.push([content[0], content[1] + '%']);
                    return (content[0] + ':').padEnd(49, '.') + (content[1] + '%').padStart(4, '.');
                })
                    .join('\n');
                octokit = new rest_1.Octokit({ auth: GH_TOKEN });
                return [4 /*yield*/, octokit.gists.get({ gist_id: GIST_ID })["catch"](function (error) { return core.setFailed('Action failed: Gist ' + error.message); })];
            case 4:
                gist = _b.sent();
                if (!gist)
                    return [2 /*return*/];
                filename = Object.keys(gist.data.files || {})[0];
                if (!filename) {
                    core.setFailed('Action failed: Gist filename not found');
                    return [2 /*return*/];
                }
                /**
                 * Update gist
                 */
                return [4 /*yield*/, octokit.gists.update({
                        gist_id: GIST_ID,
                        files: (_a = {},
                            _a[filename] = {
                                filename: title,
                                content: gistContent
                            },
                            _a)
                    })["catch"](function (error) { return core.setFailed('Action failed: Gist ' + error.message); })];
            case 5:
                /**
                 * Update gist
                 */
                _b.sent();
                summary = core.summary
                    .addHeading('Results')
                    .addTable(summaryTable)
                    .addBreak()
                    .addRaw('Lighthouse metrics for ' + runnerResult.lhr.finalUrl + ' generated by ')
                    .addLink('lighthouse-box', ACTION_URL);
                if (!PRINT_SUMMARY) return [3 /*break*/, 7];
                return [4 /*yield*/, summary.write()];
            case 6:
                _b.sent();
                return [3 /*break*/, 8];
            case 7:
                console.log(summary.stringify());
                _b.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); })();
