import EventDispatcher from 'eventdispatcher';
import assign from 'object-assign';
import isPlainObj from 'is-plain-obj';
import {objToDot} from './utils';
import {get, set, insert, push, del, has } from 'object-path';



export class Store {

  constructor(initialState = {}) {
    this.dispatcher = new EventDispatcher();
    this.state = assign({}, initialState);
    this.stateClone = assign({}, this.state);
  }

  __update(nextState, partial, pathValue) {
    this.prevState = assign({}, this.state);
    this.state = assign({}, nextState);
    this.stateClone = assign({}, this.state);

    this.dispatcher.trigger('update', { state: this.getState(), payload:partial });

    if(pathValue){
      const paths = Object.keys(pathValue);
      for (let i = 0, l = paths.length; i < l; i++) {
        // console.log('trigger', paths[i], pathValue[paths[i]]);
        this.dispatcher.trigger(paths[i], {
          key: paths[i],
          value: pathValue[paths[i]],
          state: this.getState(),
        });
      }
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

  // ensureExists(path, value) {
  //   return this.set(path, value, true);
  // }

  get(key, fallback = null) {
    return get(this.getState(), key, fallback);
  }

  set(...args) {

    const state = this.getState();
    let partial = {};
    let pathValue = {};
    if(args.length === 2 && (typeof args[0] === 'string')){
      set(state, args[0], args[1]);
      set(partial, args[0], args[1]);
      pathValue[args[0]] = args[1];
    }else if(args.length === 1 && isPlainObj(args[0])){
      const paths = objToDot(args[0]);
      const keys = Object.keys(paths);
      for(let i = 0, l = keys.length; i < l; i++) {
        pathValue[keys[i]] = paths[keys[i]];
        set(state, keys[i], paths[keys[i]]);
      }

      partial = assign({}, args[0]);

    }

    this.__update(state, partial, pathValue);
  }

  has(key) {
    return has(this.getState(), key);
  }

  delete(key) {
    const partial = get(this.getState(), key);
    del(this.getState(), key);
    this.__update(this.getState(), partial);
    this.dispatcher.trigger(key, { state: this.getState(), payload:null });
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
