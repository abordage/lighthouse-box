export const id = 375;
export const ids = [375];
export const modules = {

/***/ 55246:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e: () => (/* binding */ applyExtends)
/* harmony export */ });
/* harmony import */ var _yerror_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(71849);

let previouslyVisitedConfigs = [];
let shim;
function applyExtends(config, cwd, mergeExtends, _shim) {
    shim = _shim;
    let defaultConfig = {};
    if (Object.prototype.hasOwnProperty.call(config, 'extends')) {
        if (typeof config.extends !== 'string')
            return defaultConfig;
        const isPath = /\.json|\..*rc$/.test(config.extends);
        let pathToDefault = null;
        if (!isPath) {
            try {
                pathToDefault = require.resolve(config.extends);
            }
            catch (_err) {
                return config;
            }
        }
        else {
            pathToDefault = getPathToDefaultConfig(cwd, config.extends);
        }
        checkForCircularExtends(pathToDefault);
        previouslyVisitedConfigs.push(pathToDefault);
        defaultConfig = isPath
            ? JSON.parse(shim.readFileSync(pathToDefault, 'utf8'))
            : require(config.extends);
        delete config.extends;
        defaultConfig = applyExtends(defaultConfig, shim.path.dirname(pathToDefault), mergeExtends, shim);
    }
    previouslyVisitedConfigs = [];
    return mergeExtends
        ? mergeDeep(defaultConfig, config)
        : Object.assign({}, defaultConfig, config);
}
function checkForCircularExtends(cfgPath) {
    if (previouslyVisitedConfigs.indexOf(cfgPath) > -1) {
        throw new _yerror_js__WEBPACK_IMPORTED_MODULE_0__/* .YError */ .w(`Circular extended configurations: '${cfgPath}'.`);
    }
}
function getPathToDefaultConfig(cwd, pathToExtend) {
    return shim.path.resolve(cwd, pathToExtend);
}
function mergeDeep(config1, config2) {
    const target = {};
    function isObject(obj) {
        return obj && typeof obj === 'object' && !Array.isArray(obj);
    }
    Object.assign(target, config1);
    for (const key of Object.keys(config2)) {
        if (isObject(config2[key]) && isObject(target[key])) {
            target[key] = mergeDeep(config1[key], config2[key]);
        }
        else {
            target[key] = config2[key];
        }
    }
    return target;
}


/***/ }),

/***/ 56526:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ hideBin),
/* harmony export */   h: () => (/* binding */ getProcessArgvBin)
/* harmony export */ });
function getProcessArgvBinIndex() {
    if (isBundledElectronApp())
        return 0;
    return 1;
}
function isBundledElectronApp() {
    return isElectronApp() && !process.defaultApp;
}
function isElectronApp() {
    return !!process.versions.electron;
}
function hideBin(argv) {
    return argv.slice(getProcessArgvBinIndex() + 1);
}
function getProcessArgvBin() {
    return process.argv[getProcessArgvBinIndex()];
}


/***/ }),

/***/ 71849:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   w: () => (/* binding */ YError)
/* harmony export */ });
class YError extends Error {
    constructor(msg) {
        super(msg || 'yargs error');
        this.name = 'YError';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, YError);
        }
    }
}


/***/ }),

/***/ 3375:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hideBin: () => (/* reexport safe */ _build_lib_utils_process_argv_js__WEBPACK_IMPORTED_MODULE_3__.a)
/* harmony export */ });
/* unused harmony export applyExtends */
/* harmony import */ var _build_lib_utils_apply_extends_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(55246);
/* harmony import */ var _build_lib_utils_process_argv_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(56526);
/* harmony import */ var yargs_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(45374);
/* harmony import */ var _lib_platform_shims_esm_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(57570);





const applyExtends = (config, cwd, mergeExtends) => {
  return _applyExtends(config, cwd, mergeExtends, shim);
};




/***/ }),

/***/ 57570:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var assert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(42613);
/* harmony import */ var cliui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15753);
/* harmony import */ var escalade_sync__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(83162);
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(39023);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(79896);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(87016);
/* harmony import */ var yargs_parser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(45374);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(16928);
/* harmony import */ var _build_lib_utils_process_argv_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(56526);
/* harmony import */ var _build_lib_yerror_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(71849);
/* harmony import */ var y18n__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(20293);


;











const REQUIRE_ERROR = 'require is not supported by ESM'
const REQUIRE_DIRECTORY_ERROR = 'loading a directory of commands is not supported yet for ESM'

let __dirname;
try {
  __dirname = (0,url__WEBPACK_IMPORTED_MODULE_5__.fileURLToPath)(import.meta.url);
} catch (e) {
  __dirname = process.cwd();
}
const mainFilename = __dirname.substring(0, __dirname.lastIndexOf('node_modules'));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  assert: {
    notStrictEqual: assert__WEBPACK_IMPORTED_MODULE_0__.notStrictEqual,
    strictEqual: assert__WEBPACK_IMPORTED_MODULE_0__.strictEqual
  },
  cliui: cliui__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,
  findUp: escalade_sync__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,
  getEnv: (key) => {
    return process.env[key]
  },
  inspect: util__WEBPACK_IMPORTED_MODULE_3__.inspect,
  getCallerFile: () => {
    throw new _build_lib_yerror_js__WEBPACK_IMPORTED_MODULE_8__/* .YError */ .w(REQUIRE_DIRECTORY_ERROR)
  },
  getProcessArgvBin: _build_lib_utils_process_argv_js__WEBPACK_IMPORTED_MODULE_10__/* .getProcessArgvBin */ .h,
  mainFilename: mainFilename || process.cwd(),
  Parser: yargs_parser__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A,
  path: {
    basename: path__WEBPACK_IMPORTED_MODULE_7__.basename,
    dirname: path__WEBPACK_IMPORTED_MODULE_7__.dirname,
    extname: path__WEBPACK_IMPORTED_MODULE_7__.extname,
    relative: path__WEBPACK_IMPORTED_MODULE_7__.relative,
    resolve: path__WEBPACK_IMPORTED_MODULE_7__.resolve
  },
  process: {
    argv: () => process.argv,
    cwd: process.cwd,
    emitWarning: (warning, type) => process.emitWarning(warning, type),
    execPath: () => process.execPath,
    exit: process.exit,
    nextTick: process.nextTick,
    stdColumns: typeof process.stdout.columns !== 'undefined' ? process.stdout.columns : null
  },
  readFileSync: fs__WEBPACK_IMPORTED_MODULE_4__.readFileSync,
  require: () => {
    throw new _build_lib_yerror_js__WEBPACK_IMPORTED_MODULE_8__/* .YError */ .w(REQUIRE_ERROR)
  },
  requireDirectory: () => {
    throw new _build_lib_yerror_js__WEBPACK_IMPORTED_MODULE_8__/* .YError */ .w(REQUIRE_DIRECTORY_ERROR)
  },
  stringWidth: (str) => {
    return [...str].length
  },
  y18n: (0,y18n__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A)({
    directory: (0,path__WEBPACK_IMPORTED_MODULE_7__.resolve)(__dirname, '../../../locales'),
    updateFiles: false
  })
});


/***/ })

};
