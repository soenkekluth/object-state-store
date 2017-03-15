import EventDispatcher from 'eventdispatcher/core';
import assign from 'object-assign';
import isPlainObj from 'is-plain-obj';
import { get, set, insert, push, del, has } from 'object-path';

// @autobind
export class Store {

  constructor(initialState = {}) {
    this.dispatcher = new EventDispatcher();
    this.state = assign({}, initialState);
    this.stateClone = assign({}, this.state);
  }

  update(nextState) {
    this.prevState = assign({}, this.state);
    this.state = assign({}, this.state, nextState);
    this.stateClone = assign({}, this.state);

    this.dispatcher.trigger('state:update', { state: this.getState() });

    const props = Object.keys(nextState);
    for (let i = 0, l = props.length; i < l; i++) {
      this.dispatcher.trigger(props[i], {
        key: props[i],
        value: this.get(props[i]),
        state: this.getState(),
      });
    }
    return this.stateClone;
  }

  getState() {
    return this.stateClone;
  }

  getPrevState() {
    return this.prevState;
  }

  subscribe(key, handler) {
    this.dispatcher.on(key, handler);
  }

  get(key, fallback = null) {
    return get(this.getState(), key, fallback);
  }

  set(keyOrObject, value = null) {
    if(isPlainObj(keyOrObject) && !value){
      return this.update(keyOrObject);
    }
    if(typeof keyOrObject === 'string' && value) {
      return this.update(keyOrObject);
    }
  }

  has(key) {
    return has(this.getState(), key);
  }

  delete(key) {
    del(this.getState(), key);
    this.update(this.getState());
  }


  clone() {
    return state(this.cloneState());
  }

  cloneState() {
    return JSON.parse(this.toJSON());
  }

  toJSON() {
    return JSON.stringify(this.getState(), null, 2);
  }


  get size() {
    return Object.keys(this.state).length;
  }
}

const store = (initialState = {}) => {
  const newStore = new Store(initialState);
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
    toJSON: newStore.toJSON.bind(newStore),
    // toJSONString: newStore.toJSONString.bind(newStore),
  };
};


export { store };
export default store;
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
