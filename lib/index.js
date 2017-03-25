'use strict';

exports.__esModule = true;
exports.store = exports.Store = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _eventdispatcher = require('eventdispatcher');

var _eventdispatcher2 = _interopRequireDefault(_eventdispatcher);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _isPlainObj = require('is-plain-obj');

var _isPlainObj2 = _interopRequireDefault(_isPlainObj);

var _utils = require('./utils');

var _objectPath = require('object-path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Store = exports.Store = function () {
  function Store() {
    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Store);

    this.dispatcher = new _eventdispatcher2.default();
    this.state = (0, _objectAssign2.default)({}, initialState);
    this.stateClone = (0, _objectAssign2.default)({}, this.state);
  }

  Store.prototype.__update = function __update(nextState, partial, pathValue) {
    this.prevState = (0, _objectAssign2.default)({}, this.state);
    this.state = (0, _objectAssign2.default)({}, nextState);
    this.stateClone = (0, _objectAssign2.default)({}, this.state);

    this.dispatcher.trigger('update', { state: this.getState(), payload: partial });

    if (pathValue) {
      var paths = Object.keys(pathValue);
      for (var i = 0, l = paths.length; i < l; i++) {
        // console.log('trigger', paths[i], pathValue[paths[i]]);
        this.dispatcher.trigger(paths[i], {
          key: paths[i],
          value: pathValue[paths[i]],
          state: this.getState()
        });
      }
    }
    return this.stateClone;
  };

  Store.prototype.getState = function getState() {
    return this.stateClone;
  };

  Store.prototype.getPrevState = function getPrevState() {
    return this.prevState;
  };

  Store.prototype.subscribe = function subscribe(key, handler) {
    this.dispatcher.on(key, handler);
  };

  // ensureExists(path, value) {
  //   return this.set(path, value, true);
  // }

  Store.prototype.get = function get(key) {
    var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    return (0, _objectPath.get)(this.getState(), key, fallback);
  };

  Store.prototype.set = function set() {

    var state = this.getState();
    var partial = {};
    var pathValue = {};

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length === 2 && typeof args[0] === 'string') {
      (0, _objectPath.set)(state, args[0], args[1]);
      (0, _objectPath.set)(partial, args[0], args[1]);
      pathValue[args[0]] = args[1];
    } else if (args.length === 1 && (0, _isPlainObj2.default)(args[0])) {
      var paths = (0, _utils.objToDot)(args[0]);
      var keys = Object.keys(paths);
      for (var i = 0, l = keys.length; i < l; i++) {
        pathValue[keys[i]] = paths[keys[i]];
        (0, _objectPath.set)(state, keys[i], paths[keys[i]]);
      }

      partial = (0, _objectAssign2.default)({}, args[0]);
    }

    this.__update(state, partial, pathValue);
  };

  Store.prototype.has = function has(key) {
    return (0, _objectPath.has)(this.getState(), key);
  };

  Store.prototype.delete = function _delete(key) {
    var partial = (0, _objectPath.get)(this.getState(), key);
    (0, _objectPath.del)(this.getState(), key);
    this.__update(this.getState(), partial);
    this.dispatcher.trigger(key, { state: this.getState(), payload: null });
  };

  Store.prototype.clone = function clone() {
    return state(this.cloneState());
  };

  Store.prototype.cloneState = function cloneState() {
    return JSON.parse(this.toJSON());
  };

  Store.prototype.toJSON = function toJSON() {
    return JSON.stringify(this.getState(), null, 2);
  };

  (0, _createClass3.default)(Store, [{
    key: 'size',
    get: function get() {
      return Object.keys(this.state).length;
    }
  }]);
  return Store;
}();

var store = function store() {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var newStore = new Store(initialState);
  return {
    getState: newStore.getState.bind(newStore),
    getPrevState: newStore.getPrevState.bind(newStore),
    subscribe: newStore.subscribe.bind(newStore),
    get: newStore.get.bind(newStore),
    set: newStore.set.bind(newStore),
    has: newStore.has.bind(newStore),
    delete: newStore.delete.bind(newStore),
    clone: newStore.clone.bind(newStore),
    size: newStore.size,
    toJSON: newStore.toJSON.bind(newStore)
  };
};

exports.store = store;
exports.default = store;
// export const subscriber = (store) => {
//   const { subscribe, get, getState, getPrevState } = store;
//   return {
//     subscribe,
//     get,
//     getState,
//     getPrevState
//   }
// }
// export const select = (keyValue) => {
//   const props = Object.keys(keyValue);
//   for (let i = 0, l = props.length; i < l; i++) {
//     this.trigger(props[i], { prop: props[i], value: get(stateClone, props[i]), state: stateClone });
//   }
// }