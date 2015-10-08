/*
 * ThunderCats-React - Thundercats addon for use with React
 * @version v0.1.0
 * @link http://thundercats.js.org
 * @license MIT
 * @author Berkeley Martinez (http://r3dm.com)
*/

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("rx"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["rx", "react"], factory);
	else if(typeof exports === 'object')
		exports["ThunderCatsReact"] = factory(require("rx"), require("react"));
	else
		root["ThunderCatsReact"] = factory(root["Rx"], root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _Render = __webpack_require__(10);

	Object.defineProperty(exports, 'Render', {
	  enumerable: true,
	  get: function get() {
	    return _Render.Render;
	  }
	});
	Object.defineProperty(exports, 'RenderToString', {
	  enumerable: true,
	  get: function get() {
	    return _Render.RenderToString;
	  }
	});

	var _createContainer = __webpack_require__(11);

	Object.defineProperty(exports, 'contain', {
	  enumerable: true,
	  get: function get() {
	    return _createContainer.contain;
	  }
	});
	Object.defineProperty(exports, 'createContainer', {
	  enumerable: true,
	  get: function get() {
	    return _createContainer.createContainer;
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(12);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (false) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        'Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Object.assign
	 */

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign

	'use strict';

	function assign(target, sources) {
	  if (target == null) {
	    throw new TypeError('Object.assign target cannot be null or undefined');
	  }

	  var to = Object(target);
	  var hasOwnProperty = Object.prototype.hasOwnProperty;

	  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
	    var nextSource = arguments[nextIndex];
	    if (nextSource == null) {
	      continue;
	    }

	    var from = Object(nextSource);

	    // We don't currently support accessors nor proxies. Therefore this
	    // copy cannot throw. If we ever supported this then we must handle
	    // exceptions and side-effects. We don't support symbols so they won't
	    // be transferred.

	    for (var key in from) {
	      if (hasOwnProperty.call(from, key)) {
	        to[key] = from[key];
	      }
	    }
	  }

	  return to;
	}

	module.exports = assign;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule warning
	 */

	"use strict";

	var emptyFunction = __webpack_require__(8);

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = emptyFunction;

	if (false) {
	  warning = function(condition, format ) {for (var args=[],$__0=2,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
	    if (format === undefined) {
	      throw new Error(
	        '`warning(condition, format, ...args)` requires a warning ' +
	        'message argument'
	      );
	    }

	    if (format.length < 10 || /^[s\W]*$/.test(format)) {
	      throw new Error(
	        'The warning format should be able to uniquely identify this ' +
	        'warning. Please, use a more descriptive format than: ' + format
	      );
	    }

	    if (format.indexOf('Failed Composite propType: ') === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }

	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function()  {return args[argIndex++];});
	      console.warn(message);
	      try {
	        // --- Welcome to debugging React ---
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch(x) {}
	    }
	  };
	}

	module.exports = warning;


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.getName = getName;
	exports.getNameOrNull = getNameOrNull;
	exports.isObservable = isObservable;

	function getName(comp) {
	  return '' + (getNameOrNull(comp) || 'Anonymous');
	}

	function getNameOrNull(comp) {
	  return comp && comp.displayName || comp.constructor && comp.constructor.displayName || null;
	}

	function isObservable(observable) {
	  return observable && typeof observable.subscribe === 'function';
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule emptyFunction
	 */

	function makeEmptyFunction(arg) {
	  return function() {
	    return arg;
	  };
	}

	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	function emptyFunction() {}

	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function() { return this; };
	emptyFunction.thatReturnsArgument = function(arg) { return arg; };

	module.exports = emptyFunction;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(6);

	var _react2 = _interopRequireDefault(_react);

	var _reactLibCloneWithProps = __webpack_require__(18);

	var _reactLibCloneWithProps2 = _interopRequireDefault(_reactLibCloneWithProps);

	var _invariant = __webpack_require__(3);

	var _invariant2 = _interopRequireDefault(_invariant);

	var ContextWrapper = _react2['default'].createClass({
	  displayName: 'ThunderCatsContextWrapper',
	  propTypes: {
	    cat: _react2['default'].PropTypes.object.isRequired,
	    children: _react2['default'].PropTypes.element.isRequired
	  },

	  childContextTypes: {
	    cat: _react2['default'].PropTypes.object.isRequired
	  },

	  getChildContext: function getChildContext() {
	    return {
	      cat: this.props.cat
	    };
	  },

	  render: function render() {
	    return (0, _reactLibCloneWithProps2['default'])(this.props.children);
	  }
	});

	// wrap a component in this context wrapper
	ContextWrapper.wrap = function wrap(element, cat) {
	  (0, _invariant2['default'])(_react2['default'].isValidElement(element), 'ContextWrapper wrap expects a valid React element');

	  (0, _invariant2['default'])(typeof cat === 'object', 'ContextWrapper expects an instance of Cat');

	  return _react2['default'].createElement(ContextWrapper, { cat: cat }, element);
	};

	exports['default'] = ContextWrapper;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.fetch = fetch;
	exports.RenderToObs = RenderToObs;
	exports.Render = Render;
	exports.RenderToString = RenderToString;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var _rx = __webpack_require__(1);

	var _rx2 = _interopRequireDefault(_rx);

	var _react = __webpack_require__(6);

	var _react2 = _interopRequireDefault(_react);

	var _debug = __webpack_require__(2);

	var _debug2 = _interopRequireDefault(_debug);

	var _ContextWrapper = __webpack_require__(9);

	var _ContextWrapper2 = _interopRequireDefault(_ContextWrapper);

	var _thundercatsLibWaitFor = __webpack_require__(23);

	var _thundercatsLibWaitFor2 = _interopRequireDefault(_thundercatsLibWaitFor);

	var _utils = __webpack_require__(7);

	var debug = (0, _debug2['default'])('thundercats:render');
	var assign = Object.assign;

	function fetch(fetchMap) {
	  if (!fetchMap || fetchMap.size === 0) {
	    debug('cat found empty fetch map');
	    return _rx2['default'].Observable['return']({
	      data: {},
	      fetchMap: fetchMap
	    });
	  }

	  var fetchCtx = _rx2['default'].Observable.from(fetchMap.values()).shareReplay();

	  var waitForStores = fetchCtx.pluck('store')
	  // store should have names
	  .filter(function (store) {
	    return !!(0, _utils.getNameOrNull)(store);
	  }).toArray().tap(function (arrayOfStores) {
	    return debug('waiting for %s stores', arrayOfStores.length);
	  }).flatMap(function (arrayOfStores) {
	    return _thundercatsLibWaitFor2['default'].apply(undefined, _toConsumableArray(arrayOfStores)).firstOrDefault();
	  });

	  var storeNames = fetchCtx.pluck('store').map(function (store) {
	    return (0, _utils.getName)(store);
	  });

	  var fetchObs = fetchCtx.map(function (_ref2) {
	    var action = _ref2.action;
	    var payload = _ref2.payload;
	    return { action: action, payload: payload };
	  }).tapOnNext(function () {
	    return debug('init individual fetchers');
	  }).tapOnNext(function (_ref3) {
	    var action = _ref3.action;
	    var payload = _ref3.payload;

	    action(payload);
	  }).tapOnCompleted(function () {
	    return debug('fetchers activated');
	  }).toArray();

	  return _rx2['default'].Observable.combineLatest(waitForStores, fetchObs.delaySubscription(50), function (data) {
	    return data;
	  }).flatMap(function (data) {
	    return _rx2['default'].Observable.from(data);
	  }).zip(storeNames, function (data, name) {
	    return _defineProperty({}, name, data);
	  }).reduce(function (accu, item) {
	    return assign({}, accu, item);
	  }, {}).map(function (data) {
	    return { data: data, fetchMap: fetchMap };
	  });
	}

	function RenderToObs(Comp, DOMContainer) {
	  return new _rx2['default'].AnonymousObservable(function (observer) {
	    var instance = null;
	    instance = _react2['default'].render(Comp, DOMContainer, function (err) {
	      /* istanbul ignore else */
	      if (err) {
	        return observer.onError(err);
	      }
	      /* istanbul ignore else */
	      if (instance) {
	        observer.onNext(instance);
	      }
	    });
	    observer.onNext(instance);
	  });
	}

	function Render(cat, Component, DOMContainer) {
	  return _rx2['default'].Observable.just(Component).map(function (Comp) {
	    return _ContextWrapper2['default'].wrap(Comp, cat);
	  }).flatMap(function (Burrito) {
	    return RenderToObs(Burrito, DOMContainer);
	  }, function (Burrito, inst) {
	    return inst;
	  });
	}

	function RenderToString(cat, Component) {
	  var fetchMap = new Map();
	  cat.fetchMap = fetchMap;
	  return _rx2['default'].Observable.just(Component).map(function (Comp) {
	    return _ContextWrapper2['default'].wrap(Comp, cat);
	  }).doOnNext(function (Burrito) {
	    debug('initiation fetcher registration');
	    _react2['default'].renderToStaticMarkup(Burrito);
	    debug('fetcher registration complete');
	  }).flatMap(function () {
	    return fetch(fetchMap);
	  }, function (Burrito, _ref4) {
	    var data = _ref4.data;
	    var fetchMap = _ref4.fetchMap;

	    return {
	      Burrito: Burrito,
	      data: data,
	      fetchMap: fetchMap
	    };
	  }).map(function (_ref5) {
	    var Burrito = _ref5.Burrito;
	    var data = _ref5.data;
	    var fetchMap = _ref5.fetchMap;

	    var markup = _react2['default'].renderToString(Burrito);
	    return {
	      markup: markup,
	      data: data,
	      fetchMap: fetchMap
	    };
	  }).firstOrDefault().tapOnNext(function () {
	    return cat.fetchMap = null;
	  });
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	exports.createContainer = createContainer;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _rx = __webpack_require__(1);

	var _rx2 = _interopRequireDefault(_rx);

	var _react = __webpack_require__(6);

	var _react2 = _interopRequireDefault(_react);

	var _invariant = __webpack_require__(3);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _debug = __webpack_require__(2);

	var _debug2 = _interopRequireDefault(_debug);

	var _utils = __webpack_require__(7);

	var __DEV__ = ("production") !== 'production';
	var debug = (0, _debug2['default'])('thundercats:container');
	var assign = Object.assign;

	function getChildContext(childContextTypes, currentContext) {

	  var compContext = assign({}, currentContext);
	  // istanbul ignore else
	  if (!childContextTypes || !childContextTypes.cat) {
	    delete compContext.cat;
	  }
	  return compContext;
	}

	function storeOnError(err) {
	  throw new Error('ThunderCats Store encountered an error: ' + err);
	}

	function storeOnCompleted() {
	  console.warn('Store has shutdown without error');
	}

	function verifyStore(displayName, storeName, store) {
	  /* istanbul ignore else */
	  if (__DEV__) {
	    (0, _invariant2['default'])((0, _utils.isObservable)(store) && typeof store.value === 'object', '%s should get at a store with a value but got %s for %s ' + 'with value %s', displayName, store, storeName, store && store.value);
	  }
	}

	function createContainer(options, Component) {
	  if (options === undefined) options = {};

	  /* istanbul ignore else */
	  if (!Component) {
	    return createContainer.bind(null, options);
	  }

	  var getPayload = typeof options.getPayload === 'function' ? options.getPayload : function () {};

	  /* istanbul ignore else */
	  if (__DEV__) {
	    (0, _invariant2['default'])(typeof Component === 'function', 'createContainer should get a constructor function but got %s', (0, _utils.getName)(Component) + 'Container');
	  }

	  return (function (_React$Component) {
	    _inherits(_class, _React$Component);

	    function _class(props, context) {
	      var _this = this;

	      _classCallCheck(this, _class);

	      _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).call(this, props, context);

	      /* istanbul ignore else */
	      if (__DEV__) {
	        (0, _invariant2['default'])(typeof context.cat === 'object', '%s should find an instance of the Cat in the context but got %s', (0, _utils.getName)(this), context.cat);
	      }

	      var cat = context.cat;
	      var val = {};

	      // set up observable state. This can be a single store or a combination of
	      // multiple stores
	      if (options.store) {
	        this.observableState = cat.getStore(options.store);
	        verifyStore((0, _utils.getName)(this), options.store, this.observableState);

	        if (typeof options.map === 'function') {
	          val = options.map(this.observableState.value);
	          this.observableState = this.observableState.map(options.map);
	        } else {
	          val = this.observableState.value;
	        }
	      } else if (options.stores) {
	        (function () {
	          var _Rx$Observable;

	          var storeNames = [].slice.call(options.stores);
	          var combineLatest = options.combineLatest;

	          /* istanbul ignore else */
	          if (__DEV__) {
	            (0, _invariant2['default'])(typeof combineLatest === 'function', '%s should get a function for options.combineLatest with ' + ' options.stores but got %s', (0, _utils.getName)(_this), combineLatest);
	          }

	          var stores = [];
	          var values = [];
	          storeNames.forEach(function (storeName) {
	            var store = cat.getStore(storeName);
	            verifyStore((0, _utils.getName)(_this), storeName, store);
	            stores.push(store);
	            values.push(store.value);
	          });

	          var args = stores.slice(0);
	          args.push(combineLatest);
	          _this.observableState = (_Rx$Observable = _rx2['default'].Observable).combineLatest.apply(_Rx$Observable, _toConsumableArray(args));

	          val = combineLatest.apply(undefined, values);
	        })();
	      }

	      /* istanbul ignore else */
	      if (__DEV__ && (options.store || options.stores)) {
	        (0, _invariant2['default'])((0, _utils.isObservable)(this.observableState), '%s should get at a store but found none for %s', (0, _utils.getName)(this), options.store || options.stores);
	      }

	      this.state = assign({}, val);

	      // set up actions on state. These will be passed down as props to child
	      if (options.actions) {
	        var actionsClassNames = Array.isArray(options.actions) ? options.actions : [options.actions];

	        actionsClassNames.forEach(function (name) {
	          _this.state[name] = cat.getActions(name);
	        });
	      }
	    }

	    _createClass(_class, [{
	      key: 'componentWillMount',
	      value: function componentWillMount() {
	        var cat = this.context.cat;

	        if (options.fetchAction) {
	          /* istanbul ignore else */
	          if (__DEV__) {
	            (0, _invariant2['default'])(options.fetchAction.split('.').length === 2, '%s fetch action should be in the form of ' + '`actionsClass.actionMethod` but was given %s', (0, _utils.getName)(this), options.fetchAction);

	            (0, _invariant2['default'])(typeof options.store === 'string' || typeof options.fetchWaitFor === 'string', '%s requires a store to wait for after fetch but was given %s', (0, _utils.getName)(this), options.store || options.fetchWaitFor);
	          }

	          var fetchActionsName = options.fetchAction.split('.')[0];
	          var fetchMethodName = options.fetchAction.split('.')[1];
	          var fetchActionsInst = cat.getActions(fetchActionsName);
	          var fetchStore = cat.getStore(options.store || options.fetchWaitFor);

	          /* istanbul ignore else */
	          if (__DEV__) {
	            (0, _invariant2['default'])(fetchActionsInst && fetchActionsInst[fetchMethodName], '%s expected to find actions class for %s, but found %s', (0, _utils.getName)(this), options.fetchAction, fetchActionsInst);

	            (0, _invariant2['default'])((0, _utils.isObservable)(fetchStore), '%s should get an observable but got %s for %s', (0, _utils.getName)(this), fetchStore, options.fetchWaitFor);
	          }

	          debug('cat returned %s for %s for %s', (0, _utils.getName)(fetchActionsInst), fetchActionsName, (0, _utils.getName)(this));

	          var action = fetchActionsInst[fetchMethodName];

	          if (cat.fetchMap) {
	            debug('%s getPayload in componentWillMount', (0, _utils.getName)(this));
	            var payload = getPayload(assign({}, this.state, this.props), getChildContext(Component.contextTypes, this.context));

	            cat.fetchMap.set(options.fetchAction, {
	              name: options.fetchAction,
	              payload: payload,
	              store: fetchStore,
	              action: action
	            });
	          } else {
	            options.action = action;
	          }
	        }
	        if (typeof options.subscribeOnWillMount === 'function' && options.subscribeOnWillMount()) {
	          debug('%s subscribing on will mount', (0, _utils.getName)(this));
	          this.subscribeToObservableState();
	        }
	      }
	    }, {
	      key: 'componentDidMount',
	      value: function componentDidMount() {
	        this.subscribeToObservableState();
	        /* istanbul ignore else */
	        if (options.action) {
	          debug('%s fetching on componentDidMount', (0, _utils.getName)(this));
	          options.action(getPayload(assign({}, this.state, this.props), getChildContext(Component.contextTypes, this.context)));
	        }
	      }
	    }, {
	      key: 'componentWillReceiveProps',
	      value: function componentWillReceiveProps(nextProps, nextContext) {
	        /* istanbul ignore else */
	        if (options.action && options.shouldContainerFetch && options.shouldContainerFetch(assign({}, this.state, this.props), assign({}, this.state, nextProps), this.context, nextContext)) {
	          debug('%s fetching on componentWillReceiveProps', (0, _utils.getName)(this));
	          options.action(getPayload(assign({}, this.state, nextProps), getChildContext(Component.contextTypes, nextContext)));
	        }
	      }
	    }, {
	      key: 'componentWillUnmount',
	      value: function componentWillUnmount() {
	        /* istanbul ignore else */
	        if (this.stateSubscription) {
	          debug('%s disposing store subscription', (0, _utils.getName)(this));
	          this.stateSubscription.dispose();
	          this.stateSubscription = null;
	        }
	      }
	    }, {
	      key: 'subscribeToObservableState',
	      value: function subscribeToObservableState() {
	        /* istanbul ignore else */
	        if (this.observableState && !this.stateSubscription) {
	          // Now that the component has mounted, we will use a long lived
	          // subscription
	          this.stateSubscription = this.observableState.subscribe(this.storeOnNext.bind(this), options.storeOnError || storeOnError, options.onCompleted || storeOnCompleted);
	        }
	      }
	    }, {
	      key: 'storeOnNext',
	      value: function storeOnNext(val) {
	        debug('%s value updating', (0, _utils.getName)(this), val);
	        this.setState(val);
	      }
	    }, {
	      key: 'render',
	      value: function render() {
	        return _react2['default'].createElement(Component, assign({}, this.state, this.props));
	      }
	    }], [{
	      key: 'contextTypes',
	      value: assign({}, Component.contextTypes || {}, { cat: _react.PropTypes.object.isRequired }),
	      enumerable: true
	    }, {
	      key: 'displayName',
	      value: Component.displayName + 'Container',
	      enumerable: true
	    }, {
	      key: 'propTypes',
	      value: Component.propTypes || {},
	      enumerable: true
	    }]);

	    return _class;
	  })(_react2['default'].Component);
	}

	var contain = createContainer;
	exports.contain = contain;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(13);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactContext
	 */

	'use strict';

	var assign = __webpack_require__(4);
	var emptyObject = __webpack_require__(19);
	var warning = __webpack_require__(5);

	var didWarn = false;

	/**
	 * Keeps track of the current context.
	 *
	 * The context is automatically passed down the component ownership hierarchy
	 * and is accessible via `this.context` on ReactCompositeComponents.
	 */
	var ReactContext = {

	  /**
	   * @internal
	   * @type {object}
	   */
	  current: emptyObject,

	  /**
	   * Temporarily extends the current context while executing scopedCallback.
	   *
	   * A typical use case might look like
	   *
	   *  render: function() {
	   *    var children = ReactContext.withContext({foo: 'foo'}, () => (
	   *
	   *    ));
	   *    return <div>{children}</div>;
	   *  }
	   *
	   * @param {object} newContext New context to merge into the existing context
	   * @param {function} scopedCallback Callback to run with the new context
	   * @return {ReactComponent|array<ReactComponent>}
	   */
	  withContext: function(newContext, scopedCallback) {
	    if (false) {
	      ("production" !== process.env.NODE_ENV ? warning(
	        didWarn,
	        'withContext is deprecated and will be removed in a future version. ' +
	        'Use a wrapper component with getChildContext instead.'
	      ) : null);

	      didWarn = true;
	    }

	    var result;
	    var previousContext = ReactContext.current;
	    ReactContext.current = assign({}, previousContext, newContext);
	    try {
	      result = scopedCallback();
	    } finally {
	      ReactContext.current = previousContext;
	    }
	    return result;
	  }

	};

	module.exports = ReactContext;


/***/ },
/* 15 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactCurrentOwner
	 */

	'use strict';

	/**
	 * Keeps track of the current owner.
	 *
	 * The current owner is the component who should own any components that are
	 * currently being constructed.
	 *
	 * The depth indicate how many composite components are above this render level.
	 */
	var ReactCurrentOwner = {

	  /**
	   * @internal
	   * @type {ReactComponent}
	   */
	  current: null

	};

	module.exports = ReactCurrentOwner;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactElement
	 */

	'use strict';

	var ReactContext = __webpack_require__(14);
	var ReactCurrentOwner = __webpack_require__(15);

	var assign = __webpack_require__(4);
	var warning = __webpack_require__(5);

	var RESERVED_PROPS = {
	  key: true,
	  ref: true
	};

	/**
	 * Warn for mutations.
	 *
	 * @internal
	 * @param {object} object
	 * @param {string} key
	 */
	function defineWarningProperty(object, key) {
	  Object.defineProperty(object, key, {

	    configurable: false,
	    enumerable: true,

	    get: function() {
	      if (!this._store) {
	        return null;
	      }
	      return this._store[key];
	    },

	    set: function(value) {
	      ( false ? warning(
	        false,
	        'Don\'t set the %s property of the React element. Instead, ' +
	        'specify the correct value when initially creating the element.',
	        key
	      ) : null);
	      this._store[key] = value;
	    }

	  });
	}

	/**
	 * This is updated to true if the membrane is successfully created.
	 */
	var useMutationMembrane = false;

	/**
	 * Warn for mutations.
	 *
	 * @internal
	 * @param {object} element
	 */
	function defineMutationMembrane(prototype) {
	  try {
	    var pseudoFrozenProperties = {
	      props: true
	    };
	    for (var key in pseudoFrozenProperties) {
	      defineWarningProperty(prototype, key);
	    }
	    useMutationMembrane = true;
	  } catch (x) {
	    // IE will fail on defineProperty
	  }
	}

	/**
	 * Base constructor for all React elements. This is only used to make this
	 * work with a dynamic instanceof check. Nothing should live on this prototype.
	 *
	 * @param {*} type
	 * @param {string|object} ref
	 * @param {*} key
	 * @param {*} props
	 * @internal
	 */
	var ReactElement = function(type, key, ref, owner, context, props) {
	  // Built-in properties that belong on the element
	  this.type = type;
	  this.key = key;
	  this.ref = ref;

	  // Record the component responsible for creating this element.
	  this._owner = owner;

	  // TODO: Deprecate withContext, and then the context becomes accessible
	  // through the owner.
	  this._context = context;

	  if (false) {
	    // The validation flag and props are currently mutative. We put them on
	    // an external backing store so that we can freeze the whole object.
	    // This can be replaced with a WeakMap once they are implemented in
	    // commonly used development environments.
	    this._store = {props: props, originalProps: assign({}, props)};

	    // To make comparing ReactElements easier for testing purposes, we make
	    // the validation flag non-enumerable (where possible, which should
	    // include every environment we run tests in), so the test framework
	    // ignores it.
	    try {
	      Object.defineProperty(this._store, 'validated', {
	        configurable: false,
	        enumerable: false,
	        writable: true
	      });
	    } catch (x) {
	    }
	    this._store.validated = false;

	    // We're not allowed to set props directly on the object so we early
	    // return and rely on the prototype membrane to forward to the backing
	    // store.
	    if (useMutationMembrane) {
	      Object.freeze(this);
	      return;
	    }
	  }

	  this.props = props;
	};

	// We intentionally don't expose the function on the constructor property.
	// ReactElement should be indistinguishable from a plain object.
	ReactElement.prototype = {
	  _isReactElement: true
	};

	if (false) {
	  defineMutationMembrane(ReactElement.prototype);
	}

	ReactElement.createElement = function(type, config, children) {
	  var propName;

	  // Reserved names are extracted
	  var props = {};

	  var key = null;
	  var ref = null;

	  if (config != null) {
	    ref = config.ref === undefined ? null : config.ref;
	    key = config.key === undefined ? null : '' + config.key;
	    // Remaining properties are added to a new props object
	    for (propName in config) {
	      if (config.hasOwnProperty(propName) &&
	          !RESERVED_PROPS.hasOwnProperty(propName)) {
	        props[propName] = config[propName];
	      }
	    }
	  }

	  // Children can be more than one argument, and those are transferred onto
	  // the newly allocated props object.
	  var childrenLength = arguments.length - 2;
	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    var childArray = Array(childrenLength);
	    for (var i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 2];
	    }
	    props.children = childArray;
	  }

	  // Resolve default props
	  if (type && type.defaultProps) {
	    var defaultProps = type.defaultProps;
	    for (propName in defaultProps) {
	      if (typeof props[propName] === 'undefined') {
	        props[propName] = defaultProps[propName];
	      }
	    }
	  }

	  return new ReactElement(
	    type,
	    key,
	    ref,
	    ReactCurrentOwner.current,
	    ReactContext.current,
	    props
	  );
	};

	ReactElement.createFactory = function(type) {
	  var factory = ReactElement.createElement.bind(null, type);
	  // Expose the type on the factory and the prototype so that it can be
	  // easily accessed on elements. E.g. <Foo />.type === Foo.type.
	  // This should not be named `constructor` since this may not be the function
	  // that created the element, and it may not even be a constructor.
	  // Legacy hook TODO: Warn if this is accessed
	  factory.type = type;
	  return factory;
	};

	ReactElement.cloneAndReplaceProps = function(oldElement, newProps) {
	  var newElement = new ReactElement(
	    oldElement.type,
	    oldElement.key,
	    oldElement.ref,
	    oldElement._owner,
	    oldElement._context,
	    newProps
	  );

	  if (false) {
	    // If the key on the original is valid, then the clone is valid
	    newElement._store.validated = oldElement._store.validated;
	  }
	  return newElement;
	};

	ReactElement.cloneElement = function(element, config, children) {
	  var propName;

	  // Original props are copied
	  var props = assign({}, element.props);

	  // Reserved names are extracted
	  var key = element.key;
	  var ref = element.ref;

	  // Owner will be preserved, unless ref is overridden
	  var owner = element._owner;

	  if (config != null) {
	    if (config.ref !== undefined) {
	      // Silently steal the ref from the parent.
	      ref = config.ref;
	      owner = ReactCurrentOwner.current;
	    }
	    if (config.key !== undefined) {
	      key = '' + config.key;
	    }
	    // Remaining properties override existing props
	    for (propName in config) {
	      if (config.hasOwnProperty(propName) &&
	          !RESERVED_PROPS.hasOwnProperty(propName)) {
	        props[propName] = config[propName];
	      }
	    }
	  }

	  // Children can be more than one argument, and those are transferred onto
	  // the newly allocated props object.
	  var childrenLength = arguments.length - 2;
	  if (childrenLength === 1) {
	    props.children = children;
	  } else if (childrenLength > 1) {
	    var childArray = Array(childrenLength);
	    for (var i = 0; i < childrenLength; i++) {
	      childArray[i] = arguments[i + 2];
	    }
	    props.children = childArray;
	  }

	  return new ReactElement(
	    element.type,
	    key,
	    ref,
	    owner,
	    element._context,
	    props
	  );
	};

	/**
	 * @param {?object} object
	 * @return {boolean} True if `object` is a valid component.
	 * @final
	 */
	ReactElement.isValidElement = function(object) {
	  // ReactTestUtils is often used outside of beforeEach where as React is
	  // within it. This leads to two different instances of React on the same
	  // page. To identify a element from a different React instance we use
	  // a flag instead of an instanceof check.
	  var isElement = !!(object && object._isReactElement);
	  // if (isElement && !(object instanceof ReactElement)) {
	  // This is an indicator that you're using multiple versions of React at the
	  // same time. This will screw with ownership and stuff. Fix it, please.
	  // TODO: We could possibly warn here.
	  // }
	  return isElement;
	};

	module.exports = ReactElement;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ReactPropTransferer
	 */

	'use strict';

	var assign = __webpack_require__(4);
	var emptyFunction = __webpack_require__(8);
	var joinClasses = __webpack_require__(20);

	/**
	 * Creates a transfer strategy that will merge prop values using the supplied
	 * `mergeStrategy`. If a prop was previously unset, this just sets it.
	 *
	 * @param {function} mergeStrategy
	 * @return {function}
	 */
	function createTransferStrategy(mergeStrategy) {
	  return function(props, key, value) {
	    if (!props.hasOwnProperty(key)) {
	      props[key] = value;
	    } else {
	      props[key] = mergeStrategy(props[key], value);
	    }
	  };
	}

	var transferStrategyMerge = createTransferStrategy(function(a, b) {
	  // `merge` overrides the first object's (`props[key]` above) keys using the
	  // second object's (`value`) keys. An object's style's existing `propA` would
	  // get overridden. Flip the order here.
	  return assign({}, b, a);
	});

	/**
	 * Transfer strategies dictate how props are transferred by `transferPropsTo`.
	 * NOTE: if you add any more exceptions to this list you should be sure to
	 * update `cloneWithProps()` accordingly.
	 */
	var TransferStrategies = {
	  /**
	   * Never transfer `children`.
	   */
	  children: emptyFunction,
	  /**
	   * Transfer the `className` prop by merging them.
	   */
	  className: createTransferStrategy(joinClasses),
	  /**
	   * Transfer the `style` prop (which is an object) by merging them.
	   */
	  style: transferStrategyMerge
	};

	/**
	 * Mutates the first argument by transferring the properties from the second
	 * argument.
	 *
	 * @param {object} props
	 * @param {object} newProps
	 * @return {object}
	 */
	function transferInto(props, newProps) {
	  for (var thisKey in newProps) {
	    if (!newProps.hasOwnProperty(thisKey)) {
	      continue;
	    }

	    var transferStrategy = TransferStrategies[thisKey];

	    if (transferStrategy && TransferStrategies.hasOwnProperty(thisKey)) {
	      transferStrategy(props, thisKey, newProps[thisKey]);
	    } else if (!props.hasOwnProperty(thisKey)) {
	      props[thisKey] = newProps[thisKey];
	    }
	  }
	  return props;
	}

	/**
	 * ReactPropTransferer are capable of transferring props to another component
	 * using a `transferPropsTo` method.
	 *
	 * @class ReactPropTransferer
	 */
	var ReactPropTransferer = {

	  /**
	   * Merge two props objects using TransferStrategies.
	   *
	   * @param {object} oldProps original props (they take precedence)
	   * @param {object} newProps new props to merge in
	   * @return {object} a new object containing both sets of props merged.
	   */
	  mergeProps: function(oldProps, newProps) {
	    return transferInto(assign({}, oldProps), newProps);
	  }

	};

	module.exports = ReactPropTransferer;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @typechecks static-only
	 * @providesModule cloneWithProps
	 */

	'use strict';

	var ReactElement = __webpack_require__(16);
	var ReactPropTransferer = __webpack_require__(17);

	var keyOf = __webpack_require__(21);
	var warning = __webpack_require__(5);

	var CHILDREN_PROP = keyOf({children: null});

	/**
	 * Sometimes you want to change the props of a child passed to you. Usually
	 * this is to add a CSS class.
	 *
	 * @param {ReactElement} child child element you'd like to clone
	 * @param {object} props props you'd like to modify. className and style will be
	 * merged automatically.
	 * @return {ReactElement} a clone of child with props merged in.
	 */
	function cloneWithProps(child, props) {
	  if (false) {
	    ("production" !== process.env.NODE_ENV ? warning(
	      !child.ref,
	      'You are calling cloneWithProps() on a child with a ref. This is ' +
	      'dangerous because you\'re creating a new child which will not be ' +
	      'added as a ref to its parent.'
	    ) : null);
	  }

	  var newProps = ReactPropTransferer.mergeProps(props, child.props);

	  // Use `child.props.children` if it is provided.
	  if (!newProps.hasOwnProperty(CHILDREN_PROP) &&
	      child.props.hasOwnProperty(CHILDREN_PROP)) {
	    newProps.children = child.props.children;
	  }

	  // The current API doesn't retain _owner and _context, which is why this
	  // doesn't use ReactElement.cloneAndReplaceProps.
	  return ReactElement.createElement(child.type, newProps);
	}

	module.exports = cloneWithProps;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule emptyObject
	 */

	"use strict";

	var emptyObject = {};

	if (false) {
	  Object.freeze(emptyObject);
	}

	module.exports = emptyObject;


/***/ },
/* 20 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule joinClasses
	 * @typechecks static-only
	 */

	'use strict';

	/**
	 * Combines multiple className strings into one.
	 * http://jsperf.com/joinclasses-args-vs-array
	 *
	 * @param {...?string} classes
	 * @return {string}
	 */
	function joinClasses(className/*, ... */) {
	  if (!className) {
	    className = '';
	  }
	  var nextClass;
	  var argLength = arguments.length;
	  if (argLength > 1) {
	    for (var ii = 1; ii < argLength; ii++) {
	      nextClass = arguments[ii];
	      if (nextClass) {
	        className = (className ? className + ' ' : '') + nextClass;
	      }
	    }
	  }
	  return className;
	}

	module.exports = joinClasses;


/***/ },
/* 21 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule keyOf
	 */

	/**
	 * Allows extraction of a minified key. Let's the build system minify keys
	 * without loosing the ability to dynamically use key strings as values
	 * themselves. Pass in an object with a single key/val pair and it will return
	 * you the string key of that single record. Suppose you want to grab the
	 * value for a key 'className' inside of an object. Key/val minification may
	 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
	 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
	 * reuse those resolutions.
	 */
	var keyOf = function(oneKeyObj) {
	  var key;
	  for (key in oneKeyObj) {
	    if (!oneKeyObj.hasOwnProperty(key)) {
	      continue;
	    }
	    return key;
	  }
	  return null;
	};


	module.exports = keyOf;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.areObservable = areObservable;
	exports.createObjectValidator = createObjectValidator;
	exports.getName = getName;
	exports.getNameOrNull = getNameOrNull;
	exports.isObservable = isObservable;
	exports.isPromise = isPromise;
	exports.isKitten = isKitten;
	exports.isStore = isStore;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _rx = __webpack_require__(1);

	var _invariant = __webpack_require__(3);

	var _invariant2 = _interopRequireDefault(_invariant);

	var isFunction = _rx.helpers.isFunction;
	exports.isFunction = isFunction;
	var __DEV__ = ("production") !== 'production';

	exports.__DEV__ = __DEV__;

	function areObservable(observables) {
	  return Array.isArray(observables) && observables.length > 0 && observables.reduce(function (bool, observable) {
	    return bool && isObservable(observable);
	  }, true);
	}

	function createObjectValidator(message) {
	  return function (obj) {
	    /* istanbul ignore else */
	    if (__DEV__) {
	      (0, _invariant2['default'])(obj && typeof obj === 'object', message, obj);
	    }
	  };
	}

	function getName(comp) {
	  return '' + (getNameOrNull(comp) || 'Anonymous');
	}

	function getNameOrNull(comp) {
	  return !!comp && (comp && comp.displayName || comp.constructor && comp.constructor.displayName || comp.fixed && comp.fixed.refs && comp.fixed.refs.displayName) || null;
	}

	function isObservable(observable) {
	  return observable && typeof observable.subscribe === 'function';
	}

	function isPromise(promise) {
	  return promise && typeof promise.then === 'function';
	}

	function isKitten(obj) {
	  return !!(obj && isFunction(obj.register) && isFunction(obj.getStore) && isFunction(obj.getActions));
	}

	function isStore(obj) {
	  return !!(obj && isFunction(obj.createRegistrar) && isFunction(obj.fromMany) && isFunction(obj.replacer) && isFunction(obj.setter) && isFunction(obj.transformer));
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// # Wait For Utility
	//
	// Takes observables for arguments,
	// converts them to hot observables
	// then waits for each one to publish a value
	//
	// returns an observable.
	//
	// *Note:* it's good practice to use a firstOrDefault
	// observable if you just want a short lived subscription
	// and a timeout if you don't want to wait forever!
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = waitFor;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _rx = __webpack_require__(1);

	var _rx2 = _interopRequireDefault(_rx);

	var _debug = __webpack_require__(2);

	var _debug2 = _interopRequireDefault(_debug);

	var _utils = __webpack_require__(22);

	var debug = (0, _debug2['default'])('thundercats:waitFor');
	var slice = Array.prototype.slice;

	function waitFor() {
	  return _rx2['default'].Observable.from(arguments).tapOnNext(function (observable) {
	    return (0, _utils.isObservable)(observable) ? true : new Error('waitFor only take observables but got %s', observable);
	  }).map(function (observable) {
	    return observable.publish();
	  }).tapOnNext(function (observable) {
	    return observable.connect();
	  }).toArray().tap(function () {
	    return debug('starting waitFor');
	  }).flatMap(function (arrayOfObservables) {
	    return _rx2['default'].Observable.combineLatest(arrayOfObservables, function () {
	      return slice.call(arguments);
	    });
	  }).doOnNext(function () {
	    return debug('waitFor onNext!');
	  });
	}

	module.exports = exports['default'];

/***/ }
/******/ ])
});
;