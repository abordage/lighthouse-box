import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
export const id = 834;
export const ids = [834];
export const modules = {

/***/ 10479:
/***/ ((__unused_webpack_module, exports) => {

/*
 * This file defines flags and constants that can be modified during compile time in order to facilitate tree shaking
 * for users.
 *
 * Debug flags need to be declared in each package individually and must not be imported across package boundaries,
 * because some build tools have trouble tree-shaking imported guards.
 *
 * As a convention, we define debug flags in a `flags.ts` file in the root of a package's `src` folder.
 *
 * Debug flag files will contain "magic strings" like `__SENTRY_DEBUG__` that may get replaced with actual values during
 * our, or the user's build process. Take care when introducing new flags - they must not throw if they are not
 * replaced.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/** Flag that is true for debug builds, false otherwise. */
exports.IS_DEBUG_BUILD = typeof __SENTRY_DEBUG__ === 'undefined' ? true : __SENTRY_DEBUG__;
//# sourceMappingURL=flags.js.map

/***/ }),

/***/ 99407:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(50481);
var utils_1 = __webpack_require__(58634);
var flags_1 = __webpack_require__(10479);
var scope_1 = __webpack_require__(10396);
var session_1 = __webpack_require__(62736);
/**
 * API compatibility version of this hub.
 *
 * WARNING: This number should only be increased when the global interface
 * changes and new methods are introduced.
 *
 * @hidden
 */
exports.API_VERSION = 4;
/**
 * Default maximum number of breadcrumbs added to an event. Can be overwritten
 * with {@link Options.maxBreadcrumbs}.
 */
var DEFAULT_BREADCRUMBS = 100;
/**
 * @inheritDoc
 */
var Hub = /** @class */ (function () {
    /**
     * Creates a new instance of the hub, will push one {@link Layer} into the
     * internal stack on creation.
     *
     * @param client bound to the hub.
     * @param scope bound to the hub.
     * @param version number, higher number means higher priority.
     */
    function Hub(client, scope, _version) {
        if (scope === void 0) { scope = new scope_1.Scope(); }
        if (_version === void 0) { _version = exports.API_VERSION; }
        this._version = _version;
        /** Is a {@link Layer}[] containing the client and scope */
        this._stack = [{}];
        this.getStackTop().scope = scope;
        if (client) {
            this.bindClient(client);
        }
    }
    /**
     * @inheritDoc
     */
    Hub.prototype.isOlderThan = function (version) {
        return this._version < version;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.bindClient = function (client) {
        var top = this.getStackTop();
        top.client = client;
        if (client && client.setupIntegrations) {
            client.setupIntegrations();
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.pushScope = function () {
        // We want to clone the content of prev scope
        var scope = scope_1.Scope.clone(this.getScope());
        this.getStack().push({
            client: this.getClient(),
            scope: scope,
        });
        return scope;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.popScope = function () {
        if (this.getStack().length <= 1)
            return false;
        return !!this.getStack().pop();
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.withScope = function (callback) {
        var scope = this.pushScope();
        try {
            callback(scope);
        }
        finally {
            this.popScope();
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.getClient = function () {
        return this.getStackTop().client;
    };
    /** Returns the scope of the top stack. */
    Hub.prototype.getScope = function () {
        return this.getStackTop().scope;
    };
    /** Returns the scope stack for domains or the process. */
    Hub.prototype.getStack = function () {
        return this._stack;
    };
    /** Returns the topmost scope layer in the order domain > local > process. */
    Hub.prototype.getStackTop = function () {
        return this._stack[this._stack.length - 1];
    };
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    Hub.prototype.captureException = function (exception, hint) {
        var eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : utils_1.uuid4());
        var finalHint = hint;
        // If there's no explicit hint provided, mimic the same thing that would happen
        // in the minimal itself to create a consistent behavior.
        // We don't do this in the client, as it's the lowest level API, and doing this,
        // would prevent user from having full control over direct calls.
        if (!hint) {
            var syntheticException = void 0;
            try {
                throw new Error('Sentry syntheticException');
            }
            catch (exception) {
                syntheticException = exception;
            }
            finalHint = {
                originalException: exception,
                syntheticException: syntheticException,
            };
        }
        this._invokeClient('captureException', exception, tslib_1.__assign(tslib_1.__assign({}, finalHint), { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.captureMessage = function (message, level, hint) {
        var eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : utils_1.uuid4());
        var finalHint = hint;
        // If there's no explicit hint provided, mimic the same thing that would happen
        // in the minimal itself to create a consistent behavior.
        // We don't do this in the client, as it's the lowest level API, and doing this,
        // would prevent user from having full control over direct calls.
        if (!hint) {
            var syntheticException = void 0;
            try {
                throw new Error(message);
            }
            catch (exception) {
                syntheticException = exception;
            }
            finalHint = {
                originalException: message,
                syntheticException: syntheticException,
            };
        }
        this._invokeClient('captureMessage', message, level, tslib_1.__assign(tslib_1.__assign({}, finalHint), { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.captureEvent = function (event, hint) {
        var eventId = hint && hint.event_id ? hint.event_id : utils_1.uuid4();
        if (event.type !== 'transaction') {
            this._lastEventId = eventId;
        }
        this._invokeClient('captureEvent', event, tslib_1.__assign(tslib_1.__assign({}, hint), { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.lastEventId = function () {
        return this._lastEventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.addBreadcrumb = function (breadcrumb, hint) {
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        if (!scope || !client)
            return;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        var _b = (client.getOptions && client.getOptions()) || {}, _c = _b.beforeBreadcrumb, beforeBreadcrumb = _c === void 0 ? null : _c, _d = _b.maxBreadcrumbs, maxBreadcrumbs = _d === void 0 ? DEFAULT_BREADCRUMBS : _d;
        if (maxBreadcrumbs <= 0)
            return;
        var timestamp = utils_1.dateTimestampInSeconds();
        var mergedBreadcrumb = tslib_1.__assign({ timestamp: timestamp }, breadcrumb);
        var finalBreadcrumb = beforeBreadcrumb
            ? utils_1.consoleSandbox(function () { return beforeBreadcrumb(mergedBreadcrumb, hint); })
            : mergedBreadcrumb;
        if (finalBreadcrumb === null)
            return;
        scope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setUser = function (user) {
        var scope = this.getScope();
        if (scope)
            scope.setUser(user);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setTags = function (tags) {
        var scope = this.getScope();
        if (scope)
            scope.setTags(tags);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setExtras = function (extras) {
        var scope = this.getScope();
        if (scope)
            scope.setExtras(extras);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setTag = function (key, value) {
        var scope = this.getScope();
        if (scope)
            scope.setTag(key, value);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setExtra = function (key, extra) {
        var scope = this.getScope();
        if (scope)
            scope.setExtra(key, extra);
    };
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.prototype.setContext = function (name, context) {
        var scope = this.getScope();
        if (scope)
            scope.setContext(name, context);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.configureScope = function (callback) {
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        if (scope && client) {
            callback(scope);
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.run = function (callback) {
        var oldHub = makeMain(this);
        try {
            callback(this);
        }
        finally {
            makeMain(oldHub);
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.getIntegration = function (integration) {
        var client = this.getClient();
        if (!client)
            return null;
        try {
            return client.getIntegration(integration);
        }
        catch (_oO) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn("Cannot retrieve integration " + integration.id + " from the current Hub");
            return null;
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.startSpan = function (context) {
        return this._callExtensionMethod('startSpan', context);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.startTransaction = function (context, customSamplingContext) {
        return this._callExtensionMethod('startTransaction', context, customSamplingContext);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.traceHeaders = function () {
        return this._callExtensionMethod('traceHeaders');
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.captureSession = function (endSession) {
        if (endSession === void 0) { endSession = false; }
        // both send the update and pull the session from the scope
        if (endSession) {
            return this.endSession();
        }
        // only send the update
        this._sendSessionUpdate();
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.endSession = function () {
        var layer = this.getStackTop();
        var scope = layer && layer.scope;
        var session = scope && scope.getSession();
        if (session) {
            session.close();
        }
        this._sendSessionUpdate();
        // the session is over; take it off of the scope
        if (scope) {
            scope.setSession();
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.startSession = function (context) {
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        var _b = (client && client.getOptions()) || {}, release = _b.release, environment = _b.environment;
        // Will fetch userAgent if called from browser sdk
        var global = utils_1.getGlobalObject();
        var userAgent = (global.navigator || {}).userAgent;
        var session = new session_1.Session(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({ release: release,
            environment: environment }, (scope && { user: scope.getUser() })), (userAgent && { userAgent: userAgent })), context));
        if (scope) {
            // End existing session if there's one
            var currentSession = scope.getSession && scope.getSession();
            if (currentSession && currentSession.status === 'ok') {
                currentSession.update({ status: 'exited' });
            }
            this.endSession();
            // Afterwards we set the new session on the scope
            scope.setSession(session);
        }
        return session;
    };
    /**
     * Sends the current Session on the scope
     */
    Hub.prototype._sendSessionUpdate = function () {
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        if (!scope)
            return;
        var session = scope.getSession && scope.getSession();
        if (session) {
            if (client && client.captureSession) {
                client.captureSession(session);
            }
        }
    };
    /**
     * Internal helper function to call a method on the top client if it exists.
     *
     * @param method The method to call on the client.
     * @param args Arguments to pass to the client function.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.prototype._invokeClient = function (method) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _b = this.getStackTop(), scope = _b.scope, client = _b.client;
        if (client && client[method]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            (_a = client)[method].apply(_a, tslib_1.__spread(args, [scope]));
        }
    };
    /**
     * Calls global extension method and binding current instance to the function call
     */
    // @ts-ignore Function lacks ending return statement and return type does not include 'undefined'. ts(2366)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.prototype._callExtensionMethod = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var carrier = getMainCarrier();
        var sentry = carrier.__SENTRY__;
        if (sentry && sentry.extensions && typeof sentry.extensions[method] === 'function') {
            return sentry.extensions[method].apply(this, args);
        }
        flags_1.IS_DEBUG_BUILD && utils_1.logger.warn("Extension method " + method + " couldn't be found, doing nothing.");
    };
    return Hub;
}());
exports.Hub = Hub;
/**
 * Returns the global shim registry.
 *
 * FIXME: This function is problematic, because despite always returning a valid Carrier,
 * it has an optional `__SENTRY__` property, which then in turn requires us to always perform an unnecessary check
 * at the call-site. We always access the carrier through this function, so we can guarantee that `__SENTRY__` is there.
 **/
function getMainCarrier() {
    var carrier = utils_1.getGlobalObject();
    carrier.__SENTRY__ = carrier.__SENTRY__ || {
        extensions: {},
        hub: undefined,
    };
    return carrier;
}
exports.getMainCarrier = getMainCarrier;
/**
 * Replaces the current main hub with the passed one on the global object
 *
 * @returns The old replaced hub
 */
function makeMain(hub) {
    var registry = getMainCarrier();
    var oldHub = getHubFromCarrier(registry);
    setHubOnCarrier(registry, hub);
    return oldHub;
}
exports.makeMain = makeMain;
/**
 * Returns the default hub instance.
 *
 * If a hub is already registered in the global carrier but this module
 * contains a more recent version, it replaces the registered version.
 * Otherwise, the currently registered hub will be returned.
 */
function getCurrentHub() {
    // Get main carrier (global for every environment)
    var registry = getMainCarrier();
    // If there's no hub, or its an old API, assign a new one
    if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(exports.API_VERSION)) {
        setHubOnCarrier(registry, new Hub());
    }
    // Prefer domains over global if they are there (applicable only to Node environment)
    if (utils_1.isNodeEnv()) {
        return getHubFromActiveDomain(registry);
    }
    // Return hub that lives on a global object
    return getHubFromCarrier(registry);
}
exports.getCurrentHub = getCurrentHub;
/**
 * Returns the active domain, if one exists
 * @deprecated No longer used; remove in v7
 * @returns The domain, or undefined if there is no active domain
 */
// eslint-disable-next-line deprecation/deprecation
function getActiveDomain() {
    flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('Function `getActiveDomain` is deprecated and will be removed in a future version.');
    var sentry = getMainCarrier().__SENTRY__;
    return sentry && sentry.extensions && sentry.extensions.domain && sentry.extensions.domain.active;
}
exports.getActiveDomain = getActiveDomain;
/**
 * Try to read the hub from an active domain, and fallback to the registry if one doesn't exist
 * @returns discovered hub
 */
function getHubFromActiveDomain(registry) {
    try {
        var sentry = getMainCarrier().__SENTRY__;
        var activeDomain = sentry && sentry.extensions && sentry.extensions.domain && sentry.extensions.domain.active;
        // If there's no active domain, just return global hub
        if (!activeDomain) {
            return getHubFromCarrier(registry);
        }
        // If there's no hub on current domain, or it's an old API, assign a new one
        if (!hasHubOnCarrier(activeDomain) || getHubFromCarrier(activeDomain).isOlderThan(exports.API_VERSION)) {
            var registryHubTopStack = getHubFromCarrier(registry).getStackTop();
            setHubOnCarrier(activeDomain, new Hub(registryHubTopStack.client, scope_1.Scope.clone(registryHubTopStack.scope)));
        }
        // Return hub that lives on a domain
        return getHubFromCarrier(activeDomain);
    }
    catch (_Oo) {
        // Return hub that lives on a global object
        return getHubFromCarrier(registry);
    }
}
/**
 * This will tell whether a carrier has a hub on it or not
 * @param carrier object
 */
function hasHubOnCarrier(carrier) {
    return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
}
/**
 * This will create a new {@link Hub} and add to the passed object on
 * __SENTRY__.hub.
 * @param carrier object
 * @hidden
 */
function getHubFromCarrier(carrier) {
    return utils_1.getGlobalSingleton('hub', function () { return new Hub(); }, carrier);
}
exports.getHubFromCarrier = getHubFromCarrier;
/**
 * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
 * @param carrier object
 * @param hub Hub
 * @returns A boolean indicating success or failure
 */
function setHubOnCarrier(carrier, hub) {
    if (!carrier)
        return false;
    var __SENTRY__ = (carrier.__SENTRY__ = carrier.__SENTRY__ || {});
    __SENTRY__.hub = hub;
    return true;
}
exports.setHubOnCarrier = setHubOnCarrier;
//# sourceMappingURL=hub.js.map

/***/ }),

/***/ 14044:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var scope_1 = __webpack_require__(10396);
exports.addGlobalEventProcessor = scope_1.addGlobalEventProcessor;
exports.Scope = scope_1.Scope;
var session_1 = __webpack_require__(62736);
exports.Session = session_1.Session;
var sessionflusher_1 = __webpack_require__(32771);
exports.SessionFlusher = sessionflusher_1.SessionFlusher;
var hub_1 = __webpack_require__(99407);
// eslint-disable-next-line deprecation/deprecation
exports.getActiveDomain = hub_1.getActiveDomain;
exports.getCurrentHub = hub_1.getCurrentHub;
exports.getHubFromCarrier = hub_1.getHubFromCarrier;
exports.getMainCarrier = hub_1.getMainCarrier;
exports.Hub = hub_1.Hub;
exports.makeMain = hub_1.makeMain;
exports.setHubOnCarrier = hub_1.setHubOnCarrier;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 10396:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(50481);
var utils_1 = __webpack_require__(58634);
/**
 * Absolute maximum number of breadcrumbs added to an event.
 * The `maxBreadcrumbs` option cannot be higher than this value.
 */
var MAX_BREADCRUMBS = 100;
/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */
var Scope = /** @class */ (function () {
    function Scope() {
        /** Flag if notifying is happening. */
        this._notifyingListeners = false;
        /** Callback for client to receive scope changes. */
        this._scopeListeners = [];
        /** Callback list that will be called after {@link applyToEvent}. */
        this._eventProcessors = [];
        /** Array of breadcrumbs. */
        this._breadcrumbs = [];
        /** User */
        this._user = {};
        /** Tags */
        this._tags = {};
        /** Extra */
        this._extra = {};
        /** Contexts */
        this._contexts = {};
        /**
         * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
         * sent to Sentry
         */
        this._sdkProcessingMetadata = {};
    }
    /**
     * Inherit values from the parent scope.
     * @param scope to clone.
     */
    Scope.clone = function (scope) {
        var newScope = new Scope();
        if (scope) {
            newScope._breadcrumbs = tslib_1.__spread(scope._breadcrumbs);
            newScope._tags = tslib_1.__assign({}, scope._tags);
            newScope._extra = tslib_1.__assign({}, scope._extra);
            newScope._contexts = tslib_1.__assign({}, scope._contexts);
            newScope._user = scope._user;
            newScope._level = scope._level;
            newScope._span = scope._span;
            newScope._session = scope._session;
            newScope._transactionName = scope._transactionName;
            newScope._fingerprint = scope._fingerprint;
            newScope._eventProcessors = tslib_1.__spread(scope._eventProcessors);
            newScope._requestSession = scope._requestSession;
        }
        return newScope;
    };
    /**
     * Add internal on change listener. Used for sub SDKs that need to store the scope.
     * @hidden
     */
    Scope.prototype.addScopeListener = function (callback) {
        this._scopeListeners.push(callback);
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.addEventProcessor = function (callback) {
        this._eventProcessors.push(callback);
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setUser = function (user) {
        this._user = user || {};
        if (this._session) {
            this._session.update({ user: user });
        }
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getUser = function () {
        return this._user;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getRequestSession = function () {
        return this._requestSession;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setRequestSession = function (requestSession) {
        this._requestSession = requestSession;
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTags = function (tags) {
        this._tags = tslib_1.__assign(tslib_1.__assign({}, this._tags), tags);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTag = function (key, value) {
        var _a;
        this._tags = tslib_1.__assign(tslib_1.__assign({}, this._tags), (_a = {}, _a[key] = value, _a));
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setExtras = function (extras) {
        this._extra = tslib_1.__assign(tslib_1.__assign({}, this._extra), extras);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setExtra = function (key, extra) {
        var _a;
        this._extra = tslib_1.__assign(tslib_1.__assign({}, this._extra), (_a = {}, _a[key] = extra, _a));
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setFingerprint = function (fingerprint) {
        this._fingerprint = fingerprint;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setLevel = function (level) {
        this._level = level;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTransactionName = function (name) {
        this._transactionName = name;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * Can be removed in major version.
     * @deprecated in favor of {@link this.setTransactionName}
     */
    Scope.prototype.setTransaction = function (name) {
        return this.setTransactionName(name);
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setContext = function (key, context) {
        var _a;
        if (context === null) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this._contexts[key];
        }
        else {
            this._contexts = tslib_1.__assign(tslib_1.__assign({}, this._contexts), (_a = {}, _a[key] = context, _a));
        }
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setSpan = function (span) {
        this._span = span;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getSpan = function () {
        return this._span;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getTransaction = function () {
        // Often, this span (if it exists at all) will be a transaction, but it's not guaranteed to be. Regardless, it will
        // have a pointer to the currently-active transaction.
        var span = this.getSpan();
        return span && span.transaction;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setSession = function (session) {
        if (!session) {
            delete this._session;
        }
        else {
            this._session = session;
        }
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getSession = function () {
        return this._session;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.update = function (captureContext) {
        if (!captureContext) {
            return this;
        }
        if (typeof captureContext === 'function') {
            var updatedScope = captureContext(this);
            return updatedScope instanceof Scope ? updatedScope : this;
        }
        if (captureContext instanceof Scope) {
            this._tags = tslib_1.__assign(tslib_1.__assign({}, this._tags), captureContext._tags);
            this._extra = tslib_1.__assign(tslib_1.__assign({}, this._extra), captureContext._extra);
            this._contexts = tslib_1.__assign(tslib_1.__assign({}, this._contexts), captureContext._contexts);
            if (captureContext._user && Object.keys(captureContext._user).length) {
                this._user = captureContext._user;
            }
            if (captureContext._level) {
                this._level = captureContext._level;
            }
            if (captureContext._fingerprint) {
                this._fingerprint = captureContext._fingerprint;
            }
            if (captureContext._requestSession) {
                this._requestSession = captureContext._requestSession;
            }
        }
        else if (utils_1.isPlainObject(captureContext)) {
            // eslint-disable-next-line no-param-reassign
            captureContext = captureContext;
            this._tags = tslib_1.__assign(tslib_1.__assign({}, this._tags), captureContext.tags);
            this._extra = tslib_1.__assign(tslib_1.__assign({}, this._extra), captureContext.extra);
            this._contexts = tslib_1.__assign(tslib_1.__assign({}, this._contexts), captureContext.contexts);
            if (captureContext.user) {
                this._user = captureContext.user;
            }
            if (captureContext.level) {
                this._level = captureContext.level;
            }
            if (captureContext.fingerprint) {
                this._fingerprint = captureContext.fingerprint;
            }
            if (captureContext.requestSession) {
                this._requestSession = captureContext.requestSession;
            }
        }
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.clear = function () {
        this._breadcrumbs = [];
        this._tags = {};
        this._extra = {};
        this._user = {};
        this._contexts = {};
        this._level = undefined;
        this._transactionName = undefined;
        this._fingerprint = undefined;
        this._requestSession = undefined;
        this._span = undefined;
        this._session = undefined;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.addBreadcrumb = function (breadcrumb, maxBreadcrumbs) {
        var maxCrumbs = typeof maxBreadcrumbs === 'number' ? Math.min(maxBreadcrumbs, MAX_BREADCRUMBS) : MAX_BREADCRUMBS;
        // No data has been changed, so don't notify scope listeners
        if (maxCrumbs <= 0) {
            return this;
        }
        var mergedBreadcrumb = tslib_1.__assign({ timestamp: utils_1.dateTimestampInSeconds() }, breadcrumb);
        this._breadcrumbs = tslib_1.__spread(this._breadcrumbs, [mergedBreadcrumb]).slice(-maxCrumbs);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.clearBreadcrumbs = function () {
        this._breadcrumbs = [];
        this._notifyScopeListeners();
        return this;
    };
    /**
     * Applies the current context and fingerprint to the event.
     * Note that breadcrumbs will be added by the client.
     * Also if the event has already breadcrumbs on it, we do not merge them.
     * @param event Event
     * @param hint May contain additional information about the original exception.
     * @hidden
     */
    Scope.prototype.applyToEvent = function (event, hint) {
        if (this._extra && Object.keys(this._extra).length) {
            event.extra = tslib_1.__assign(tslib_1.__assign({}, this._extra), event.extra);
        }
        if (this._tags && Object.keys(this._tags).length) {
            event.tags = tslib_1.__assign(tslib_1.__assign({}, this._tags), event.tags);
        }
        if (this._user && Object.keys(this._user).length) {
            event.user = tslib_1.__assign(tslib_1.__assign({}, this._user), event.user);
        }
        if (this._contexts && Object.keys(this._contexts).length) {
            event.contexts = tslib_1.__assign(tslib_1.__assign({}, this._contexts), event.contexts);
        }
        if (this._level) {
            event.level = this._level;
        }
        if (this._transactionName) {
            event.transaction = this._transactionName;
        }
        // We want to set the trace context for normal events only if there isn't already
        // a trace context on the event. There is a product feature in place where we link
        // errors with transaction and it relies on that.
        if (this._span) {
            event.contexts = tslib_1.__assign({ trace: this._span.getTraceContext() }, event.contexts);
            var transactionName = this._span.transaction && this._span.transaction.name;
            if (transactionName) {
                event.tags = tslib_1.__assign({ transaction: transactionName }, event.tags);
            }
        }
        this._applyFingerprint(event);
        event.breadcrumbs = tslib_1.__spread((event.breadcrumbs || []), this._breadcrumbs);
        event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined;
        event.sdkProcessingMetadata = this._sdkProcessingMetadata;
        return this._notifyEventProcessors(tslib_1.__spread(getGlobalEventProcessors(), this._eventProcessors), event, hint);
    };
    /**
     * Add data which will be accessible during event processing but won't get sent to Sentry
     */
    Scope.prototype.setSDKProcessingMetadata = function (newData) {
        this._sdkProcessingMetadata = tslib_1.__assign(tslib_1.__assign({}, this._sdkProcessingMetadata), newData);
        return this;
    };
    /**
     * This will be called after {@link applyToEvent} is finished.
     */
    Scope.prototype._notifyEventProcessors = function (processors, event, hint, index) {
        var _this = this;
        if (index === void 0) { index = 0; }
        return new utils_1.SyncPromise(function (resolve, reject) {
            var processor = processors[index];
            if (event === null || typeof processor !== 'function') {
                resolve(event);
            }
            else {
                var result = processor(tslib_1.__assign({}, event), hint);
                if (utils_1.isThenable(result)) {
                    void result
                        .then(function (final) { return _this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve); })
                        .then(null, reject);
                }
                else {
                    void _this._notifyEventProcessors(processors, result, hint, index + 1)
                        .then(resolve)
                        .then(null, reject);
                }
            }
        });
    };
    /**
     * This will be called on every set call.
     */
    Scope.prototype._notifyScopeListeners = function () {
        var _this = this;
        // We need this check for this._notifyingListeners to be able to work on scope during updates
        // If this check is not here we'll produce endless recursion when something is done with the scope
        // during the callback.
        if (!this._notifyingListeners) {
            this._notifyingListeners = true;
            this._scopeListeners.forEach(function (callback) {
                callback(_this);
            });
            this._notifyingListeners = false;
        }
    };
    /**
     * Applies fingerprint from the scope to the event if there's one,
     * uses message if there's one instead or get rid of empty fingerprint
     */
    Scope.prototype._applyFingerprint = function (event) {
        // Make sure it's an array first and we actually have something in place
        event.fingerprint = event.fingerprint
            ? Array.isArray(event.fingerprint)
                ? event.fingerprint
                : [event.fingerprint]
            : [];
        // If we have something on the scope, then merge it with event
        if (this._fingerprint) {
            event.fingerprint = event.fingerprint.concat(this._fingerprint);
        }
        // If we have no data at all, remove empty array default
        if (event.fingerprint && !event.fingerprint.length) {
            delete event.fingerprint;
        }
    };
    return Scope;
}());
exports.Scope = Scope;
/**
 * Returns the global event processors.
 */
function getGlobalEventProcessors() {
    return utils_1.getGlobalSingleton('globalEventProcessors', function () { return []; });
}
/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */
function addGlobalEventProcessor(callback) {
    getGlobalEventProcessors().push(callback);
}
exports.addGlobalEventProcessor = addGlobalEventProcessor;
//# sourceMappingURL=scope.js.map

/***/ }),

/***/ 62736:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(58634);
/**
 * @inheritdoc
 */
var Session = /** @class */ (function () {
    function Session(context) {
        this.errors = 0;
        this.sid = utils_1.uuid4();
        this.duration = 0;
        this.status = 'ok';
        this.init = true;
        this.ignoreDuration = false;
        // Both timestamp and started are in seconds since the UNIX epoch.
        var startingTime = utils_1.timestampInSeconds();
        this.timestamp = startingTime;
        this.started = startingTime;
        if (context) {
            this.update(context);
        }
    }
    /** JSDoc */
    // eslint-disable-next-line complexity
    Session.prototype.update = function (context) {
        if (context === void 0) { context = {}; }
        if (context.user) {
            if (!this.ipAddress && context.user.ip_address) {
                this.ipAddress = context.user.ip_address;
            }
            if (!this.did && !context.did) {
                this.did = context.user.id || context.user.email || context.user.username;
            }
        }
        this.timestamp = context.timestamp || utils_1.timestampInSeconds();
        if (context.ignoreDuration) {
            this.ignoreDuration = context.ignoreDuration;
        }
        if (context.sid) {
            // Good enough uuid validation. — Kamil
            this.sid = context.sid.length === 32 ? context.sid : utils_1.uuid4();
        }
        if (context.init !== undefined) {
            this.init = context.init;
        }
        if (!this.did && context.did) {
            this.did = "" + context.did;
        }
        if (typeof context.started === 'number') {
            this.started = context.started;
        }
        if (this.ignoreDuration) {
            this.duration = undefined;
        }
        else if (typeof context.duration === 'number') {
            this.duration = context.duration;
        }
        else {
            var duration = this.timestamp - this.started;
            this.duration = duration >= 0 ? duration : 0;
        }
        if (context.release) {
            this.release = context.release;
        }
        if (context.environment) {
            this.environment = context.environment;
        }
        if (!this.ipAddress && context.ipAddress) {
            this.ipAddress = context.ipAddress;
        }
        if (!this.userAgent && context.userAgent) {
            this.userAgent = context.userAgent;
        }
        if (typeof context.errors === 'number') {
            this.errors = context.errors;
        }
        if (context.status) {
            this.status = context.status;
        }
    };
    /** JSDoc */
    Session.prototype.close = function (status) {
        if (status) {
            this.update({ status: status });
        }
        else if (this.status === 'ok') {
            this.update({ status: 'exited' });
        }
        else {
            this.update();
        }
    };
    /** JSDoc */
    Session.prototype.toJSON = function () {
        return utils_1.dropUndefinedKeys({
            sid: "" + this.sid,
            init: this.init,
            // Make sure that sec is converted to ms for date constructor
            started: new Date(this.started * 1000).toISOString(),
            timestamp: new Date(this.timestamp * 1000).toISOString(),
            status: this.status,
            errors: this.errors,
            did: typeof this.did === 'number' || typeof this.did === 'string' ? "" + this.did : undefined,
            duration: this.duration,
            attrs: {
                release: this.release,
                environment: this.environment,
                ip_address: this.ipAddress,
                user_agent: this.userAgent,
            },
        });
    };
    return Session;
}());
exports.Session = Session;
//# sourceMappingURL=session.js.map

/***/ }),

/***/ 32771:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(58634);
var flags_1 = __webpack_require__(10479);
var hub_1 = __webpack_require__(99407);
/**
 * @inheritdoc
 */
var SessionFlusher = /** @class */ (function () {
    function SessionFlusher(transport, attrs) {
        var _this = this;
        this.flushTimeout = 60;
        this._pendingAggregates = {};
        this._isEnabled = true;
        this._transport = transport;
        // Call to setInterval, so that flush is called every 60 seconds
        this._intervalId = setInterval(function () { return _this.flush(); }, this.flushTimeout * 1000);
        this._sessionAttrs = attrs;
    }
    /** Sends session aggregates to Transport */
    SessionFlusher.prototype.sendSessionAggregates = function (sessionAggregates) {
        if (!this._transport.sendSession) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn("Dropping session because custom transport doesn't implement sendSession");
            return;
        }
        void this._transport.sendSession(sessionAggregates).then(null, function (reason) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.error('Error while sending session:', reason);
        });
    };
    /** Checks if `pendingAggregates` has entries, and if it does flushes them by calling `sendSessions` */
    SessionFlusher.prototype.flush = function () {
        var sessionAggregates = this.getSessionAggregates();
        if (sessionAggregates.aggregates.length === 0) {
            return;
        }
        this._pendingAggregates = {};
        this.sendSessionAggregates(sessionAggregates);
    };
    /** Massages the entries in `pendingAggregates` and returns aggregated sessions */
    SessionFlusher.prototype.getSessionAggregates = function () {
        var _this = this;
        var aggregates = Object.keys(this._pendingAggregates).map(function (key) {
            return _this._pendingAggregates[parseInt(key)];
        });
        var sessionAggregates = {
            attrs: this._sessionAttrs,
            aggregates: aggregates,
        };
        return utils_1.dropUndefinedKeys(sessionAggregates);
    };
    /** JSDoc */
    SessionFlusher.prototype.close = function () {
        clearInterval(this._intervalId);
        this._isEnabled = false;
        this.flush();
    };
    /**
     * Wrapper function for _incrementSessionStatusCount that checks if the instance of SessionFlusher is enabled then
     * fetches the session status of the request from `Scope.getRequestSession().status` on the scope and passes them to
     * `_incrementSessionStatusCount` along with the start date
     */
    SessionFlusher.prototype.incrementSessionStatusCount = function () {
        if (!this._isEnabled) {
            return;
        }
        var scope = hub_1.getCurrentHub().getScope();
        var requestSession = scope && scope.getRequestSession();
        if (requestSession && requestSession.status) {
            this._incrementSessionStatusCount(requestSession.status, new Date());
            // This is not entirely necessarily but is added as a safe guard to indicate the bounds of a request and so in
            // case captureRequestSession is called more than once to prevent double count
            if (scope) {
                scope.setRequestSession(undefined);
            }
            /* eslint-enable @typescript-eslint/no-unsafe-member-access */
        }
    };
    /**
     * Increments status bucket in pendingAggregates buffer (internal state) corresponding to status of
     * the session received
     */
    SessionFlusher.prototype._incrementSessionStatusCount = function (status, date) {
        // Truncate minutes and seconds on Session Started attribute to have one minute bucket keys
        var sessionStartedTrunc = new Date(date).setSeconds(0, 0);
        this._pendingAggregates[sessionStartedTrunc] = this._pendingAggregates[sessionStartedTrunc] || {};
        // corresponds to aggregated sessions in one specific minute bucket
        // for example, {"started":"2021-03-16T08:00:00.000Z","exited":4, "errored": 1}
        var aggregationCounts = this._pendingAggregates[sessionStartedTrunc];
        if (!aggregationCounts.started) {
            aggregationCounts.started = new Date(sessionStartedTrunc).toISOString();
        }
        switch (status) {
            case 'errored':
                aggregationCounts.errored = (aggregationCounts.errored || 0) + 1;
                return aggregationCounts.errored;
            case 'ok':
                aggregationCounts.exited = (aggregationCounts.exited || 0) + 1;
                return aggregationCounts.exited;
            default:
                aggregationCounts.crashed = (aggregationCounts.crashed || 0) + 1;
                return aggregationCounts.crashed;
        }
    };
    return SessionFlusher;
}());
exports.SessionFlusher = SessionFlusher;
//# sourceMappingURL=sessionflusher.js.map

/***/ }),

/***/ 50481:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
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

    __createBinding = function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    };

    __exportStar = function (m, exports) {
        for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
    };

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result["default"] = mod;
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 3696:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(67757);
var hub_1 = __webpack_require__(14044);
/**
 * This calls a function on the current hub.
 * @param method function to call on hub.
 * @param args to pass to function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function callOnHub(method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var hub = hub_1.getCurrentHub();
    if (hub && hub[method]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return hub[method].apply(hub, tslib_1.__spread(args));
    }
    throw new Error("No hub defined or " + method + " was not found on the hub, please open a bug report.");
}
/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception An exception-like object.
 * @returns The generated eventId.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function captureException(exception, captureContext) {
    var syntheticException = new Error('Sentry syntheticException');
    return callOnHub('captureException', exception, {
        captureContext: captureContext,
        originalException: exception,
        syntheticException: syntheticException,
    });
}
exports.captureException = captureException;
/**
 * Captures a message event and sends it to Sentry.
 *
 * @param message The message to send to Sentry.
 * @param Severity Define the level of the message.
 * @returns The generated eventId.
 */
function captureMessage(message, captureContext) {
    var syntheticException = new Error(message);
    // This is necessary to provide explicit scopes upgrade, without changing the original
    // arity of the `captureMessage(message, level)` method.
    var level = typeof captureContext === 'string' ? captureContext : undefined;
    var context = typeof captureContext !== 'string' ? { captureContext: captureContext } : undefined;
    return callOnHub('captureMessage', message, level, tslib_1.__assign({ originalException: message, syntheticException: syntheticException }, context));
}
exports.captureMessage = captureMessage;
/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param event The event to send to Sentry.
 * @returns The generated eventId.
 */
function captureEvent(event) {
    return callOnHub('captureEvent', event);
}
exports.captureEvent = captureEvent;
/**
 * Callback to set context information onto the scope.
 * @param callback Callback function that receives Scope.
 */
function configureScope(callback) {
    callOnHub('configureScope', callback);
}
exports.configureScope = configureScope;
/**
 * Records a new breadcrumb which will be attached to future events.
 *
 * Breadcrumbs will be added to subsequent events to provide more context on
 * user's actions prior to an error or crash.
 *
 * @param breadcrumb The breadcrumb to record.
 */
function addBreadcrumb(breadcrumb) {
    callOnHub('addBreadcrumb', breadcrumb);
}
exports.addBreadcrumb = addBreadcrumb;
/**
 * Sets context data with the given name.
 * @param name of the context
 * @param context Any kind of data. This data will be normalized.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setContext(name, context) {
    callOnHub('setContext', name, context);
}
exports.setContext = setContext;
/**
 * Set an object that will be merged sent as extra data with the event.
 * @param extras Extras object to merge into current context.
 */
function setExtras(extras) {
    callOnHub('setExtras', extras);
}
exports.setExtras = setExtras;
/**
 * Set an object that will be merged sent as tags data with the event.
 * @param tags Tags context object to merge into current context.
 */
function setTags(tags) {
    callOnHub('setTags', tags);
}
exports.setTags = setTags;
/**
 * Set key:value that will be sent as extra data with the event.
 * @param key String of extra
 * @param extra Any kind of data. This data will be normalized.
 */
function setExtra(key, extra) {
    callOnHub('setExtra', key, extra);
}
exports.setExtra = setExtra;
/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
 */
function setTag(key, value) {
    callOnHub('setTag', key, value);
}
exports.setTag = setTag;
/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
 */
function setUser(user) {
    callOnHub('setUser', user);
}
exports.setUser = setUser;
/**
 * Creates a new scope with and executes the given operation within.
 * The scope is automatically removed once the operation
 * finishes or throws.
 *
 * This is essentially a convenience function for:
 *
 *     pushScope();
 *     callback();
 *     popScope();
 *
 * @param callback that will be enclosed into push/popScope.
 */
function withScope(callback) {
    callOnHub('withScope', callback);
}
exports.withScope = withScope;
/**
 * Calls a function on the latest client. Use this with caution, it's meant as
 * in "internal" helper so we don't need to expose every possible function in
 * the shim. It is not guaranteed that the client actually implements the
 * function.
 *
 * @param method The method to call on the client/client.
 * @param args Arguments to pass to the client/fontend.
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _callOnClient(method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    callOnHub.apply(void 0, tslib_1.__spread(['_invokeClient', method], args));
}
exports._callOnClient = _callOnClient;
/**
 * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.
 *
 * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a
 * new child span within the transaction or any span, call the respective `.startChild()` method.
 *
 * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.
 *
 * The transaction must be finished with a call to its `.finish()` method, at which point the transaction with all its
 * finished child spans will be sent to Sentry.
 *
 * @param context Properties of the new `Transaction`.
 * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent
 * default values). See {@link Options.tracesSampler}.
 *
 * @returns The transaction which was just started
 */
function startTransaction(context, customSamplingContext) {
    return callOnHub('startTransaction', tslib_1.__assign({}, context), customSamplingContext);
}
exports.startTransaction = startTransaction;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 67757:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
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

    __createBinding = function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    };

    __exportStar = function (m, exports) {
        for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
    };

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result["default"] = mod;
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 35686:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var severity_1 = __webpack_require__(44799);
exports.Severity = severity_1.Severity;
var severity_2 = __webpack_require__(44799);
exports.SeverityLevels = severity_2.SeverityLevels;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 44799:
/***/ ((__unused_webpack_module, exports) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * TODO(v7): Remove this enum and replace with SeverityLevel
 */
var Severity;
(function (Severity) {
    /** JSDoc */
    Severity["Fatal"] = "fatal";
    /** JSDoc */
    Severity["Error"] = "error";
    /** JSDoc */
    Severity["Warning"] = "warning";
    /** JSDoc */
    Severity["Log"] = "log";
    /** JSDoc */
    Severity["Info"] = "info";
    /** JSDoc */
    Severity["Debug"] = "debug";
    /** JSDoc */
    Severity["Critical"] = "critical";
})(Severity = exports.Severity || (exports.Severity = {}));
// TODO: in v7, these can disappear, because they now also exist in `@sentry/utils`. (Having them there rather than here
// is nice because then it enforces the idea that only types are exported from `@sentry/types`.)
exports.SeverityLevels = ['fatal', 'error', 'warning', 'log', 'info', 'debug', 'critical'];
//# sourceMappingURL=severity.js.map

/***/ }),

/***/ 43198:
/***/ ((__unused_webpack_module, exports) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Consumes the promise and logs the error when it rejects.
 * @param promise A promise to forget.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function forget(promise) {
    void promise.then(null, function (e) {
        // TODO: Use a better logging mechanism
        // eslint-disable-next-line no-console
        console.error(e);
    });
}
exports.forget = forget;
//# sourceMappingURL=async.js.map

/***/ }),

/***/ 31722:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var global_1 = __webpack_require__(53119);
var is_1 = __webpack_require__(70124);
/**
 * Given a child DOM element, returns a query-selector statement describing that
 * and its ancestors
 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
 * @returns generated DOM path
 */
function htmlTreeAsString(elem, keyAttrs) {
    // try/catch both:
    // - accessing event.target (see getsentry/raven-js#838, #768)
    // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
    // - can throw an exception in some circumstances.
    try {
        var currentElem = elem;
        var MAX_TRAVERSE_HEIGHT = 5;
        var MAX_OUTPUT_LEN = 80;
        var out = [];
        var height = 0;
        var len = 0;
        var separator = ' > ';
        var sepLength = separator.length;
        var nextStr = void 0;
        // eslint-disable-next-line no-plusplus
        while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
            nextStr = _htmlElementAsString(currentElem, keyAttrs);
            // bail out if
            // - nextStr is the 'html' element
            // - the length of the string that would be created exceeds MAX_OUTPUT_LEN
            //   (ignore this limit if we are on the first iteration)
            if (nextStr === 'html' || (height > 1 && len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN)) {
                break;
            }
            out.push(nextStr);
            len += nextStr.length;
            currentElem = currentElem.parentNode;
        }
        return out.reverse().join(separator);
    }
    catch (_oO) {
        return '<unknown>';
    }
}
exports.htmlTreeAsString = htmlTreeAsString;
/**
 * Returns a simple, query-selector representation of a DOM element
 * e.g. [HTMLElement] => input#foo.btn[name=baz]
 * @returns generated DOM path
 */
function _htmlElementAsString(el, keyAttrs) {
    var elem = el;
    var out = [];
    var className;
    var classes;
    var key;
    var attr;
    var i;
    if (!elem || !elem.tagName) {
        return '';
    }
    out.push(elem.tagName.toLowerCase());
    // Pairs of attribute keys defined in `serializeAttribute` and their values on element.
    var keyAttrPairs = keyAttrs && keyAttrs.length
        ? keyAttrs.filter(function (keyAttr) { return elem.getAttribute(keyAttr); }).map(function (keyAttr) { return [keyAttr, elem.getAttribute(keyAttr)]; })
        : null;
    if (keyAttrPairs && keyAttrPairs.length) {
        keyAttrPairs.forEach(function (keyAttrPair) {
            out.push("[" + keyAttrPair[0] + "=\"" + keyAttrPair[1] + "\"]");
        });
    }
    else {
        if (elem.id) {
            out.push("#" + elem.id);
        }
        // eslint-disable-next-line prefer-const
        className = elem.className;
        if (className && is_1.isString(className)) {
            classes = className.split(/\s+/);
            for (i = 0; i < classes.length; i++) {
                out.push("." + classes[i]);
            }
        }
    }
    var allowedAttrs = ['type', 'name', 'title', 'alt'];
    for (i = 0; i < allowedAttrs.length; i++) {
        key = allowedAttrs[i];
        attr = elem.getAttribute(key);
        if (attr) {
            out.push("[" + key + "=\"" + attr + "\"]");
        }
    }
    return out.join('');
}
/**
 * A safe form of location.href
 */
function getLocationHref() {
    var global = global_1.getGlobalObject();
    try {
        return global.document.location.href;
    }
    catch (oO) {
        return '';
    }
}
exports.getLocationHref = getLocationHref;
//# sourceMappingURL=browser.js.map

/***/ }),

/***/ 90545:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var envelope_1 = __webpack_require__(82924);
var time_1 = __webpack_require__(83485);
/**
 * Creates client report envelope
 * @param discarded_events An array of discard events
 * @param dsn A DSN that can be set on the header. Optional.
 */
function createClientReportEnvelope(discarded_events, dsn, timestamp) {
    var clientReportItem = [
        { type: 'client_report' },
        {
            timestamp: timestamp || time_1.dateTimestampInSeconds(),
            discarded_events: discarded_events,
        },
    ];
    return envelope_1.createEnvelope(dsn ? { dsn: dsn } : {}, [clientReportItem]);
}
exports.createClientReportEnvelope = createClientReportEnvelope;
//# sourceMappingURL=clientreport.js.map

/***/ }),

/***/ 51035:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(89479);
var error_1 = __webpack_require__(15088);
var flags_1 = __webpack_require__(19781);
/** Regular expression used to parse a Dsn. */
var DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+))?@)([\w.-]+)(?::(\d+))?\/(.+)/;
function isValidProtocol(protocol) {
    return protocol === 'http' || protocol === 'https';
}
/**
 * Renders the string representation of this Dsn.
 *
 * By default, this will render the public representation without the password
 * component. To get the deprecated private representation, set `withPassword`
 * to true.
 *
 * @param withPassword When set to true, the password will be included.
 */
function dsnToString(dsn, withPassword) {
    if (withPassword === void 0) { withPassword = false; }
    var host = dsn.host, path = dsn.path, pass = dsn.pass, port = dsn.port, projectId = dsn.projectId, protocol = dsn.protocol, publicKey = dsn.publicKey;
    return (protocol + "://" + publicKey + (withPassword && pass ? ":" + pass : '') +
        ("@" + host + (port ? ":" + port : '') + "/" + (path ? path + "/" : path) + projectId));
}
exports.dsnToString = dsnToString;
function dsnFromString(str) {
    var match = DSN_REGEX.exec(str);
    if (!match) {
        throw new error_1.SentryError("Invalid Sentry Dsn: " + str);
    }
    var _a = tslib_1.__read(match.slice(1), 6), protocol = _a[0], publicKey = _a[1], _b = _a[2], pass = _b === void 0 ? '' : _b, host = _a[3], _c = _a[4], port = _c === void 0 ? '' : _c, lastPath = _a[5];
    var path = '';
    var projectId = lastPath;
    var split = projectId.split('/');
    if (split.length > 1) {
        path = split.slice(0, -1).join('/');
        projectId = split.pop();
    }
    if (projectId) {
        var projectMatch = projectId.match(/^\d+/);
        if (projectMatch) {
            projectId = projectMatch[0];
        }
    }
    return dsnFromComponents({ host: host, pass: pass, path: path, projectId: projectId, port: port, protocol: protocol, publicKey: publicKey });
}
function dsnFromComponents(components) {
    // TODO this is for backwards compatibility, and can be removed in a future version
    if ('user' in components && !('publicKey' in components)) {
        components.publicKey = components.user;
    }
    return {
        user: components.publicKey || '',
        protocol: components.protocol,
        publicKey: components.publicKey || '',
        pass: components.pass || '',
        host: components.host,
        port: components.port || '',
        path: components.path || '',
        projectId: components.projectId,
    };
}
function validateDsn(dsn) {
    if (!flags_1.IS_DEBUG_BUILD) {
        return;
    }
    var port = dsn.port, projectId = dsn.projectId, protocol = dsn.protocol;
    var requiredComponents = ['protocol', 'publicKey', 'host', 'projectId'];
    requiredComponents.forEach(function (component) {
        if (!dsn[component]) {
            throw new error_1.SentryError("Invalid Sentry Dsn: " + component + " missing");
        }
    });
    if (!projectId.match(/^\d+$/)) {
        throw new error_1.SentryError("Invalid Sentry Dsn: Invalid projectId " + projectId);
    }
    if (!isValidProtocol(protocol)) {
        throw new error_1.SentryError("Invalid Sentry Dsn: Invalid protocol " + protocol);
    }
    if (port && isNaN(parseInt(port, 10))) {
        throw new error_1.SentryError("Invalid Sentry Dsn: Invalid port " + port);
    }
    return true;
}
/** The Sentry Dsn, identifying a Sentry instance and project. */
function makeDsn(from) {
    var components = typeof from === 'string' ? dsnFromString(from) : dsnFromComponents(from);
    validateDsn(components);
    return components;
}
exports.makeDsn = makeDsn;
//# sourceMappingURL=dsn.js.map

/***/ }),

/***/ 53120:
/***/ ((__unused_webpack_module, exports) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SeverityLevels = ['fatal', 'error', 'warning', 'log', 'info', 'debug', 'critical'];
//# sourceMappingURL=enums.js.map

/***/ }),

/***/ 34441:
/***/ ((__unused_webpack_module, exports) => {

/*
 * This module exists for optimizations in the build process through rollup and terser.  We define some global
 * constants, which can be overridden during build. By guarding certain pieces of code with functions that return these
 * constants, we can control whether or not they appear in the final bundle. (Any code guarded by a false condition will
 * never run, and will hence be dropped during treeshaking.) The two primary uses for this are stripping out calls to
 * `logger` and preventing node-related code from appearing in browser bundles.
 *
 * Attention:
 * This file should not be used to define constants/flags that are intended to be used for tree-shaking conducted by
 * users. These fags should live in their respective packages, as we identified user tooling (specifically webpack)
 * having issues tree-shaking these constants across package boundaries.
 * An example for this is the __SENTRY_DEBUG__ constant. It is declared in each package individually because we want
 * users to be able to shake away expressions that it guards.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Figures out if we're building a browser bundle.
 *
 * @returns true if this is a browser bundle build.
 */
function isBrowserBundle() {
    return typeof __SENTRY_BROWSER_BUNDLE__ !== 'undefined' && !!__SENTRY_BROWSER_BUNDLE__;
}
exports.isBrowserBundle = isBrowserBundle;
//# sourceMappingURL=env.js.map

/***/ }),

/***/ 82924:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(89479);
var is_1 = __webpack_require__(70124);
/**
 * Creates an envelope.
 * Make sure to always explicitly provide the generic to this function
 * so that the envelope types resolve correctly.
 */
function createEnvelope(headers, items) {
    if (items === void 0) { items = []; }
    return [headers, items];
}
exports.createEnvelope = createEnvelope;
/**
 * Add an item to an envelope.
 * Make sure to always explicitly provide the generic to this function
 * so that the envelope types resolve correctly.
 */
function addItemToEnvelope(envelope, newItem) {
    var _a = tslib_1.__read(envelope, 2), headers = _a[0], items = _a[1];
    return [headers, tslib_1.__spread(items, [newItem])];
}
exports.addItemToEnvelope = addItemToEnvelope;
/**
 * Get the type of the envelope. Grabs the type from the first envelope item.
 */
function getEnvelopeType(envelope) {
    var _a = tslib_1.__read(envelope, 2), _b = tslib_1.__read(_a[1], 1), _c = tslib_1.__read(_b[0], 1), firstItemHeader = _c[0];
    return firstItemHeader.type;
}
exports.getEnvelopeType = getEnvelopeType;
/**
 * Serializes an envelope into a string.
 */
function serializeEnvelope(envelope) {
    var _a = tslib_1.__read(envelope, 2), headers = _a[0], items = _a[1];
    var serializedHeaders = JSON.stringify(headers);
    // Have to cast items to any here since Envelope is a union type
    // Fixed in Typescript 4.2
    // TODO: Remove any[] cast when we upgrade to TS 4.2
    // https://github.com/microsoft/TypeScript/issues/36390
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.reduce(function (acc, item) {
        var _a = tslib_1.__read(item, 2), itemHeaders = _a[0], payload = _a[1];
        // We do not serialize payloads that are primitives
        var serializedPayload = is_1.isPrimitive(payload) ? String(payload) : JSON.stringify(payload);
        return acc + "\n" + JSON.stringify(itemHeaders) + "\n" + serializedPayload;
    }, serializedHeaders);
}
exports.serializeEnvelope = serializeEnvelope;
//# sourceMappingURL=envelope.js.map

/***/ }),

/***/ 15088:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(89479);
var polyfill_1 = __webpack_require__(203);
/** An error emitted by Sentry SDKs and related utilities. */
var SentryError = /** @class */ (function (_super) {
    tslib_1.__extends(SentryError, _super);
    function SentryError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.name = _newTarget.prototype.constructor.name;
        polyfill_1.setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return SentryError;
}(Error));
exports.SentryError = SentryError;
//# sourceMappingURL=error.js.map

/***/ }),

/***/ 19781:
/***/ ((__unused_webpack_module, exports) => {

/*
 * This file defines flags and constants that can be modified during compile time in order to facilitate tree shaking
 * for users.
 *
 * Debug flags need to be declared in each package individually and must not be imported across package boundaries,
 * because some build tools have trouble tree-shaking imported guards.
 *
 * As a convention, we define debug flags in a `flags.ts` file in the root of a package's `src` folder.
 *
 * Debug flag files will contain "magic strings" like `__SENTRY_DEBUG__` that may get replaced with actual values during
 * our, or the user's build process. Take care when introducing new flags - they must not throw if they are not
 * replaced.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/** Flag that is true for debug builds, false otherwise. */
exports.IS_DEBUG_BUILD = typeof __SENTRY_DEBUG__ === 'undefined' ? true : __SENTRY_DEBUG__;
//# sourceMappingURL=flags.js.map

/***/ }),

/***/ 53119:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * NOTE: In order to avoid circular dependencies, if you add a function to this module and it needs to print something,
 * you must either a) use `console.log` rather than the logger, or b) put your function elsewhere.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var node_1 = __webpack_require__(98016);
var fallbackGlobalObject = {};
/**
 * Safely get global scope object
 *
 * @returns Global scope object
 */
function getGlobalObject() {
    return (node_1.isNodeEnv()
        ? global
        : typeof window !== 'undefined' // eslint-disable-line no-restricted-globals
            ? window // eslint-disable-line no-restricted-globals
            : typeof self !== 'undefined'
                ? self
                : fallbackGlobalObject);
}
exports.getGlobalObject = getGlobalObject;
/**
 * Returns a global singleton contained in the global `__SENTRY__` object.
 *
 * If the singleton doesn't already exist in `__SENTRY__`, it will be created using the given factory
 * function and added to the `__SENTRY__` object.
 *
 * @param name name of the global singleton on __SENTRY__
 * @param creator creator Factory function to create the singleton if it doesn't already exist on `__SENTRY__`
 * @param obj (Optional) The global object on which to look for `__SENTRY__`, if not `getGlobalObject`'s return value
 * @returns the singleton
 */
function getGlobalSingleton(name, creator, obj) {
    var global = (obj || getGlobalObject());
    var __SENTRY__ = (global.__SENTRY__ = global.__SENTRY__ || {});
    var singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
    return singleton;
}
exports.getGlobalSingleton = getGlobalSingleton;
//# sourceMappingURL=global.js.map

/***/ }),

/***/ 58634:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(89479);
tslib_1.__exportStar(__webpack_require__(43198), exports);
tslib_1.__exportStar(__webpack_require__(31722), exports);
tslib_1.__exportStar(__webpack_require__(51035), exports);
tslib_1.__exportStar(__webpack_require__(53120), exports);
tslib_1.__exportStar(__webpack_require__(15088), exports);
tslib_1.__exportStar(__webpack_require__(53119), exports);
tslib_1.__exportStar(__webpack_require__(361), exports);
tslib_1.__exportStar(__webpack_require__(70124), exports);
tslib_1.__exportStar(__webpack_require__(93168), exports);
tslib_1.__exportStar(__webpack_require__(8294), exports);
tslib_1.__exportStar(__webpack_require__(73652), exports);
tslib_1.__exportStar(__webpack_require__(98016), exports);
tslib_1.__exportStar(__webpack_require__(19873), exports);
tslib_1.__exportStar(__webpack_require__(94215), exports);
tslib_1.__exportStar(__webpack_require__(21083), exports);
tslib_1.__exportStar(__webpack_require__(91077), exports);
tslib_1.__exportStar(__webpack_require__(42883), exports);
tslib_1.__exportStar(__webpack_require__(47129), exports);
tslib_1.__exportStar(__webpack_require__(60966), exports);
tslib_1.__exportStar(__webpack_require__(83409), exports);
tslib_1.__exportStar(__webpack_require__(6004), exports);
tslib_1.__exportStar(__webpack_require__(19934), exports);
tslib_1.__exportStar(__webpack_require__(83485), exports);
tslib_1.__exportStar(__webpack_require__(71328), exports);
tslib_1.__exportStar(__webpack_require__(34441), exports);
tslib_1.__exportStar(__webpack_require__(82924), exports);
tslib_1.__exportStar(__webpack_require__(90545), exports);
tslib_1.__exportStar(__webpack_require__(38063), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 361:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(89479);
var flags_1 = __webpack_require__(19781);
var global_1 = __webpack_require__(53119);
var is_1 = __webpack_require__(70124);
var logger_1 = __webpack_require__(93168);
var object_1 = __webpack_require__(94215);
var stacktrace_1 = __webpack_require__(47129);
var supports_1 = __webpack_require__(6004);
var global = global_1.getGlobalObject();
/**
 * Instrument native APIs to call handlers that can be used to create breadcrumbs, APM spans etc.
 *  - Console API
 *  - Fetch API
 *  - XHR API
 *  - History API
 *  - DOM API (click/typing)
 *  - Error API
 *  - UnhandledRejection API
 */
var handlers = {};
var instrumented = {};
/** Instruments given API */
function instrument(type) {
    if (instrumented[type]) {
        return;
    }
    instrumented[type] = true;
    switch (type) {
        case 'console':
            instrumentConsole();
            break;
        case 'dom':
            instrumentDOM();
            break;
        case 'xhr':
            instrumentXHR();
            break;
        case 'fetch':
            instrumentFetch();
            break;
        case 'history':
            instrumentHistory();
            break;
        case 'error':
            instrumentError();
            break;
        case 'unhandledrejection':
            instrumentUnhandledRejection();
            break;
        default:
            flags_1.IS_DEBUG_BUILD && logger_1.logger.warn('unknown instrumentation type:', type);
            return;
    }
}
/**
 * Add handler that will be called when given type of instrumentation triggers.
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */
function addInstrumentationHandler(type, callback) {
    handlers[type] = handlers[type] || [];
    handlers[type].push(callback);
    instrument(type);
}
exports.addInstrumentationHandler = addInstrumentationHandler;
/** JSDoc */
function triggerHandlers(type, data) {
    var e_1, _a;
    if (!type || !handlers[type]) {
        return;
    }
    try {
        for (var _b = tslib_1.__values(handlers[type] || []), _c = _b.next(); !_c.done; _c = _b.next()) {
            var handler = _c.value;
            try {
                handler(data);
            }
            catch (e) {
                flags_1.IS_DEBUG_BUILD &&
                    logger_1.logger.error("Error while triggering instrumentation handler.\nType: " + type + "\nName: " + stacktrace_1.getFunctionName(handler) + "\nError:", e);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
/** JSDoc */
function instrumentConsole() {
    if (!('console' in global)) {
        return;
    }
    logger_1.CONSOLE_LEVELS.forEach(function (level) {
        if (!(level in global.console)) {
            return;
        }
        object_1.fill(global.console, level, function (originalConsoleMethod) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                triggerHandlers('console', { args: args, level: level });
                // this fails for some browsers. :(
                if (originalConsoleMethod) {
                    originalConsoleMethod.apply(global.console, args);
                }
            };
        });
    });
}
/** JSDoc */
function instrumentFetch() {
    if (!supports_1.supportsNativeFetch()) {
        return;
    }
    object_1.fill(global, 'fetch', function (originalFetch) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var handlerData = {
                args: args,
                fetchData: {
                    method: getFetchMethod(args),
                    url: getFetchUrl(args),
                },
                startTimestamp: Date.now(),
            };
            triggerHandlers('fetch', tslib_1.__assign({}, handlerData));
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return originalFetch.apply(global, args).then(function (response) {
                triggerHandlers('fetch', tslib_1.__assign(tslib_1.__assign({}, handlerData), { endTimestamp: Date.now(), response: response }));
                return response;
            }, function (error) {
                triggerHandlers('fetch', tslib_1.__assign(tslib_1.__assign({}, handlerData), { endTimestamp: Date.now(), error: error }));
                // NOTE: If you are a Sentry user, and you are seeing this stack frame,
                //       it means the sentry.javascript SDK caught an error invoking your application code.
                //       This is expected behavior and NOT indicative of a bug with sentry.javascript.
                throw error;
            });
        };
    });
}
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/** Extract `method` from fetch call arguments */
function getFetchMethod(fetchArgs) {
    if (fetchArgs === void 0) { fetchArgs = []; }
    if ('Request' in global && is_1.isInstanceOf(fetchArgs[0], Request) && fetchArgs[0].method) {
        return String(fetchArgs[0].method).toUpperCase();
    }
    if (fetchArgs[1] && fetchArgs[1].method) {
        return String(fetchArgs[1].method).toUpperCase();
    }
    return 'GET';
}
/** Extract `url` from fetch call arguments */
function getFetchUrl(fetchArgs) {
    if (fetchArgs === void 0) { fetchArgs = []; }
    if (typeof fetchArgs[0] === 'string') {
        return fetchArgs[0];
    }
    if ('Request' in global && is_1.isInstanceOf(fetchArgs[0], Request)) {
        return fetchArgs[0].url;
    }
    return String(fetchArgs[0]);
}
/* eslint-enable @typescript-eslint/no-unsafe-member-access */
/** JSDoc */
function instrumentXHR() {
    if (!('XMLHttpRequest' in global)) {
        return;
    }
    var xhrproto = XMLHttpRequest.prototype;
    object_1.fill(xhrproto, 'open', function (originalOpen) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var xhr = this;
            var url = args[1];
            var xhrInfo = (xhr.__sentry_xhr__ = {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                method: is_1.isString(args[0]) ? args[0].toUpperCase() : args[0],
                url: args[1],
            });
            // if Sentry key appears in URL, don't capture it as a request
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (is_1.isString(url) && xhrInfo.method === 'POST' && url.match(/sentry_key/)) {
                xhr.__sentry_own_request__ = true;
            }
            var onreadystatechangeHandler = function () {
                if (xhr.readyState === 4) {
                    try {
                        // touching statusCode in some platforms throws
                        // an exception
                        xhrInfo.status_code = xhr.status;
                    }
                    catch (e) {
                        /* do nothing */
                    }
                    triggerHandlers('xhr', {
                        args: args,
                        endTimestamp: Date.now(),
                        startTimestamp: Date.now(),
                        xhr: xhr,
                    });
                }
            };
            if ('onreadystatechange' in xhr && typeof xhr.onreadystatechange === 'function') {
                object_1.fill(xhr, 'onreadystatechange', function (original) {
                    return function () {
                        var readyStateArgs = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            readyStateArgs[_i] = arguments[_i];
                        }
                        onreadystatechangeHandler();
                        return original.apply(xhr, readyStateArgs);
                    };
                });
            }
            else {
                xhr.addEventListener('readystatechange', onreadystatechangeHandler);
            }
            return originalOpen.apply(xhr, args);
        };
    });
    object_1.fill(xhrproto, 'send', function (originalSend) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.__sentry_xhr__ && args[0] !== undefined) {
                this.__sentry_xhr__.body = args[0];
            }
            triggerHandlers('xhr', {
                args: args,
                startTimestamp: Date.now(),
                xhr: this,
            });
            return originalSend.apply(this, args);
        };
    });
}
var lastHref;
/** JSDoc */
function instrumentHistory() {
    if (!supports_1.supportsHistory()) {
        return;
    }
    var oldOnPopState = global.onpopstate;
    global.onpopstate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var to = global.location.href;
        // keep track of the current URL state, as we always receive only the updated state
        var from = lastHref;
        lastHref = to;
        triggerHandlers('history', {
            from: from,
            to: to,
        });
        if (oldOnPopState) {
            // Apparently this can throw in Firefox when incorrectly implemented plugin is installed.
            // https://github.com/getsentry/sentry-javascript/issues/3344
            // https://github.com/bugsnag/bugsnag-js/issues/469
            try {
                return oldOnPopState.apply(this, args);
            }
            catch (_oO) {
                // no-empty
            }
        }
    };
    /** @hidden */
    function historyReplacementFunction(originalHistoryFunction) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var url = args.length > 2 ? args[2] : undefined;
            if (url) {
                // coerce to string (this is what pushState does)
                var from = lastHref;
                var to = String(url);
                // keep track of the current URL state, as we always receive only the updated state
                lastHref = to;
                triggerHandlers('history', {
                    from: from,
                    to: to,
                });
            }
            return originalHistoryFunction.apply(this, args);
        };
    }
    object_1.fill(global.history, 'pushState', historyReplacementFunction);
    object_1.fill(global.history, 'replaceState', historyReplacementFunction);
}
var debounceDuration = 1000;
var debounceTimerID;
var lastCapturedEvent;
/**
 * Decide whether the current event should finish the debounce of previously captured one.
 * @param previous previously captured event
 * @param current event to be captured
 */
function shouldShortcircuitPreviousDebounce(previous, current) {
    // If there was no previous event, it should always be swapped for the new one.
    if (!previous) {
        return true;
    }
    // If both events have different type, then user definitely performed two separate actions. e.g. click + keypress.
    if (previous.type !== current.type) {
        return true;
    }
    try {
        // If both events have the same type, it's still possible that actions were performed on different targets.
        // e.g. 2 clicks on different buttons.
        if (previous.target !== current.target) {
            return true;
        }
    }
    catch (e) {
        // just accessing `target` property can throw an exception in some rare circumstances
        // see: https://github.com/getsentry/sentry-javascript/issues/838
    }
    // If both events have the same type _and_ same `target` (an element which triggered an event, _not necessarily_
    // to which an event listener was attached), we treat them as the same action, as we want to capture
    // only one breadcrumb. e.g. multiple clicks on the same button, or typing inside a user input box.
    return false;
}
/**
 * Decide whether an event should be captured.
 * @param event event to be captured
 */
function shouldSkipDOMEvent(event) {
    // We are only interested in filtering `keypress` events for now.
    if (event.type !== 'keypress') {
        return false;
    }
    try {
        var target = event.target;
        if (!target || !target.tagName) {
            return true;
        }
        // Only consider keypress events on actual input elements. This will disregard keypresses targeting body
        // e.g.tabbing through elements, hotkeys, etc.
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return false;
        }
    }
    catch (e) {
        // just accessing `target` property can throw an exception in some rare circumstances
        // see: https://github.com/getsentry/sentry-javascript/issues/838
    }
    return true;
}
/**
 * Wraps addEventListener to capture UI breadcrumbs
 * @param handler function that will be triggered
 * @param globalListener indicates whether event was captured by the global event listener
 * @returns wrapped breadcrumb events handler
 * @hidden
 */
function makeDOMEventHandler(handler, globalListener) {
    if (globalListener === void 0) { globalListener = false; }
    return function (event) {
        // It's possible this handler might trigger multiple times for the same
        // event (e.g. event propagation through node ancestors).
        // Ignore if we've already captured that event.
        if (!event || lastCapturedEvent === event) {
            return;
        }
        // We always want to skip _some_ events.
        if (shouldSkipDOMEvent(event)) {
            return;
        }
        var name = event.type === 'keypress' ? 'input' : event.type;
        // If there is no debounce timer, it means that we can safely capture the new event and store it for future comparisons.
        if (debounceTimerID === undefined) {
            handler({
                event: event,
                name: name,
                global: globalListener,
            });
            lastCapturedEvent = event;
        }
        // If there is a debounce awaiting, see if the new event is different enough to treat it as a unique one.
        // If that's the case, emit the previous event and store locally the newly-captured DOM event.
        else if (shouldShortcircuitPreviousDebounce(lastCapturedEvent, event)) {
            handler({
                event: event,
                name: name,
                global: globalListener,
            });
            lastCapturedEvent = event;
        }
        // Start a new debounce timer that will prevent us from capturing multiple events that should be grouped together.
        clearTimeout(debounceTimerID);
        debounceTimerID = global.setTimeout(function () {
            debounceTimerID = undefined;
        }, debounceDuration);
    };
}
/** JSDoc */
function instrumentDOM() {
    if (!('document' in global)) {
        return;
    }
    // Make it so that any click or keypress that is unhandled / bubbled up all the way to the document triggers our dom
    // handlers. (Normally we have only one, which captures a breadcrumb for each click or keypress.) Do this before
    // we instrument `addEventListener` so that we don't end up attaching this handler twice.
    var triggerDOMHandler = triggerHandlers.bind(null, 'dom');
    var globalDOMEventHandler = makeDOMEventHandler(triggerDOMHandler, true);
    global.document.addEventListener('click', globalDOMEventHandler, false);
    global.document.addEventListener('keypress', globalDOMEventHandler, false);
    // After hooking into click and keypress events bubbled up to `document`, we also hook into user-handled
    // clicks & keypresses, by adding an event listener of our own to any element to which they add a listener. That
    // way, whenever one of their handlers is triggered, ours will be, too. (This is needed because their handler
    // could potentially prevent the event from bubbling up to our global listeners. This way, our handler are still
    // guaranteed to fire at least once.)
    ['EventTarget', 'Node'].forEach(function (target) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        var proto = global[target] && global[target].prototype;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-prototype-builtins
        if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty('addEventListener')) {
            return;
        }
        object_1.fill(proto, 'addEventListener', function (originalAddEventListener) {
            return function (type, listener, options) {
                if (type === 'click' || type == 'keypress') {
                    try {
                        var el = this;
                        var handlers_1 = (el.__sentry_instrumentation_handlers__ = el.__sentry_instrumentation_handlers__ || {});
                        var handlerForType = (handlers_1[type] = handlers_1[type] || { refCount: 0 });
                        if (!handlerForType.handler) {
                            var handler = makeDOMEventHandler(triggerDOMHandler);
                            handlerForType.handler = handler;
                            originalAddEventListener.call(this, type, handler, options);
                        }
                        handlerForType.refCount += 1;
                    }
                    catch (e) {
                        // Accessing dom properties is always fragile.
                        // Also allows us to skip `addEventListenrs` calls with no proper `this` context.
                    }
                }
                return originalAddEventListener.call(this, type, listener, options);
            };
        });
        object_1.fill(proto, 'removeEventListener', function (originalRemoveEventListener) {
            return function (type, listener, options) {
                if (type === 'click' || type == 'keypress') {
                    try {
                        var el = this;
                        var handlers_2 = el.__sentry_instrumentation_handlers__ || {};
                        var handlerForType = handlers_2[type];
                        if (handlerForType) {
                            handlerForType.refCount -= 1;
                            // If there are no longer any custom handlers of the current type on this element, we can remove ours, too.
                            if (handlerForType.refCount <= 0) {
                                originalRemoveEventListener.call(this, type, handlerForType.handler, options);
                                handlerForType.handler = undefined;
                                delete handlers_2[type]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
                            }
                            // If there are no longer any custom handlers of any type on this element, cleanup everything.
                            if (Object.keys(handlers_2).length === 0) {
                                delete el.__sentry_instrumentation_handlers__;
                            }
                        }
                    }
                    catch (e) {
                        // Accessing dom properties is always fragile.
                        // Also allows us to skip `addEventListenrs` calls with no proper `this` context.
                    }
                }
                return originalRemoveEventListener.call(this, type, listener, options);
            };
        });
    });
}
var _oldOnErrorHandler = null;
/** JSDoc */
function instrumentError() {
    _oldOnErrorHandler = global.onerror;
    global.onerror = function (msg, url, line, column, error) {
        triggerHandlers('error', {
            column: column,
            error: error,
            line: line,
            msg: msg,
            url: url,
        });
        if (_oldOnErrorHandler) {
            // eslint-disable-next-line prefer-rest-params
            return _oldOnErrorHandler.apply(this, arguments);
        }
        return false;
    };
}
var _oldOnUnhandledRejectionHandler = null;
/** JSDoc */
function instrumentUnhandledRejection() {
    _oldOnUnhandledRejectionHandler = global.onunhandledrejection;
    global.onunhandledrejection = function (e) {
        triggerHandlers('unhandledrejection', e);
        if (_oldOnUnhandledRejectionHandler) {
            // eslint-disable-next-line prefer-rest-params
            return _oldOnUnhandledRejectionHandler.apply(this, arguments);
        }
        return true;
    };
}
//# sourceMappingURL=instrument.js.map

/***/ }),

/***/ 70124:
/***/ ((__unused_webpack_module, exports) => {

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
Object.defineProperty(exports, "__esModule", ({ value: true }));
// eslint-disable-next-line @typescript-eslint/unbound-method
var objectToString = Object.prototype.toString;
/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {@link isError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isError(wat) {
    switch (objectToString.call(wat)) {
        case '[object Error]':
        case '[object Exception]':
        case '[object DOMException]':
            return true;
        default:
            return isInstanceOf(wat, Error);
    }
}
exports.isError = isError;
function isBuiltin(wat, ty) {
    return objectToString.call(wat) === "[object " + ty + "]";
}
/**
 * Checks whether given value's type is ErrorEvent
 * {@link isErrorEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isErrorEvent(wat) {
    return isBuiltin(wat, 'ErrorEvent');
}
exports.isErrorEvent = isErrorEvent;
/**
 * Checks whether given value's type is DOMError
 * {@link isDOMError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isDOMError(wat) {
    return isBuiltin(wat, 'DOMError');
}
exports.isDOMError = isDOMError;
/**
 * Checks whether given value's type is DOMException
 * {@link isDOMException}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isDOMException(wat) {
    return isBuiltin(wat, 'DOMException');
}
exports.isDOMException = isDOMException;
/**
 * Checks whether given value's type is a string
 * {@link isString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isString(wat) {
    return isBuiltin(wat, 'String');
}
exports.isString = isString;
/**
 * Checks whether given value is a primitive (undefined, null, number, boolean, string, bigint, symbol)
 * {@link isPrimitive}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isPrimitive(wat) {
    return wat === null || (typeof wat !== 'object' && typeof wat !== 'function');
}
exports.isPrimitive = isPrimitive;
/**
 * Checks whether given value's type is an object literal
 * {@link isPlainObject}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isPlainObject(wat) {
    return isBuiltin(wat, 'Object');
}
exports.isPlainObject = isPlainObject;
/**
 * Checks whether given value's type is an Event instance
 * {@link isEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isEvent(wat) {
    return typeof Event !== 'undefined' && isInstanceOf(wat, Event);
}
exports.isEvent = isEvent;
/**
 * Checks whether given value's type is an Element instance
 * {@link isElement}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isElement(wat) {
    return typeof Element !== 'undefined' && isInstanceOf(wat, Element);
}
exports.isElement = isElement;
/**
 * Checks whether given value's type is an regexp
 * {@link isRegExp}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isRegExp(wat) {
    return isBuiltin(wat, 'RegExp');
}
exports.isRegExp = isRegExp;
/**
 * Checks whether given value has a then function.
 * @param wat A value to be checked.
 */
function isThenable(wat) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Boolean(wat && wat.then && typeof wat.then === 'function');
}
exports.isThenable = isThenable;
/**
 * Checks whether given value's type is a SyntheticEvent
 * {@link isSyntheticEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isSyntheticEvent(wat) {
    return isPlainObject(wat) && 'nativeEvent' in wat && 'preventDefault' in wat && 'stopPropagation' in wat;
}
exports.isSyntheticEvent = isSyntheticEvent;
/**
 * Checks whether given value is NaN
 * {@link isNaN}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isNaN(wat) {
    return typeof wat === 'number' && wat !== wat;
}
exports.isNaN = isNaN;
/**
 * Checks whether given value's type is an instance of provided constructor.
 * {@link isInstanceOf}.
 *
 * @param wat A value to be checked.
 * @param base A constructor to be used in a check.
 * @returns A boolean representing the result.
 */
function isInstanceOf(wat, base) {
    try {
        return wat instanceof base;
    }
    catch (_e) {
        return false;
    }
}
exports.isInstanceOf = isInstanceOf;
//# sourceMappingURL=is.js.map

/***/ }),

/***/ 93168:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(89479);
var flags_1 = __webpack_require__(19781);
var global_1 = __webpack_require__(53119);
// TODO: Implement different loggers for different environments
var global = global_1.getGlobalObject();
/** Prefix for logging strings */
var PREFIX = 'Sentry Logger ';
exports.CONSOLE_LEVELS = ['debug', 'info', 'warn', 'error', 'log', 'assert'];
/**
 * Temporarily disable sentry console instrumentations.
 *
 * @param callback The function to run against the original `console` messages
 * @returns The results of the callback
 */
function consoleSandbox(callback) {
    var global = global_1.getGlobalObject();
    if (!('console' in global)) {
        return callback();
    }
    var originalConsole = global.console;
    var wrappedLevels = {};
    // Restore all wrapped console methods
    exports.CONSOLE_LEVELS.forEach(function (level) {
        // TODO(v7): Remove this check as it's only needed for Node 6
        var originalWrappedFunc = originalConsole[level] && originalConsole[level].__sentry_original__;
        if (level in global.console && originalWrappedFunc) {
            wrappedLevels[level] = originalConsole[level];
            originalConsole[level] = originalWrappedFunc;
        }
    });
    try {
        return callback();
    }
    finally {
        // Revert restoration to wrapped state
        Object.keys(wrappedLevels).forEach(function (level) {
            originalConsole[level] = wrappedLevels[level];
        });
    }
}
exports.consoleSandbox = consoleSandbox;
function makeLogger() {
    var enabled = false;
    var logger = {
        enable: function () {
            enabled = true;
        },
        disable: function () {
            enabled = false;
        },
    };
    if (flags_1.IS_DEBUG_BUILD) {
        exports.CONSOLE_LEVELS.forEach(function (name) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            logger[name] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (enabled) {
                    consoleSandbox(function () {
                        var _a;
                        (_a = global.console)[name].apply(_a, tslib_1.__spread([PREFIX + "[" + name + "]:"], args));
                    });
                }
            };
        });
    }
    else {
        exports.CONSOLE_LEVELS.forEach(function (name) {
            logger[name] = function () { return undefined; };
        });
    }
    return logger;
}
// Ensure we only have a single logger instance, even if multiple versions of @sentry/utils are being used
var logger;
exports.logger = logger;
if (flags_1.IS_DEBUG_BUILD) {
    exports.logger = logger = global_1.getGlobalSingleton('logger', makeLogger);
}
else {
    exports.logger = logger = makeLogger();
}
//# sourceMappingURL=logger.js.map

/***/ }),

/***/ 8294:
/***/ ((__unused_webpack_module, exports) => {

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Helper to decycle json objects
 */
function memoBuilder() {
    var hasWeakSet = typeof WeakSet === 'function';
    var inner = hasWeakSet ? new WeakSet() : [];
    function memoize(obj) {
        if (hasWeakSet) {
            if (inner.has(obj)) {
                return true;
            }
            inner.add(obj);
            return false;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (var i = 0; i < inner.length; i++) {
            var value = inner[i];
            if (value === obj) {
                return true;
            }
        }
        inner.push(obj);
        return false;
    }
    function unmemoize(obj) {
        if (hasWeakSet) {
            inner.delete(obj);
        }
        else {
            for (var i = 0; i < inner.length; i++) {
                if (inner[i] === obj) {
                    inner.splice(i, 1);
                    break;
                }
            }
        }
    }
    return [memoize, unmemoize];
}
exports.memoBuilder = memoBuilder;
//# sourceMappingURL=memo.js.map

/***/ }),

/***/ 73652:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(89479);
var global_1 = __webpack_require__(53119);
var object_1 = __webpack_require__(94215);
var string_1 = __webpack_require__(83409);
/**
 * UUID4 generator
 *
 * @returns string Generated UUID4.
 */
function uuid4() {
    var global = global_1.getGlobalObject();
    var crypto = global.crypto || global.msCrypto;
    if (!(crypto === void 0) && crypto.getRandomValues) {
        // Use window.crypto API if available
        var arr = new Uint16Array(8);
        crypto.getRandomValues(arr);
        // set 4 in byte 7
        // eslint-disable-next-line no-bitwise
        arr[3] = (arr[3] & 0xfff) | 0x4000;
        // set 2 most significant bits of byte 9 to '10'
        // eslint-disable-next-line no-bitwise
        arr[4] = (arr[4] & 0x3fff) | 0x8000;
        var pad = function (num) {
            var v = num.toString(16);
            while (v.length < 4) {
                v = "0" + v;
            }
            return v;
        };
        return (pad(arr[0]) + pad(arr[1]) + pad(arr[2]) + pad(arr[3]) + pad(arr[4]) + pad(arr[5]) + pad(arr[6]) + pad(arr[7]));
    }
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // eslint-disable-next-line no-bitwise
        var r = (Math.random() * 16) | 0;
        // eslint-disable-next-line no-bitwise
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
exports.uuid4 = uuid4;
/**
 * Parses string form of URL into an object
 * // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
 * // intentionally using regex and not <a/> href parsing trick because React Native and other
 * // environments where DOM might not be available
 * @returns parsed URL object
 */
function parseUrl(url) {
    if (!url) {
        return {};
    }
    var match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    if (!match) {
        return {};
    }
    // coerce to undefined values to empty string so we don't get 'undefined'
    var query = match[6] || '';
    var fragment = match[8] || '';
    return {
        host: match[4],
        path: match[5],
        protocol: match[2],
        relative: match[5] + query + fragment,
    };
}
exports.parseUrl = parseUrl;
function getFirstException(event) {
    return event.exception && event.exception.values ? event.exception.values[0] : undefined;
}
/**
 * Extracts either message or type+value from an event that can be used for user-facing logs
 * @returns event's description
 */
function getEventDescription(event) {
    var message = event.message, eventId = event.event_id;
    if (message) {
        return message;
    }
    var firstException = getFirstException(event);
    if (firstException) {
        if (firstException.type && firstException.value) {
            return firstException.type + ": " + firstException.value;
        }
        return firstException.type || firstException.value || eventId || '<unknown>';
    }
    return eventId || '<unknown>';
}
exports.getEventDescription = getEventDescription;
/**
 * Adds exception values, type and value to an synthetic Exception.
 * @param event The event to modify.
 * @param value Value of the exception.
 * @param type Type of the exception.
 * @hidden
 */
function addExceptionTypeValue(event, value, type) {
    var exception = (event.exception = event.exception || {});
    var values = (exception.values = exception.values || []);
    var firstException = (values[0] = values[0] || {});
    if (!firstException.value) {
        firstException.value = value || '';
    }
    if (!firstException.type) {
        firstException.type = type || 'Error';
    }
}
exports.addExceptionTypeValue = addExceptionTypeValue;
/**
 * Adds exception mechanism data to a given event. Uses defaults if the second parameter is not passed.
 *
 * @param event The event to modify.
 * @param newMechanism Mechanism data to add to the event.
 * @hidden
 */
function addExceptionMechanism(event, newMechanism) {
    var firstException = getFirstException(event);
    if (!firstException) {
        return;
    }
    var defaultMechanism = { type: 'generic', handled: true };
    var currentMechanism = firstException.mechanism;
    firstException.mechanism = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, defaultMechanism), currentMechanism), newMechanism);
    if (newMechanism && 'data' in newMechanism) {
        var mergedData = tslib_1.__assign(tslib_1.__assign({}, (currentMechanism && currentMechanism.data)), newMechanism.data);
        firstException.mechanism.data = mergedData;
    }
}
exports.addExceptionMechanism = addExceptionMechanism;
// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
var SEMVER_REGEXP = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
/**
 * Parses input into a SemVer interface
 * @param input string representation of a semver version
 */
function parseSemver(input) {
    var match = input.match(SEMVER_REGEXP) || [];
    var major = parseInt(match[1], 10);
    var minor = parseInt(match[2], 10);
    var patch = parseInt(match[3], 10);
    return {
        buildmetadata: match[5],
        major: isNaN(major) ? undefined : major,
        minor: isNaN(minor) ? undefined : minor,
        patch: isNaN(patch) ? undefined : patch,
        prerelease: match[4],
    };
}
exports.parseSemver = parseSemver;
/**
 * This function adds context (pre/post/line) lines to the provided frame
 *
 * @param lines string[] containing all lines
 * @param frame StackFrame that will be mutated
 * @param linesOfContext number of context lines we want to add pre/post
 */
function addContextToFrame(lines, frame, linesOfContext) {
    if (linesOfContext === void 0) { linesOfContext = 5; }
    var lineno = frame.lineno || 0;
    var maxLines = lines.length;
    var sourceLine = Math.max(Math.min(maxLines, lineno - 1), 0);
    frame.pre_context = lines
        .slice(Math.max(0, sourceLine - linesOfContext), sourceLine)
        .map(function (line) { return string_1.snipLine(line, 0); });
    frame.context_line = string_1.snipLine(lines[Math.min(maxLines - 1, sourceLine)], frame.colno || 0);
    frame.post_context = lines
        .slice(Math.min(sourceLine + 1, maxLines), sourceLine + 1 + linesOfContext)
        .map(function (line) { return string_1.snipLine(line, 0); });
}
exports.addContextToFrame = addContextToFrame;
/**
 * Strip the query string and fragment off of a given URL or path (if present)
 *
 * @param urlPath Full URL or path, including possible query string and/or fragment
 * @returns URL or path without query string or fragment
 */
function stripUrlQueryAndFragment(urlPath) {
    // eslint-disable-next-line no-useless-escape
    return urlPath.split(/[\?#]/, 1)[0];
}
exports.stripUrlQueryAndFragment = stripUrlQueryAndFragment;
/**
 * Checks whether or not we've already captured the given exception (note: not an identical exception - the very object
 * in question), and marks it captured if not.
 *
 * This is useful because it's possible for an error to get captured by more than one mechanism. After we intercept and
 * record an error, we rethrow it (assuming we've intercepted it before it's reached the top-level global handlers), so
 * that we don't interfere with whatever effects the error might have had were the SDK not there. At that point, because
 * the error has been rethrown, it's possible for it to bubble up to some other code we've instrumented. If it's not
 * caught after that, it will bubble all the way up to the global handlers (which of course we also instrument). This
 * function helps us ensure that even if we encounter the same error more than once, we only record it the first time we
 * see it.
 *
 * Note: It will ignore primitives (always return `false` and not mark them as seen), as properties can't be set on
 * them. {@link: Object.objectify} can be used on exceptions to convert any that are primitives into their equivalent
 * object wrapper forms so that this check will always work. However, because we need to flag the exact object which
 * will get rethrown, and because that rethrowing happens outside of the event processing pipeline, the objectification
 * must be done before the exception captured.
 *
 * @param A thrown exception to check or flag as having been seen
 * @returns `true` if the exception has already been captured, `false` if not (with the side effect of marking it seen)
 */
function checkOrSetAlreadyCaught(exception) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (exception && exception.__sentry_captured__) {
        return true;
    }
    try {
        // set it this way rather than by assignment so that it's not ennumerable and therefore isn't recorded by the
        // `ExtraErrorData` integration
        object_1.addNonEnumerableProperty(exception, '__sentry_captured__', true);
    }
    catch (err) {
        // `exception` is a primitive, so we can't mark it seen
    }
    return false;
}
exports.checkOrSetAlreadyCaught = checkOrSetAlreadyCaught;
//# sourceMappingURL=misc.js.map

/***/ }),

/***/ 98016:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
/**
 * NOTE: In order to avoid circular dependencies, if you add a function to this module and it needs to print something,
 * you must either a) use `console.log` rather than the logger, or b) put your function elsewhere.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var env_1 = __webpack_require__(34441);
/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */
function isNodeEnv() {
    // explicitly check for browser bundles as those can be optimized statically
    // by terser/rollup.
    return (!env_1.isBrowserBundle() &&
        Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]');
}
exports.isNodeEnv = isNodeEnv;
/**
 * Requires a module which is protected against bundler minification.
 *
 * @param request The module path to resolve
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
function dynamicRequire(mod, request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return mod.require(request);
}
exports.dynamicRequire = dynamicRequire;
/**
 * Helper for dynamically loading module that should work with linked dependencies.
 * The problem is that we _should_ be using `require(require.resolve(moduleName, { paths: [cwd()] }))`
 * However it's _not possible_ to do that with Webpack, as it has to know all the dependencies during
 * build time. `require.resolve` is also not available in any other way, so we cannot create,
 * a fake helper like we do with `dynamicRequire`.
 *
 * We always prefer to use local package, thus the value is not returned early from each `try/catch` block.
 * That is to mimic the behavior of `require.resolve` exactly.
 *
 * @param moduleName module name to require
 * @returns possibly required module
 */
function loadModule(moduleName) {
    var mod;
    try {
        mod = dynamicRequire(module, moduleName);
    }
    catch (e) {
        // no-empty
    }
    try {
        var cwd = dynamicRequire(module, 'process').cwd;
        mod = dynamicRequire(module, cwd() + "/node_modules/" + moduleName);
    }
    catch (e) {
        // no-empty
    }
    return mod;
}
exports.loadModule = loadModule;
//# sourceMappingURL=node.js.map

/***/ }),

/***/ 19873:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(89479);
var is_1 = __webpack_require__(70124);
var memo_1 = __webpack_require__(8294);
var object_1 = __webpack_require__(94215);
var stacktrace_1 = __webpack_require__(47129);
/**
 * Recursively normalizes the given object.
 *
 * - Creates a copy to prevent original input mutation
 * - Skips non-enumerable properties
 * - When stringifying, calls `toJSON` if implemented
 * - Removes circular references
 * - Translates non-serializable values (`undefined`/`NaN`/functions) to serializable format
 * - Translates known global objects/classes to a string representations
 * - Takes care of `Error` object serialization
 * - Optionally limits depth of final output
 * - Optionally limits number of properties/elements included in any single object/array
 *
 * @param input The object to be normalized.
 * @param depth The max depth to which to normalize the object. (Anything deeper stringified whole.)
 * @param maxProperties The max number of elements or properties to be included in any single array or
 * object in the normallized output..
 * @returns A normalized version of the object, or `"**non-serializable**"` if any errors are thrown during normalization.
 */
function normalize(input, depth, maxProperties) {
    if (depth === void 0) { depth = +Infinity; }
    if (maxProperties === void 0) { maxProperties = +Infinity; }
    try {
        // since we're at the outermost level, there is no key
        return visit('', input, depth, maxProperties);
    }
    catch (err) {
        return { ERROR: "**non-serializable** (" + err + ")" };
    }
}
exports.normalize = normalize;
/** JSDoc */
function normalizeToSize(object, 
// Default Node.js REPL depth
depth, 
// 100kB, as 200kB is max payload size, so half sounds reasonable
maxSize) {
    if (depth === void 0) { depth = 3; }
    if (maxSize === void 0) { maxSize = 100 * 1024; }
    var normalized = normalize(object, depth);
    if (jsonSize(normalized) > maxSize) {
        return normalizeToSize(object, depth - 1, maxSize);
    }
    return normalized;
}
exports.normalizeToSize = normalizeToSize;
/**
 * Visits a node to perform normalization on it
 *
 * @param key The key corresponding to the given node
 * @param value The node to be visited
 * @param depth Optional number indicating the maximum recursion depth
 * @param maxProperties Optional maximum number of properties/elements included in any single object/array
 * @param memo Optional Memo class handling decycling
 */
function visit(key, value, depth, maxProperties, memo) {
    if (depth === void 0) { depth = +Infinity; }
    if (maxProperties === void 0) { maxProperties = +Infinity; }
    if (memo === void 0) { memo = memo_1.memoBuilder(); }
    var _a = tslib_1.__read(memo, 2), memoize = _a[0], unmemoize = _a[1];
    // If the value has a `toJSON` method, see if we can bail and let it do the work
    var valueWithToJSON = value;
    if (valueWithToJSON && typeof valueWithToJSON.toJSON === 'function') {
        try {
            return valueWithToJSON.toJSON();
        }
        catch (err) {
            // pass (The built-in `toJSON` failed, but we can still try to do it ourselves)
        }
    }
    // Get the simple cases out of the way first
    if (value === null || (['number', 'boolean', 'string'].includes(typeof value) && !is_1.isNaN(value))) {
        return value;
    }
    var stringified = stringifyValue(key, value);
    // Anything we could potentially dig into more (objects or arrays) will have come back as `"[object XXXX]"`.
    // Everything else will have already been serialized, so if we don't see that pattern, we're done.
    if (!stringified.startsWith('[object ')) {
        return stringified;
    }
    // We're also done if we've reached the max depth
    if (depth === 0) {
        // At this point we know `serialized` is a string of the form `"[object XXXX]"`. Clean it up so it's just `"[XXXX]"`.
        return stringified.replace('object ', '');
    }
    // If we've already visited this branch, bail out, as it's circular reference. If not, note that we're seeing it now.
    if (memoize(value)) {
        return '[Circular ~]';
    }
    // At this point we know we either have an object or an array, we haven't seen it before, and we're going to recurse
    // because we haven't yet reached the max depth. Create an accumulator to hold the results of visiting each
    // property/entry, and keep track of the number of items we add to it.
    var normalized = (Array.isArray(value) ? [] : {});
    var numAdded = 0;
    // Before we begin, convert`Error` and`Event` instances into plain objects, since some of each of their relevant
    // properties are non-enumerable and otherwise would get missed.
    var visitable = (is_1.isError(value) || is_1.isEvent(value) ? object_1.convertToPlainObject(value) : value);
    for (var visitKey in visitable) {
        // Avoid iterating over fields in the prototype if they've somehow been exposed to enumeration.
        if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) {
            continue;
        }
        if (numAdded >= maxProperties) {
            normalized[visitKey] = '[MaxProperties ~]';
            break;
        }
        // Recursively visit all the child nodes
        var visitValue = visitable[visitKey];
        normalized[visitKey] = visit(visitKey, visitValue, depth - 1, maxProperties, memo);
        numAdded += 1;
    }
    // Once we've visited all the branches, remove the parent from memo storage
    unmemoize(value);
    // Return accumulated values
    return normalized;
}
exports.walk = visit;
/**
 * Stringify the given value. Handles various known special values and types.
 *
 * Not meant to be used on simple primitives which already have a string representation, as it will, for example, turn
 * the number 1231 into "[Object Number]", nor on `null`, as it will throw.
 *
 * @param value The value to stringify
 * @returns A stringified representation of the given value
 */
function stringifyValue(key, 
// this type is a tiny bit of a cheat, since this function does handle NaN (which is technically a number), but for
// our internal use, it'll do
value) {
    try {
        if (key === 'domain' && value && typeof value === 'object' && value._events) {
            return '[Domain]';
        }
        if (key === 'domainEmitter') {
            return '[DomainEmitter]';
        }
        // It's safe to use `global`, `window`, and `document` here in this manner, as we are asserting using `typeof` first
        // which won't throw if they are not present.
        if (typeof global !== 'undefined' && value === global) {
            return '[Global]';
        }
        // eslint-disable-next-line no-restricted-globals
        if (typeof window !== 'undefined' && value === window) {
            return '[Window]';
        }
        // eslint-disable-next-line no-restricted-globals
        if (typeof document !== 'undefined' && value === document) {
            return '[Document]';
        }
        // React's SyntheticEvent thingy
        if (is_1.isSyntheticEvent(value)) {
            return '[SyntheticEvent]';
        }
        if (typeof value === 'number' && value !== value) {
            return '[NaN]';
        }
        // this catches `undefined` (but not `null`, which is a primitive and can be serialized on its own)
        if (value === void 0) {
            return '[undefined]';
        }
        if (typeof value === 'function') {
            return "[Function: " + stacktrace_1.getFunctionName(value) + "]";
        }
        if (typeof value === 'symbol') {
            return "[" + String(value) + "]";
        }
        // stringified BigInts are indistinguishable from regular numbers, so we need to label them to avoid confusion
        if (typeof value === 'bigint') {
            return "[BigInt: " + String(value) + "]";
        }
        // Now that we've knocked out all the special cases and the primitives, all we have left are objects. Simply casting
        // them to strings means that instances of classes which haven't defined their `toStringTag` will just come out as
        // `"[object Object]"`. If we instead look at the constructor's name (which is the same as the name of the class),
        // we can make sure that only plain objects come out that way.
        return "[object " + Object.getPrototypeOf(value).constructor.name + "]";
    }
    catch (err) {
        return "**non-serializable** (" + err + ")";
    }
}
/** Calculates bytes size of input string */
function utf8Length(value) {
    // eslint-disable-next-line no-bitwise
    return ~-encodeURI(value).split(/%..|./).length;
}
/** Calculates bytes size of input object */
function jsonSize(value) {
    return utf8Length(JSON.stringify(value));
}
//# sourceMappingURL=normalize.js.map

/***/ }),

/***/ 94215:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(89479);
var browser_1 = __webpack_require__(31722);
var is_1 = __webpack_require__(70124);
var string_1 = __webpack_require__(83409);
/**
 * Replace a method in an object with a wrapped version of itself.
 *
 * @param source An object that contains a method to be wrapped.
 * @param name The name of the method to be wrapped.
 * @param replacementFactory A higher-order function that takes the original version of the given method and returns a
 * wrapped version. Note: The function returned by `replacementFactory` needs to be a non-arrow function, in order to
 * preserve the correct value of `this`, and the original method must be called using `origMethod.call(this, <other
 * args>)` or `origMethod.apply(this, [<other args>])` (rather than being called directly), again to preserve `this`.
 * @returns void
 */
function fill(source, name, replacementFactory) {
    if (!(name in source)) {
        return;
    }
    var original = source[name];
    var wrapped = replacementFactory(original);
    // Make sure it's a function first, as we need to attach an empty prototype for `defineProperties` to work
    // otherwise it'll throw "TypeError: Object.defineProperties called on non-object"
    if (typeof wrapped === 'function') {
        try {
            markFunctionWrapped(wrapped, original);
        }
        catch (_Oo) {
            // This can throw if multiple fill happens on a global object like XMLHttpRequest
            // Fixes https://github.com/getsentry/sentry-javascript/issues/2043
        }
    }
    source[name] = wrapped;
}
exports.fill = fill;
/**
 * Defines a non-enumerable property on the given object.
 *
 * @param obj The object on which to set the property
 * @param name The name of the property to be set
 * @param value The value to which to set the property
 */
function addNonEnumerableProperty(obj, name, value) {
    Object.defineProperty(obj, name, {
        // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
        value: value,
        writable: true,
        configurable: true,
    });
}
exports.addNonEnumerableProperty = addNonEnumerableProperty;
/**
 * Remembers the original function on the wrapped function and
 * patches up the prototype.
 *
 * @param wrapped the wrapper function
 * @param original the original function that gets wrapped
 */
function markFunctionWrapped(wrapped, original) {
    var proto = original.prototype || {};
    wrapped.prototype = original.prototype = proto;
    addNonEnumerableProperty(wrapped, '__sentry_original__', original);
}
exports.markFunctionWrapped = markFunctionWrapped;
/**
 * This extracts the original function if available.  See
 * `markFunctionWrapped` for more information.
 *
 * @param func the function to unwrap
 * @returns the unwrapped version of the function if available.
 */
function getOriginalFunction(func) {
    return func.__sentry_original__;
}
exports.getOriginalFunction = getOriginalFunction;
/**
 * Encodes given object into url-friendly format
 *
 * @param object An object that contains serializable values
 * @returns string Encoded
 */
function urlEncode(object) {
    return Object.keys(object)
        .map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(object[key]); })
        .join('&');
}
exports.urlEncode = urlEncode;
/**
 * Transforms any object into an object literal with all its attributes
 * attached to it.
 *
 * @param value Initial source that we have to transform in order for it to be usable by the serializer
 */
function convertToPlainObject(value) {
    var newObj = value;
    if (is_1.isError(value)) {
        newObj = tslib_1.__assign({ message: value.message, name: value.name, stack: value.stack }, getOwnProperties(value));
    }
    else if (is_1.isEvent(value)) {
        var event_1 = value;
        newObj = tslib_1.__assign({ type: event_1.type, target: serializeEventTarget(event_1.target), currentTarget: serializeEventTarget(event_1.currentTarget) }, getOwnProperties(event_1));
        if (typeof CustomEvent !== 'undefined' && is_1.isInstanceOf(value, CustomEvent)) {
            newObj.detail = event_1.detail;
        }
    }
    return newObj;
}
exports.convertToPlainObject = convertToPlainObject;
/** Creates a string representation of the target of an `Event` object */
function serializeEventTarget(target) {
    try {
        return is_1.isElement(target) ? browser_1.htmlTreeAsString(target) : Object.prototype.toString.call(target);
    }
    catch (_oO) {
        return '<unknown>';
    }
}
/** Filters out all but an object's own properties */
function getOwnProperties(obj) {
    var extractedProps = {};
    for (var property in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, property)) {
            extractedProps[property] = obj[property];
        }
    }
    return extractedProps;
}
/**
 * Given any captured exception, extract its keys and create a sorted
 * and truncated list that will be used inside the event message.
 * eg. `Non-error exception captured with keys: foo, bar, baz`
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function extractExceptionKeysForMessage(exception, maxLength) {
    if (maxLength === void 0) { maxLength = 40; }
    var keys = Object.keys(convertToPlainObject(exception));
    keys.sort();
    if (!keys.length) {
        return '[object has no keys]';
    }
    if (keys[0].length >= maxLength) {
        return string_1.truncate(keys[0], maxLength);
    }
    for (var includedKeys = keys.length; includedKeys > 0; includedKeys--) {
        var serialized = keys.slice(0, includedKeys).join(', ');
        if (serialized.length > maxLength) {
            continue;
        }
        if (includedKeys === keys.length) {
            return serialized;
        }
        return string_1.truncate(serialized, maxLength);
    }
    return '';
}
exports.extractExceptionKeysForMessage = extractExceptionKeysForMessage;
/**
 * Given any object, return the new object with removed keys that value was `undefined`.
 * Works recursively on objects and arrays.
 */
function dropUndefinedKeys(val) {
    var e_1, _a;
    if (is_1.isPlainObject(val)) {
        var rv = {};
        try {
            for (var _b = tslib_1.__values(Object.keys(val)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (typeof val[key] !== 'undefined') {
                    rv[key] = dropUndefinedKeys(val[key]);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return rv;
    }
    if (Array.isArray(val)) {
        return val.map(dropUndefinedKeys);
    }
    return val;
}
exports.dropUndefinedKeys = dropUndefinedKeys;
/**
 * Ensure that something is an object.
 *
 * Turns `undefined` and `null` into `String`s and all other primitives into instances of their respective wrapper
 * classes (String, Boolean, Number, etc.). Acts as the identity function on non-primitives.
 *
 * @param wat The subject of the objectification
 * @returns A version of `wat` which can safely be used with `Object` class methods
 */
function objectify(wat) {
    var objectified;
    switch (true) {
        case wat === undefined || wat === null:
            objectified = new String(wat);
            break;
        // Though symbols and bigints do have wrapper classes (`Symbol` and `BigInt`, respectively), for whatever reason
        // those classes don't have constructors which can be used with the `new` keyword. We therefore need to cast each as
        // an object in order to wrap it.
        case typeof wat === 'symbol' || typeof wat === 'bigint':
            objectified = Object(wat);
            break;
        // this will catch the remaining primitives: `String`, `Number`, and `Boolean`
        case is_1.isPrimitive(wat):
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            objectified = new wat.constructor(wat);
            break;
        // by process of elimination, at this point we know that `wat` must already be an object
        default:
            objectified = wat;
            break;
    }
    return objectified;
}
exports.objectify = objectify;
//# sourceMappingURL=object.js.map

/***/ }),

/***/ 21083:
/***/ ((__unused_webpack_module, exports) => {

// Slightly modified (no IE8 support, ES6) and transcribed to TypeScript
// https://raw.githubusercontent.com/calvinmetcalf/rollup-plugin-node-builtins/master/src/es6/path.js
Object.defineProperty(exports, "__esModule", ({ value: true }));
/** JSDoc */
function normalizeArray(parts, allowAboveRoot) {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last === '.') {
            parts.splice(i, 1);
        }
        else if (last === '..') {
            parts.splice(i, 1);
            // eslint-disable-next-line no-plusplus
            up++;
        }
        else if (up) {
            parts.splice(i, 1);
            // eslint-disable-next-line no-plusplus
            up--;
        }
    }
    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
        // eslint-disable-next-line no-plusplus
        for (; up--; up) {
            parts.unshift('..');
        }
    }
    return parts;
}
// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^/]+?|)(\.[^./]*|))(?:[/]*)$/;
/** JSDoc */
function splitPath(filename) {
    var parts = splitPathRe.exec(filename);
    return parts ? parts.slice(1) : [];
}
// path.resolve([from ...], to)
// posix version
/** JSDoc */
function resolve() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var resolvedPath = '';
    var resolvedAbsolute = false;
    for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = i >= 0 ? args[i] : '/';
        // Skip empty entries
        if (!path) {
            continue;
        }
        resolvedPath = path + "/" + resolvedPath;
        resolvedAbsolute = path.charAt(0) === '/';
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    // Normalize the path
    resolvedPath = normalizeArray(resolvedPath.split('/').filter(function (p) { return !!p; }), !resolvedAbsolute).join('/');
    return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
}
exports.resolve = resolve;
/** JSDoc */
function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
        if (arr[start] !== '') {
            break;
        }
    }
    var end = arr.length - 1;
    for (; end >= 0; end--) {
        if (arr[end] !== '') {
            break;
        }
    }
    if (start > end) {
        return [];
    }
    return arr.slice(start, end - start + 1);
}
// path.relative(from, to)
// posix version
/** JSDoc */
function relative(from, to) {
    /* eslint-disable no-param-reassign */
    from = resolve(from).substr(1);
    to = resolve(to).substr(1);
    /* eslint-enable no-param-reassign */
    var fromParts = trim(from.split('/'));
    var toParts = trim(to.split('/'));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
        }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push('..');
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join('/');
}
exports.relative = relative;
// path.normalize(path)
// posix version
/** JSDoc */
function normalizePath(path) {
    var isPathAbsolute = isAbsolute(path);
    var trailingSlash = path.substr(-1) === '/';
    // Normalize the path
    var normalizedPath = normalizeArray(path.split('/').filter(function (p) { return !!p; }), !isPathAbsolute).join('/');
    if (!normalizedPath && !isPathAbsolute) {
        normalizedPath = '.';
    }
    if (normalizedPath && trailingSlash) {
        normalizedPath += '/';
    }
    return (isPathAbsolute ? '/' : '') + normalizedPath;
}
exports.normalizePath = normalizePath;
// posix version
/** JSDoc */
function isAbsolute(path) {
    return path.charAt(0) === '/';
}
exports.isAbsolute = isAbsolute;
// posix version
/** JSDoc */
function join() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return normalizePath(args.join('/'));
}
exports.join = join;
/** JSDoc */
function dirname(path) {
    var result = splitPath(path);
    var root = result[0];
    var dir = result[1];
    if (!root && !dir) {
        // No dirname whatsoever
        return '.';
    }
    if (dir) {
        // It has a dirname, strip trailing slash
        dir = dir.substr(0, dir.length - 1);
    }
    return root + dir;
}
exports.dirname = dirname;
/** JSDoc */
function basename(path, ext) {
    var f = splitPath(path)[2];
    if (ext && f.substr(ext.length * -1) === ext) {
        f = f.substr(0, f.length - ext.length);
    }
    return f;
}
exports.basename = basename;
//# sourceMappingURL=path.js.map

/***/ }),

/***/ 203:
/***/ ((__unused_webpack_module, exports) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setPrototypeOf = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties);
/**
 * setPrototypeOf polyfill using __proto__
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function setProtoOf(obj, proto) {
    // @ts-ignore __proto__ does not exist on obj
    obj.__proto__ = proto;
    return obj;
}
/**
 * setPrototypeOf polyfill using mixin
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function mixinProperties(obj, proto) {
    for (var prop in proto) {
        if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
            // @ts-ignore typescript complains about indexing so we remove
            obj[prop] = proto[prop];
        }
    }
    return obj;
}
//# sourceMappingURL=polyfill.js.map

/***/ }),

/***/ 91077:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var error_1 = __webpack_require__(15088);
var syncpromise_1 = __webpack_require__(19934);
/**
 * Creates an new PromiseBuffer object with the specified limit
 * @param limit max number of promises that can be stored in the buffer
 */
function makePromiseBuffer(limit) {
    var buffer = [];
    function isReady() {
        return limit === undefined || buffer.length < limit;
    }
    /**
     * Remove a promise from the queue.
     *
     * @param task Can be any PromiseLike<T>
     * @returns Removed promise.
     */
    function remove(task) {
        return buffer.splice(buffer.indexOf(task), 1)[0];
    }
    /**
     * Add a promise (representing an in-flight action) to the queue, and set it to remove itself on fulfillment.
     *
     * @param taskProducer A function producing any PromiseLike<T>; In previous versions this used to be `task:
     *        PromiseLike<T>`, but under that model, Promises were instantly created on the call-site and their executor
     *        functions therefore ran immediately. Thus, even if the buffer was full, the action still happened. By
     *        requiring the promise to be wrapped in a function, we can defer promise creation until after the buffer
     *        limit check.
     * @returns The original promise.
     */
    function add(taskProducer) {
        if (!isReady()) {
            return syncpromise_1.rejectedSyncPromise(new error_1.SentryError('Not adding Promise due to buffer limit reached.'));
        }
        // start the task and add its promise to the queue
        var task = taskProducer();
        if (buffer.indexOf(task) === -1) {
            buffer.push(task);
        }
        void task
            .then(function () { return remove(task); })
            // Use `then(null, rejectionHandler)` rather than `catch(rejectionHandler)` so that we can use `PromiseLike`
            // rather than `Promise`. `PromiseLike` doesn't have a `.catch` method, making its polyfill smaller. (ES5 didn't
            // have promises, so TS has to polyfill when down-compiling.)
            .then(null, function () {
            return remove(task).then(null, function () {
                // We have to add another catch here because `remove()` starts a new promise chain.
            });
        });
        return task;
    }
    /**
     * Wait for all promises in the queue to resolve or for timeout to expire, whichever comes first.
     *
     * @param timeout The time, in ms, after which to resolve to `false` if the queue is still non-empty. Passing `0` (or
     * not passing anything) will make the promise wait as long as it takes for the queue to drain before resolving to
     * `true`.
     * @returns A promise which will resolve to `true` if the queue is already empty or drains before the timeout, and
     * `false` otherwise
     */
    function drain(timeout) {
        return new syncpromise_1.SyncPromise(function (resolve, reject) {
            var counter = buffer.length;
            if (!counter) {
                return resolve(true);
            }
            // wait for `timeout` ms and then resolve to `false` (if not cancelled first)
            var capturedSetTimeout = setTimeout(function () {
                if (timeout && timeout > 0) {
                    resolve(false);
                }
            }, timeout);
            // if all promises resolve in time, cancel the timer and resolve to `true`
            buffer.forEach(function (item) {
                void syncpromise_1.resolvedSyncPromise(item).then(function () {
                    // eslint-disable-next-line no-plusplus
                    if (!--counter) {
                        clearTimeout(capturedSetTimeout);
                        resolve(true);
                    }
                }, reject);
            });
        });
    }
    return {
        $: buffer,
        add: add,
        drain: drain,
    };
}
exports.makePromiseBuffer = makePromiseBuffer;
//# sourceMappingURL=promisebuffer.js.map

/***/ }),

/***/ 38063:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(89479);
exports.DEFAULT_RETRY_AFTER = 60 * 1000; // 60 seconds
/**
 * Extracts Retry-After value from the request header or returns default value
 * @param header string representation of 'Retry-After' header
 * @param now current unix timestamp
 *
 */
function parseRetryAfterHeader(header, now) {
    if (now === void 0) { now = Date.now(); }
    var headerDelay = parseInt("" + header, 10);
    if (!isNaN(headerDelay)) {
        return headerDelay * 1000;
    }
    var headerDate = Date.parse("" + header);
    if (!isNaN(headerDate)) {
        return headerDate - now;
    }
    return exports.DEFAULT_RETRY_AFTER;
}
exports.parseRetryAfterHeader = parseRetryAfterHeader;
/**
 * Gets the time that given category is disabled until for rate limiting
 */
function disabledUntil(limits, category) {
    return limits[category] || limits.all || 0;
}
exports.disabledUntil = disabledUntil;
/**
 * Checks if a category is rate limited
 */
function isRateLimited(limits, category, now) {
    if (now === void 0) { now = Date.now(); }
    return disabledUntil(limits, category) > now;
}
exports.isRateLimited = isRateLimited;
/**
 * Update ratelimits from incoming headers.
 * Returns true if headers contains a non-empty rate limiting header.
 */
function updateRateLimits(limits, headers, now) {
    var e_1, _a, e_2, _b;
    if (now === void 0) { now = Date.now(); }
    var updatedRateLimits = tslib_1.__assign({}, limits);
    // "The name is case-insensitive."
    // https://developer.mozilla.org/en-US/docs/Web/API/Headers/get
    var rateLimitHeader = headers['x-sentry-rate-limits'];
    var retryAfterHeader = headers['retry-after'];
    if (rateLimitHeader) {
        try {
            /**
             * rate limit headers are of the form
             *     <header>,<header>,..
             * where each <header> is of the form
             *     <retry_after>: <categories>: <scope>: <reason_code>
             * where
             *     <retry_after> is a delay in seconds
             *     <categories> is the event type(s) (error, transaction, etc) being rate limited and is of the form
             *         <category>;<category>;...
             *     <scope> is what's being limited (org, project, or key) - ignored by SDK
             *     <reason_code> is an arbitrary string like "org_quota" - ignored by SDK
             */
            for (var _c = tslib_1.__values(rateLimitHeader.trim().split(',')), _d = _c.next(); !_d.done; _d = _c.next()) {
                var limit = _d.value;
                var parameters = limit.split(':', 2);
                var headerDelay = parseInt(parameters[0], 10);
                var delay = (!isNaN(headerDelay) ? headerDelay : 60) * 1000; // 60sec default
                if (!parameters[1]) {
                    updatedRateLimits.all = now + delay;
                }
                else {
                    try {
                        for (var _e = (e_2 = void 0, tslib_1.__values(parameters[1].split(';'))), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var category = _f.value;
                            updatedRateLimits[category] = now + delay;
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    else if (retryAfterHeader) {
        updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now);
    }
    return updatedRateLimits;
}
exports.updateRateLimits = updateRateLimits;
//# sourceMappingURL=ratelimit.js.map

/***/ }),

/***/ 42883:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var types_1 = __webpack_require__(35686);
var enums_1 = __webpack_require__(53120);
function isSupportedSeverity(level) {
    return enums_1.SeverityLevels.indexOf(level) !== -1;
}
/**
 * Converts a string-based level into a {@link Severity}.
 *
 * @param level string representation of Severity
 * @returns Severity
 */
function severityFromString(level) {
    if (level === 'warn')
        return types_1.Severity.Warning;
    if (isSupportedSeverity(level)) {
        return level;
    }
    return types_1.Severity.Log;
}
exports.severityFromString = severityFromString;
//# sourceMappingURL=severity.js.map

/***/ }),

/***/ 47129:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(89479);
var STACKTRACE_LIMIT = 50;
/**
 * Creates a stack parser with the supplied line parsers
 *
 * StackFrames are returned in the correct order for Sentry Exception
 * frames and with Sentry SDK internal frames removed from the top and bottom
 *
 */
function createStackParser() {
    var parsers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parsers[_i] = arguments[_i];
    }
    var sortedParsers = parsers.sort(function (a, b) { return a[0] - b[0]; }).map(function (p) { return p[1]; });
    return function (stack, skipFirst) {
        var e_1, _a, e_2, _b;
        if (skipFirst === void 0) { skipFirst = 0; }
        var frames = [];
        try {
            for (var _c = tslib_1.__values(stack.split('\n').slice(skipFirst)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var line = _d.value;
                try {
                    for (var sortedParsers_1 = (e_2 = void 0, tslib_1.__values(sortedParsers)), sortedParsers_1_1 = sortedParsers_1.next(); !sortedParsers_1_1.done; sortedParsers_1_1 = sortedParsers_1.next()) {
                        var parser = sortedParsers_1_1.value;
                        var frame = parser(line);
                        if (frame) {
                            frames.push(frame);
                            break;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (sortedParsers_1_1 && !sortedParsers_1_1.done && (_b = sortedParsers_1.return)) _b.call(sortedParsers_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return stripSentryFramesAndReverse(frames);
    };
}
exports.createStackParser = createStackParser;
/**
 * @hidden
 */
function stripSentryFramesAndReverse(stack) {
    if (!stack.length) {
        return [];
    }
    var localStack = stack;
    var firstFrameFunction = localStack[0].function || '';
    var lastFrameFunction = localStack[localStack.length - 1].function || '';
    // If stack starts with one of our API calls, remove it (starts, meaning it's the top of the stack - aka last call)
    if (firstFrameFunction.indexOf('captureMessage') !== -1 || firstFrameFunction.indexOf('captureException') !== -1) {
        localStack = localStack.slice(1);
    }
    // If stack ends with one of our internal API calls, remove it (ends, meaning it's the bottom of the stack - aka top-most call)
    if (lastFrameFunction.indexOf('sentryWrapped') !== -1) {
        localStack = localStack.slice(0, -1);
    }
    // The frame where the crash happened, should be the last entry in the array
    return localStack
        .slice(0, STACKTRACE_LIMIT)
        .map(function (frame) { return (tslib_1.__assign(tslib_1.__assign({}, frame), { filename: frame.filename || localStack[0].filename, function: frame.function || '?' })); })
        .reverse();
}
exports.stripSentryFramesAndReverse = stripSentryFramesAndReverse;
var defaultFunctionName = '<anonymous>';
/**
 * Safely extract function name from itself
 */
function getFunctionName(fn) {
    try {
        if (!fn || typeof fn !== 'function') {
            return defaultFunctionName;
        }
        return fn.name || defaultFunctionName;
    }
    catch (e) {
        // Just accessing custom props in some Selenium environments
        // can cause a "Permission denied" exception (see raven-js#495).
        return defaultFunctionName;
    }
}
exports.getFunctionName = getFunctionName;
//# sourceMappingURL=stacktrace.js.map

/***/ }),

/***/ 60966:
/***/ ((__unused_webpack_module, exports) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Converts an HTTP status code to sentry status {@link EventStatus}.
 *
 * @param code number HTTP status code
 * @returns EventStatus
 */
function eventStatusFromHttpCode(code) {
    if (code >= 200 && code < 300) {
        return 'success';
    }
    if (code === 429) {
        return 'rate_limit';
    }
    if (code >= 400 && code < 500) {
        return 'invalid';
    }
    if (code >= 500) {
        return 'failed';
    }
    return 'unknown';
}
exports.eventStatusFromHttpCode = eventStatusFromHttpCode;
//# sourceMappingURL=status.js.map

/***/ }),

/***/ 83409:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var is_1 = __webpack_require__(70124);
/**
 * Truncates given string to the maximum characters count
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string (0 = unlimited)
 * @returns string Encoded
 */
function truncate(str, max) {
    if (max === void 0) { max = 0; }
    if (typeof str !== 'string' || max === 0) {
        return str;
    }
    return str.length <= max ? str : str.substr(0, max) + "...";
}
exports.truncate = truncate;
/**
 * This is basically just `trim_line` from
 * https://github.com/getsentry/sentry/blob/master/src/sentry/lang/javascript/processor.py#L67
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string
 * @returns string Encoded
 */
function snipLine(line, colno) {
    var newLine = line;
    var lineLength = newLine.length;
    if (lineLength <= 150) {
        return newLine;
    }
    if (colno > lineLength) {
        // eslint-disable-next-line no-param-reassign
        colno = lineLength;
    }
    var start = Math.max(colno - 60, 0);
    if (start < 5) {
        start = 0;
    }
    var end = Math.min(start + 140, lineLength);
    if (end > lineLength - 5) {
        end = lineLength;
    }
    if (end === lineLength) {
        start = Math.max(end - 140, 0);
    }
    newLine = newLine.slice(start, end);
    if (start > 0) {
        newLine = "'{snip} " + newLine;
    }
    if (end < lineLength) {
        newLine += ' {snip}';
    }
    return newLine;
}
exports.snipLine = snipLine;
/**
 * Join values in array
 * @param input array of values to be joined together
 * @param delimiter string to be placed in-between values
 * @returns Joined values
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeJoin(input, delimiter) {
    if (!Array.isArray(input)) {
        return '';
    }
    var output = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (var i = 0; i < input.length; i++) {
        var value = input[i];
        try {
            output.push(String(value));
        }
        catch (e) {
            output.push('[value cannot be serialized]');
        }
    }
    return output.join(delimiter);
}
exports.safeJoin = safeJoin;
/**
 * Checks if the value matches a regex or includes the string
 * @param value The string value to be checked against
 * @param pattern Either a regex or a string that must be contained in value
 */
function isMatchingPattern(value, pattern) {
    if (!is_1.isString(value)) {
        return false;
    }
    if (is_1.isRegExp(pattern)) {
        return pattern.test(value);
    }
    if (typeof pattern === 'string') {
        return value.indexOf(pattern) !== -1;
    }
    return false;
}
exports.isMatchingPattern = isMatchingPattern;
/**
 * Given a string, escape characters which have meaning in the regex grammar, such that the result is safe to feed to
 * `new RegExp()`.
 *
 * Based on https://github.com/sindresorhus/escape-string-regexp. Vendored to a) reduce the size by skipping the runtime
 * type-checking, and b) ensure it gets down-compiled for old versions of Node (the published package only supports Node
 * 12+).
 *
 * @param regexString The string to escape
 * @returns An version of the string with all special regex characters escaped
 */
function escapeStringForRegex(regexString) {
    // escape the hyphen separately so we can also replace it with a unicode literal hyphen, to avoid the problems
    // discussed in https://github.com/sindresorhus/escape-string-regexp/issues/20.
    return regexString.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}
exports.escapeStringForRegex = escapeStringForRegex;
//# sourceMappingURL=string.js.map

/***/ }),

/***/ 6004:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var flags_1 = __webpack_require__(19781);
var global_1 = __webpack_require__(53119);
var logger_1 = __webpack_require__(93168);
/**
 * Tells whether current environment supports ErrorEvent objects
 * {@link supportsErrorEvent}.
 *
 * @returns Answer to the given question.
 */
function supportsErrorEvent() {
    try {
        new ErrorEvent('');
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.supportsErrorEvent = supportsErrorEvent;
/**
 * Tells whether current environment supports DOMError objects
 * {@link supportsDOMError}.
 *
 * @returns Answer to the given question.
 */
function supportsDOMError() {
    try {
        // Chrome: VM89:1 Uncaught TypeError: Failed to construct 'DOMError':
        // 1 argument required, but only 0 present.
        // @ts-ignore It really needs 1 argument, not 0.
        new DOMError('');
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.supportsDOMError = supportsDOMError;
/**
 * Tells whether current environment supports DOMException objects
 * {@link supportsDOMException}.
 *
 * @returns Answer to the given question.
 */
function supportsDOMException() {
    try {
        new DOMException('');
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.supportsDOMException = supportsDOMException;
/**
 * Tells whether current environment supports Fetch API
 * {@link supportsFetch}.
 *
 * @returns Answer to the given question.
 */
function supportsFetch() {
    if (!('fetch' in global_1.getGlobalObject())) {
        return false;
    }
    try {
        new Headers();
        new Request('');
        new Response();
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.supportsFetch = supportsFetch;
/**
 * isNativeFetch checks if the given function is a native implementation of fetch()
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function isNativeFetch(func) {
    return func && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
}
exports.isNativeFetch = isNativeFetch;
/**
 * Tells whether current environment supports Fetch API natively
 * {@link supportsNativeFetch}.
 *
 * @returns true if `window.fetch` is natively implemented, false otherwise
 */
function supportsNativeFetch() {
    if (!supportsFetch()) {
        return false;
    }
    var global = global_1.getGlobalObject();
    // Fast path to avoid DOM I/O
    // eslint-disable-next-line @typescript-eslint/unbound-method
    if (isNativeFetch(global.fetch)) {
        return true;
    }
    // window.fetch is implemented, but is polyfilled or already wrapped (e.g: by a chrome extension)
    // so create a "pure" iframe to see if that has native fetch
    var result = false;
    var doc = global.document;
    // eslint-disable-next-line deprecation/deprecation
    if (doc && typeof doc.createElement === 'function') {
        try {
            var sandbox = doc.createElement('iframe');
            sandbox.hidden = true;
            doc.head.appendChild(sandbox);
            if (sandbox.contentWindow && sandbox.contentWindow.fetch) {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                result = isNativeFetch(sandbox.contentWindow.fetch);
            }
            doc.head.removeChild(sandbox);
        }
        catch (err) {
            flags_1.IS_DEBUG_BUILD &&
                logger_1.logger.warn('Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ', err);
        }
    }
    return result;
}
exports.supportsNativeFetch = supportsNativeFetch;
/**
 * Tells whether current environment supports ReportingObserver API
 * {@link supportsReportingObserver}.
 *
 * @returns Answer to the given question.
 */
function supportsReportingObserver() {
    return 'ReportingObserver' in global_1.getGlobalObject();
}
exports.supportsReportingObserver = supportsReportingObserver;
/**
 * Tells whether current environment supports Referrer Policy API
 * {@link supportsReferrerPolicy}.
 *
 * @returns Answer to the given question.
 */
function supportsReferrerPolicy() {
    // Despite all stars in the sky saying that Edge supports old draft syntax, aka 'never', 'always', 'origin' and 'default'
    // (see https://caniuse.com/#feat=referrer-policy),
    // it doesn't. And it throws an exception instead of ignoring this parameter...
    // REF: https://github.com/getsentry/raven-js/issues/1233
    if (!supportsFetch()) {
        return false;
    }
    try {
        new Request('_', {
            referrerPolicy: 'origin',
        });
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.supportsReferrerPolicy = supportsReferrerPolicy;
/**
 * Tells whether current environment supports History API
 * {@link supportsHistory}.
 *
 * @returns Answer to the given question.
 */
function supportsHistory() {
    // NOTE: in Chrome App environment, touching history.pushState, *even inside
    //       a try/catch block*, will cause Chrome to output an error to console.error
    // borrowed from: https://github.com/angular/angular.js/pull/13945/files
    var global = global_1.getGlobalObject();
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var chrome = global.chrome;
    var isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    var hasHistoryApi = 'history' in global && !!global.history.pushState && !!global.history.replaceState;
    return !isChromePackagedApp && hasHistoryApi;
}
exports.supportsHistory = supportsHistory;
//# sourceMappingURL=supports.js.map

/***/ }),

/***/ 19934:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
var is_1 = __webpack_require__(70124);
/**
 * Creates a resolved sync promise.
 *
 * @param value the value to resolve the promise with
 * @returns the resolved sync promise
 */
function resolvedSyncPromise(value) {
    return new SyncPromise(function (resolve) {
        resolve(value);
    });
}
exports.resolvedSyncPromise = resolvedSyncPromise;
/**
 * Creates a rejected sync promise.
 *
 * @param value the value to reject the promise with
 * @returns the rejected sync promise
 */
function rejectedSyncPromise(reason) {
    return new SyncPromise(function (_, reject) {
        reject(reason);
    });
}
exports.rejectedSyncPromise = rejectedSyncPromise;
/**
 * Thenable class that behaves like a Promise and follows it's interface
 * but is not async internally
 */
var SyncPromise = /** @class */ (function () {
    function SyncPromise(executor) {
        var _this = this;
        this._state = 0 /* PENDING */;
        this._handlers = [];
        /** JSDoc */
        this._resolve = function (value) {
            _this._setResult(1 /* RESOLVED */, value);
        };
        /** JSDoc */
        this._reject = function (reason) {
            _this._setResult(2 /* REJECTED */, reason);
        };
        /** JSDoc */
        this._setResult = function (state, value) {
            if (_this._state !== 0 /* PENDING */) {
                return;
            }
            if (is_1.isThenable(value)) {
                void value.then(_this._resolve, _this._reject);
                return;
            }
            _this._state = state;
            _this._value = value;
            _this._executeHandlers();
        };
        /** JSDoc */
        this._executeHandlers = function () {
            if (_this._state === 0 /* PENDING */) {
                return;
            }
            var cachedHandlers = _this._handlers.slice();
            _this._handlers = [];
            cachedHandlers.forEach(function (handler) {
                if (handler[0]) {
                    return;
                }
                if (_this._state === 1 /* RESOLVED */) {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    handler[1](_this._value);
                }
                if (_this._state === 2 /* REJECTED */) {
                    handler[2](_this._value);
                }
                handler[0] = true;
            });
        };
        try {
            executor(this._resolve, this._reject);
        }
        catch (e) {
            this._reject(e);
        }
    }
    /** JSDoc */
    SyncPromise.prototype.then = function (onfulfilled, onrejected) {
        var _this = this;
        return new SyncPromise(function (resolve, reject) {
            _this._handlers.push([
                false,
                function (result) {
                    if (!onfulfilled) {
                        // TODO: ¯\_(ツ)_/¯
                        // TODO: FIXME
                        resolve(result);
                    }
                    else {
                        try {
                            resolve(onfulfilled(result));
                        }
                        catch (e) {
                            reject(e);
                        }
                    }
                },
                function (reason) {
                    if (!onrejected) {
                        reject(reason);
                    }
                    else {
                        try {
                            resolve(onrejected(reason));
                        }
                        catch (e) {
                            reject(e);
                        }
                    }
                },
            ]);
            _this._executeHandlers();
        });
    };
    /** JSDoc */
    SyncPromise.prototype.catch = function (onrejected) {
        return this.then(function (val) { return val; }, onrejected);
    };
    /** JSDoc */
    SyncPromise.prototype.finally = function (onfinally) {
        var _this = this;
        return new SyncPromise(function (resolve, reject) {
            var val;
            var isRejected;
            return _this.then(function (value) {
                isRejected = false;
                val = value;
                if (onfinally) {
                    onfinally();
                }
            }, function (reason) {
                isRejected = true;
                val = reason;
                if (onfinally) {
                    onfinally();
                }
            }).then(function () {
                if (isRejected) {
                    reject(val);
                    return;
                }
                resolve(val);
            });
        });
    };
    return SyncPromise;
}());
exports.SyncPromise = SyncPromise;
//# sourceMappingURL=syncpromise.js.map

/***/ }),

/***/ 83485:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
Object.defineProperty(exports, "__esModule", ({ value: true }));
var global_1 = __webpack_require__(53119);
var node_1 = __webpack_require__(98016);
/**
 * A TimestampSource implementation for environments that do not support the Performance Web API natively.
 *
 * Note that this TimestampSource does not use a monotonic clock. A call to `nowSeconds` may return a timestamp earlier
 * than a previously returned value. We do not try to emulate a monotonic behavior in order to facilitate debugging. It
 * is more obvious to explain "why does my span have negative duration" than "why my spans have zero duration".
 */
var dateTimestampSource = {
    nowSeconds: function () { return Date.now() / 1000; },
};
/**
 * Returns a wrapper around the native Performance API browser implementation, or undefined for browsers that do not
 * support the API.
 *
 * Wrapping the native API works around differences in behavior from different browsers.
 */
function getBrowserPerformance() {
    var performance = global_1.getGlobalObject().performance;
    if (!performance || !performance.now) {
        return undefined;
    }
    // Replace performance.timeOrigin with our own timeOrigin based on Date.now().
    //
    // This is a partial workaround for browsers reporting performance.timeOrigin such that performance.timeOrigin +
    // performance.now() gives a date arbitrarily in the past.
    //
    // Additionally, computing timeOrigin in this way fills the gap for browsers where performance.timeOrigin is
    // undefined.
    //
    // The assumption that performance.timeOrigin + performance.now() ~= Date.now() is flawed, but we depend on it to
    // interact with data coming out of performance entries.
    //
    // Note that despite recommendations against it in the spec, browsers implement the Performance API with a clock that
    // might stop when the computer is asleep (and perhaps under other circumstances). Such behavior causes
    // performance.timeOrigin + performance.now() to have an arbitrary skew over Date.now(). In laptop computers, we have
    // observed skews that can be as long as days, weeks or months.
    //
    // See https://github.com/getsentry/sentry-javascript/issues/2590.
    //
    // BUG: despite our best intentions, this workaround has its limitations. It mostly addresses timings of pageload
    // transactions, but ignores the skew built up over time that can aversely affect timestamps of navigation
    // transactions of long-lived web pages.
    var timeOrigin = Date.now() - performance.now();
    return {
        now: function () { return performance.now(); },
        timeOrigin: timeOrigin,
    };
}
/**
 * Returns the native Performance API implementation from Node.js. Returns undefined in old Node.js versions that don't
 * implement the API.
 */
function getNodePerformance() {
    try {
        var perfHooks = node_1.dynamicRequire(module, 'perf_hooks');
        return perfHooks.performance;
    }
    catch (_) {
        return undefined;
    }
}
/**
 * The Performance API implementation for the current platform, if available.
 */
var platformPerformance = node_1.isNodeEnv() ? getNodePerformance() : getBrowserPerformance();
var timestampSource = platformPerformance === undefined
    ? dateTimestampSource
    : {
        nowSeconds: function () { return (platformPerformance.timeOrigin + platformPerformance.now()) / 1000; },
    };
/**
 * Returns a timestamp in seconds since the UNIX epoch using the Date API.
 */
exports.dateTimestampInSeconds = dateTimestampSource.nowSeconds.bind(dateTimestampSource);
/**
 * Returns a timestamp in seconds since the UNIX epoch using either the Performance or Date APIs, depending on the
 * availability of the Performance API.
 *
 * See `usingPerformanceAPI` to test whether the Performance API is used.
 *
 * BUG: Note that because of how browsers implement the Performance API, the clock might stop when the computer is
 * asleep. This creates a skew between `dateTimestampInSeconds` and `timestampInSeconds`. The
 * skew can grow to arbitrary amounts like days, weeks or months.
 * See https://github.com/getsentry/sentry-javascript/issues/2590.
 */
exports.timestampInSeconds = timestampSource.nowSeconds.bind(timestampSource);
// Re-exported with an old name for backwards-compatibility.
exports.timestampWithMs = exports.timestampInSeconds;
/**
 * A boolean that is true when timestampInSeconds uses the Performance API to produce monotonic timestamps.
 */
exports.usingPerformanceAPI = platformPerformance !== undefined;
/**
 * The number of milliseconds since the UNIX epoch. This value is only usable in a browser, and only when the
 * performance API is available.
 */
exports.browserPerformanceTimeOrigin = (function () {
    // Unfortunately browsers may report an inaccurate time origin data, through either performance.timeOrigin or
    // performance.timing.navigationStart, which results in poor results in performance data. We only treat time origin
    // data as reliable if they are within a reasonable threshold of the current time.
    var performance = global_1.getGlobalObject().performance;
    if (!performance || !performance.now) {
        exports._browserPerformanceTimeOriginMode = 'none';
        return undefined;
    }
    var threshold = 3600 * 1000;
    var performanceNow = performance.now();
    var dateNow = Date.now();
    // if timeOrigin isn't available set delta to threshold so it isn't used
    var timeOriginDelta = performance.timeOrigin
        ? Math.abs(performance.timeOrigin + performanceNow - dateNow)
        : threshold;
    var timeOriginIsReliable = timeOriginDelta < threshold;
    // While performance.timing.navigationStart is deprecated in favor of performance.timeOrigin, performance.timeOrigin
    // is not as widely supported. Namely, performance.timeOrigin is undefined in Safari as of writing.
    // Also as of writing, performance.timing is not available in Web Workers in mainstream browsers, so it is not always
    // a valid fallback. In the absence of an initial time provided by the browser, fallback to the current time from the
    // Date API.
    // eslint-disable-next-line deprecation/deprecation
    var navigationStart = performance.timing && performance.timing.navigationStart;
    var hasNavigationStart = typeof navigationStart === 'number';
    // if navigationStart isn't available set delta to threshold so it isn't used
    var navigationStartDelta = hasNavigationStart ? Math.abs(navigationStart + performanceNow - dateNow) : threshold;
    var navigationStartIsReliable = navigationStartDelta < threshold;
    if (timeOriginIsReliable || navigationStartIsReliable) {
        // Use the more reliable time origin
        if (timeOriginDelta <= navigationStartDelta) {
            exports._browserPerformanceTimeOriginMode = 'timeOrigin';
            return performance.timeOrigin;
        }
        else {
            exports._browserPerformanceTimeOriginMode = 'navigationStart';
            return navigationStart;
        }
    }
    // Either both timeOrigin and navigationStart are skewed or neither is available, fallback to Date.
    exports._browserPerformanceTimeOriginMode = 'dateNow';
    return dateNow;
})();
//# sourceMappingURL=time.js.map

/***/ }),

/***/ 71328:
/***/ ((__unused_webpack_module, exports) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TRACEPARENT_REGEXP = new RegExp('^[ \\t]*' + // whitespace
    '([0-9a-f]{32})?' + // trace_id
    '-?([0-9a-f]{16})?' + // span_id
    '-?([01])?' + // sampled
    '[ \\t]*$');
/**
 * Extract transaction context data from a `sentry-trace` header.
 *
 * @param traceparent Traceparent string
 *
 * @returns Object containing data from the header, or undefined if traceparent string is malformed
 */
function extractTraceparentData(traceparent) {
    var matches = traceparent.match(exports.TRACEPARENT_REGEXP);
    if (matches) {
        var parentSampled = void 0;
        if (matches[3] === '1') {
            parentSampled = true;
        }
        else if (matches[3] === '0') {
            parentSampled = false;
        }
        return {
            traceId: matches[1],
            parentSampled: parentSampled,
            parentSpanId: matches[2],
        };
    }
    return undefined;
}
exports.extractTraceparentData = extractTraceparentData;
//# sourceMappingURL=tracing.js.map

/***/ }),

/***/ 89479:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
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

    __createBinding = function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    };

    __exportStar = function (m, exports) {
        for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
    };

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result["default"] = mod;
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 3814:
/***/ ((__unused_webpack_module, exports) => {

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

exports.parse = parse;
exports.serialize = serialize;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var encode = encodeURIComponent;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {}
  var opt = options || {};
  var pairs = str.split(';')
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var index = pair.indexOf('=')

    // skip things that don't look like key=value
    if (index < 0) {
      continue;
    }

    var key = pair.substring(0, index).trim()

    // only assign once
    if (undefined == obj[key]) {
      var val = pair.substring(index + 1, pair.length).trim()

      // quoted values
      if (val[0] === '"') {
        val = val.slice(1, -1)
      }

      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid')
    }

    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}


/***/ }),

/***/ 74151:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(58634);
var SENTRY_API_VERSION = '7';
/**
 * Helper class to provide urls, headers and metadata that can be used to form
 * different types of requests to Sentry endpoints.
 * Supports both envelopes and regular event requests.
 *
 * @deprecated Please use APIDetails
 **/
var API = /** @class */ (function () {
    /** Create a new instance of API */
    function API(dsn, metadata, tunnel) {
        if (metadata === void 0) { metadata = {}; }
        this.dsn = dsn;
        this._dsnObject = utils_1.makeDsn(dsn);
        this.metadata = metadata;
        this._tunnel = tunnel;
    }
    /** Returns the Dsn object. */
    API.prototype.getDsn = function () {
        return this._dsnObject;
    };
    /** Does this transport force envelopes? */
    API.prototype.forceEnvelope = function () {
        return !!this._tunnel;
    };
    /** Returns the prefix to construct Sentry ingestion API endpoints. */
    API.prototype.getBaseApiEndpoint = function () {
        return getBaseApiEndpoint(this._dsnObject);
    };
    /** Returns the store endpoint URL. */
    API.prototype.getStoreEndpoint = function () {
        return getStoreEndpoint(this._dsnObject);
    };
    /**
     * Returns the store endpoint URL with auth in the query string.
     *
     * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
     */
    API.prototype.getStoreEndpointWithUrlEncodedAuth = function () {
        return getStoreEndpointWithUrlEncodedAuth(this._dsnObject);
    };
    /**
     * Returns the envelope endpoint URL with auth in the query string.
     *
     * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
     */
    API.prototype.getEnvelopeEndpointWithUrlEncodedAuth = function () {
        return getEnvelopeEndpointWithUrlEncodedAuth(this._dsnObject, this._tunnel);
    };
    return API;
}());
exports.API = API;
/** Initializes API Details */
function initAPIDetails(dsn, metadata, tunnel) {
    return {
        initDsn: dsn,
        metadata: metadata || {},
        dsn: utils_1.makeDsn(dsn),
        tunnel: tunnel,
    };
}
exports.initAPIDetails = initAPIDetails;
/** Returns the prefix to construct Sentry ingestion API endpoints. */
function getBaseApiEndpoint(dsn) {
    var protocol = dsn.protocol ? dsn.protocol + ":" : '';
    var port = dsn.port ? ":" + dsn.port : '';
    return protocol + "//" + dsn.host + port + (dsn.path ? "/" + dsn.path : '') + "/api/";
}
/** Returns the ingest API endpoint for target. */
function _getIngestEndpoint(dsn, target) {
    return "" + getBaseApiEndpoint(dsn) + dsn.projectId + "/" + target + "/";
}
/** Returns a URL-encoded string with auth config suitable for a query string. */
function _encodedAuth(dsn) {
    return utils_1.urlEncode({
        // We send only the minimum set of required information. See
        // https://github.com/getsentry/sentry-javascript/issues/2572.
        sentry_key: dsn.publicKey,
        sentry_version: SENTRY_API_VERSION,
    });
}
/** Returns the store endpoint URL. */
function getStoreEndpoint(dsn) {
    return _getIngestEndpoint(dsn, 'store');
}
/**
 * Returns the store endpoint URL with auth in the query string.
 *
 * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
 */
function getStoreEndpointWithUrlEncodedAuth(dsn) {
    return getStoreEndpoint(dsn) + "?" + _encodedAuth(dsn);
}
exports.getStoreEndpointWithUrlEncodedAuth = getStoreEndpointWithUrlEncodedAuth;
/** Returns the envelope endpoint URL. */
function _getEnvelopeEndpoint(dsn) {
    return _getIngestEndpoint(dsn, 'envelope');
}
/**
 * Returns the envelope endpoint URL with auth in the query string.
 *
 * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
 */
function getEnvelopeEndpointWithUrlEncodedAuth(dsn, tunnel) {
    return tunnel ? tunnel : _getEnvelopeEndpoint(dsn) + "?" + _encodedAuth(dsn);
}
exports.getEnvelopeEndpointWithUrlEncodedAuth = getEnvelopeEndpointWithUrlEncodedAuth;
/**
 * Returns an object that can be used in request headers.
 * This is needed for node and the old /store endpoint in sentry
 */
function getRequestHeaders(dsn, clientName, clientVersion) {
    // CHANGE THIS to use metadata but keep clientName and clientVersion compatible
    var header = ["Sentry sentry_version=" + SENTRY_API_VERSION];
    header.push("sentry_client=" + clientName + "/" + clientVersion);
    header.push("sentry_key=" + dsn.publicKey);
    if (dsn.pass) {
        header.push("sentry_secret=" + dsn.pass);
    }
    return {
        'Content-Type': 'application/json',
        'X-Sentry-Auth': header.join(', '),
    };
}
exports.getRequestHeaders = getRequestHeaders;
/** Returns the url to the report dialog endpoint. */
function getReportDialogEndpoint(dsnLike, dialogOptions) {
    var dsn = utils_1.makeDsn(dsnLike);
    var endpoint = getBaseApiEndpoint(dsn) + "embed/error-page/";
    var encodedOptions = "dsn=" + utils_1.dsnToString(dsn);
    for (var key in dialogOptions) {
        if (key === 'dsn') {
            continue;
        }
        if (key === 'user') {
            if (!dialogOptions.user) {
                continue;
            }
            if (dialogOptions.user.name) {
                encodedOptions += "&name=" + encodeURIComponent(dialogOptions.user.name);
            }
            if (dialogOptions.user.email) {
                encodedOptions += "&email=" + encodeURIComponent(dialogOptions.user.email);
            }
        }
        else {
            encodedOptions += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(dialogOptions[key]);
        }
    }
    return endpoint + "?" + encodedOptions;
}
exports.getReportDialogEndpoint = getReportDialogEndpoint;
//# sourceMappingURL=api.js.map

/***/ }),

/***/ 21380:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var utils_1 = __webpack_require__(58634);
var api_1 = __webpack_require__(74151);
var flags_1 = __webpack_require__(12888);
var request_1 = __webpack_require__(1938);
var noop_1 = __webpack_require__(44632);
/**
 * This is the base implemention of a Backend.
 * @hidden
 */
var BaseBackend = /** @class */ (function () {
    /** Creates a new backend instance. */
    function BaseBackend(options) {
        this._options = options;
        if (!this._options.dsn) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('No DSN provided, backend will not do anything.');
        }
        this._transport = this._setupTransport();
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    BaseBackend.prototype.eventFromException = function (_exception, _hint) {
        throw new utils_1.SentryError('Backend has to implement `eventFromException` method');
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.eventFromMessage = function (_message, _level, _hint) {
        throw new utils_1.SentryError('Backend has to implement `eventFromMessage` method');
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.sendEvent = function (event) {
        // TODO(v7): Remove the if-else
        if (this._newTransport &&
            this._options.dsn &&
            this._options._experiments &&
            this._options._experiments.newTransport) {
            var api = api_1.initAPIDetails(this._options.dsn, this._options._metadata, this._options.tunnel);
            var env = request_1.createEventEnvelope(event, api);
            void this._newTransport.send(env).then(null, function (reason) {
                flags_1.IS_DEBUG_BUILD && utils_1.logger.error('Error while sending event:', reason);
            });
        }
        else {
            void this._transport.sendEvent(event).then(null, function (reason) {
                flags_1.IS_DEBUG_BUILD && utils_1.logger.error('Error while sending event:', reason);
            });
        }
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.sendSession = function (session) {
        if (!this._transport.sendSession) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn("Dropping session because custom transport doesn't implement sendSession");
            return;
        }
        // TODO(v7): Remove the if-else
        if (this._newTransport &&
            this._options.dsn &&
            this._options._experiments &&
            this._options._experiments.newTransport) {
            var api = api_1.initAPIDetails(this._options.dsn, this._options._metadata, this._options.tunnel);
            var _a = tslib_1.__read(request_1.createSessionEnvelope(session, api), 1), env = _a[0];
            void this._newTransport.send(env).then(null, function (reason) {
                flags_1.IS_DEBUG_BUILD && utils_1.logger.error('Error while sending session:', reason);
            });
        }
        else {
            void this._transport.sendSession(session).then(null, function (reason) {
                flags_1.IS_DEBUG_BUILD && utils_1.logger.error('Error while sending session:', reason);
            });
        }
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.getTransport = function () {
        return this._transport;
    };
    /**
     * Sets up the transport so it can be used later to send requests.
     */
    BaseBackend.prototype._setupTransport = function () {
        return new noop_1.NoopTransport();
    };
    return BaseBackend;
}());
exports.BaseBackend = BaseBackend;
//# sourceMappingURL=basebackend.js.map

/***/ }),

/***/ 78417:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
/* eslint-disable max-lines */
var hub_1 = __webpack_require__(14044);
var utils_1 = __webpack_require__(58634);
var flags_1 = __webpack_require__(12888);
var integration_1 = __webpack_require__(4181);
var ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.";
/**
 * Base implementation for all JavaScript SDK clients.
 *
 * Call the constructor with the corresponding backend constructor and options
 * specific to the client subclass. To access these options later, use
 * {@link Client.getOptions}. Also, the Backend instance is available via
 * {@link Client.getBackend}.
 *
 * If a Dsn is specified in the options, it will be parsed and stored. Use
 * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is
 * invalid, the constructor will throw a {@link SentryException}. Note that
 * without a valid Dsn, the SDK will not send any events to Sentry.
 *
 * Before sending an event via the backend, it is passed through
 * {@link BaseClient._prepareEvent} to add SDK information and scope data
 * (breadcrumbs and context). To add more custom information, override this
 * method and extend the resulting prepared event.
 *
 * To issue automatically created events (e.g. via instrumentation), use
 * {@link Client.captureEvent}. It will prepare the event and pass it through
 * the callback lifecycle. To issue auto-breadcrumbs, use
 * {@link Client.addBreadcrumb}.
 *
 * @example
 * class NodeClient extends BaseClient<NodeBackend, NodeOptions> {
 *   public constructor(options: NodeOptions) {
 *     super(NodeBackend, options);
 *   }
 *
 *   // ...
 * }
 */
var BaseClient = /** @class */ (function () {
    /**
     * Initializes this client instance.
     *
     * @param backendClass A constructor function to create the backend.
     * @param options Options for the client.
     */
    function BaseClient(backendClass, options) {
        /** Array of used integrations. */
        this._integrations = {};
        /** Number of calls being processed */
        this._numProcessing = 0;
        this._backend = new backendClass(options);
        this._options = options;
        if (options.dsn) {
            this._dsn = utils_1.makeDsn(options.dsn);
        }
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    BaseClient.prototype.captureException = function (exception, hint, scope) {
        var _this = this;
        // ensure we haven't captured this very object before
        if (utils_1.checkOrSetAlreadyCaught(exception)) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.log(ALREADY_SEEN_ERROR);
            return;
        }
        var eventId = hint && hint.event_id;
        this._process(this._getBackend()
            .eventFromException(exception, hint)
            .then(function (event) { return _this._captureEvent(event, hint, scope); })
            .then(function (result) {
            eventId = result;
        }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureMessage = function (message, level, hint, scope) {
        var _this = this;
        var eventId = hint && hint.event_id;
        var promisedEvent = utils_1.isPrimitive(message)
            ? this._getBackend().eventFromMessage(String(message), level, hint)
            : this._getBackend().eventFromException(message, hint);
        this._process(promisedEvent
            .then(function (event) { return _this._captureEvent(event, hint, scope); })
            .then(function (result) {
            eventId = result;
        }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureEvent = function (event, hint, scope) {
        // ensure we haven't captured this very object before
        if (hint && hint.originalException && utils_1.checkOrSetAlreadyCaught(hint.originalException)) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.log(ALREADY_SEEN_ERROR);
            return;
        }
        var eventId = hint && hint.event_id;
        this._process(this._captureEvent(event, hint, scope).then(function (result) {
            eventId = result;
        }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureSession = function (session) {
        if (!this._isEnabled()) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('SDK not enabled, will not capture session.');
            return;
        }
        if (!(typeof session.release === 'string')) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('Discarded session because of missing or non-string release');
        }
        else {
            this._sendSession(session);
            // After sending, we set init false to indicate it's not the first occurrence
            session.update({ init: false });
        }
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getDsn = function () {
        return this._dsn;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getOptions = function () {
        return this._options;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getTransport = function () {
        return this._getBackend().getTransport();
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.flush = function (timeout) {
        var _this = this;
        return this._isClientDoneProcessing(timeout).then(function (clientFinished) {
            return _this.getTransport()
                .close(timeout)
                .then(function (transportFlushed) { return clientFinished && transportFlushed; });
        });
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.close = function (timeout) {
        var _this = this;
        return this.flush(timeout).then(function (result) {
            _this.getOptions().enabled = false;
            return result;
        });
    };
    /**
     * Sets up the integrations
     */
    BaseClient.prototype.setupIntegrations = function () {
        if (this._isEnabled() && !this._integrations.initialized) {
            this._integrations = integration_1.setupIntegrations(this._options);
        }
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getIntegration = function (integration) {
        try {
            return this._integrations[integration.id] || null;
        }
        catch (_oO) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn("Cannot retrieve integration " + integration.id + " from the current Client");
            return null;
        }
    };
    /** Updates existing session based on the provided event */
    BaseClient.prototype._updateSessionFromEvent = function (session, event) {
        var e_1, _a;
        var crashed = false;
        var errored = false;
        var exceptions = event.exception && event.exception.values;
        if (exceptions) {
            errored = true;
            try {
                for (var exceptions_1 = tslib_1.__values(exceptions), exceptions_1_1 = exceptions_1.next(); !exceptions_1_1.done; exceptions_1_1 = exceptions_1.next()) {
                    var ex = exceptions_1_1.value;
                    var mechanism = ex.mechanism;
                    if (mechanism && mechanism.handled === false) {
                        crashed = true;
                        break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (exceptions_1_1 && !exceptions_1_1.done && (_a = exceptions_1.return)) _a.call(exceptions_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        // A session is updated and that session update is sent in only one of the two following scenarios:
        // 1. Session with non terminal status and 0 errors + an error occurred -> Will set error count to 1 and send update
        // 2. Session with non terminal status and 1 error + a crash occurred -> Will set status crashed and send update
        var sessionNonTerminal = session.status === 'ok';
        var shouldUpdateAndSend = (sessionNonTerminal && session.errors === 0) || (sessionNonTerminal && crashed);
        if (shouldUpdateAndSend) {
            session.update(tslib_1.__assign(tslib_1.__assign({}, (crashed && { status: 'crashed' })), { errors: session.errors || Number(errored || crashed) }));
            this.captureSession(session);
        }
    };
    /** Deliver captured session to Sentry */
    BaseClient.prototype._sendSession = function (session) {
        this._getBackend().sendSession(session);
    };
    /**
     * Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
     * "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
     *
     * @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
     * passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
     * `true`.
     * @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
     * `false` otherwise
     */
    BaseClient.prototype._isClientDoneProcessing = function (timeout) {
        var _this = this;
        return new utils_1.SyncPromise(function (resolve) {
            var ticked = 0;
            var tick = 1;
            var interval = setInterval(function () {
                if (_this._numProcessing == 0) {
                    clearInterval(interval);
                    resolve(true);
                }
                else {
                    ticked += tick;
                    if (timeout && ticked >= timeout) {
                        clearInterval(interval);
                        resolve(false);
                    }
                }
            }, tick);
        });
    };
    /** Returns the current backend. */
    BaseClient.prototype._getBackend = function () {
        return this._backend;
    };
    /** Determines whether this SDK is enabled and a valid Dsn is present. */
    BaseClient.prototype._isEnabled = function () {
        return this.getOptions().enabled !== false && this._dsn !== undefined;
    };
    /**
     * Adds common information to events.
     *
     * The information includes release and environment from `options`,
     * breadcrumbs and context (extra, tags and user) from the scope.
     *
     * Information that is already present in the event is never overwritten. For
     * nested objects, such as the context, keys are merged.
     *
     * @param event The original event.
     * @param hint May contain additional information about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A new event with more information.
     */
    BaseClient.prototype._prepareEvent = function (event, scope, hint) {
        var _this = this;
        var _a = this.getOptions(), _b = _a.normalizeDepth, normalizeDepth = _b === void 0 ? 3 : _b, _c = _a.normalizeMaxBreadth, normalizeMaxBreadth = _c === void 0 ? 1000 : _c;
        var prepared = tslib_1.__assign(tslib_1.__assign({}, event), { event_id: event.event_id || (hint && hint.event_id ? hint.event_id : utils_1.uuid4()), timestamp: event.timestamp || utils_1.dateTimestampInSeconds() });
        this._applyClientOptions(prepared);
        this._applyIntegrationsMetadata(prepared);
        // If we have scope given to us, use it as the base for further modifications.
        // This allows us to prevent unnecessary copying of data if `captureContext` is not provided.
        var finalScope = scope;
        if (hint && hint.captureContext) {
            finalScope = hub_1.Scope.clone(finalScope).update(hint.captureContext);
        }
        // We prepare the result here with a resolved Event.
        var result = utils_1.resolvedSyncPromise(prepared);
        // This should be the last thing called, since we want that
        // {@link Hub.addEventProcessor} gets the finished prepared event.
        if (finalScope) {
            // In case we have a hub we reassign it.
            result = finalScope.applyToEvent(prepared, hint);
        }
        return result.then(function (evt) {
            if (evt) {
                // TODO this is more of the hack trying to solve https://github.com/getsentry/sentry-javascript/issues/2809
                // it is only attached as extra data to the event if the event somehow skips being normalized
                evt.sdkProcessingMetadata = tslib_1.__assign(tslib_1.__assign({}, evt.sdkProcessingMetadata), { normalizeDepth: utils_1.normalize(normalizeDepth) + " (" + typeof normalizeDepth + ")" });
            }
            if (typeof normalizeDepth === 'number' && normalizeDepth > 0) {
                return _this._normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth);
            }
            return evt;
        });
    };
    /**
     * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.
     * Normalized keys:
     * - `breadcrumbs.data`
     * - `user`
     * - `contexts`
     * - `extra`
     * @param event Event
     * @returns Normalized event
     */
    BaseClient.prototype._normalizeEvent = function (event, depth, maxBreadth) {
        if (!event) {
            return null;
        }
        var normalized = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, event), (event.breadcrumbs && {
            breadcrumbs: event.breadcrumbs.map(function (b) { return (tslib_1.__assign(tslib_1.__assign({}, b), (b.data && {
                data: utils_1.normalize(b.data, depth, maxBreadth),
            }))); }),
        })), (event.user && {
            user: utils_1.normalize(event.user, depth, maxBreadth),
        })), (event.contexts && {
            contexts: utils_1.normalize(event.contexts, depth, maxBreadth),
        })), (event.extra && {
            extra: utils_1.normalize(event.extra, depth, maxBreadth),
        }));
        // event.contexts.trace stores information about a Transaction. Similarly,
        // event.spans[] stores information about child Spans. Given that a
        // Transaction is conceptually a Span, normalization should apply to both
        // Transactions and Spans consistently.
        // For now the decision is to skip normalization of Transactions and Spans,
        // so this block overwrites the normalized event to add back the original
        // Transaction information prior to normalization.
        if (event.contexts && event.contexts.trace) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            normalized.contexts.trace = event.contexts.trace;
        }
        normalized.sdkProcessingMetadata = tslib_1.__assign(tslib_1.__assign({}, normalized.sdkProcessingMetadata), { baseClientNormalized: true });
        return normalized;
    };
    /**
     *  Enhances event using the client configuration.
     *  It takes care of all "static" values like environment, release and `dist`,
     *  as well as truncating overly long values.
     * @param event event instance to be enhanced
     */
    BaseClient.prototype._applyClientOptions = function (event) {
        var options = this.getOptions();
        var environment = options.environment, release = options.release, dist = options.dist, _a = options.maxValueLength, maxValueLength = _a === void 0 ? 250 : _a;
        if (!('environment' in event)) {
            event.environment = 'environment' in options ? environment : 'production';
        }
        if (event.release === undefined && release !== undefined) {
            event.release = release;
        }
        if (event.dist === undefined && dist !== undefined) {
            event.dist = dist;
        }
        if (event.message) {
            event.message = utils_1.truncate(event.message, maxValueLength);
        }
        var exception = event.exception && event.exception.values && event.exception.values[0];
        if (exception && exception.value) {
            exception.value = utils_1.truncate(exception.value, maxValueLength);
        }
        var request = event.request;
        if (request && request.url) {
            request.url = utils_1.truncate(request.url, maxValueLength);
        }
    };
    /**
     * This function adds all used integrations to the SDK info in the event.
     * @param event The event that will be filled with all integrations.
     */
    BaseClient.prototype._applyIntegrationsMetadata = function (event) {
        var integrationsArray = Object.keys(this._integrations);
        if (integrationsArray.length > 0) {
            event.sdk = event.sdk || {};
            event.sdk.integrations = tslib_1.__spread((event.sdk.integrations || []), integrationsArray);
        }
    };
    /**
     * Tells the backend to send this event
     * @param event The Sentry event to send
     */
    BaseClient.prototype._sendEvent = function (event) {
        this._getBackend().sendEvent(event);
    };
    /**
     * Processes the event and logs an error in case of rejection
     * @param event
     * @param hint
     * @param scope
     */
    BaseClient.prototype._captureEvent = function (event, hint, scope) {
        return this._processEvent(event, hint, scope).then(function (finalEvent) {
            return finalEvent.event_id;
        }, function (reason) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.error(reason);
            return undefined;
        });
    };
    /**
     * Processes an event (either error or message) and sends it to Sentry.
     *
     * This also adds breadcrumbs and context information to the event. However,
     * platform specific meta data (such as the User's IP address) must be added
     * by the SDK implementor.
     *
     *
     * @param event The event to send to Sentry.
     * @param hint May contain additional information about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
     */
    BaseClient.prototype._processEvent = function (event, hint, scope) {
        var _this = this;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        var _a = this.getOptions(), beforeSend = _a.beforeSend, sampleRate = _a.sampleRate;
        var transport = this.getTransport();
        function recordLostEvent(outcome, category) {
            if (transport.recordLostEvent) {
                transport.recordLostEvent(outcome, category);
            }
        }
        if (!this._isEnabled()) {
            return utils_1.rejectedSyncPromise(new utils_1.SentryError('SDK not enabled, will not capture event.'));
        }
        var isTransaction = event.type === 'transaction';
        // 1.0 === 100% events are sent
        // 0.0 === 0% events are sent
        // Sampling for transaction happens somewhere else
        if (!isTransaction && typeof sampleRate === 'number' && Math.random() > sampleRate) {
            recordLostEvent('sample_rate', 'event');
            return utils_1.rejectedSyncPromise(new utils_1.SentryError("Discarding event because it's not included in the random sample (sampling rate = " + sampleRate + ")"));
        }
        return this._prepareEvent(event, scope, hint)
            .then(function (prepared) {
            if (prepared === null) {
                recordLostEvent('event_processor', event.type || 'event');
                throw new utils_1.SentryError('An event processor returned null, will not send event.');
            }
            var isInternalException = hint && hint.data && hint.data.__sentry__ === true;
            if (isInternalException || isTransaction || !beforeSend) {
                return prepared;
            }
            var beforeSendResult = beforeSend(prepared, hint);
            return _ensureBeforeSendRv(beforeSendResult);
        })
            .then(function (processedEvent) {
            if (processedEvent === null) {
                recordLostEvent('before_send', event.type || 'event');
                throw new utils_1.SentryError('`beforeSend` returned `null`, will not send event.');
            }
            var session = scope && scope.getSession && scope.getSession();
            if (!isTransaction && session) {
                _this._updateSessionFromEvent(session, processedEvent);
            }
            _this._sendEvent(processedEvent);
            return processedEvent;
        })
            .then(null, function (reason) {
            if (reason instanceof utils_1.SentryError) {
                throw reason;
            }
            _this.captureException(reason, {
                data: {
                    __sentry__: true,
                },
                originalException: reason,
            });
            throw new utils_1.SentryError("Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: " + reason);
        });
    };
    /**
     * Occupies the client with processing and event
     */
    BaseClient.prototype._process = function (promise) {
        var _this = this;
        this._numProcessing += 1;
        void promise.then(function (value) {
            _this._numProcessing -= 1;
            return value;
        }, function (reason) {
            _this._numProcessing -= 1;
            return reason;
        });
    };
    return BaseClient;
}());
exports.BaseClient = BaseClient;
/**
 * Verifies that return value of configured `beforeSend` is of expected type.
 */
function _ensureBeforeSendRv(rv) {
    var nullErr = '`beforeSend` method has to return `null` or a valid event.';
    if (utils_1.isThenable(rv)) {
        return rv.then(function (event) {
            if (!(utils_1.isPlainObject(event) || event === null)) {
                throw new utils_1.SentryError(nullErr);
            }
            return event;
        }, function (e) {
            throw new utils_1.SentryError("beforeSend rejected with " + e);
        });
    }
    else if (!(utils_1.isPlainObject(rv) || rv === null)) {
        throw new utils_1.SentryError(nullErr);
    }
    return rv;
}
//# sourceMappingURL=baseclient.js.map

/***/ }),

/***/ 12888:
/***/ ((__unused_webpack_module, exports) => {

/*
 * This file defines flags and constants that can be modified during compile time in order to facilitate tree shaking
 * for users.
 *
 * Debug flags need to be declared in each package individually and must not be imported across package boundaries,
 * because some build tools have trouble tree-shaking imported guards.
 *
 * As a convention, we define debug flags in a `flags.ts` file in the root of a package's `src` folder.
 *
 * Debug flag files will contain "magic strings" like `__SENTRY_DEBUG__` that may get replaced with actual values during
 * our, or the user's build process. Take care when introducing new flags - they must not throw if they are not
 * replaced.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/** Flag that is true for debug builds, false otherwise. */
exports.IS_DEBUG_BUILD = typeof __SENTRY_DEBUG__ === 'undefined' ? true : __SENTRY_DEBUG__;
//# sourceMappingURL=flags.js.map

/***/ }),

/***/ 79475:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var minimal_1 = __webpack_require__(3696);
exports.addBreadcrumb = minimal_1.addBreadcrumb;
exports.captureException = minimal_1.captureException;
exports.captureEvent = minimal_1.captureEvent;
exports.captureMessage = minimal_1.captureMessage;
exports.configureScope = minimal_1.configureScope;
exports.startTransaction = minimal_1.startTransaction;
exports.setContext = minimal_1.setContext;
exports.setExtra = minimal_1.setExtra;
exports.setExtras = minimal_1.setExtras;
exports.setTag = minimal_1.setTag;
exports.setTags = minimal_1.setTags;
exports.setUser = minimal_1.setUser;
exports.withScope = minimal_1.withScope;
var hub_1 = __webpack_require__(14044);
exports.addGlobalEventProcessor = hub_1.addGlobalEventProcessor;
exports.getCurrentHub = hub_1.getCurrentHub;
exports.getHubFromCarrier = hub_1.getHubFromCarrier;
exports.Hub = hub_1.Hub;
exports.makeMain = hub_1.makeMain;
exports.Scope = hub_1.Scope;
exports.Session = hub_1.Session;
var api_1 = __webpack_require__(74151);
// eslint-disable-next-line deprecation/deprecation
exports.API = api_1.API;
exports.getEnvelopeEndpointWithUrlEncodedAuth = api_1.getEnvelopeEndpointWithUrlEncodedAuth;
exports.getStoreEndpointWithUrlEncodedAuth = api_1.getStoreEndpointWithUrlEncodedAuth;
exports.getRequestHeaders = api_1.getRequestHeaders;
exports.initAPIDetails = api_1.initAPIDetails;
exports.getReportDialogEndpoint = api_1.getReportDialogEndpoint;
var baseclient_1 = __webpack_require__(78417);
exports.BaseClient = baseclient_1.BaseClient;
var basebackend_1 = __webpack_require__(21380);
exports.BaseBackend = basebackend_1.BaseBackend;
var request_1 = __webpack_require__(1938);
exports.eventToSentryRequest = request_1.eventToSentryRequest;
exports.sessionToSentryRequest = request_1.sessionToSentryRequest;
var sdk_1 = __webpack_require__(95563);
exports.initAndBind = sdk_1.initAndBind;
var noop_1 = __webpack_require__(44632);
exports.NoopTransport = noop_1.NoopTransport;
var base_1 = __webpack_require__(11749);
exports.createTransport = base_1.createTransport;
var version_1 = __webpack_require__(67371);
exports.SDK_VERSION = version_1.SDK_VERSION;
var Integrations = __webpack_require__(64023);
exports.Integrations = Integrations;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 4181:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var hub_1 = __webpack_require__(14044);
var utils_1 = __webpack_require__(58634);
var flags_1 = __webpack_require__(12888);
exports.installedIntegrations = [];
/**
 * @private
 */
function filterDuplicates(integrations) {
    return integrations.reduce(function (acc, integrations) {
        if (acc.every(function (accIntegration) { return integrations.name !== accIntegration.name; })) {
            acc.push(integrations);
        }
        return acc;
    }, []);
}
/** Gets integration to install */
function getIntegrationsToSetup(options) {
    var defaultIntegrations = (options.defaultIntegrations && tslib_1.__spread(options.defaultIntegrations)) || [];
    var userIntegrations = options.integrations;
    var integrations = tslib_1.__spread(filterDuplicates(defaultIntegrations));
    if (Array.isArray(userIntegrations)) {
        // Filter out integrations that are also included in user options
        integrations = tslib_1.__spread(integrations.filter(function (integrations) {
            return userIntegrations.every(function (userIntegration) { return userIntegration.name !== integrations.name; });
        }), filterDuplicates(userIntegrations));
    }
    else if (typeof userIntegrations === 'function') {
        integrations = userIntegrations(integrations);
        integrations = Array.isArray(integrations) ? integrations : [integrations];
    }
    // Make sure that if present, `Debug` integration will always run last
    var integrationsNames = integrations.map(function (i) { return i.name; });
    var alwaysLastToRun = 'Debug';
    if (integrationsNames.indexOf(alwaysLastToRun) !== -1) {
        integrations.push.apply(integrations, tslib_1.__spread(integrations.splice(integrationsNames.indexOf(alwaysLastToRun), 1)));
    }
    return integrations;
}
exports.getIntegrationsToSetup = getIntegrationsToSetup;
/** Setup given integration */
function setupIntegration(integration) {
    if (exports.installedIntegrations.indexOf(integration.name) !== -1) {
        return;
    }
    integration.setupOnce(hub_1.addGlobalEventProcessor, hub_1.getCurrentHub);
    exports.installedIntegrations.push(integration.name);
    flags_1.IS_DEBUG_BUILD && utils_1.logger.log("Integration installed: " + integration.name);
}
exports.setupIntegration = setupIntegration;
/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */
function setupIntegrations(options) {
    var integrations = {};
    getIntegrationsToSetup(options).forEach(function (integration) {
        integrations[integration.name] = integration;
        setupIntegration(integration);
    });
    // set the `initialized` flag so we don't run through the process again unecessarily; use `Object.defineProperty`
    // because by default it creates a property which is nonenumerable, which we want since `initialized` shouldn't be
    // considered a member of the index the way the actual integrations are
    utils_1.addNonEnumerableProperty(integrations, 'initialized', true);
    return integrations;
}
exports.setupIntegrations = setupIntegrations;
//# sourceMappingURL=integration.js.map

/***/ }),

/***/ 59047:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(58634);
var originalFunctionToString;
/** Patch toString calls to return proper name for wrapped functions */
var FunctionToString = /** @class */ (function () {
    function FunctionToString() {
        /**
         * @inheritDoc
         */
        this.name = FunctionToString.id;
    }
    /**
     * @inheritDoc
     */
    FunctionToString.prototype.setupOnce = function () {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        originalFunctionToString = Function.prototype.toString;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Function.prototype.toString = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var context = utils_1.getOriginalFunction(this) || this;
            return originalFunctionToString.apply(context, args);
        };
    };
    /**
     * @inheritDoc
     */
    FunctionToString.id = 'FunctionToString';
    return FunctionToString;
}());
exports.FunctionToString = FunctionToString;
//# sourceMappingURL=functiontostring.js.map

/***/ }),

/***/ 61535:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var utils_1 = __webpack_require__(58634);
var flags_1 = __webpack_require__(12888);
// "Script error." is hard coded into browsers for errors that it can't read.
// this is the result of a script being pulled in from an external domain and CORS.
var DEFAULT_IGNORE_ERRORS = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/];
/** Inbound filters configurable by the user */
var InboundFilters = /** @class */ (function () {
    function InboundFilters(_options) {
        if (_options === void 0) { _options = {}; }
        this._options = _options;
        /**
         * @inheritDoc
         */
        this.name = InboundFilters.id;
    }
    /**
     * @inheritDoc
     */
    InboundFilters.prototype.setupOnce = function (addGlobalEventProcessor, getCurrentHub) {
        addGlobalEventProcessor(function (event) {
            var hub = getCurrentHub();
            if (hub) {
                var self_1 = hub.getIntegration(InboundFilters);
                if (self_1) {
                    var client = hub.getClient();
                    var clientOptions = client ? client.getOptions() : {};
                    var options = _mergeOptions(self_1._options, clientOptions);
                    return _shouldDropEvent(event, options) ? null : event;
                }
            }
            return event;
        });
    };
    /**
     * @inheritDoc
     */
    InboundFilters.id = 'InboundFilters';
    return InboundFilters;
}());
exports.InboundFilters = InboundFilters;
/** JSDoc */
function _mergeOptions(internalOptions, clientOptions) {
    if (internalOptions === void 0) { internalOptions = {}; }
    if (clientOptions === void 0) { clientOptions = {}; }
    return {
        allowUrls: tslib_1.__spread((internalOptions.whitelistUrls || []), (internalOptions.allowUrls || []), (clientOptions.whitelistUrls || []), (clientOptions.allowUrls || [])),
        denyUrls: tslib_1.__spread((internalOptions.blacklistUrls || []), (internalOptions.denyUrls || []), (clientOptions.blacklistUrls || []), (clientOptions.denyUrls || [])),
        ignoreErrors: tslib_1.__spread((internalOptions.ignoreErrors || []), (clientOptions.ignoreErrors || []), DEFAULT_IGNORE_ERRORS),
        ignoreInternal: internalOptions.ignoreInternal !== undefined ? internalOptions.ignoreInternal : true,
    };
}
exports._mergeOptions = _mergeOptions;
/** JSDoc */
function _shouldDropEvent(event, options) {
    if (options.ignoreInternal && _isSentryError(event)) {
        flags_1.IS_DEBUG_BUILD &&
            utils_1.logger.warn("Event dropped due to being internal Sentry Error.\nEvent: " + utils_1.getEventDescription(event));
        return true;
    }
    if (_isIgnoredError(event, options.ignoreErrors)) {
        flags_1.IS_DEBUG_BUILD &&
            utils_1.logger.warn("Event dropped due to being matched by `ignoreErrors` option.\nEvent: " + utils_1.getEventDescription(event));
        return true;
    }
    if (_isDeniedUrl(event, options.denyUrls)) {
        flags_1.IS_DEBUG_BUILD &&
            utils_1.logger.warn("Event dropped due to being matched by `denyUrls` option.\nEvent: " + utils_1.getEventDescription(event) + ".\nUrl: " + _getEventFilterUrl(event));
        return true;
    }
    if (!_isAllowedUrl(event, options.allowUrls)) {
        flags_1.IS_DEBUG_BUILD &&
            utils_1.logger.warn("Event dropped due to not being matched by `allowUrls` option.\nEvent: " + utils_1.getEventDescription(event) + ".\nUrl: " + _getEventFilterUrl(event));
        return true;
    }
    return false;
}
exports._shouldDropEvent = _shouldDropEvent;
function _isIgnoredError(event, ignoreErrors) {
    if (!ignoreErrors || !ignoreErrors.length) {
        return false;
    }
    return _getPossibleEventMessages(event).some(function (message) {
        return ignoreErrors.some(function (pattern) { return utils_1.isMatchingPattern(message, pattern); });
    });
}
function _isDeniedUrl(event, denyUrls) {
    // TODO: Use Glob instead?
    if (!denyUrls || !denyUrls.length) {
        return false;
    }
    var url = _getEventFilterUrl(event);
    return !url ? false : denyUrls.some(function (pattern) { return utils_1.isMatchingPattern(url, pattern); });
}
function _isAllowedUrl(event, allowUrls) {
    // TODO: Use Glob instead?
    if (!allowUrls || !allowUrls.length) {
        return true;
    }
    var url = _getEventFilterUrl(event);
    return !url ? true : allowUrls.some(function (pattern) { return utils_1.isMatchingPattern(url, pattern); });
}
function _getPossibleEventMessages(event) {
    if (event.message) {
        return [event.message];
    }
    if (event.exception) {
        try {
            var _a = (event.exception.values && event.exception.values[0]) || {}, _b = _a.type, type = _b === void 0 ? '' : _b, _c = _a.value, value = _c === void 0 ? '' : _c;
            return ["" + value, type + ": " + value];
        }
        catch (oO) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.error("Cannot extract message for event " + utils_1.getEventDescription(event));
            return [];
        }
    }
    return [];
}
function _isSentryError(event) {
    try {
        // @ts-ignore can't be a sentry error if undefined
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return event.exception.values[0].type === 'SentryError';
    }
    catch (e) {
        // ignore
    }
    return false;
}
function _getLastValidUrl(frames) {
    if (frames === void 0) { frames = []; }
    for (var i = frames.length - 1; i >= 0; i--) {
        var frame = frames[i];
        if (frame && frame.filename !== '<anonymous>' && frame.filename !== '[native code]') {
            return frame.filename || null;
        }
    }
    return null;
}
function _getEventFilterUrl(event) {
    try {
        if (event.stacktrace) {
            return _getLastValidUrl(event.stacktrace.frames);
        }
        var frames_1;
        try {
            // @ts-ignore we only care about frames if the whole thing here is defined
            frames_1 = event.exception.values[0].stacktrace.frames;
        }
        catch (e) {
            // ignore
        }
        return frames_1 ? _getLastValidUrl(frames_1) : null;
    }
    catch (oO) {
        flags_1.IS_DEBUG_BUILD && utils_1.logger.error("Cannot extract url for event " + utils_1.getEventDescription(event));
        return null;
    }
}
//# sourceMappingURL=inboundfilters.js.map

/***/ }),

/***/ 64023:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var functiontostring_1 = __webpack_require__(59047);
exports.FunctionToString = functiontostring_1.FunctionToString;
var inboundfilters_1 = __webpack_require__(61535);
exports.InboundFilters = inboundfilters_1.InboundFilters;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 1938:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var utils_1 = __webpack_require__(58634);
var api_1 = __webpack_require__(74151);
/** Extract sdk info from from the API metadata */
function getSdkMetadataForEnvelopeHeader(api) {
    if (!api.metadata || !api.metadata.sdk) {
        return;
    }
    var _a = api.metadata.sdk, name = _a.name, version = _a.version;
    return { name: name, version: version };
}
/**
 * Apply SdkInfo (name, version, packages, integrations) to the corresponding event key.
 * Merge with existing data if any.
 **/
function enhanceEventWithSdkInfo(event, sdkInfo) {
    if (!sdkInfo) {
        return event;
    }
    event.sdk = event.sdk || {};
    event.sdk.name = event.sdk.name || sdkInfo.name;
    event.sdk.version = event.sdk.version || sdkInfo.version;
    event.sdk.integrations = tslib_1.__spread((event.sdk.integrations || []), (sdkInfo.integrations || []));
    event.sdk.packages = tslib_1.__spread((event.sdk.packages || []), (sdkInfo.packages || []));
    return event;
}
/** Creates an envelope from a Session */
function createSessionEnvelope(session, api) {
    var sdkInfo = getSdkMetadataForEnvelopeHeader(api);
    var envelopeHeaders = tslib_1.__assign(tslib_1.__assign({ sent_at: new Date().toISOString() }, (sdkInfo && { sdk: sdkInfo })), (!!api.tunnel && { dsn: utils_1.dsnToString(api.dsn) }));
    // I know this is hacky but we don't want to add `sessions` to request type since it's never rate limited
    var type = 'aggregates' in session ? 'sessions' : 'session';
    // TODO (v7) Have to cast type because envelope items do not accept a `SentryRequestType`
    var envelopeItem = [{ type: type }, session];
    var envelope = utils_1.createEnvelope(envelopeHeaders, [envelopeItem]);
    return [envelope, type];
}
exports.createSessionEnvelope = createSessionEnvelope;
/** Creates a SentryRequest from a Session. */
function sessionToSentryRequest(session, api) {
    var _a = tslib_1.__read(createSessionEnvelope(session, api), 2), envelope = _a[0], type = _a[1];
    return {
        body: utils_1.serializeEnvelope(envelope),
        type: type,
        url: api_1.getEnvelopeEndpointWithUrlEncodedAuth(api.dsn, api.tunnel),
    };
}
exports.sessionToSentryRequest = sessionToSentryRequest;
/**
 * Create an Envelope from an event. Note that this is duplicated from below,
 * but on purpose as this will be refactored in v7.
 */
function createEventEnvelope(event, api) {
    var sdkInfo = getSdkMetadataForEnvelopeHeader(api);
    var eventType = event.type || 'event';
    var transactionSampling = (event.sdkProcessingMetadata || {}).transactionSampling;
    var _a = transactionSampling || {}, samplingMethod = _a.method, sampleRate = _a.rate;
    // TODO: Below is a temporary hack in order to debug a serialization error - see
    // https://github.com/getsentry/sentry-javascript/issues/2809,
    // https://github.com/getsentry/sentry-javascript/pull/4425, and
    // https://github.com/getsentry/sentry-javascript/pull/4574.
    //
    // TL; DR: even though we normalize all events (which should prevent this), something is causing `JSON.stringify` to
    // throw a circular reference error.
    //
    // When it's time to remove it:
    // 1. Delete everything between here and where the request object `req` is created, EXCEPT the line deleting
    //    `sdkProcessingMetadata`
    // 2. Restore the original version of the request body, which is commented out
    // 3. Search for either of the PR URLs above and pull out the companion hacks in the browser playwright tests and the
    //    baseClient tests in this package
    enhanceEventWithSdkInfo(event, api.metadata.sdk);
    event.tags = event.tags || {};
    event.extra = event.extra || {};
    // In theory, all events should be marked as having gone through normalization and so
    // we should never set this tag/extra data
    if (!(event.sdkProcessingMetadata && event.sdkProcessingMetadata.baseClientNormalized)) {
        event.tags.skippedNormalization = true;
        event.extra.normalizeDepth = event.sdkProcessingMetadata ? event.sdkProcessingMetadata.normalizeDepth : 'unset';
    }
    // prevent this data from being sent to sentry
    // TODO: This is NOT part of the hack - DO NOT DELETE
    delete event.sdkProcessingMetadata;
    var envelopeHeaders = tslib_1.__assign(tslib_1.__assign({ event_id: event.event_id, sent_at: new Date().toISOString() }, (sdkInfo && { sdk: sdkInfo })), (!!api.tunnel && { dsn: utils_1.dsnToString(api.dsn) }));
    var eventItem = [
        {
            type: eventType,
            sample_rates: [{ id: samplingMethod, rate: sampleRate }],
        },
        event,
    ];
    return utils_1.createEnvelope(envelopeHeaders, [eventItem]);
}
exports.createEventEnvelope = createEventEnvelope;
/** Creates a SentryRequest from an event. */
function eventToSentryRequest(event, api) {
    var sdkInfo = getSdkMetadataForEnvelopeHeader(api);
    var eventType = event.type || 'event';
    var useEnvelope = eventType === 'transaction' || !!api.tunnel;
    var transactionSampling = (event.sdkProcessingMetadata || {}).transactionSampling;
    var _a = transactionSampling || {}, samplingMethod = _a.method, sampleRate = _a.rate;
    // TODO: Below is a temporary hack in order to debug a serialization error - see
    // https://github.com/getsentry/sentry-javascript/issues/2809,
    // https://github.com/getsentry/sentry-javascript/pull/4425, and
    // https://github.com/getsentry/sentry-javascript/pull/4574.
    //
    // TL; DR: even though we normalize all events (which should prevent this), something is causing `JSON.stringify` to
    // throw a circular reference error.
    //
    // When it's time to remove it:
    // 1. Delete everything between here and where the request object `req` is created, EXCEPT the line deleting
    //    `sdkProcessingMetadata`
    // 2. Restore the original version of the request body, which is commented out
    // 3. Search for either of the PR URLs above and pull out the companion hacks in the browser playwright tests and the
    //    baseClient tests in this package
    enhanceEventWithSdkInfo(event, api.metadata.sdk);
    event.tags = event.tags || {};
    event.extra = event.extra || {};
    // In theory, all events should be marked as having gone through normalization and so
    // we should never set this tag/extra data
    if (!(event.sdkProcessingMetadata && event.sdkProcessingMetadata.baseClientNormalized)) {
        event.tags.skippedNormalization = true;
        event.extra.normalizeDepth = event.sdkProcessingMetadata ? event.sdkProcessingMetadata.normalizeDepth : 'unset';
    }
    // prevent this data from being sent to sentry
    // TODO: This is NOT part of the hack - DO NOT DELETE
    delete event.sdkProcessingMetadata;
    var body;
    try {
        // 99.9% of events should get through just fine - no change in behavior for them
        body = JSON.stringify(event);
    }
    catch (err) {
        // Record data about the error without replacing original event data, then force renormalization
        event.tags.JSONStringifyError = true;
        event.extra.JSONStringifyError = err;
        try {
            body = JSON.stringify(utils_1.normalize(event));
        }
        catch (newErr) {
            // At this point even renormalization hasn't worked, meaning something about the event data has gone very wrong.
            // Time to cut our losses and record only the new error. With luck, even in the problematic cases we're trying to
            // debug with this hack, we won't ever land here.
            var innerErr = newErr;
            body = JSON.stringify({
                message: 'JSON.stringify error after renormalization',
                // setting `extra: { innerErr }` here for some reason results in an empty object, so unpack manually
                extra: { message: innerErr.message, stack: innerErr.stack },
            });
        }
    }
    var req = {
        // this is the relevant line of code before the hack was added, to make it easy to undo said hack once we've solved
        // the mystery
        // body: JSON.stringify(sdkInfo ? enhanceEventWithSdkInfo(event, api.metadata.sdk) : event),
        body: body,
        type: eventType,
        url: useEnvelope
            ? api_1.getEnvelopeEndpointWithUrlEncodedAuth(api.dsn, api.tunnel)
            : api_1.getStoreEndpointWithUrlEncodedAuth(api.dsn),
    };
    // https://develop.sentry.dev/sdk/envelopes/
    // Since we don't need to manipulate envelopes nor store them, there is no
    // exported concept of an Envelope with operations including serialization and
    // deserialization. Instead, we only implement a minimal subset of the spec to
    // serialize events inline here.
    if (useEnvelope) {
        var envelopeHeaders = tslib_1.__assign(tslib_1.__assign({ event_id: event.event_id, sent_at: new Date().toISOString() }, (sdkInfo && { sdk: sdkInfo })), (!!api.tunnel && { dsn: utils_1.dsnToString(api.dsn) }));
        var eventItem = [
            {
                type: eventType,
                sample_rates: [{ id: samplingMethod, rate: sampleRate }],
            },
            req.body,
        ];
        var envelope = utils_1.createEnvelope(envelopeHeaders, [eventItem]);
        req.body = utils_1.serializeEnvelope(envelope);
    }
    return req;
}
exports.eventToSentryRequest = eventToSentryRequest;
//# sourceMappingURL=request.js.map

/***/ }),

/***/ 95563:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var hub_1 = __webpack_require__(14044);
var utils_1 = __webpack_require__(58634);
var flags_1 = __webpack_require__(12888);
/**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instantiate.
 * @param options Options to pass to the client.
 */
function initAndBind(clientClass, options) {
    if (options.debug === true) {
        if (flags_1.IS_DEBUG_BUILD) {
            utils_1.logger.enable();
        }
        else {
            // use `console.warn` rather than `logger.warn` since by non-debug bundles have all `logger.x` statements stripped
            // eslint-disable-next-line no-console
            console.warn('[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.');
        }
    }
    var hub = hub_1.getCurrentHub();
    var scope = hub.getScope();
    if (scope) {
        scope.update(options.initialScope);
    }
    var client = new clientClass(options);
    hub.bindClient(client);
}
exports.initAndBind = initAndBind;
//# sourceMappingURL=sdk.js.map

/***/ }),

/***/ 11749:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(58634);
exports.ERROR_TRANSPORT_CATEGORY = 'error';
exports.TRANSACTION_TRANSPORT_CATEGORY = 'transaction';
exports.ATTACHMENT_TRANSPORT_CATEGORY = 'attachment';
exports.SESSION_TRANSPORT_CATEGORY = 'session';
exports.DEFAULT_TRANSPORT_BUFFER_SIZE = 30;
/**
 * Creates a `NewTransport`
 *
 * @param options
 * @param makeRequest
 */
function createTransport(options, makeRequest, buffer) {
    if (buffer === void 0) { buffer = utils_1.makePromiseBuffer(options.bufferSize || exports.DEFAULT_TRANSPORT_BUFFER_SIZE); }
    var rateLimits = {};
    var flush = function (timeout) { return buffer.drain(timeout); };
    function send(envelope) {
        var envCategory = utils_1.getEnvelopeType(envelope);
        var category = envCategory === 'event' ? 'error' : envCategory;
        var request = {
            category: category,
            body: utils_1.serializeEnvelope(envelope),
        };
        // Don't add to buffer if transport is already rate-limited
        if (utils_1.isRateLimited(rateLimits, category)) {
            return utils_1.rejectedSyncPromise({
                status: 'rate_limit',
                reason: getRateLimitReason(rateLimits, category),
            });
        }
        var requestTask = function () {
            return makeRequest(request).then(function (_a) {
                var body = _a.body, headers = _a.headers, reason = _a.reason, statusCode = _a.statusCode;
                var status = utils_1.eventStatusFromHttpCode(statusCode);
                if (headers) {
                    rateLimits = utils_1.updateRateLimits(rateLimits, headers);
                }
                if (status === 'success') {
                    return utils_1.resolvedSyncPromise({ status: status, reason: reason });
                }
                return utils_1.rejectedSyncPromise({
                    status: status,
                    reason: reason ||
                        body ||
                        (status === 'rate_limit' ? getRateLimitReason(rateLimits, category) : 'Unknown transport error'),
                });
            });
        };
        return buffer.add(requestTask);
    }
    return {
        send: send,
        flush: flush,
    };
}
exports.createTransport = createTransport;
function getRateLimitReason(rateLimits, category) {
    return "Too many " + category + " requests, backing off until: " + new Date(utils_1.disabledUntil(rateLimits, category)).toISOString();
}
//# sourceMappingURL=base.js.map

/***/ }),

/***/ 44632:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(58634);
/** Noop transport */
var NoopTransport = /** @class */ (function () {
    function NoopTransport() {
    }
    /**
     * @inheritDoc
     */
    NoopTransport.prototype.sendEvent = function (_) {
        return utils_1.resolvedSyncPromise({
            reason: 'NoopTransport: Event has been skipped because no Dsn is configured.',
            status: 'skipped',
        });
    };
    /**
     * @inheritDoc
     */
    NoopTransport.prototype.close = function (_) {
        return utils_1.resolvedSyncPromise(true);
    };
    return NoopTransport;
}());
exports.NoopTransport = NoopTransport;
//# sourceMappingURL=noop.js.map

/***/ }),

/***/ 67371:
/***/ ((__unused_webpack_module, exports) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SDK_VERSION = '6.19.7';
//# sourceMappingURL=version.js.map

/***/ }),

/***/ 60482:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var core_1 = __webpack_require__(79475);
var types_1 = __webpack_require__(35686);
var utils_1 = __webpack_require__(58634);
var eventbuilder_1 = __webpack_require__(82171);
var transports_1 = __webpack_require__(79905);
/**
 * The Sentry Node SDK Backend.
 * @hidden
 */
var NodeBackend = /** @class */ (function (_super) {
    tslib_1.__extends(NodeBackend, _super);
    function NodeBackend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    NodeBackend.prototype.eventFromException = function (exception, hint) {
        return utils_1.resolvedSyncPromise(eventbuilder_1.eventFromUnknownInput(exception, hint));
    };
    /**
     * @inheritDoc
     */
    NodeBackend.prototype.eventFromMessage = function (message, level, hint) {
        if (level === void 0) { level = types_1.Severity.Info; }
        return utils_1.resolvedSyncPromise(eventbuilder_1.eventFromMessage(message, level, hint, this._options.attachStacktrace));
    };
    /**
     * @inheritDoc
     */
    NodeBackend.prototype._setupTransport = function () {
        if (!this._options.dsn) {
            // We return the noop transport here in case there is no Dsn.
            return _super.prototype._setupTransport.call(this);
        }
        var dsn = utils_1.makeDsn(this._options.dsn);
        var transportOptions = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, this._options.transportOptions), (this._options.httpProxy && { httpProxy: this._options.httpProxy })), (this._options.httpsProxy && { httpsProxy: this._options.httpsProxy })), (this._options.caCerts && { caCerts: this._options.caCerts })), { dsn: this._options.dsn, tunnel: this._options.tunnel, _metadata: this._options._metadata });
        if (this._options.transport) {
            return new this._options.transport(transportOptions);
        }
        var api = core_1.initAPIDetails(transportOptions.dsn, transportOptions._metadata, transportOptions.tunnel);
        var url = core_1.getEnvelopeEndpointWithUrlEncodedAuth(api.dsn, api.tunnel);
        this._newTransport = transports_1.makeNodeTransport({
            url: url,
            headers: transportOptions.headers,
            proxy: transportOptions.httpProxy,
            caCerts: transportOptions.caCerts,
        });
        if (dsn.protocol === 'http') {
            return new transports_1.HTTPTransport(transportOptions);
        }
        return new transports_1.HTTPSTransport(transportOptions);
    };
    return NodeBackend;
}(core_1.BaseBackend));
exports.NodeBackend = NodeBackend;
//# sourceMappingURL=backend.js.map

/***/ }),

/***/ 19587:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var core_1 = __webpack_require__(79475);
var hub_1 = __webpack_require__(14044);
var utils_1 = __webpack_require__(58634);
var backend_1 = __webpack_require__(60482);
var flags_1 = __webpack_require__(597);
/**
 * The Sentry Node SDK Client.
 *
 * @see NodeOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
var NodeClient = /** @class */ (function (_super) {
    tslib_1.__extends(NodeClient, _super);
    /**
     * Creates a new Node SDK instance.
     * @param options Configuration options for this SDK.
     */
    function NodeClient(options) {
        var _this = this;
        options._metadata = options._metadata || {};
        options._metadata.sdk = options._metadata.sdk || {
            name: 'sentry.javascript.node',
            packages: [
                {
                    name: 'npm:@sentry/node',
                    version: core_1.SDK_VERSION,
                },
            ],
            version: core_1.SDK_VERSION,
        };
        _this = _super.call(this, backend_1.NodeBackend, options) || this;
        return _this;
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    NodeClient.prototype.captureException = function (exception, hint, scope) {
        // Check if the flag `autoSessionTracking` is enabled, and if `_sessionFlusher` exists because it is initialised only
        // when the `requestHandler` middleware is used, and hence the expectation is to have SessionAggregates payload
        // sent to the Server only when the `requestHandler` middleware is used
        if (this._options.autoSessionTracking && this._sessionFlusher && scope) {
            var requestSession = scope.getRequestSession();
            // Necessary checks to ensure this is code block is executed only within a request
            // Should override the status only if `requestSession.status` is `Ok`, which is its initial stage
            if (requestSession && requestSession.status === 'ok') {
                requestSession.status = 'errored';
            }
        }
        return _super.prototype.captureException.call(this, exception, hint, scope);
    };
    /**
     * @inheritDoc
     */
    NodeClient.prototype.captureEvent = function (event, hint, scope) {
        // Check if the flag `autoSessionTracking` is enabled, and if `_sessionFlusher` exists because it is initialised only
        // when the `requestHandler` middleware is used, and hence the expectation is to have SessionAggregates payload
        // sent to the Server only when the `requestHandler` middleware is used
        if (this._options.autoSessionTracking && this._sessionFlusher && scope) {
            var eventType = event.type || 'exception';
            var isException = eventType === 'exception' && event.exception && event.exception.values && event.exception.values.length > 0;
            // If the event is of type Exception, then a request session should be captured
            if (isException) {
                var requestSession = scope.getRequestSession();
                // Ensure that this is happening within the bounds of a request, and make sure not to override
                // Session Status if Errored / Crashed
                if (requestSession && requestSession.status === 'ok') {
                    requestSession.status = 'errored';
                }
            }
        }
        return _super.prototype.captureEvent.call(this, event, hint, scope);
    };
    /**
     *
     * @inheritdoc
     */
    NodeClient.prototype.close = function (timeout) {
        var _a;
        (_a = this._sessionFlusher) === null || _a === void 0 ? void 0 : _a.close();
        return _super.prototype.close.call(this, timeout);
    };
    /** Method that initialises an instance of SessionFlusher on Client */
    NodeClient.prototype.initSessionFlusher = function () {
        var _a = this._options, release = _a.release, environment = _a.environment;
        if (!release) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('Cannot initialise an instance of SessionFlusher if no release is provided!');
        }
        else {
            this._sessionFlusher = new hub_1.SessionFlusher(this.getTransport(), {
                release: release,
                environment: environment,
            });
        }
    };
    /**
     * @inheritDoc
     */
    NodeClient.prototype._prepareEvent = function (event, scope, hint) {
        event.platform = event.platform || 'node';
        if (this.getOptions().serverName) {
            event.server_name = this.getOptions().serverName;
        }
        return _super.prototype._prepareEvent.call(this, event, scope, hint);
    };
    /**
     * Method responsible for capturing/ending a request session by calling `incrementSessionStatusCount` to increment
     * appropriate session aggregates bucket
     */
    NodeClient.prototype._captureRequestSession = function () {
        if (!this._sessionFlusher) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('Discarded request mode session because autoSessionTracking option was disabled');
        }
        else {
            this._sessionFlusher.incrementSessionStatusCount();
        }
    };
    return NodeClient;
}(core_1.BaseClient));
exports.NodeClient = NodeClient;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 82171:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var hub_1 = __webpack_require__(14044);
var types_1 = __webpack_require__(35686);
var utils_1 = __webpack_require__(58634);
var stack_parser_1 = __webpack_require__(31804);
/**
 * Extracts stack frames from the error.stack string
 */
function parseStackFrames(error) {
    return utils_1.createStackParser(stack_parser_1.nodeStackParser)(error.stack || '', 1);
}
exports.parseStackFrames = parseStackFrames;
/**
 * Extracts stack frames from the error and builds a Sentry Exception
 */
function exceptionFromError(error) {
    var exception = {
        type: error.name || error.constructor.name,
        value: error.message,
    };
    var frames = parseStackFrames(error);
    if (frames.length) {
        exception.stacktrace = { frames: frames };
    }
    return exception;
}
exports.exceptionFromError = exceptionFromError;
/**
 * Builds and Event from a Exception
 * @hidden
 */
function eventFromUnknownInput(exception, hint) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var ex = exception;
    var providedMechanism = hint && hint.data && hint.data.mechanism;
    var mechanism = providedMechanism || {
        handled: true,
        type: 'generic',
    };
    if (!utils_1.isError(exception)) {
        if (utils_1.isPlainObject(exception)) {
            // This will allow us to group events based on top-level keys
            // which is much better than creating new group when any key/value change
            var message = "Non-Error exception captured with keys: " + utils_1.extractExceptionKeysForMessage(exception);
            hub_1.getCurrentHub().configureScope(function (scope) {
                scope.setExtra('__serialized__', utils_1.normalizeToSize(exception));
            });
            ex = (hint && hint.syntheticException) || new Error(message);
            ex.message = message;
        }
        else {
            // This handles when someone does: `throw "something awesome";`
            // We use synthesized Error here so we can extract a (rough) stack trace.
            ex = (hint && hint.syntheticException) || new Error(exception);
            ex.message = exception;
        }
        mechanism.synthetic = true;
    }
    var event = {
        exception: {
            values: [exceptionFromError(ex)],
        },
    };
    utils_1.addExceptionTypeValue(event, undefined, undefined);
    utils_1.addExceptionMechanism(event, mechanism);
    return tslib_1.__assign(tslib_1.__assign({}, event), { event_id: hint && hint.event_id });
}
exports.eventFromUnknownInput = eventFromUnknownInput;
/**
 * Builds and Event from a Message
 * @hidden
 */
function eventFromMessage(message, level, hint, attachStacktrace) {
    if (level === void 0) { level = types_1.Severity.Info; }
    var event = {
        event_id: hint && hint.event_id,
        level: level,
        message: message,
    };
    if (attachStacktrace && hint && hint.syntheticException) {
        var frames_1 = parseStackFrames(hint.syntheticException);
        if (frames_1.length) {
            event.stacktrace = { frames: frames_1 };
        }
    }
    return event;
}
exports.eventFromMessage = eventFromMessage;
//# sourceMappingURL=eventbuilder.js.map

/***/ }),

/***/ 597:
/***/ ((__unused_webpack_module, exports) => {

/*
 * This file defines flags and constants that can be modified during compile time in order to facilitate tree shaking
 * for users.
 *
 * Debug flags need to be declared in each package individually and must not be imported across package boundaries,
 * because some build tools have trouble tree-shaking imported guards.
 *
 * As a convention, we define debug flags in a `flags.ts` file in the root of a package's `src` folder.
 *
 * Debug flag files will contain "magic strings" like `__SENTRY_DEBUG__` that may get replaced with actual values during
 * our, or the user's build process. Take care when introducing new flags - they must not throw if they are not
 * replaced.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/** Flag that is true for debug builds, false otherwise. */
exports.IS_DEBUG_BUILD = typeof __SENTRY_DEBUG__ === 'undefined' ? true : __SENTRY_DEBUG__;
//# sourceMappingURL=flags.js.map

/***/ }),

/***/ 52589:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
var core_1 = __webpack_require__(79475);
var utils_1 = __webpack_require__(58634);
var cookie = __webpack_require__(3814);
var domain = __webpack_require__(73167);
var os = __webpack_require__(70857);
var url = __webpack_require__(87016);
var flags_1 = __webpack_require__(597);
var sdk_1 = __webpack_require__(5054);
/**
 * Express-compatible tracing handler.
 * @see Exposed as `Handlers.tracingHandler`
 */
function tracingHandler() {
    return function sentryTracingMiddleware(req, res, next) {
        // If there is a trace header set, we extract the data from it (parentSpanId, traceId, and sampling decision)
        var traceparentData;
        if (req.headers && utils_1.isString(req.headers['sentry-trace'])) {
            traceparentData = utils_1.extractTraceparentData(req.headers['sentry-trace']);
        }
        var transaction = core_1.startTransaction(tslib_1.__assign({ name: extractExpressTransactionName(req, { path: true, method: true }), op: 'http.server' }, traceparentData), 
        // extra context passed to the tracesSampler
        { request: extractRequestData(req) });
        // We put the transaction on the scope so users can attach children to it
        core_1.getCurrentHub().configureScope(function (scope) {
            scope.setSpan(transaction);
        });
        // We also set __sentry_transaction on the response so people can grab the transaction there to add
        // spans to it later.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        res.__sentry_transaction = transaction;
        res.once('finish', function () {
            // Push `transaction.finish` to the next event loop so open spans have a chance to finish before the transaction
            // closes
            setImmediate(function () {
                addExpressReqToTransaction(transaction, req);
                transaction.setHttpStatus(res.statusCode);
                transaction.finish();
            });
        });
        next();
    };
}
exports.tracingHandler = tracingHandler;
/**
 * Set parameterized as transaction name e.g.: `GET /users/:id`
 * Also adds more context data on the transaction from the request
 */
function addExpressReqToTransaction(transaction, req) {
    if (!transaction)
        return;
    transaction.name = extractExpressTransactionName(req, { path: true, method: true });
    transaction.setData('url', req.originalUrl);
    transaction.setData('baseUrl', req.baseUrl);
    transaction.setData('query', req.query);
}
/**
 * Extracts complete generalized path from the request object and uses it to construct transaction name.
 *
 * eg. GET /mountpoint/user/:id
 *
 * @param req The ExpressRequest object
 * @param options What to include in the transaction name (method, path, or both)
 *
 * @returns The fully constructed transaction name
 */
function extractExpressTransactionName(req, options) {
    if (options === void 0) { options = {}; }
    var _a;
    var method = (_a = req.method) === null || _a === void 0 ? void 0 : _a.toUpperCase();
    var path = '';
    if (req.route) {
        path = "" + (req.baseUrl || '') + req.route.path;
    }
    else if (req.originalUrl || req.url) {
        path = utils_1.stripUrlQueryAndFragment(req.originalUrl || req.url || '');
    }
    var info = '';
    if (options.method && method) {
        info += method;
    }
    if (options.method && options.path) {
        info += ' ';
    }
    if (options.path && path) {
        info += path;
    }
    return info;
}
/** JSDoc */
function extractTransaction(req, type) {
    var _a;
    switch (type) {
        case 'path': {
            return extractExpressTransactionName(req, { path: true });
        }
        case 'handler': {
            return ((_a = req.route) === null || _a === void 0 ? void 0 : _a.stack[0].name) || '<anonymous>';
        }
        case 'methodPath':
        default: {
            return extractExpressTransactionName(req, { path: true, method: true });
        }
    }
}
/** Default user keys that'll be used to extract data from the request */
var DEFAULT_USER_KEYS = ['id', 'username', 'email'];
/** JSDoc */
function extractUserData(user, keys) {
    var extractedUser = {};
    var attributes = Array.isArray(keys) ? keys : DEFAULT_USER_KEYS;
    attributes.forEach(function (key) {
        if (user && key in user) {
            extractedUser[key] = user[key];
        }
    });
    return extractedUser;
}
/** Default request keys that'll be used to extract data from the request */
var DEFAULT_REQUEST_KEYS = ['cookies', 'data', 'headers', 'method', 'query_string', 'url'];
/**
 * Normalizes data from the request object, accounting for framework differences.
 *
 * @param req The request object from which to extract data
 * @param keys An optional array of keys to include in the normalized data. Defaults to DEFAULT_REQUEST_KEYS if not
 * provided.
 * @returns An object containing normalized request data
 */
function extractRequestData(req, keys) {
    if (keys === void 0) { keys = DEFAULT_REQUEST_KEYS; }
    var requestData = {};
    // headers:
    //   node, express, nextjs: req.headers
    //   koa: req.header
    var headers = (req.headers || req.header || {});
    // method:
    //   node, express, koa, nextjs: req.method
    var method = req.method;
    // host:
    //   express: req.hostname in > 4 and req.host in < 4
    //   koa: req.host
    //   node, nextjs: req.headers.host
    var host = req.hostname || req.host || headers.host || '<no host>';
    // protocol:
    //   node, nextjs: <n/a>
    //   express, koa: req.protocol
    var protocol = req.protocol === 'https' || req.secure || (req.socket || {}).encrypted
        ? 'https'
        : 'http';
    // url (including path and query string):
    //   node, express: req.originalUrl
    //   koa, nextjs: req.url
    var originalUrl = (req.originalUrl || req.url || '');
    // absolute url
    var absoluteUrl = protocol + "://" + host + originalUrl;
    keys.forEach(function (key) {
        switch (key) {
            case 'headers':
                requestData.headers = headers;
                break;
            case 'method':
                requestData.method = method;
                break;
            case 'url':
                requestData.url = absoluteUrl;
                break;
            case 'cookies':
                // cookies:
                //   node, express, koa: req.headers.cookie
                //   vercel, sails.js, express (w/ cookie middleware), nextjs: req.cookies
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                requestData.cookies = req.cookies || cookie.parse(headers.cookie || '');
                break;
            case 'query_string':
                // query string:
                //   node: req.url (raw)
                //   express, koa, nextjs: req.query
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                requestData.query_string = req.query || url.parse(originalUrl || '', false).query;
                break;
            case 'data':
                if (method === 'GET' || method === 'HEAD') {
                    break;
                }
                // body data:
                //   express, koa, nextjs: req.body
                //
                //   when using node by itself, you have to read the incoming stream(see
                //   https://nodejs.dev/learn/get-http-request-body-data-using-nodejs); if a user is doing that, we can't know
                //   where they're going to store the final result, so they'll have to capture this data themselves
                if (req.body !== undefined) {
                    requestData.data = utils_1.isString(req.body) ? req.body : JSON.stringify(utils_1.normalize(req.body));
                }
                break;
            default:
                if ({}.hasOwnProperty.call(req, key)) {
                    requestData[key] = req[key];
                }
        }
    });
    return requestData;
}
exports.extractRequestData = extractRequestData;
/**
 * Enriches passed event with request data.
 *
 * @param event Will be mutated and enriched with req data
 * @param req Request object
 * @param options object containing flags to enable functionality
 * @hidden
 */
function parseRequest(event, req, options) {
    // eslint-disable-next-line no-param-reassign
    options = tslib_1.__assign({ ip: false, request: true, serverName: true, transaction: true, user: true, version: true }, options);
    if (options.version) {
        event.contexts = tslib_1.__assign(tslib_1.__assign({}, event.contexts), { runtime: {
                name: 'node',
                version: global.process.version,
            } });
    }
    if (options.request) {
        // if the option value is `true`, use the default set of keys by not passing anything to `extractRequestData()`
        var extractedRequestData = Array.isArray(options.request)
            ? extractRequestData(req, options.request)
            : extractRequestData(req);
        event.request = tslib_1.__assign(tslib_1.__assign({}, event.request), extractedRequestData);
    }
    if (options.serverName && !event.server_name) {
        event.server_name = global.process.env.SENTRY_NAME || os.hostname();
    }
    if (options.user) {
        var extractedUser = req.user && utils_1.isPlainObject(req.user) ? extractUserData(req.user, options.user) : {};
        if (Object.keys(extractedUser)) {
            event.user = tslib_1.__assign(tslib_1.__assign({}, event.user), extractedUser);
        }
    }
    // client ip:
    //   node, nextjs: req.connection.remoteAddress
    //   express, koa: req.ip
    if (options.ip) {
        var ip = req.ip || (req.connection && req.connection.remoteAddress);
        if (ip) {
            event.user = tslib_1.__assign(tslib_1.__assign({}, event.user), { ip_address: ip });
        }
    }
    if (options.transaction && !event.transaction) {
        // TODO do we even need this anymore?
        // TODO make this work for nextjs
        event.transaction = extractTransaction(req, options.transaction);
    }
    return event;
}
exports.parseRequest = parseRequest;
/**
 * Express compatible request handler.
 * @see Exposed as `Handlers.requestHandler`
 */
function requestHandler(options) {
    var currentHub = core_1.getCurrentHub();
    var client = currentHub.getClient();
    // Initialise an instance of SessionFlusher on the client when `autoSessionTracking` is enabled and the
    // `requestHandler` middleware is used indicating that we are running in SessionAggregates mode
    if (client && sdk_1.isAutoSessionTrackingEnabled(client)) {
        client.initSessionFlusher();
        // If Scope contains a Single mode Session, it is removed in favor of using Session Aggregates mode
        var scope = currentHub.getScope();
        if (scope && scope.getSession()) {
            scope.setSession();
        }
    }
    return function sentryRequestMiddleware(req, res, next) {
        if (options && options.flushTimeout && options.flushTimeout > 0) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            var _end_1 = res.end;
            res.end = function (chunk, encoding, cb) {
                var _this = this;
                void sdk_1.flush(options.flushTimeout)
                    .then(function () {
                    _end_1.call(_this, chunk, encoding, cb);
                })
                    .then(null, function (e) {
                    flags_1.IS_DEBUG_BUILD && utils_1.logger.error(e);
                    _end_1.call(_this, chunk, encoding, cb);
                });
            };
        }
        var local = domain.create();
        local.add(req);
        local.add(res);
        local.on('error', next);
        local.run(function () {
            var currentHub = core_1.getCurrentHub();
            currentHub.configureScope(function (scope) {
                scope.addEventProcessor(function (event) { return parseRequest(event, req, options); });
                var client = currentHub.getClient();
                if (sdk_1.isAutoSessionTrackingEnabled(client)) {
                    var scope_1 = currentHub.getScope();
                    if (scope_1) {
                        // Set `status` of `RequestSession` to Ok, at the beginning of the request
                        scope_1.setRequestSession({ status: 'ok' });
                    }
                }
            });
            res.once('finish', function () {
                var client = currentHub.getClient();
                if (sdk_1.isAutoSessionTrackingEnabled(client)) {
                    setImmediate(function () {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        if (client && client._captureRequestSession) {
                            // Calling _captureRequestSession to capture request session at the end of the request by incrementing
                            // the correct SessionAggregates bucket i.e. crashed, errored or exited
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            client._captureRequestSession();
                        }
                    });
                }
            });
            next();
        });
    };
}
exports.requestHandler = requestHandler;
/** JSDoc */
function getStatusCodeFromResponse(error) {
    var statusCode = error.status || error.statusCode || error.status_code || (error.output && error.output.statusCode);
    return statusCode ? parseInt(statusCode, 10) : 500;
}
/** Returns true if response code is internal server error */
function defaultShouldHandleError(error) {
    var status = getStatusCodeFromResponse(error);
    return status >= 500;
}
/**
 * Express compatible error handler.
 * @see Exposed as `Handlers.errorHandler`
 */
function errorHandler(options) {
    return function sentryErrorMiddleware(error, _req, res, next) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        var shouldHandleError = (options && options.shouldHandleError) || defaultShouldHandleError;
        if (shouldHandleError(error)) {
            core_1.withScope(function (_scope) {
                // For some reason we need to set the transaction on the scope again
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                var transaction = res.__sentry_transaction;
                if (transaction && _scope.getSpan() === undefined) {
                    _scope.setSpan(transaction);
                }
                var client = core_1.getCurrentHub().getClient();
                if (client && sdk_1.isAutoSessionTrackingEnabled(client)) {
                    // Check if the `SessionFlusher` is instantiated on the client to go into this branch that marks the
                    // `requestSession.status` as `Crashed`, and this check is necessary because the `SessionFlusher` is only
                    // instantiated when the the`requestHandler` middleware is initialised, which indicates that we should be
                    // running in SessionAggregates mode
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    var isSessionAggregatesMode = client._sessionFlusher !== undefined;
                    if (isSessionAggregatesMode) {
                        var requestSession = _scope.getRequestSession();
                        // If an error bubbles to the `errorHandler`, then this is an unhandled error, and should be reported as a
                        // Crashed session. The `_requestSession.status` is checked to ensure that this error is happening within
                        // the bounds of a request, and if so the status is updated
                        if (requestSession && requestSession.status !== undefined) {
                            requestSession.status = 'crashed';
                        }
                    }
                }
                var eventId = core_1.captureException(error);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                res.sentry = eventId;
                next(error);
            });
            return;
        }
        next(error);
    };
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=handlers.js.map

/***/ }),

/***/ 75834:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var types_1 = __webpack_require__(35686);
exports.Severity = types_1.Severity;
var core_1 = __webpack_require__(79475);
exports.addGlobalEventProcessor = core_1.addGlobalEventProcessor;
exports.addBreadcrumb = core_1.addBreadcrumb;
exports.captureException = core_1.captureException;
exports.captureEvent = core_1.captureEvent;
exports.captureMessage = core_1.captureMessage;
exports.configureScope = core_1.configureScope;
exports.getHubFromCarrier = core_1.getHubFromCarrier;
exports.getCurrentHub = core_1.getCurrentHub;
exports.Hub = core_1.Hub;
exports.makeMain = core_1.makeMain;
exports.Scope = core_1.Scope;
exports.Session = core_1.Session;
exports.startTransaction = core_1.startTransaction;
exports.SDK_VERSION = core_1.SDK_VERSION;
exports.setContext = core_1.setContext;
exports.setExtra = core_1.setExtra;
exports.setExtras = core_1.setExtras;
exports.setTag = core_1.setTag;
exports.setTags = core_1.setTags;
exports.setUser = core_1.setUser;
exports.withScope = core_1.withScope;
var backend_1 = __webpack_require__(60482);
exports.NodeBackend = backend_1.NodeBackend;
var client_1 = __webpack_require__(19587);
exports.NodeClient = client_1.NodeClient;
var sdk_1 = __webpack_require__(5054);
exports.defaultIntegrations = sdk_1.defaultIntegrations;
exports.init = sdk_1.init;
exports.lastEventId = sdk_1.lastEventId;
exports.flush = sdk_1.flush;
exports.close = sdk_1.close;
exports.getSentryRelease = sdk_1.getSentryRelease;
var utils_1 = __webpack_require__(75531);
exports.deepReadDirSync = utils_1.deepReadDirSync;
var version_1 = __webpack_require__(10510);
exports.SDK_NAME = version_1.SDK_NAME;
var core_2 = __webpack_require__(79475);
var hub_1 = __webpack_require__(14044);
var domain = __webpack_require__(73167);
var Handlers = __webpack_require__(52589);
exports.Handlers = Handlers;
var NodeIntegrations = __webpack_require__(48632);
var Transports = __webpack_require__(79905);
exports.Transports = Transports;
var INTEGRATIONS = tslib_1.__assign(tslib_1.__assign({}, core_2.Integrations), NodeIntegrations);
exports.Integrations = INTEGRATIONS;
// We need to patch domain on the global __SENTRY__ object to make it work for node in cross-platform packages like
// @sentry/hub. If we don't do this, browser bundlers will have troubles resolving `require('domain')`.
var carrier = hub_1.getMainCarrier();
if (carrier.__SENTRY__) {
    carrier.__SENTRY__.extensions = carrier.__SENTRY__.extensions || {};
    carrier.__SENTRY__.extensions.domain = carrier.__SENTRY__.extensions.domain || domain;
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 83365:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var core_1 = __webpack_require__(79475);
var utils_1 = __webpack_require__(58634);
var util = __webpack_require__(39023);
/** Console module integration */
var Console = /** @class */ (function () {
    function Console() {
        /**
         * @inheritDoc
         */
        this.name = Console.id;
    }
    /**
     * @inheritDoc
     */
    Console.prototype.setupOnce = function () {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(['debug', 'info', 'warn', 'error', 'log']), _c = _b.next(); !_c.done; _c = _b.next()) {
                var level = _c.value;
                utils_1.fill(console, level, createConsoleWrapper(level));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /**
     * @inheritDoc
     */
    Console.id = 'Console';
    return Console;
}());
exports.Console = Console;
/**
 * Wrapper function that'll be used for every console level
 */
function createConsoleWrapper(level) {
    return function consoleWrapper(originalConsoleMethod) {
        var sentryLevel = utils_1.severityFromString(level);
        /* eslint-disable prefer-rest-params */
        return function () {
            if (core_1.getCurrentHub().getIntegration(Console)) {
                core_1.getCurrentHub().addBreadcrumb({
                    category: 'console',
                    level: sentryLevel,
                    message: util.format.apply(undefined, arguments),
                }, {
                    input: tslib_1.__spread(arguments),
                    level: level,
                });
            }
            originalConsoleMethod.apply(this, arguments);
        };
        /* eslint-enable prefer-rest-params */
    };
}
//# sourceMappingURL=console.js.map

/***/ }),

/***/ 70636:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var core_1 = __webpack_require__(79475);
var utils_1 = __webpack_require__(58634);
var fs_1 = __webpack_require__(79896);
var lru_map_1 = __webpack_require__(27273);
var FILE_CONTENT_CACHE = new lru_map_1.LRUMap(100);
var DEFAULT_LINES_OF_CONTEXT = 7;
// TODO: Replace with promisify when minimum supported node >= v8
function readTextFileAsync(path) {
    return new Promise(function (resolve, reject) {
        fs_1.readFile(path, 'utf8', function (err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
/**
 * Resets the file cache. Exists for testing purposes.
 * @hidden
 */
function resetFileContentCache() {
    FILE_CONTENT_CACHE.clear();
}
exports.resetFileContentCache = resetFileContentCache;
/** Add node modules / packages to the event */
var ContextLines = /** @class */ (function () {
    function ContextLines(_options) {
        if (_options === void 0) { _options = {}; }
        this._options = _options;
        /**
         * @inheritDoc
         */
        this.name = ContextLines.id;
    }
    Object.defineProperty(ContextLines.prototype, "_contextLines", {
        /** Get's the number of context lines to add */
        get: function () {
            var _a, _b;
            // This is only here to copy frameContextLines from init options if it hasn't
            // been set via this integrations constructor.
            //
            // TODO: Remove on next major!
            if (this._options.frameContextLines === undefined) {
                var initOptions = (_a = core_1.getCurrentHub().getClient()) === null || _a === void 0 ? void 0 : _a.getOptions();
                // eslint-disable-next-line deprecation/deprecation
                this._options.frameContextLines = (_b = initOptions) === null || _b === void 0 ? void 0 : _b.frameContextLines;
            }
            return this._options.frameContextLines !== undefined ? this._options.frameContextLines : DEFAULT_LINES_OF_CONTEXT;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ContextLines.prototype.setupOnce = function (addGlobalEventProcessor) {
        var _this = this;
        addGlobalEventProcessor(function (event) { return _this.addSourceContext(event); });
    };
    /** Processes an event and adds context lines */
    ContextLines.prototype.addSourceContext = function (event) {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _c, _d, exception, e_1_1;
            var e_1, _e;
            return tslib_1.__generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!(this._contextLines > 0 && ((_a = event.exception) === null || _a === void 0 ? void 0 : _a.values))) return [3 /*break*/, 8];
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 6, 7, 8]);
                        _c = tslib_1.__values(event.exception.values), _d = _c.next();
                        _f.label = 2;
                    case 2:
                        if (!!_d.done) return [3 /*break*/, 5];
                        exception = _d.value;
                        if (!((_b = exception.stacktrace) === null || _b === void 0 ? void 0 : _b.frames)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.addSourceContextToFrames(exception.stacktrace.frames)];
                    case 3:
                        _f.sent();
                        _f.label = 4;
                    case 4:
                        _d = _c.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _f.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, event];
                }
            });
        });
    };
    /** Adds context lines to frames */
    ContextLines.prototype.addSourceContextToFrames = function (frames) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var contextLines, frames_1, frames_1_1, frame, sourceFile, lines, e_2_1;
            var e_2, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        contextLines = this._contextLines;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        frames_1 = tslib_1.__values(frames), frames_1_1 = frames_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!frames_1_1.done) return [3 /*break*/, 5];
                        frame = frames_1_1.value;
                        if (!(frame.filename && frame.context_line === undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, _readSourceFile(frame.filename)];
                    case 3:
                        sourceFile = _b.sent();
                        if (sourceFile) {
                            try {
                                lines = sourceFile.split('\n');
                                utils_1.addContextToFrame(lines, frame, contextLines);
                            }
                            catch (e) {
                                // anomaly, being defensive in case
                                // unlikely to ever happen in practice but can definitely happen in theory
                            }
                        }
                        _b.label = 4;
                    case 4:
                        frames_1_1 = frames_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_2_1 = _b.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (frames_1_1 && !frames_1_1.done && (_a = frames_1.return)) _a.call(frames_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @inheritDoc
     */
    ContextLines.id = 'ContextLines';
    return ContextLines;
}());
exports.ContextLines = ContextLines;
/**
 * Reads file contents and caches them in a global LRU cache.
 *
 * @param filename filepath to read content from.
 */
function _readSourceFile(filename) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var cachedFile, content, _1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cachedFile = FILE_CONTENT_CACHE.get(filename);
                    // We have a cache hit
                    if (cachedFile !== undefined) {
                        return [2 /*return*/, cachedFile];
                    }
                    content = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, readTextFileAsync(filename)];
                case 2:
                    content = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    FILE_CONTENT_CACHE.set(filename, content);
                    return [2 /*return*/, content];
            }
        });
    });
}
//# sourceMappingURL=contextlines.js.map

/***/ }),

/***/ 32606:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var core_1 = __webpack_require__(79475);
var utils_1 = __webpack_require__(58634);
var flags_1 = __webpack_require__(597);
var http_1 = __webpack_require__(53456);
var NODE_VERSION = utils_1.parseSemver(process.versions.node);
/** http module integration */
var Http = /** @class */ (function () {
    /**
     * @inheritDoc
     */
    function Http(options) {
        if (options === void 0) { options = {}; }
        /**
         * @inheritDoc
         */
        this.name = Http.id;
        this._breadcrumbs = typeof options.breadcrumbs === 'undefined' ? true : options.breadcrumbs;
        this._tracing = typeof options.tracing === 'undefined' ? false : options.tracing;
    }
    /**
     * @inheritDoc
     */
    Http.prototype.setupOnce = function () {
        // No need to instrument if we don't want to track anything
        if (!this._breadcrumbs && !this._tracing) {
            return;
        }
        var wrappedHandlerMaker = _createWrappedRequestMethodFactory(this._breadcrumbs, this._tracing);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        var httpModule = __webpack_require__(58611);
        utils_1.fill(httpModule, 'get', wrappedHandlerMaker);
        utils_1.fill(httpModule, 'request', wrappedHandlerMaker);
        // NOTE: Prior to Node 9, `https` used internals of `http` module, thus we don't patch it.
        // If we do, we'd get double breadcrumbs and double spans for `https` calls.
        // It has been changed in Node 9, so for all versions equal and above, we patch `https` separately.
        if (NODE_VERSION.major && NODE_VERSION.major > 8) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            var httpsModule = __webpack_require__(65692);
            utils_1.fill(httpsModule, 'get', wrappedHandlerMaker);
            utils_1.fill(httpsModule, 'request', wrappedHandlerMaker);
        }
    };
    /**
     * @inheritDoc
     */
    Http.id = 'Http';
    return Http;
}());
exports.Http = Http;
/**
 * Function which creates a function which creates wrapped versions of internal `request` and `get` calls within `http`
 * and `https` modules. (NB: Not a typo - this is a creator^2!)
 *
 * @param breadcrumbsEnabled Whether or not to record outgoing requests as breadcrumbs
 * @param tracingEnabled Whether or not to record outgoing requests as tracing spans
 *
 * @returns A function which accepts the exiting handler and returns a wrapped handler
 */
function _createWrappedRequestMethodFactory(breadcrumbsEnabled, tracingEnabled) {
    return function wrappedRequestMethodFactory(originalRequestMethod) {
        return function wrappedMethod() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var httpModule = this;
            var requestArgs = http_1.normalizeRequestArgs(this, args);
            var requestOptions = requestArgs[0];
            var requestUrl = http_1.extractUrl(requestOptions);
            // we don't want to record requests to Sentry as either breadcrumbs or spans, so just use the original method
            if (http_1.isSentryRequest(requestUrl)) {
                return originalRequestMethod.apply(httpModule, requestArgs);
            }
            var span;
            var parentSpan;
            var scope = core_1.getCurrentHub().getScope();
            if (scope && tracingEnabled) {
                parentSpan = scope.getSpan();
                if (parentSpan) {
                    span = parentSpan.startChild({
                        description: (requestOptions.method || 'GET') + " " + requestUrl,
                        op: 'http.client',
                    });
                    var sentryTraceHeader = span.toTraceparent();
                    flags_1.IS_DEBUG_BUILD &&
                        utils_1.logger.log("[Tracing] Adding sentry-trace header " + sentryTraceHeader + " to outgoing request to " + requestUrl + ": ");
                    requestOptions.headers = tslib_1.__assign(tslib_1.__assign({}, requestOptions.headers), { 'sentry-trace': sentryTraceHeader });
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return originalRequestMethod
                .apply(httpModule, requestArgs)
                .once('response', function (res) {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                var req = this;
                if (breadcrumbsEnabled) {
                    addRequestBreadcrumb('response', requestUrl, req, res);
                }
                if (tracingEnabled && span) {
                    if (res.statusCode) {
                        span.setHttpStatus(res.statusCode);
                    }
                    span.description = http_1.cleanSpanDescription(span.description, requestOptions, req);
                    span.finish();
                }
            })
                .once('error', function () {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                var req = this;
                if (breadcrumbsEnabled) {
                    addRequestBreadcrumb('error', requestUrl, req);
                }
                if (tracingEnabled && span) {
                    span.setHttpStatus(500);
                    span.description = http_1.cleanSpanDescription(span.description, requestOptions, req);
                    span.finish();
                }
            });
        };
    };
}
/**
 * Captures Breadcrumb based on provided request/response pair
 */
function addRequestBreadcrumb(event, url, req, res) {
    if (!core_1.getCurrentHub().getIntegration(Http)) {
        return;
    }
    core_1.getCurrentHub().addBreadcrumb({
        category: 'http',
        data: {
            method: req.method,
            status_code: res && res.statusCode,
            url: url,
        },
        type: 'http',
    }, {
        event: event,
        request: req,
        response: res,
    });
}
//# sourceMappingURL=http.js.map

/***/ }),

/***/ 48632:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var console_1 = __webpack_require__(83365);
exports.Console = console_1.Console;
var http_1 = __webpack_require__(32606);
exports.Http = http_1.Http;
var onuncaughtexception_1 = __webpack_require__(54339);
exports.OnUncaughtException = onuncaughtexception_1.OnUncaughtException;
var onunhandledrejection_1 = __webpack_require__(72977);
exports.OnUnhandledRejection = onunhandledrejection_1.OnUnhandledRejection;
var linkederrors_1 = __webpack_require__(71076);
exports.LinkedErrors = linkederrors_1.LinkedErrors;
var modules_1 = __webpack_require__(1581);
exports.Modules = modules_1.Modules;
var contextlines_1 = __webpack_require__(70636);
exports.ContextLines = contextlines_1.ContextLines;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 71076:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var core_1 = __webpack_require__(79475);
var utils_1 = __webpack_require__(58634);
var eventbuilder_1 = __webpack_require__(82171);
var contextlines_1 = __webpack_require__(70636);
var DEFAULT_KEY = 'cause';
var DEFAULT_LIMIT = 5;
/** Adds SDK info to an event. */
var LinkedErrors = /** @class */ (function () {
    /**
     * @inheritDoc
     */
    function LinkedErrors(options) {
        if (options === void 0) { options = {}; }
        /**
         * @inheritDoc
         */
        this.name = LinkedErrors.id;
        this._key = options.key || DEFAULT_KEY;
        this._limit = options.limit || DEFAULT_LIMIT;
    }
    /**
     * @inheritDoc
     */
    LinkedErrors.prototype.setupOnce = function () {
        core_1.addGlobalEventProcessor(function (event, hint) {
            var self = core_1.getCurrentHub().getIntegration(LinkedErrors);
            if (self) {
                var handler = self._handler && self._handler.bind(self);
                return typeof handler === 'function' ? handler(event, hint) : event;
            }
            return event;
        });
    };
    /**
     * @inheritDoc
     */
    LinkedErrors.prototype._handler = function (event, hint) {
        var _this = this;
        if (!event.exception || !event.exception.values || !hint || !utils_1.isInstanceOf(hint.originalException, Error)) {
            return utils_1.resolvedSyncPromise(event);
        }
        return new utils_1.SyncPromise(function (resolve) {
            void _this._walkErrorTree(hint.originalException, _this._key)
                .then(function (linkedErrors) {
                if (event && event.exception && event.exception.values) {
                    event.exception.values = tslib_1.__spread(linkedErrors, event.exception.values);
                }
                resolve(event);
            })
                .then(null, function () {
                resolve(event);
            });
        });
    };
    /**
     * @inheritDoc
     */
    LinkedErrors.prototype._walkErrorTree = function (error, key, stack) {
        if (stack === void 0) { stack = []; }
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var exception, contextLines;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!utils_1.isInstanceOf(error[key], Error) || stack.length + 1 >= this._limit) {
                            return [2 /*return*/, Promise.resolve(stack)];
                        }
                        exception = eventbuilder_1.exceptionFromError(error[key]);
                        contextLines = core_1.getCurrentHub().getIntegration(contextlines_1.ContextLines);
                        if (!(contextLines && ((_a = exception.stacktrace) === null || _a === void 0 ? void 0 : _a.frames))) return [3 /*break*/, 2];
                        return [4 /*yield*/, contextLines.addSourceContextToFrames(exception.stacktrace.frames)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, new Promise(function (resolve, reject) {
                            void _this._walkErrorTree(error[key], key, tslib_1.__spread([exception], stack))
                                .then(resolve)
                                .then(null, function () {
                                reject();
                            });
                        })];
                }
            });
        });
    };
    /**
     * @inheritDoc
     */
    LinkedErrors.id = 'LinkedErrors';
    return LinkedErrors;
}());
exports.LinkedErrors = LinkedErrors;
//# sourceMappingURL=linkederrors.js.map

/***/ }),

/***/ 1581:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var fs_1 = __webpack_require__(79896);
var path_1 = __webpack_require__(16928);
var moduleCache;
/** Extract information about paths */
function getPaths() {
    try {
        return __WEBPACK_EXTERNAL_createRequire(import.meta.url).cache ? Object.keys(__WEBPACK_EXTERNAL_createRequire(import.meta.url).cache) : [];
    }
    catch (e) {
        return [];
    }
}
/** Extract information about package.json modules */
function collectModules() {
    var mainPaths = (__WEBPACK_EXTERNAL_createRequire(import.meta.url).main && __WEBPACK_EXTERNAL_createRequire(import.meta.url).main.paths) || [];
    var paths = getPaths();
    var infos = {};
    var seen = {};
    paths.forEach(function (path) {
        var dir = path;
        /** Traverse directories upward in the search of package.json file */
        var updir = function () {
            var orig = dir;
            dir = path_1.dirname(orig);
            if (!dir || orig === dir || seen[orig]) {
                return undefined;
            }
            if (mainPaths.indexOf(dir) < 0) {
                return updir();
            }
            var pkgfile = path_1.join(orig, 'package.json');
            seen[orig] = true;
            if (!fs_1.existsSync(pkgfile)) {
                return updir();
            }
            try {
                var info = JSON.parse(fs_1.readFileSync(pkgfile, 'utf8'));
                infos[info.name] = info.version;
            }
            catch (_oO) {
                // no-empty
            }
        };
        updir();
    });
    return infos;
}
/** Add node modules / packages to the event */
var Modules = /** @class */ (function () {
    function Modules() {
        /**
         * @inheritDoc
         */
        this.name = Modules.id;
    }
    /**
     * @inheritDoc
     */
    Modules.prototype.setupOnce = function (addGlobalEventProcessor, getCurrentHub) {
        var _this = this;
        addGlobalEventProcessor(function (event) {
            if (!getCurrentHub().getIntegration(Modules)) {
                return event;
            }
            return tslib_1.__assign(tslib_1.__assign({}, event), { modules: _this._getModules() });
        });
    };
    /** Fetches the list of modules and the versions loaded by the entry file for your node.js app. */
    Modules.prototype._getModules = function () {
        if (!moduleCache) {
            moduleCache = collectModules();
        }
        return moduleCache;
    };
    /**
     * @inheritDoc
     */
    Modules.id = 'Modules';
    return Modules;
}());
exports.Modules = Modules;
//# sourceMappingURL=modules.js.map

/***/ }),

/***/ 54339:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(79475);
var types_1 = __webpack_require__(35686);
var utils_1 = __webpack_require__(58634);
var flags_1 = __webpack_require__(597);
var errorhandling_1 = __webpack_require__(73785);
/** Global Promise Rejection handler */
var OnUncaughtException = /** @class */ (function () {
    /**
     * @inheritDoc
     */
    function OnUncaughtException(_options) {
        if (_options === void 0) { _options = {}; }
        this._options = _options;
        /**
         * @inheritDoc
         */
        this.name = OnUncaughtException.id;
        /**
         * @inheritDoc
         */
        this.handler = this._makeErrorHandler();
    }
    /**
     * @inheritDoc
     */
    OnUncaughtException.prototype.setupOnce = function () {
        global.process.on('uncaughtException', this.handler.bind(this));
    };
    /**
     * @hidden
     */
    OnUncaughtException.prototype._makeErrorHandler = function () {
        var _this = this;
        var timeout = 2000;
        var caughtFirstError = false;
        var caughtSecondError = false;
        var calledFatalError = false;
        var firstError;
        return function (error) {
            var onFatalError = errorhandling_1.logAndExitProcess;
            var client = core_1.getCurrentHub().getClient();
            if (_this._options.onFatalError) {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                onFatalError = _this._options.onFatalError;
            }
            else if (client && client.getOptions().onFatalError) {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                onFatalError = client.getOptions().onFatalError;
            }
            if (!caughtFirstError) {
                var hub_1 = core_1.getCurrentHub();
                // this is the first uncaught error and the ultimate reason for shutting down
                // we want to do absolutely everything possible to ensure it gets captured
                // also we want to make sure we don't go recursion crazy if more errors happen after this one
                firstError = error;
                caughtFirstError = true;
                if (hub_1.getIntegration(OnUncaughtException)) {
                    hub_1.withScope(function (scope) {
                        scope.setLevel(types_1.Severity.Fatal);
                        hub_1.captureException(error, {
                            originalException: error,
                            data: { mechanism: { handled: false, type: 'onuncaughtexception' } },
                        });
                        if (!calledFatalError) {
                            calledFatalError = true;
                            onFatalError(error);
                        }
                    });
                }
                else {
                    if (!calledFatalError) {
                        calledFatalError = true;
                        onFatalError(error);
                    }
                }
            }
            else if (calledFatalError) {
                // we hit an error *after* calling onFatalError - pretty boned at this point, just shut it down
                flags_1.IS_DEBUG_BUILD &&
                    utils_1.logger.warn('uncaught exception after calling fatal error shutdown callback - this is bad! forcing shutdown');
                errorhandling_1.logAndExitProcess(error);
            }
            else if (!caughtSecondError) {
                // two cases for how we can hit this branch:
                //   - capturing of first error blew up and we just caught the exception from that
                //     - quit trying to capture, proceed with shutdown
                //   - a second independent error happened while waiting for first error to capture
                //     - want to avoid causing premature shutdown before first error capture finishes
                // it's hard to immediately tell case 1 from case 2 without doing some fancy/questionable domain stuff
                // so let's instead just delay a bit before we proceed with our action here
                // in case 1, we just wait a bit unnecessarily but ultimately do the same thing
                // in case 2, the delay hopefully made us wait long enough for the capture to finish
                // two potential nonideal outcomes:
                //   nonideal case 1: capturing fails fast, we sit around for a few seconds unnecessarily before proceeding correctly by calling onFatalError
                //   nonideal case 2: case 2 happens, 1st error is captured but slowly, timeout completes before capture and we treat second error as the sendErr of (nonexistent) failure from trying to capture first error
                // note that after hitting this branch, we might catch more errors where (caughtSecondError && !calledFatalError)
                //   we ignore them - they don't matter to us, we're just waiting for the second error timeout to finish
                caughtSecondError = true;
                setTimeout(function () {
                    if (!calledFatalError) {
                        // it was probably case 1, let's treat err as the sendErr and call onFatalError
                        calledFatalError = true;
                        onFatalError(firstError, error);
                    }
                    else {
                        // it was probably case 2, our first error finished capturing while we waited, cool, do nothing
                    }
                }, timeout); // capturing could take at least sendTimeout to fail, plus an arbitrary second for how long it takes to collect surrounding source etc
            }
        };
    };
    /**
     * @inheritDoc
     */
    OnUncaughtException.id = 'OnUncaughtException';
    return OnUncaughtException;
}());
exports.OnUncaughtException = OnUncaughtException;
//# sourceMappingURL=onuncaughtexception.js.map

/***/ }),

/***/ 72977:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(79475);
var utils_1 = __webpack_require__(58634);
var errorhandling_1 = __webpack_require__(73785);
/** Global Promise Rejection handler */
var OnUnhandledRejection = /** @class */ (function () {
    /**
     * @inheritDoc
     */
    function OnUnhandledRejection(_options) {
        if (_options === void 0) { _options = { mode: 'warn' }; }
        this._options = _options;
        /**
         * @inheritDoc
         */
        this.name = OnUnhandledRejection.id;
    }
    /**
     * @inheritDoc
     */
    OnUnhandledRejection.prototype.setupOnce = function () {
        global.process.on('unhandledRejection', this.sendUnhandledPromise.bind(this));
    };
    /**
     * Send an exception with reason
     * @param reason string
     * @param promise promise
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    OnUnhandledRejection.prototype.sendUnhandledPromise = function (reason, promise) {
        var hub = core_1.getCurrentHub();
        if (!hub.getIntegration(OnUnhandledRejection)) {
            this._handleRejection(reason);
            return;
        }
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        var context = (promise.domain && promise.domain.sentryContext) || {};
        hub.withScope(function (scope) {
            scope.setExtra('unhandledPromiseRejection', true);
            // Preserve backwards compatibility with raven-node for now
            if (context.user) {
                scope.setUser(context.user);
            }
            if (context.tags) {
                scope.setTags(context.tags);
            }
            if (context.extra) {
                scope.setExtras(context.extra);
            }
            hub.captureException(reason, {
                originalException: promise,
                data: { mechanism: { handled: false, type: 'onunhandledrejection' } },
            });
        });
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        this._handleRejection(reason);
    };
    /**
     * Handler for `mode` option
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OnUnhandledRejection.prototype._handleRejection = function (reason) {
        // https://github.com/nodejs/node/blob/7cf6f9e964aa00772965391c23acda6d71972a9a/lib/internal/process/promises.js#L234-L240
        var rejectionWarning = 'This error originated either by ' +
            'throwing inside of an async function without a catch block, ' +
            'or by rejecting a promise which was not handled with .catch().' +
            ' The promise rejected with the reason:';
        /* eslint-disable no-console */
        if (this._options.mode === 'warn') {
            utils_1.consoleSandbox(function () {
                console.warn(rejectionWarning);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                console.error(reason && reason.stack ? reason.stack : reason);
            });
        }
        else if (this._options.mode === 'strict') {
            utils_1.consoleSandbox(function () {
                console.warn(rejectionWarning);
            });
            errorhandling_1.logAndExitProcess(reason);
        }
        /* eslint-enable no-console */
    };
    /**
     * @inheritDoc
     */
    OnUnhandledRejection.id = 'OnUnhandledRejection';
    return OnUnhandledRejection;
}());
exports.OnUnhandledRejection = OnUnhandledRejection;
//# sourceMappingURL=onunhandledrejection.js.map

/***/ }),

/***/ 73785:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(79475);
var utils_1 = __webpack_require__(58634);
var flags_1 = __webpack_require__(597);
var DEFAULT_SHUTDOWN_TIMEOUT = 2000;
/**
 * @hidden
 */
function logAndExitProcess(error) {
    // eslint-disable-next-line no-console
    console.error(error && error.stack ? error.stack : error);
    var client = core_1.getCurrentHub().getClient();
    if (client === undefined) {
        flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('No NodeClient was defined, we are exiting the process now.');
        global.process.exit(1);
    }
    var options = client.getOptions();
    var timeout = (options && options.shutdownTimeout && options.shutdownTimeout > 0 && options.shutdownTimeout) ||
        DEFAULT_SHUTDOWN_TIMEOUT;
    utils_1.forget(client.close(timeout).then(function (result) {
        if (!result) {
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('We reached the timeout for emptying the request buffer, still exiting now!');
        }
        global.process.exit(1);
    }));
}
exports.logAndExitProcess = logAndExitProcess;
//# sourceMappingURL=errorhandling.js.map

/***/ }),

/***/ 53456:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var core_1 = __webpack_require__(79475);
var utils_1 = __webpack_require__(58634);
var url_1 = __webpack_require__(87016);
var NODE_VERSION = utils_1.parseSemver(process.versions.node);
/**
 * Checks whether given url points to Sentry server
 * @param url url to verify
 */
function isSentryRequest(url) {
    var _a;
    var dsn = (_a = core_1.getCurrentHub().getClient()) === null || _a === void 0 ? void 0 : _a.getDsn();
    return dsn ? url.includes(dsn.host) : false;
}
exports.isSentryRequest = isSentryRequest;
/**
 * Assemble a URL to be used for breadcrumbs and spans.
 *
 * @param requestOptions RequestOptions object containing the component parts for a URL
 * @returns Fully-formed URL
 */
function extractUrl(requestOptions) {
    var protocol = requestOptions.protocol || '';
    var hostname = requestOptions.hostname || requestOptions.host || '';
    // Don't log standard :80 (http) and :443 (https) ports to reduce the noise
    var port = !requestOptions.port || requestOptions.port === 80 || requestOptions.port === 443 ? '' : ":" + requestOptions.port;
    var path = requestOptions.path ? requestOptions.path : '/';
    return protocol + "//" + hostname + port + path;
}
exports.extractUrl = extractUrl;
/**
 * Handle various edge cases in the span description (for spans representing http(s) requests).
 *
 * @param description current `description` property of the span representing the request
 * @param requestOptions Configuration data for the request
 * @param Request Request object
 *
 * @returns The cleaned description
 */
function cleanSpanDescription(description, requestOptions, request) {
    var _a, _b, _c;
    // nothing to clean
    if (!description) {
        return description;
    }
    // eslint-disable-next-line prefer-const
    var _d = tslib_1.__read(description.split(' '), 2), method = _d[0], requestUrl = _d[1];
    // superagent sticks the protocol in a weird place (we check for host because if both host *and* protocol are missing,
    // we're likely dealing with an internal route and this doesn't apply)
    if (requestOptions.host && !requestOptions.protocol) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        requestOptions.protocol = (_b = (_a = request) === null || _a === void 0 ? void 0 : _a.agent) === null || _b === void 0 ? void 0 : _b.protocol; // worst comes to worst, this is undefined and nothing changes
        requestUrl = extractUrl(requestOptions);
    }
    // internal routes can end up starting with a triple slash rather than a single one
    if ((_c = requestUrl) === null || _c === void 0 ? void 0 : _c.startsWith('///')) {
        requestUrl = requestUrl.slice(2);
    }
    return method + " " + requestUrl;
}
exports.cleanSpanDescription = cleanSpanDescription;
/**
 * Convert a URL object into a RequestOptions object.
 *
 * Copied from Node's internals (where it's used in http(s).request() and http(s).get()), modified only to use the
 * RequestOptions type above.
 *
 * See https://github.com/nodejs/node/blob/master/lib/internal/url.js.
 */
function urlToOptions(url) {
    var options = {
        protocol: url.protocol,
        hostname: typeof url.hostname === 'string' && url.hostname.startsWith('[') ? url.hostname.slice(1, -1) : url.hostname,
        hash: url.hash,
        search: url.search,
        pathname: url.pathname,
        path: "" + (url.pathname || '') + (url.search || ''),
        href: url.href,
    };
    if (url.port !== '') {
        options.port = Number(url.port);
    }
    if (url.username || url.password) {
        options.auth = url.username + ":" + url.password;
    }
    return options;
}
exports.urlToOptions = urlToOptions;
/**
 * Normalize inputs to `http(s).request()` and `http(s).get()`.
 *
 * Legal inputs to `http(s).request()` and `http(s).get()` can take one of ten forms:
 *     [ RequestOptions | string | URL ],
 *     [ RequestOptions | string | URL, RequestCallback ],
 *     [ string | URL, RequestOptions ], and
 *     [ string | URL, RequestOptions, RequestCallback ].
 *
 * This standardizes to one of two forms: [ RequestOptions ] and [ RequestOptions, RequestCallback ]. A similar thing is
 * done as the first step of `http(s).request()` and `http(s).get()`; this just does it early so that we can interact
 * with the args in a standard way.
 *
 * @param requestArgs The inputs to `http(s).request()` or `http(s).get()`, as an array.
 *
 * @returns Equivalent args of the form [ RequestOptions ] or [ RequestOptions, RequestCallback ].
 */
function normalizeRequestArgs(httpModule, requestArgs) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var callback, requestOptions;
    // pop off the callback, if there is one
    if (typeof requestArgs[requestArgs.length - 1] === 'function') {
        callback = requestArgs.pop();
    }
    // create a RequestOptions object of whatever's at index 0
    if (typeof requestArgs[0] === 'string') {
        requestOptions = urlToOptions(new url_1.URL(requestArgs[0]));
    }
    else if (requestArgs[0] instanceof url_1.URL) {
        requestOptions = urlToOptions(requestArgs[0]);
    }
    else {
        requestOptions = requestArgs[0];
    }
    // if the options were given separately from the URL, fold them in
    if (requestArgs.length === 2) {
        requestOptions = tslib_1.__assign(tslib_1.__assign({}, requestOptions), requestArgs[1]);
    }
    // Figure out the protocol if it's currently missing
    if (requestOptions.protocol === undefined) {
        // Worst case we end up populating protocol with undefined, which it already is
        /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
        // NOTE: Prior to Node 9, `https` used internals of `http` module, thus we don't patch it.
        // Because of that, we cannot rely on `httpModule` to provide us with valid protocol,
        // as it will always return `http`, even when using `https` module.
        //
        // See test/integrations/http.test.ts for more details on Node <=v8 protocol issue.
        if (NODE_VERSION.major && NODE_VERSION.major > 8) {
            requestOptions.protocol =
                ((_b = (_a = httpModule) === null || _a === void 0 ? void 0 : _a.globalAgent) === null || _b === void 0 ? void 0 : _b.protocol) || ((_c = requestOptions.agent) === null || _c === void 0 ? void 0 : _c.protocol) || ((_d = requestOptions._defaultAgent) === null || _d === void 0 ? void 0 : _d.protocol);
        }
        else {
            requestOptions.protocol =
                ((_e = requestOptions.agent) === null || _e === void 0 ? void 0 : _e.protocol) || ((_f = requestOptions._defaultAgent) === null || _f === void 0 ? void 0 : _f.protocol) || ((_h = (_g = httpModule) === null || _g === void 0 ? void 0 : _g.globalAgent) === null || _h === void 0 ? void 0 : _h.protocol);
        }
        /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
    }
    // return args in standardized form
    if (callback) {
        return [requestOptions, callback];
    }
    else {
        return [requestOptions];
    }
}
exports.normalizeRequestArgs = normalizeRequestArgs;
//# sourceMappingURL=http.js.map

/***/ }),

/***/ 5054:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var core_1 = __webpack_require__(79475);
var hub_1 = __webpack_require__(14044);
var utils_1 = __webpack_require__(58634);
var domain = __webpack_require__(73167);
var client_1 = __webpack_require__(19587);
var flags_1 = __webpack_require__(597);
var integrations_1 = __webpack_require__(48632);
exports.defaultIntegrations = [
    // Common
    new core_1.Integrations.InboundFilters(),
    new core_1.Integrations.FunctionToString(),
    new integrations_1.ContextLines(),
    // Native Wrappers
    new integrations_1.Console(),
    new integrations_1.Http(),
    // Global Handlers
    new integrations_1.OnUncaughtException(),
    new integrations_1.OnUnhandledRejection(),
    // Misc
    new integrations_1.LinkedErrors(),
];
/**
 * The Sentry Node SDK Client.
 *
 * To use this SDK, call the {@link init} function as early as possible in the
 * main entry module. To set context information or send manual events, use the
 * provided methods.
 *
 * @example
 * ```
 *
 * const { init } = require('@sentry/node');
 *
 * init({
 *   dsn: '__DSN__',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * const { configureScope } = require('@sentry/node');
 * configureScope((scope: Scope) => {
 *   scope.setExtra({ battery: 0.7 });
 *   scope.setTag({ user_mode: 'admin' });
 *   scope.setUser({ id: '4711' });
 * });
 * ```
 *
 * @example
 * ```
 *
 * const { addBreadcrumb } = require('@sentry/node');
 * addBreadcrumb({
 *   message: 'My Breadcrumb',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * const Sentry = require('@sentry/node');
 * Sentry.captureMessage('Hello, world!');
 * Sentry.captureException(new Error('Good bye'));
 * Sentry.captureEvent({
 *   message: 'Manual',
 *   stacktrace: [
 *     // ...
 *   ],
 * });
 * ```
 *
 * @see {@link NodeOptions} for documentation on configuration options.
 */
function init(options) {
    if (options === void 0) { options = {}; }
    var _a;
    var carrier = hub_1.getMainCarrier();
    var autoloadedIntegrations = ((_a = carrier.__SENTRY__) === null || _a === void 0 ? void 0 : _a.integrations) || [];
    options.defaultIntegrations =
        options.defaultIntegrations === false
            ? []
            : tslib_1.__spread((Array.isArray(options.defaultIntegrations) ? options.defaultIntegrations : exports.defaultIntegrations), autoloadedIntegrations);
    if (options.dsn === undefined && process.env.SENTRY_DSN) {
        options.dsn = process.env.SENTRY_DSN;
    }
    if (options.tracesSampleRate === undefined && process.env.SENTRY_TRACES_SAMPLE_RATE) {
        var tracesSampleRate = parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE);
        if (isFinite(tracesSampleRate)) {
            options.tracesSampleRate = tracesSampleRate;
        }
    }
    if (options.release === undefined) {
        var detectedRelease = getSentryRelease();
        if (detectedRelease !== undefined) {
            options.release = detectedRelease;
        }
        else {
            // If release is not provided, then we should disable autoSessionTracking
            options.autoSessionTracking = false;
        }
    }
    if (options.environment === undefined && process.env.SENTRY_ENVIRONMENT) {
        options.environment = process.env.SENTRY_ENVIRONMENT;
    }
    if (options.autoSessionTracking === undefined && options.dsn !== undefined) {
        options.autoSessionTracking = true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    if (domain.active) {
        hub_1.setHubOnCarrier(carrier, core_1.getCurrentHub());
    }
    core_1.initAndBind(client_1.NodeClient, options);
    if (options.autoSessionTracking) {
        startSessionTracking();
    }
}
exports.init = init;
/**
 * This is the getter for lastEventId.
 *
 * @returns The last event id of a captured event.
 */
function lastEventId() {
    return core_1.getCurrentHub().lastEventId();
}
exports.lastEventId = lastEventId;
/**
 * Call `flush()` on the current client, if there is one. See {@link Client.flush}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue. Omitting this parameter will cause
 * the client to wait until all events are sent before resolving the promise.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */
function flush(timeout) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var client;
        return tslib_1.__generator(this, function (_a) {
            client = core_1.getCurrentHub().getClient();
            if (client) {
                return [2 /*return*/, client.flush(timeout)];
            }
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('Cannot flush events. No client defined.');
            return [2 /*return*/, Promise.resolve(false)];
        });
    });
}
exports.flush = flush;
/**
 * Call `close()` on the current client, if there is one. See {@link Client.close}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue before shutting down. Omitting this
 * parameter will cause the client to wait until all events are sent before disabling itself.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */
function close(timeout) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var client;
        return tslib_1.__generator(this, function (_a) {
            client = core_1.getCurrentHub().getClient();
            if (client) {
                return [2 /*return*/, client.close(timeout)];
            }
            flags_1.IS_DEBUG_BUILD && utils_1.logger.warn('Cannot flush events and disable SDK. No client defined.');
            return [2 /*return*/, Promise.resolve(false)];
        });
    });
}
exports.close = close;
/**
 * Function that takes an instance of NodeClient and checks if autoSessionTracking option is enabled for that client
 */
function isAutoSessionTrackingEnabled(client) {
    if (client === undefined) {
        return false;
    }
    var clientOptions = client && client.getOptions();
    if (clientOptions && clientOptions.autoSessionTracking !== undefined) {
        return clientOptions.autoSessionTracking;
    }
    return false;
}
exports.isAutoSessionTrackingEnabled = isAutoSessionTrackingEnabled;
/**
 * Returns a release dynamically from environment variables.
 */
function getSentryRelease(fallback) {
    // Always read first as Sentry takes this as precedence
    if (process.env.SENTRY_RELEASE) {
        return process.env.SENTRY_RELEASE;
    }
    // This supports the variable that sentry-webpack-plugin injects
    var global = utils_1.getGlobalObject();
    if (global.SENTRY_RELEASE && global.SENTRY_RELEASE.id) {
        return global.SENTRY_RELEASE.id;
    }
    return (
    // GitHub Actions - https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables#default-environment-variables
    process.env.GITHUB_SHA ||
        // Netlify - https://docs.netlify.com/configure-builds/environment-variables/#build-metadata
        process.env.COMMIT_REF ||
        // Vercel - https://vercel.com/docs/v2/build-step#system-environment-variables
        process.env.VERCEL_GIT_COMMIT_SHA ||
        process.env.VERCEL_GITHUB_COMMIT_SHA ||
        process.env.VERCEL_GITLAB_COMMIT_SHA ||
        process.env.VERCEL_BITBUCKET_COMMIT_SHA ||
        // Zeit (now known as Vercel)
        process.env.ZEIT_GITHUB_COMMIT_SHA ||
        process.env.ZEIT_GITLAB_COMMIT_SHA ||
        process.env.ZEIT_BITBUCKET_COMMIT_SHA ||
        fallback);
}
exports.getSentryRelease = getSentryRelease;
/**
 * Enable automatic Session Tracking for the node process.
 */
function startSessionTracking() {
    var hub = core_1.getCurrentHub();
    hub.startSession();
    // Emitted in the case of healthy sessions, error of `mechanism.handled: true` and unhandledrejections because
    // The 'beforeExit' event is not emitted for conditions causing explicit termination,
    // such as calling process.exit() or uncaught exceptions.
    // Ref: https://nodejs.org/api/process.html#process_event_beforeexit
    process.on('beforeExit', function () {
        var _a;
        var session = (_a = hub.getScope()) === null || _a === void 0 ? void 0 : _a.getSession();
        var terminalStates = ['exited', 'crashed'];
        // Only call endSession, if the Session exists on Scope and SessionStatus is not a
        // Terminal Status i.e. Exited or Crashed because
        // "When a session is moved away from ok it must not be updated anymore."
        // Ref: https://develop.sentry.dev/sdk/sessions/
        if (session && !terminalStates.includes(session.status))
            hub.endSession();
    });
}
//# sourceMappingURL=sdk.js.map

/***/ }),

/***/ 31804:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(58634);
/** Gets the module */
function getModule(filename) {
    if (!filename) {
        return;
    }
    // We could use optional chaining here but webpack does like that mixed with require
    var base = ((__WEBPACK_EXTERNAL_createRequire(import.meta.url) && __WEBPACK_EXTERNAL_createRequire(import.meta.url).main && __WEBPACK_EXTERNAL_createRequire(import.meta.url).main.filename && utils_1.dirname(__WEBPACK_EXTERNAL_createRequire(import.meta.url).main.filename)) || global.process.cwd()) + "/";
    // It's specifically a module
    var file = utils_1.basename(filename, '.js');
    var path = utils_1.dirname(filename);
    var n = path.lastIndexOf('/node_modules/');
    if (n > -1) {
        // /node_modules/ is 14 chars
        return path.substr(n + 14).replace(/\//g, '.') + ":" + file;
    }
    // Let's see if it's a part of the main module
    // To be a part of main module, it has to share the same base
    n = (path + "/").lastIndexOf(base, 0);
    if (n === 0) {
        var moduleName = path.substr(base.length).replace(/\//g, '.');
        if (moduleName) {
            moduleName += ':';
        }
        moduleName += file;
        return moduleName;
    }
    return file;
}
var FILENAME_MATCH = /^\s*[-]{4,}$/;
var FULL_MATCH = /at (?:async )?(?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/;
// eslint-disable-next-line complexity
var node = function (line) {
    var _a;
    if (line.match(FILENAME_MATCH)) {
        return {
            filename: line,
        };
    }
    var lineMatch = line.match(FULL_MATCH);
    if (!lineMatch) {
        return undefined;
    }
    var object;
    var method;
    var functionName;
    var typeName;
    var methodName;
    if (lineMatch[1]) {
        functionName = lineMatch[1];
        var methodStart = functionName.lastIndexOf('.');
        if (functionName[methodStart - 1] === '.') {
            // eslint-disable-next-line no-plusplus
            methodStart--;
        }
        if (methodStart > 0) {
            object = functionName.substr(0, methodStart);
            method = functionName.substr(methodStart + 1);
            var objectEnd = object.indexOf('.Module');
            if (objectEnd > 0) {
                functionName = functionName.substr(objectEnd + 1);
                object = object.substr(0, objectEnd);
            }
        }
        typeName = undefined;
    }
    if (method) {
        typeName = object;
        methodName = method;
    }
    if (method === '<anonymous>') {
        methodName = undefined;
        functionName = undefined;
    }
    if (functionName === undefined) {
        methodName = methodName || '<anonymous>';
        functionName = typeName ? typeName + "." + methodName : methodName;
    }
    var filename = ((_a = lineMatch[2]) === null || _a === void 0 ? void 0 : _a.startsWith('file://')) ? lineMatch[2].substr(7) : lineMatch[2];
    var isNative = lineMatch[5] === 'native';
    var isInternal = isNative || (filename && !filename.startsWith('/') && !filename.startsWith('.') && filename.indexOf(':\\') !== 1);
    // in_app is all that's not an internal Node function or a module within node_modules
    // note that isNative appears to return true even for node core libraries
    // see https://github.com/getsentry/raven-node/issues/176
    var in_app = !isInternal && filename !== undefined && !filename.includes('node_modules/');
    return {
        filename: filename,
        module: getModule(filename),
        function: functionName,
        lineno: parseInt(lineMatch[3], 10) || undefined,
        colno: parseInt(lineMatch[4], 10) || undefined,
        in_app: in_app,
    };
};
exports.nodeStackParser = [90, node];
//# sourceMappingURL=stack-parser.js.map

/***/ }),

/***/ 49323:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var core_1 = __webpack_require__(79475);
var utils_1 = __webpack_require__(58634);
var fs = __webpack_require__(79896);
var url_1 = __webpack_require__(87016);
var flags_1 = __webpack_require__(597);
var version_1 = __webpack_require__(10510);
var CATEGORY_MAPPING = {
    event: 'error',
    transaction: 'transaction',
    session: 'session',
    attachment: 'attachment',
};
/** Base Transport class implementation */
var BaseTransport = /** @class */ (function () {
    /** Create instance and set this.dsn */
    function BaseTransport(options) {
        this.options = options;
        /** A simple buffer holding all requests. */
        this._buffer = utils_1.makePromiseBuffer(30);
        /** Locks transport after receiving rate limits in a response */
        this._rateLimits = {};
        /** Default function used to parse URLs */
        this.urlParser = function (url) { return new url_1.URL(url); };
        // eslint-disable-next-line deprecation/deprecation
        this._api = core_1.initAPIDetails(options.dsn, options._metadata, options.tunnel);
    }
    /**
     * @inheritDoc
     */
    BaseTransport.prototype.sendEvent = function (_) {
        throw new utils_1.SentryError('Transport Class has to implement `sendEvent` method.');
    };
    /**
     * @inheritDoc
     */
    BaseTransport.prototype.close = function (timeout) {
        return this._buffer.drain(timeout);
    };
    /**
     * Extracts proxy settings from client options and env variables.
     *
     * Honors `no_proxy` env variable with the highest priority to allow for hosts exclusion.
     *
     * An order of priority for available protocols is:
     * `http`  => `options.httpProxy` | `process.env.http_proxy`
     * `https` => `options.httpsProxy` | `options.httpProxy` | `process.env.https_proxy` | `process.env.http_proxy`
     */
    BaseTransport.prototype._getProxy = function (protocol) {
        var e_1, _a;
        var _b = process.env, no_proxy = _b.no_proxy, http_proxy = _b.http_proxy, https_proxy = _b.https_proxy;
        var _c = this.options, httpProxy = _c.httpProxy, httpsProxy = _c.httpsProxy;
        var proxy = protocol === 'http' ? httpProxy || http_proxy : httpsProxy || httpProxy || https_proxy || http_proxy;
        if (!no_proxy) {
            return proxy;
        }
        var _d = this._api.dsn, host = _d.host, port = _d.port;
        try {
            for (var _e = tslib_1.__values(no_proxy.split(',')), _f = _e.next(); !_f.done; _f = _e.next()) {
                var np = _f.value;
                if (host.endsWith(np) || (host + ":" + port).endsWith(np)) {
                    return;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return proxy;
    };
    /** Returns a build request option object used by request */
    BaseTransport.prototype._getRequestOptions = function (urlParts) {
        var headers = tslib_1.__assign(tslib_1.__assign({}, core_1.getRequestHeaders(this._api.dsn, version_1.SDK_NAME, core_1.SDK_VERSION)), this.options.headers);
        var hostname = urlParts.hostname, pathname = urlParts.pathname, port = urlParts.port, protocol = urlParts.protocol;
        // See https://github.com/nodejs/node/blob/38146e717fed2fabe3aacb6540d839475e0ce1c6/lib/internal/url.js#L1268-L1290
        // We ignore the query string on purpose
        var path = "" + pathname;
        return tslib_1.__assign({ agent: this.client, headers: headers,
            hostname: hostname, method: 'POST', path: path,
            port: port,
            protocol: protocol }, (this.options.caCerts && {
            ca: fs.readFileSync(this.options.caCerts),
        }));
    };
    /**
     * Gets the time that given category is disabled until for rate limiting
     */
    BaseTransport.prototype._disabledUntil = function (requestType) {
        var category = CATEGORY_MAPPING[requestType];
        return this._rateLimits[category] || this._rateLimits.all;
    };
    /**
     * Checks if a category is rate limited
     */
    BaseTransport.prototype._isRateLimited = function (requestType) {
        return this._disabledUntil(requestType) > new Date(Date.now());
    };
    /**
     * Sets internal _rateLimits from incoming headers. Returns true if headers contains a non-empty rate limiting header.
     */
    BaseTransport.prototype._handleRateLimit = function (headers) {
        var e_2, _a, e_3, _b;
        var now = Date.now();
        var rlHeader = headers['x-sentry-rate-limits'];
        var raHeader = headers['retry-after'];
        if (rlHeader) {
            try {
                // rate limit headers are of the form
                //     <header>,<header>,..
                // where each <header> is of the form
                //     <retry_after>: <categories>: <scope>: <reason_code>
                // where
                //     <retry_after> is a delay in ms
                //     <categories> is the event type(s) (error, transaction, etc) being rate limited and is of the form
                //         <category>;<category>;...
                //     <scope> is what's being limited (org, project, or key) - ignored by SDK
                //     <reason_code> is an arbitrary string like "org_quota" - ignored by SDK
                for (var _c = tslib_1.__values(rlHeader.trim().split(',')), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var limit = _d.value;
                    var parameters = limit.split(':', 2);
                    var headerDelay = parseInt(parameters[0], 10);
                    var delay = (!isNaN(headerDelay) ? headerDelay : 60) * 1000; // 60sec default
                    try {
                        for (var _e = (e_3 = void 0, tslib_1.__values((parameters[1] && parameters[1].split(';')) || ['all'])), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var category = _f.value;
                            // categoriesAllowed is added here to ensure we are only storing rate limits for categories we support in this
                            // sdk and any categories that are not supported will not be added redundantly to the rateLimits object
                            var categoriesAllowed = tslib_1.__spread(Object.keys(CATEGORY_MAPPING).map(function (k) { return CATEGORY_MAPPING[k]; }), [
                                'all',
                            ]);
                            if (categoriesAllowed.includes(category))
                                this._rateLimits[category] = new Date(now + delay);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return true;
        }
        else if (raHeader) {
            this._rateLimits.all = new Date(now + utils_1.parseRetryAfterHeader(raHeader, now));
            return true;
        }
        return false;
    };
    /** JSDoc */
    BaseTransport.prototype._send = function (sentryRequest, originalPayload) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                if (!this.module) {
                    throw new utils_1.SentryError('No module available');
                }
                if (originalPayload && this._isRateLimited(sentryRequest.type)) {
                    return [2 /*return*/, Promise.reject({
                            payload: originalPayload,
                            type: sentryRequest.type,
                            reason: "Transport for " + sentryRequest.type + " requests locked till " + this._disabledUntil(sentryRequest.type) + " due to too many requests.",
                            status: 429,
                        })];
                }
                return [2 /*return*/, this._buffer.add(function () {
                        return new Promise(function (resolve, reject) {
                            if (!_this.module) {
                                throw new utils_1.SentryError('No module available');
                            }
                            var options = _this._getRequestOptions(_this.urlParser(sentryRequest.url));
                            var req = _this.module.request(options, function (res) {
                                var statusCode = res.statusCode || 500;
                                var status = utils_1.eventStatusFromHttpCode(statusCode);
                                res.setEncoding('utf8');
                                /**
                                 * "Key-value pairs of header names and values. Header names are lower-cased."
                                 * https://nodejs.org/api/http.html#http_message_headers
                                 */
                                var retryAfterHeader = res.headers ? res.headers['retry-after'] : '';
                                retryAfterHeader = (Array.isArray(retryAfterHeader) ? retryAfterHeader[0] : retryAfterHeader);
                                var rlHeader = res.headers ? res.headers['x-sentry-rate-limits'] : '';
                                rlHeader = (Array.isArray(rlHeader) ? rlHeader[0] : rlHeader);
                                var headers = {
                                    'x-sentry-rate-limits': rlHeader,
                                    'retry-after': retryAfterHeader,
                                };
                                var limited = _this._handleRateLimit(headers);
                                if (limited)
                                    flags_1.IS_DEBUG_BUILD &&
                                        utils_1.logger.warn("Too many " + sentryRequest.type + " requests, backing off until: " + _this._disabledUntil(sentryRequest.type));
                                if (status === 'success') {
                                    resolve({ status: status });
                                }
                                else {
                                    var rejectionMessage = "HTTP Error (" + statusCode + ")";
                                    if (res.headers && res.headers['x-sentry-error']) {
                                        rejectionMessage += ": " + res.headers['x-sentry-error'];
                                    }
                                    reject(new utils_1.SentryError(rejectionMessage));
                                }
                                // Force the socket to drain
                                res.on('data', function () {
                                    // Drain
                                });
                                res.on('end', function () {
                                    // Drain
                                });
                            });
                            req.on('error', reject);
                            req.end(sentryRequest.body);
                        });
                    })];
            });
        });
    };
    return BaseTransport;
}());
exports.BaseTransport = BaseTransport;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 88413:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var core_1 = __webpack_require__(79475);
var http = __webpack_require__(58611);
var base_1 = __webpack_require__(49323);
/** Node http module transport */
var HTTPTransport = /** @class */ (function (_super) {
    tslib_1.__extends(HTTPTransport, _super);
    /** Create a new instance and set this.agent */
    function HTTPTransport(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        var proxy = _this._getProxy('http');
        _this.module = http;
        _this.client = proxy
            ? new (__webpack_require__(44412))(proxy)
            : new http.Agent({ keepAlive: false, maxSockets: 30, timeout: 2000 });
        return _this;
    }
    /**
     * @inheritDoc
     */
    HTTPTransport.prototype.sendEvent = function (event) {
        return this._send(core_1.eventToSentryRequest(event, this._api), event);
    };
    /**
     * @inheritDoc
     */
    HTTPTransport.prototype.sendSession = function (session) {
        return this._send(core_1.sessionToSentryRequest(session, this._api), session);
    };
    return HTTPTransport;
}(base_1.BaseTransport));
exports.HTTPTransport = HTTPTransport;
//# sourceMappingURL=http.js.map

/***/ }),

/***/ 21688:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var core_1 = __webpack_require__(79475);
var https = __webpack_require__(65692);
var base_1 = __webpack_require__(49323);
/** Node https module transport */
var HTTPSTransport = /** @class */ (function (_super) {
    tslib_1.__extends(HTTPSTransport, _super);
    /** Create a new instance and set this.agent */
    function HTTPSTransport(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        var proxy = _this._getProxy('https');
        _this.module = https;
        _this.client = proxy
            ? new (__webpack_require__(44412))(proxy)
            : new https.Agent({ keepAlive: false, maxSockets: 30, timeout: 2000 });
        return _this;
    }
    /**
     * @inheritDoc
     */
    HTTPSTransport.prototype.sendEvent = function (event) {
        return this._send(core_1.eventToSentryRequest(event, this._api), event);
    };
    /**
     * @inheritDoc
     */
    HTTPSTransport.prototype.sendSession = function (session) {
        return this._send(core_1.sessionToSentryRequest(session, this._api), session);
    };
    return HTTPSTransport;
}(base_1.BaseTransport));
exports.HTTPSTransport = HTTPSTransport;
//# sourceMappingURL=https.js.map

/***/ }),

/***/ 79905:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var base_1 = __webpack_require__(49323);
exports.BaseTransport = base_1.BaseTransport;
var http_1 = __webpack_require__(88413);
exports.HTTPTransport = http_1.HTTPTransport;
var https_1 = __webpack_require__(21688);
exports.HTTPSTransport = https_1.HTTPSTransport;
var new_1 = __webpack_require__(86867);
exports.makeNodeTransport = new_1.makeNodeTransport;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 86867:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var core_1 = __webpack_require__(79475);
var utils_1 = __webpack_require__(58634);
var http = __webpack_require__(58611);
var https = __webpack_require__(65692);
var url_1 = __webpack_require__(87016);
/**
 * Creates a Transport that uses native the native 'http' and 'https' modules to send events to Sentry.
 */
function makeNodeTransport(options) {
    var _a;
    var urlSegments = new url_1.URL(options.url);
    var isHttps = urlSegments.protocol === 'https:';
    // Proxy prioritization: http => `options.proxy` | `process.env.http_proxy`
    // Proxy prioritization: https => `options.proxy` | `process.env.https_proxy` | `process.env.http_proxy`
    var proxy = applyNoProxyOption(urlSegments, options.proxy || (isHttps ? process.env.https_proxy : undefined) || process.env.http_proxy);
    var nativeHttpModule = isHttps ? https : http;
    // TODO(v7): Evaluate if we can set keepAlive to true. This would involve testing for memory leaks in older node
    // versions(>= 8) as they had memory leaks when using it: #2555
    var agent = proxy
        ? new (__webpack_require__(44412))(proxy)
        : new nativeHttpModule.Agent({ keepAlive: false, maxSockets: 30, timeout: 2000 });
    var requestExecutor = createRequestExecutor(options, (_a = options.httpModule, (_a !== null && _a !== void 0 ? _a : nativeHttpModule)), agent);
    return core_1.createTransport({ bufferSize: options.bufferSize }, requestExecutor);
}
exports.makeNodeTransport = makeNodeTransport;
/**
 * Honors the `no_proxy` env variable with the highest priority to allow for hosts exclusion.
 *
 * @param transportUrl The URL the transport intends to send events to.
 * @param proxy The client configured proxy.
 * @returns A proxy the transport should use.
 */
function applyNoProxyOption(transportUrlSegments, proxy) {
    var no_proxy = process.env.no_proxy;
    var urlIsExemptFromProxy = no_proxy &&
        no_proxy
            .split(',')
            .some(function (exemption) { return transportUrlSegments.host.endsWith(exemption) || transportUrlSegments.hostname.endsWith(exemption); });
    if (urlIsExemptFromProxy) {
        return undefined;
    }
    else {
        return proxy;
    }
}
/**
 * Creates a RequestExecutor to be used with `createTransport`.
 */
function createRequestExecutor(options, httpModule, agent) {
    var _a = new url_1.URL(options.url), hostname = _a.hostname, pathname = _a.pathname, port = _a.port, protocol = _a.protocol, search = _a.search;
    return function makeRequest(request) {
        return new Promise(function (resolve, reject) {
            var req = httpModule.request({
                method: 'POST',
                agent: agent,
                headers: options.headers,
                hostname: hostname,
                path: "" + pathname + search,
                port: port,
                protocol: protocol,
                ca: options.caCerts,
            }, function (res) {
                var _a, _b, _c;
                res.on('data', function () {
                    // Drain socket
                });
                res.on('end', function () {
                    // Drain socket
                });
                var statusCode = (_a = res.statusCode, (_a !== null && _a !== void 0 ? _a : 500));
                var status = utils_1.eventStatusFromHttpCode(statusCode);
                res.setEncoding('utf8');
                // "Key-value pairs of header names and values. Header names are lower-cased."
                // https://nodejs.org/api/http.html#http_message_headers
                var retryAfterHeader = (_b = res.headers['retry-after'], (_b !== null && _b !== void 0 ? _b : null));
                var rateLimitsHeader = (_c = res.headers['x-sentry-rate-limits'], (_c !== null && _c !== void 0 ? _c : null));
                resolve({
                    headers: {
                        'retry-after': retryAfterHeader,
                        'x-sentry-rate-limits': Array.isArray(rateLimitsHeader) ? rateLimitsHeader[0] : rateLimitsHeader,
                    },
                    reason: status,
                    statusCode: statusCode,
                });
            });
            req.on('error', reject);
            req.end(request.body);
        });
    };
}
//# sourceMappingURL=new.js.map

/***/ }),

/***/ 75531:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
var tslib_1 = __webpack_require__(58159);
var fs = __webpack_require__(79896);
var path = __webpack_require__(16928);
/**
 * Recursively read the contents of a directory.
 *
 * @param targetDir Absolute or relative path of the directory to scan. All returned paths will be relative to this
 * directory.
 * @returns Array holding all relative paths
 */
function deepReadDirSync(targetDir) {
    var targetDirAbsPath = path.resolve(targetDir);
    if (!fs.existsSync(targetDirAbsPath)) {
        throw new Error("Cannot read contents of " + targetDirAbsPath + ". Directory does not exist.");
    }
    if (!fs.statSync(targetDirAbsPath).isDirectory()) {
        throw new Error("Cannot read contents of " + targetDirAbsPath + ", because it is not a directory.");
    }
    // This does the same thing as its containing function, `deepReadDirSync` (except that - purely for convenience - it
    // deals in absolute paths rather than relative ones). We need this to be separate from the outer function to preserve
    // the difference between `targetDirAbsPath` and `currentDirAbsPath`.
    var deepReadCurrentDir = function (currentDirAbsPath) {
        return fs.readdirSync(currentDirAbsPath).reduce(function (absPaths, itemName) {
            var itemAbsPath = path.join(currentDirAbsPath, itemName);
            if (fs.statSync(itemAbsPath).isDirectory()) {
                return tslib_1.__spread(absPaths, deepReadCurrentDir(itemAbsPath));
            }
            return tslib_1.__spread(absPaths, [itemAbsPath]);
        }, []);
    };
    return deepReadCurrentDir(targetDirAbsPath).map(function (absPath) { return path.relative(targetDirAbsPath, absPath); });
}
exports.deepReadDirSync = deepReadDirSync;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 10510:
/***/ ((__unused_webpack_module, exports) => {

Object.defineProperty(exports, "__esModule", ({ value: true }));
// TODO: Remove in the next major release and rely only on @sentry/core SDK_VERSION and SdkMetadata
exports.SDK_NAME = 'sentry.javascript.node';
//# sourceMappingURL=version.js.map

/***/ }),

/***/ 39568:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const events_1 = __webpack_require__(24434);
const debug_1 = __importDefault(__webpack_require__(44645));
const promisify_1 = __importDefault(__webpack_require__(37752));
const debug = debug_1.default('agent-base');
function isAgent(v) {
    return Boolean(v) && typeof v.addRequest === 'function';
}
function isSecureEndpoint() {
    const { stack } = new Error();
    if (typeof stack !== 'string')
        return false;
    return stack.split('\n').some(l => l.indexOf('(https.js:') !== -1 || l.indexOf('node:https:') !== -1);
}
function createAgent(callback, opts) {
    return new createAgent.Agent(callback, opts);
}
(function (createAgent) {
    /**
     * Base `http.Agent` implementation.
     * No pooling/keep-alive is implemented by default.
     *
     * @param {Function} callback
     * @api public
     */
    class Agent extends events_1.EventEmitter {
        constructor(callback, _opts) {
            super();
            let opts = _opts;
            if (typeof callback === 'function') {
                this.callback = callback;
            }
            else if (callback) {
                opts = callback;
            }
            // Timeout for the socket to be returned from the callback
            this.timeout = null;
            if (opts && typeof opts.timeout === 'number') {
                this.timeout = opts.timeout;
            }
            // These aren't actually used by `agent-base`, but are required
            // for the TypeScript definition files in `@types/node` :/
            this.maxFreeSockets = 1;
            this.maxSockets = 1;
            this.maxTotalSockets = Infinity;
            this.sockets = {};
            this.freeSockets = {};
            this.requests = {};
            this.options = {};
        }
        get defaultPort() {
            if (typeof this.explicitDefaultPort === 'number') {
                return this.explicitDefaultPort;
            }
            return isSecureEndpoint() ? 443 : 80;
        }
        set defaultPort(v) {
            this.explicitDefaultPort = v;
        }
        get protocol() {
            if (typeof this.explicitProtocol === 'string') {
                return this.explicitProtocol;
            }
            return isSecureEndpoint() ? 'https:' : 'http:';
        }
        set protocol(v) {
            this.explicitProtocol = v;
        }
        callback(req, opts, fn) {
            throw new Error('"agent-base" has no default implementation, you must subclass and override `callback()`');
        }
        /**
         * Called by node-core's "_http_client.js" module when creating
         * a new HTTP request with this Agent instance.
         *
         * @api public
         */
        addRequest(req, _opts) {
            const opts = Object.assign({}, _opts);
            if (typeof opts.secureEndpoint !== 'boolean') {
                opts.secureEndpoint = isSecureEndpoint();
            }
            if (opts.host == null) {
                opts.host = 'localhost';
            }
            if (opts.port == null) {
                opts.port = opts.secureEndpoint ? 443 : 80;
            }
            if (opts.protocol == null) {
                opts.protocol = opts.secureEndpoint ? 'https:' : 'http:';
            }
            if (opts.host && opts.path) {
                // If both a `host` and `path` are specified then it's most
                // likely the result of a `url.parse()` call... we need to
                // remove the `path` portion so that `net.connect()` doesn't
                // attempt to open that as a unix socket file.
                delete opts.path;
            }
            delete opts.agent;
            delete opts.hostname;
            delete opts._defaultAgent;
            delete opts.defaultPort;
            delete opts.createConnection;
            // Hint to use "Connection: close"
            // XXX: non-documented `http` module API :(
            req._last = true;
            req.shouldKeepAlive = false;
            let timedOut = false;
            let timeoutId = null;
            const timeoutMs = opts.timeout || this.timeout;
            const onerror = (err) => {
                if (req._hadError)
                    return;
                req.emit('error', err);
                // For Safety. Some additional errors might fire later on
                // and we need to make sure we don't double-fire the error event.
                req._hadError = true;
            };
            const ontimeout = () => {
                timeoutId = null;
                timedOut = true;
                const err = new Error(`A "socket" was not created for HTTP request before ${timeoutMs}ms`);
                err.code = 'ETIMEOUT';
                onerror(err);
            };
            const callbackError = (err) => {
                if (timedOut)
                    return;
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                onerror(err);
            };
            const onsocket = (socket) => {
                if (timedOut)
                    return;
                if (timeoutId != null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                if (isAgent(socket)) {
                    // `socket` is actually an `http.Agent` instance, so
                    // relinquish responsibility for this `req` to the Agent
                    // from here on
                    debug('Callback returned another Agent instance %o', socket.constructor.name);
                    socket.addRequest(req, opts);
                    return;
                }
                if (socket) {
                    socket.once('free', () => {
                        this.freeSocket(socket, opts);
                    });
                    req.onSocket(socket);
                    return;
                }
                const err = new Error(`no Duplex stream was returned to agent-base for \`${req.method} ${req.path}\``);
                onerror(err);
            };
            if (typeof this.callback !== 'function') {
                onerror(new Error('`callback` is not defined'));
                return;
            }
            if (!this.promisifiedCallback) {
                if (this.callback.length >= 3) {
                    debug('Converting legacy callback function to promise');
                    this.promisifiedCallback = promisify_1.default(this.callback);
                }
                else {
                    this.promisifiedCallback = this.callback;
                }
            }
            if (typeof timeoutMs === 'number' && timeoutMs > 0) {
                timeoutId = setTimeout(ontimeout, timeoutMs);
            }
            if ('port' in opts && typeof opts.port !== 'number') {
                opts.port = Number(opts.port);
            }
            try {
                debug('Resolving socket for %o request: %o', opts.protocol, `${req.method} ${req.path}`);
                Promise.resolve(this.promisifiedCallback(req, opts)).then(onsocket, callbackError);
            }
            catch (err) {
                Promise.reject(err).catch(callbackError);
            }
        }
        freeSocket(socket, opts) {
            debug('Freeing socket %o %o', socket.constructor.name, opts);
            socket.destroy();
        }
        destroy() {
            debug('Destroying agent %o', this.constructor.name);
        }
    }
    createAgent.Agent = Agent;
    // So that `instanceof` works correctly
    createAgent.prototype = createAgent.Agent.prototype;
})(createAgent || (createAgent = {}));
module.exports = createAgent;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 37752:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function promisify(fn) {
    return function (req, opts) {
        return new Promise((resolve, reject) => {
            fn.call(this, req, opts, (err, rtn) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rtn);
                }
            });
        });
    };
}
exports["default"] = promisify;
//# sourceMappingURL=promisify.js.map

/***/ }),

/***/ 7629:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const net_1 = __importDefault(__webpack_require__(69278));
const tls_1 = __importDefault(__webpack_require__(64756));
const url_1 = __importDefault(__webpack_require__(87016));
const assert_1 = __importDefault(__webpack_require__(42613));
const debug_1 = __importDefault(__webpack_require__(44645));
const agent_base_1 = __webpack_require__(39568);
const parse_proxy_response_1 = __importDefault(__webpack_require__(19480));
const debug = debug_1.default('https-proxy-agent:agent');
/**
 * The `HttpsProxyAgent` implements an HTTP Agent subclass that connects to
 * the specified "HTTP(s) proxy server" in order to proxy HTTPS requests.
 *
 * Outgoing HTTP requests are first tunneled through the proxy server using the
 * `CONNECT` HTTP request method to establish a connection to the proxy server,
 * and then the proxy server connects to the destination target and issues the
 * HTTP request from the proxy server.
 *
 * `https:` requests have their socket connection upgraded to TLS once
 * the connection to the proxy server has been established.
 *
 * @api public
 */
class HttpsProxyAgent extends agent_base_1.Agent {
    constructor(_opts) {
        let opts;
        if (typeof _opts === 'string') {
            opts = url_1.default.parse(_opts);
        }
        else {
            opts = _opts;
        }
        if (!opts) {
            throw new Error('an HTTP(S) proxy server `host` and `port` must be specified!');
        }
        debug('creating new HttpsProxyAgent instance: %o', opts);
        super(opts);
        const proxy = Object.assign({}, opts);
        // If `true`, then connect to the proxy server over TLS.
        // Defaults to `false`.
        this.secureProxy = opts.secureProxy || isHTTPS(proxy.protocol);
        // Prefer `hostname` over `host`, and set the `port` if needed.
        proxy.host = proxy.hostname || proxy.host;
        if (typeof proxy.port === 'string') {
            proxy.port = parseInt(proxy.port, 10);
        }
        if (!proxy.port && proxy.host) {
            proxy.port = this.secureProxy ? 443 : 80;
        }
        // ALPN is supported by Node.js >= v5.
        // attempt to negotiate http/1.1 for proxy servers that support http/2
        if (this.secureProxy && !('ALPNProtocols' in proxy)) {
            proxy.ALPNProtocols = ['http 1.1'];
        }
        if (proxy.host && proxy.path) {
            // If both a `host` and `path` are specified then it's most likely
            // the result of a `url.parse()` call... we need to remove the
            // `path` portion so that `net.connect()` doesn't attempt to open
            // that as a Unix socket file.
            delete proxy.path;
            delete proxy.pathname;
        }
        this.proxy = proxy;
    }
    /**
     * Called when the node-core HTTP client library is creating a
     * new HTTP request.
     *
     * @api protected
     */
    callback(req, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { proxy, secureProxy } = this;
            // Create a socket connection to the proxy server.
            let socket;
            if (secureProxy) {
                debug('Creating `tls.Socket`: %o', proxy);
                socket = tls_1.default.connect(proxy);
            }
            else {
                debug('Creating `net.Socket`: %o', proxy);
                socket = net_1.default.connect(proxy);
            }
            const headers = Object.assign({}, proxy.headers);
            const hostname = `${opts.host}:${opts.port}`;
            let payload = `CONNECT ${hostname} HTTP/1.1\r\n`;
            // Inject the `Proxy-Authorization` header if necessary.
            if (proxy.auth) {
                headers['Proxy-Authorization'] = `Basic ${Buffer.from(proxy.auth).toString('base64')}`;
            }
            // The `Host` header should only include the port
            // number when it is not the default port.
            let { host, port, secureEndpoint } = opts;
            if (!isDefaultPort(port, secureEndpoint)) {
                host += `:${port}`;
            }
            headers.Host = host;
            headers.Connection = 'close';
            for (const name of Object.keys(headers)) {
                payload += `${name}: ${headers[name]}\r\n`;
            }
            const proxyResponsePromise = parse_proxy_response_1.default(socket);
            socket.write(`${payload}\r\n`);
            const { statusCode, buffered } = yield proxyResponsePromise;
            if (statusCode === 200) {
                req.once('socket', resume);
                if (opts.secureEndpoint) {
                    // The proxy is connecting to a TLS server, so upgrade
                    // this socket connection to a TLS connection.
                    debug('Upgrading socket connection to TLS');
                    const servername = opts.servername || opts.host;
                    return tls_1.default.connect(Object.assign(Object.assign({}, omit(opts, 'host', 'hostname', 'path', 'port')), { socket,
                        servername }));
                }
                return socket;
            }
            // Some other status code that's not 200... need to re-play the HTTP
            // header "data" events onto the socket once the HTTP machinery is
            // attached so that the node core `http` can parse and handle the
            // error status code.
            // Close the original socket, and a new "fake" socket is returned
            // instead, so that the proxy doesn't get the HTTP request
            // written to it (which may contain `Authorization` headers or other
            // sensitive data).
            //
            // See: https://hackerone.com/reports/541502
            socket.destroy();
            const fakeSocket = new net_1.default.Socket({ writable: false });
            fakeSocket.readable = true;
            // Need to wait for the "socket" event to re-play the "data" events.
            req.once('socket', (s) => {
                debug('replaying proxy buffer for failed request');
                assert_1.default(s.listenerCount('data') > 0);
                // Replay the "buffered" Buffer onto the fake `socket`, since at
                // this point the HTTP module machinery has been hooked up for
                // the user.
                s.push(buffered);
                s.push(null);
            });
            return fakeSocket;
        });
    }
}
exports["default"] = HttpsProxyAgent;
function resume(socket) {
    socket.resume();
}
function isDefaultPort(port, secure) {
    return Boolean((!secure && port === 80) || (secure && port === 443));
}
function isHTTPS(protocol) {
    return typeof protocol === 'string' ? /^https:?$/i.test(protocol) : false;
}
function omit(obj, ...keys) {
    const ret = {};
    let key;
    for (key in obj) {
        if (!keys.includes(key)) {
            ret[key] = obj[key];
        }
    }
    return ret;
}
//# sourceMappingURL=agent.js.map

/***/ }),

/***/ 44412:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const agent_1 = __importDefault(__webpack_require__(7629));
function createHttpsProxyAgent(opts) {
    return new agent_1.default(opts);
}
(function (createHttpsProxyAgent) {
    createHttpsProxyAgent.HttpsProxyAgent = agent_1.default;
    createHttpsProxyAgent.prototype = agent_1.default.prototype;
})(createHttpsProxyAgent || (createHttpsProxyAgent = {}));
module.exports = createHttpsProxyAgent;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 19480:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const debug_1 = __importDefault(__webpack_require__(44645));
const debug = debug_1.default('https-proxy-agent:parse-proxy-response');
function parseProxyResponse(socket) {
    return new Promise((resolve, reject) => {
        // we need to buffer any HTTP traffic that happens with the proxy before we get
        // the CONNECT response, so that if the response is anything other than an "200"
        // response code, then we can re-play the "data" events on the socket once the
        // HTTP parser is hooked up...
        let buffersLength = 0;
        const buffers = [];
        function read() {
            const b = socket.read();
            if (b)
                ondata(b);
            else
                socket.once('readable', read);
        }
        function cleanup() {
            socket.removeListener('end', onend);
            socket.removeListener('error', onerror);
            socket.removeListener('close', onclose);
            socket.removeListener('readable', read);
        }
        function onclose(err) {
            debug('onclose had error %o', err);
        }
        function onend() {
            debug('onend');
        }
        function onerror(err) {
            cleanup();
            debug('onerror %o', err);
            reject(err);
        }
        function ondata(b) {
            buffers.push(b);
            buffersLength += b.length;
            const buffered = Buffer.concat(buffers, buffersLength);
            const endOfHeaders = buffered.indexOf('\r\n\r\n');
            if (endOfHeaders === -1) {
                // keep buffering
                debug('have not received end of HTTP headers yet...');
                read();
                return;
            }
            const firstLine = buffered.toString('ascii', 0, buffered.indexOf('\r\n'));
            const statusCode = +firstLine.split(' ')[1];
            debug('got proxy server response: %o', firstLine);
            resolve({
                statusCode,
                buffered
            });
        }
        socket.on('error', onerror);
        socket.on('close', onclose);
        socket.on('end', onend);
        read();
    });
}
exports["default"] = parseProxyResponse;
//# sourceMappingURL=parse-proxy-response.js.map

/***/ }),

/***/ 58159:
/***/ ((module) => {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
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

    __createBinding = function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    };

    __exportStar = function (m, exports) {
        for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
    };

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result["default"] = mod;
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),

/***/ 27273:
/***/ (function(__unused_webpack_module, exports) {

/**
 * A doubly linked list-based Least Recently Used (LRU) cache. Will keep most
 * recently used items while discarding least recently used items when its limit
 * is reached.
 *
 * Licensed under MIT. Copyright (c) 2010 Rasmus Andersson <http://hunch.se/>
 * See README.md for details.
 *
 * Illustration of the design:
 *
 *       entry             entry             entry             entry
 *       ______            ______            ______            ______
 *      | head |.newer => |      |.newer => |      |.newer => | tail |
 *      |  A   |          |  B   |          |  C   |          |  D   |
 *      |______| <= older.|______| <= older.|______| <= older.|______|
 *
 *  removed  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  added
 */
(function(g,f){
  const e =  true ? exports : 0;
  f(e);
  if (typeof define == 'function' && define.amd) { define('lru', e); }
})(this, function(exports) {

const NEWER = Symbol('newer');
const OLDER = Symbol('older');

function LRUMap(limit, entries) {
  if (typeof limit !== 'number') {
    // called as (entries)
    entries = limit;
    limit = 0;
  }

  this.size = 0;
  this.limit = limit;
  this.oldest = this.newest = undefined;
  this._keymap = new Map();

  if (entries) {
    this.assign(entries);
    if (limit < 1) {
      this.limit = this.size;
    }
  }
}

exports.LRUMap = LRUMap;

function Entry(key, value) {
  this.key = key;
  this.value = value;
  this[NEWER] = undefined;
  this[OLDER] = undefined;
}


LRUMap.prototype._markEntryAsUsed = function(entry) {
  if (entry === this.newest) {
    // Already the most recenlty used entry, so no need to update the list
    return;
  }
  // HEAD--------------TAIL
  //   <.older   .newer>
  //  <--- add direction --
  //   A  B  C  <D>  E
  if (entry[NEWER]) {
    if (entry === this.oldest) {
      this.oldest = entry[NEWER];
    }
    entry[NEWER][OLDER] = entry[OLDER]; // C <-- E.
  }
  if (entry[OLDER]) {
    entry[OLDER][NEWER] = entry[NEWER]; // C. --> E
  }
  entry[NEWER] = undefined; // D --x
  entry[OLDER] = this.newest; // D. --> E
  if (this.newest) {
    this.newest[NEWER] = entry; // E. <-- D
  }
  this.newest = entry;
};

LRUMap.prototype.assign = function(entries) {
  let entry, limit = this.limit || Number.MAX_VALUE;
  this._keymap.clear();
  let it = entries[Symbol.iterator]();
  for (let itv = it.next(); !itv.done; itv = it.next()) {
    let e = new Entry(itv.value[0], itv.value[1]);
    this._keymap.set(e.key, e);
    if (!entry) {
      this.oldest = e;
    } else {
      entry[NEWER] = e;
      e[OLDER] = entry;
    }
    entry = e;
    if (limit-- == 0) {
      throw new Error('overflow');
    }
  }
  this.newest = entry;
  this.size = this._keymap.size;
};

LRUMap.prototype.get = function(key) {
  // First, find our cache entry
  var entry = this._keymap.get(key);
  if (!entry) return; // Not cached. Sorry.
  // As <key> was found in the cache, register it as being requested recently
  this._markEntryAsUsed(entry);
  return entry.value;
};

LRUMap.prototype.set = function(key, value) {
  var entry = this._keymap.get(key);

  if (entry) {
    // update existing
    entry.value = value;
    this._markEntryAsUsed(entry);
    return this;
  }

  // new entry
  this._keymap.set(key, (entry = new Entry(key, value)));

  if (this.newest) {
    // link previous tail to the new tail (entry)
    this.newest[NEWER] = entry;
    entry[OLDER] = this.newest;
  } else {
    // we're first in -- yay
    this.oldest = entry;
  }

  // add new entry to the end of the linked list -- it's now the freshest entry.
  this.newest = entry;
  ++this.size;
  if (this.size > this.limit) {
    // we hit the limit -- remove the head
    this.shift();
  }

  return this;
};

LRUMap.prototype.shift = function() {
  // todo: handle special case when limit == 1
  var entry = this.oldest;
  if (entry) {
    if (this.oldest[NEWER]) {
      // advance the list
      this.oldest = this.oldest[NEWER];
      this.oldest[OLDER] = undefined;
    } else {
      // the cache is exhausted
      this.oldest = undefined;
      this.newest = undefined;
    }
    // Remove last strong reference to <entry> and remove links from the purged
    // entry being returned:
    entry[NEWER] = entry[OLDER] = undefined;
    this._keymap.delete(entry.key);
    --this.size;
    return [entry.key, entry.value];
  }
};

// ----------------------------------------------------------------------------
// Following code is optional and can be removed without breaking the core
// functionality.

LRUMap.prototype.find = function(key) {
  let e = this._keymap.get(key);
  return e ? e.value : undefined;
};

LRUMap.prototype.has = function(key) {
  return this._keymap.has(key);
};

LRUMap.prototype['delete'] = function(key) {
  var entry = this._keymap.get(key);
  if (!entry) return;
  this._keymap.delete(entry.key);
  if (entry[NEWER] && entry[OLDER]) {
    // relink the older entry with the newer entry
    entry[OLDER][NEWER] = entry[NEWER];
    entry[NEWER][OLDER] = entry[OLDER];
  } else if (entry[NEWER]) {
    // remove the link to us
    entry[NEWER][OLDER] = undefined;
    // link the newer entry to head
    this.oldest = entry[NEWER];
  } else if (entry[OLDER]) {
    // remove the link to us
    entry[OLDER][NEWER] = undefined;
    // link the newer entry to head
    this.newest = entry[OLDER];
  } else {// if(entry[OLDER] === undefined && entry.newer === undefined) {
    this.oldest = this.newest = undefined;
  }

  this.size--;
  return entry.value;
};

LRUMap.prototype.clear = function() {
  // Not clearing links should be safe, as we don't expose live links to user
  this.oldest = this.newest = undefined;
  this.size = 0;
  this._keymap.clear();
};


function EntryIterator(oldestEntry) { this.entry = oldestEntry; }
EntryIterator.prototype[Symbol.iterator] = function() { return this; }
EntryIterator.prototype.next = function() {
  let ent = this.entry;
  if (ent) {
    this.entry = ent[NEWER];
    return { done: false, value: [ent.key, ent.value] };
  } else {
    return { done: true, value: undefined };
  }
};


function KeyIterator(oldestEntry) { this.entry = oldestEntry; }
KeyIterator.prototype[Symbol.iterator] = function() { return this; }
KeyIterator.prototype.next = function() {
  let ent = this.entry;
  if (ent) {
    this.entry = ent[NEWER];
    return { done: false, value: ent.key };
  } else {
    return { done: true, value: undefined };
  }
};

function ValueIterator(oldestEntry) { this.entry = oldestEntry; }
ValueIterator.prototype[Symbol.iterator] = function() { return this; }
ValueIterator.prototype.next = function() {
  let ent = this.entry;
  if (ent) {
    this.entry = ent[NEWER];
    return { done: false, value: ent.value };
  } else {
    return { done: true, value: undefined };
  }
};


LRUMap.prototype.keys = function() {
  return new KeyIterator(this.oldest);
};

LRUMap.prototype.values = function() {
  return new ValueIterator(this.oldest);
};

LRUMap.prototype.entries = function() {
  return this;
};

LRUMap.prototype[Symbol.iterator] = function() {
  return new EntryIterator(this.oldest);
};

LRUMap.prototype.forEach = function(fun, thisObj) {
  if (typeof thisObj !== 'object') {
    thisObj = this;
  }
  let entry = this.oldest;
  while (entry) {
    fun.call(thisObj, entry.value, entry.key, this);
    entry = entry[NEWER];
  }
};

/** Returns a JSON (array) representation */
LRUMap.prototype.toJSON = function() {
  var s = new Array(this.size), i = 0, entry = this.oldest;
  while (entry) {
    s[i++] = { key: entry.key, value: entry.value };
    entry = entry[NEWER];
  }
  return s;
};

/** Returns a String representation */
LRUMap.prototype.toString = function() {
  var s = '', entry = this.oldest;
  while (entry) {
    s += String(entry.key)+':'+entry.value;
    entry = entry[NEWER];
    if (entry) {
      s += ' < ';
    }
  }
  return s;
};

});


/***/ })

};
