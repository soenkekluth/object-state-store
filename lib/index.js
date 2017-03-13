'use strict';

exports.__esModule = true;
exports.store = exports.Store = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('eventdispatcher/core');

var _core2 = _interopRequireDefault(_core);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _isPlainObj = require('is-plain-obj');

var _isPlainObj2 = _interopRequireDefault(_isPlainObj);

var _objectPath = require('object-path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// @autobind
var Store = exports.Store = function () {
  function Store() {
    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Store);

    this.dispatcher = new _core2.default();
    this.state = (0, _objectAssign2.default)({}, initialState);
    this.stateClone = (0, _objectAssign2.default)({}, this.state);
  }

  Store.prototype.update = function update(nextState) {
    this.prevState = (0, _objectAssign2.default)({}, this.state);
    this.state = (0, _objectAssign2.default)({}, this.state, nextState);
    this.stateClone = (0, _objectAssign2.default)({}, this.state);

    this.dispatcher.trigger('state:update', { state: this.getState() });

    var props = Object.keys(nextState);
    for (var i = 0, l = props.length; i < l; i++) {
      this.dispatcher.trigger(props[i], {
        prop: props[i],
        value: this.get(props[i]),
        state: this.getState()
      });
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

  Store.prototype.get = function get(key) {
    var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    return (0, _objectPath.get)(this.getState(), key, fallback);
  };

  Store.prototype.set = function set(keyOrObject) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if ((0, _isPlainObj2.default)(keyOrObject) && !value) {
      return this.update(keyOrObject);
    }
    if (typeof keyOrObject === 'string' && value) {
      return this.update(keyOrObject);
    }
  };

  Store.prototype.has = function has(key) {
    return (0, _objectPath.has)(this.getState(), key);
  };

  Store.prototype.delete = function _delete(key) {
    (0, _objectPath.del)(this.getState(), key);
    this.update(this.getState());
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

  _createClass(Store, [{
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
    get: newStore.getState.bind(newStore),
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
