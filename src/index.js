import MicroDispatch from 'microdispatch';
import assign from 'object-assign';
import isPlainObj from 'is-plain-obj';
import {objToDot, dotToObj} from './utils';
import objectPath from 'object-path';

const {get, set, insert, push, del, has, empty } = objectPath;

export class Store {

  constructor(initialState = {}) {
    this.emitter = new MicroDispatch(this);
    this.state = assign({}, initialState);
    this.stateClone = assign({}, this.state);
  }

  setState(nextState, partial, pathValue) {
    this.prevState = assign({}, this.state);
    this.state = assign({}, nextState);
    this.stateClone = assign({}, this.state);
    this.emitter.emit('update', { state: this.getState(), payload:partial });

    if(pathValue){
      const paths = Object.keys(pathValue);
      for (let i = 0, l = paths.length; i < l; i++) {
        // console.log('emit', paths[i], pathValue[paths[i]]);
        this.emitter.emit(paths[i], {
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
    this.emitter.on(key, handler);
    return () => this.unsubscribe(key, handler);
  }

  unsubscribe(key, handler){
    this.emitter.off(key, handler);
  }

  // ensureExists(path, value) {
  //   return this.set(path, value, true);
  // }

  empty(key) {
    const state = this.getState();
    let path = objToDot(key);
    empty(state, path);
    this.setState(state, get(state, path), {path:null });
    // this.setState(state);
    // this.emitter.emit(path, { state: this.getState(), payload:this.get(path) });
  }

  // ensureExists(key, value) {

  // }

  push(key, ...values){
    const state = this.getState();
    let path = objToDot(key);
    push(state, path, ...values);
    this.setState(state, get(state, path), {path:values });
    // this.emitter.emit(path, { state: this.getState(), payload:this.get(path) });
  }

  insert(key, value, index= 0) {
    const state = this.getState();
    let path = objToDot(key);
    insert(state, path, value, index);
    this.setState(state, get(state, path), {path:value });

    // this.emitter.emit(path, { state: this.getState(), payload:this.get(path) });
  }

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

    this.setState(state, partial, pathValue);
  }

  has(key) {
    return has(this.state, key);
  }

  delete(key) {
    const state = this.getState();
    const partial = get(state, key);
    del(state, key);
    this.setState(state, partial);
    this.emitter.emit(key, { state: this.getState(), payload:null });
  }

  clone() {
    return new Store(this.cloneState());
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
    unsubscribe: newStore.unsubscribe.bind(newStore),
    get: newStore.get.bind(newStore),
    set: newStore.set.bind(newStore),
    has: newStore.has.bind(newStore),
    delete: newStore.delete.bind(newStore),
    empty: newStore.empty.bind(newStore),
    push:newStore.push.bind(newStore),
    insert:newStore.insert.bind(newStore),
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
//     this.emit(props[i], { prop: props[i], value: get(stateClone, props[i]), state: stateClone });
//   }
// }
